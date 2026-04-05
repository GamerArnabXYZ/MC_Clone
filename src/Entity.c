#include "Entity.h"
#include "MathUtils.h"
#include "World.h"
#include "Block.h"
#include "Event.h"
#include "Game.h"
#include "Camera.h"
#include "Platform.h"
#include "Funcs.h"
#include "Graphics.h"
#include "Lighting.h"
#include "Http.h"
#include "Chat.h"
#include "Model.h"
#include "Input.h"
#include "InputHandler.h"
#include "Gui.h"
#include "Stream.h"
#include "Bitmap.h"
#include "Logger.h"
#include "Options.h"
#include "Errors.h"
#include "Utils.h"
#include "Protocol.h"

const char* const NameMode_Names[NAME_MODE_COUNT]   = { "None", "Hovered", "All", "AllHovered", "AllUnscaled" };
const char* const ShadowMode_Names[SHADOW_MODE_COUNT] = { "None", "SnapToBlock", "Circle", "CircleAll" };


/*########################################################################################################################*
*---------------------------------------------------------Entity----------------------------------------------------------*
*#########################################################################################################################*/
static PackedCol Entity_GetColor(struct Entity* e) {
	Vec3 eyePos = Entity_GetEyePosition(e);
	IVec3 pos; IVec3_Floor(&pos, &eyePos);
	return Lighting.Color(pos.x, pos.y, pos.z);
}

void Entity_Init(struct Entity* e) {
	static const cc_string model = String_FromConst("humanoid");
	Vec3_Set(e->ModelScale, 1,1,1);
	e->Flags      = ENTITY_FLAG_HAS_MODELVB;
	e->uScale     = 1.0f;
	e->vScale     = 1.0f;
	e->PushStrength = 1.0f;
	e->_skinReqID = 0;
	e->SkinRaw[0] = '\0';
	e->NameRaw[0] = '\0';
	Entity_SetModel(e, &model);
}

void Entity_SetName(struct Entity* e, const cc_string* name) {
	EntityNames_Delete(e);
	String_CopyToRawArray(e->NameRaw, name);
}

Vec3 Entity_GetEyePosition(struct Entity* e) {
	Vec3 pos = e->Position; pos.y += Entity_GetEyeHeight(e); return pos;
}

float Entity_GetEyeHeight(struct Entity* e) {
	return e->Model->GetEyeY(e) * e->ModelScale.y;
}

void Entity_GetTransform(struct Entity* e, Vec3 pos, Vec3 scale, struct Matrix* m) {
	struct Matrix tmp;
	Matrix_Scale(m, scale.x, scale.y, scale.z);

	if (e->RotZ != 0.0f) {
		Matrix_RotateZ( &tmp, -e->RotZ * MATH_DEG2RAD);
		Matrix_MulBy(m, &tmp);
	}
	if (e->RotX != 0.0f) {
		Matrix_RotateX( &tmp, -e->RotX * MATH_DEG2RAD);
		Matrix_MulBy(m, &tmp);
	}
	if (e->RotY != 0.0f) {
		Matrix_RotateY( &tmp, -e->RotY * MATH_DEG2RAD);
		Matrix_MulBy(m, &tmp);
	}

	Matrix_Translate(&tmp, pos.x, pos.y, pos.z);
	Matrix_MulBy(m,  &tmp);
	/* return scale * rotZ * rotX * rotY * translate; */
}

void Entity_GetPickingBounds(struct Entity* e, struct AABB* bb) {
	AABB_Offset(bb, &e->ModelAABB, &e->Position);
}

void Entity_GetBounds(struct Entity* e, struct AABB* bb) {
	AABB_Make(bb, &e->Position, &e->Size);
}

static void Entity_ParseScale(struct Entity* e, const cc_string* scale) {
	float value;
	if (!Convert_ParseFloat(scale, &value)) return;
	value = max(value, 0.001f);

	/* local player doesn't allow giant model scales */
	/* (can't climb stairs, extremely CPU intensive collisions) */
	if (e->Flags & ENTITY_FLAG_MODEL_RESTRICTED_SCALE) {
		value = min(value, e->Model->maxScale);
	}
	Vec3_Set(e->ModelScale, value,value,value);
}

static void Entity_SetBlockModel(struct Entity* e, const cc_string* model) {
	static const cc_string block = String_FromConst("block");
	int raw = Block_Parse(model);

	if (raw == -1) {
		/* use default humanoid model */
		e->Model      = Models.Human;
	} else {	
		e->ModelBlock = (BlockID)raw;
		e->Model      = Model_Get(&block);
	}
}

void Entity_SetModel(struct Entity* e, const cc_string* model) {
	cc_string name, scale;
	Vec3_Set(e->ModelScale, 1,1,1);
	String_UNSAFE_Separate(model, '|', &name, &scale);

	/* 'giant' model kept for backwards compatibility */
	if (String_CaselessEqualsConst(&name, "giant")) {
		name = String_FromReadonly("humanoid");
		Vec3_Set(e->ModelScale, 2,2,2);
	}

	e->ModelBlock = BLOCK_AIR;
	e->Model      = Model_Get(&name);
	if (!e->Model) Entity_SetBlockModel(e, &name);

	Entity_ParseScale(e, &scale);
	Entity_UpdateModelBounds(e);

	if (e->Flags & ENTITY_FLAG_HAS_MODELVB)
		Gfx_DeleteDynamicVb(&e->ModelVB);
}

void Entity_UpdateModelBounds(struct Entity* e) {
	struct Model* model = e->Model;
	model->GetCollisionSize(e);
	model->GetPickingBounds(e);

	Vec3_Mul3By(&e->Size,          &e->ModelScale);
	Vec3_Mul3By(&e->ModelAABB.Min, &e->ModelScale);
	Vec3_Mul3By(&e->ModelAABB.Max, &e->ModelScale);
}

cc_bool Entity_TouchesAny(struct AABB* bounds, Entity_TouchesCondition condition) {
	IVec3 bbMin, bbMax;
	BlockID block;
	struct AABB blockBB;
	Vec3 v;
	int x, y, z;

	IVec3_Floor(&bbMin, &bounds->Min);
	IVec3_Floor(&bbMax, &bounds->Max);

	bbMin.x = max(bbMin.x, 0); bbMax.x = min(bbMax.x, World.MaxX);
	bbMin.y = max(bbMin.y, 0); bbMax.y = min(bbMax.y, World.MaxY);
	bbMin.z = max(bbMin.z, 0); bbMax.z = min(bbMax.z, World.MaxZ);

	for (y = bbMin.y; y <= bbMax.y; y++) { v.y = (float)y;
		for (z = bbMin.z; z <= bbMax.z; z++) { v.z = (float)z;
			for (x = bbMin.x; x <= bbMax.x; x++) { v.x = (float)x;

				block = World_GetBlock(x, y, z);
				Vec3_Add(&blockBB.Min, &v, &Blocks.MinBB[block]);
				Vec3_Add(&blockBB.Max, &v, &Blocks.MaxBB[block]);

				if (!AABB_Intersects(&blockBB, bounds)) continue;
				if (condition(block)) return true;
			}
		}
	}
	return false;
}

static cc_bool IsRopeCollide(BlockID b) { return Blocks.ExtendedCollide[b] == COLLIDE_CLIMB; }
cc_bool Entity_TouchesAnyRope(struct Entity* e) {
	struct AABB bounds; Entity_GetBounds(e, &bounds);
	bounds.Max.y += 0.5f / 16.0f;
	return Entity_TouchesAny(&bounds, IsRopeCollide);
}

static const Vec3 entity_liqExpand = { 0.25f/16.0f, 0.0f/16.0f, 0.25f/16.0f };
static cc_bool IsLavaCollide(BlockID b) { return Blocks.ExtendedCollide[b] == COLLIDE_LAVA; }
cc_bool Entity_TouchesAnyLava(struct Entity* e) {
	struct AABB bounds; Entity_GetBounds(e, &bounds);
	AABB_Offset(&bounds, &bounds, &entity_liqExpand);
	return Entity_TouchesAny(&bounds, IsLavaCollide);
}

static cc_bool IsWaterCollide(BlockID b) { return Blocks.ExtendedCollide[b] == COLLIDE_WATER; }
cc_bool Entity_TouchesAnyWater(struct Entity* e) {
	struct AABB bounds; Entity_GetBounds(e, &bounds);
	AABB_Offset(&bounds, &bounds, &entity_liqExpand);
	return Entity_TouchesAny(&bounds, IsWaterCollide);
}


/*########################################################################################################################*
*------------------------------------------------------Entity skins-------------------------------------------------------*
*#########################################################################################################################*/
/* Copies skin data from another entity */
static void Entity_CopySkin(struct Entity* dst, struct Entity* src) {
	dst->TextureId	= src->TextureId;	
	dst->SkinType	= src->SkinType;
	dst->uScale		= src->uScale;
	dst->vScale		= src->vScale;
}

