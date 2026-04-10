/* 
VoxelCraft - Standalone game entry point
Multiplayer, login, and launcher completely removed.
*/
#include "Logger.h"
#include "String_.h"
#include "Platform.h"
#include "Window.h"
#include "Constants.h"
#include "Game.h"
#include "Funcs.h"
#include "Utils.h"
#include "Options.h"

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

static void start_logging(void) {
	const char* path = "/sdcard/Android/data/com.voxelcraft.android.client/files/log.txt";
	remove(path);
	if (freopen(path, "w", stdout) == NULL) return;
	freopen(path, "a", stderr);
	setvbuf(stdout, NULL, _IONBF, 0);
	setvbuf(stderr, NULL, _IONBF, 0);
	printf("=== VoxelCraft Mobile Debugger ===\n");
	fflush(stdout);
}

static void SetupProgram(int argc, char** argv) {
	start_logging();
	printf("[1] Logger init\n"); fflush(stdout);
	Logger_WarnFunc = Logger_DialogWarn;

	printf("[2] Platform_Init\n"); fflush(stdout);
	Platform_Init();

	printf("[3] SetDefaultCurrentDirectory\n"); fflush(stdout);
	Platform_SetDefaultCurrentDirectory(argc, argv);

	printf("[4] Window_PreInit\n"); fflush(stdout);
	Window_PreInit();

	printf("[5] Window_Init\n"); fflush(stdout);
	Window_Init();

	printf("[6] Options_Load\n"); fflush(stdout);
	Options_Load();

	printf("[7] SetupProgram done\n"); fflush(stdout);
}

static void RunGame(void) {
	printf("[8] Game_Setup start\n"); fflush(stdout);
	Game_Setup();
	printf("[9] Game loop start\n"); fflush(stdout);
	while (Game_Running) { Game_RenderFrame(); }
	Game_Free();
	Window_Destroy();
}

static int RunProgram(int argc, char** argv) {
	RunGame();
	return 0;
}
