/* MathUtils.c - ExtMath, Vectors, PackedCol, Queue merged */
#include "MathUtils.h"

/* ===== ExtMath.c ===== */
#include "Platform.h"
#include "Utils.h"

#define PI 3.141592653589793238462643383279502884197169399

static const cc_uint64 _DBL_NAN = 0x7FF8000000000000ULL;
#define DBL_NAN  *((double*)&_DBL_NAN)
static const cc_uint64 _POS_INF = 0x7FF0000000000000ULL;
#define POS_INF *((double*)&_POS_INF)


int Math_Floor(float value) {
	int valueI = (int)value;
	return valueI > value ? valueI - 1 : valueI;
}

int Math_Ceil(float value) {
	int valueI = (int)value;
	return valueI < value ? valueI + 1 : valueI;
}

int Math_ilog2(cc_uint32 value) {
	cc_uint32 r = 0;
	while (value >>= 1) r++;
	return r;
}

int Math_CeilDiv(int a, int b) {
	return a / b + (a % b != 0 ? 1 : 0);
}

int Math_Sign(float value) {
	if (value > 0.0f) return +1;
	if (value < 0.0f) return -1;
	return 0;
}

float Math_Lerp(float a, float b, float t) {
	return a + (b - a) * t;
}

float Math_ClampAngle(float degrees) {
	while (degrees >= 360.0f) degrees -= 360.0f;
	while (degrees < 0.0f)    degrees += 360.0f;
	return degrees;
}

float Math_LerpAngle(float leftAngle, float rightAngle, float t) {
	/* Need to potentially adjust a bit when interpolating some angles */
	/* Consider 350* --> 0*, we only want to interpolate across the 10* */
	/* But without adjusting for this case, we would interpolate back the whole 350* degrees */
	cc_bool invertLeft  = leftAngle  > 270.0f && rightAngle < 90.0f;
	cc_bool invertRight = rightAngle > 270.0f && leftAngle  < 90.0f;
	if (invertLeft)  leftAngle  = leftAngle  - 360.0f;
	if (invertRight) rightAngle = rightAngle - 360.0f;

	return Math_Lerp(leftAngle, rightAngle, t);
}

int Math_NextPowOf2(int value) {
	int next = 1;
	while (value > next) { next <<= 1; }
	return next;
}

cc_bool Math_IsPowOf2(int value) {
	return value != 0 && (value & (value - 1)) == 0;
}

float Math_Mod1(float x) { return x - (int)x; /* fmodf(x, 1); */ }


/*########################################################################################################################*
*-------------------------------------------------------Math intrinsics---------------------------------------------------*
*#########################################################################################################################*/
/* 32x/Saturn/GBA is missing these intrinsics */
#if defined CC_BUILD_32X || defined CC_BUILD_SATURN || defined CC_BUILD_GBA


float sqrtf(float x) {
	int32_t fp_x = (int32_t)(x * (1 << 16));
	fp_x = sqrt_fix16(fp_x);
	return (float)fp_x / (1 << 16);
}
#endif


#if defined CC_BUILD_PS1
	/* PS1 is missing these intrinsics */
	#include <psxgte.h>
	float Math_AbsF(float x)  { return __builtin_fabsf(x); }

	float Math_SqrtF(float x) { 
		int fp_x = (int)(x * (1 << 12));
		fp_x = SquareRoot12(fp_x);
		return (float)fp_x / (1 << 12);
	}
#elif defined __GNUC__ || defined NXDK
	/* Defined in .h using builtins */
#elif defined __TINYC__ || defined CC_BUILD_ATARIOS || defined CC_BUILD_AMIGA
	/* Older versions of TinyC don't support fabsf or sqrtf */
	/* Those can be used though if compiling with newer TinyC */
	/*  versions for a very small performance improvement */
	#include <math.h>

	float Math_AbsF(float x)  { return fabs(x); }
	float Math_SqrtF(float x) { return sqrt(x); }
#else

	float Math_AbsF(float x)  { return fabsf(x); /* MSVC intrinsic */ }
	float Math_SqrtF(float x) { return sqrtf(x); /* MSVC intrinsic */ }
#endif


/*########################################################################################################################*
*--------------------------------------------------Random number generator------------------------------------------------*
*#########################################################################################################################*/
#define RND_VALUE (0x5DEECE66DULL)
#define RND_MASK ((1ULL << 48) - 1)

void Random_SeedFromCurrentTime(RNGState* rnd) {
	cc_uint64 now = Stopwatch_Measure();
	Random_Seed(rnd, (int)now);
}

void Random_Seed(RNGState* seed, int seedInit) {
	*seed = (seedInit ^ RND_VALUE) & RND_MASK;
}

