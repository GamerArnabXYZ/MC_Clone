#include "SSL.h"
#include "Errors.h"

#if CC_SSL_BACKEND == CC_SSL_BACKEND_BEARSSL
#include "String_.h"
#include "../third_party/bearssl/bearssl.h"
#include "../misc/certs/certs.h"
#ifdef CC_BUILD_ANDROID
#include "android/interop_android.h"
#endif

// https://github.com/unkaktus/bearssl/blob/master/samples/client_basic.c#L283
#define SSL_ERROR_SHIFT 0xB5510000

typedef struct SSLContext {
	br_x509_minimal_context xc;
	br_ssl_client_context sc;
	struct X509CertContext x509;
	unsigned char iobuf[BR_SSL_BUFSIZE_BIDI];
	br_sslio_context ioc;
	cc_result readError, writeError;
	cc_socket socket;
} SSLContext;
static cc_bool _verifyCerts;

static void x509_start_cert(const br_x509_class** ctx, uint32_t length) {
	struct SSLContext* ssl = (struct SSLContext*)ctx;

	br_x509_minimal_vtable.start_cert(ctx, length);
	Certs_BeginCert(&ssl->x509, length);
}

static void x509_append(const br_x509_class** ctx, const unsigned char* buf, size_t len) {
	struct SSLContext* ssl = (struct SSLContext*)ctx;

	br_x509_minimal_vtable.append(ctx, buf, len);
	Certs_AppendCert(&ssl->x509, buf, len);
}

static void x509_end_cert(const br_x509_class** ctx) {
	struct SSLContext* ssl = (struct SSLContext*)ctx;

	br_x509_minimal_vtable.end_cert(ctx);
	Certs_FinishCert(&ssl->x509);
}

static void x509_start_chain(const br_x509_class** ctx, const char* server_name) {
	struct SSLContext* ssl = (struct SSLContext*)ctx;

	br_x509_minimal_vtable.start_chain(ctx, server_name);
	Certs_BeginChain(&ssl->x509);
}

static unsigned x509_maybe_skip_verify(unsigned r) {
	/* User selected to not care about certificate authenticity */
	if (r == BR_ERR_X509_NOT_TRUSTED && !_verifyCerts) return 0;

	return r;
}

static unsigned x509_maybe_system_verify(struct SSLContext* ssl, unsigned r) {
	/* Only fallback to system verification for potentially untrusted certificate case */
	/* This ensures consistent validation behaviour in other cases between all platforms */
	if (r != BR_ERR_X509_NOT_TRUSTED) return r;
	if (!ssl->x509.numCerts)          return r;

	if (Certs_VerifyChain(&ssl->x509) == 0) r = 0;
	return r;
}

static unsigned x509_end_chain(const br_x509_class** ctx) {
	struct SSLContext* ssl = (struct SSLContext*)ctx;
	
	unsigned r = br_x509_minimal_vtable.end_chain(ctx);
	r = x509_maybe_skip_verify(r);
	r = x509_maybe_system_verify(ssl, r);

	Certs_FreeChain(&ssl->x509);
	return r;
}

static const br_x509_pkey* x509_get_pkey(const br_x509_class*const* ctx, unsigned* usages) {
	return br_x509_minimal_vtable.get_pkey(ctx, usages);
}

static const br_x509_class cert_verifier_vtable = {
	sizeof(br_x509_minimal_context),
	x509_start_chain,
	x509_start_cert,
	x509_append,
	x509_end_cert,
	x509_end_chain,
	x509_get_pkey
};

void SSLBackend_Init(cc_bool verifyCerts) {
	_verifyCerts = verifyCerts;
	CertsBackend_Init();
}

cc_bool SSLBackend_DescribeError(cc_result res, cc_string* dst) {
	switch (res) {
	case SSL_ERROR_SHIFT | BR_ERR_X509_EXPIRED:
		String_AppendConst(dst, "The website's SSL certificate is expired or not yet valid");
		return true;
	case SSL_ERROR_SHIFT | BR_ERR_X509_NOT_TRUSTED:
		String_AppendConst(dst, "The website's SSL certificate was issued by an authority that is not trusted");
		return true;
	}
	return false; // TODO: error codes 
}

