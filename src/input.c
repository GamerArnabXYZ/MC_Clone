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

void InitInput(void) {
    g_inputState.moveForward = false;
    g_inputState.moveBackward = false;
    g_inputState.moveLeft = false;
    g_inputState.moveRight = false;
    g_inputState.jump = false;
    g_inputState.sprint = false;
    g_inputState.mouseDelta = (Vector2){0, 0};
    g_inputState.leftJoystick = (Vector2){0, 0};
    g_inputState.rightJoystick = (Vector2){0, 0};
    g_inputState.cameraButtonPressed = false;
    g_inputState.cameraButtonReleased = false;

    // Setup mobile UI if touch device
    if (g_game.touchDevice) {
        g_mobileUI.leftJoystickArea.x = 0;
        g_mobileUI.leftJoystickArea.y = (float)SCREEN_HEIGHT - 250.0f;
        g_mobileUI.leftJoystickArea.width = 200.0f;
        g_mobileUI.leftJoystickArea.height = 200.0f;

        g_mobileUI.rightJoystickArea.x = (float)SCREEN_WIDTH - 200.0f;
        g_mobileUI.rightJoystickArea.y = (float)SCREEN_HEIGHT - 250.0f;
        g_mobileUI.rightJoystickArea.width = 200.0f;
        g_mobileUI.rightJoystickArea.height = 200.0f;

        g_mobileUI.cameraButtonArea.x = (float)SCREEN_WIDTH - 120.0f;
        g_mobileUI.cameraButtonArea.y = 50.0f;
        g_mobileUI.cameraButtonArea.width = 80.0f;
        g_mobileUI.cameraButtonArea.height = 80.0f;

        g_mobileUI.leftStickCenter = (Vector2){
            g_mobileUI.leftJoystickArea.x + g_mobileUI.leftJoystickArea.width / 2.0f,
            g_mobileUI.leftJoystickArea.y + g_mobileUI.leftJoystickArea.height / 2.0f
        };
        g_mobileUI.rightStickCenter = (Vector2){
            g_mobileUI.rightJoystickArea.x + g_mobileUI.rightJoystickArea.width / 2.0f,
            g_mobileUI.rightJoystickArea.y + g_mobileUI.rightJoystickArea.height / 2.0f
        };

        g_mobileUI.leftStickRadius = 50.0f;
        g_mobileUI.rightStickRadius = 50.0f;
    }

    g_leftTouchId = -1;
    g_rightTouchId = -1;
    g_inputInitialized = true;
}

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

void UpdatePCInput(void) {
    g_inputState.moveForward = IsKeyDown(KEY_W) || IsKeyDown(KEY_UP);
    g_inputState.moveBackward = IsKeyDown(KEY_S) || IsKeyDown(KEY_DOWN);
    g_inputState.moveLeft = IsKeyDown(KEY_A) || IsKeyDown(KEY_LEFT);
    g_inputState.moveRight = IsKeyDown(KEY_D) || IsKeyDown(KEY_RIGHT);
    g_inputState.jump = IsKeyDown(KEY_SPACE);
    g_inputState.sprint = IsKeyDown(KEY_LEFT_SHIFT);

    // Mouse movement - use Raylib's built-in delta (correct & efficient)
    g_inputState.mouseDelta = GetMouseDelta();

    // ESC to unlock cursor
    if (IsKeyPressed(KEY_ESCAPE)) {
        EnableCursor();
    }
}

void UpdateMobileInput(void) {
    int touchCount = GetTouchPointCount();

    // Handle touch inputs
    for (int i = 0; i < touchCount; i++) {
        Vector2 touchPos = GetTouchPosition(i);

        bool inLeftArea = CheckCollisionPointRec(touchPos, g_mobileUI.leftJoystickArea);
        bool inRightArea = CheckCollisionPointRec(touchPos, g_mobileUI.rightJoystickArea);
        bool inCameraArea = CheckCollisionPointRec(touchPos, g_mobileUI.cameraButtonArea);

        // Assign touch to left joystick
        if (inLeftArea && g_leftTouchId == -1) {
            g_leftTouchId = i;
            g_leftTouchStart = touchPos;
        }

        // Assign touch to right joystick
        if (inRightArea && g_rightTouchId == -1) {
            g_rightTouchId = i;
            g_rightTouchStart = touchPos;
        }

        // Camera button
        if (inCameraArea) {
            g_inputState.cameraButtonPressed = true;
        }

        // Update left joystick value
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

        // Update right joystick (camera look control)
        if (g_rightTouchId == i) {
            Vector2 delta = Vector2Subtract(touchPos, g_rightTouchStart);
            // Scale delta for sensitivity - use as per-frame look delta
            g_inputState.mouseDelta = (Vector2){
                delta.x * 0.5f,
                delta.y * 0.5f
            };
            g_inputState.rightJoystick = delta;
            // Update start to current pos so next frame delta is relative
            g_rightTouchStart = touchPos;
        }

        // Jump - tap outside joystick areas
        if (!inLeftArea && !inRightArea && !inCameraArea) {
            g_inputState.jump = true;
        }
    }

    // Release touches - check if tracked touch IDs are no longer active
    bool leftStillActive = false;
    bool rightStillActive = false;
    for (int i = 0; i < touchCount; i++) {
        if (i == g_leftTouchId)  leftStillActive  = true;
        if (i == g_rightTouchId) rightStillActive = true;
    }
    if (g_leftTouchId != -1 && !leftStillActive) {
        g_leftTouchId = -1;
        g_inputState.leftJoystick = (Vector2){0, 0};
    }
    if (g_rightTouchId != -1 && !rightStillActive) {
        g_rightTouchId = -1;
        g_inputState.mouseDelta = (Vector2){0, 0};
        g_inputState.rightJoystick = (Vector2){0, 0};
    }
}

InputState GetInputState(void) {
    UpdateInput();
    return g_inputState;
}

bool IsTouchDevice(void) {
    return IsMobile();
}

void CloseInput(void) {
    g_inputInitialized = false;
}

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

    // Camera icon
    Vector2 btnCenter = (Vector2){
        g_mobileUI.cameraButtonArea.x + g_mobileUI.cameraButtonArea.width / 2.0f,
        g_mobileUI.cameraButtonArea.y + g_mobileUI.cameraButtonArea.height / 2.0f
    };
    DrawCircleLines((int)btnCenter.x, (int)btnCenter.y, 20, WHITE);
    DrawCircleLines((int)btnCenter.x, (int)btnCenter.y, 10, WHITE);

    // Jump indicator
    Rectangle jumpArea = {
        g_mobileUI.leftJoystickArea.x + g_mobileUI.leftJoystickArea.width + 20.0f,
        g_mobileUI.leftJoystickArea.y + g_mobileUI.leftJoystickArea.height - 80.0f,
        60, 60
    };
    DrawRectangleRec(jumpArea, (Color){80, 80, 120, 180});
    DrawText("JUMP", (int)(jumpArea.x + 8), (int)(jumpArea.y + 20), 12, WHITE);
}