int Random_Next(RNGState* seed, int n) {
	cc_int64 raw;
	int bits, val;

	if ((n & -n) == n) { /* i.e., n is a power of 2 */
		*seed = (*seed * RND_VALUE + 0xBLL) & RND_MASK;
		raw   = (cc_int64)(*seed >> (48 - 31));
		return (int)((n * raw) >> 31);
	}

	do {
		*seed = (*seed * RND_VALUE + 0xBLL) & RND_MASK;
		bits  = (int)(*seed >> (48 - 31));
		val   = bits % n;
	} while (bits - val + (n - 1) < 0);
	return val;
}

float Random_Float(RNGState* seed) {
	int raw;

	*seed = (*seed * RND_VALUE + 0xBLL) & RND_MASK;
	raw   = (int)(*seed >> (48 - 24));
	return raw / ((float)(1 << 24));
}


/*########################################################################################################################*
*--------------------------------------------------Trigonometric functions-----------------------------------------------*
*#########################################################################################################################*/
#if defined CC_BUILD_DREAMCAST

/* If don't have some code referencing libm, then gldc will fail to link with undefined reference to fabs */
/* TODO: Properly investigate this issue */
/* double make_dreamcast_build_compile(void) { fabs(4); } */

float Math_SinF(float x)   { return sinf(x); }
float Math_CosF(float x)   { return cosf(x); }
#elif CC_BUILD_FPU_MODE < CC_FPU_MODE_NORMAL

// Source https://www.coranac.com/2009/07/sines
#define ISIN_QN	10
#define QA		12
#define ISIN_B	19900
#define	ISIN_C	3516

static CC_INLINE int isin_s4(int x) {
	int c, x2, y;

	c  = x << (30 - ISIN_QN);		// Semi-circle info into carry.
	x -= 1 << ISIN_QN;				// sine -> cosine calc

	x <<= (31 - ISIN_QN);			// Mask with PI
	x >>= (31 - ISIN_QN);			// Note: SIGNED shift! (to QN)
	x  *= x;
	x >>= (2 * ISIN_QN - 14);		// x=x^2 To Q14

	y = ISIN_B - (x * ISIN_C >> 14);// B - x^2*C
	y = (1 << QA) - (x * y >> 16);	// A - x^2*(B-x^2*C)

	return (c >= 0) ? y : (-y);
}

float Math_SinF(float angle) {
	int raw = (int)(angle * MATH_RAD2DEG * 4096 / 360);
	return isin_s4(raw) / 4096.0f;
}

float Math_CosF(float angle) {
	int raw = (int)(angle * MATH_RAD2DEG * 4096 / 360);
	raw += (1 << ISIN_QN); // add offset to calculate cos(x) instead of sin(x)
	return isin_s4(raw) / 4096.0f;
}

#else
/***** Caleb's Math functions *****/

/* This code implements the math functions sine, cosine, arctangent, the
 * exponential function, and the logarithmic function. The code uses techniques
 * exclusively described in the book "Computer Approximations" by John Fraser
 * Hart (1st Edition). Each function approximates their associated math function
 * the same way:
 *
 *   1. First, the function uses properties of the associated math function to
 *      reduce the input range to a small finite interval,
 *
 *   2. Second, the function calculates a polynomial, rational, or similar
 *      function that approximates the associated math function on that small
 *      finite interval to the desired accuracy. These polynomial, rational, or
 *      similar functions were calculated by the authors of "Computer
 *      Approximations" using the Remez algorithm and exist in the book's
 *      appendix.
 */

/* NOTE: NaN/Infinity checking was removed from Cos/Sin functions, */
/*  since ClassiCube does not care about the exact return value */
/*  from the mathematical functions anyways */

/* Global constants */
#define DIV_2_PI (1.0 / (2.0 * PI))

/* Calculates the floor of a double.
 */
static double Floord(double x) {
	if (x >= 0)
		return (double) ((int) x);
	return (double) (((int) x) - 1);
}

/************
 * Math_Sin *
 ************/

/* Calculates the 5th degree polynomial function SIN 2922 listed in the book's
 * appendix.
 *
 * Associated math function: sin(pi/6 * x)
 * Allowed input range: [0, 1]
 * Precision: 16.47
 */
static double SinStage1(double x) {
	const static double A[] = {
		.52359877559829885532,
		-.2392459620393377657e-1,
		.32795319441392666e-3,
		-.214071970654441e-5,
		.815113605169e-8,
		-.2020852964e-10,
	};

	double P = A[5];
	double x_2 = x * x;
	int i;

	for (i = 4; i >= 0; i--) {
		P *= x_2;
		P += A[i];
	}
	P *= x;
	return P;
}

