/* Renderers.c - AxisLinesRenderer, HeldBlockRenderer, SelOutlineRenderer,
                 IsometricDrawer, SelectionBox, Picking merged */
#include "Renderers.h"

/* ===== AxisLinesRenderer.c ===== */
#include "Graphics.h"
#include "Game.h"
#include "MathUtils.h"
#include "Camera.h"
#include "Event.h"
#include "Entity.h"

cc_bool AxisLinesRenderer_Enabled;
static GfxResourceID axisLines_vb;
#define AXISLINES_NUM_VERTICES 12
#define AXISLINES_THICKNESS (1.0f / 32.0f)
#define AXISLINES_LENGTH 3.0f

void AxisLinesRenderer_Render(void) {
	static const cc_uint8 indices[36] = {
		2,2,1, 2,2,3, 4,2,3, 4,2,1, /* X arrow */
		1,2,2, 1,2,4, 3,2,4, 3,2,2, /* Z arrow */
		1,2,3, 1,4,3, 3,4,1, 3,2,1, /* Y arrow */
	};
	static const PackedCol colors[] = {
		PackedCol_Make(255,   0,   0, 255), /* Red   */
		PackedCol_Make(  0,   0, 255, 255), /* Blue  */
		PackedCol_Make(  0, 255,   0, 255), /* Green */
	};

	struct VertexColoured* v;
	Vec3 coords[5], pos, dirVector;
	int i, count;
	float axisLengthScale, axisThicknessScale;
	struct Entity* e;

	if (!AxisLinesRenderer_Enabled) return;
	/* Don't do it in a ContextRecreated handler, because we only want VB recreated if ShowAxisLines in on. */
	if (!axisLines_vb) {
		axisLines_vb = Gfx_CreateDynamicVb(VERTEX_FORMAT_COLOURED, AXISLINES_NUM_VERTICES);
	}
	e = &Entities.CurPlayer->Base;
	
	if (Camera.Active->isThirdPerson) {
		pos = e->Position;
		axisLengthScale = 1;
		axisThicknessScale = 1;
		pos.y += 0.05f;
	} else {
		pos = Camera.CurrentPos;
		dirVector = Vec3_GetDirVector(e->Yaw * MATH_DEG2RAD, e->Pitch * MATH_DEG2RAD);
		Vec3_Mul1(&dirVector, &dirVector, 0.5f);
		Vec3_Add(&pos, &dirVector, &pos);
		axisLengthScale = 1.0f / 32.0f;
		axisThicknessScale = 1.0f / 8.0f;
	}
	count =  12;
	 
	Vec3_Add1(&coords[0], &pos, -AXISLINES_LENGTH    * axisLengthScale);
	Vec3_Add1(&coords[1], &pos, -AXISLINES_THICKNESS * axisThicknessScale);
	coords[2] = pos;
	Vec3_Add1(&coords[3], &pos,  AXISLINES_THICKNESS * axisThicknessScale);
	Vec3_Add1(&coords[4], &pos,  AXISLINES_LENGTH  	 * axisLengthScale);

	v = (struct VertexColoured*)Gfx_LockDynamicVb(axisLines_vb, 
									VERTEX_FORMAT_COLOURED, AXISLINES_NUM_VERTICES);
	for (i = 0; i < count; i++, v++) 
	{
		v->x   = coords[indices[i*3 + 0]].x;
		v->y   = coords[indices[i*3 + 1]].y;
		v->z   = coords[indices[i*3 + 2]].z;
		v->Col = colors[i >> 2];
	}

	Gfx_SetVertexFormat(VERTEX_FORMAT_COLOURED);
	Gfx_UnlockDynamicVb(axisLines_vb);
	Gfx_DrawVb_IndexedTris(count);
}


/*########################################################################################################################*
*-----------------------------------------------AxisLinesRenderer component-----------------------------------------------*
*#########################################################################################################################*/
static void AL_OnContextLost(void* obj) {
	Gfx_DeleteDynamicVb(&axisLines_vb);
}

static void AL_OnInit(void) {
	Event_Register_(&GfxEvents.ContextLost, NULL, AL_OnContextLost);
}

static void AL_OnFree(void) { AL_OnContextLost(NULL); }

struct IGameComponent AxisLinesRenderer_Component = {
	AL_OnInit, /* Init */
	AL_OnFree, /* Free */
};

/* ===== HeldBlockRenderer.c ===== */
#include "Block.h"
#include "Inventory.h"
#include "Model.h"
#include "Options.h"

cc_bool HeldBlockRenderer_Show;
#if CC_BUILD_FPU_MODE >= CC_FPU_MODE_REDUCED
static BlockID held_block;
static struct Entity held_entity;
static struct Matrix held_blockProj;

static cc_bool held_animating, held_breaking, held_swinging;
static float held_swingY;
static float held_time, held_period = 0.25f;
static BlockID held_lastBlock;

/* Since not using Entity_SetModel, which normally automatically does this */
static void SetHeldModel(struct Model* model) {
#ifdef CC_BUILD_CONSOLE
	static int maxVertices;
	if (model->maxVertices <= maxVertices) return;

	maxVertices = model->maxVertices;
	Gfx_DeleteDynamicVb(&held_entity.ModelVB);
#endif
}

static void HeldBlockRenderer_RenderModel(void) {
	struct Model* model;

	Gfx_SetFaceCulling(true);
	Gfx_SetDepthTest(false);
	/* Gfx_SetDepthWrite(false); */
	/* TODO: Need to properly reallocate per model VB here */

	if (Blocks.Draw[held_block] == DRAW_GAS) {
		model = Entities.CurPlayer->Base.Model;
		SetHeldModel(model);
		Vec3_Set(held_entity.ModelScale, 1.0f, 1.0f, 1.0f);

		Model_RenderArm(model, &held_entity);
		Gfx_SetAlphaTest(false);
	}
	else {
		model = Models.Block;
		SetHeldModel(model);
		Vec3_Set(held_entity.ModelScale, 0.4f, 0.4f, 0.4f);

		Gfx_SetupAlphaState(Blocks.Draw[held_block]);
		Model_Render(model, &held_entity);
		Gfx_RestoreAlphaState(Blocks.Draw[held_block]);
	}
	
	Gfx_SetDepthTest(true);
	/* Gfx_SetDepthWrite(true); */
	Gfx_SetFaceCulling(false);
}

