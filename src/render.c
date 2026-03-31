/**
 * render.c - Rendering utilities and UI
 */

#include "render.h"
#include "world.h"
#include "game.h"
#include <stdlib.h>
#include <math.h>

// Block textures array
static Texture2D g_blockTextures[BLOCK_COUNT];

// Procedural texture patterns
typedef struct {
    unsigned char r, g, b, a;
} Pixel;

// Generate procedural texture
Image GenerateProceduralTexture(BlockType type) {
    Image img = GenImageColor(16, 16, BLANK);

    for (int y = 0; y < 16; y++) {
        for (int x = 0; x < 16; x++) {
            unsigned char r, g, b, a;

            switch (type) {
                case BLOCK_GRASS: {
                    // Grass top - green with variation
                    if (rand() % 4 == 0) {
                        r = 70; g = 150; b = 40; // Dark spot
                    } else {
                        r = 86; g = 174; b = 57; // Main green
                    }
                    if (rand() % 8 == 0) {
                        r = 100; g = 190; b = 60; // Light spot
                    }
                    a = 255;
                    break;
                }
                case BLOCK_DIRT: {
                    // Dirt - brown with variation
                    r = 134 + (rand() % 20 - 10);
                    g = 96 + (rand() % 15 - 7);
                    b = 67 + (rand() % 15 - 7);
                    a = 255;
                    break;
                }
                case BLOCK_STONE: {
                    // Stone - gray with cracks
                    r = 128 + (rand() % 30 - 15);
                    g = 128 + (rand() % 30 - 15);
                    b = 128 + (rand() % 30 - 15);
                    a = 255;
                    break;
                }
                case BLOCK_WOOD: {
                    // Wood - brown with rings
                    int distFromCenter = abs(x - 8) + abs(y - 8);
                    if (distFromCenter > 6 && rand() % 3 == 0) {
                        r = 100; g = 60; b = 30; // Dark ring
                    } else {
                        r = 139; g = 90; b = 43;
                    }
                    a = 255;
                    break;
                }
                case BLOCK_LEAVES: {
                    // Leaves - green with transparency
                    r = 34 + (rand() % 30);
                    g = 139 + (rand() % 40);
                    b = 34 + (rand() % 20);
                    a = (rand() % 50) + 200;
                    break;
                }
                case BLOCK_SAND: {
                    // Sand - yellow/beige
                    r = 238 + (rand() % 20 - 10);
                    g = 214 + (rand() % 15 - 7);
                    b = 175 + (rand() % 20 - 10);
                    a = 255;
                    break;
                }
                case BLOCK_WATER: {
                    // Water - blue with transparency
                    r = 64 + (rand() % 20);
                    g = 164 + (rand() % 30);
                    b = 223 + (rand() % 30);
                    a = 150 + (rand() % 50);
                    break;
                }
                case BLOCK_BRICK: {
                    // Brick - red with mortar lines
                    if (x % 8 == 0 || y % 8 == 0 || (y % 4 == 0 && x % 8 >= 4)) {
                        r = 50; g = 45; b = 40; // Mortar
                    } else {
                        r = 178 + (rand() % 20 - 10);
                        g = 34 + (rand() % 15 - 7);
                        b = 34 + (rand() % 15 - 7);
                    }
                    a = 255;
                    break;
                }
                case BLOCK_GLASS: {
                    // Glass - transparent with edge highlight
                    if (x == 0 || x == 15 || y == 0 || y == 15) {
                        r = 200; g = 220; b = 255; a = 100;
                    } else {
                        r = 255; g = 255; b = 255; a = 30;
                    }
                    break;
                }
                case BLOCK_WOOL: {
                    // Wool - soft white with fuzz
                    r = 245 + (rand() % 10);
                    g = 245 + (rand() % 10);
                    b = 245 + (rand() % 10);
                    a = 255;
                    break;
                }
                case BLOCK_COBBLE: {
                    // Cobblestone - gray with variation
                    r = 104 + (rand() % 40 - 20);
                    g = 104 + (rand() % 40 - 20);
                    b = 104 + (rand() % 40 - 20);
                    a = 255;
                    break;
                }
                case BLOCK_PLANK: {
                    // Plank - wood color with grain
                    r = 205 + (rand() % 20 - 10);
                    g = 170 + (rand() % 15 - 7);
                    b = 125 + (rand() % 15 - 7);
                    if (y % 4 == 0) r -= 20; // Plank separation
                    a = 255;
                    break;
                }
                case BLOCK_SLAB: {
                    // Stone slab - flat gray
                    r = 166 + (rand() % 15 - 7);
                    g = 124 + (rand() % 15 - 7);
                    b = 82 + (rand() % 15 - 7);
                    a = 255;
                    break;
                }
                case BLOCK_COAL: {
                    // Coal - black with shine
                    r = 37 + (rand() % 20);
                    g = 37 + (rand() % 20);
                    b = 37 + (rand() % 20);
                    if (rand() % 16 == 0) {
                        r = 80; g = 80; b = 80; // Shine
                    }
                    a = 255;
                    break;
                }
                default: {
                    r = 200; g = 200; b = 200; a = 255;
                    break;
                }
            }

            ImageDrawPixel(&img, x, y, (Color){r, g, b, a});
        }
    }

    return img;
}