static void InjectEntropy(SSLContext* ctx) {
	char buf[32];
	cc_result res = Platform_GetEntropy(buf, 32);
	if (res) Platform_LogConst("SSL: Using insecure uninitialised stack data for entropy");

	br_ssl_engine_inject_entropy(&ctx->sc.eng, buf, 32);
}

static int ssl_time_check_callback(void* ctx,
	uint32_t not_before_days, uint32_t not_before_secs,
	uint32_t not_after_days,  uint32_t not_after_secs) 
{
#ifdef CC_BUILD_CONSOLE
	/* It's fairly common for RTC on older console systems to not be set correctly */
	return 0;
#else
	cc_uint64 cur = DateTime_CurrentUTC();
	uint32_t days = (uint32_t)(cur / 86400) + 366;
	uint32_t secs = (uint32_t)(cur % 86400);

	/* This matches bearssl's default time calculation:
		time_t x = time(NULL);
		vd = (uint32_t)(x / 86400) + 719528;
		vs = (uint32_t)(x % 86400);
	*/

	if (days < not_before_days || (days == not_before_days && secs < not_before_secs)) return -1;
	if (days > not_after_days  || (days == not_after_days  && secs > not_after_secs))  return  1;

	return 0;
#endif
}

static int sock_read(void* ctx_, unsigned char* buf, size_t len) {
	SSLContext* ctx = (SSLContext*)ctx_;
	cc_uint32 read;
	cc_result res = Socket_Read(ctx->socket, buf, len, &read);
	
	if (res) { ctx->readError = res; return -1; }
	return read;
}

static int sock_write(void* ctx_, const unsigned char* buf, size_t len) {
	SSLContext* ctx = (SSLContext*)ctx_;
	cc_uint32 wrote;
	cc_result res = Socket_Write(ctx->socket, buf, len, &wrote);
	
	if (res) { ctx->writeError = res; return -1; }
	return wrote;
}

cc_result SSL_Init(cc_socket socket, const cc_string* host_, void** out_ctx) {
	SSLContext* ctx;
	char host[NATIVE_STR_LEN];
	String_EncodeUtf8(host, host_);
	
	ctx = (SSLContext*)Mem_TryAlloc(1, sizeof(SSLContext));
	if (!ctx) return ERR_OUT_OF_MEMORY;
	*out_ctx = (void*)ctx;
	
#if defined CC_BUILD_SYMBIAN
	{
		TAs[3].pkey.key.ec.curve = BR_EC_secp384r1;
		TAs[3].pkey.key.ec.q = (unsigned char *)TA3_EC_Q;
		TAs[3].pkey.key.ec.qlen = sizeof TA3_EC_Q;
		
		TAs[6].pkey.key.ec.curve = BR_EC_secp384r1;
		TAs[6].pkey.key.ec.q = (unsigned char *)TA6_EC_Q;
		TAs[6].pkey.key.ec.qlen = sizeof TA6_EC_Q;
	}
#endif
	
	br_ssl_client_init_full(&ctx->sc, &ctx->xc, TAs, TAs_NUM);
	InjectEntropy(ctx);
	br_x509_minimal_set_time_callback(&ctx->xc, NULL, ssl_time_check_callback);
	ctx->socket = socket;

	br_ssl_engine_set_buffer(&ctx->sc.eng, ctx->iobuf, sizeof(ctx->iobuf), 1);
	br_ssl_client_reset(&ctx->sc, host, 0);
	ctx->xc.vtable = &cert_verifier_vtable;
	
	
	br_sslio_init(&ctx->ioc, &ctx->sc.eng, 
			sock_read,  ctx, 
			sock_write, ctx);
			
	ctx->readError  = 0;
	ctx->writeError = 0;
	
	return 0;
}

static CC_NOINLINE cc_result SSL_GetError(SSLContext* ctx) {
	int err;
	if (ctx->writeError) return ctx->writeError;
	if (ctx->readError)  return ctx->readError;
		
	// TODO session resumption, proper connection closing ??
	err = br_ssl_engine_last_error(&ctx->sc.eng);
	if (err == 0 && br_ssl_engine_current_state(&ctx->sc.eng) == BR_SSL_CLOSED)
		return SSL_ERR_CONTEXT_DEAD;
		
	return SSL_ERROR_SHIFT | (err & 0xFFFF);
}

