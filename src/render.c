/**
 * render.c - Rendering utilities and UI
 */

#include "render.h"
#include "world.h"
#include "game.h"
#include <stdlib.h>
#include <time.h>

// Static seed for procedural textures
static bool g_texRandSeeded = false;

// Block textures array
static Texture2D g_blockTextures[BLOCK_COUNT];

// Generate procedural texture
Image GenerateProceduralTexture(BlockType type) {
    Image img = GenImageColor(16, 16, BLANK);

    for (int y = 0; y < 16; y++) {
        for (int x = 0; x < 16; x++) {
            unsigned char r = 200, g = 200, b = 200, a = 255;

            switch (type) {
                case BLOCK_GRASS:
                    if (rand() % 4 == 0) {
                        r = 70; g = 150; b = 40;
                    } else {
                        r = 86; g = 174; b = 57;
                    }
                    if (rand() % 8 == 0) {
                        r = 100; g = 190; b = 60;
                    }
                    a = 255;
                    break;

                case BLOCK_DIRT:
                    r = (unsigned char)(134 + (rand() % 20 - 10));
                    g = (unsigned char)(96 + (rand() % 15 - 7));
                    b = (unsigned char)(67 + (rand() % 15 - 7));
                    a = 255;
                    break;

                case BLOCK_STONE:
                    r = (unsigned char)(128 + (rand() % 30 - 15));
                    g = r;
                    b = r;
                    a = 255;
                    break;

                case BLOCK_WOOD: {
                    int distFromCenter = abs(x - 8) + abs(y - 8);
                    if (distFromCenter > 6 && rand() % 3 == 0) {
                        r = 100; g = 60; b = 30;
                    } else {
                        r = 139; g = 90; b = 43;
                    }
                    a = 255;
                    break;
                }

                case BLOCK_LEAVES:
                    r = (unsigned char)(34 + (rand() % 30));
                    g = (unsigned char)(139 + (rand() % 40));
                    b = (unsigned char)(34 + (rand() % 20));
                    a = (unsigned char)((rand() % 50) + 200);
                    break;

                case BLOCK_SAND:
                    r = (unsigned char)(238 + (rand() % 20 - 10));
                    g = (unsigned char)(214 + (rand() % 15 - 7));
                    b = (unsigned char)(175 + (rand() % 20 - 10));
                    a = 255;
                    break;

                case BLOCK_WATER:
                    r = (unsigned char)(64 + (rand() % 20));
                    g = (unsigned char)(164 + (rand() % 30));
                    b = (unsigned char)(223 + (rand() % 30));
                    a = (unsigned char)((rand() % 50) + 150);
                    break;

                case BLOCK_BRICK:
                    if (x % 8 == 0 || y % 8 == 0 || (y % 4 == 0 && x % 8 >= 4)) {
                        r = 50; g = 45; b = 40;
                    } else {
                        r = (unsigned char)(178 + (rand() % 20 - 10));
                        g = (unsigned char)(34 + (rand() % 15 - 7));
                        b = (unsigned char)(34 + (rand() % 15 - 7));
                    }
                    a = 255;
                    break;

                case BLOCK_GLASS:
                    if (x == 0 || x == 15 || y == 0 || y == 15) {
                        r = 200; g = 220; b = 255; a = 100;
                    } else {
                        r = 255; g = 255; b = 255; a = 30;
                    }
                    break;

                case BLOCK_WOOL:
                    r = (unsigned char)(245 + (rand() % 10));
                    g = r;
                    b = r;
                    a = 255;
                    break;

                case BLOCK_COBBLE:
                    r = (unsigned char)(104 + (rand() % 40 - 20));
                    g = r;
                    b = r;
                    a = 255;
                    break;

                case BLOCK_PLANK:
                    r = (unsigned char)(205 + (rand() % 20 - 10));
                    g = (unsigned char)(170 + (rand() % 15 - 7));
                    b = (unsigned char)(125 + (rand() % 15 - 7));
                    if (y % 4 == 0) r = (unsigned char)(r > 20 ? r - 20 : 0);
                    a = 255;
                    break;

                case BLOCK_SLAB:
                    r = (unsigned char)(166 + (rand() % 15 - 7));
                    g = (unsigned char)(124 + (rand() % 15 - 7));
                    b = (unsigned char)(82 + (rand() % 15 - 7));
                    a = 255;
                    break;

                case BLOCK_COAL:
                    r = (unsigned char)(37 + (rand() % 20));
                    g = r;
                    b = r;
                    if (rand() % 16 == 0) {
                        r = 80; g = 80; b = 80;
                    }
                    a = 255;
                    break;

                default:
                    r = 200; g = 200; b = 200; a = 255;
                    break;
            }

            ImageDrawPixel(&img, x, y, (Color){r, g, b, a});
        }
    }

    return img;
}

