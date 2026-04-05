#ifndef CC_MATHUTILS_H
#define CC_MATHUTILS_H
/* MathUtils.h - ExtMath, Vectors, PackedCol, Queue merged */

/* ===== ExtMath.h ===== */
#ifndef CC_MATH_H
#define CC_MATH_H
#include "Core.h"
CC_BEGIN_HEADER

/* Simple math functions and constants. Also implements a RNG algorithm, based on 
      Java's implementation from https://docs.oracle.com/javase/7/docs/api/java/util/Random.html
   Copyright 2014-2025 ClassiCube | Licensed under BSD-3
*/

#define MATH_PI 3.1415926535897931f
#define MATH_DEG2RAD (MATH_PI / 180.0f)
#define MATH_RAD2DEG (180.0f / MATH_PI)
#define MATH_LARGENUM 1000000000.0f

#define Math_Deg2Packed(x) ((cc_uint8)((x) * 256.0f / 360.0f))
#define Math_Packed2Deg(x) ((x) * 360.0f / 256.0f)

#if defined __GNUC__ && defined __APPLE__ && defined _ARCH_PPC
	/* fabsf is single intrinsic instructions in gcc/clang */
	/* (sqrtf doesn't seem to exist in 10.3 and earlier SDKs) */
	#define Math_AbsF(x)  __builtin_fabsf(x)
	#define Math_SqrtF(x) __builtin_sqrt(x)
#elif defined __GNUC__ && !defined CC_PLAT_PS1
	/* fabsf/sqrtf are single intrinsic instructions in gcc/clang */
	/* (sqrtf is only when -fno-math-errno though) */
	#define Math_AbsF(x)  __builtin_fabsf(x)
	#define Math_SqrtF(x) __builtin_sqrtf(x)
#elif defined NXDK
	#define Math_AbsF(x)  __builtin_fabsf(x)
	#define Math_SqrtF(x) __builtin_sqrtf(x)
#else
	float Math_AbsF(float x);
	float Math_SqrtF(float x);
#endif

float Math_Mod1(float x);

static CC_INLINE int Math_AbsI(int x) { return x < 0 ? -x : x; }

static CC_INLINE float Math_SafeDiv(float a, float b) {
	if (Math_AbsF(b) < 0.000001f) return MATH_LARGENUM;
	return a / b;
}

CC_API double Math_Sin(double x);
CC_API double Math_Cos(double x);
CC_API float Math_SinF(float x);
CC_API float Math_CosF(float x);
/* Computes atan2(y, x), intended primarily for angle calculation*/
/*  Note that accuracy is only up to around 4 decimal places */
float Math_Atan2f(float x, float y);

/* Computes log2(x). Can also be used to approximate log_y(x). */
/*   e.g. for log3(x), use: log2(x)/log2(3) */
double Math_Log2(double x);
/* Computes 2^x. Can also be used to approximate y^x. */
/*   e.g. for 3^x, use: exp2(log2(3)*x) */
double Math_Exp2(double x);

int Math_Floor(float value);
int Math_Ceil(float value);
int Math_ilog2(cc_uint32 value);
int Math_CeilDiv(int a, int b);
int Math_Sign(float value);

/* Clamps the given angle so it lies between [0, 360) */
float Math_ClampAngle(float degrees);
/* Linearly interpolates between a and b */
float Math_Lerp(float a, float b, float t);
/* Linearly interpolates between a given angle range, adjusting if necessary. */
float Math_LerpAngle(float leftAngle, float rightAngle, float t);

int Math_NextPowOf2(int value);
cc_bool Math_IsPowOf2(int value);
#define Math_Clamp(val, min, max) val = val < (min) ? (min) : val;  val = val > (max) ? (max) : val;

typedef cc_uint64 RNGState;
/* Initialises RNG using seed from current UTC time. */
void Random_SeedFromCurrentTime(RNGState* rnd);
/* Initialised RNG using the given seed. */
CC_API  void Random_Seed(      RNGState* rnd, int seed);
typedef void (*FP_Random_Seed)(RNGState* rnd, int seed);

/* Returns integer from 0 inclusive to n exclusive */
CC_API  int Random_Next(      RNGState* rnd, int n);
typedef int (*FP_Random_Next)(RNGState* rnd, int n);
/* Returns real from 0 inclusive to 1 exclusive */
CC_API float Random_Float(RNGState* rnd);
/* Returns integer from min inclusive to max exclusive */
static CC_INLINE int Random_Range(RNGState* rnd, int min, int max) {
	return min + Random_Next(rnd, max - min);
}

