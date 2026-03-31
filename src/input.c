/**
 * input.c - Cross-platform input handling
 */

#include "input.h"
#include "game.h"
#include "raymath.h"
#include <stdlib.h>

// Input state
static InputState g_inputState;
static MobileUI g_mobileUI;
static bool g_inputInitialized = false;

// Touch tracking
static int g_leftTouchId = -1;
static int g_rightTouchId = -1;
static Vector2 g_leftTouchStart;
static Vector2 g_rightTouchStart;

// Initialize input system
void InitInput(void) {
    g_inputState = (InputState){
        .moveForward = false,
        .moveBackward = false,
        .moveLeft = false,
        .moveRight = false,
        .jump = false,
        .sprint = false,
        .mouseDelta = (Vector2){0, 0},
        .leftJoystick = (Vector2){0, 0},
        .rightJoystick = (Vector2){0, 0},
        .cameraButtonPressed = false,
        .cameraButtonReleased = false
    };

    // Setup mobile UI if touch device
    if (g_game.touchDevice) {
        g_mobileUI.leftJoystickArea.x = 0;
        g_mobileUI.leftJoystickArea.y = SCREEN_HEIGHT - 250;
        g_mobileUI.leftJoystickArea.width = 200;
        g_mobileUI.leftJoystickArea.height = 200;

        g_mobileUI.rightJoystickArea.x = SCREEN_WIDTH - 200;
        g_mobileUI.rightJoystickArea.y = SCREEN_HEIGHT - 250;
        g_mobileUI.rightJoystickArea.width = 200;
        g_mobileUI.rightJoystickArea.height = 200;

        g_mobileUI.cameraButtonArea.x = SCREEN_WIDTH - 120;
        g_mobileUI.cameraButtonArea.y = 50;
        g_mobileUI.cameraButtonArea.width = 80;
        g_mobileUI.cameraButtonArea.height = 80;

        g_mobileUI.leftStickCenter = (Vector2){
            g_mobileUI.leftJoystickArea.x + g_mobileUI.leftJoystickArea.width / 2,
            g_mobileUI.leftJoystickArea.y + g_mobileUI.leftJoystickArea.height / 2
        };
        g_mobileUI.rightStickCenter = (Vector2){
            g_mobileUI.rightJoystickArea.x + g_mobileUI.rightJoystickArea.width / 2,
            g_mobileUI.rightJoystickArea.y + g_mobileUI.rightJoystickArea.height / 2
        };

        g_mobileUI.leftStickRadius = 50.0f;
        g_mobileUI.rightStickRadius = 50.0f;
    }

    g_leftTouchId = -1;
    g_rightTouchId = -1;
    g_inputInitialized = true;
}

// Update input state each frame
void UpdateInput(void) {
    if (!g_inputInitialized) return;

    // Reset frame-specific states
    g_inputState.jump = false;
    g_inputState.cameraButtonPressed = false;
    g_inputState.cameraButtonReleased = false;

    if (g_game.device == DEVICE_PC) {
        UpdatePCInput();
    } else {
        UpdateMobileInput();
    }
}

// PC input handling
void UpdatePCInput(void) {
    // Movement keys
    g_inputState.moveForward = IsKeyDown(KEY_W) || IsKeyDown(KEY_UP);
    g_inputState.moveBackward = IsKeyDown(KEY_S) || IsKeyDown(KEY_DOWN);
    g_inputState.moveLeft = IsKeyDown(KEY_A) || IsKeyDown(KEY_LEFT);
    g_inputState.moveRight = IsKeyDown(KEY_D);
    g_inputState.jump = IsKeyDown(KEY_SPACE);
    g_inputState.sprint = IsKeyDown(KEY_LEFT_SHIFT);

    // Mouse movement
    Vector2 mousePos = GetMousePosition();
    static Vector2 lastMousePos = {0, 0};

    if (IsMouseButtonDown(MOUSE_LEFT_BUTTON) || g_game.cameraMode == CAMERA_FIRST_PERSON) {
        g_inputState.mouseDelta.x = mousePos.x - lastMousePos.x;
        g_inputState.mouseDelta.y = mousePos.y - lastMousePos.y;
    } else {
        g_inputState.mouseDelta = (Vector2){0, 0};
    }

    lastMousePos = mousePos;

    // Escape to unlock cursor
    if (IsKeyPressed(KEY_ESCAPE)) {
        EnableCursor();
    }

    // Click to lock cursor again
    if (IsMouseButtonPressed(MOUSE_LEFT_BUTTON) && g_game.cameraMode == CAMERA_FIRST_PERSON) {
        DisableCursor();
    }
}

