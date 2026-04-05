#ifndef CC_LWEB_H
#define CC_LWEB_H
#include "Bitmap.h"
#include "Constants.h"
CC_BEGIN_HEADER

/* Implements asynchronous web tasks for the launcher.
	Copyright 2014-2025 ClassiCube | Licensed under BSD-3
*/

struct HttpRequest;
struct JsonContext;
typedef void (*JsonOnValue)(struct JsonContext* ctx, const cc_string* v);
typedef void (*JsonOnNew)(struct JsonContext* ctx);

/* State for parsing JSON text */
struct JsonContext {
	char* cur;        /* Pointer to current character in JSON stream being inspected. */
	int left;         /* Number of characters left to be inspected. */
	cc_bool failed;   /* Whether there was an error parsing the JSON. */
	cc_string curKey; /* Key/Name of current member */
	int depth;        /* Object/Array depth (e.g. { { { is depth 3 */
	
	JsonOnNew OnNewArray;  /* Invoked when start of an array is read. */
	JsonOnNew OnNewObject; /* Invoked when start of an object is read. */
	JsonOnValue OnValue;   /* Invoked on each member value in an object/array. */
	cc_string _tmp; /* temp value used for reading string values */
	char _tmpBuffer[STRING_SIZE];
};
/* Initialises state of JSON parser. */
void Json_Init(struct JsonContext* ctx, STRING_REF char* str, int len);
/* Parses the JSON text, invoking callbacks when value/array/objects are read. */
/* NOTE: DO NOT persist the value argument in OnValue. */
cc_bool Json_Parse(struct JsonContext* ctx);

/* Represents all known details about a server. */
struct ServerInfo {
	cc_string hash, name, ip, mppass, software;
	int players, maxPlayers, port, uptime;
	cc_bool featured;
	char country[2];
	int _order; /* (internal) order in servers table after filtering */
	char _hashBuffer[32],   _nameBuffer[STRING_SIZE];
	char _ipBuffer[16],     _mppassBuffer[STRING_SIZE];
	char _softBuffer[STRING_SIZE];
};

/* Represents a country flag */
struct Flag {
	struct Bitmap bmp;
	char country[2]; /* ISO 3166-1 alpha-2 */
	void* meta; /* Backend specific meta */
};

struct LWebTask {
	cc_bool completed; /* Whether the task has finished executing. */
	cc_bool working;   /* Whether the task is currently in progress, or is scheduled to be. */
	cc_bool success;   /* Whether the task completed successfully. */
	
	int reqID; /* Unique request identifier for this web task. */
	/* Called when task successfully downloaded/uploaded data. */
	void (*Handle)(cc_uint8* data, cc_uint32 len);
};
typedef void (*LWebTask_ErrorCallback)(struct HttpRequest* req);

void LWebTask_Tick(struct LWebTask* task, LWebTask_ErrorCallback errorCallback);
void LWebTasks_Init(void);

/* Stub task structs - kept for compilation compatibility */
extern struct GetTokenTaskData {
	struct LWebTask Base;
	cc_string token;
	cc_string username;
	cc_bool   error;
} GetTokenTask;
void GetTokenTask_Run(void);

extern struct SignInTaskData {
	struct LWebTask Base;
	cc_string username;
	const char* error;
	cc_bool needMFA;
} SignInTask;
void SignInTask_Run(const cc_string* user, const cc_string* pass, const cc_string* mfaCode);

extern struct FetchServerData {
	struct LWebTask Base;
	struct ServerInfo server;
} FetchServerTask;
void FetchServerTask_Run(const cc_string* hash);

extern struct FetchServersData {
	struct LWebTask Base;
	struct ServerInfo* servers;
	cc_uint16* orders;
	int numServers;
} FetchServersTask;
void FetchServersTask_Run(void);
void FetchServersTask_ResetOrder(void);

extern struct CheckUpdateData {
	struct LWebTask Base;
	cc_uint64 devTimestamp, relTimestamp;
	cc_string latestRelease;
} CheckUpdateTask;
void CheckUpdateTask_Run(void);

extern struct FetchUpdateData {
	struct LWebTask Base;
	cc_uint64 timestamp;
} FetchUpdateTask;
void FetchUpdateTask_Run(cc_bool release, int buildIndex);

extern struct FetchFlagsData {
	struct LWebTask Base;
	int count;
} FetchFlagsTask;
void FetchFlagsTask_Add(const struct ServerInfo* server);
struct Flag* Flags_Get(const struct ServerInfo* server);
void Flags_Free(void);

void Session_Load(void);
void Session_Save(void);

CC_END_HEADER
#endif