cc_result SSL_Read(void* ctx_, cc_uint8* data, cc_uint32 count, cc_uint32* read) { 
	SSLContext* ctx = (SSLContext*)ctx_;
	int res = br_sslio_read(&ctx->ioc, data, count);
	if (res < 0) return SSL_GetError(ctx);	
	
	*read = res;
	return 0;
}

cc_result SSL_Write(void* ctx_, const cc_uint8* data, cc_uint32 count, cc_uint32* sent) {
	SSLContext* ctx = (SSLContext*)ctx_;
	int res = br_sslio_write(&ctx->ioc, data, count);
	if (res < 0) return SSL_GetError(ctx);
	
	br_sslio_flush(&ctx->ioc);
	*sent = res;
	return 0;
}

cc_result SSL_Free(void* ctx_) {
	SSLContext* ctx = (SSLContext*)ctx_;
	if (ctx) br_sslio_close(&ctx->ioc);
	
	Mem_Free(ctx_);
	return 0;
}
#else
void SSLBackend_Init(cc_bool verifyCerts) { }
cc_bool SSLBackend_DescribeError(cc_result res, cc_string* dst) { return false; }

cc_result SSL_Init(cc_socket socket, const cc_string* host, void** ctx) {
	return HTTP_ERR_NO_SSL;
}

cc_result SSL_Read(void* ctx, cc_uint8* data, cc_uint32 count, cc_uint32* read) { 
	return ERR_NOT_SUPPORTED; 
}

cc_result SSL_WriteAll(void* ctx, const cc_uint8* data, cc_uint32 count) { 
	return ERR_NOT_SUPPORTED; 
}

cc_result SSL_Free(void* ctx) { return 0; }
#endif

/* ===== Certs (merged) ===== */

#ifndef CC_CRT_BACKEND
void CertsBackend_Init(void) { }

void Certs_BeginChain(struct X509CertContext* ctx) { }
void Certs_FreeChain( struct X509CertContext* ctx) { }
int Certs_VerifyChain(struct X509CertContext* ctx) { return ERR_NOT_SUPPORTED; }

void Certs_BeginCert( struct X509CertContext* ctx, int size) { }
void Certs_AppendCert(struct X509CertContext* ctx, const void* data, int len) { }
void Certs_FinishCert(struct X509CertContext* ctx) { }
#else

void Certs_BeginCert( struct X509CertContext* ctx, int size) {
	void* data;
	ctx->cert = NULL;

	/* Should never happen, but never know */
	if (ctx->numCerts >= X509_MAX_CERTS) return;

	data = Mem_TryAllocCleared(1, size);
	if (!data) return;

	ctx->cert         = &ctx->certs[ctx->numCerts++];	
	ctx->cert->data   = data;
	ctx->cert->offset = 0;
}

void Certs_AppendCert(struct X509CertContext* ctx, const void* data, int len) {
	if (!ctx->cert) return;

	Mem_Copy((char*)ctx->cert->data + ctx->cert->offset, data, len);
	ctx->cert->offset += len;
}

void Certs_FinishCert(struct X509CertContext* ctx) {
}

void Certs_BeginChain(struct X509CertContext* ctx) {
	ctx->cert     = NULL;
	ctx->numCerts = 0;
}

void Certs_FreeChain( struct X509CertContext* ctx) {
	int i;
	for (i = 0; i < ctx->numCerts; i++)
	{
		Mem_Free(ctx->certs[i].data);
	}
	ctx->numCerts = 0;
}

#if CC_CRT_BACKEND == CC_CRT_BACKEND_OPENSSL
/* === BEGIN OPENSSL HEADERS === */
typedef struct X509_           X509;
typedef struct X509_STORE_     X509_STORE;
typedef struct X509_STORE_CTX_ X509_STORE_CTX;
typedef struct OPENSSL_STACK_  OPENSSL_STACK;
typedef void (*OPENSSL_PopFunc)(void* data);