/* Uses the property
 *   sin(x) = sin(x/3) * (3 - 4 * (sin(x/3))^2)
 * to reduce the input range of sin(x) to [0, pi/6].
 *
 * Associated math function: sin(2 * pi * x)
 * Allowed input range: [0, 0.25]
 */
static double SinStage2(double x) {
	double sin_6 = SinStage1(x * 4.0);
	return sin_6 * (3.0 - 4.0 * sin_6 * sin_6);
}

/* Uses the properties of sine to reduce the input range from [0, 2*pi] to [0,
 * pi/2].
 *
 * Associated math function: sin(2 * pi * x)
 * Allowed input range: [0, 1]
 */
static double SinStage3(double x) {
	if (x < 0.25)
		return SinStage2(x);
	if (x < 0.5)
		return SinStage2(0.5 - x);
	if (x < 0.75)
		return -SinStage2(x - 0.5);
	return -SinStage2(1.0 - x);
}

/* Since sine has a period of 2*pi, this function maps any real number to a
 * number from [0, 2*pi].
 *
 * Associated math function: sin(x)
 * Allowed input range: anything
 */
float Math_SinF(float x) {
	double x_div_pi;

	x_div_pi = x * DIV_2_PI;
	return (float)SinStage3(x_div_pi - Floord(x_div_pi));
}

/************
 * Math_Cos *
 ************/

/* This function works just like the above sine function, except it shifts the
 * input by pi/2, using the property cos(x) = sin(x + pi/2).
 *
 * Associated math function: cos(x)
 * Allowed input range: anything
 */
float Math_CosF(float x) {
	double x_div_pi_shifted;

	x_div_pi_shifted = x * DIV_2_PI + 0.25;
	return (float)SinStage3(x_div_pi_shifted - Floord(x_div_pi_shifted));
}
#endif


/*########################################################################################################################*
*--------------------------------------------------Transcendental functions-----------------------------------------------*
*#########################################################################################################################*/
#if defined CC_BUILD_DREAMCAST

double Math_Exp2(double x) { return exp2(x); }
double Math_Log2(double x) { return log2(x); }
#else
/***** Caleb's Math functions *****/

/* This code implements the math functions sine, cosine, arctangent, the
 * exponential function, and the logarithmic function. The code uses techniques
 * exclusively described in the book "Computer Approximations" by John Fraser
 * Hart (1st Edition). Each function approximates their associated math function
 * the same way:
 *
 *   1. First, the function uses properties of the associated math function to
 *      reduce the input range to a small finite interval,
 *
 *   2. Second, the function calculates a polynomial, rational, or similar
 *      function that approximates the associated math function on that small
 *      finite interval to the desired accuracy. These polynomial, rational, or
 *      similar functions were calculated by the authors of "Computer
 *      Approximations" using the Remez algorithm and exist in the book's
 *      appendix.
 */

/* Global constants */
static const double SQRT2 = 1.4142135623730950488016887242096980785696718753769;

/************
 * Math_Exp *
 ************/

/* Calculates the function EXPB 1067 listed in the book's appendix. It is of the
 * form
 *   (Q(x^2) + x*P(x^2)) / (Q(x^2) - x*P(x^2))
 *
 * Associated math function: 2^x
 * Allowed input range: [-1/2, 1/2]
 * Precision: 18.08
 */
static double Exp2Stage1(double x) {
	const double A_P[] = {
		.1513906799054338915894328e4,
		.20202065651286927227886e2,
		.23093347753750233624e-1,
	};

	const double A_Q[] = {
		.4368211662727558498496814e4,
		.233184211427481623790295e3,
		1.0,
	};

	double x_2 = x * x;
	double P, Q;
	int i;

	P = A_P[2];
	for (i = 1; i >= 0; i--) {
		P *= x_2;
		P += A_P[i];
	}
	P *= x;

	Q = A_Q[2];
	for (i = 1; i >= 0; i--) {
		Q *= x_2;
		Q += A_Q[i];
	}

	return (Q + P) / (Q - P);
}

/* Reduces the range of 2^x to [-1/2, 1/2] by using the property
 *   2^x = 2^(integer value) * 2^(fractional part).
 * 2^(integer value) can be calculated by directly manipulating the bits of the
 * double-precision floating point representation.
 *
 * Associated math function: 2^x
 * Allowed input range: anything
 */
double Math_Exp2(double x) {
	int x_int;
	union { double d; cc_uint64 i; } doi;

	if (x == POS_INF || x == DBL_NAN)
		return x;

	x_int = (int)x;

	if (x_int <= -1022)
		return 0.0;
	if (x_int > 1023)
		return POS_INF;

	if (x < 0)
		x_int--;

	doi.i = x_int + 1023;
	doi.i <<= 52;

	return doi.d * SQRT2 * Exp2Stage1(x - (double) x_int - 0.5);
}