// Load block textures with fallback
void LoadBlockTextures(void) {
    g_game.texturesLoaded = false;

    const char* textureNames[BLOCK_COUNT] = {
        "air.png", "grass.png", "dirt.png", "stone.png", "wood.png",
        "leaves.png", "sand.png", "water.png", "brick.png", "glass.png",
        "wool.png", "cobble.png", "plank.png", "slab.png", "coal.png", "coal.png"
    };

    for (int i = 0; i < BLOCK_COUNT; i++) {
        // Try to load from assets folder
        char path[256];
        sprintf(path, "assets/textures/%s", textureNames[i]);

        if (FileExists(path)) {
            Image img = LoadImage(path);
            ImageResize(&img, 16, 16);
            g_blockTextures[i] = LoadTextureFromImage(img);
            UnloadImage(img);
            TraceLog(LOG_INFO, "Loaded texture: %s", path);
        } else {
            // Generate procedural texture as fallback
            TraceLog(LOG_WARNING, "Texture not found: %s, generating procedural", path);
            Image procImg = GenerateProceduralTexture(i);
            g_blockTextures[i] = LoadTextureFromImage(procImg);
            UnloadImage(procImg);
        }
    }

    g_game.texturesLoaded = true;

    // Copy to game struct for access
    for (int i = 0; i < BLOCK_COUNT; i++) {
        g_game.blockTextures[i] = g_blockTextures[i];
    }
}

// Unload block textures
void UnloadBlockTextures(void) {
    for (int i = 0; i < BLOCK_COUNT; i++) {
        if (g_blockTextures[i].id > 0) {
            UnloadTexture(g_blockTextures[i]);
        }
    }
}

// Get block texture
Texture2D GetBlockTexture(BlockType type) {
    if (type >= 0 && type < BLOCK_COUNT) {
        return g_blockTextures[type];
    }
    return g_blockTextures[0];
}

// Draw home screen
void DrawHomeScreen(void) {
    // Background
    DrawRectangle(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, (Color){30, 40, 60, 255});

    // Title
    DrawText("VOXELCRAFT", SCREEN_WIDTH/2 - MeasureText("VOXELCRAFT", 60)/2, 150, 60, WHITE);
    DrawText("Minecraft-styled Voxel Game in C", SCREEN_WIDTH/2 - MeasureText("Minecraft-styled Voxel Game in C", 20)/2, 220, 20, (Color){180, 180, 180, 255});

    // Device indicator
    const char* deviceText = g_game.touchDevice ? "Mobile Device Detected" : "PC Mode";
    DrawText(deviceText, SCREEN_WIDTH/2 - MeasureText(deviceText, 16)/2, 260, 16, (Color){100, 200, 100, 255});

    // Start button
    Rectangle startBtn = {SCREEN_WIDTH/2 - 100, SCREEN_HEIGHT/2 - 40, 200, 60};
    Color startColor = CheckCollisionPointRec(GetMousePosition(), startBtn) ?
        (Color){80, 140, 80, 255} : (Color){60, 120, 60, 255};
    DrawRectangleRec(startBtn, startColor);
    DrawRectangleLinesEx(startBtn, 3, WHITE);
    DrawText("START GAME", startBtn.x + 25, startBtn.y + 20, 20, WHITE);

    // Exit button
    Rectangle exitBtn = {SCREEN_WIDTH/2 - 100, SCREEN_HEIGHT/2 + 40, 200, 60};
    Color exitColor = CheckCollisionPointRec(GetMousePosition(), exitBtn) ?
        (Color){180, 60, 60, 255} : (Color){150, 50, 50, 255};
    DrawRectangleRec(exitBtn, exitColor);
    DrawRectangleLinesEx(exitBtn, 3, WHITE);
    DrawText("EXIT", exitBtn.x + 70, exitBtn.y + 20, 20, WHITE);

    // Controls info
    int infoY = SCREEN_HEIGHT - 120;
    DrawText("PC Controls:", 50, infoY, 16, (Color){200, 200, 200, 255});
    DrawText("WASD - Move | Mouse - Look | Space - Jump | F5 - Change Camera", 50, infoY + 25, 14, (Color){150, 150, 150, 255});
    DrawText("Mobile Controls:", 50, infoY + 55, 16, (Color){200, 200, 200, 255});
    DrawText("Left Joystick - Move | Right Joystick - Look | Camera Button - Change View", 50, infoY + 80, 14, (Color){150, 150, 150, 255});

    // Credits
    DrawText("Made with Raylib", SCREEN_WIDTH/2 - MeasureText("Made with Raylib", 12)/2, SCREEN_HEIGHT - 30, 12, (Color){100, 100, 100, 255});
}