static void SetMatrix(void) {
	struct Entity* p = &Entities.CurPlayer->Base;
	struct Matrix lookAt;
	Vec3 eye = { 0,0,0 }; eye.y = Entity_GetEyeHeight(p);

	Matrix_Translate(&lookAt, -eye.x, -eye.y, -eye.z);
	Matrix_Mul(&Gfx.View, &lookAt, &Camera.TiltM);
}

static void ResetHeldState(void) {
	/* Based off details from http://pastebin.com/KFV0HkmD (Thanks goodlyay!) */
	struct Entity* p = &Entities.CurPlayer->Base;
	Vec3 eye = { 0,0,0 }; eye.y = Entity_GetEyeHeight(p);
	held_entity.Position = eye;

	held_entity.Position.x -= Camera.BobbingHor;
	held_entity.Position.y -= Camera.BobbingVer;
	held_entity.Position.z -= Camera.BobbingHor;

	held_entity.Yaw   = -45.0f; held_entity.RotY = -45.0f;
	held_entity.Pitch = 0.0f;   held_entity.RotX = 0.0f;
	held_entity.ModelBlock   = held_block;

	held_entity.SkinType     = p->SkinType;
	held_entity.TextureId    = p->TextureId;
	held_entity.NonHumanSkin = p->NonHumanSkin;
	held_entity.uScale       = p->uScale;
	held_entity.vScale       = p->vScale;
}

static void SetBaseOffset(void) {
	cc_bool sprite = Blocks.Draw[held_block] == DRAW_SPRITE;
	Vec3 normalOffset = { 0.56f, -0.72f, -0.72f };
	Vec3 spriteOffset = { 0.46f, -0.52f, -0.72f };
	Vec3 offset = sprite ? spriteOffset : normalOffset;

	Vec3_AddBy(&held_entity.Position, &offset);
	if (!sprite && Blocks.Draw[held_block] != DRAW_GAS) {
		float height = Blocks.MaxBB[held_block].y - Blocks.MinBB[held_block].y;
		held_entity.Position.y += 0.2f * (1.0f - height);
	}
}

static void OnProjectionChanged(void* obj) {
	float fov = 70.0f * MATH_DEG2RAD;
	float aspectRatio = (float)Game.Width / (float)Game.Height;
	Gfx_CalcPerspectiveMatrix(&held_blockProj, fov, aspectRatio, (float)Game_ViewDistance);
}

/* Based off incredible gifs from (Thanks goodlyay!)
	https://dl.dropboxusercontent.com/s/iuazpmpnr89zdgb/slowBreakTranslate.gif
	https://dl.dropboxusercontent.com/s/z7z8bset914s0ij/slowBreakRotate1.gif
	https://dl.dropboxusercontent.com/s/pdq79gkzntquld1/slowBreakRotate2.gif
	https://dl.dropboxusercontent.com/s/w1ego7cy7e5nrk1/slowBreakFull.gif

	https://github.com/ClassiCube/ClassicalSharp/wiki/Dig-animation-details
*/
static void HeldBlockRenderer_DigAnimation(void) {
	float sinHalfCircle, sinHalfCircleWeird;
	float t, sqrtLerpPI;

	t = held_time / held_period;
	sinHalfCircle = Math_SinF(t * MATH_PI);
	sqrtLerpPI    = Math_SqrtF(t) * MATH_PI;

	held_entity.Position.x -= Math_SinF(sqrtLerpPI)     * 0.4f;
	held_entity.Position.y += Math_SinF(sqrtLerpPI * 2) * 0.2f;
	held_entity.Position.z -= sinHalfCircle            * 0.2f;

	sinHalfCircleWeird = Math_SinF(t * t * MATH_PI);
	held_entity.RotY  -= Math_SinF(sqrtLerpPI) * 80.0f;
	held_entity.Yaw   -= Math_SinF(sqrtLerpPI) * 80.0f;
	held_entity.RotX  += sinHalfCircleWeird    * 20.0f;
}

static void HeldBlockRenderer_ResetAnim(cc_bool setLastHeld, float period) {
	held_time = 0.0f; held_swingY = 0.0f;
	held_animating = false; held_swinging = false;
	held_period = period;
	if (setLastHeld) { held_lastBlock = Inventory_SelectedBlock; }
}

static PackedCol HeldBlockRenderer_GetCol(struct Entity* entity) {
	struct Entity* player;
	PackedCol col;
	float adjPitch, t, scale;

	player = &Entities.CurPlayer->Base;
	col    = player->VTABLE->GetCol(player);

	/* Adjust pitch so angle when looking straight down is 0. */
	adjPitch = player->Pitch - 90.0f;
	if (adjPitch < 0.0f) adjPitch += 360.0f;

	/* Adjust color so held block is brighter when looking straight up */
	t     = Math_AbsF(adjPitch - 180.0f) / 180.0f;
	scale = Math_Lerp(0.9f, 0.7f, t);
	return PackedCol_Scale(col, scale);
}

void HeldBlockRenderer_ClickAnim(cc_bool digging) {
	/* TODO: timing still not quite right, rotate2 still not quite right */
	HeldBlockRenderer_ResetAnim(true, digging ? 0.35 : 0.25);
	held_swinging  = false;
	held_breaking  = digging;
	held_animating = true;
	/* Start place animation at bottom of cycle */
	if (!digging) held_time = held_period / 2;
}

static void DoSwitchBlockAnim(void* obj) {
	if (held_swinging) {
		/* Like graph -sin(x) : x=0.5 and x=2.5 have same y values,
		   but increasing x causes y to change in opposite directions */
		if (held_time > held_period * 0.5f) {
			held_time = held_period - held_time;
		}
	} else {
		if (held_block == Inventory_SelectedBlock) return;
		HeldBlockRenderer_ResetAnim(false, 0.25);
		held_animating = true;
		held_swinging = true;
	}
}

static void OnBlockChanged(void* obj, IVec3 coords, BlockID old, BlockID now) {
	if (now == BLOCK_AIR) return;
	HeldBlockRenderer_ClickAnim(false);
}

