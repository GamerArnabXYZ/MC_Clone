/**
 * world.c - Voxel world/chunk management
 */

#include "world.h"
#include "game.h"
#include <stdlib.h>
#include <math.h>
#include <time.h>

// World voxels array
static int g_worldVoxels[WORLD_SIZE][WORLD_SIZE][WORLD_SIZE];

// Noise function for terrain generation (simplified Perlin-like noise)
static float Noise2D(int x, int z) {
    int n = x + z * 57;
    n = (n << 13) ^ n;
    float noise = (1.0f - ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0f);
    return noise;
}

static float SmoothNoise(int x, int z) {
    float corners = (Noise2D(x-1, z-1) + Noise2D(x+1, z-1) +
                    Noise2D(x-1, z+1) + Noise2D(x+1, z+1)) / 16.0f;
    float sides = (Noise2D(x-1, z) + Noise2D(x+1, z) +
                  Noise2D(x, z-1) + Noise2D(x, z+1)) / 8.0f;
    float center = Noise2D(x, z) / 4.0f;

    return corners + sides + center;
}

static float InterpolatedNoise(int x, int z) {
    int intX = x / 16;
    int intZ = z / 16;
    float fracX = (float)(x % 16) / 16.0f;
    float fracZ = (float)(z % 16) / 16.0f;

    float v1 = SmoothNoise(intX, intZ);
    float v2 = SmoothNoise(intX + 1, intZ);
    float v3 = SmoothNoise(intX, intZ + 1);
    float v4 = SmoothNoise(intX + 1, intZ + 1);

    float i1 = v1 * (1.0f - fracX) + v2 * fracX;
    float i2 = v3 * (1.0f - fracX) + v4 * fracX;

    return i1 * (1.0f - fracZ) + i2 * fracZ;
}

// Simple heightmap for terrain
static int GetTerrainHeight(int x, int z) {
    float noise = InterpolatedNoise(x, z);
    return (int)(8.0f + noise * 10.0f);
}

// Initialize world
void InitWorld(void) {
    // Seed random for terrain generation
    srand((unsigned int)time(NULL));

    // Clear all voxels
    for (int x = 0; x < WORLD_SIZE; x++) {
        for (int y = 0; y < WORLD_SIZE; y++) {
            for (int z = 0; z < WORLD_SIZE; z++) {
                g_worldVoxels[x][y][z] = BLOCK_AIR;
            }
        }
    }

    // Generate terrain
    GenerateTerrain(0, 0);
}

