/**
 * world.h - World/voxel chunk management
 */

#ifndef WORLD_H
#define WORLD_H

#include "game.h"

#define MAX_CHUNKS 8
#define VOXEL_AIR 0
#define VOXEL_GRASS 1
#define VOXEL_DIRT 2
#define VOXEL_STONE 3
#define VOXEL_WOOD 4
#define VOXEL_LEAVES 5

// Chunk structure
typedef struct {
    Vector3 position;
    int voxels[CHUNK_SIZE][CHUNK_SIZE][CHUNK_SIZE];
    bool dirty;
    bool loaded;
} Chunk;

// World management
void InitWorld(void);
void UpdateWorld(void);
void DrawWorld(void);
void CloseWorld(void);

int GetVoxel(int x, int y, int z);
void SetVoxel(int x, int y, int z, int type);
bool IsVoxelOpaque(int x, int y, int z);

void GenerateTerrain(int chunkX, int chunkZ);
int GetBlockAt(Vector3 pos);

// Face definitions
#define FACE_TOP 0
#define FACE_BOTTOM 1
#define FACE_FRONT 2
#define FACE_BACK 3
#define FACE_LEFT 4
#define FACE_RIGHT 5

// Voxel face drawing
void DrawVoxelFace(Vector3 position, int face, BlockType type);
Color GetBlockColor(BlockType type);

#endif // WORLD_H

// ── Raycast result (ClassiCube Picking.c style) ────────────────────────────
typedef struct {
    bool hit;
    int  blockX, blockY, blockZ;   // hit block coords
    int  normalX, normalY, normalZ;// face normal
    int  placeX,  placeY,  placeZ; // adjacent block for placement
} RaycastResult;

RaycastResult CastRay(Vector3 origin, Vector3 dir, float reach);
void          DrawBlockHighlight(RaycastResult* r);
