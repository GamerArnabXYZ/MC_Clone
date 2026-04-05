/* Renderers.h - AxisLinesRenderer, HeldBlockRenderer, SelOutlineRenderer,
                 IsometricDrawer, SelectionBox, Picking merged */

/* ===== AxisLinesRenderer.h ===== */
#ifndef CC_AXISLINESRENDERER_H
#define CC_AXISLINESRENDERER_H
#include "Core.h"
/* Renders 3 lines showing direction of each axis.
   Copyright 2014-2025 ClassiCube | Licensed under BSD-3
*/
CC_BEGIN_HEADER

struct IGameComponent;
extern struct IGameComponent AxisLinesRenderer_Component;
/* Whether the 3 axis lines should be rendered */
extern cc_bool AxisLinesRenderer_Enabled;

void AxisLinesRenderer_Render(void);

CC_END_HEADER
#endif

/* ===== HeldBlockRenderer.h ===== */
#ifndef CC_HELDBLOCKRENDERER_H
#define CC_HELDBLOCKRENDERER_H
CC_BEGIN_HEADER

/* 
Renders the held block/arm at bottom right of game
Copyright 2014-2025 ClassiCube | Licensed under BSD-3
*/
struct IGameComponent;
extern struct IGameComponent HeldBlockRenderer_Component;
/* Whether held block/arm should be shown at all. */
extern cc_bool HeldBlockRenderer_Show;

void HeldBlockRenderer_ClickAnim(cc_bool digging);
void HeldBlockRenderer_Render(float delta);

CC_END_HEADER
#endif

/* ===== SelOutlineRenderer.h ===== */
#ifndef CC_SELOUTLINERENDERER_H
#define CC_SELOUTLINERENDERER_H
CC_BEGIN_HEADER

/* Renders an outline around the block the player is looking at.
   Copyright 2014-2025 ClassiCube | Licensed under BSD-3
*/
struct RayTracer;
struct IGameComponent;
extern struct IGameComponent SelOutlineRenderer_Component;

void SelOutlineRenderer_Render(struct RayTracer* selected, cc_bool dirty);

CC_END_HEADER
#endif

/* ===== IsometricDrawer.h ===== */
#ifndef CC_ISOMETRICDRAWER_H
#define CC_ISOMETRICDRAWER_H
CC_BEGIN_HEADER

/* Draws 2D isometric blocks for the hotbar and inventory UIs.
   Copyright 2014-2025 ClassiCube | Licensed under BSD-3
*/
struct VertexTextured;

/* Maximum number of vertices used to draw a block in isometric way. */
#define ISOMETRICDRAWER_MAXVERTICES 12

/* Sets up state to begin drawing blocks isometrically */
void IsometricDrawer_BeginBatch(struct VertexTextured* vertices, int* state);
/* Buffers the vertices needed to draw the given block at the given position */
void IsometricDrawer_AddBatch(BlockID block, float size, float x, float y);
/* Returns the number of buffered vertices */
int  IsometricDrawer_EndBatch(void);
/* Draws the buffered vertices */
void IsometricDrawer_Render(int count, int offset, int* state);

CC_END_HEADER
#endif

/* ===== SelectionBox.h ===== */
#ifndef CC_SELECTIONBOX_H
#define CC_SELECTIONBOX_H
#include "MathUtils.h"
CC_BEGIN_HEADER

/* Describes a selection box, and contains methods related to the selection box.
   Copyright 2014-2025 ClassiCube | Licensed under BSD-3
*/
struct IGameComponent;
extern struct IGameComponent Selections_Component;

void Selections_Render(void);
/* Adds or replaces the selection box with the given ID */
CC_API void Selections_Add(cc_uint8 id, const IVec3* p1, const IVec3* p2, PackedCol color);
/* Removes the selection box with the givne ID */
CC_API void Selections_Remove(cc_uint8 id);

CC_END_HEADER
#endif

/* ===== Picking.h ===== */
#ifndef CC_PICKING_H
#define CC_PICKING_H
CC_BEGIN_HEADER

/* 
Provides ray tracer functionality for calculating picking/selecting intersection
  e.g. calculating block selected in the world by the user, clipping the camera
Copyright 2014-2025 ClassiCube | Licensed under BSD-3
*/

/* Implements a voxel ray tracer
http://www.xnawiki.com/index.php/Voxel_traversal
https://web.archive.org/web/20120113051728/http://www.xnawiki.com/index.php?title=Voxel_traversal

Implementation based on: "A Fast Voxel Traversal Algorithm for Ray Tracing"
John Amanatides, Andrew Woo
http://www.cse.yorku.ca/~amana/research/grid.pdf
http://www.devmaster.net/articles/raytracing_series/A%20faster%20voxel%20traversal%20algorithm%20for%20ray%20tracing.pdf
*/
struct RayTracer {
	IVec3 pos;    /* Coordinates of block within world */
	Vec3 origin, dir;
	Vec3 Min, Max; /* Min/max coords of block's bounding box. */
	BlockID block;
	IVec3 step;
	Vec3 tMax, tDelta;
	/* Result only data */
	Vec3 intersect;      /* Coords at which the ray exactly intersected this block. */
	IVec3 translatedPos; /* Coords of the neighbouring block that is closest to the player */
	cc_bool valid;       /* Whether the ray tracer actually intersected with a block */
	Face closest;        /* Face of the intersected block that is closet to the player */
	Vec3 invDir;
};

/* Marks the given ray tracer as having no result. */
void RayTracer_SetInvalid(struct RayTracer* t);
/* Initialises the given ray tracer with the given origin and direction. */
void RayTracer_Init(struct RayTracer* t, const Vec3* origin, const Vec3* dir);
/* Moves to next grid cell position on the ray. */
void RayTracer_Step(struct RayTracer* t);

/* Determines the picked block based on the given origin and direction vector.
   Marks pickedPos as invalid if a block could not be found due to going outside map boundaries
   or not being able to find a suitable candiate within the given reach distance.*/
void Picking_CalcPickedBlock(const Vec3* origin, const Vec3* dir, float reach, struct RayTracer* t);
void Picking_ClipCameraPos(const Vec3* origin, const Vec3* dir, float reach, struct RayTracer* t);

CC_END_HEADER
#endif