static OPENSSL_STACK* (*_OPENSSL_sk_new_null)(void);
int                   (*_OPENSSL_sk_push)(OPENSSL_STACK* st, const void* data);
void                  (*_OPENSSL_sk_pop_free)(OPENSSL_STACK* st, OPENSSL_PopFunc func);

static X509* (*_d2i_X509)(X509** px, const unsigned char** in, int len);

static X509* (*_X509_new)(void);
static void  (*_X509_free)(X509* a);

static X509_STORE* (*_X509_STORE_new)(void);
static int (*_X509_STORE_set_default_paths)(X509_STORE* ctx);

static int (*_X509_verify_cert)(X509_STORE_CTX* ctx);
static const char* (*_X509_verify_cert_error_string)(long n);

static X509_STORE_CTX* (*_X509_STORE_CTX_new)(void);
static void            (*_X509_STORE_CTX_free)(X509_STORE_CTX* ctx);

static int (*_X509_STORE_CTX_get_error)(X509_STORE_CTX* ctx);
static int (*_X509_STORE_CTX_init)(X509_STORE_CTX* ctx, X509_STORE* store,
                        X509* x509, OPENSSL_STACK* chain);
/* === END OPENSSL HEADERS === */

#if defined CC_BUILD_WIN
static const cc_string cryptoLib = String_FromConst("libcrypto.dll");
#elif defined CC_BUILD_HAIKU || defined CC_BUILD_LINUX
static const cc_string cryptoLib = String_FromConst("libcrypto.so.3");
static const cc_string cryptoAlt = String_FromConst("libcrypto.so");
#else
static const cc_string cryptoLib = String_FromConst("libcrypto.so");
static const cc_string cryptoAlt = String_FromConst("libcrypto.so.3");
#endif

#ifdef CC_BUILD_OPENBSD
	/* OpenBSD usually uses LibreSSL instead of OpenSSL, which didn't rename these symbols */
	#define OPENSSL_sk_new_null sk_new_null
	#define OPENSSL_sk_push     sk_push
	#define OPENSSL_sk_pop_free sk_pop_free
#endif

static X509_STORE* store;
static cc_bool ossl_loaded;

void CertsBackend_Init(void) {
	static const struct DynamicLibSym funcs[] = {		
		DynamicLib_ReqSym(d2i_X509),            DynamicLib_ReqSym(OPENSSL_sk_new_null), 
		DynamicLib_ReqSym(OPENSSL_sk_push),     DynamicLib_ReqSym(OPENSSL_sk_pop_free),
		DynamicLib_ReqSym(X509_new),            DynamicLib_ReqSym(X509_free),
		DynamicLib_ReqSym(X509_STORE_new),      DynamicLib_ReqSym(X509_STORE_set_default_paths),
		DynamicLib_ReqSym(X509_STORE_CTX_new),  DynamicLib_ReqSym(X509_STORE_CTX_free),
		DynamicLib_ReqSym(X509_STORE_CTX_init), DynamicLib_ReqSym(X509_STORE_CTX_get_error),	
		DynamicLib_ReqSym(X509_verify_cert),    DynamicLib_ReqSym(X509_verify_cert_error_string),
	};
	void* lib;

	ossl_loaded = DynamicLib_LoadAll(&cryptoLib,     funcs, Array_Elems(funcs), &lib);
	if (!lib) { 
		ossl_loaded = DynamicLib_LoadAll(&cryptoAlt, funcs, Array_Elems(funcs), &lib);
	}
}

static X509* ToOpenSSLCert(struct X509Cert* cert) {
	const unsigned char* data = cert->data;
	return _d2i_X509(NULL, &data, cert->offset);
}