static void DoAnimation(float delta, float lastSwingY) {
	float t;
	if (!held_animating) return;

	if (held_swinging || !held_breaking) {
		t = held_time / held_period;
		held_swingY = -0.4f * Math_SinF(t * MATH_PI);
		held_entity.Position.y += held_swingY;

		if (held_swinging) {
			/* i.e. the block has gone to bottom of screen and is now returning back up. 
			   At this point we switch over to the new held block. */
			if (held_swingY > lastSwingY) held_lastBlock = held_block;
			held_block = held_lastBlock;
			held_entity.ModelBlock = held_block;
		}
	} else {
		HeldBlockRenderer_DigAnimation();
	}
	
	held_time += delta;
	if (held_time > held_period) {
		HeldBlockRenderer_ResetAnim(true, 0.25f);
	}
}

void HeldBlockRenderer_Render(float delta) {
	float lastSwingY;
	struct Matrix view;
	if (!HeldBlockRenderer_Show) return;

	lastSwingY  = held_swingY;
	held_swingY = 0.0f;
	held_block  = Inventory_SelectedBlock;
	view = Gfx.View;

	Gfx_LoadMatrix(MATRIX_PROJ, &held_blockProj);
	SetMatrix();

	ResetHeldState();
	DoAnimation(delta, lastSwingY);
	SetBaseOffset();
	if (!Camera.Active->isThirdPerson) HeldBlockRenderer_RenderModel();

	Gfx.View = view;
	Gfx_LoadMatrix(MATRIX_PROJ, &Gfx.Projection);
}


static void HB_OnContextLost(void* obj) {
	Gfx_DeleteDynamicVb(&held_entity.ModelVB);
}

static const struct EntityVTABLE heldEntity_VTABLE = {
	NULL, NULL, NULL, HeldBlockRenderer_GetCol,
	NULL, NULL
};
static void HB_OnInit(void) {
	Entity_Init(&held_entity);
	held_entity.VTABLE  = &heldEntity_VTABLE;
	held_entity.NoShade = true;

	HeldBlockRenderer_Show = Options_GetBool(OPT_SHOW_BLOCK_IN_HAND, true);
	held_lastBlock         = Inventory_SelectedBlock;

	Event_Register_(&GfxEvents.ProjectionChanged, NULL, OnProjectionChanged);
	Event_Register_(&UserEvents.HeldBlockChanged, NULL, DoSwitchBlockAnim);
	Event_Register_(&UserEvents.BlockChanged,     NULL, OnBlockChanged);
	Event_Register_(&GfxEvents.ContextLost,       NULL, HB_OnContextLost);
}
#else
void HeldBlockRenderer_ClickAnim(cc_bool digging) { }
void HeldBlockRenderer_Render(float delta) { }

static void HB_OnInit(void) { }
#endif

struct IGameComponent HeldBlockRenderer_Component = {
	HB_OnInit /* Init  */
};

/* ===== SelOutlineRenderer.c ===== */
#include "Funcs.h"

static GfxResourceID selOutline_vb;
static float base_size;
static PackedCol color;
#define SELOUTLINE_NUM_VERTICES (16 * 6)

#define SelOutline_Y(y)\
0,y,1,  0,y,2,  1,y,2,  1,y,1,\
3,y,1,  3,y,2,  2,y,2,  2,y,1,\
0,y,0,  0,y,1,  3,y,1,  3,y,0,\
0,y,3,  0,y,2,  3,y,2,  3,y,3,

#define SelOutline_X(x)\
x,1,0,  x,2,0,  x,2,1,  x,1,1,\
x,1,3,  x,2,3,  x,2,2,  x,1,2,\
x,0,0,  x,1,0,  x,1,3,  x,0,3,\
x,3,0,  x,2,0,  x,2,3,  x,3,3,

#define SelOutline_Z(z)\
0,1,z,  0,2,z,  1,2,z,  1,1,z,\
3,1,z,  3,2,z,  2,2,z,  2,1,z,\
0,0,z,  0,1,z,  3,1,z,  3,0,z,\
0,3,z,  0,2,z,  3,2,z,  3,3,z,


static void BuildMesh(struct RayTracer* selected) {
	static const cc_uint8 indices[288] = {
		SelOutline_Y(0) SelOutline_Y(3) /* YMin, YMax */
		SelOutline_X(0) SelOutline_X(3) /* XMin, XMax */
		SelOutline_Z(0) SelOutline_Z(3) /* ZMin, ZMax */
	};
	
	struct VertexColoured* ptr;
	int i;
	Vec3 delta;
	float dist, offset;
	float size, scale;
	Vec3 coords[4];

	Vec3_Sub(&delta, &Camera.CurrentPos, &selected->Min);
	dist = Vec3_LengthSquared(&delta);

	offset = 0.01f;
	if (dist < 4.0f * 4.0f) offset = 0.00625f;
	if (dist < 2.0f * 2.0f) offset = 0.00500f;

	scale = 1.0f / 16.0f;
	if (dist < 32.0f * 32.0f) scale = 1.0f / 32.0f;
	if (dist < 16.0f * 16.0f) scale = 1.0f / 64.0f;
	if (dist <  8.0f *  8.0f) scale = 1.0f / 96.0f;
	if (dist <  4.0f *  4.0f) scale = 1.0f / 128.0f;
	if (dist <  2.0f *  2.0f) scale = 1.0f / 192.0f;
	size = base_size * scale;
	
	/*  How a face is laid out: 
	                 #--#-------#--#<== OUTER_MAX (3)
	                 |  |       |  |
	                 |  #-------#<===== INNER_MAX (2)
	                 |  |       |  |
					 |  |       |  |
	                 |  |       |  |
	(1) INNER_MIN =====>#-------#  |
	                 |  |       |  |
	(0) OUTER_MIN ==>#--#-------#--#

	- these are used to fake thick lines, by making the lines appear slightly inset
	- note: actual difference between inner and outer is much smaller than the diagram
	*/
	Vec3_Add1(&coords[0], &selected->Min, -offset);
	Vec3_Add1(&coords[1], &coords[0],      size);
	Vec3_Add1(&coords[3], &selected->Max,  offset);
	Vec3_Add1(&coords[2], &coords[3],     -size);
	
	ptr = (struct VertexColoured*)Gfx_LockDynamicVb(selOutline_vb, 
									VERTEX_FORMAT_COLOURED, SELOUTLINE_NUM_VERTICES);
	for (i = 0; i < Array_Elems(indices); i += 3, ptr++) 
	{
		ptr->x   = coords[indices[i + 0]].x;
		ptr->y   = coords[indices[i + 1]].y;
		ptr->z   = coords[indices[i + 2]].z;
		ptr->Col = color;
	}
	Gfx_UnlockDynamicVb(selOutline_vb);
}

