/**
 * input.c - Cross-platform input handling
 * Adapted from ClassiCube's TouchUI.c, Input.c (BSD-3 License)
 * https://github.com/ClassiCube/ClassiCube
 */

#include "input.h"
#include "game.h"
#include "raymath.h"
#include <stdlib.h>
#include <math.h>

// ── State ─────────────────────────────────────────────────────────────────
static InputState  g_inputState;
static MobileUI    g_mobileUI;
static bool        g_inputInitialized = false;

// ── Touch tracking (ClassiCube style multi-touch) ─────────────────────────
// Each touch slot tracks: which area it belongs to and its start position.
#define MAX_TOUCHES 10
typedef enum {
    TOUCH_NONE   = 0,
    TOUCH_LEFT   = 1,  // left joystick area
    TOUCH_RIGHT  = 2,  // right look area
    TOUCH_JUMP   = 3,  // jump button
    TOUCH_CAM    = 4   // camera toggle button
} TouchArea;

static struct {
    int      id;        // touch point index (-1 = free)
    TouchArea area;
    Vector2  start;
    Vector2  last;
} g_touches[MAX_TOUCHES];

static void Touches_Init(void) {
    for (int i = 0; i < MAX_TOUCHES; i++) g_touches[i].id = -1;
}

static int Touches_Find(int id) {
    for (int i = 0; i < MAX_TOUCHES; i++)
        if (g_touches[i].id == id) return i;
    return -1;
}

static int Touches_Alloc(int id, TouchArea area, Vector2 pos) {
    for (int i = 0; i < MAX_TOUCHES; i++) {
        if (g_touches[i].id != -1) continue;
        g_touches[i].id    = id;
        g_touches[i].area  = area;
        g_touches[i].start = pos;
        g_touches[i].last  = pos;
        return i;
    }
    return -1;
}

static void Touches_Free(int slot) {
    g_touches[slot].id   = -1;
    g_touches[slot].area = TOUCH_NONE;
}

// ── Mobile UI layout (ClassiCube-inspired positioning) ────────────────────
static void InitMobileUI(void) {
    float sw = (float)SCREEN_WIDTH;
    float sh = (float)SCREEN_HEIGHT;

    // Left thumbstick - bottom left quadrant (ClassiCube: ANCHOR_MIN, ANCHOR_MAX)
    g_mobileUI.leftJoystickArea  = (Rectangle){ 10, sh - 230, 200, 200 };
    g_mobileUI.leftStickCenter   = (Vector2){ 10 + 100, sh - 230 + 100 };
    g_mobileUI.leftStickRadius   = 70.0f;

    // Right look area - right 60% of screen, top 75% height
    // (ClassiCube: entire right side is look area when not hitting buttons)
    g_mobileUI.rightJoystickArea  = (Rectangle){ sw * 0.35f, 0, sw * 0.65f, sh * 0.75f };
    g_mobileUI.rightStickCenter   = (Vector2){ sw * 0.72f, sh * 0.55f };
    g_mobileUI.rightStickRadius   = 80.0f;

    // Jump button - bottom right corner (ClassiCube: ANCHOR_MAX, ANCHOR_MAX)
    g_mobileUI.jumpButtonArea     = (Rectangle){ sw - 130, sh - 130, 110, 110 };

    // Camera toggle button - top right
    g_mobileUI.cameraButtonArea   = (Rectangle){ sw - 100, 10, 88, 60 };
}

// ── Init / Close ──────────────────────────────────────────────────────────
void InitInput(void) {
    g_inputState = (InputState){0};
    Touches_Init();

#if defined(PLATFORM_WEB) || defined(PLATFORM_ANDROID)
    g_game.touchDevice = true;
    g_game.device      = DEVICE_MOBILE;
#endif

    InitMobileUI();
    g_inputInitialized = true;
}

void CloseInput(void) {
    g_inputInitialized = false;
}

// ── PC Input ───────────────────────────────────────────────────────────────
void UpdatePCInput(void) {
    g_inputState.moveForward  = IsKeyDown(KEY_W) || IsKeyDown(KEY_UP);
    g_inputState.moveBackward = IsKeyDown(KEY_S) || IsKeyDown(KEY_DOWN);
    g_inputState.moveLeft     = IsKeyDown(KEY_A) || IsKeyDown(KEY_LEFT);
    g_inputState.moveRight    = IsKeyDown(KEY_D) || IsKeyDown(KEY_RIGHT);
    g_inputState.jump         = IsKeyPressed(KEY_SPACE);
    g_inputState.sprint       = IsKeyDown(KEY_LEFT_SHIFT);

    // Use Raylib's built-in mouse delta (correct, no lag)
    g_inputState.mouseDelta = GetMouseDelta();

    // Block interaction via mouse buttons
    g_inputState.placeBlock  = IsMouseButtonPressed(MOUSE_BUTTON_RIGHT);
    g_inputState.breakBlock  = IsMouseButtonPressed(MOUSE_BUTTON_LEFT);

    if (IsKeyPressed(KEY_ESCAPE)) EnableCursor();
}