/* Resets skin data for the given entity */
static void Entity_ResetSkin(struct Entity* e) {
	e->TextureId    = 0;
	e->uScale 		= 1.0f; 
	e->vScale 		= 1.0f;
}

static void CheckSkin_Unchecked(struct Entity* e) {
	cc_string skin, eSkin;
	struct Entity* other;
	cc_uint8 flags;
	int i;

	skin = String_FromRawArray(e->SkinRaw);
	for (i = 0; i < ENTITIES_MAX_COUNT; i++) 
	{
		other = Entities.List[i];
		if (!other) continue;
		/* Don't bother checking for other == e, as e->state is UNCHECKED anyways */
		if (other->SkinFetchState < SKIN_FETCH_DOWNLOADING) continue;

		eSkin = String_FromRawArray(other->SkinRaw);
		if (!String_Equals(&skin, &eSkin)) continue;

		/* Another entity with same skin either finished or is downloading */
		if (other->SkinFetchState == SKIN_FETCH_COMPLETED) {
			Entity_CopySkin(e, other);
			e->SkinFetchState = SKIN_FETCH_COMPLETED;
		} else {
			e->SkinFetchState = SKIN_FETCH_WAITINGFOR;
		}
		return;
	}

	flags = e == &LocalPlayer_Instances[0].Base ? HTTP_FLAG_NOCACHE : 0;
	e->_skinReqID     = Http_AsyncGetSkin(&skin, flags);
	e->SkinFetchState = SKIN_FETCH_DOWNLOADING;
}

/* Copies or resets skin data for all entity with same skin */
static void Entity_SetSkinAll(struct Entity* source, cc_bool reset) {
	struct Entity* e;
	cc_string skin, eSkin;
	int i;
	
	skin = String_FromRawArray(source->SkinRaw);

	for (i = 0; i < ENTITIES_MAX_COUNT; i++) 
	{
		if (!Entities.List[i]) continue;

		e     = Entities.List[i];
		eSkin = String_FromRawArray(e->SkinRaw);
		if (!String_Equals(&skin, &eSkin)) continue;

		if (reset) {
			Entity_ResetSkin(e);
		} else {
			Entity_CopySkin(e, source);
		}
		e->SkinFetchState = SKIN_FETCH_COMPLETED;
	}
}

/* Clears hat area from a skin bitmap if it's completely white or black,
   so skins edited with Microsoft Paint or similiar don't have a solid hat */
static void Entity_ClearHat(struct Bitmap* bmp, cc_uint8 skinType) {
	int sizeX  = (bmp->width / 64) * 32;
	int yScale = skinType == SKIN_64x32 ? 32 : 64;
	int sizeY  = (bmp->height / yScale) * 16;
	int x, y;

	/* determine if we actually need filtering */
	for (y = 0; y < sizeY; y++) {
		BitmapCol* row = Bitmap_GetRow(bmp, y) + sizeX;
		for (x = 0; x < sizeX; x++) {
			if (BitmapCol_A(row[x]) != 255) return;
		}
	}

	/* only perform filtering when the entire hat is opaque */
	for (y = 0; y < sizeY; y++) {
		BitmapCol* row = Bitmap_GetRow(bmp, y) + sizeX;
		for (x = 0; x < sizeX; x++) {
			BitmapCol c = row[x];
			if (c == BITMAPCOLOR_WHITE || c == BITMAPCOLOR_BLACK) row[x] = 0;
		}
	}
}

/* Ensures skin is a power of two size, resizing if needed. */
static cc_result EnsurePow2Skin(struct Entity* e, struct Bitmap* bmp) {
	struct Bitmap scaled;
	cc_uint32 stride;
	int width, height;
	int y;

	width  = Math_NextPowOf2(bmp->width);
	height = Math_NextPowOf2(bmp->height);
	if (width == bmp->width && height == bmp->height) return 0;

	scaled.width  = width; 
	scaled.height = height;
	scaled.scan0  = (BitmapCol*)Mem_TryAllocCleared(width * height, BITMAPCOLOR_SIZE);
	if (!scaled.scan0) return ERR_OUT_OF_MEMORY;

	e->uScale = (float)bmp->width  / width;
	e->vScale = (float)bmp->height / height;
	stride = bmp->width * 4;

	for (y = 0; y < bmp->height; y++) {
		BitmapCol* src = Bitmap_GetRow(bmp, y);
		BitmapCol* dst = Bitmap_GetRow(&scaled, y);
		Mem_Copy(dst, src, stride);
	}

	Mem_Free(bmp->scan0);
	*bmp = scaled;
	return 0;
}

static cc_result ApplySkin(struct Entity* e, struct Bitmap* bmp, struct Stream* src, cc_string* skin) {
	cc_result res;
	if ((res = Png_Decode(bmp, src))) return res;

	Gfx_DeleteTexture(&e->TextureId);
	if ((res = EnsurePow2Skin(e, bmp))) return res;
	e->SkinType = Utils_CalcSkinType(bmp);

	if (!Gfx_CheckTextureSize(bmp->width, bmp->height, 0)) {
		Chat_Add1("&cSkin %s is too large", skin);
	} else {
		if (e->Model->flags & MODEL_FLAG_CLEAR_HAT)
			Entity_ClearHat(bmp, e->SkinType);

		e->TextureId = Gfx_CreateTexture(bmp, TEXTURE_FLAG_MANAGED, false);
		Entity_SetSkinAll(e, false);
	}
	return 0;
}

static void LogInvalidSkin(cc_result res, const cc_string* skin, const cc_uint8* data, int size) {
	cc_string msg; char msgBuffer[256];
	String_InitArray(msg, msgBuffer);

	Logger_FormatWarn2(&msg, res, "decoding skin", skin, Platform_DescribeError);
	if (res != PNG_ERR_INVALID_SIG) { Logger_WarnFunc(&msg); return; }

	String_AppendConst(&msg, " (got ");
	String_AppendAll(  &msg, data, min(size, 8));
	String_AppendConst(&msg, ")");
	Logger_WarnFunc(&msg);
}

static void CheckSkin_Downloading(struct Entity* e) {
	struct HttpRequest item;
	struct Stream mem;
	struct Bitmap bmp;
	cc_string skin;
	cc_result res;

	if (!Http_GetResult(e->_skinReqID, &item)) return;
	Entity_SetSkinAll(e, true);
	if (!item.success) return;

	Stream_ReadonlyMemory(&mem, item.data, item.size);
	skin = String_FromRawArray(e->SkinRaw);

	if ((res = ApplySkin(e, &bmp, &mem, &skin))) {
		LogInvalidSkin(res, &skin, item.data, item.size);
	}

	Mem_Free(bmp.scan0);
	HttpRequest_Free(&item);
}

static void Entity_CheckSkin(struct Entity* e) {
	/* Don't check skin if don't have to */
	if (!e->Model->usesSkin) return;

	switch (e->SkinFetchState)
	{
	case SKIN_FETCH_UNCHECKED:
		CheckSkin_Unchecked(e); return;
	case SKIN_FETCH_WAITINGFOR:
		return; /* Waiting for another entity to download it */
	case SKIN_FETCH_DOWNLOADING:
		CheckSkin_Downloading(e); return;
	case SKIN_FETCH_COMPLETED:
		return; /* Nothing to do as skin has been downloaded */
	}
}

/* Returns whether this entity is currently waiting on given skin to download */
static CC_INLINE cc_bool IsWaitingForSkinToDownload(struct Entity* e, cc_string* skin) {
	cc_string eSkin;
	if (e->SkinFetchState != SKIN_FETCH_WAITINGFOR) return false;

	eSkin = String_FromRawArray(e->SkinRaw);
	return String_Equals(skin, &eSkin);
}

/* Transfers skin downloading responsibility to another entity */
static void TransferSkinDownload(struct Entity* e, struct Entity* src) {
	e->SkinFetchState = SKIN_FETCH_DOWNLOADING;
	e->_skinReqID     = src->_skinReqID;
}

/* Either transfers skin download or cancels it altogether */
static void DerefDownloadingSkin(struct Entity* src) {
	struct Entity* e;
	cc_string skin = String_FromRawArray(src->SkinRaw);
	int i;

	for (i = 0; i < ENTITIES_MAX_COUNT; i++) 
	{
		if (!Entities.List[i]) continue;
		e  = Entities.List[i];

		if (!IsWaitingForSkinToDownload(e, &skin)) continue;
		Platform_Log1("Transferring skin download: %s", &skin);
		TransferSkinDownload(e, src);
		return;
	}
	
	Platform_Log1("Cancelling skin download: %s", &skin);
	Http_TryCancel(src->_skinReqID);
}

/* Returns true if no other entities are sharing this skin texture */
static cc_bool CanDeleteTexture(struct Entity* except) {
	int i;
	if (!except->TextureId) return false;

	for (i = 0; i < ENTITIES_MAX_COUNT; i++)
	{
		if (!Entities.List[i] || Entities.List[i] == except)  continue;
		if (Entities.List[i]->TextureId == except->TextureId) return false;
	}
	return true;
}