void SelOutlineRenderer_Render(struct RayTracer* selected, cc_bool dirty) {
	if (Gfx.LostContext) return;

	if (!selOutline_vb)
		selOutline_vb = Gfx_CreateDynamicVb(VERTEX_FORMAT_COLOURED, SELOUTLINE_NUM_VERTICES);
	
	Gfx_SetAlphaBlending(true);
	Gfx_SetDepthWrite(false);
	Gfx_SetVertexFormat(VERTEX_FORMAT_COLOURED);

	if (dirty) BuildMesh(selected);
	else Gfx_BindDynamicVb(selOutline_vb);

	Gfx_DrawVb_IndexedTris(SELOUTLINE_NUM_VERTICES);
	Gfx_SetDepthWrite(true);
	Gfx_SetAlphaBlending(false);
}


/*########################################################################################################################*
*-----------------------------------------------SelOutlineRenderer component----------------------------------------------*
*#########################################################################################################################*/
static void SO_OnContextLost(void* obj) {
	Gfx_DeleteDynamicVb(&selOutline_vb);
}

static void SO_OnInit(void) {
	int opacity;
	cc_uint8 rgb[3];
	Event_Register_(&GfxEvents.ContextLost, NULL, SO_OnContextLost);

	base_size = Options_GetFloat(OPT_SELECTED_BLOCK_OUTLINE_SCALE, 1, 16, 1);
	opacity   = Options_GetInt(OPT_SELECTED_BLOCK_OUTLINE_OPACITY, 0, 255, 102);

	if (Options_GetColor(OPT_SELECTED_BLOCK_OUTLINE_COLOR, rgb)) {
		color = PackedCol_Make(rgb[0], rgb[1], rgb[2], opacity);
	} else {
		color = PackedCol_Make(0, 0, 0, opacity); /* Black by default */
	}
}

static void SO_OnFree(void) { SO_OnContextLost(NULL); }

struct IGameComponent SelOutlineRenderer_Component = {
	SO_OnInit, /* Init */
	SO_OnFree, /* Free */
};

/* ===== IsometricDrawer.c ===== */
#include "Drawer.h"
#include "TexturePack.h"

static struct VertexTextured* iso_vertices;
static struct VertexTextured* iso_vertices_base;
static int* iso_state;

static cc_bool iso_cacheInited;
static PackedCol iso_colorXSide, iso_colorZSide, iso_colorYBottom;
static float iso_posX, iso_posY;

#define iso_cosX  (0.86602540378443864f) /* cos(30  * MATH_DEG2RAD) */
#define iso_sinX  (0.50000000000000000f) /* sin(30  * MATH_DEG2RAD) */
#define iso_cosY  (0.70710678118654752f) /* cos(-45 * MATH_DEG2RAD) */
#define iso_sinY (-0.70710678118654752f) /* sin(-45 * MATH_DEG2RAD) */

static void IsometricDrawer_InitCache(void) {
	if (iso_cacheInited) return;

	iso_cacheInited = true;
	PackedCol_GetShaded(PACKEDCOL_WHITE,
		&iso_colorXSide, &iso_colorZSide, &iso_colorYBottom);
}

static TextureLoc IsometricDrawer_GetTexLoc(BlockID block, Face face) {
	TextureLoc loc = Block_Tex(block, face);
	*iso_state++   = Atlas1D_Index(loc);
	return loc;
}

static void IsometricDrawer_Flat(BlockID block, float size) {
	int texIndex;
	TextureLoc loc = Block_Tex(block, FACE_ZMAX);
	TextureRec rec = Atlas1D_TexRec(loc, 1, &texIndex);

	struct VertexTextured* v;
	float minX, maxX, minY, maxY;
	PackedCol color;
	float scale;

	*iso_state++ = texIndex;
	color = PACKEDCOL_WHITE;
	Block_Tint(color, block);

	/* Rescale by 0.70 in Classic mode to match vanilla size */
	/* Rescale by 0.88 in Enhanced mode to be slightly nicer */
	/*  Default selected size:  54px -> 48px */
	/*  Default inventory size: 36px -> 32px */
	/*  Default hotbar size:    28px -> 24px */
	scale = Game_ClassicMode ? 0.70f : 0.88f;
	size  = Math_Ceil(size * scale);
	minX  = iso_posX - size; maxX = iso_posX + size;
	minY  = iso_posY - size; maxY = iso_posY + size;

	v = iso_vertices;
	v->x = minX; v->y = minY; v->z = 0; v->Col = color; v->U = rec.u1; v->V = rec.v1; v++;
	v->x = maxX; v->y = minY; v->z = 0; v->Col = color; v->U = rec.u2; v->V = rec.v1; v++;
	v->x = maxX; v->y = maxY; v->z = 0; v->Col = color; v->U = rec.u2; v->V = rec.v2; v++;
	v->x = minX; v->y = maxY; v->z = 0; v->Col = color; v->U = rec.u1; v->V = rec.v2; v++;
	iso_vertices = v;
}

