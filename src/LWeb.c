#include "LWeb.h"
#ifndef CC_DISABLE_LAUNCHER
#include "String_.h"
#include "Launcher.h"
#include "Platform.h"
#include "Stream.h"
#include "Logger.h"
#include "Window.h"
#include "Options.h"
#include "MathUtils.h"
#include "Errors.h"
#include "Utils.h"
#include "Http.h"
#include "LBackend.h"

/*########################################################################################################################*
*----------------------------------------------------------JSON-----------------------------------------------------------*
*#########################################################################################################################*/
#define TOKEN_NONE  0
#define TOKEN_NUM   1
#define TOKEN_TRUE  2
#define TOKEN_FALSE 3
#define TOKEN_NULL  4
/* Consumes n characters from the JSON stream */
#define JsonContext_Consume(ctx, n) ctx->cur += n; ctx->left -= n;

static const cc_string strTrue  = String_FromConst("true");
static const cc_string strFalse = String_FromConst("false");
static const cc_string strNull  = String_FromConst("null");

static cc_bool Json_IsWhitespace(char c) {
	return c == '\r' || c == '\n' || c == '\t' || c == ' ';
}

static cc_bool Json_IsNumber(char c) {
	return c == '-' || c == '.' || (c >= '0' && c <= '9');
}

static cc_bool Json_ConsumeConstant(struct JsonContext* ctx, const cc_string* value) {
	int i;
	if (value->length > ctx->left) return false;

	for (i = 0; i < value->length; i++) {
		if (ctx->cur[i] != value->buffer[i]) return false;
	}

	JsonContext_Consume(ctx, value->length);
	return true;
}

static int Json_ConsumeToken(struct JsonContext* ctx) {
	char c;
	for (; ctx->left && Json_IsWhitespace(*ctx->cur); ) { JsonContext_Consume(ctx, 1); }
	if (!ctx->left) return TOKEN_NONE;

	c = *ctx->cur;
	if (c == '{' || c == '}' || c == '[' || c == ']' || c == ',' || c == '"' || c == ':') {
		JsonContext_Consume(ctx, 1); return c;
	}

	/* number token forms part of value, don't consume it */
	if (Json_IsNumber(c)) return TOKEN_NUM;

	if (Json_ConsumeConstant(ctx, &strTrue))  return TOKEN_TRUE;
	if (Json_ConsumeConstant(ctx, &strFalse)) return TOKEN_FALSE;
	if (Json_ConsumeConstant(ctx, &strNull))  return TOKEN_NULL;

	/* invalid token */
	JsonContext_Consume(ctx, 1);
	ctx->failed = true;
	return TOKEN_NONE;
}

static cc_string Json_ConsumeNumber(struct JsonContext* ctx) {
	int len = 0;
	for (; ctx->left && Json_IsNumber(*ctx->cur); len++) { JsonContext_Consume(ctx, 1); }
	return String_Init(ctx->cur - len, len, len);
}

static void Json_ConsumeString(struct JsonContext* ctx, cc_string* str) {
	int codepoint, h[4];
	char c;
	str->length = 0;

	for (; ctx->left;) {
		c = *ctx->cur; JsonContext_Consume(ctx, 1);
		if (c == '"') return;
		if (c != '\\') { String_Append(str, c); continue; }

		/* form of \X */
		if (!ctx->left) break;
		c = *ctx->cur; JsonContext_Consume(ctx, 1);
		if (c == '/' || c == '\\' || c == '"') { String_Append(str, c); continue; }
		if (c == 'n') { String_Append(str, '\n'); continue; }

		/* form of \uYYYY */
		if (c != 'u' || ctx->left < 4) break;
		if (!PackedCol_Unhex(ctx->cur, h, 4)) break;

		codepoint = (h[0] << 12) | (h[1] << 8) | (h[2] << 4) | h[3];
		/* don't want control characters in names/software */
		if (codepoint >= 32) String_Append(str, Convert_CodepointToCP437(codepoint));
		JsonContext_Consume(ctx, 4);
	}

	ctx->failed = true; str->length = 0;
}
static cc_string Json_ConsumeValue(int token, struct JsonContext* ctx);