CC_NOINLINE static void DeleteSkin(struct Entity* e) {
	if (CanDeleteTexture(e)) Gfx_DeleteTexture(&e->TextureId);
	if (e->SkinFetchState == SKIN_FETCH_DOWNLOADING) DerefDownloadingSkin(e);

	Entity_ResetSkin(e);
	e->SkinFetchState = SKIN_FETCH_UNCHECKED;
}

void Entity_SetSkin(struct Entity* e, const cc_string* skin) {
	cc_string tmp; char tmpBuffer[STRING_SIZE];
	DeleteSkin(e);

	if (Utils_IsUrlPrefix(skin)) {
		tmp = *skin;
		e->NonHumanSkin = true;
	} else {
		String_InitArray(tmp, tmpBuffer);
		String_AppendColorless(&tmp, skin);
		e->NonHumanSkin = false;
	}
	String_CopyToRawArray(e->SkinRaw, &tmp);
}

void Entity_LerpAngles(struct Entity* e, float t) {
	struct EntityLocation* prev = &e->prev;
	struct EntityLocation* next = &e->next;

	e->Pitch = Math_LerpAngle(prev->pitch, next->pitch, t);
	e->Yaw   = Math_LerpAngle(prev->yaw,   next->yaw,   t);
	e->RotX  = Math_LerpAngle(prev->rotX,  next->rotX,  t);
	e->RotY  = Math_LerpAngle(prev->rotY,  next->rotY,  t);
	e->RotZ  = Math_LerpAngle(prev->rotZ,  next->rotZ,  t);
}


/*########################################################################################################################*
*--------------------------------------------------------Entities---------------------------------------------------------*
*#########################################################################################################################*/
struct _EntitiesData Entities;

static cc_bool Entities_Tick(struct ScheduledTask2* task) {
	int i;

	for (i = 0; i < ENTITIES_MAX_COUNT; i++)
	{
		if (!Entities.List[i]) continue;
		Entities.List[i]->VTABLE->Tick(Entities.List[i], task->interval);
	}
	return true;
}

void Entities_RenderModels(float delta, float t) {
	int i;
	Gfx_SetAlphaTest(true);
	
	for (i = 0; i < ENTITIES_MAX_COUNT; i++)
	{
		if (!Entities.List[i]) continue;
		Entities.List[i]->VTABLE->RenderModel(Entities.List[i], delta, t);
	}
	Gfx_SetAlphaTest(false);
}

static void Entities_ContextLost(void* obj) {
	struct Entity* entity;
	int i;

	for (i = 0; i < ENTITIES_MAX_COUNT; i++)
	{
		entity = Entities.List[i];
		if (!entity) continue;

		if (entity->Flags & ENTITY_FLAG_HAS_MODELVB)
			Gfx_DeleteDynamicVb(&entity->ModelVB);

		if (!Gfx.ManagedTextures)
			DeleteSkin(entity);
	}
}
/* No OnContextCreated, skin textures remade when needed */

void Entities_Remove(int id) {
	struct Entity* e = Entities.List[id];
	if (!e) return;

	Event_RaiseInt(&EntityEvents.Removed, id);
	e->VTABLE->Despawn(e);
	Entities.List[id] = NULL;

	/* TODO: Move to EntityEvents.Removed callback instead */
	if (id < TABLIST_MAX_NAMES && TabList_EntityLinked_Get(id)) {
		TabList_Remove(id);
		TabList_EntityLinked_Reset(id);
	}
}

int Entities_GetClosest(struct Entity* src) {
	Vec3 eyePos = Entity_GetEyePosition(src);
	Vec3 dir    = Vec3_GetDirVector(src->Yaw * MATH_DEG2RAD, src->Pitch * MATH_DEG2RAD);
	float closestDist = -200; /* NOTE: was previously positive infinity */
	int targetID = -1;

	float t0, t1;
	int i;

	for (i = 0; i < ENTITIES_MAX_COUNT; i++) /* because we don't want to pick against local player */
	{
		struct Entity* e = Entities.List[i];
		if (!e || e == &Entities.CurPlayer->Base) continue;
		if (!Intersection_RayIntersectsRotatedBox(eyePos, dir, e, &t0, &t1)) continue;

		if (targetID < 0 || t0 < closestDist) {
			closestDist = t0;
			targetID    = i;
		}
	}
	return targetID;
}

static void Player_Despawn(struct Entity* e) {
	DeleteSkin(e);
	EntityNames_Delete(e);

	if (e->Flags & ENTITY_FLAG_HAS_MODELVB)
		Gfx_DeleteDynamicVb(&e->ModelVB);
}


/*########################################################################################################################*
*--------------------------------------------------------TabList----------------------------------------------------------*
*#########################################################################################################################*/
struct _TabListData TabList;

/* Removes the names from the names buffer for the given id. */
static void TabList_Delete(EntityID id) {
	int i, index;
	index = TabList.NameOffsets[id];
	if (!index) return;

	StringsBuffer_Remove(&TabList._buffer, index - 1);
	StringsBuffer_Remove(&TabList._buffer, index - 2);
	StringsBuffer_Remove(&TabList._buffer, index - 3);

	/* Indices after this entry need to be shifted down */
	for (i = 0; i < TABLIST_MAX_NAMES; i++) {
		if (TabList.NameOffsets[i] > index) TabList.NameOffsets[i] -= 3;
	}
}

void TabList_Remove(EntityID id) {
	TabList_Delete(id);
	TabList.NameOffsets[id] = 0;
	TabList.GroupRanks[id]  = 0;
	Event_RaiseInt(&TabListEvents.Removed, id);
}

void TabList_Set(EntityID id, const cc_string* player_, const cc_string* list, const cc_string* group, cc_uint8 rank) {
	cc_string oldPlayer, oldList, oldGroup;
	cc_uint8 oldRank;
	struct Event_Int* events;

	/* Player name shouldn't have colour codes */
	/*  (intended for e.g. tab autocomplete) */
	cc_string player; char playerBuffer[STRING_SIZE];
	String_InitArray(player, playerBuffer);
	String_AppendColorless(&player, player_);
	
	if (TabList.NameOffsets[id]) {
		oldPlayer = TabList_UNSAFE_GetPlayer(id);
		oldList   = TabList_UNSAFE_GetList(id);
		oldGroup  = TabList_UNSAFE_GetGroup(id);
		oldRank   = TabList.GroupRanks[id];

		/* Don't redraw the tab list if nothing changed */
		if (String_Equals(&player, &oldPlayer) && String_Equals(list, &oldList)
			&& String_Equals(group, &oldGroup) && rank == oldRank) return;

		events = &TabListEvents.Changed;
	} else {
		events = &TabListEvents.Added;
	}
	TabList_Delete(id);

	StringsBuffer_Add(&TabList._buffer, &player);
	StringsBuffer_Add(&TabList._buffer, list);
	StringsBuffer_Add(&TabList._buffer, group);

	TabList.NameOffsets[id] = TabList._buffer.count;
	TabList.GroupRanks[id]  = rank;
	Event_RaiseInt(events, id);
}

static void Tablist_Init(void) {
	TabList_Set(ENTITIES_SELF_ID, &Game_Username, &Game_Username, &String_Empty, 0);
}

static void TabList_Clear(void) {
	Mem_Set(TabList.NameOffsets, 0, sizeof(TabList.NameOffsets));
	Mem_Set(TabList.GroupRanks,  0, sizeof(TabList.GroupRanks));
	StringsBuffer_Clear(&TabList._buffer);
}

struct IGameComponent TabList_Component = {
	Tablist_Init,  /* Init  */
	TabList_Clear, /* Free  */
	TabList_Clear  /* Reset */
};


/*########################################################################################################################*
*------------------------------------------------------LocalPlayer--------------------------------------------------------*
*#########################################################################################################################*/
struct LocalPlayer LocalPlayer_Instances[MAX_LOCAL_PLAYERS];
static cc_bool hackPermMsgs;
static struct LocalPlayerInput* sources_head;
static struct LocalPlayerInput* sources_tail;

void LocalPlayerInput_Add(struct LocalPlayerInput* source) {
	LinkedList_Append(source, sources_head, sources_tail);
}

void LocalPlayerInput_Remove(struct LocalPlayerInput* source) {
	struct LocalPlayerInput* cur;
	LinkedList_Remove(source, cur, sources_head, sources_tail);
}

float LocalPlayer_JumpHeight(struct LocalPlayer* p) {
	return (float)PhysicsComp_CalcMaxHeight(p->Physics.JumpVel);
}

void LocalPlayer_SetInterpPosition(struct LocalPlayer* p, float t) {
	if (!(p->Hacks.WOMStyleHacks && p->Hacks.Noclip)) {
		Vec3_Lerp(&p->Base.Position, &p->Base.prev.pos, &p->Base.next.pos, t);
	}
	Entity_LerpAngles(&p->Base, t);
}