/************
 * Math_Log *
 ************/

/* Calculates the 3rd/3rd degree rational function LOG2 2524 listed in the
 * book's appendix.
 *
 * Associated math function: log_2(x)
 * Allowed input range: [0.5, 1]
 * Precision: 8.32
 */
static double Log2Stage1(double x) {
	const double A_P[] = {
		-.205466671951e1,
		-.88626599391e1,
		.610585199015e1,
		.481147460989e1,
	};

	const double A_Q[] = {
		.353553425277,
		.454517087629e1,
		.642784209029e1,
		1.0,
	};

	double P, Q;
	int i;

	P = A_P[3];
	for (i = 2; i >= 0; i--) {
		P *= x;
		P += A_P[i];
	}

	Q = A_Q[3];
	for (i = 2; i >= 0; i--) {
		Q *= x;
		Q += A_Q[i];
	}

	return P / Q;
}

/* Reduces the range of log_2(x) by using the property that
 *   log_2(x) = (x's exponent part) + log_2(x's mantissa part)
 * So, by manipulating the bits of the double-precision floating point number
 * one can reduce the range of the logarithm function.
 *
 * Associated math function: log_2(x)
 * Allowed input range: anything
 */
double Math_Log2(double x) {
	union { double d; cc_uint64 i; } doi;
	int exponent;

	if (x == POS_INF)
		return POS_INF;

	if (x == DBL_NAN || x <= 0.0)
		return DBL_NAN;

	doi.d = x;
	exponent = (doi.i >> 52);
	exponent -= 1023;

	doi.i |= (((cc_uint64) 1023) << 52);
	doi.i &= ~(((cc_uint64) 1024) << 52);

	return exponent + Log2Stage1(doi.d);
}
#endif


// Approximation of atan2f using the Remez algorithm
//  https://math.stackexchange.com/a/1105038
float Math_Atan2f(float x, float y) {
	float ax, ay, a, s, r;

	if (x == 0) {
		if (y > 0) return  PI / 2.0f;
		if (y < 0) return -PI / 2.0f;
		return 0; /* Should probably be NaN */
	}
	
	ax = Math_AbsF(x);
	ay = Math_AbsF(y);

	a = (ax < ay) ? (ax / ay) : (ay / ax);
	s = a * a;
	r = ((-0.0464964749f * s + 0.15931422f) * s - 0.327622764f) * s * a + a;

	if (ay > ax) r = 1.57079637f - r;
	if (x < 0)   r = 3.14159274f - r;
	if (y < 0)   r = -r;
	return r;
}

double Math_Sin(double x) { return Math_SinF(x); }
double Math_Cos(double x) { return Math_CosF(x); }

/* ===== Vectors.c ===== */
#include "Funcs.h"
#include "Constants.h"
#include "Core.h"

void Vec3_Lerp(Vec3* result, const Vec3* a, const Vec3* b, float blend) {
	result->x = blend * (b->x - a->x) + a->x;
	result->y = blend * (b->y - a->y) + a->y;
	result->z = blend * (b->z - a->z) + a->z;
}

void Vec3_Normalise(Vec3* v) {
	float scale, lenSquared;
	lenSquared = v->x * v->x + v->y * v->y + v->z * v->z;
	/* handle zero vector */
	if (lenSquared == 0.0f) return;

	scale = 1.0f / Math_SqrtF(lenSquared);
	v->x  = v->x * scale;
	v->y  = v->y * scale;
	v->z  = v->z * scale;
}

void Vec3_Transform(Vec3* result, const Vec3* a, const struct Matrix* mat) {
	/* a could be pointing to result - therefore can't directly assign X/Y/Z */
	float x = a->x * mat->row1.x + a->y * mat->row2.x + a->z * mat->row3.x + mat->row4.x;
	float y = a->x * mat->row1.y + a->y * mat->row2.y + a->z * mat->row3.y + mat->row4.y;
	float z = a->x * mat->row1.z + a->y * mat->row2.z + a->z * mat->row3.z + mat->row4.z;
	result->x = x; result->y = y; result->z = z;
}

void Vec3_TransformY(Vec3* result, float y, const struct Matrix* mat) {
	result->x = y * mat->row2.x + mat->row4.x;
	result->y = y * mat->row2.y + mat->row4.y;
	result->z = y * mat->row2.z + mat->row4.z;
}

Vec3 Vec3_RotateX(Vec3 v, float angle) {
	float cosA = Math_CosF(angle);
	float sinA = Math_SinF(angle);
	return Vec3_Create3(v.x, cosA * v.y + sinA * v.z, -sinA * v.y + cosA * v.z);
}

