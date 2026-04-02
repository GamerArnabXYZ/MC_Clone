cmake_minimum_required(VERSION 3.22.1)

project(voxelcraft)

set(CMAKE_C_STANDARD 11)

# Find raylib from libs folder
set(RAYLIB_LIBRARY "${CMAKE_CURRENT_SOURCE_DIR}/libs/libraylib.a")

if(EXISTS ${RAYLIB_LIBRARY})
    message(STATUS "Found raylib: ${RAYLIB_LIBRARY}")
    add_library(raylib STATIC IMPORTED)
    set_target_properties(raylib PROPERTIES IMPORTED_LOCATION ${RAYLIB_LIBRARY})
endif()

add_library(voxelcraft SHARED main.c)

target_include_directories(voxelcraft PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

if(EXISTS ${RAYLIB_LIBRARY})
    target_link_libraries(voxelcraft raylib m log android)
else()
    target_link_libraries(voxelcraft m log android)
endif()