static void LocalPlayer_HandleInput(struct LocalPlayer* p, float* xMoving, float* zMoving) {
	struct HacksComp* hacks = &p->Hacks;
	struct LocalPlayerInput* input;
	if (Gui.InputGrab) return;

	/* keyboard input, touch, joystick, etc */
	for (input = sources_head; input; input = input->next) {
		input->GetMovement(p, xMoving, zMoving);
	}
	*xMoving *= 0.98f;
	*zMoving *= 0.98f;

	if (hacks->WOMStyleHacks && hacks->Enabled && hacks->CanNoclip) {
		if (hacks->Noclip) {
			/* need a { } block because it's a macro */
			Vec3_Set(p->Base.Velocity, 0,0,0);
		}
		HacksComp_SetNoclip(hacks, hacks->_noclipping);
	}
}

static void LocalPlayer_SetLocation(struct Entity* e, struct LocationUpdate* update) {
	struct LocalPlayer* p = (struct LocalPlayer*)e;
	LocalInterpComp_SetLocation(&p->Interp, update, e);
}

static void LocalPlayer_Tick(struct Entity* e, float delta) {
	struct LocalPlayer* p = (struct LocalPlayer*)e;
	struct HacksComp* hacks = &p->Hacks;
	float xMoving = 0, zMoving = 0;
	cc_bool wasOnGround;
	Vec3 headingVelocity;

	if (!World.Loaded) return;
	p->Collisions.StepSize = hacks->FullBlockStep && hacks->Enabled && hacks->CanSpeed ? 1.0f : 0.5f;
	p->OldVelocity = e->Velocity;
	wasOnGround    = e->OnGround;

	LocalInterpComp_AdvanceState(&p->Interp, e);
	LocalPlayer_HandleInput(p, &xMoving, &zMoving);
	hacks->Floating = hacks->Noclip || hacks->Flying;
	if (!hacks->Floating && hacks->CanBePushed) PhysicsComp_DoEntityPush(e);

	/* Immediate stop in noclip mode */
	if (!hacks->NoclipSlide && (hacks->Noclip && xMoving == 0 && zMoving == 0)) {
		Vec3_Set(e->Velocity, 0,0,0);
	}

	PhysicsComp_UpdateVelocityState(&p->Physics);
	headingVelocity = Vec3_RotateY3(xMoving, 0, zMoving, e->Yaw * MATH_DEG2RAD);
	PhysicsComp_PhysicsTick(&p->Physics, headingVelocity);

	/* Fixes high jump, when holding down a movement key, jump, fly, then let go of fly key */
	if (p->Hacks.Floating) e->Velocity.y = 0.0f;

	e->next.pos = e->Position; e->Position = e->prev.pos;
	AnimatedComp_Update(e, e->prev.pos, e->next.pos, delta);
	TiltComp_Update(p, &p->Tilt, delta);

	Entity_CheckSkin(&p->Base);
	SoundComp_Tick(p, wasOnGround);
}

static void LocalPlayer_RenderModel(struct Entity* e, float delta, float t) {
	struct LocalPlayer* p = (struct LocalPlayer*)e;
	AnimatedComp_GetCurrent(e, t);

	if (!Camera.Active->isThirdPerson && p == Entities.CurPlayer) return;
	Model_Render(e->Model, e);
}

static cc_bool LocalPlayer_ShouldRenderName(struct Entity* e) {
	return Camera.Active->isThirdPerson;
}

static void LocalPlayer_CheckJumpVelocity(void* obj) {
	struct LocalPlayer* p = (struct LocalPlayer*)obj;
	if (!HacksComp_CanJumpHigher(&p->Hacks)) {
		p->Physics.JumpVel = p->Physics.ServerJumpVel;
	}
}

static const struct EntityVTABLE localPlayer_VTABLE = {
	LocalPlayer_Tick,        Player_Despawn,         LocalPlayer_SetLocation, Entity_GetColor,
	LocalPlayer_RenderModel, LocalPlayer_ShouldRenderName
};
static void LocalPlayer_Init(struct LocalPlayer* p, int index) {
	struct HacksComp* hacks = &p->Hacks;

	Entity_Init(&p->Base);
	Entity_SetName(&p->Base, &Game_Username);
	Entity_SetSkin(&p->Base, &Game_Username);
	Event_Register_(&UserEvents.HackPermsChanged, p, LocalPlayer_CheckJumpVelocity);

	p->Collisions.Entity = &p->Base;
	HacksComp_Init(hacks);
	PhysicsComp_Init(&p->Physics, &p->Base);
	TiltComp_Init(&p->Tilt);

	p->Base.Flags |= ENTITY_FLAG_MODEL_RESTRICTED_SCALE;
	p->ReachDistance = 5.0f;
	p->Physics.Hacks = &p->Hacks;
	p->Physics.Collisions = &p->Collisions;
	p->Base.VTABLE   = &localPlayer_VTABLE;
	p->index = index;

	hacks->Enabled = !Game_PureClassic && Options_GetBool(OPT_HACKS_ENABLED, true);
	if (Game_ClassicMode) return;

	hacks->SpeedMultiplier = Options_GetFloat(OPT_SPEED_FACTOR,  0.1f, 50.0f, 10.0f);
	hacks->PushbackPlacing = Options_GetBool(OPT_PUSHBACK_PLACING, false);
	hacks->NoclipSlide     = Options_GetBool(OPT_NOCLIP_SLIDE,     false);
	hacks->WOMStyleHacks   = Options_GetBool(OPT_WOM_STYLE_HACKS,  false);
	hacks->FullBlockStep   = Options_GetBool(OPT_FULL_BLOCK_STEP,  false);
	p->Physics.UserJumpVel = Options_GetFloat(OPT_JUMP_VELOCITY, 0.0f, 52.0f, 0.42f);
	p->Physics.JumpVel     = p->Physics.UserJumpVel;
	hackPermMsgs           = Options_GetBool(OPT_HACK_PERM_MSGS, true);
}

void LocalPlayer_ResetJumpVelocity(struct LocalPlayer* p) {
	cc_bool higher = HacksComp_CanJumpHigher(&p->Hacks);

	p->Physics.JumpVel       = higher ? p->Physics.UserJumpVel : 0.42f;
	p->Physics.ServerJumpVel = p->Physics.JumpVel;
}

static void LocalPlayer_Reset(struct LocalPlayer* p) {
	p->ReachDistance = 5.0f;
	Vec3_Set(p->Base.Velocity, 0,0,0);
	LocalPlayer_ResetJumpVelocity(p);
}

static void LocalPlayers_Reset(void) {
	int i;
	for (i = 0; i < Game_NumStates; i++)
	{
		LocalPlayer_Reset(&LocalPlayer_Instances[i]);
	}
}

static void LocalPlayer_OnNewMap(struct LocalPlayer* p) {
	Vec3_Set(p->Base.Velocity, 0,0,0);
	Vec3_Set(p->OldVelocity,   0,0,0);

	p->_warnedRespawn = false;
	p->_warnedFly     = false;
	p->_warnedNoclip  = false;
	p->_warnedZoom    = false;
}

static void LocalPlayers_OnNewMap(void) {
	int i;
	for (i = 0; i < Game_NumStates; i++)
	{
		LocalPlayer_OnNewMap(&LocalPlayer_Instances[i]);
	}
}

static cc_bool LocalPlayer_IsSolidCollide(BlockID b) { return Blocks.Collide[b] == COLLIDE_SOLID; }

static void LocalPlayer_DoRespawn(struct LocalPlayer* p) {
	struct EntityLocation* prev;
	struct LocationUpdate update;
	struct AABB bb;
	Vec3 spawn = p->Spawn;
	IVec3 pos;
	BlockID block;
	float height, spawnY;
	int y;

	if (!World.Loaded) return;
	IVec3_Floor(&pos, &spawn);	

	/* Spawn player at highest solid position to match vanilla Minecraft classic */
	/* Only when player can noclip, since this can let you 'clip' to above solid blocks */
	if (p->Hacks.CanNoclip) {
		AABB_Make(&bb, &spawn, &p->Base.Size);
		for (y = pos.y; y <= World.Height; y++) {
			spawnY = Respawn_HighestSolidY(&bb);

			if (spawnY == RESPAWN_NOT_FOUND) {
				block   = World_SafeGetBlock(pos.x, y, pos.z);
				height  = Blocks.Collide[block] == COLLIDE_SOLID ? Blocks.MaxBB[block].y : 0.0f;
				spawn.y = y + height + ENTITY_ADJUSTMENT;
				break;
			}
			bb.Min.y += 1.0f; bb.Max.y += 1.0f;
		}
	}

	prev = &p->Base.prev;
	CPE_SendNotifyPositionAction(3, prev->pos.x, prev->pos.y, prev->pos.z);

	/* Adjust the position to be slightly above the ground, so that */
	/*  it's obvious to the player that they are being respawned */
	spawn.y += 2.0f/16.0f;

	update.flags = LU_HAS_POS | LU_HAS_YAW | LU_HAS_PITCH;
	update.pos   = spawn;
	update.yaw   = p->SpawnYaw;
	update.pitch = p->SpawnPitch;
	p->Base.VTABLE->SetLocation(&p->Base, &update);

	Vec3_Set(p->Base.Velocity, 0,0,0);
	/* Update onGround, otherwise if 'respawn' then 'space' is pressed, you still jump into the air if onGround was true before */
	Entity_GetBounds(&p->Base, &bb);
	bb.Min.y -= 0.01f; bb.Max.y = bb.Min.y;
	p->Base.OnGround = Entity_TouchesAny(&bb, LocalPlayer_IsSolidCollide);
}

