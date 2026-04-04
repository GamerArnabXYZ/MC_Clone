/**
 * main.c - Main entry point for Voxel Minecraft-styled game
 */

#include "game.h"
#include "world.h"
#include "input.h"
#include "render.h"
#include <stdio.h>
#include <stdlib.h>

// Global game instance
Game g_game;

// Cursor state tracking
static bool g_cursorLocked = false;

void InitGame(void);
void UpdateGame(void);
void DrawGame(void);
void CloseGame(void);

// Initialize game
void InitGame(void) {
    InitWindow(SCREEN_WIDTH, SCREEN_HEIGHT, "VoxelCraft - C Game");
    SetTargetFPS(60);
    SetExitKey(KEY_ESCAPE);

    // Detect device type
    // Detect touch device at compile time (CI sets -DPLATFORM_ANDROID / -DPLATFORM_WEB)
    // On desktop, start as PC mode; touch will be re-detected in input.c if needed
#if defined(PLATFORM_ANDROID) || defined(PLATFORM_WEB)
    g_game.touchDevice = true;
#else
    g_game.touchDevice = false;
#endif
    g_game.device = g_game.touchDevice ? DEVICE_MOBILE : DEVICE_PC;

    // Initialize game state
    g_game.state = STATE_HOME;
    g_game.cameraMode = VC_FIRST_PERSON;
    g_game.selectedSlot = 0;
    g_game.texturesLoaded = false;
    g_game.leftJoystick = (Vector2){0, 0};
    g_game.rightJoystick = (Vector2){0, 0};

    // Initialize player position
    g_game.player.position = (Vector3){WORLD_SIZE/2.0f, 25.0f, WORLD_SIZE/2.0f};
    g_game.player.velocity = (Vector3){0, 0, 0};
    g_game.player.yaw = 0.0f;
    g_game.player.pitch = 0.0f;
    g_game.player.onGround = false;

    // Initialize inventory with default blocks
    for (int i = 0; i < MAX_INVENTORY_SLOTS; i++) {
        g_game.inventory[i].blockType = (BlockType)((i % (BLOCK_COUNT - 1)) + 1);
        g_game.inventory[i].count = 64;
        g_game.inventory[i].selected = (i == 0);
    }

    // Initialize 3D camera
    g_game.camera.position = (Vector3){0, 0, 0};
    g_game.camera.target = (Vector3){0, 0, 0};
    g_game.camera.up = (Vector3){0, 1, 0};
    g_game.camera.fovy = 60.0f;
    g_game.camera.projection = CAMERA_PERSPECTIVE;

    LoadBlockTextures();
    InitInput();
    InitWorld();

    g_cursorLocked = false;
}

void UpdateGame(void) {
    switch (g_game.state) {
        case STATE_HOME:
            UpdateHomeScreen();
            break;
        case STATE_PLAYING:
            UpdatePlaying();
            break;
        case STATE_EXIT:
            break;
        default:
            break;
    }
}

void UpdateHomeScreen(void) {
    Vector2 mousePos = GetMousePosition();
    Rectangle startBtn = {SCREEN_WIDTH/2.0f - 100, SCREEN_HEIGHT/2.0f - 40, 200, 60};
    Rectangle exitBtn = {SCREEN_WIDTH/2.0f - 100, SCREEN_HEIGHT/2.0f + 40, 200, 60};

    if (IsMouseButtonPressed(MOUSE_LEFT_BUTTON)) {
        if (CheckCollisionPointRec(mousePos, startBtn)) {
            g_game.state = STATE_PLAYING;
        } else if (CheckCollisionPointRec(mousePos, exitBtn)) {
            g_game.state = STATE_EXIT;
        }
    }

    if (IsGestureDetected(GESTURE_TAP)) {
        Vector2 touchPos = GetTouchPosition(0);
        if (CheckCollisionPointRec(touchPos, startBtn)) {
            g_game.state = STATE_PLAYING;
        } else if (CheckCollisionPointRec(touchPos, exitBtn)) {
            g_game.state = STATE_EXIT;
        }
    }
}