static void IsometricDrawer_Angled(BlockID block, float size) {
	cc_bool bright;
	Vec3 min, max;
	struct VertexTextured* beg = iso_vertices;
	struct VertexTextured* v;
	float x, y, scale;

	/* isometric coords size: cosY * -scale - sinY * scale */
	/* we need to divide by (2 * cosY), as the calling function expects size to be in pixels. */
	scale = size / (2.0f * iso_cosY);

	Drawer.MinBB = Blocks.MinBB[block]; Drawer.MinBB.y = 1.0f - Drawer.MinBB.y;
	Drawer.MaxBB = Blocks.MaxBB[block]; Drawer.MaxBB.y = 1.0f - Drawer.MaxBB.y;
	min = Blocks.MinBB[block]; max = Blocks.MaxBB[block];

	Drawer.X1 = scale * (1.0f - min.x * 2.0f);
	Drawer.X2 = scale * (1.0f - max.x * 2.0f);
	Drawer.Y1 = scale * (1.0f - min.y * 2.0f);
	Drawer.Y2 = scale * (1.0f - max.y * 2.0f);
	Drawer.Z1 = scale * (1.0f - min.z * 2.0f);
	Drawer.Z2 = scale * (1.0f - max.z * 2.0f);

	bright = Blocks.Brightness[block];
	Drawer.Tinted  = Blocks.Tinted[block];
	Drawer.TintCol = Blocks.FogCol[block];

	Drawer_XMax(1, bright ? PACKEDCOL_WHITE : iso_colorXSide,
		IsometricDrawer_GetTexLoc(block, FACE_XMAX), &iso_vertices);
	Drawer_ZMin(1, bright ? PACKEDCOL_WHITE : iso_colorZSide,
		IsometricDrawer_GetTexLoc(block, FACE_ZMIN), &iso_vertices);
	Drawer_YMax(1, PACKEDCOL_WHITE,
		IsometricDrawer_GetTexLoc(block, FACE_YMAX), &iso_vertices);

	for (v = beg; v < iso_vertices; v++)
	{
		/* Cut down form of: */
		/*   Matrix_RotateY(&rotY,  45.0f * MATH_DEG2RAD); */
		/*   Matrix_RotateX(&rotX, -30.0f * MATH_DEG2RAD); */
		/*   Matrix_Mul(&iso_transform, &rotY, &rotX); */
		/*   ...                                       */
		/*   Vec3 vec = { v.x, v.y, v.z }; */
		/*   Vec3_Transform(&vec, &vec, &iso_transform); */
		/* With all unnecessary operations either simplified or removed */
		x = v->x * iso_cosY                              + v->z * -iso_sinY;
		y = v->x * iso_sinX * iso_sinY + v->y * iso_cosX + v->z * iso_sinX * iso_cosY;

		v->x = x + iso_posX;
		v->y = y + iso_posY;
	}
}

void IsometricDrawer_BeginBatch(struct VertexTextured* vertices, int* state) {
	IsometricDrawer_InitCache();
	iso_vertices      = vertices;
	iso_vertices_base = vertices;
	iso_state         = state; /* TODO just store TextureLoc ??? */
}

void IsometricDrawer_AddBatch(BlockID block, float size, float x, float y) {
	if (Blocks.Draw[block] == DRAW_GAS) return;

	iso_posX = x; iso_posY = y;

#if CC_BUILD_FPU_MODE <= CC_FPU_MODE_MINIMAL
	IsometricDrawer_Flat(block, size);
#else
	if (Blocks.Draw[block] == DRAW_SPRITE) {
		IsometricDrawer_Flat(block, size);
	} else {
		IsometricDrawer_Angled(block, size);
	}
#endif
}

int IsometricDrawer_EndBatch(void) {
	return (int)(iso_vertices - iso_vertices_base);
}

#if CC_BUILD_FPU_MODE <= CC_FPU_MODE_MINIMAL
	#define ISO_DRAW_HINT DRAW_HINT_SPRITE
#else
	#define ISO_DRAW_HINT DRAW_HINT_NONE
#endif
void IsometricDrawer_Render(int count, int offset, int* state) {
	int i, curIdx, batchBeg, batchLen;

	curIdx   = state[0];
	batchLen = 0;
	batchBeg = offset;

	for (i = 0; i < count / 4; i++, batchLen += 4) 
	{
		if (state[i] == curIdx) continue;

		/* Flush previous batch */
		Atlas1D_Bind(curIdx);
		Gfx_DrawVb_IndexedTris_Range(batchLen, batchBeg, ISO_DRAW_HINT);

		/* Reset for next batch */
		curIdx   = state[i];
		batchBeg += batchLen;
		batchLen = 0;
	}

	Atlas1D_Bind(curIdx);
	Gfx_DrawVb_IndexedTris_Range(batchLen, batchBeg, ISO_DRAW_HINT);
}

/* ===== SelectionBox.c ===== */

#ifdef CC_BUILD_NETWORKING
/* Data for a selection box. */
struct SelectionBox {
	Vec3 p0, p1;
	PackedCol color;
	float minDist, maxDist;
};

#define X0 0
#define X1 1
#define Y0 0
#define Y1 2
#define Z0 0
#define Z1 4

#define SelectionBox_Y(y) X0|y |Z0, X0|y |Z1, X1|y |Z1, X1|y |Z0,
#define SelectionBox_Z(z) X0|Y0|z , X0|Y1|z , X1|Y1|z , X1|Y0|z ,
#define SelectionBox_X(x) x |Y0|Z0, x |Y1|Z0, x |Y1|Z1, x |Y0|Z1,

static void BuildFaces(struct SelectionBox* box, struct VertexColoured* v) {
	static const cc_uint8 faceIndices[24] = {
		SelectionBox_Y(Y0) SelectionBox_Y(Y1) /* YMin, YMax */
		SelectionBox_Z(Z0) SelectionBox_Z(Z1) /* ZMin, ZMax */
		SelectionBox_X(X0) SelectionBox_X(X1) /* XMin, XMax */
	};
	PackedCol color;
	int i, flags;

	float offset = box->minDist < 32.0f * 32.0f ? (1/32.0f) : (1/16.0f);
	Vec3 coords[2];
	Vec3_Add1(&coords[0], &box->p0, -offset);
	Vec3_Add1(&coords[1], &box->p1,  offset);

	color = box->color;
	for (i = 0; i < Array_Elems(faceIndices); i++, v++) {
		flags  = faceIndices[i];
		v->x   = coords[(flags     ) & 1].x;
		v->y   = coords[(flags >> 1) & 1].y;
		v->z   = coords[(flags >> 2)    ].z;
		v->Col = color;
	}
}

static void BuildEdges(struct SelectionBox* box, struct VertexColoured* v) {
	static const cc_uint8 edgeIndices[24] = {
		X0|Y0|Z0, X1|Y0|Z0,  X1|Y0|Z0, X1|Y0|Z1,  X1|Y0|Z1, X0|Y0|Z1,  X0|Y0|Z1, X0|Y0|Z0, /* YMin */
		X0|Y1|Z0, X1|Y1|Z0,  X1|Y1|Z0, X1|Y1|Z1,  X1|Y1|Z1, X0|Y1|Z1,  X0|Y1|Z1, X0|Y1|Z0, /* YMax */
		X0|Y0|Z0, X0|Y1|Z0,  X1|Y0|Z0, X1|Y1|Z0,  X1|Y0|Z1, X1|Y1|Z1,  X0|Y0|Z1, X0|Y1|Z1, /* X/Z  */
	};
	PackedCol color;
	int i, flags;

	float offset = box->minDist < 32.0f * 32.0f ? (1/32.0f) : (1/16.0f);
	Vec3 coords[2];
	Vec3_Add1(&coords[0], &box->p0, -offset);
	Vec3_Add1(&coords[1], &box->p1,  offset);

	color = box->color;
	/* invert R/G/B for surrounding line */
	color = (color & PACKEDCOL_A_MASK) | (~color & PACKEDCOL_RGB_MASK);

	for (i = 0; i < Array_Elems(edgeIndices); i++, v++) {
		flags  = edgeIndices[i];
		v->x   = coords[(flags     ) & 1].x;
		v->y   = coords[(flags >> 1) & 1].y;
		v->z   = coords[(flags >> 2)    ].z;
		v->Col = color;
	}
}

