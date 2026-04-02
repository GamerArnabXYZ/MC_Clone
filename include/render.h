/**
 * render.h - Rendering utilities
 */

#ifndef RENDER_H
#define RENDER_H

#include "game.h"

// UI Colors (Minecraft inspired)
#define UI_DARK_BG (Color){30, 30, 35, 255}
#define UI_LIGHT_BG (Color){60, 60, 70, 255}
#define UI_SELECTED (Color){70, 130, 180, 255}
#define UI_TEXT (Color){255, 255, 255, 255}
#define UI_HOVER (Color){80, 80, 90, 255}

// Function declarations
void DrawHomeScreen(void);
void DrawPlayingUI(void);
void DrawInventoryBar(void);
void DrawCrosshair(void);
void DrawDebugInfo(void);
void DrawFPS(void);

void DrawTexturedCube(Vector3 position, Vector3 size, Texture2D texture);
void DrawVoxel(Vector3 position, BlockType type);

#endif // RENDER_H