Vec3 Vec3_RotateY(Vec3 v, float angle) {
	float cosA = Math_CosF(angle);
	float sinA = Math_SinF(angle);
	return Vec3_Create3(cosA * v.x - sinA * v.z, v.y, sinA * v.x + cosA * v.z);
}

Vec3 Vec3_RotateY3(float x, float y, float z, float angle) {
	float cosA = Math_CosF(angle);
	float sinA = Math_SinF(angle);
	return Vec3_Create3(cosA * x - sinA * z, y, sinA * x + cosA * z);
}

Vec3 Vec3_RotateZ(Vec3 v, float angle) {
	float cosA = Math_CosF(angle);
	float sinA = Math_SinF(angle);
	return Vec3_Create3(cosA * v.x + sinA * v.y, -sinA * v.x + cosA * v.y, v.z);
}


void IVec3_Floor(IVec3* result, const Vec3* a) {
	result->x = Math_Floor(a->x); result->y = Math_Floor(a->y); result->z = Math_Floor(a->z);
}

void IVec3_ToVec3(Vec3* result, const IVec3* a) {
	result->x = (float)a->x; result->y = (float)a->y; result->z = (float)a->z;
}

void IVec3_Min(IVec3* result, const IVec3* a, const IVec3* b) {
	result->x = min(a->x, b->x); result->y = min(a->y, b->y); result->z = min(a->z, b->z);
}

void IVec3_Max(IVec3* result, const IVec3* a, const IVec3* b) {
	result->x = max(a->x, b->x); result->y = max(a->y, b->y); result->z = max(a->z, b->z);
}


Vec3 Vec3_GetDirVector(float yawRad, float pitchRad) {
	float x = -Math_CosF(pitchRad) * -Math_SinF(yawRad);
	float y = -Math_SinF(pitchRad);
	float z = -Math_CosF(pitchRad) * Math_CosF(yawRad);
	return Vec3_Create3(x, y, z);
}

/*void Vec3_GetHeading(Vector3 dir, float* yaw, float* pitch) {
	*pitch = (float)Math_Asin(-dir.y);
	*yaw =   (float)Math_Atan2(dir.x, -dir.z);
}*/


const struct Matrix Matrix_Identity = Matrix_IdentityValue;

/* Transposed, source https://open.gl/transformations */

void Matrix_RotateX(struct Matrix* result, float angle) {
	float cosA = Math_CosF(angle);
	float sinA = Math_SinF(angle);
	*result = Matrix_Identity;

	result->row2.y = cosA;  result->row2.z = sinA;
	result->row3.y = -sinA; result->row3.z = cosA;
}

void Matrix_RotateY(struct Matrix* result, float angle) {
	float cosA = Math_CosF(angle);
	float sinA = Math_SinF(angle);
	*result = Matrix_Identity;

	result->row1.x = cosA; result->row1.z = -sinA;
	result->row3.x = sinA; result->row3.z = cosA;
}

void Matrix_RotateZ(struct Matrix* result, float angle) {
	float cosA = Math_CosF(angle);
	float sinA = Math_SinF(angle);
	*result = Matrix_Identity;

	result->row1.x = cosA;  result->row1.y = sinA;
	result->row2.x = -sinA; result->row2.y = cosA;
}

void Matrix_Translate(struct Matrix* result, float x, float y, float z) {
	*result = Matrix_Identity;
	result->row4.x = x; result->row4.y = y; result->row4.z = z;
}

void Matrix_Scale(struct Matrix* result, float x, float y, float z) {
	*result = Matrix_Identity;
	result->row1.x = x; result->row2.y = y; result->row3.z = z;
}