static cc_bool LocalPlayer_HandleRespawn(int key, struct InputDevice* device) {
	struct LocalPlayer* p = &LocalPlayer_Instances[device->mappedIndex];
	if (Gui.InputGrab) return false;
	
	if (p->Hacks.CanRespawn) {
		LocalPlayer_DoRespawn(p);
		return true;
	} else if (!p->_warnedRespawn) {
		p->_warnedRespawn = true;
		if (hackPermMsgs) Chat_AddRaw("&cRespawning is currently disabled");
	}
	return false;
}

static cc_bool LocalPlayer_HandleSetSpawn(int key, struct InputDevice* device) {
	struct LocalPlayer* p = &LocalPlayer_Instances[device->mappedIndex];
	if (Gui.InputGrab) return false;
	
	if (p->Hacks.CanRespawn) {

		if (!p->Hacks.CanNoclip && !p->Base.OnGround) {
			Chat_AddRaw("&cCannot set spawn midair when noclip is disabled");
			return false;
		}

		/* Spawn is normally centered to match vanilla Minecraft classic */
		if (!p->Hacks.CanNoclip) {
			/* Don't want to use Position because it is interpolated between prev and next. */
			/* This means it can be halfway between stepping up a stair and clip through the floor. */
			p->Spawn   = p->Base.prev.pos;
		} else {
			p->Spawn.x = Math_Floor(p->Base.Position.x) + 0.5f;
			p->Spawn.y = p->Base.Position.y;
			p->Spawn.z = Math_Floor(p->Base.Position.z) + 0.5f;
		}
		
		p->SpawnYaw   = p->Base.Yaw;
		if (!Game_ClassicMode) p->SpawnPitch = p->Base.Pitch;

		CPE_SendNotifyPositionAction(4, p->Spawn.x, p->Spawn.y, p->Spawn.z);
	}
	return LocalPlayer_HandleRespawn(key, device);
}

static cc_bool LocalPlayer_HandleFly(int key, struct InputDevice* device) {
	struct LocalPlayer* p = &LocalPlayer_Instances[device->mappedIndex];
	if (Gui.InputGrab) return false;

	if (p->Hacks.CanFly && p->Hacks.Enabled) {
		HacksComp_SetFlying(&p->Hacks, !p->Hacks.Flying);
		return true;
	} else if (!p->_warnedFly) {
		p->_warnedFly = true;
		if (hackPermMsgs) Chat_AddRaw("&cFlying is currently disabled");
	}
	return false;
}

static cc_bool LocalPlayer_HandleNoclip(int key, struct InputDevice* device) {
	struct LocalPlayer* p = &LocalPlayer_Instances[device->mappedIndex];
	p->Hacks._noclipping = true;
	if (Gui.InputGrab) return false;

	if (p->Hacks.CanNoclip && p->Hacks.Enabled) {
		if (p->Hacks.WOMStyleHacks) return true; /* don't handle this here */
		if (p->Hacks.Noclip) p->Base.Velocity.y = 0;

		HacksComp_SetNoclip(&p->Hacks, !p->Hacks.Noclip);
		return true;
	} else if (!p->_warnedNoclip) {
		p->_warnedNoclip = true;
		if (hackPermMsgs) Chat_AddRaw("&cNoclip is currently disabled");
	}
	return false;
}

static cc_bool LocalPlayer_HandleJump(int key, struct InputDevice* device) {
	struct LocalPlayer* p = &LocalPlayer_Instances[device->mappedIndex];
	struct HacksComp* hacks     = &p->Hacks;
	struct PhysicsComp* physics = &p->Physics;
	int maxJumps;
	if (Gui.InputGrab) return false;
	physics->Jumping = true;

	if (!p->Base.OnGround && !(hacks->Flying || hacks->Noclip)) {
		maxJumps = hacks->CanDoubleJump && hacks->WOMStyleHacks ? 2 : 0;
		maxJumps = max(maxJumps, hacks->MaxJumps - 1);

		if (physics->MultiJumps < maxJumps) {
			PhysicsComp_DoNormalJump(physics);
			physics->MultiJumps++;
		}
		return true;
	}
	return false;
}


static cc_bool LocalPlayer_TriggerHalfSpeed(int key, struct InputDevice* device) {
	struct HacksComp* hacks = &LocalPlayer_Instances[device->mappedIndex].Hacks;
	cc_bool touch = device->type == INPUT_DEVICE_TOUCH;
	if (Gui.InputGrab) return false;

	hacks->HalfSpeeding = (!touch || !hacks->HalfSpeeding) && hacks->Enabled;
	return true;
}

static cc_bool LocalPlayer_TriggerSpeed(int key, struct InputDevice* device) {
	struct HacksComp* hacks = &LocalPlayer_Instances[device->mappedIndex].Hacks;
	cc_bool touch = device->type == INPUT_DEVICE_TOUCH;
	if (Gui.InputGrab) return false;

	hacks->Speeding = (!touch || !hacks->Speeding) && hacks->Enabled;
	return true;
}

static void LocalPlayer_ReleaseHalfSpeed(int key, struct InputDevice* device) {
	struct HacksComp* hacks = &LocalPlayer_Instances[device->mappedIndex].Hacks;
	if (device->type != INPUT_DEVICE_TOUCH) hacks->HalfSpeeding = false;
}

static void LocalPlayer_ReleaseSpeed(int key, struct InputDevice* device) {
	struct HacksComp* hacks = &LocalPlayer_Instances[device->mappedIndex].Hacks;
	if (device->type != INPUT_DEVICE_TOUCH) hacks->Speeding = false;
}


static cc_bool LocalPlayer_TriggerFlyUp(int key, struct InputDevice* device) {
	struct HacksComp* hacks = &LocalPlayer_Instances[device->mappedIndex].Hacks;
	if (Gui.InputGrab) return false;
	
	hacks->FlyingUp = true;
	return hacks->CanFly && hacks->Enabled;
}

static cc_bool LocalPlayer_TriggerFlyDown(int key, struct InputDevice* device) {
	struct HacksComp* hacks = &LocalPlayer_Instances[device->mappedIndex].Hacks;
	if (Gui.InputGrab) return false;
	
	hacks->FlyingDown = true;
	return hacks->CanFly && hacks->Enabled;
}

static void LocalPlayer_ReleaseFlyUp(int key, struct InputDevice* device) {
	LocalPlayer_Instances[device->mappedIndex].Hacks.FlyingUp   = false;
}

static void LocalPlayer_ReleaseFlyDown(int key, struct InputDevice* device) {
	LocalPlayer_Instances[device->mappedIndex].Hacks.FlyingDown = false;
}

static void LocalPlayer_ReleaseJump(int key, struct InputDevice* device) {
	LocalPlayer_Instances[device->mappedIndex].Physics.Jumping = false;
}

static void LocalPlayer_ReleaseNoclip(int key, struct InputDevice* device) {
	LocalPlayer_Instances[device->mappedIndex].Hacks._noclipping = false;
}

static void LocalPlayer_HookBinds(void) {
	Bind_OnTriggered[BIND_RESPAWN]   = LocalPlayer_HandleRespawn;
	Bind_OnTriggered[BIND_SET_SPAWN] = LocalPlayer_HandleSetSpawn;
	Bind_OnTriggered[BIND_FLY]       = LocalPlayer_HandleFly;
	Bind_OnTriggered[BIND_NOCLIP]    = LocalPlayer_HandleNoclip;
	Bind_OnTriggered[BIND_JUMP]      = LocalPlayer_HandleJump;

	Bind_OnTriggered[BIND_HALF_SPEED] = LocalPlayer_TriggerHalfSpeed;
	Bind_OnTriggered[BIND_SPEED]      = LocalPlayer_TriggerSpeed;
	Bind_OnReleased[BIND_HALF_SPEED]  = LocalPlayer_ReleaseHalfSpeed;
	Bind_OnReleased[BIND_SPEED]       = LocalPlayer_ReleaseSpeed;

	Bind_OnTriggered[BIND_FLY_UP]   = LocalPlayer_TriggerFlyUp;
	Bind_OnTriggered[BIND_FLY_DOWN] = LocalPlayer_TriggerFlyDown;
	Bind_OnReleased[BIND_FLY_UP]    = LocalPlayer_ReleaseFlyUp;
	Bind_OnReleased[BIND_FLY_DOWN]  = LocalPlayer_ReleaseFlyDown;

	Bind_OnReleased[BIND_JUMP]    = LocalPlayer_ReleaseJump;
	Bind_OnReleased[BIND_NOCLIP]  = LocalPlayer_ReleaseNoclip;
}