// Mobile input handling
void UpdateMobileInput(void) {
    int touchCount = GetTouchPointCount();

    for (int i = 0; i < touchCount; i++) {
        Vector2 touchPos = GetTouchPosition(i);

        // Determine which area was touched
        bool inLeftArea = CheckCollisionPointRec(touchPos, g_mobileUI.leftJoystickArea);
        bool inRightArea = CheckCollisionPointRec(touchPos, g_mobileUI.rightJoystickArea);
        bool inCameraArea = CheckCollisionPointRec(touchPos, g_mobileUI.cameraButtonArea);

        // Left joystick - movement
        if (inLeftArea && g_leftTouchId == -1) {
            g_leftTouchId = i;
            g_leftTouchStart = touchPos;
        }

        // Right joystick - camera
        if (inRightArea && g_rightTouchId == -1) {
            g_rightTouchId = i;
            g_rightTouchStart = touchPos;
        }

        // Camera button
        if (inCameraArea && IsTouchButtonPressed(i)) {
            g_inputState.cameraButtonPressed = true;
        }

        // Update joystick values
        if (g_leftTouchId == i) {
            Vector2 delta = Vector2Subtract(touchPos, g_leftTouchStart);
            float dist = Vector2Length(delta);

            if (dist > g_mobileUI.leftStickRadius) {
                delta = Vector2Scale(Vector2Normalize(delta), g_mobileUI.leftStickRadius);
            }

            g_inputState.leftJoystick = (Vector2){
                delta.x / g_mobileUI.leftStickRadius,
                delta.y / g_mobileUI.leftStickRadius
            };
        }

        if (g_rightTouchId == i) {
            Vector2 delta = Vector2Subtract(touchPos, g_rightTouchStart);

            g_inputState.mouseDelta = (Vector2){
                delta.x * 0.1f,
                delta.y * 0.1f
            };

            // Update right joystick visual
            g_inputState.rightJoystick = delta;
        }

        // Jump button (tap outside joysticks)
        if (!inLeftArea && !inRightArea && !inCameraArea) {
            g_inputState.jump = true;
        }
    }

    // Release touches
    for (int i = 0; i < touchCount; i++) {
        if (!IsTouchButtonDown(i)) {
            if (g_leftTouchId == i) {
                g_leftTouchId = -1;
                g_inputState.leftJoystick = (Vector2){0, 0};
            }
            if (g_rightTouchId == i) {
                g_rightTouchId = -1;
                g_inputState.mouseDelta = (Vector2){0, 0};
                g_inputState.rightJoystick = (Vector2){0, 0};
            }
        }
    }
}

// Get current input state
InputState GetInputState(void) {
    UpdateInput();
    return g_inputState;
}

// Check if device is touch-enabled
bool IsTouchDevice(void) {
    return IsMobile();
}

// Close input system
void CloseInput(void) {
    g_inputInitialized = false;
}

// Draw mobile controls (on-screen joysticks)
void DrawMobileControls(void) {
    if (!g_game.touchDevice) return;

    // Left joystick base
    DrawCircleV(g_mobileUI.leftStickCenter, g_mobileUI.leftStickRadius,
                (Color){50, 50, 50, 150});
    DrawCircleLines((int)g_mobileUI.leftStickCenter.x, (int)g_mobileUI.leftStickCenter.y,
                   (int)g_mobileUI.leftStickRadius, (Color){100, 100, 100, 200});

    // Left joystick knob
    Vector2 leftKnob = Vector2Add(g_mobileUI.leftStickCenter,
        Vector2Scale(g_inputState.leftJoystick, g_mobileUI.leftStickRadius));
    DrawCircleV(leftKnob, 30, (Color){80, 80, 80, 200});

    // Right joystick base
    DrawCircleV(g_mobileUI.rightStickCenter, g_mobileUI.rightStickRadius,
                (Color){50, 50, 50, 150});
    DrawCircleLines((int)g_mobileUI.rightStickCenter.x, (int)g_mobileUI.rightStickCenter.y,
                   (int)g_mobileUI.rightStickRadius, (Color){100, 100, 100, 200});

    // Right joystick knob
    Vector2 rightKnob = Vector2Add(g_mobileUI.rightStickCenter, g_inputState.rightJoystick);
    // Clamp to radius
    Vector2 delta = Vector2Subtract(rightKnob, g_mobileUI.rightStickCenter);
    if (Vector2Length(delta) > g_mobileUI.rightStickRadius) {
        delta = Vector2Scale(Vector2Normalize(delta), g_mobileUI.rightStickRadius);
        rightKnob = Vector2Add(g_mobileUI.rightStickCenter, delta);
    }
    DrawCircleV(rightKnob, 30, (Color){80, 80, 80, 200});

    // Camera button
    Color btnColor = g_inputState.cameraButtonPressed ?
        (Color){100, 100, 255, 255} : (Color){70, 70, 120, 200};
    DrawRectangleRec(g_mobileUI.cameraButtonArea, btnColor);
    DrawRectangleLinesEx(g_mobileUI.cameraButtonArea, 3, WHITE);

    // Camera icon (simple eye shape)
    Vector2 btnCenter = (Vector2){
        g_mobileUI.cameraButtonArea.x + g_mobileUI.cameraButtonArea.width / 2,
        g_mobileUI.cameraButtonArea.y + g_mobileUI.cameraButtonArea.height / 2
    };
    DrawCircleLines((int)btnCenter.x, (int)btnCenter.y, 20, WHITE);
    DrawCircleLines((int)btnCenter.x, (int)btnCenter.y, 10, WHITE);

    // Jump indicator
    Rectangle jumpArea = {
        g_mobileUI.leftStickArea.x + g_mobileUI.leftStickArea.width + 20,
        g_mobileUI.leftStickArea.y + g_mobileUI.leftStickArea.height - 80,
        60, 60
    };
    DrawRectangleRec(jumpArea, (Color){80, 80, 120, 180});
    DrawText("JUMP", jumpArea.x + 8, jumpArea.y + 20, 12, WHITE);
}

// Collision check helper
bool CheckCollisionPointRect(Vector2 point, Rectangle rect) {
    return (point.x >= rect.x && point.x <= rect.x + rect.width &&
            point.y >= rect.y && point.y <= rect.y + rect.height);
}