void UpdatePlaying(void) {
    InputState input = GetInputState();

    if (IsKeyPressed(KEY_F5)) {
        ChangeCameraMode();
    }

    UpdatePlayer(&input);
    UpdateGameCamera();
    UpdateWorld();

    // Handle inventory selection (number keys 1-9)
    for (int i = KEY_ONE; i <= KEY_NINE; i++) {
        if (IsKeyPressed(i)) {
            SelectInventorySlot(i - KEY_ONE);
        }
    }

    // Mouse scroll for inventory
    if (!g_game.touchDevice) {
        float wheel = GetMouseWheelMove();
        if (wheel > 0) {
            SelectInventorySlot((g_game.selectedSlot - 1 + MAX_INVENTORY_SLOTS) % MAX_INVENTORY_SLOTS);
        } else if (wheel < 0) {
            SelectInventorySlot((g_game.selectedSlot + 1) % MAX_INVENTORY_SLOTS);
        }
    }
}

void UpdatePlayer(InputState* input) {
    const float moveSpeed = 0.15f;
    const float jumpForce = 0.3f;
    const float gravity = 0.015f;

    Vector3 moveDir = {0, 0, 0};

    Vector3 forward = (Vector3){
        -sinf(g_game.player.yaw), 0, -cosf(g_game.player.yaw)
    };
    Vector3 right = (Vector3){
        cosf(g_game.player.yaw), 0, -sinf(g_game.player.yaw)
    };

    if (input->moveForward) moveDir = Vector3Add(moveDir, forward);
    if (input->moveBackward) moveDir = Vector3Subtract(moveDir, forward);
    if (input->moveLeft) moveDir = Vector3Subtract(moveDir, right);
    if (input->moveRight) moveDir = Vector3Add(moveDir, right);

    if (g_game.touchDevice) {
        Vector3 joystickMove = (Vector3){
            input->leftJoystick.x, 0, -input->leftJoystick.y
        };
        if (Vector3Length(joystickMove) > 0.1f) {
            Vector3 transformed = (Vector3){
                joystickMove.x * cosf(g_game.player.yaw) - joystickMove.z * sinf(g_game.player.yaw),
                0,
                joystickMove.x * sinf(g_game.player.yaw) + joystickMove.z * cosf(g_game.player.yaw)
            };
            moveDir = Vector3Add(moveDir, transformed);
        }
    }

    if (Vector3Length(moveDir) > 0) {
        moveDir = Vector3Normalize(moveDir);
        moveDir = Vector3Scale(moveDir, moveSpeed);
    }

    g_game.player.velocity.x = moveDir.x;
    g_game.player.velocity.z = moveDir.z;

    if (input->jump && g_game.player.onGround) {
        g_game.player.velocity.y = jumpForce;
        g_game.player.onGround = false;
    }

    g_game.player.velocity.y -= gravity;
    if (g_game.player.velocity.y < -1.0f) {
        g_game.player.velocity.y = -1.0f;
    }

    Vector3 newPos = Vector3Add(g_game.player.position, g_game.player.velocity);
    int groundBlock = GetBlockAt((Vector3){newPos.x, newPos.y - 1.5f, newPos.z});

    if (groundBlock != BLOCK_AIR && g_game.player.velocity.y <= 0) {
        newPos.y = (float)((int)newPos.y) + 1.5f;
        g_game.player.velocity.y = 0;
        g_game.player.onGround = true;
    }

    // World bounds
    if (newPos.x < 0) newPos.x = 0;
    if (newPos.x >= WORLD_SIZE) newPos.x = (float)WORLD_SIZE - 0.1f;
    if (newPos.z < 0) newPos.z = 0;
    if (newPos.z >= WORLD_SIZE) newPos.z = (float)WORLD_SIZE - 0.1f;
    if (newPos.y < 1) newPos.y = 1;
    if (newPos.y > WORLD_SIZE) newPos.y = (float)WORLD_SIZE;

    g_game.player.position = newPos;

    // Camera rotation - PC with locked cursor
    if (!g_game.touchDevice && g_game.cameraMode == VC_FIRST_PERSON && g_cursorLocked) {
        g_game.player.yaw += input->mouseDelta.x * 0.003f;
        g_game.player.pitch -= input->mouseDelta.y * 0.003f;

        if (g_game.player.pitch > PI/2.0f - 0.1f) g_game.player.pitch = PI/2.0f - 0.1f;
        if (g_game.player.pitch < -PI/2.0f + 0.1f) g_game.player.pitch = -PI/2.0f + 0.1f;
    }

    // Camera rotation - Mobile right joystick
    if (g_game.touchDevice) {
        g_game.player.yaw   += input->mouseDelta.x * 0.005f;
        g_game.player.pitch -= input->mouseDelta.y * 0.005f;

        if (g_game.player.pitch > PI/2.0f - 0.1f) g_game.player.pitch = PI/2.0f - 0.1f;
        if (g_game.player.pitch < -PI/2.0f + 0.1f) g_game.player.pitch = -PI/2.0f + 0.1f;
    }
}