static void Json_ConsumeObject(struct JsonContext* ctx) {
	char keyBuffer[STRING_SIZE];
	cc_string value, oldKey = ctx->curKey;
	int token;
	ctx->depth++;
	ctx->OnNewObject(ctx);

	while (true) {
		token = Json_ConsumeToken(ctx);
		if (token == ',') continue;
		if (token == '}') break;

		if (token != '"') { ctx->failed = true; break; }
		String_InitArray(ctx->curKey, keyBuffer);
		Json_ConsumeString(ctx, &ctx->curKey);

		token = Json_ConsumeToken(ctx);
		if (token != ':') { ctx->failed = true; break; }

		token = Json_ConsumeToken(ctx);
		if (token == TOKEN_NONE) { ctx->failed = true; break; }

		value = Json_ConsumeValue(token, ctx);
		ctx->OnValue(ctx, &value);
		ctx->curKey = oldKey;
	}
	ctx->depth--;
}

static void Json_ConsumeArray(struct JsonContext* ctx) {
	cc_string value;
	int token;
	ctx->depth++;
	ctx->OnNewArray(ctx);

	while (true) {
		token = Json_ConsumeToken(ctx);
		if (token == ',') continue;
		if (token == ']') break;

		if (token == TOKEN_NONE) { ctx->failed = true; break; }
		value = Json_ConsumeValue(token, ctx);
		ctx->OnValue(ctx, &value);
	}
	ctx->depth--;
}

static cc_string Json_ConsumeValue(int token, struct JsonContext* ctx) {
	switch (token) {
	case '{': Json_ConsumeObject(ctx); break;
	case '[': Json_ConsumeArray(ctx);  break;
	case '"': Json_ConsumeString(ctx, &ctx->_tmp); return ctx->_tmp;

	case TOKEN_NUM:   return Json_ConsumeNumber(ctx);
	case TOKEN_TRUE:  return strTrue;
	case TOKEN_FALSE: return strFalse;
	case TOKEN_NULL:  break;
	}
	return String_Empty;
}

static void Json_NullOnNew(struct JsonContext* ctx) { }
static void Json_NullOnValue(struct JsonContext* ctx, const cc_string* v) { }
void Json_Init(struct JsonContext* ctx, STRING_REF char* str, int len) {
	ctx->cur    = str;
	ctx->left   = len;
	ctx->failed = false;
	ctx->curKey = String_Empty;
	ctx->depth  = 0;

	ctx->OnNewArray  = Json_NullOnNew;
	ctx->OnNewObject = Json_NullOnNew;
	ctx->OnValue     = Json_NullOnValue;
	String_InitArray(ctx->_tmp, ctx->_tmpBuffer);
}

cc_bool Json_Parse(struct JsonContext* ctx) {
	int token;
	do {
		token = Json_ConsumeToken(ctx);
		Json_ConsumeValue(token, ctx);
	} while (token != TOKEN_NONE);

	return !ctx->failed;
}

static cc_bool Json_Handle(cc_uint8* data, cc_uint32 len, 
						JsonOnValue onVal, JsonOnNew newArr, JsonOnNew newObj) {
	struct JsonContext ctx;
	/* NOTE: classicube.net uses \u JSON for non ASCII, no need to UTF8 convert characters here */
	Json_Init(&ctx, (char*)data, len);
	
	if (onVal)  ctx.OnValue     = onVal;
	if (newArr) ctx.OnNewArray  = newArr;
	if (newObj) ctx.OnNewObject = newObj;
	return Json_Parse(&ctx);
}


/*########################################################################################################################*
*--------------------------------------------------------Web task---------------------------------------------------------*
*#########################################################################################################################*/
static char servicesBuffer[FILENAME_SIZE];
static cc_string servicesServer = String_FromArray(servicesBuffer);
static struct StringsBuffer CC_BIG_VAR ccCookies;

static void LWebTask_Reset(struct LWebTask* task) {
	task->completed = false;
	task->working   = true;
	task->success   = false;
}