int Certs_VerifyChain(struct X509CertContext* chain) {
	OPENSSL_STACK* inter;
	X509_STORE_CTX* ctx;
	int err, result;
	int i, status;
	X509* cur;
	X509* cert;
	if (!ossl_loaded) return ERR_NOT_SUPPORTED;

	/* Delay creating X509 store until necessary */
	if (!store) {
		store = _X509_STORE_new();
		if (!store) return ERR_OUT_OF_MEMORY;

		_X509_STORE_set_default_paths(store);
	}

	/* End/Leaf certificate */
	cert = ToOpenSSLCert(&chain->certs[0]);
	if (!cert) return ERR_OUT_OF_MEMORY;

	inter = _OPENSSL_sk_new_null();
	if (!inter) return ERR_OUT_OF_MEMORY;

	/* Intermediate certificates */
	for (i = 1; i < chain->numCerts; i++)
	{
		cur = ToOpenSSLCert(&chain->certs[i]);
		if (cur) _OPENSSL_sk_push(inter, cur);
	}

	ctx = _X509_STORE_CTX_new();
	_X509_STORE_CTX_init(ctx, store, cert, inter);

	status = _X509_verify_cert(ctx);
	result = 0;
	
    if (status != 1) {
		err = _X509_STORE_CTX_get_error(ctx);
        Platform_LogConst(_X509_verify_cert_error_string(err));
		result = -1;
    }

	_X509_STORE_CTX_free(ctx);
	_OPENSSL_sk_pop_free(inter, (OPENSSL_PopFunc)_X509_free);
	_X509_free(cert);

	return result;
}
#elif CC_CRT_BACKEND == CC_CRT_BACKEND_APPLESEC
#ifdef CC_BUILD_MACOS
#endif

void CertsBackend_Init(void) {
	
}

static SecPolicyRef policy;

static void CreateChain(struct X509CertContext* x509, CFMutableArrayRef chain) {
	struct X509Cert* certs = x509->certs;
	int i;
	
#ifdef CC_BUILD_MACOS
	/* Use older APIs that work on macOS earlier than 10.6 */
	for (i = 0; i < x509->numCerts; i++)
	{
		CSSM_DATA data;
		data.Data   = certs[i].data;
		data.Length = certs[i].offset;
		
		SecCertificateRef cert = NULL;
		int res = SecCertificateCreateFromData(&data, CSSM_CERT_X_509v3, CSSM_CERT_ENCODING_DER, &cert);
		if (!res && cert) CFArrayAppendValue(chain, cert);
	}
#else
	for (i = 0; i < x509->numCerts; i++)
	{
		CFDataRef data = CFDataCreateWithBytesNoCopy(NULL, certs[i].data, certs[i].offset, kCFAllocatorNull);
		
		SecCertificateRef cert = SecCertificateCreateWithData(NULL, data);
		if (cert) CFArrayAppendValue(chain, cert);
		CFRelease(data);
	}
#endif
}

static void CreateX509Policy(void) {
#ifdef CC_BUILD_MACOS
	SecPolicySearchRef search;
	int err = SecPolicySearchCreate(CSSM_CERT_X_509v3, &CSSMOID_APPLE_X509_BASIC, NULL, &search);
	if (err) return;
	
	err = SecPolicySearchCopyNext(search, &policy);
	CFRelease(search);
#else
	/* Use older APIs that work on macOS earlier than 10.6 */
	policy = SecPolicyCreateBasicX509();
#endif
}

int Certs_VerifyChain(struct X509CertContext* x509) {
	CFMutableArrayRef chain;
	SecTrustRef trust;
	int res;
	
	if (!policy) CreateX509Policy();
	if (!policy) return ERR_OUT_OF_MEMORY;
	
	chain = CFArrayCreateMutable(NULL, x509->numCerts, &kCFTypeArrayCallBacks);
	if (!chain) return ERR_OUT_OF_MEMORY;
	
	CreateChain(x509, chain);
	trust = NULL;
	res   = SecTrustCreateWithCertificates(chain, policy, &trust);
	
	if (!res) {
		SecTrustResultType result;
		res = SecTrustEvaluate(trust, &result);
		
		int is_trusted = result == kSecTrustResultUnspecified || result == kSecTrustResultProceed;
		if (!res && !is_trusted) res = -1;
		if (res) Platform_Log1("Cert validation failed: %i", &result);
	}
	
	CFRelease(trust);
	CFRelease(chain);
	return res;
}
#elif CC_CRT_BACKEND == CC_CRT_BACKEND_ANDROID

static jmethodID JAVA_sslCreateTrust, JAVA_sslAddCert, JAVA_sslVerifyChain;
static int created_trust;

