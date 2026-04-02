/**
 * game.h - Main game header file
 * Voxel Minecraft-styled game in C with Raylib
 */

#ifndef GAME_H
#define GAME_H

#include "raylib.h"
#include "raymath.h"
#include <stdbool.h>

// Forward declaration for InputState (defined in input.h)
typedef struct {
    bool moveForward;
    bool moveBackward;
    bool moveLeft;
    bool moveRight;
    bool jump;
    bool sprint;
    Vector2 mouseDelta;
    Vector2 leftJoystick;
    Vector2 rightJoystick;
    bool cameraButtonPressed;
    bool cameraButtonReleased;
} InputState;

#define SCREEN_WIDTH 1280
#define SCREEN_HEIGHT 720
#define WORLD_SIZE 32
#define CHUNK_SIZE 16
#define MAX_INVENTORY_SLOTS 9
#define MAX_BLOCK_TYPES 16

// Game states
typedef enum {
    STATE_HOME,
    STATE_PLAYING,
    STATE_INVENTORY,
    STATE_EXIT
} GameState;

// Block types
typedef enum {
    BLOCK_AIR = 0,
    BLOCK_GRASS,
    BLOCK_DIRT,
    BLOCK_STONE,
    BLOCK_WOOD,
    BLOCK_LEAVES,
    BLOCK_SAND,
    BLOCK_WATER,
    BLOCK_BRICK,
    BLOCK_GLASS,
    BLOCK_WOOL,
    BLOCK_COBBLE,
    BLOCK_PLANK,
    BLOCK_SLAB,
    BLOCK_COAL,
    BLOCK_COUNT
} BlockType;

// Device types
typedef enum {
    DEVICE_PC,
    DEVICE_MOBILE
} DeviceType;

// Player structure
typedef struct {
    Vector3 position;
    Vector3 velocity;
    float yaw;
    float pitch;
    bool onGround;
} Player;

// Camera mode
typedef enum {
    CAMERA_FIRST_PERSON,
    CAMERA_THIRD_PERSON,
    CAMERA_TOP_DOWN
} CameraMode;

// Inventory slot
typedef struct {
    BlockType blockType;
    int count;
    bool selected;
} InventorySlot;

// Game structure
typedef struct {
    GameState state;
    DeviceType device;
    CameraMode cameraMode;
    Player player;
    InventorySlot inventory[MAX_INVENTORY_SLOTS];
    int selectedSlot;
    Camera3D camera;
    Texture2D blockTextures[MAX_BLOCK_TYPES];
    bool texturesLoaded;
    bool touchDevice;
    Vector2 leftJoystick;
    Vector2 rightJoystick;
} Game;

// Global game instance
extern Game g_game;

// Function declarations
void InitGame(void);
void UpdateGame(void);
void DrawGame(void);
void CloseGame(void);
void ChangeCameraMode(void);

// Block texture functions
void LoadBlockTextures(void);
void UnloadBlockTextures(void);
Texture2D GetBlockTexture(BlockType type);

// Procedural texture generation
Image GenerateProceduralTexture(BlockType type);

// Game state functions
void UpdateHomeScreen(void);
void UpdatePlaying(void);
void UpdatePlayer(InputState* input);
void UpdateCamera(void);
void SelectInventorySlot(int slot);
void DrawPlaying(void);
void DrawPlayerModel(void);

// Additional render functions
Color GetBlockColor(BlockType type);

#endif // GAME_H
