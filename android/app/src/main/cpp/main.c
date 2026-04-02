#include <jni.h>
#include <android/log.h>
#include <android/input.h>
#include <EGL/egl.h>
#include <GLES2/gl2.h>

#define LOG_TAG "VoxelCraft"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)

// Forward declarations for game functions
extern void InitGame(void);
extern void UpdateGame(void);
extern void RenderGame(void);
extern void CloseGame(void);

static struct {
    JNIEnv *env;
    jobject activity;
    ANativeWindow *window;
} g_android;

JNIEXPORT void JNICALL
Java_com_voxelcraft_game_MainActivity_nativeInit(JNIEnv *env, jobject thiz) {
    LOGI("VoxelCraft Android: Initializing native engine...");

    g_android.env = env;
    g_android.activity = (*env)->NewGlobalRef(env, thiz);

    // Get window
    ANativeActivity *activity = AActivity_getNativeActivity(thiz);
    g_android.window = ANativeActivity_getWindow(activity);

    LOGI("VoxelCraft Android: Native init complete");
}

JNIEXPORT void JNICALL
Java_com_voxelcraft_game_MainActivity_nativeRender(JNIEnv *env, jobject thiz) {
    // Game render loop would be handled here
}
