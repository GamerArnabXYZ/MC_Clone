# CMakeLists.txt for VoxelCraft
# Minecraft-styled Voxel Game in C with Raylib

cmake_minimum_required(VERSION 3.10)
project(VoxelCraft C)

# Set C standard
set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

# Source files
file(GLOB SOURCES
    "${CMAKE_CURRENT_SOURCE_DIR}/src/*.c"
)

# Header files
file(GLOB HEADERS
    "${CMAKE_CURRENT_SOURCE_DIR}/include/*.h"
)

# Add source group for IDEs
source_group(TREE "${CMAKE_CURRENT_SOURCE_DIR}/src" FILES ${SOURCES})
source_group(TREE "${CMAKE_CURRENT_SOURCE_DIR}/include" FILES ${HEADERS})

# Executable
add_executable(${PROJECT_NAME} ${SOURCES} ${HEADERS})

# Include directories
target_include_directories(${PROJECT_NAME} PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/src
)

# Platform-specific settings
if(WIN32)
    # Windows: Link raylib and Windows libraries
    target_link_libraries(${PROJECT_NAME} raylib m winmm gdi32 opengl32)
    target_compile_options(${PROJECT_NAME} PRIVATE -Wall -Wextra)
elseif(APPLE)
    # macOS: Link raylib and system frameworks
    find_package(raylib QUIET)
    if (raylib_FOUND)
        target_link_libraries(${PROJECT_NAME} raylib::raylib)
    else()
        target_link_libraries(${PROJECT_NAME} raylib m pthread)
        target_include_directories(${PROJECT_NAME} PRIVATE /usr/local/include)
    endif()
    target_compile_options(${PROJECT_NAME} PRIVATE -Wall -Wextra)
else()
    # Linux: Link raylib and standard libraries
    find_package(raylib QUIET)
    if (raylib_FOUND)
        target_link_libraries(${PROJECT_NAME} raylib::raylib)
    else()
        target_link_libraries(${PROJECT_NAME} raylib m pthread)
    endif()
    target_compile_options(${PROJECT_NAME} PRIVATE -Wall -Wextra -lm)
endif()

# Assets directory
set(ASSETS_DIR "${CMAKE_CURRENT_SOURCE_DIR}/assets")
target_compile_definitions(${PROJECT_NAME} PRIVATE ASSETS_PATH="${ASSETS_DIR}")

# Create assets folder if it doesn't exist
file(MAKE_DIRECTORY "${ASSETS_DIR}/textures")

# Installation
install(TARGETS ${PROJECT_NAME} DESTINATION bin)

# Print configuration
message(STATUS "VoxelCraft Configuration:")
message(STATUS "  Source files: ${SOURCES}")
message(STATUS "  Include dir: ${CMAKE_CURRENT_SOURCE_DIR}/include")
message(STATUS "  Assets dir: ${ASSETS_DIR}")
