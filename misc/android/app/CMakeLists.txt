cmake_minimum_required(VERSION 3.4.1)

project(VoxelCraft)

# Build flags
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS}")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=gnu++11 -Wall -Werror")

# --- Auto-detect Source Files ---

# 1. Root src folder (IsometricDrawer, Game, World, all _ft*.c, etc.)
file(GLOB ROOT_SOURCES "../../../src/*.c")

# 2. Android specific files
file(GLOB ANDROID_SOURCES "../../../src/android/*.c")

# 3. BearSSL files
file(GLOB BEARSSL_SOURCES "../../../third_party/bearssl/*.c")

# Merge all detected files into one list
set(VOXELCRAFT_SOURCES 
    ${ROOT_SOURCES} 
    ${ANDROID_SOURCES} 
    ${BEARSSL_SOURCES}
)

# Build the shared library
add_library(voxelcraft SHARED ${VOXELCRAFT_SOURCES})

target_link_libraries(voxelcraft
    EGL
    GLESv2
    log)
