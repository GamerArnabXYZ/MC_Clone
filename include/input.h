/**
 * input.h - Cross-platform input handling
 * Adapted from ClassiCube's TouchUI.c, Input.h (BSD-3 License)
 */

#ifndef INPUT_H
#define INPUT_H

#include "game.h"

// Mobile UI layout (ClassiCube-style)
typedef struct {
    Rectangle leftJoystickArea;
    Rectangle rightJoystickArea;
    Rectangle jumpButtonArea;
    Rectangle cameraButtonArea;
    Vector2   leftStickCenter;
    Vector2   rightStickCenter;
    float     leftStickRadius;
    float     rightStickRadius;
} MobileUI;

// Function declarations
void       InitInput(void);
void       UpdateInput(void);
void       CloseInput(void);
void       UpdatePCInput(void);
void       UpdateMobileInput(void);
InputState GetInputState(void);
bool       IsTouchDevice(void);
void       DrawMobileControls(void);

#endif // INPUT_H
