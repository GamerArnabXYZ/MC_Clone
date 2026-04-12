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

static void SetupProgram(int argc, char** argv) {
	Logger_WarnFunc = Logger_DialogWarn;
	Platform_Init();
	Platform_SetDefaultCurrentDirectory(argc, argv);
	Window_PreInit();
	Window_Init();
	Options_Load();
	/* Set default username if not saved */
	if (!Game_Username.length)
		String_AppendConst(&Game_Username, "VoxelPlayer");
}

static void RunGame(void) {
	Game_Setup();
	while (Game_Running) { Game_RenderFrame(); }
	Game_Free();
	Window_Destroy();
}

static int RunProgram(int argc, char** argv) {
	RunGame();
	return 0;
}