cc_bool LocalPlayer_CheckCanZoom(struct LocalPlayer* p) {
	if (p->Hacks.CanFly) return true;

	if (!p->_warnedZoom) {
		p->_warnedZoom = true;
		if (hackPermMsgs) Chat_AddRaw("&cCannot zoom camera out as flying is currently disabled");
	}
	return false;
}

void LocalPlayers_MoveToSpawn(struct LocationUpdate* update) {
	struct LocalPlayer* p;
	int i;
	
	for (i = 0; i < Game_NumStates; i++)
	{
		p = &LocalPlayer_Instances[i];
		p->Base.VTABLE->SetLocation(&p->Base, update);
		
		if (update->flags & LU_HAS_POS)   p->Spawn      = update->pos;
		if (update->flags & LU_HAS_YAW)   p->SpawnYaw   = update->yaw;
		if (update->flags & LU_HAS_PITCH) p->SpawnPitch = update->pitch;
	}
	
	/* TODO: This needs to be before new map... */
	Camera.CurrentPos = Camera.Active->GetPosition(0.0f);
}

void LocalPlayer_CalcDefaultSpawn(struct LocalPlayer* p, struct LocationUpdate* update) {
	float x = (World.Width  / 2) + 0.5f;
	float z = (World.Length / 2) + 0.5f;

	update->flags = LU_HAS_POS | LU_HAS_YAW | LU_HAS_PITCH;
	update->pos   = Respawn_FindSpawnPosition(x, z, p->Base.Size);
	update->yaw   = 0.0f;
	update->pitch = 0.0f;
}


/*########################################################################################################################*
*-------------------------------------------------------NetPlayer---------------------------------------------------------*
*#########################################################################################################################*/
struct NetPlayer NetPlayers_List[MAX_NET_PLAYERS];

static void NetPlayer_SetLocation(struct Entity* e, struct LocationUpdate* update) {
	struct NetPlayer* p = (struct NetPlayer*)e;
	NetInterpComp_SetLocation(&p->Interp, update, e);
}

static void NetPlayer_Tick(struct Entity* e, float delta) {
	struct NetPlayer* p = (struct NetPlayer*)e;
	NetInterpComp_AdvanceState(&p->Interp, e);

	Entity_CheckSkin(e);
	AnimatedComp_Update(e, e->prev.pos, e->next.pos, delta);
}

static void NetPlayer_RenderModel(struct Entity* e, float delta, float t) {
	Vec3_Lerp(&e->Position, &e->prev.pos, &e->next.pos, t);
	Entity_LerpAngles(e, t);

	AnimatedComp_GetCurrent(e, t);
	e->ShouldRender = Model_ShouldRender(e);
	/* Original classic only shows players up to 64 blocks away */
	if (Game_ClassicMode) e->ShouldRender &= Model_RenderDistance(e) <= 64 * 64;

	if (e->ShouldRender) Model_Render(e->Model, e);
}

static cc_bool NetPlayer_ShouldRenderName(struct Entity* e) {
	float distance;
	int threshold;
	if (!e->ShouldRender) return false;

	distance  = Model_RenderDistance(e);
	threshold = Entities.NamesMode == NAME_MODE_ALL_UNSCALED ? 8192 * 8192 : 32 * 32;
	return distance <= (float)threshold;
}

static const struct EntityVTABLE netPlayer_VTABLE = {
	NetPlayer_Tick,        Player_Despawn,       NetPlayer_SetLocation, Entity_GetColor,
	NetPlayer_RenderModel, NetPlayer_ShouldRenderName
};
void NetPlayer_Init(struct NetPlayer* p) {
	Mem_Set(p, 0, sizeof(struct NetPlayer));
	Entity_Init(&p->Base);
	p->Base.Flags |= ENTITY_FLAG_CLASSIC_ADJUST;
	p->Base.VTABLE = &netPlayer_VTABLE;
}


/*########################################################################################################################*
*---------------------------------------------------Entities component----------------------------------------------------*
*#########################################################################################################################*/
static void Entities_Init(void) {
	int i;
	Event_Register_(&GfxEvents.ContextLost, NULL, Entities_ContextLost);

	Entities.NamesMode = Options_GetEnum(OPT_NAMES_MODE, NAME_MODE_HOVERED,
		NameMode_Names, Array_Elems(NameMode_Names));
	if (Game_ClassicMode) Entities.NamesMode = NAME_MODE_HOVERED;

	Entities.ShadowsMode = Options_GetEnum(OPT_ENTITY_SHADOW, SHADOW_MODE_NONE,
		ShadowMode_Names, Array_Elems(ShadowMode_Names));
	if (Game_ClassicMode) Entities.ShadowsMode = SHADOW_MODE_NONE;

	for (i = 0; i < Game_NumStates; i++)
	{
		LocalPlayer_Init(&LocalPlayer_Instances[i], i);
		Entities.List[MAX_NET_PLAYERS + i] = &LocalPlayer_Instances[i].Base;
	}
	for (; i < MAX_LOCAL_PLAYERS; i++)
	{
		Entities.List[MAX_NET_PLAYERS + i] = NULL;
	}
	Entities.CurPlayer = &LocalPlayer_Instances[0];
	LocalPlayer_HookBinds();

	Game_Tasks.entities.interval = GAME_DEF_TICKS;
	Game_Tasks.entities.callback = Entities_Tick;
	ScheduledTask2_Add(&Game_Tasks.entities);
}

static void Entities_Free(void) {
	int i;
	for (i = 0; i < ENTITIES_MAX_COUNT; i++)
	{
		Entities_Remove(i);
	}
	sources_head = NULL;
}

struct IGameComponent Entities_Component = {
	Entities_Init,  /* Init  */
	Entities_Free,  /* Free  */
	LocalPlayers_Reset,    /* Reset */
	LocalPlayers_OnNewMap, /* OnNewMap */
};

/* ===== EntityRenderers (merged) ===== */
#include "Particle.h"
#include "Drawer2D.h"
#include "Server.h"

/*########################################################################################################################*
*------------------------------------------------------Entity Shadow------------------------------------------------------*
*#########################################################################################################################*/
static cc_bool shadows_boundTex;
static GfxResourceID shadows_VB;
static GfxResourceID shadows_tex;
static float shadow_radius, shadow_uvScale;
struct ShadowData { float y; BlockID block; cc_uint8 alpha; };

/* Circle shadows extend at most 4 blocks vertically */
#define SHADOW_MAX_RANGE 4 
/* Circle shadows on blocks underneath the top block can be chopped up into at most 4 pieces */
#define SHADOW_MAX_PER_SUB_BLOCK (4 * 4) 
/* Circle shadows use at most:
   - 4 vertices for top most block
   - MAX_PER_SUB_BLOCK for everyblock underneath the top block */
#define SHADOW_MAX_PER_COLUMN (4 + SHADOW_MAX_PER_SUB_BLOCK * (SHADOW_MAX_RANGE - 1))
/* Circle shadows may be split across (x,z), (x,z+1), (x+1,z), (x+1,z+1) */
#define SHADOW_MAX_VERTS 4 * SHADOW_MAX_PER_COLUMN

static cc_bool lequal(float a, float b) { return a < b || Math_AbsF(a - b) < 0.001f; }
static void EntityShadow_DrawCoords(struct VertexTextured** vertices, struct Entity* e, struct ShadowData* data, float x1, float z1, float x2, float z2) {
	PackedCol col;
	struct VertexTextured* v;
	Vec3 cen;
	float u1, v1, u2, v2;

	if (lequal(x2, x1) || lequal(z2, z1)) return;
	cen = e->Position;

	u1 = (x1 - cen.x) * shadow_uvScale + 0.5f;
	v1 = (z1 - cen.z) * shadow_uvScale + 0.5f;
	u2 = (x2 - cen.x) * shadow_uvScale + 0.5f;
	v2 = (z2 - cen.z) * shadow_uvScale + 0.5f;
	if (u2 <= 0.0f || v2 <= 0.0f || u1 >= 1.0f || v1 >= 1.0f) return;

	x1 = max(x1, cen.x - shadow_radius); u1 = u1 >= 0.0f ? u1 : 0.0f;
	z1 = max(z1, cen.z - shadow_radius); v1 = v1 >= 0.0f ? v1 : 0.0f;
	x2 = min(x2, cen.x + shadow_radius); u2 = u2 <= 1.0f ? u2 : 1.0f;
	z2 = min(z2, cen.z + shadow_radius); v2 = v2 <= 1.0f ? v2 : 1.0f;

	v   = *vertices;
	col = PackedCol_Make(255, 255, 255, data->alpha);

	v->x = x1; v->y = data->y; v->z = z1; v->Col = col; v->U = u1; v->V = v1; v++;
	v->x = x2; v->y = data->y; v->z = z1; v->Col = col; v->U = u2; v->V = v1; v++;
	v->x = x2; v->y = data->y; v->z = z2; v->Col = col; v->U = u2; v->V = v2; v++;
	v->x = x1; v->y = data->y; v->z = z2; v->Col = col; v->U = u1; v->V = v2; v++;

	*vertices = v;
}