void LWebTask_Tick(struct LWebTask* task, LWebTask_ErrorCallback errorCallback) {
	struct HttpRequest item;

	if (task->completed) return;
	if (!Http_GetResult(task->reqID, &item)) return;

	task->working   = false;
	task->completed = true;
	task->success   = item.success;

	if (item.success) {
		task->Handle(item.data, item.size);
	} else if (errorCallback) {
		errorCallback(&item);
	}
	HttpRequest_Free(&item);
}

void LWebTasks_Init(void) {
	Options_Get(SOPT_SERVICES, &servicesServer, SERVICES_SERVER);
}


/*########################################################################################################################*
*-------------------------------------------------------GetTokenTask------------------------------------------------------*
*#########################################################################################################################*/
/*
< GET /api/login/

> {
>	"username": null,
>	"authenticated": false,
>	"token": "f033ab37c30201f73f142449d037028d",
>	"errors": []
>}
*/
struct GetTokenTaskData GetTokenTask;
void GetTokenTask_Run(void) { /* login removed */ }
/*########################################################################################################################*
*--------------------------------------------------------SignInTask-------------------------------------------------------*
*#########################################################################################################################*/
/*
< POST /api/login/
< username=AndrewPH&password=examplePassW0rd&token=f033ab37c30201f73f142449d037028d

> {
> 	"username": "AndrewPH",
> 	"authenticated": true,
> 	"token": "33e75ff09dd601bbe69f351039152189",
> 	"errors": []
> }
*/
struct SignInTaskData SignInTask;
void SignInTask_Run(const cc_string* user, const cc_string* pass, const cc_string* mfaCode) { /* login removed */ }
/*########################################################################################################################*
*-----------------------------------------------------FetchServerTask-----------------------------------------------------*
*#########################################################################################################################*/
/*
< GET /api/server/a709fabdf836a2a102c952442bf2dab1

> { "servers" : [
>	{"hash": "a709fabdf836a2a102c952442bf2dab1", "maxplayers": 70, "name": "Freebuild server", "players": 5, "software": "MCGalaxy", "uptime": 185447, "country_abbr": "CA"},
> ]}
*/
struct FetchServerData FetchServerTask;
void FetchServerTask_Run(const cc_string* hash) { /* server fetch removed */ }
/*########################################################################################################################*
*-----------------------------------------------------FetchServersTask----------------------------------------------------*
*#########################################################################################################################*/
/*
< GET /api/servers/

> { "servers" : [
>	{"hash": "a709fabdf836a2a102c952442bf2dab1", "maxplayers": 70, "name": "Freebuild server", "players": 5, "software": "MCGalaxy", "uptime": 185447, "country_abbr": "CA"},
>	{"hash": "23860c5e192cbaa4698408338efd61cc", "maxplayers": 30, "name": "Other server", "players": 0, software: "", "uptime": 54661, "country_abbr": "T1"}
> ]}
*/
struct FetchServersData FetchServersTask;
void FetchServersTask_Run(void) { /* server list removed */ }
void FetchServersTask_ResetOrder(void) { }
/*########################################################################################################################*
*-----------------------------------------------------CheckUpdateTask-----------------------------------------------------*
*#########################################################################################################################*/
/*
< GET /builds.json

> {"latest_ts": 1718187640.9587102, "release_ts": 1693265172.020421, "release_version": "1.3.6"}
*/
struct CheckUpdateData CheckUpdateTask;
void CheckUpdateTask_Run(void) { /* updates removed */ }
/*########################################################################################################################*
*-----------------------------------------------------FetchUpdateTask-----------------------------------------------------*
*#########################################################################################################################*/
struct FetchUpdateData FetchUpdateTask;
void FetchUpdateTask_Run(cc_bool release, int buildIndex) { /* updates removed */ }
/*########################################################################################################################*
*-----------------------------------------------------FetchFlagsTask------------------------------------------------------*
*#########################################################################################################################*/
struct FetchFlagsData FetchFlagsTask;

void FetchFlagsTask_Add(const struct ServerInfo* server) { }
struct Flag* Flags_Get(const struct ServerInfo* server) { return NULL; }
void Flags_Free(void) { FetchFlagsTask.count = 0; }


/*########################################################################################################################*
*------------------------------------------------------Session cache------------------------------------------------------*
*#########################################################################################################################*/
void Session_Load(void) { }
void Session_Save(void) { }

#endif