CC_END_HEADER
#endif

/* ===== Vectors.h ===== */
#ifndef CC_VECTORS_H
#define CC_VECTORS_H
#include "Constants.h"
CC_BEGIN_HEADER

/* 
Represents 2 and 3 component vectors, and 4 x 4 matrix
  Frustum culling sourced from http://www.crownandcutlass.com/features/technicaldetails/frustum.html
Copyright 2014-2025 ClassiCube | Licensed under BSD-3
*/

/* 2 component vector (2D vector) */
typedef struct Vec2_ { float x, y; } Vec2;
/* 3 component vector (3D vector) */
typedef struct Vec3_ { float x, y, z; } Vec3;
/* 3 component vector (3D integer vector) */
typedef struct IVec3_ { int x, y, z; } IVec3;
/* 4 component vector */
struct Vec4 { float x, y, z, w; };
/* 4x4 matrix. (for vertex transformations) */
struct Matrix { struct Vec4 row1, row2, row3, row4; };

#define Matrix_IdentityValue \
{ \
	{ 1.0f, 0.0f, 0.0f, 0.0f }, \
	{ 0.0f, 1.0f, 0.0f, 0.0f }, \
	{ 0.0f, 0.0f, 1.0f, 0.0f }, \
	{ 0.0f, 0.0f, 0.0f, 1.0f }  \
}

/* Identity matrix. (A * Identity = A) */
extern const struct Matrix Matrix_Identity;

/* Returns a vector with all components set to Int32_MaxValue. */
static CC_INLINE IVec3 IVec3_MaxValue(void) {
	IVec3 v = { Int32_MaxValue, Int32_MaxValue, Int32_MaxValue }; return v;
}
static CC_INLINE Vec3 Vec3_BigPos(void) {
	Vec3 v = { 1e25f, 1e25f, 1e25f }; return v;
}

static CC_INLINE Vec3 Vec3_Create3(float x, float y, float z) {
	Vec3 v; v.x = x; v.y = y; v.z = z; return v;
}

/* Sets the X, Y, and Z components of a 3D vector */
#define Vec3_Set(v, xVal, yVal, zVal) (v).x = xVal; (v).y = yVal; (v).z = zVal;
/* Whether all components of a 3D vector are 0 */
#define Vec3_IsZero(v) ((v).x == 0 && (v).y == 0 && (v).z == 0)

/* Returns the squared length of the vector. */
/* Squared length can be used for comparison, to avoid a costly sqrt() */
/* However, you must sqrt() this when adding lengths. */
static CC_INLINE float Vec3_LengthSquared(const Vec3* v) {
	return v->x * v->x + v->y * v->y + v->z * v->z;
}
/* Adds components of two vectors together. */
static CC_INLINE void Vec3_Add(Vec3* result, const Vec3* a, const Vec3* b) {
	result->x = a->x + b->x; result->y = a->y + b->y; result->z = a->z + b->z;
}
/* Adds a value to each component of a vector. */
static CC_INLINE void Vec3_Add1(Vec3* result, const Vec3* a, float b) {
	result->x = a->x + b; result->y = a->y + b; result->z = a->z + b;
}
/* Subtracts components of two vectors from each other. */
static CC_INLINE void Vec3_Sub(Vec3* result, const Vec3* a, const Vec3* b) {
	result->x = a->x - b->x; result->y = a->y - b->y; result->z = a->z - b->z;
}
/* Mulitplies each component of a vector by a value. */
static CC_INLINE void Vec3_Mul1(Vec3* result, const Vec3* a, float b) {
	result->x = a->x * b; result->y = a->y * b; result->z = a->z * b;
}
/* Multiplies components of two vectors together. */
static CC_INLINE void Vec3_Mul3(Vec3* result, const Vec3* a, const Vec3* b) {
	result->x = a->x * b->x; result->y = a->y * b->y; result->z = a->z * b->z;
}
/* Negates the components of a vector. */
static CC_INLINE void Vec3_Negate(Vec3* result, Vec3* a) {
	result->x = -a->x; result->y = -a->y; result->z = -a->z;
}

#define Vec3_AddBy(dst, value) Vec3_Add(dst, dst, value)
#define Vec3_SubBy(dst, value) Vec3_Sub(dst, dst, value)
#define Vec3_Mul1By(dst, value) Vec3_Mul1(dst, dst, value)
#define Vec3_Mul3By(dst, value) Vec3_Mul3(dst, dst, value)