static void EntityShadow_DrawSquareShadow(struct VertexTextured** vertices, float y, float x, float z) {
	PackedCol col = PackedCol_Make(255, 255, 255, 220);
	float     uv1 = 63/128.0f, uv2 = 64/128.0f;
	struct VertexTextured* v = *vertices;

	v->x = x;     v->y = y; v->z = z;     v->Col = col; v->U = uv1; v->V = uv1; v++;
	v->x = x + 1; v->y = y; v->z = z;     v->Col = col; v->U = uv2; v->V = uv1; v++;
	v->x = x + 1; v->y = y; v->z = z + 1; v->Col = col; v->U = uv2; v->V = uv2; v++;
	v->x = x;     v->y = y; v->z = z + 1; v->Col = col; v->U = uv1; v->V = uv2; v++;

	*vertices = v;
}

/* Shadow may extend down multiple blocks vertically */
/* If so, shadow on a block must be 'chopped up' to avoid a shadow underneath block above this one */
static void EntityShadow_DrawCircle(struct VertexTextured** vertices, struct Entity* e, struct ShadowData* data, float x, float z) {
	Vec3 min, max, nMin, nMax;
	int i;
	x = (float)Math_Floor(x); z = (float)Math_Floor(z);
	min = Blocks.MinBB[data[0].block]; max = Blocks.MaxBB[data[0].block];

	EntityShadow_DrawCoords(vertices, e, &data[0], x + min.x, z + min.z, x + max.x, z + max.z);
	for (i = 1; i < 4; i++) 
	{
		if (data[i].block == BLOCK_AIR) return;
		nMin = Blocks.MinBB[data[i].block]; nMax = Blocks.MaxBB[data[i].block];

		EntityShadow_DrawCoords(vertices, e, &data[i], x +  min.x, z + nMin.z, x +  max.x, z +  min.z);
		EntityShadow_DrawCoords(vertices, e, &data[i], x +  min.x, z +  max.z, x +  max.x, z + nMax.z);

		EntityShadow_DrawCoords(vertices, e, &data[i], x + nMin.x, z + nMin.z, x +  min.x, z + nMax.z);
		EntityShadow_DrawCoords(vertices, e, &data[i], x +  max.x, z + nMin.z, x + nMax.x, z + nMax.z);
		min = nMin; max = nMax;
	}
}

static void EntityShadow_CalcAlpha(float playerY, struct ShadowData* data) {
	float height = playerY - data->y;
	if (height <= 6.0f) {
		data->alpha = (cc_uint8)(160 - 160 * height / 6.0f);
		data->y     += 1.0f / 64.0f; 
		return;
	}

	data->alpha = 0;
	if (height <= 16.0f)      data->y += 1.0f / 64.0f;
	else if (height <= 32.0f) data->y += 1.0f / 16.0f;
	else if (height <= 96.0f) data->y += 1.0f / 8.0f;
	else data->y += 1.0f / 4.0f;
}

static cc_bool EntityShadow_GetBlocks(struct Entity* e, int x, int y, int z, struct ShadowData* data) {
	struct ShadowData zeroData = { 0 };
	struct ShadowData* cur;
	float posY, topY;
	cc_bool outside;
	BlockID block; cc_uint8 draw;
	int i;

	for (i = 0; i < 4; i++) { data[i] = zeroData; }
	cur     = data;
	posY    = e->Position.y;
	outside = !World_ContainsXZ(x, z);

	for (i = 0; y >= 0 && i < 4; y--) 
	{
		if (!outside) {
			block = World_GetBlock(x, y, z);
		} else if (y == Env.EdgeHeight - 1) {
			block = Blocks.Draw[Env.EdgeBlock] == DRAW_GAS  ? BLOCK_AIR : BLOCK_BEDROCK;
		} else if (y == Env_SidesHeight - 1) {
			block = Blocks.Draw[Env.SidesBlock] == DRAW_GAS ? BLOCK_AIR : BLOCK_BEDROCK;
		} else {
			block = BLOCK_AIR;
		}

		draw = Blocks.Draw[block];
		if (draw == DRAW_GAS || draw == DRAW_SPRITE || Blocks.IsLiquid[block]) continue;
		topY = y + Blocks.MaxBB[block].y;
		if (topY >= posY + 0.01f) continue;

		cur->block = block; cur->y = topY;
		EntityShadow_CalcAlpha(posY, cur);
		i++; cur++;

		/* Check if the casted shadow will continue on further down. */
		if (Blocks.MinBB[block].x == 0.0f && Blocks.MaxBB[block].x == 1.0f &&
			Blocks.MinBB[block].z == 0.0f && Blocks.MaxBB[block].z == 1.0f) return true;
	}

	if (i < 4) {
		cur->block = Env.EdgeBlock; cur->y = 0.0f;
		EntityShadow_CalcAlpha(posY, cur);
		i++; cur++;
	}
	return true;
}

static void EntityShadow_Draw(struct Entity* e) {
	struct VertexTextured vertices[128]; /* TODO this is less than maxVertes */
	struct VertexTextured* ptr;
	struct ShadowData data[4];
	Vec3 pos;
	float radius;
	int y, count;
	int x1, z1, x2, z2;

	pos = e->Position;
	if (pos.y < 0.0f) return;
	y = min((int)pos.y, World.MaxY);

	radius = 7.0f * min(e->ModelScale.y, 1.0f) * e->Model->shadowScale;
	shadow_radius  = radius / 16.0f;
	shadow_uvScale = 16.0f / (radius * 2.0f);

	ptr = vertices;
	if (Entities.ShadowsMode == SHADOW_MODE_SNAP_TO_BLOCK) {
		x1 = Math_Floor(pos.x); z1 = Math_Floor(pos.z);
		if (!EntityShadow_GetBlocks(e, x1, y, z1, data)) return;

		EntityShadow_DrawSquareShadow(&ptr, data[0].y, x1, z1);
	} else {
		x1 = Math_Floor(pos.x - shadow_radius); z1 = Math_Floor(pos.z - shadow_radius);
		x2 = Math_Floor(pos.x + shadow_radius); z2 = Math_Floor(pos.z + shadow_radius);

		if (EntityShadow_GetBlocks(e, x1, y, z1, data) && data[0].alpha > 0) {
			EntityShadow_DrawCircle(&ptr, e, data, (float)x1, (float)z1);
		}
		if (x1 != x2 && EntityShadow_GetBlocks(e, x2, y, z1, data) && data[0].alpha > 0) {
			EntityShadow_DrawCircle(&ptr, e, data, (float)x2, (float)z1);
		}
		if (z1 != z2 && EntityShadow_GetBlocks(e, x1, y, z2, data) && data[0].alpha > 0) {
			EntityShadow_DrawCircle(&ptr, e, data, (float)x1, (float)z2);
		}
		if (x1 != x2 && z1 != z2 && EntityShadow_GetBlocks(e, x2, y, z2, data) && data[0].alpha > 0) {
			EntityShadow_DrawCircle(&ptr, e, data, (float)x2, (float)z2);
		}
	}

	if (ptr == vertices) return;

	if (!shadows_boundTex) {
		Gfx_BindTexture(shadows_tex);
		shadows_boundTex = true;
	}

	count = (int)(ptr - vertices);
	Gfx_SetDynamicVbData(shadows_VB, vertices, count);
	Gfx_DrawVb_IndexedTris(count);
}


/*########################################################################################################################*
*-----------------------------------------------------Entity Shadows------------------------------------------------------*
*#########################################################################################################################*/
#define sh_size 128
#define sh_half (sh_size / 2)

static void EntityShadows_MakeTexture(void) {
	BitmapCol pixels[sh_size * sh_size];
	BitmapCol color = BitmapCol_Make(0, 0, 0, 200);
	struct Bitmap bmp;
	cc_uint32 x, y;

	Bitmap_Init(bmp, sh_size, sh_size, pixels);
	for (y = 0; y < sh_size; y++) {
		BitmapCol* row = Bitmap_GetRow(&bmp, y);

		for (x = 0; x < sh_size; x++) {
			float dist =
				(sh_half - (x + 0.5f)) * (sh_half - (x + 0.5f)) +
				(sh_half - (y + 0.5f)) * (sh_half - (y + 0.5f));
			row[x] = dist < sh_half * sh_half ? color : 0;
		}
	}
	shadows_tex = Gfx_CreateTexture(&bmp, 0, false);
}