// Load block textures with fallback
void LoadBlockTextures(void) {
    g_game.texturesLoaded = false;

    // Seed random only once for procedural textures
    if (!g_texRandSeeded) {
        srand((unsigned int)time(NULL));
        g_texRandSeeded = true;
    }

    const char* textureNames[BLOCK_COUNT] = {
        "air.png", "grass.png", "dirt.png", "stone.png", "wood.png",
        "leaves.png", "sand.png", "water.png", "brick.png", "glass.png",
        "wool.png", "cobble.png", "plank.png", "slab.png", "coal.png"
    };

    for (int i = 0; i < BLOCK_COUNT; i++) {
        char path[256];
        sprintf(path, "assets/textures/%s", textureNames[i]);

        if (FileExists(path)) {
            Image img = LoadImage(path);
            ImageResize(&img, 16, 16);
            g_blockTextures[i] = LoadTextureFromImage(img);
            UnloadImage(img);
            TraceLog(LOG_INFO, "Loaded texture: %s", path);
        } else {
            TraceLog(LOG_WARNING, "Texture not found: %s, generating procedural", path);
            Image procImg = GenerateProceduralTexture(i);
            g_blockTextures[i] = LoadTextureFromImage(procImg);
            UnloadImage(procImg);
        }
    }

    g_game.texturesLoaded = true;

    for (int i = 0; i < BLOCK_COUNT; i++) {
        g_game.blockTextures[i] = g_blockTextures[i];
    }
}

void UnloadBlockTextures(void) {
    for (int i = 0; i < BLOCK_COUNT; i++) {
        if (g_blockTextures[i].id > 0) {
            UnloadTexture(g_blockTextures[i]);
        }
    }
}

Texture2D GetBlockTexture(BlockType type) {
    if (type >= 0 && type < BLOCK_COUNT) {
        return g_blockTextures[type];
    }
    return g_blockTextures[0];
}

void DrawHomeScreen(void) {
    DrawRectangle(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, (Color){30, 40, 60, 255});

    DrawText("VOXELCRAFT", SCREEN_WIDTH/2 - MeasureText("VOXELCRAFT", 60)/2, 150, 60, WHITE);
    DrawText("Minecraft-styled Voxel Game in C",
             SCREEN_WIDTH/2 - MeasureText("Minecraft-styled Voxel Game in C", 20)/2, 220, 20,
             (Color){180, 180, 180, 255});

    const char* deviceText = g_game.touchDevice ? "Mobile Device Detected" : "PC Mode";
    DrawText(deviceText, SCREEN_WIDTH/2 - MeasureText(deviceText, 16)/2, 260, 16,
             (Color){100, 200, 100, 255});

    Rectangle startBtn = {SCREEN_WIDTH/2.0f - 100, SCREEN_HEIGHT/2.0f - 40, 200, 60};
    Color startColor = CheckCollisionPointRec(GetMousePosition(), startBtn) ?
        (Color){80, 140, 80, 255} : (Color){60, 120, 60, 255};
    DrawRectangleRec(startBtn, startColor);
    DrawRectangleLinesEx(startBtn, 3, WHITE);
    DrawText("START GAME", (int)(startBtn.x + 25), (int)(startBtn.y + 20), 20, WHITE);

    Rectangle exitBtn = {SCREEN_WIDTH/2.0f - 100, SCREEN_HEIGHT/2.0f + 40, 200, 60};
    Color exitColor = CheckCollisionPointRec(GetMousePosition(), exitBtn) ?
        (Color){180, 60, 60, 255} : (Color){150, 50, 50, 255};
    DrawRectangleRec(exitBtn, exitColor);
    DrawRectangleLinesEx(exitBtn, 3, WHITE);
    DrawText("EXIT", (int)(exitBtn.x + 70), (int)(exitBtn.y + 20), 20, WHITE);

    int infoY = SCREEN_HEIGHT - 120;
    DrawText("PC Controls:", 50, infoY, 16, (Color){200, 200, 200, 255});
    DrawText("WASD - Move | Mouse - Look | Space - Jump | F5 - Change Camera", 50, infoY + 25, 14,
             (Color){150, 150, 150, 255});
    DrawText("Mobile Controls:", 50, infoY + 55, 16, (Color){200, 200, 200, 255});
    DrawText("Left Joystick - Move | Right Joystick - Look | Camera Button - Change View", 50, infoY + 80, 14,
             (Color){150, 150, 150, 255});

    DrawText("Made with Raylib", SCREEN_WIDTH/2 - MeasureText("Made with Raylib", 12)/2, SCREEN_HEIGHT - 30, 12,
             (Color){100, 100, 100, 255});
}

