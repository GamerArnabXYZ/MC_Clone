cmake_minimum_required(VERSION 3.22.1)

project(voxelcraft C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

# ── Source files ────────────────────────────────────────────────────────────
# main.c is in the same folder as this CMakeLists.
# Game modules are copied here by the CI workflow into game_src/.
set(GAME_SOURCES
    ${CMAKE_CURRENT_SOURCE_DIR}/main.c
    ${CMAKE_CURRENT_SOURCE_DIR}/game_src/input.c
    ${CMAKE_CURRENT_SOURCE_DIR}/game_src/render.c
    ${CMAKE_CURRENT_SOURCE_DIR}/game_src/world.c
)

# ── Raylib static library ───────────────────────────────────────────────────
# Pre-built for Android ARM64 by CI, placed at cpp/libs/libraylib.a
set(RAYLIB_LIB "${CMAKE_CURRENT_SOURCE_DIR}/libs/libraylib.a")

if(EXISTS "${RAYLIB_LIB}")
    message(STATUS "Raylib found: ${RAYLIB_LIB}")
    add_library(raylib STATIC IMPORTED)
    set_target_properties(raylib PROPERTIES IMPORTED_LOCATION "${RAYLIB_LIB}")
    set(HAVE_RAYLIB TRUE)
else()
    message(WARNING "Raylib not found at ${RAYLIB_LIB} — linking without it")
    set(HAVE_RAYLIB FALSE)
endif()

# ── Shared library (loaded by Android via System.loadLibrary) ───────────────
add_library(voxelcraft SHARED ${GAME_SOURCES})

# ── Include paths ───────────────────────────────────────────────────────────
target_include_directories(voxelcraft PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/game_include   # game headers (game.h etc.)
    ${CMAKE_CURRENT_SOURCE_DIR}/raylib_include # raylib.h, raymath.h, rlgl.h
    ${CMAKE_CURRENT_SOURCE_DIR}
)

# ── Compile definitions ─────────────────────────────────────────────────────
target_compile_definitions(voxelcraft PRIVATE
    PLATFORM_ANDROID
    GRAPHICS_API_OPENGL_ES2
    SUPPORT_MODULE_RMODELS=0
    SUPPORT_MODULE_RAUDIO=0
)

# ── Link libraries ──────────────────────────────────────────────────────────
if(HAVE_RAYLIB)
    target_link_libraries(voxelcraft
        raylib
        m
        log
        android
        EGL
        GLESv2
        c                          # explicit libc - resolves stderr/stdout from rmodels.c
    )
else()
    target_link_libraries(voxelcraft
        m
        log
        android
        EGL
        GLESv2
        c
    )
endif()