static int CompareDists(struct SelectionBox* a, struct SelectionBox* b) {
	float aDist, bDist;
	if (a->minDist == b->minDist) {
		aDist = a->maxDist; bDist = b->maxDist;
	} else {
		aDist = a->minDist; bDist = b->minDist;
	}

	/* Reversed comparison order result, because we need to render back to front for alpha blending */
	if (aDist < bDist) return 1;
	if (aDist > bDist) return -1;
	return 0;
}

static void CalcDists(struct SelectionBox* box, Vec3 P) {
	float dx0 = (P.x - box->p0.x) * (P.x - box->p0.x), dx1 = (P.x - box->p1.x) * (P.x - box->p1.x);
	float dy0 = (P.y - box->p0.y) * (P.y - box->p0.y), dy1 = (P.y - box->p1.y) * (P.y - box->p1.y);
	float dz0 = (P.z - box->p0.z) * (P.z - box->p0.z), dz1 = (P.z - box->p1.z) * (P.z - box->p1.z);

	/* Distance to closest and furthest of the eight box corners */
	box->minDist = min(dx0, dx1) + min(dy0, dy1) + min(dz0, dz1);
	box->maxDist = max(dx0, dx1) + max(dy0, dy1) + max(dz0, dz1);
}


#define SELECTIONS_MAX 256
#define SELECTIONS_VERTICES 24
#define SELECTIONS_MAX_VERTICES SELECTIONS_MAX * SELECTIONS_VERTICES

static int selections_count;
static struct SelectionBox selections_list[SELECTIONS_MAX];
static cc_uint8 selections_ids[SELECTIONS_MAX];
static GfxResourceID selections_VB, selections_LineVB;

void Selections_Add(cc_uint8 id, const IVec3* p1, const IVec3* p2, PackedCol color) {
	struct SelectionBox sel;
	IVec3_ToVec3(&sel.p0, p1);
	IVec3_ToVec3(&sel.p1, p2);
	sel.color = color;

	Selections_Remove(id);
	selections_list[selections_count] = sel;
	selections_ids[selections_count]  = id;
	selections_count++;
}

void Selections_Remove(cc_uint8 id) {
	int i;
	for (i = 0; i < selections_count; i++) {
		if (selections_ids[i] != id) continue;

		for (; i < selections_count - 1; i++) {
			selections_list[i] = selections_list[i + 1];
			selections_ids[i]  = selections_ids[i + 1];
		}

		selections_count--;
		return;
	}
}

static void Selections_ContextLost(void* obj) {
	Gfx_DeleteDynamicVb(&selections_VB);
	Gfx_DeleteDynamicVb(&selections_LineVB);
}

static void AllocateVertexBuffers(void) {
	selections_VB     = Gfx_CreateDynamicVb(VERTEX_FORMAT_COLOURED, SELECTIONS_MAX_VERTICES);
	selections_LineVB = Gfx_CreateDynamicVb(VERTEX_FORMAT_COLOURED, SELECTIONS_MAX_VERTICES);
}

static void Selections_QuickSort(int left, int right) {
	cc_uint8* values = selections_ids; cc_uint8 value;
	struct SelectionBox* keys = selections_list; struct SelectionBox key;

	while (left < right) {
		int i = left, j = right;
		struct SelectionBox* pivot = &keys[(i + j) >> 1];

		/* partition the list */
		while (i <= j) {
			while (CompareDists(pivot, &keys[i]) > 0) i++;
			while (CompareDists(pivot, &keys[j]) < 0) j--;
			QuickSort_Swap_KV_Maybe();
		}
		/* recurse into the smaller subset */
		QuickSort_Recurse(Selections_QuickSort)
	}
}

void Selections_Render(void) {
	struct VertexColoured* data;
	Vec3 cameraPos;
	int i, count;
	if (!selections_count) return;

	/* TODO: Proper selection box sorting. But this is very difficult because
	   we can have boxes within boxes, intersecting boxes, etc. Probably not worth it. */
	cameraPos = Camera.CurrentPos;
	for (i = 0; i < selections_count; i++) {
		CalcDists(&selections_list[i], cameraPos);
	}
	Selections_QuickSort(0, selections_count - 1);

	/* lazy init as most servers don't use this */
	if (!selections_VB) AllocateVertexBuffers();

	count = selections_count * SELECTIONS_VERTICES;
	Gfx_SetVertexFormat(VERTEX_FORMAT_COLOURED);

	data = (struct VertexColoured*)Gfx_LockDynamicVb(selections_LineVB, 
										VERTEX_FORMAT_COLOURED, count);
	for (i = 0; i < selections_count; i++, data += SELECTIONS_VERTICES) {
		BuildEdges(&selections_list[i], data);
	}
	Gfx_UnlockDynamicVb(selections_LineVB);
	Gfx_DrawVb_Lines(count);

	data = (struct VertexColoured*)Gfx_LockDynamicVb(selections_VB, 
										VERTEX_FORMAT_COLOURED, count);
	for (i = 0; i < selections_count; i++, data += SELECTIONS_VERTICES) {
		BuildFaces(&selections_list[i], data);
	}
	Gfx_UnlockDynamicVb(selections_VB);

	Gfx_SetDepthWrite(false);
	Gfx_SetAlphaBlending(true);
	Gfx_DrawVb_IndexedTris(count);
	Gfx_SetDepthWrite(true);
	Gfx_SetAlphaBlending(false);
}
#else
static int selections_count;
void Selections_Render(void) { }
static void Selections_ContextLost(void* obj) { }
#endif


/*########################################################################################################################*
*--------------------------------------------------Selections component---------------------------------------------------*
*#########################################################################################################################*/
static void SB_OnInit(void) {
	Event_Register_(&GfxEvents.ContextLost, NULL, Selections_ContextLost);
}