// Draw playing UI
void DrawPlayingUI(void) {
    // Camera mode indicator
    const char* cameraModes[] = {"First Person", "Third Person", "Top Down"};
    DrawText(cameraModes[g_game.cameraMode], 10, 10, 16, WHITE);

    // Device mode indicator
    const char* deviceText = g_game.touchDevice ? "[Mobile]" : "[PC]";
    DrawText(deviceText, 10, 30, 12, (Color){180, 180, 180, 255});

    // Position display
    char posText[64];
    sprintf(posText, "Pos: %.1f, %.1f, %.1f",
            g_game.player.position.x,
            g_game.player.position.y,
            g_game.player.position.z);
    DrawText(posText, 10, 50, 12, (Color){180, 180, 180, 255});
}

// Draw crosshair
void DrawCrosshair(void) {
    if (g_game.touchDevice) return;

    int centerX = SCREEN_WIDTH / 2;
    int centerY = SCREEN_HEIGHT / 2;
    int size = 10;
    int gap = 4;

    Color crosshairColor = (Color){255, 255, 255, 200};

    // Horizontal lines
    DrawLine(centerX - size, centerY, centerX - gap, centerY, crosshairColor);
    DrawLine(centerX + gap, centerY, centerX + size, centerY, crosshairColor);

    // Vertical lines
    DrawLine(centerX, centerY - size, centerX, centerY - gap, crosshairColor);
    DrawLine(centerX, centerY + gap, centerX, centerY + size, crosshairColor);

    // Center dot
    DrawCircle(centerX, centerY, 2, crosshairColor);
}

// Draw inventory bar
void DrawInventoryBar(void) {
    int slotSize = 50;
    int slotCount = MAX_INVENTORY_SLOTS;
    int totalWidth = slotCount * slotSize + (slotCount - 1) * 5;
    int startX = (SCREEN_WIDTH - totalWidth) / 2;
    int startY = SCREEN_HEIGHT - 80;

    // Background bar
    DrawRectangle(startX - 10, startY - 10, totalWidth + 20, slotSize + 20,
                  (Color){30, 30, 35, 220});
    DrawRectangleLinesEx((Rectangle){startX - 10, startY - 10, totalWidth + 20, slotSize + 20},
                         2, (Color){80, 80, 80, 255});

    // Draw slots
    for (int i = 0; i < slotCount; i++) {
        int slotX = startX + i * (slotSize + 5);
        bool selected = (i == g_game.selectedSlot);

        // Slot background
        Color slotColor = selected ?
            (Color){70, 130, 180, 255} : (Color){60, 60, 70, 255};
        DrawRectangle(slotX, startY, slotSize, slotSize, slotColor);

        // Slot border
        Color borderColor = selected ? (Color){100, 160, 210, 255} : (Color){80, 80, 90, 255};
        DrawRectangleLinesEx((Rectangle){slotX, startY, slotSize, slotSize}, 2, borderColor);

        // Draw block preview
        BlockType block = g_game.inventory[i].blockType;
        Color blockColor = GetBlockColor(block);

        // Simple 3D block representation
        int blockSize = 30;
        int blockX = slotX + (slotSize - blockSize) / 2;
        int blockY = startY + (slotSize - blockSize) / 2;

        // Top face
        DrawRectangle(blockX, blockY, blockSize, blockSize, ColorBrightness(blockColor, 0.1f));
        // Front face
        DrawRectangle(blockX, blockY + blockSize * 0.3f, blockSize, blockSize * 0.7f, blockColor);
        // Right face
        DrawRectangle(blockX + blockSize * 0.7f, blockY + blockSize * 0.3f, blockSize * 0.3f, blockSize * 0.5f, ColorBrightness(blockColor, -0.1f));

        // Selection number
        DrawText(TextFormat("%d", i + 1), slotX + 3, startY + 3, 10, (Color){150, 150, 150, 255});
    }

    // Selected block name
    BlockType selectedBlock = g_game.inventory[g_game.selectedSlot].blockType;
    const char* blockNames[] = {
        "Air", "Grass", "Dirt", "Stone", "Wood", "Leaves",
        "Sand", "Water", "Brick", "Glass", "Wool", "Cobble",
        "Plank", "Slab", "Coal", "Coal"
    };
    const char* selectedName = blockNames[selectedBlock];

    int textWidth = MeasureText(selectedName, 16);
    DrawText(selectedName, (SCREEN_WIDTH - textWidth) / 2, startY - 30, 16, WHITE);
}

// Draw FPS counter
void DrawFPS(void) {
    DrawFPSValues(10, SCREEN_HEIGHT - 25);
}

void DrawFPSValues(int x, int y) {
    char fpsText[32];
    sprintf(fpsText, "FPS: %d", GetFPS());
    DrawText(fpsText, x, y, 14, (Color){100, 255, 100, 255});
}

// Draw textured cube
void DrawTexturedCube(Vector3 position, Vector3 size, Texture2D texture) {
    DrawCubeV(position, size, WHITE);
    // Note: For full texture support, would need to map texture to faces
}

// Draw debug info
void DrawDebugInfo(void) {
    if (!IsWindowDebugMode()) return;

    // Chunk count
    char debugText[128];
    sprintf(debugText, "Chunks: 4 | Voxels: %d", WORLD_SIZE * WORLD_SIZE * WORLD_SIZE);
    DrawText(debugText, 10, 80, 12, (Color){200, 200, 200, 255});
}