// Generate terrain for a region
void GenerateTerrain(int chunkX, int chunkZ) {
    int baseX = chunkX * CHUNK_SIZE;
    int baseZ = chunkZ * CHUNK_SIZE;

    for (int x = 0; x < WORLD_SIZE; x++) {
        for (int z = 0; z < WORLD_SIZE; z++) {
            int worldX = baseX + x;
            int worldZ = baseZ + z;

            // Skip if out of world bounds
            if (worldX < 0 || worldX >= WORLD_SIZE || worldZ < 0 || worldZ >= WORLD_SIZE) continue;

            int height = GetTerrainHeight(worldX, worldZ);

            // Clamp height to valid range
            if (height < 1) height = 1;
            if (height >= WORLD_SIZE - 1) height = WORLD_SIZE - 2;

            for (int y = 0; y < WORLD_SIZE; y++) {
                if (y == 0) {
                    // Bedrock at bottom
                    g_worldVoxels[worldX][y][worldZ] = BLOCK_STONE;
                } else if (y < height - 3) {
                    // Underground - stone
                    g_worldVoxels[worldX][y][worldZ] = BLOCK_STONE;
                } else if (y < height) {
                    // Dirt layer
                    g_worldVoxels[worldX][y][worldZ] = BLOCK_DIRT;
                } else if (y == height) {
                    // Surface - grass
                    g_worldVoxels[worldX][y][worldZ] = BLOCK_GRASS;
                } else if (y <= 4) {
                    // Water level
                    g_worldVoxels[worldX][y][worldZ] = BLOCK_WATER;
                } else {
                    // Above water
                    g_worldVoxels[worldX][y][worldZ] = BLOCK_AIR;
                }
            }

            // Add trees occasionally
            if (height > 5 && (worldX % 7 == 0) && (worldZ % 9 == 0)) {
                int treeHeight = 4 + (rand() % 3);
                int treeBase = height + 1;

                for (int ty = 0; ty < treeHeight; ty++) {
                    int targetY = treeBase + ty;
                    if (targetY >= 0 && targetY < WORLD_SIZE) {
                        g_worldVoxels[worldX][targetY][worldZ] = BLOCK_WOOD;
                    }
                }
                // Leaves
                for (int dx = -2; dx <= 2; dx++) {
                    for (int dz = -2; dz <= 2; dz++) {
                        for (int dy = treeHeight - 2; dy <= treeHeight + 1; dy++) {
                            int lx = worldX + dx;
                            int lz = worldZ + dz;
                            int targetY = treeBase + dy;

                            if (lx >= 0 && lx < WORLD_SIZE &&
                                lz >= 0 && lz < WORLD_SIZE &&
                                targetY >= 0 && targetY < WORLD_SIZE) {
                                if (g_worldVoxels[lx][targetY][lz] == BLOCK_AIR) {
                                    if (abs(dx) + abs(dz) <= 3) {
                                        g_worldVoxels[lx][targetY][lz] = BLOCK_LEAVES;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// Update world (chunk loading/unloading)
void UpdateWorld(void) {
    // Currently static world - can add chunk loading here for larger worlds
}

// Get voxel at world coordinates
int GetVoxel(int x, int y, int z) {
    if (x < 0 || x >= WORLD_SIZE || y < 0 || y >= WORLD_SIZE || z < 0 || z >= WORLD_SIZE) {
        return BLOCK_AIR;
    }
    return g_worldVoxels[x][y][z];
}

// Set voxel at world coordinates
void SetVoxel(int x, int y, int z, int type) {
    if (x < 0 || x >= WORLD_SIZE || y < 0 || y >= WORLD_SIZE || z < 0 || z >= WORLD_SIZE) {
        return;
    }
    g_worldVoxels[x][y][z] = type;
}

// Check if voxel is opaque (for face culling)
bool IsVoxelOpaque(int x, int y, int z) {
    int voxel = GetVoxel(x, y, z);
    return voxel != BLOCK_AIR && voxel != BLOCK_WATER;
}

// Get block at position (for collision)
int GetBlockAt(Vector3 pos) {
    int x = (int)pos.x;
    int y = (int)pos.y;
    int z = (int)pos.z;
    return GetVoxel(x, y, z);
}

// Draw the voxel world
void DrawWorld(void) {
    for (int x = 0; x < WORLD_SIZE; x++) {
        for (int y = 0; y < WORLD_SIZE; y++) {
            for (int z = 0; z < WORLD_SIZE; z++) {
                int voxel = g_worldVoxels[x][y][z];

                if (voxel == BLOCK_AIR) continue;

                Vector3 pos = (Vector3){(float)x, (float)y, (float)z};

                // Only draw visible faces (face culling)
                if (!IsVoxelOpaque(x, y + 1, z)) {
                    DrawVoxelFace(pos, FACE_TOP, voxel);
                }
                if (!IsVoxelOpaque(x, y - 1, z)) {
                    DrawVoxelFace(pos, FACE_BOTTOM, voxel);
                }
                if (!IsVoxelOpaque(x, y, z - 1)) {
                    DrawVoxelFace(pos, FACE_FRONT, voxel);
                }
                if (!IsVoxelOpaque(x, y, z + 1)) {
                    DrawVoxelFace(pos, FACE_BACK, voxel);
                }
                if (!IsVoxelOpaque(x - 1, y, z)) {
                    DrawVoxelFace(pos, FACE_LEFT, voxel);
                }
                if (!IsVoxelOpaque(x + 1, y, z)) {
                    DrawVoxelFace(pos, FACE_RIGHT, voxel);
                }
            }
        }
    }
}

// Close world
void CloseWorld(void) {
    // Cleanup if needed
}

// Draw a single voxel
void DrawVoxel(Vector3 position, BlockType type) {
    Color color = GetBlockColor(type);
    DrawCubeV(position, (Vector3){1.0f, 1.0f, 1.0f}, color);
    DrawCubeWiresV(position, (Vector3){1.0f, 1.0f, 1.0f}, DARKGRAY);
}

// Draw a single face of a voxel
void DrawVoxelFace(Vector3 position, int face, BlockType type) {
    Color color = GetBlockColor(type);

    // Adjust color based on face for depth perception (ambient occlusion fake)
    switch (face) {
        case FACE_TOP:
            color = ColorBrightness(color, 0.1f);
            break;
        case FACE_BOTTOM:
            color = ColorBrightness(color, -0.3f);
            break;
        case FACE_LEFT:
        case FACE_FRONT:
            color = ColorBrightness(color, -0.15f);
            break;
        case FACE_BACK:
        case FACE_RIGHT:
            color = ColorBrightness(color, -0.05f);
            break;
        default:
            break;
    }

    float x = position.x + 0.5f;
    float y = position.y + 0.5f;
    float z = position.z + 0.5f;
    float h = 0.5f; // half-size

    // Use DrawTriangle3D to build quads (2 triangles per face)
    // Winding order: counter-clockwise for front-facing
    switch (face) {
        case FACE_TOP: {
            Vector3 v0 = {x - h, y + h, z - h};
            Vector3 v1 = {x - h, y + h, z + h};
            Vector3 v2 = {x + h, y + h, z + h};
            Vector3 v3 = {x + h, y + h, z - h};
            DrawTriangle3D(v0, v1, v2, color);
            DrawTriangle3D(v0, v2, v3, color);
            break;
        }
        case FACE_BOTTOM: {
            Vector3 v0 = {x - h, y - h, z + h};
            Vector3 v1 = {x - h, y - h, z - h};
            Vector3 v2 = {x + h, y - h, z - h};
            Vector3 v3 = {x + h, y - h, z + h};
            DrawTriangle3D(v0, v1, v2, color);
            DrawTriangle3D(v0, v2, v3, color);
            break;
        }
        case FACE_FRONT: { // -Z face
            Vector3 v0 = {x + h, y - h, z - h};
            Vector3 v1 = {x + h, y + h, z - h};
            Vector3 v2 = {x - h, y + h, z - h};
            Vector3 v3 = {x - h, y - h, z - h};
            DrawTriangle3D(v0, v1, v2, color);
            DrawTriangle3D(v0, v2, v3, color);
            break;
        }
        case FACE_BACK: { // +Z face
            Vector3 v0 = {x - h, y - h, z + h};
            Vector3 v1 = {x - h, y + h, z + h};
            Vector3 v2 = {x + h, y + h, z + h};
            Vector3 v3 = {x + h, y - h, z + h};
            DrawTriangle3D(v0, v1, v2, color);
            DrawTriangle3D(v0, v2, v3, color);
            break;
        }
        case FACE_LEFT: { // -X face
            Vector3 v0 = {x - h, y - h, z - h};
            Vector3 v1 = {x - h, y + h, z - h};
            Vector3 v2 = {x - h, y + h, z + h};
            Vector3 v3 = {x - h, y - h, z + h};
            DrawTriangle3D(v0, v1, v2, color);
            DrawTriangle3D(v0, v2, v3, color);
            break;
        }
        case FACE_RIGHT: { // +X face
            Vector3 v0 = {x + h, y - h, z + h};
            Vector3 v1 = {x + h, y + h, z + h};
            Vector3 v2 = {x + h, y + h, z - h};
            Vector3 v3 = {x + h, y - h, z - h};
            DrawTriangle3D(v0, v1, v2, color);
            DrawTriangle3D(v0, v2, v3, color);
            break;
        }
    }
}

// Get block color
Color GetBlockColor(BlockType type) {
    switch (type) {
        case BLOCK_GRASS:    return (Color){86, 174, 57, 255};
        case BLOCK_DIRT:     return (Color){134, 96, 67, 255};
        case BLOCK_STONE:    return (Color){128, 128, 128, 255};
        case BLOCK_WOOD:     return (Color){139, 90, 43, 255};
        case BLOCK_LEAVES:   return (Color){34, 139, 34, 255};
        case BLOCK_SAND:     return (Color){238, 214, 175, 255};
        case BLOCK_WATER:    return (Color){64, 164, 223, 200};
        case BLOCK_BRICK:    return (Color){178, 34, 34, 255};
        case BLOCK_GLASS:    return (Color){255, 255, 255, 150};
        case BLOCK_WOOL:     return (Color){245, 245, 245, 255};
        case BLOCK_COBBLE:   return (Color){104, 104, 104, 255};
        case BLOCK_PLANK:    return (Color){205, 170, 125, 255};
        case BLOCK_SLAB:     return (Color){166, 124, 82, 255};
        case BLOCK_COAL:     return (Color){37, 37, 37, 255};
        default:             return (Color){200, 200, 200, 255};
    }
}
