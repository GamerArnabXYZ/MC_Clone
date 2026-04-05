#ifndef CC_SSL_H
#define CC_SSL_H
#include "Platform.h"
CC_BEGIN_HEADER

/* 
Wraps a socket connection in a TLS/SSL connection
Copyright 2014-2025 ClassiCube | Licensed under BSD-3
*/

void SSLBackend_Init(cc_bool verifyCerts);
cc_bool SSLBackend_DescribeError(cc_result res, cc_string* dst);

cc_result SSL_Init(cc_socket socket, const cc_string* host, void** ctx);
cc_result SSL_Read(void* ctx, cc_uint8* data, cc_uint32 count, cc_uint32* read);
cc_result SSL_Write(void* ctx, const cc_uint8* data, cc_uint32 count, cc_uint32* sent);
cc_result SSL_Free(void* ctx);

CC_END_HEADER
#endif

/* ===== Certs.h (merged) ===== */
#ifndef CC_CERT_H
#define CC_CERT_H
#include "Core.h"
CC_BEGIN_HEADER

/* 
Validates an X509 certificate chain for verifying a SSL/TLS connection.
Copyright 2014-2025 ClassiCube | Licensed under BSD-3
*/

void CertsBackend_Init(void);

#define X509_MAX_CERTS 10
struct X509Cert {
	void* data;
	int offset;
};

struct X509CertContext {
	struct X509Cert certs[X509_MAX_CERTS];
	struct X509Cert* cert;
	int numCerts;
};

void Certs_BeginChain( struct X509CertContext* ctx);
void Certs_FreeChain(  struct X509CertContext* ctx);
int  Certs_VerifyChain(struct X509CertContext* ctx);

void Certs_BeginCert( struct X509CertContext* ctx, int size);
void Certs_AppendCert(struct X509CertContext* ctx, const void* data, int len);
void Certs_FinishCert(struct X509CertContext* ctx);

CC_END_HEADER
#endif