void Matrix_Mul(struct Matrix* result, const struct Matrix* left, const struct Matrix* right) {
	/* Originally from http://www.edais.co.uk/blog/?p=27 */
	float lM11, lM12, lM13, lM14, lM21, lM22, lM23, lM24;
	float lM31, lM32, lM33, lM34, lM41, lM42, lM43, lM44;

	/* Right matrix must be entirely pre-loaded, in case right and result matrices are the same */
	float
		rM11 = right->row1.x, rM12 = right->row1.y, rM13 = right->row1.z, rM14 = right->row1.w,
		rM21 = right->row2.x, rM22 = right->row2.y, rM23 = right->row2.z, rM24 = right->row2.w,
		rM31 = right->row3.x, rM32 = right->row3.y, rM33 = right->row3.z, rM34 = right->row3.w,
		rM41 = right->row4.x, rM42 = right->row4.y, rM43 = right->row4.z, rM44 = right->row4.w;

	lM11 = left->row1.x; lM12 = left->row1.y; lM13 = left->row1.z; lM14 = left->row1.w;
	result->row1.x = (((lM11 * rM11) + (lM12 * rM21)) + (lM13 * rM31)) + (lM14 * rM41);
	result->row1.y = (((lM11 * rM12) + (lM12 * rM22)) + (lM13 * rM32)) + (lM14 * rM42);
	result->row1.z = (((lM11 * rM13) + (lM12 * rM23)) + (lM13 * rM33)) + (lM14 * rM43);
	result->row1.w = (((lM11 * rM14) + (lM12 * rM24)) + (lM13 * rM34)) + (lM14 * rM44);

	lM21 = left->row2.x; lM22 = left->row2.y; lM23 = left->row2.z; lM24 = left->row2.w;
	result->row2.x = (((lM21 * rM11) + (lM22 * rM21)) + (lM23 * rM31)) + (lM24 * rM41);
	result->row2.y = (((lM21 * rM12) + (lM22 * rM22)) + (lM23 * rM32)) + (lM24 * rM42);
	result->row2.z = (((lM21 * rM13) + (lM22 * rM23)) + (lM23 * rM33)) + (lM24 * rM43);
	result->row2.w = (((lM21 * rM14) + (lM22 * rM24)) + (lM23 * rM34)) + (lM24 * rM44);

	lM31 = left->row3.x, lM32 = left->row3.y, lM33 = left->row3.z, lM34 = left->row3.w;
	result->row3.x = (((lM31 * rM11) + (lM32 * rM21)) + (lM33 * rM31)) + (lM34 * rM41);
	result->row3.y = (((lM31 * rM12) + (lM32 * rM22)) + (lM33 * rM32)) + (lM34 * rM42);
	result->row3.z = (((lM31 * rM13) + (lM32 * rM23)) + (lM33 * rM33)) + (lM34 * rM43);
	result->row3.w = (((lM31 * rM14) + (lM32 * rM24)) + (lM33 * rM34)) + (lM34 * rM44);

	lM41 = left->row4.x; lM42 = left->row4.y; lM43 = left->row4.z; lM44 = left->row4.w;
	result->row4.x = (((lM41 * rM11) + (lM42 * rM21)) + (lM43 * rM31)) + (lM44 * rM41);
	result->row4.y = (((lM41 * rM12) + (lM42 * rM22)) + (lM43 * rM32)) + (lM44 * rM42);
	result->row4.z = (((lM41 * rM13) + (lM42 * rM23)) + (lM43 * rM33)) + (lM44 * rM43);
	result->row4.w = (((lM41 * rM14) + (lM42 * rM24)) + (lM43 * rM34)) + (lM44 * rM44);
}

void Matrix_LookRot(struct Matrix* result, Vec3 pos, Vec2 rot) {
	struct Matrix rotX, rotY, trans;
	Matrix_RotateX(&rotX, rot.y);
	Matrix_RotateY(&rotY, rot.x);
	Matrix_Translate(&trans, -pos.x, -pos.y, -pos.z);

	Matrix_Mul(result, &rotY, &rotX);
	Matrix_Mul(result, &trans, result);
}


struct Plane { float a, b, c, d; };
struct FrustumPlanes { struct Plane L, R, B, T, F; };
static struct FrustumPlanes frustum;

cc_bool FrustumCulling_SphereInFrustum(float x, float y, float z, float radius) {
	float d;

	d = frustum.L.a * x + frustum.L.b * y + frustum.L.c * z + frustum.L.d;
	if (d <= -radius) return false;

	d = frustum.R.a * x + frustum.R.b * y + frustum.R.c * z + frustum.R.d;
	if (d <= -radius) return false;

	d = frustum.B.a * x + frustum.B.b * y + frustum.B.c * z + frustum.B.d;
	if (d <= -radius) return false;

	d = frustum.T.a * x + frustum.T.b * y + frustum.T.c * z + frustum.T.d;
	if (d <= -radius) return false;

	d = frustum.F.a * x + frustum.F.b * y + frustum.F.c * z + frustum.F.d;
	if (d <= -radius) return false;
	/* Don't test NEAR plane, it's pointless */

#if defined CC_BUILD_SATURN || defined CC_BUILD_32X
	/* Workaround a compiler bug causing the below statement to return 0 instead */
	__asm__( "!" );
#endif
	return true;
}

static void FrustumCulling_Normalise(struct Plane* plane) {
	float val1 = plane->a, val2 = plane->b, val3 = plane->c;
	float t = Math_SqrtF(val1 * val1 + val2 * val2 + val3 * val3);
	plane->a /= t; plane->b /= t; plane->c /= t; plane->d /= t;
}

