/**
 * android/app/src/main/cpp/main.c
 * Android entry point for VoxelCraft (Raylib-based)
 *
 * Raylib on Android uses NativeActivity internally.
 * This file is a Raylib-compatible entry point that delegates
 * to the main game loop. Raylib handles EGL/GL setup automatically.
 */

#include <android/log.h>

#define LOG_TAG "VoxelCraft"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO,  LOG_TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)

// Raylib entry point (defined in raylib's android_native_app_glue / rcore.c)
// The actual game main() is in src/main.c — Raylib links them together.
// Nothing else needed here; Raylib's android build provides android_main().