static void OnReset(void) { selections_count = 0; }

static void SB_OnFree(void) { Selections_ContextLost(NULL); }

struct IGameComponent Selections_Component = {
	SB_OnInit,  /* Init  */
	SB_OnFree,  /* Free  */
	OnReset, /* Reset */
	OnReset  /* OnNewMap */
};

/* ===== Picking.c ===== */
#include "Physics.h"
#include "World.h"
#include "Logger.h"
#include "Platform.h"

static float pickedPos_dist;
static void TestAxis(struct RayTracer* t, float dAxis, Face fAxis) {
	dAxis = Math_AbsF(dAxis);
	if (dAxis >= pickedPos_dist) return;

	pickedPos_dist = dAxis;
	t->closest     = fAxis;
}

static void SetAsValid(struct RayTracer* t) {
	t->translatedPos = t->pos;
	t->valid         = true;

	pickedPos_dist = MATH_LARGENUM;
	TestAxis(t, t->intersect.x - t->Min.x, FACE_XMIN);
	TestAxis(t, t->intersect.x - t->Max.x, FACE_XMAX);
	TestAxis(t, t->intersect.y - t->Min.y, FACE_YMIN);
	TestAxis(t, t->intersect.y - t->Max.y, FACE_YMAX);
	TestAxis(t, t->intersect.z - t->Min.z, FACE_ZMIN);
	TestAxis(t, t->intersect.z - t->Max.z, FACE_ZMAX);

	switch (t->closest) {
	case FACE_XMIN: t->translatedPos.x--; break;
	case FACE_XMAX: t->translatedPos.x++; break;
	case FACE_ZMIN: t->translatedPos.z--; break;
	case FACE_ZMAX: t->translatedPos.z++; break;
	case FACE_YMIN: t->translatedPos.y--; break;
	case FACE_YMAX: t->translatedPos.y++; break;
	}
}

void RayTracer_SetInvalid(struct RayTracer* t) {
	static const IVec3 pos = { -1, -1, -1 };
	t->pos           = pos;
	t->translatedPos = pos;

	t->valid   = false;
	t->block   = BLOCK_AIR;
	t->closest = FACE_COUNT;
}

void RayTracer_Init(struct RayTracer* t, const Vec3* origin, const Vec3* dir) {
	IVec3 cellBoundary;
	t->origin = *origin; t->dir = *dir;

	t->invDir.x = Math_SafeDiv(1.0f, dir->x);
	t->invDir.y = Math_SafeDiv(1.0f, dir->y);
	t->invDir.z = Math_SafeDiv(1.0f, dir->z);

	/* Rounds the position's X, Y and Z down to the nearest integer values. */
	/* The cell in which the ray starts. */
	IVec3_Floor(&t->pos, origin);
	/* Determine which way we go. */
	t->step.x = Math_Sign(dir->x); t->step.y = Math_Sign(dir->y); t->step.z = Math_Sign(dir->z);

	/* Calculate cell boundaries. When the step (i.e. direction sign) is positive,
	the next boundary is AFTER our current position, meaning that we have to add 1.
	Otherwise, it is BEFORE our current position, in which case we add nothing. */
	cellBoundary.x = t->pos.x + (t->step.x > 0 ? 1 : 0);
	cellBoundary.y = t->pos.y + (t->step.y > 0 ? 1 : 0);
	cellBoundary.z = t->pos.z + (t->step.z > 0 ? 1 : 0);

	/* NOTE: we want it so if dir.x = 0, tmax.x = positive infinity
	Determine how far we can travel along the ray before we hit a voxel boundary. */
	t->tMax.x = Math_SafeDiv(cellBoundary.x - origin->x, dir->x); /* Boundary is a plane on the YZ axis. */
	t->tMax.y = Math_SafeDiv(cellBoundary.y - origin->y, dir->y); /* Boundary is a plane on the XZ axis. */
	t->tMax.z = Math_SafeDiv(cellBoundary.z - origin->z, dir->z); /* Boundary is a plane on the XY axis. */

	/* Determine how far we must travel along the ray before we have crossed a gridcell. */
	t->tDelta.x = (float)t->step.x * t->invDir.x;
	t->tDelta.y = (float)t->step.y * t->invDir.y;
	t->tDelta.z = (float)t->step.z * t->invDir.z;
}

void RayTracer_Step(struct RayTracer* t) {
	/* For each step, determine which distance to the next voxel boundary is lowest
	(i.e. which voxel boundary is nearest) and walk that way. */
	if (t->tMax.x < t->tMax.y && t->tMax.x < t->tMax.z) {
		/* tMax.x is the lowest, an YZ cell boundary plane is nearest. */
		t->pos.x  += t->step.x;
		t->tMax.x += t->tDelta.x;
	} else if (t->tMax.y < t->tMax.z) {
		/* tMax.y is the lowest, an XZ cell boundary plane is nearest. */
		t->pos.y  += t->step.y;
		t->tMax.y += t->tDelta.y;
	} else {
		/* tMax.z is the lowest, an XY cell boundary plane is nearest. */
		t->pos.z  += t->step.z;
		t->tMax.z += t->tDelta.z;
	}
}

#define BORDER BLOCK_BEDROCK
typedef cc_bool (*IntersectTest)(struct RayTracer* t);

static BlockID Picking_GetInside(int x, int y, int z) {
	int floorY;

	if (World_ContainsXZ(x, z)) {
		if (y >= World.Height) return BLOCK_AIR;
		if (y >= 0) return World_GetBlock(x, y, z);
		floorY = 0;
	} else {
		floorY = Env_SidesHeight;
	}

	/* bedrock on bottom or outside map */
	return Env.SidesBlock != BLOCK_AIR && y < floorY ? BORDER : BLOCK_AIR;
}