void EntityShadows_Render(void) {
	struct Entity* e;
	int i;
	if (Entities.ShadowsMode == SHADOW_MODE_NONE) return;

	shadows_boundTex = false;
	if (!shadows_tex) 
		EntityShadows_MakeTexture();
	if (!shadows_VB)
		shadows_VB = Gfx_CreateDynamicVb(VERTEX_FORMAT_TEXTURED, SHADOW_MAX_VERTS);

	Gfx_SetAlphaArgBlend(true);
	Gfx_SetDepthWrite(false);
	Gfx_SetAlphaBlending(true);

	Gfx_SetVertexFormat(VERTEX_FORMAT_TEXTURED);
	EntityShadow_Draw(&Entities.CurPlayer->Base);

	if (Entities.ShadowsMode == SHADOW_MODE_CIRCLE_ALL) {	
		for (i = 0; i < ENTITIES_MAX_COUNT; i++) 
		{
			e = Entities.List[i];
			if (!e || !e->ShouldRender || e == &Entities.CurPlayer->Base) continue;
			EntityShadow_Draw(e);
		}
	}

	Gfx_SetAlphaArgBlend(false);
	Gfx_SetDepthWrite(true);
	Gfx_SetAlphaBlending(false);
}


/*########################################################################################################################*
*-----------------------------------------------------Entity nametag------------------------------------------------------*
*#########################################################################################################################*/
static GfxResourceID names_VB;
#define NAME_IS_EMPTY -30000
#define NAME_OFFSET 3 /* offset of back layer of name above an entity */

static void MakeNameTexture(struct Entity* e) {
	cc_string colorlessName; char colorlessBuffer[STRING_SIZE];
	BitmapCol shadowColor = BitmapCol_Make(80, 80, 80, 255);
	BitmapCol origWhiteColor;

	struct DrawTextArgs args;
	struct FontDesc font;
	struct Context2D ctx;
	int width, height;
	cc_string name;

	/* Names are always drawn using default.png font */
	Font_MakeBitmapped(&font, 24, FONT_FLAGS_NONE);
	/* Don't want DPI scaling or padding */
	font.size = 24; font.height = 24;

	name = String_FromRawArray(e->NameRaw);
	DrawTextArgs_Make(&args, &name, &font, false);
	width = Drawer2D_TextWidth(&args);

	if (!width) {
		e->NameTex.ID = 0;
		e->NameTex.x  = NAME_IS_EMPTY;
	} else {
		String_InitArray(colorlessName, colorlessBuffer);
		width  += NAME_OFFSET; 
		height = Drawer2D_TextHeight(&args) + NAME_OFFSET;

		Context2D_Alloc(&ctx, width, height);
		{
			origWhiteColor = Drawer2D.Colors['f'];

			Drawer2D.Colors['f'] = shadowColor;
			Drawer2D_WithoutColors(&colorlessName, &name);
			args.text = colorlessName;
			Context2D_DrawText(&ctx, &args, NAME_OFFSET, NAME_OFFSET);

			Drawer2D.Colors['f'] = origWhiteColor;
			args.text = name;
			Context2D_DrawText(&ctx, &args, 0, 0);
		}
		Context2D_MakeTexture(&e->NameTex, &ctx);
		Context2D_Free(&ctx);
	}
}

static void DrawName(struct Entity* e) {
	struct VertexTextured* vertices;
	struct Model* model;
	struct Matrix mat, transform;
	Vec3 pos;
	float scale;
	Vec2 size;

	if (!e->VTABLE->ShouldRenderName(e)) return;
	if (e->NameTex.x == NAME_IS_EMPTY)   return;
	if (!e->NameTex.ID) MakeNameTexture(e);
	Gfx_BindTexture(e->NameTex.ID);

	if (!names_VB)
		names_VB = Gfx_CreateDynamicVb(VERTEX_FORMAT_TEXTURED, 4);

	model = e->Model;
	Model_GetEntityTransform(model, e, &transform);
	Vec3_TransformY(&pos, model->GetNameY(e), &transform);

	scale  = e->ModelScale.y;
	scale  = scale > 1.0f ? (1.0f/70.0f) : (scale/70.0f);
	size.x = e->NameTex.width * scale; size.y = e->NameTex.height * scale;

	if (Entities.NamesMode == NAME_MODE_ALL_UNSCALED && Entities.CurPlayer->Hacks.CanSeeAllNames) {
		Matrix_Mul(&mat, &Gfx.View, &Gfx.Projection); /* TODO: This mul is slow, avoid it */
		/* Get W component of transformed position */
		scale = pos.x * mat.row1.w + pos.y * mat.row2.w + pos.z * mat.row3.w + mat.row4.w;
		size.x *= scale * 0.2f; size.y *= scale * 0.2f;
	}

	Gfx_SetVertexFormat(VERTEX_FORMAT_TEXTURED);

	vertices = (struct VertexTextured*)Gfx_LockDynamicVb(names_VB, VERTEX_FORMAT_TEXTURED, 4);
	Particle_DoRender(&size, &pos, &e->NameTex.uv, PACKEDCOL_WHITE, vertices);
	Gfx_UnlockDynamicVb(names_VB);

	Gfx_DrawVb_IndexedTris(4);
}

void EntityNames_Delete(struct Entity* e) {
	Gfx_DeleteTexture(&e->NameTex.ID);
	e->NameTex.x = 0; /* X is used as an 'empty name' flag */
}


/*########################################################################################################################*
*-----------------------------------------------------Names rendering-----------------------------------------------------*
*#########################################################################################################################*/
static int closestEntityId;

void EntityNames_Render(void) {
	struct LocalPlayer* p = Entities.CurPlayer;
	cc_bool hadFog;
	int i;

	if (Entities.NamesMode == NAME_MODE_NONE) return;
	if (Server.IsSinglePlayer && Game_NumStates == 1) return;

	closestEntityId = Entities_GetClosest(&p->Base);
	if (!p->Hacks.CanSeeAllNames || Entities.NamesMode != NAME_MODE_ALL) return;

	Gfx_SetAlphaTest(true);
	hadFog = Gfx_GetFog();
	if (hadFog) Gfx_SetFog(false);

	for (i = 0; i < ENTITIES_MAX_COUNT; i++) 
	{
		if (!Entities.List[i]) continue;
		if (i != closestEntityId) DrawName(Entities.List[i]);
	}

	Gfx_SetAlphaTest(false);
	if (hadFog) Gfx_SetFog(true);
}

void EntityNames_RenderHovered(void) {
	struct LocalPlayer* p = Entities.CurPlayer;
	struct Entity* e;
	cc_bool allNames, hadFog;
	cc_bool setupState = false;
	int i;

	if (Entities.NamesMode == NAME_MODE_NONE) return;
	if (Server.IsSinglePlayer && Game_NumStates == 1) return;

	allNames = !(Entities.NamesMode == NAME_MODE_HOVERED || Entities.NamesMode == NAME_MODE_ALL) 
		&& p->Hacks.CanSeeAllNames;

	for (i = 0; i < ENTITIES_MAX_COUNT; i++) 
	{
		e = Entities.List[i];
		if (!e || e == &p->Base) continue;
		if (!allNames && i != closestEntityId) continue;

		/* Only alter the GPU state when actually necessary */
		if (!setupState) {
			Gfx_SetAlphaTest(true);
			Gfx_SetDepthTest(false);
			Gfx_SetDepthWrite(false);

			setupState = true;
			hadFog = Gfx_GetFog();
			if (hadFog) Gfx_SetFog(false);
		}
		DrawName(e);
	}

	if (!setupState) return;
	Gfx_SetAlphaTest(false);
	Gfx_SetDepthTest(true);
	Gfx_SetDepthWrite(true);
	if (hadFog) Gfx_SetFog(true);
}

static void DeleteAllNameTextures(void) {
	int i;
	for (i = 0; i < ENTITIES_MAX_COUNT; i++) 
	{
		if (!Entities.List[i]) continue;
		EntityNames_Delete(Entities.List[i]);
	}
}

static void EntityNames_ChatFontChanged(void* obj) {
	DeleteAllNameTextures();
}


/*########################################################################################################################*
*-----------------------------------------------Entity renderers component------------------------------------------------*
*#########################################################################################################################*/
static void EntityRenderers_ContextLost(void* obj) {
	Gfx_DeleteTexture(&shadows_tex);
	Gfx_DeleteDynamicVb(&shadows_VB);
	
	Gfx_DeleteDynamicVb(&names_VB);
	DeleteAllNameTextures();
}

static void EntityRenderers_Init(void) {
	Event_Register_(&GfxEvents.ContextLost,  NULL, EntityRenderers_ContextLost);
	Event_Register_(&ChatEvents.FontChanged, NULL, EntityNames_ChatFontChanged);
}

static void EntityRenderers_Free(void) {
	EntityRenderers_ContextLost(NULL);
}

struct IGameComponent EntityRenderers_Component = {
	EntityRenderers_Init,  /* Init  */
	EntityRenderers_Free   /* Free  */
};
