# Makefile for VoxelCraft - Minecraft-styled Voxel Game
# Target: Desktop (Windows, Linux, macOS)

# Compiler settings
CC = gcc
CFLAGS = -Wall -Wextra -O2 -I./include -I./src
LDFLAGS = -lraylib -lm -lpthread

# Directories
SRC_DIR = src
INC_DIR = include
BUILD_DIR = build
ASSETS_DIR = assets

# Source files
SOURCES = $(wildcard $(SRC_DIR)/*.c)
OBJECTS = $(SOURCES:$(SRC_DIR)/%.c=$(BUILD_DIR)/%.o)

# Output
TARGET = voxelcraft

# Platform-specific settings
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Darwin)
    LDFLAGS += -framework OpenGL -framework Cocoa -framework IOKit -framework CoreVideo
    LDFLAGS += -L/usr/local/lib
    CFLAGS += -I/usr/local/include
endif

ifeq ($(OS),Windows_NT)
    TARGET = voxelcraft.exe
    LDFLAGS = -lraylib -lm -lwinmm -lgdi32 -lopengl32
    RM = del /Q
    FIXPATH = \\
else
    RM = rm -f
    FIXPATH = /
endif

.PHONY: all clean run assets

all: $(BUILD_DIR) assets $(TARGET)

# Create build directory
$(BUILD_DIR):
	@mkdir -p $(BUILD_DIR)

# Compile source files
$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c | $(BUILD_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

# Link object files
$(TARGET): $(OBJECTS)
	$(CC) $^ -o $@ $(LDFLAGS)
	@echo "Build complete: $(TARGET)"

# Create assets directory
assets:
	@mkdir -p $(ASSETS_DIR)/textures
	@echo "Assets directory ready"

# Clean build
clean:
	$(RM) $(BUILD_DIR)/* $(TARGET)
	@echo "Clean complete"

# Run game
run: all
ifeq ($(OS),Windows_NT)
	start $(TARGET)
else
	./$(TARGET)
endif

# Install raylib dependencies (Linux)
deps-ubuntu:
	sudo apt-get update
	sudo apt-get install build-essential libraylib-dev

deps-fedora:
	sudo dnf install gcc make raylib-devel

deps-arch:
	sudo pacman -S gcc make raylib

# Debug build
debug: CFLAGS += -g -DDEBUG
debug: clean all

# Release build
release: CFLAGS += -O3 -DNDEBUG
release: clean all