static BlockID Picking_GetOutside(int x, int y, int z, IVec3 origin) {
	cc_bool sides = Env.SidesBlock != BLOCK_AIR;
	if (World_ContainsXZ(x, z)) {
		if (y >= World.Height) return BLOCK_AIR;

		if (sides && y == -1 && origin.y > 0) return BORDER;
		if (sides && y ==  0 && origin.y < 0) return BORDER;

		if (sides && y >= 0 && y < Env_SidesHeight && origin.y < Env_SidesHeight) {
			if (x == 0          && origin.x < 0)  return BORDER;
			if (z == 0          && origin.z < 0)  return BORDER;
			if (x == World.MaxX && origin.x >= 0) return BORDER;
			if (z == World.MaxZ && origin.z >= 0) return BORDER;
		}
		if (y >= 0) return World_GetBlock(x, y, z);

	} else if (Env.SidesBlock != BLOCK_AIR && y >= 0 && y < Env_SidesHeight) {
		/*         |
		          X|\         If # represents player and is above the map border,
		           | \        they should be able to place blocks on other map borders
		           *--\----   (i.e. same behaviour as when player is inside map)
				       #  
         */
		if (x == -1           && origin.x >= 0 && z >= 0 && z < World.Length) return BORDER;
		if (x == World.Width  && origin.x <  0 && z >= 0 && z < World.Length) return BORDER;
		if (z == -1           && origin.z >= 0 && x >= 0 && x < World.Width ) return BORDER;
		if (z == World.Length && origin.z <  0 && x >= 0 && x < World.Width ) return BORDER;
	}
	return BLOCK_AIR;
}

static cc_bool RayTrace(struct RayTracer* t, const Vec3* origin, const Vec3* dir, float reach, IntersectTest intersect) {
	IVec3 pOrigin;
	cc_bool insideMap;
	float reachSq;
	Vec3 v;

	float dxMin, dxMax, dx;
	float dyMin, dyMax, dy;
	float dzMin, dzMax, dz;
	int i, x, y, z;

	RayTracer_Init(t, origin, dir);
	/* Check if origin is at NaN (happens if player's position is at infinity) */
	if (origin->x != origin->x || origin->y != origin->y || origin->z != origin->z) return false;

	IVec3_Floor(&pOrigin, origin);
	/* This used to be World_Contains(pOrigin.x, pOrigin.y, pOrigin.z), however */
	/*  this caused a bug when you were above the map (but still inside the map */
	/*  horizontally) - if borders height was > map height, you would wrongly */
	/*  pick blocks on the INSIDE of the map borders instead of OUTSIDE them */
	insideMap = World_ContainsXZ(pOrigin.x, pOrigin.z) && pOrigin.y >= 0;
	reachSq   = reach * reach;
		
	for (i = 0; i < 25000; i++) {
		x   = t->pos.x; y   = t->pos.y; z   = t->pos.z;
		v.x = (float)x; v.y = (float)y; v.z = (float)z;

		t->block = insideMap ? Picking_GetInside(x, y, z) : Picking_GetOutside(x, y, z, pOrigin);
		Vec3_Add(&t->Min, &v, &Blocks.RenderMinBB[t->block]);
		Vec3_Add(&t->Max, &v, &Blocks.RenderMaxBB[t->block]);

		dxMin = Math_AbsF(origin->x - t->Min.x); dxMax = Math_AbsF(origin->x - t->Max.x);
		dyMin = Math_AbsF(origin->y - t->Min.y); dyMax = Math_AbsF(origin->y - t->Max.y);
		dzMin = Math_AbsF(origin->z - t->Min.z); dzMax = Math_AbsF(origin->z - t->Max.z);
		dx = min(dxMin, dxMax); dy = min(dyMin, dyMax); dz = min(dzMin, dzMax);
		if (dx * dx + dy * dy + dz * dz > reachSq) return false;

		if (intersect(t)) return true;
		RayTracer_Step(t);
	}

	Process_Abort("Something went wrong, did over 25,000 iterations in Picking_RayTrace()");
	return false;
}

static cc_bool ClipBlock(struct RayTracer* t) {
	Vec3 scaledDir;
	float lenSq, reach;
	float t0, t1;

	if (!Game_CanPick(t->block)) return false;
	/* This cell falls on the path of the ray. Now perform an additional AABB test,
	since some blocks do not occupy a whole cell. */
	if (!Intersection_RayIntersectsBox(t->origin, t->invDir, t->Min, t->Max, &t0, &t1)) return false;
	
	Vec3_Mul1(&scaledDir, &t->dir, t0);              /* scaledDir = dir * t0 */
	Vec3_Add(&t->intersect, &t->origin, &scaledDir); /* intersect = origin + scaledDir */

	/* Only pick the block if the block is precisely within reach distance. */
	lenSq = Vec3_LengthSquared(&scaledDir);
	reach = Entities.CurPlayer->ReachDistance;

	if (lenSq <= reach * reach) {
		SetAsValid(t);
	} else {
		RayTracer_SetInvalid(t);
	}
	return true;
}

static const Vec3 picking_adjust = { 0.1f, 0.1f, 0.1f };
static cc_bool ClipCamera(struct RayTracer* t) {
	Vec3 intersect;
	float t0, t1;

	if (Blocks.Draw[t->block] == DRAW_GAS || Blocks.Collide[t->block] != COLLIDE_SOLID) return false;
	if (!Intersection_RayIntersectsBox(t->origin, t->invDir, t->Min, t->Max, &t0, &t1)) return false;

	/* Need to collide with slightly outside block, to avoid camera clipping issues */
	Vec3_Sub(&t->Min, &t->Min, &picking_adjust);
	Vec3_Add(&t->Max, &t->Max, &picking_adjust);
	Intersection_RayIntersectsBox(t->origin, t->invDir, t->Min, t->Max, &t0, &t1);
	
	Vec3_Mul1(&intersect,   &t->dir, t0);            /* intersect = dir * t0 */
	Vec3_Add(&t->intersect, &t->origin, &intersect); /* intersect = origin + dir * t0 */
	SetAsValid(t);
	return true;
}

void Picking_CalcPickedBlock(const Vec3* origin, const Vec3* dir, float reach, struct RayTracer* t) {
	if (!RayTrace(t, origin, dir, reach, ClipBlock)) {
		RayTracer_SetInvalid(t);
	}
}

void Picking_ClipCameraPos(const Vec3* origin, const Vec3* dir, float reach, struct RayTracer* t) {
	cc_bool noClip = (!Camera.Clipping || Entities.CurPlayer->Hacks.Noclip)
						&& Entities.CurPlayer->Hacks.CanNoclip;
	if (noClip || !World.Loaded || !RayTrace(t, origin, dir, reach, ClipCamera)) {
		RayTracer_SetInvalid(t);
		Vec3_Mul1(&t->intersect, dir, reach);           /* intersect = dir * reach */
		Vec3_Add(&t->intersect, origin, &t->intersect); /* intersect = origin + dir * reach */
	}
}