/* Linearly interpolates components of two vectors. */
void Vec3_Lerp(Vec3* result, const Vec3* a, const Vec3* b, float blend);
/* Scales all components of a vector to lie in [-1, 1] */
void Vec3_Normalise(Vec3* v);

/* Transforms a vector by the given matrix. */
void Vec3_Transform(Vec3* result, const Vec3* a, const struct Matrix* mat);
/* Same as Vec3_Transform, but faster since X and Z are assumed as 0. */
void Vec3_TransformY(Vec3* result, float y, const struct Matrix* mat);

Vec3 Vec3_RotateX(Vec3 v, float angle);
Vec3 Vec3_RotateY(Vec3 v, float angle);
Vec3 Vec3_RotateY3(float x, float y, float z, float angle);
Vec3 Vec3_RotateZ(Vec3 v, float angle);

/* Whether all of the components of the two vectors are equal. */
static CC_INLINE cc_bool Vec3_Equals(const Vec3* a, const Vec3* b) {
	return a->x == b->x && a->y == b->y && a->z == b->z;
}

void IVec3_Floor(IVec3* result, const Vec3* a);
void IVec3_ToVec3(Vec3* result, const IVec3* a);
void IVec3_Min(IVec3* result, const IVec3* a, const IVec3* b);
void IVec3_Max(IVec3* result, const IVec3* a, const IVec3* b);

/* Returns a normalised vector facing in the direction described by the given yaw and pitch. */
Vec3 Vec3_GetDirVector(float yawRad, float pitchRad);
/* Returns the yaw and pitch of the given direction vector.
NOTE: This is not an identity function. Returned pitch is always within [-90, 90] degrees.*/
/*void Vec3_GetHeading(Vector3 dir, float* yawRad, float* pitchRad);*/

/* Returns a matrix representing a counter-clockwise rotation around X axis. */
CC_API void Matrix_RotateX(struct Matrix* result, float angle);
/* Returns a matrix representing a counter-clockwise rotation around Y axis. */
CC_API void Matrix_RotateY(struct Matrix* result, float angle);
/* Returns a matrix representing a counter-clockwise rotation around Z axis. */
CC_API void Matrix_RotateZ(struct Matrix* result, float angle);
/* Returns a matrix representing a translation to the given coordinates. */
CC_API void Matrix_Translate(struct Matrix* result, float x, float y, float z);
/* Returns a matrix representing a scaling by the given factors. */
CC_API void Matrix_Scale(struct Matrix* result, float x, float y, float z);

#define Matrix_MulBy(dst, right) Matrix_Mul(dst, dst, right)
/* Multiplies two matrices together. */
/* NOTE: result can be the same pointer as left or right. */
CC_API void Matrix_Mul(struct Matrix* result, const struct Matrix* left, const struct Matrix* right);

void Matrix_LookRot(struct Matrix* result, Vec3 pos, Vec2 rot);

cc_bool FrustumCulling_SphereInFrustum(float x, float y, float z, float radius);
/* Calculates the clipping planes from the combined modelview and projection matrices */
/* Matrix_Mul(&clip, modelView, projection); */
void FrustumCulling_CalcFrustumEquations(struct Matrix* clip);

CC_END_HEADER
#endif

/* ===== PackedCol.h ===== */
#ifndef CC_PACKEDCOL_H
#define CC_PACKEDCOL_H
CC_BEGIN_HEADER

/* Manipulates a packed 32 bit RGBA colour, in a format suitable for the native 3D graphics API vertex colours.
   Copyright 2014-2025 ClassiCube | Licensed under BSD-3
*/

typedef cc_uint32 PackedCol;
#if (CC_GFX_BACKEND == CC_GFX_BACKEND_D3D9) || defined CC_BUILD_XBOX || defined CC_BUILD_DREAMCAST || defined CC_BUILD_XBOX360
	#define PACKEDCOL_B_SHIFT  0
	#define PACKEDCOL_G_SHIFT  8
	#define PACKEDCOL_R_SHIFT 16
	#define PACKEDCOL_A_SHIFT 24
#elif defined CC_BIG_ENDIAN
	#define PACKEDCOL_R_SHIFT 24
	#define PACKEDCOL_G_SHIFT 16
	#define PACKEDCOL_B_SHIFT  8
	#define PACKEDCOL_A_SHIFT  0