void UpdateGameCamera(void) {
    switch (g_game.cameraMode) {
        case VC_FIRST_PERSON: {
            Vector3 offset = (Vector3){
                sinf(g_game.player.yaw) * cosf(g_game.player.pitch) * 0.5f,
                sinf(g_game.player.pitch) * 0.5f + 1.6f,
                cosf(g_game.player.yaw) * cosf(g_game.player.pitch) * 0.5f
            };
            g_game.camera.position = Vector3Add(g_game.player.position, offset);

            Vector3 forward = (Vector3){
                -sinf(g_game.player.yaw) * cosf(g_game.player.pitch),
                -sinf(g_game.player.pitch),
                -cosf(g_game.player.yaw) * cosf(g_game.player.pitch)
            };
            g_game.camera.target = Vector3Add(g_game.camera.position, forward);

            if (!g_game.touchDevice && !g_cursorLocked) {
                DisableCursor();
                g_cursorLocked = true;
            }
            break;
        }
        case VC_THIRD_PERSON: {
            float dist = 8.0f;
            Vector3 offset = (Vector3){
                sinf(g_game.player.yaw) * dist, 4.0f, cosf(g_game.player.yaw) * dist
            };
            g_game.camera.position = Vector3Add(g_game.player.position, offset);
            g_game.camera.target = Vector3Add(g_game.player.position, (Vector3){0, 1.0f, 0});

            if (!g_game.touchDevice && g_cursorLocked) {
                EnableCursor();
                g_cursorLocked = false;
            }
            break;
        }
        case VC_TOP_DOWN: {
            g_game.camera.position = (Vector3){
                g_game.player.position.x,
                g_game.player.position.y + 30.0f,
                g_game.player.position.z + 0.1f
            };
            g_game.camera.target = g_game.player.position;

            if (!g_game.touchDevice && g_cursorLocked) {
                EnableCursor();
                g_cursorLocked = false;
            }
            break;
        }
    }
}

void ChangeCameraMode(void) {
    g_game.cameraMode = (g_game.cameraMode + 1) % 3;

    if (!g_game.touchDevice) {
        if (g_game.cameraMode == VC_FIRST_PERSON) {
            DisableCursor();
            g_cursorLocked = true;
        } else {
            EnableCursor();
            g_cursorLocked = false;
        }
    }
}

void SelectInventorySlot(int slot) {
    if (slot < 0 || slot >= MAX_INVENTORY_SLOTS) return;

    g_game.inventory[g_game.selectedSlot].selected = false;
    g_game.selectedSlot = slot;
    g_game.inventory[slot].selected = true;
}

void DrawGame(void) {
    BeginDrawing();
    ClearBackground((Color){135, 206, 235, 255});

    switch (g_game.state) {
        case STATE_HOME:
            DrawHomeScreen();
            break;
        case STATE_PLAYING:
            DrawPlaying();
            break;
        default:
            break;
    }

    EndDrawing();
}

void DrawPlaying(void) {
    BeginMode3D(g_game.camera);
    DrawWorld();
    DrawPlayerModel();
    EndMode3D();

    DrawPlayingUI();
    DrawCrosshair();
    DrawInventoryBar();

    if (g_game.touchDevice) {
        DrawMobileControls();
    }

    DrawGameFPS();
}

void DrawPlayerModel(void) {
    Color playerColor = (Color){210, 180, 140, 255};
    DrawCube(g_game.player.position, 0.8f, 1.8f, 0.8f, playerColor);
    DrawCubeWires(g_game.player.position, 0.8f, 1.8f, 0.8f, BLACK);
}

void CloseGame(void) {
    UnloadBlockTextures();
    CloseInput();
    CloseWorld();
    CloseWindow();
}

int main(void) {
    InitGame();

    while (g_game.state != STATE_EXIT && !WindowShouldClose()) {
        UpdateGame();
        DrawGame();
    }

    CloseGame();
    return 0;
}