// ── Mobile Input (ClassiCube-style multi-touch) ───────────────────────────
void UpdateMobileInput(void) {
    int touchCount = GetTouchPointCount();
    bool leftActive  = false;
    bool rightActive = false;

    // Reset per-frame states
    g_inputState.mouseDelta   = (Vector2){0, 0};
    g_inputState.leftJoystick = (Vector2){0, 0};
    g_inputState.jump         = false;
    g_inputState.placeBlock   = false;
    g_inputState.breakBlock   = false;

    // ── Process new/ongoing touches ────────────────────────────────────────
    for (int i = 0; i < touchCount && i < MAX_TOUCHES; i++) {
        Vector2 pos = GetTouchPosition(i);
        int slot    = Touches_Find(i);

        if (slot == -1) {
            // New touch — classify its area (ClassiCube: PointerDown logic)
            TouchArea area = TOUCH_NONE;

            if (CheckCollisionPointRec(pos, g_mobileUI.jumpButtonArea)) {
                area = TOUCH_JUMP;
                g_inputState.jump = true;
            } else if (CheckCollisionPointRec(pos, g_mobileUI.cameraButtonArea)) {
                area = TOUCH_CAM;
                g_inputState.cameraButtonPressed = true;
            } else if (CheckCollisionPointRec(pos, g_mobileUI.leftJoystickArea)) {
                area = TOUCH_LEFT;
            } else {
                // Everything else = look/camera area (ClassiCube's right-side behaviour)
                area = TOUCH_RIGHT;
            }

            Touches_Alloc(i, area, pos);
        } else {
            // Existing touch — update
            Vector2 delta = Vector2Subtract(pos, g_touches[slot].last);

            if (g_touches[slot].area == TOUCH_LEFT) {
                // Left thumbstick: normalize relative to initial start
                Vector2 d = Vector2Subtract(pos, g_touches[slot].start);
                float   r = g_mobileUI.leftStickRadius;
                float   len = Vector2Length(d);
                if (len > r) {
                    d = Vector2Scale(Vector2Normalize(d), r);
                }
                g_inputState.leftJoystick = (Vector2){
                    d.x / r,
                    d.y / r
                };
                leftActive = true;

            } else if (g_touches[slot].area == TOUCH_RIGHT) {
                // Look area: delta from last frame = camera rotation
                // ClassiCube: Camera.Sensitivity scales this
                g_inputState.mouseDelta = (Vector2){
                    delta.x * 0.4f,
                    delta.y * 0.4f
                };
                rightActive = true;

            } else if (g_touches[slot].area == TOUCH_JUMP) {
                g_inputState.jump = true;
            }

            g_touches[slot].last = pos;
        }
    }

    // ── Release finished touches ───────────────────────────────────────────
    for (int s = 0; s < MAX_TOUCHES; s++) {
        if (g_touches[s].id == -1) continue;
        bool still_active = false;
        for (int i = 0; i < touchCount; i++) {
            if (i == g_touches[s].id) { still_active = true; break; }
        }
        if (!still_active) {
            if (g_touches[s].area == TOUCH_RIGHT) {
                g_inputState.mouseDelta = (Vector2){0, 0};
            }
            Touches_Free(s);
        }
    }

    if (!leftActive)  g_inputState.leftJoystick = (Vector2){0, 0};
    if (!rightActive) g_inputState.mouseDelta   = (Vector2){0, 0};
}

// ── UpdateInput ────────────────────────────────────────────────────────────
void UpdateInput(void) {
    if (!g_inputInitialized) return;

    // Reset per-frame
    g_inputState.jump               = false;
    g_inputState.placeBlock         = false;
    g_inputState.breakBlock         = false;
    g_inputState.cameraButtonPressed = false;
    g_inputState.mouseDelta         = (Vector2){0, 0};

#if defined(PLATFORM_WEB)
    // Web: always use mobile UI (thumb joystick always visible)
    // Also read keyboard as bonus for desktop browsers
    g_game.touchDevice = true;
    g_game.device      = DEVICE_MOBILE;
    UpdateMobileInput();
    if (IsKeyDown(KEY_W) || IsKeyDown(KEY_UP))    g_inputState.moveForward  = true;
    if (IsKeyDown(KEY_S) || IsKeyDown(KEY_DOWN))  g_inputState.moveBackward = true;
    if (IsKeyDown(KEY_A) || IsKeyDown(KEY_LEFT))  g_inputState.moveLeft     = true;
    if (IsKeyDown(KEY_D) || IsKeyDown(KEY_RIGHT)) g_inputState.moveRight    = true;
    if (IsKeyDown(KEY_SPACE))                     g_inputState.jump         = true;
#else
    if (!g_game.touchDevice) {
        UpdatePCInput();
    } else {
        UpdateMobileInput();
    }
#endif
}

InputState GetInputState(void) {
    UpdateInput();
    return g_inputState;
}