void CertsBackend_Init(void) {
	JNIEnv* env;
	Java_GetCurrentEnv(env);
	
	JAVA_sslCreateTrust   = Java_GetSMethod(env, "sslCreateTrust", "()I");
	JAVA_sslAddCert       = Java_GetSMethod(env, "sslAddCert",     "([B)V");
	JAVA_sslVerifyChain   = Java_GetSMethod(env, "sslVerifyChain", "()I");
}

int Certs_VerifyChain(struct X509CertContext* x509) {
	JNIEnv* env;
	jvalue args[1];
	int i;
	Java_GetCurrentEnv(env);
	
	if (!created_trust) created_trust = Java_SCall_Int(env, JAVA_sslCreateTrust, NULL);
	if (!created_trust) return ERR_NOT_SUPPORTED;
	
	for (i = 0; i < x509->numCerts; i++)
	{
		struct X509Cert* cert = &x509->certs[i];
		args[0].l = Java_AllocBytes(env, cert->data, cert->offset);
		Java_SCall_Void(env, JAVA_sslAddCert, args);
		Java_DeleteLocalRef(env, args[0].l);
	}

	return Java_SCall_Int(env, JAVA_sslVerifyChain, NULL);
}
#elif CC_CRT_BACKEND == CC_CRT_BACKEND_WINCRYPTO
#define CC_CRYPT32_FUNC extern

#define WIN32_LEAN_AND_MEAN
#define NOSERVICE
#define NOMCX
#define NOIME
#ifndef UNICODE
#define UNICODE
#define _UNICODE
#endif

/* Compatibility versions so compiling works on older Windows SDKs */

void CertsBackend_Init(void) {
	Crypt32_LoadDynamicFuncs();
}

static LPCSTR const usage[] = {
	szOID_PKIX_KP_SERVER_AUTH,
	szOID_SERVER_GATED_CRYPTO,
	szOID_SGC_NETSCAPE
};

static BOOL BuildChain(struct X509CertContext* x509, HCERTSTORE store, PCCERT_CONTEXT* end_cert, PCCERT_CHAIN_CONTEXT* chain) {
	struct X509Cert* cert = &x509->certs[0];
	CERT_CHAIN_PARA para  = { 0 };
	int i;

	BOOL ok = _CertAddEncodedCertificateToStore(store, X509_ASN_ENCODING, cert->data, cert->offset,
												CERT_STORE_ADD_ALWAYS, end_cert);
	if (!ok || !(*end_cert)) return FALSE;

	for (i = 1; i < x509->numCerts; i++)
	{
		cert = &x509->certs[i];
		ok   = _CertAddEncodedCertificateToStore(store, X509_ASN_ENCODING, cert->data, cert->offset,
												CERT_STORE_ADD_ALWAYS, NULL);

	}

	para.cbSize = sizeof(para);
	para.RequestedUsage.dwType = USAGE_MATCH_TYPE_OR;
	para.RequestedUsage.Usage.cUsageIdentifier     = Array_Elems(usage);
	para.RequestedUsage.Usage.rgpszUsageIdentifier = (LPSTR*)usage;

	return _CertGetCertificateChain(NULL, *end_cert, NULL, NULL, &para, 0, NULL, chain);
}

int Certs_VerifyChain(struct X509CertContext* x509) {
	PCCERT_CHAIN_CONTEXT chain = NULL;
	PCCERT_CONTEXT end_cert = NULL;
	HCERTSTORE store;
	DWORD res = 200;

	if (!_CertOpenStore) return ERR_NOT_SUPPORTED;
	store = _CertOpenStore(CERT_STORE_PROV_MEMORY, 0, NULL, 0, NULL);
	if (!store) return ERR_NOT_SUPPORTED;

	if (BuildChain(x509, store, &end_cert, &chain)) {
		res = chain->TrustStatus.dwErrorStatus;
		if (res) Platform_Log1("Cert validation failed: %h", &res);
	}
	
	_CertFreeCertificateChain(chain);
	_CertFreeCertificateContext(end_cert);
	_CertCloseStore(store, 0);
	return res;
}
#endif

#endif