#else
	#define PACKEDCOL_R_SHIFT  0
	#define PACKEDCOL_G_SHIFT  8
	#define PACKEDCOL_B_SHIFT 16
	#define PACKEDCOL_A_SHIFT 24
#endif

#define PACKEDCOL_R_MASK (0xFFU << PACKEDCOL_R_SHIFT)
#define PACKEDCOL_G_MASK (0xFFU << PACKEDCOL_G_SHIFT)
#define PACKEDCOL_B_MASK (0xFFU << PACKEDCOL_B_SHIFT)
#define PACKEDCOL_A_MASK (0xFFU << PACKEDCOL_A_SHIFT)

#define PackedCol_R(col) ((cc_uint8)(col >> PACKEDCOL_R_SHIFT))
#define PackedCol_G(col) ((cc_uint8)(col >> PACKEDCOL_G_SHIFT))
#define PackedCol_B(col) ((cc_uint8)(col >> PACKEDCOL_B_SHIFT))
#define PackedCol_A(col) ((cc_uint8)(col >> PACKEDCOL_A_SHIFT))

#define PackedCol_R_Bits(col) ((cc_uint8)(col) << PACKEDCOL_R_SHIFT)
#define PackedCol_G_Bits(col) ((cc_uint8)(col) << PACKEDCOL_G_SHIFT)
#define PackedCol_B_Bits(col) ((cc_uint8)(col) << PACKEDCOL_B_SHIFT)
#define PackedCol_A_Bits(col) ((cc_uint8)(col) << PACKEDCOL_A_SHIFT)

#define PackedCol_Make(r, g, b, a) (PackedCol_R_Bits(r) | PackedCol_G_Bits(g) | PackedCol_B_Bits(b) | PackedCol_A_Bits(a))
#define PACKEDCOL_WHITE PackedCol_Make(255, 255, 255, 255)
#define PACKEDCOL_RGB_MASK (PACKEDCOL_R_MASK | PACKEDCOL_G_MASK | PACKEDCOL_B_MASK)

/* Scales RGB components of the given colour. */
CC_API PackedCol PackedCol_Scale(PackedCol value, float t);
/* Linearly interpolates RGB components of the two given colours. */
CC_API PackedCol PackedCol_Lerp(PackedCol a, PackedCol b, float t);
/* Multiplies RGB components of the two given colours. */
CC_API PackedCol PackedCol_Tint(PackedCol a, PackedCol b);
/* Adds the two colors together in a way that gives a brighter result. */
CC_API PackedCol PackedCol_ScreenBlend(PackedCol a, PackedCol b);

CC_NOINLINE int PackedCol_DeHex(char hex);
CC_NOINLINE cc_bool PackedCol_Unhex(const char* src, int* dst, int count);
CC_NOINLINE void PackedCol_ToHex(cc_string* str, PackedCol value);
CC_NOINLINE cc_bool PackedCol_TryParseHex(const cc_string* str, cc_uint8* rgb);

#define PACKEDCOL_SHADE_X 0.6f
#define PACKEDCOL_SHADE_Z 0.8f
#define PACKEDCOL_SHADE_YMIN 0.5f
/* Retrieves shaded colours for ambient block face lighting */
void PackedCol_GetShaded(PackedCol normal, PackedCol* xSide, PackedCol* zSide, PackedCol* yMin);

CC_END_HEADER
#endif

/* ===== Queue.h ===== */
#ifndef CC_QUEUE_H
#define CC_QUEUE_H
CC_BEGIN_HEADER

struct Queue {
	cc_uint8* entries;    /* Buffer holding the bytes of the queue */
	int structSize; /* Size in bytes of the type of structure this queue holds */
	int capacity;        /* Max number of elements in the buffer */
	int mask;            /* capacity - 1, as capacity is always a power of two */
	int count;           /* Number of used elements */
	int head;            /* Head index into the buffer */
	int tail;            /* Tail index into the buffer */
};
void Queue_Init(struct Queue* queue, cc_uint32 structSize);
/* Appends an entry to the end of the queue, resizing if necessary. */
void Queue_Enqueue(struct Queue* queue, void* item);
/* Retrieves the entry from the front of the queue. */
void* Queue_Dequeue(struct Queue* queue);
/* Frees the memory of the queue and resets the members to 0. */
void Queue_Clear(struct Queue* queue);

CC_END_HEADER
#endif

#endif /* CC_MATHUTILS_H */