bool IsTouchDevice(void) {
#if defined(PLATFORM_ANDROID) || defined(PLATFORM_WEB)
    return true;
#else
    return false;
#endif
}

// ── Draw Mobile Controls (ClassiCube ThumbstickWidget style) ──────────────
void DrawMobileControls(void) {
    // Left thumbstick base (ClassiCube: semi-transparent circle)
    DrawCircleV(g_mobileUI.leftStickCenter, g_mobileUI.leftStickRadius,
                (Color){30, 30, 30, 140});
    DrawRing(g_mobileUI.leftStickCenter,
             g_mobileUI.leftStickRadius - 4, g_mobileUI.leftStickRadius,
             0, 360, 32, (Color){255, 255, 255, 120});

    // Left thumbstick knob
    Vector2 knobPos = Vector2Add(g_mobileUI.leftStickCenter,
        Vector2Scale(g_inputState.leftJoystick, g_mobileUI.leftStickRadius * 0.65f));
    DrawCircleV(knobPos, 28, (Color){255, 255, 255, 180});
    DrawCircleV(knobPos, 22, (Color){100, 160, 220, 220});

    // Direction arrows on thumbstick (ClassiCube style)
    float r = g_mobileUI.leftStickRadius;
    Vector2 c = g_mobileUI.leftStickCenter;
    float arrow = 10.0f;
    // Up arrow
    DrawTriangle(
        (Vector2){c.x, c.y - r + 6},
        (Vector2){c.x - arrow, c.y - r + 6 + arrow * 1.5f},
        (Vector2){c.x + arrow, c.y - r + 6 + arrow * 1.5f},
        (Color){255,255,255,160});
    // Down arrow
    DrawTriangle(
        (Vector2){c.x, c.y + r - 6},
        (Vector2){c.x + arrow, c.y + r - 6 - arrow * 1.5f},
        (Vector2){c.x - arrow, c.y + r - 6 - arrow * 1.5f},
        (Color){255,255,255,160});
    // Left arrow
    DrawTriangle(
        (Vector2){c.x - r + 6, c.y},
        (Vector2){c.x - r + 6 + arrow*1.5f, c.y - arrow},
        (Vector2){c.x - r + 6 + arrow*1.5f, c.y + arrow},
        (Color){255,255,255,160});
    // Right arrow
    DrawTriangle(
        (Vector2){c.x + r - 6, c.y},
        (Vector2){c.x + r - 6 - arrow*1.5f, c.y + arrow},
        (Vector2){c.x + r - 6 - arrow*1.5f, c.y - arrow},
        (Color){255,255,255,160});

    // Jump button (ClassiCube: solid rounded rect with label)
    Rectangle jb = g_mobileUI.jumpButtonArea;
    DrawRectangleRounded(jb, 0.3f, 8, (Color){60, 120, 220, 200});
    DrawRectangleRoundedLines(jb, 0.3f, 8, (Color){180, 210, 255, 255});
    DrawText("JUMP",
        (int)(jb.x + jb.width/2 - MeasureText("JUMP", 16)/2),
        (int)(jb.y + jb.height/2 - 8), 16, WHITE);

    // Camera toggle button (ClassiCube: top right)
    Rectangle cb = g_mobileUI.cameraButtonArea;
    Color camCol = g_inputState.cameraButtonPressed ?
        (Color){100, 180, 255, 240} : (Color){40, 40, 60, 180};
    DrawRectangleRounded(cb, 0.3f, 8, camCol);
    DrawRectangleRoundedLines(cb, 0.3f, 8, (Color){200, 200, 255, 200});
    DrawText("CAM",
        (int)(cb.x + cb.width/2 - MeasureText("CAM", 13)/2),
        (int)(cb.y + cb.height/2 - 7), 13, WHITE);

    // Break button - bottom right, above jump (ClassiCube: Delete button)
    float sw = (float)SCREEN_WIDTH;
    float sh = (float)SCREEN_HEIGHT;
    Rectangle bb = { sw - 250, sh - 130, 100, 110 };
    DrawRectangleRounded(bb, 0.3f, 8, (Color){200, 60, 60, 180});
    DrawRectangleRoundedLines(bb, 0.3f, 8, (Color){255, 150, 150, 200});
    DrawText("BREAK",
        (int)(bb.x + bb.width/2 - MeasureText("BREAK", 13)/2),
        (int)(bb.y + bb.height/2 - 7), 13, WHITE);

    // Place button - next to break (ClassiCube: Place button)
    Rectangle pb = { sw - 370, sh - 130, 100, 110 };
    DrawRectangleRounded(pb, 0.3f, 8, (Color){60, 180, 60, 180});
    DrawRectangleRoundedLines(pb, 0.3f, 8, (Color){150, 255, 150, 200});
    DrawText("PLACE",
        (int)(pb.x + pb.width/2 - MeasureText("PLACE", 13)/2),
        (int)(pb.y + pb.height/2 - 7), 13, WHITE);
}