void FrustumCulling_CalcFrustumEquations(struct Matrix* clip) {
	/* Extract the LEFT plane */
	frustum.L.a = clip->row1.w + clip->row1.x;
	frustum.L.b = clip->row2.w + clip->row2.x;
	frustum.L.c = clip->row3.w + clip->row3.x;
	frustum.L.d = clip->row4.w + clip->row4.x;
	FrustumCulling_Normalise(&frustum.L);

	/* Extract the RIGHT plane */
	frustum.R.a = clip->row1.w - clip->row1.x;
	frustum.R.b = clip->row2.w - clip->row2.x;
	frustum.R.c = clip->row3.w - clip->row3.x;
	frustum.R.d = clip->row4.w - clip->row4.x;
	FrustumCulling_Normalise(&frustum.R);

	/* Extract the BOTTOM plane */
	frustum.B.a = clip->row1.w + clip->row1.y;
	frustum.B.b = clip->row2.w + clip->row2.y;
	frustum.B.c = clip->row3.w + clip->row3.y;
	frustum.B.d = clip->row4.w + clip->row4.y;
	FrustumCulling_Normalise(&frustum.B);

	/* Extract the TOP plane */
	frustum.T.a = clip->row1.w - clip->row1.y;
	frustum.T.b = clip->row2.w - clip->row2.y;
	frustum.T.c = clip->row3.w - clip->row3.y;
	frustum.T.d = clip->row4.w - clip->row4.y;
	FrustumCulling_Normalise(&frustum.T);

	/* Extract the FAR plane (Different for each graphics backend) */
#if (CC_GFX_BACKEND == CC_GFX_BACKEND_D3D9) || (CC_GFX_BACKEND == CC_GFX_BACKEND_D3D11)
	/* OpenGL and Direct3D require slightly different behaviour for NEAR clipping planes */
	/* https://www.gamedevs.org/uploads/fast-extraction-viewing-frustum-planes-from-world-view-projection-matrix.pdf */
	/* (and because reverse Z is used, 'NEAR' plane is actually the 'FAR' clipping plane) */
	frustum.F.a = clip->row1.z;
	frustum.F.b = clip->row2.z;
	frustum.F.c = clip->row3.z;
	frustum.F.d = clip->row4.z;
#else
	frustum.F.a = clip->row1.w - clip->row1.z;
	frustum.F.b = clip->row2.w - clip->row2.z;
	frustum.F.c = clip->row3.w - clip->row3.z;
	frustum.F.d = clip->row4.w - clip->row4.z;
#endif
	FrustumCulling_Normalise(&frustum.F);
}

/* ===== PackedCol.c ===== */
#include "String_.h"

PackedCol PackedCol_Scale(PackedCol a, float t) {
	cc_uint8 R = (cc_uint8)(PackedCol_R(a) * t);
	cc_uint8 G = (cc_uint8)(PackedCol_G(a) * t);
	cc_uint8 B = (cc_uint8)(PackedCol_B(a) * t);
	return (a & PACKEDCOL_A_MASK) | PackedCol_R_Bits(R) | PackedCol_G_Bits(G) | PackedCol_B_Bits(B);
}

PackedCol PackedCol_Lerp(PackedCol a, PackedCol b, float t) {
	cc_uint8 R = (cc_uint8)Math_Lerp(PackedCol_R(a), PackedCol_R(b), t);
	cc_uint8 G = (cc_uint8)Math_Lerp(PackedCol_G(a), PackedCol_G(b), t);
	cc_uint8 B = (cc_uint8)Math_Lerp(PackedCol_B(a), PackedCol_B(b), t);
	return (a & PACKEDCOL_A_MASK) | PackedCol_R_Bits(R) | PackedCol_G_Bits(G) | PackedCol_B_Bits(B);
}

PackedCol PackedCol_Tint(PackedCol a, PackedCol b) {
	cc_uint32 R = PackedCol_R(a) * PackedCol_R(b) / 255;
	cc_uint32 G = PackedCol_G(a) * PackedCol_G(b) / 255;
	cc_uint32 B = PackedCol_B(a) * PackedCol_B(b) / 255;
	/* TODO: don't shift when multiplying */
	return (a & PACKEDCOL_A_MASK) | (R << PACKEDCOL_R_SHIFT) | (G << PACKEDCOL_G_SHIFT) | (B << PACKEDCOL_B_SHIFT);
}

PackedCol PackedCol_ScreenBlend(PackedCol a, PackedCol b) {
	PackedCol finalColor, aInverted, bInverted;
	cc_uint8 R, G, B;
	/* With Screen blend mode, the values of the pixels in the two layers are inverted, multiplied, and then inverted again. */
	R = 255 - PackedCol_R(a);
	G = 255 - PackedCol_G(a);
	B = 255 - PackedCol_B(a);
	aInverted = PackedCol_Make(R, G, B, 255);

	R = 255 - PackedCol_R(b);
	G = 255 - PackedCol_G(b);
	B = 255 - PackedCol_B(b);
	bInverted = PackedCol_Make(R, G, B, 255);

	finalColor = PackedCol_Tint(aInverted, bInverted);
	R = 255 - PackedCol_R(finalColor);
	G = 255 - PackedCol_G(finalColor);
	B = 255 - PackedCol_B(finalColor);
	return PackedCol_Make(R, G, B, 255);
}

