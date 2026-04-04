/**
 * render.h - Rendering utilities
 */

#ifndef RENDER_H
#define RENDER_H

#include "game.h"

// UI Colors
#define UI_DARK_BG    ((Color){30,  30,  35,  255})
#define UI_LIGHT_BG   ((Color){60,  60,  70,  255})
#define UI_SELECTED   ((Color){70, 130, 180,  255})
#define UI_TEXT       ((Color){255,255, 255,  255})
#define UI_HOVER      ((Color){80,  80,  90,  255})

// Function declarations
// NOTE: DrawFPS renamed to DrawGameFPS to avoid conflict with Raylib 5.0's
//       DrawFPS(int posX, int posY) which has a different signature.
void DrawHomeScreen(void);
void DrawPlayingUI(void);
void DrawInventoryBar(void);
void DrawCrosshair(void);
void DrawDebugInfo(void);
void DrawGameFPS(void);               // renamed from DrawFPS

void DrawTexturedCube(Vector3 position, Vector3 size, Texture2D texture);
// Note: DrawVoxel is declared in world.h

#endif // RENDER_H