void DrawPlayingUI(void) {
    const char* cameraModes[] = {"First Person", "Third Person", "Top Down"};
    DrawText(cameraModes[g_game.cameraMode], 10, 10, 16, WHITE);

    const char* deviceText = g_game.touchDevice ? "[Mobile]" : "[PC]";
    DrawText(deviceText, 10, 30, 12, (Color){180, 180, 180, 255});

    char posText[64];
    sprintf(posText, "Pos: %.1f, %.1f, %.1f",
            g_game.player.position.x,
            g_game.player.position.y,
            g_game.player.position.z);
    DrawText(posText, 10, 50, 12, (Color){180, 180, 180, 255});
}

void DrawCrosshair(void) {
    if (g_game.touchDevice) return;

    int centerX = SCREEN_WIDTH / 2;
    int centerY = SCREEN_HEIGHT / 2;
    int size = 10;
    int gap = 4;

    Color crosshairColor = (Color){255, 255, 255, 200};

    DrawLine(centerX - size, centerY, centerX - gap, centerY, crosshairColor);
    DrawLine(centerX + gap, centerY, centerX + size, centerY, crosshairColor);
    DrawLine(centerX, centerY - size, centerX, centerY - gap, crosshairColor);
    DrawLine(centerX, centerY + gap, centerX, centerY + size, crosshairColor);
    DrawCircle(centerX, centerY, 2, crosshairColor);
}

void DrawInventoryBar(void) {
    int slotSize = 50;
    int slotCount = MAX_INVENTORY_SLOTS;
    int totalWidth = slotCount * slotSize + (slotCount - 1) * 5;
    int startX = (SCREEN_WIDTH - totalWidth) / 2;
    int startY = SCREEN_HEIGHT - 80;

    DrawRectangle(startX - 10, startY - 10, totalWidth + 20, slotSize + 20,
                  (Color){30, 30, 35, 220});
    DrawRectangleLinesEx((Rectangle){(float)(startX - 10), (float)(startY - 10),
                                     (float)(totalWidth + 20), (float)(slotSize + 20)},
                         2, (Color){80, 80, 80, 255});

    for (int i = 0; i < slotCount; i++) {
        int slotX = startX + i * (slotSize + 5);
        bool selected = (i == g_game.selectedSlot);

        Color slotColor = selected ?
            (Color){70, 130, 180, 255} : (Color){60, 60, 70, 255};
        DrawRectangle(slotX, startY, slotSize, slotSize, slotColor);

        Color borderColor = selected ? (Color){100, 160, 210, 255} : (Color){80, 80, 90, 255};
        DrawRectangleLinesEx((Rectangle){(float)slotX, (float)startY, (float)slotSize, (float)slotSize},
                           2, borderColor);

        BlockType block = g_game.inventory[i].blockType;
        Color blockColor = GetBlockColor(block);

        int blockSize = 30;
        int blockX = slotX + (slotSize - blockSize) / 2;
        int blockY = startY + (slotSize - blockSize) / 2;

        DrawRectangle(blockX, blockY, blockSize, blockSize, ColorBrightness(blockColor, 0.1f));
        DrawRectangle(blockX, blockY + (int)(blockSize * 0.3f), blockSize, (int)(blockSize * 0.7f), blockColor);
        DrawRectangle(blockX + (int)(blockSize * 0.7f), blockY + (int)(blockSize * 0.3f),
                    (int)(blockSize * 0.3f), (int)(blockSize * 0.5f), ColorBrightness(blockColor, -0.1f));

        DrawText(TextFormat("%d", i + 1), slotX + 3, startY + 3, 10, (Color){150, 150, 150, 255});
    }

    BlockType selectedBlock = g_game.inventory[g_game.selectedSlot].blockType;
    const char* blockNames[] = {
        "Air", "Grass", "Dirt", "Stone", "Wood", "Leaves",
        "Sand", "Water", "Brick", "Glass", "Wool", "Cobble",
        "Plank", "Slab", "Coal"
    };
    const char* selectedName = blockNames[selectedBlock];

    int textWidth = MeasureText(selectedName, 16);
    DrawText(selectedName, (SCREEN_WIDTH - textWidth) / 2, startY - 30, 16, WHITE);
}

void DrawFPS(void) {
    char fpsText[32];
    sprintf(fpsText, "FPS: %d", GetFPS());
    DrawText(fpsText, 10, SCREEN_HEIGHT - 25, 14, (Color){100, 255, 100, 255});
}

void DrawTexturedCube(Vector3 position, Vector3 size, Texture2D texture) {
    DrawCubeV(position, size, WHITE);
}

void DrawDebugInfo(void) {
    char debugText[128];
    sprintf(debugText, "Chunks: 4 | Voxels: %d", WORLD_SIZE * WORLD_SIZE * WORLD_SIZE);
    DrawText(debugText, 10, 80, 12, (Color){200, 200, 200, 255});
}