void PackedCol_GetShaded(PackedCol normal, PackedCol* xSide, PackedCol* zSide, PackedCol* yMin) {
	*xSide = PackedCol_Scale(normal, PACKEDCOL_SHADE_X);
	*zSide = PackedCol_Scale(normal, PACKEDCOL_SHADE_Z);
	*yMin  = PackedCol_Scale(normal, PACKEDCOL_SHADE_YMIN);
}

int PackedCol_DeHex(char hex) {
	if (hex >= '0' && hex <= '9') {
		return (hex - '0');
	} else if (hex >= 'a' && hex <= 'f') {
		return (hex - 'a') + 10;
	} else if (hex >= 'A' && hex <= 'F') {
		return (hex - 'A') + 10;
	}
	return -1;
}

cc_bool PackedCol_Unhex(const char* src, int* dst, int count) {
	int i;
	for (i = 0; i < count; i++) {
		dst[i] = PackedCol_DeHex(src[i]);
		if (dst[i] == -1) return false;
	}
	return true;
}

void PackedCol_ToHex(cc_string* str, PackedCol value) {
	String_AppendHex(str, PackedCol_R(value));
	String_AppendHex(str, PackedCol_G(value));
	String_AppendHex(str, PackedCol_B(value));
}

cc_bool PackedCol_TryParseHex(const cc_string* str, cc_uint8* rgb) {
	int bits[6];
	char* buffer = str->buffer;

	/* accept XXYYZZ or #XXYYZZ forms */
	if (str->length < 6) return false;
	if (str->length > 6 && (str->buffer[0] != '#' || str->length > 7)) return false;

	if (buffer[0] == '#') buffer++;
	if (!PackedCol_Unhex(buffer, bits, 6)) return false;

	rgb[0] = (cc_uint8)((bits[0] << 4) | bits[1]);
	rgb[1] = (cc_uint8)((bits[2] << 4) | bits[3]);
	rgb[2] = (cc_uint8)((bits[4] << 4) | bits[5]);
	return true;
}

/* ===== Queue.c ===== */
#include "Chat.h"

void Queue_Init(struct Queue* queue, cc_uint32 structSize) {
	queue->entries = NULL;
	queue->structSize = structSize;
	queue->capacity = 0;
	queue->mask = 0;
	queue->count = 0;
	queue->head = 0;
	queue->tail = 0;
}

void Queue_Clear(struct Queue* queue) {
	if (!queue->entries) return;
	Mem_Free(queue->entries);
	Queue_Init(queue, queue->structSize);
}

static void Queue_Resize(struct Queue* queue) {
	cc_uint8* entries;
	int capacity, headToEndSize, byteOffsetToHead;

	if (queue->capacity >= (Int32_MaxValue / 4)) {
		Chat_AddRaw("&cToo many generic queue entries, clearing");
		Queue_Clear(queue);
		return;
	}
	capacity = queue->capacity * 2;
	if (capacity < 32) capacity = 32;
	entries = (cc_uint8*)Mem_Alloc(capacity, queue->structSize, "Generic queue");

	/* Elements must be readjusted to avoid index wrapping issues */
	headToEndSize = (queue->capacity - queue->head) * queue->structSize;
	byteOffsetToHead = queue->head * queue->structSize;
	/* Copy from head to end */
	Mem_Copy(entries, queue->entries + byteOffsetToHead, headToEndSize);
	if (queue->head != 0) {
		/* If there's any leftover before the head, copy that bit too */
		Mem_Copy(entries + headToEndSize, queue->entries, byteOffsetToHead);
	}

	Mem_Free(queue->entries);

	queue->entries = entries;
	queue->capacity = capacity;
	queue->mask = capacity - 1; /* capacity is power of two */
	queue->head = 0;
	queue->tail = queue->count;
}

/* Appends an entry to the end of the queue, resizing if necessary. */
void Queue_Enqueue(struct Queue* queue, void* item) {
	if (queue->count == queue->capacity)
		Queue_Resize(queue);

	//queue->entries[queue->tail] = item;
	Mem_Copy(queue->entries + queue->tail * queue->structSize, item, queue->structSize);
	queue->tail = (queue->tail + 1) & queue->mask;
	queue->count++;
}

/* Retrieves the entry from the front of the queue. */
void* Queue_Dequeue(struct Queue* queue) {
	void* result = queue->entries + queue->head * queue->structSize;
	queue->head = (queue->head + 1) & queue->mask;
	queue->count--;
	return result;
}
