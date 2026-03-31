# VoxelCraft - Minecraft-Styled Voxel Game in C

A Minecraft-inspired voxel game built entirely in C using the Raylib library. Features include procedural terrain generation, block selection, and cross-platform support (PC and Mobile).

![VoxelCraft Banner](assets/banner.png)

## Features

- **Procedural Terrain Generation**: Randomly generated voxel world with grass, dirt, stone, trees, and more
- **Multiple Block Types**: 16 different block types including grass, dirt, stone, wood, leaves, sand, water, brick, glass, and more
- **Inventory System**: Bottom bar with 9 inventory slots for block selection
- **Camera Modes**: First-person, third-person, and top-down views
- **Smart Asset Loading**: Automatic fallback to procedural textures if asset files are missing
- **Cross-Platform Input**:
  - **PC**: WASD movement, mouse look, space to jump, F5 to change camera
  - **Mobile**: On-screen joysticks for movement and camera control
- **Device Detection**: Automatic detection of touch-screen devices

## Project Structure

```
voxel-game/
├── src/                  # Source code
│   ├── main.c           # Main game loop and entry point
│   ├── world.c          # Voxel world/chunk management
│   ├── input.c          # Cross-platform input handling
│   └── render.c         # Rendering utilities and UI
├── include/              # Header files
│   ├── game.h           # Main game definitions
│   ├── world.h          # World definitions
│   ├── input.h          # Input definitions
│   └── render.h         # Render definitions
├── assets/              # Game assets
│   └── textures/        # Block textures (PNG format)
├── .github/
│   └── workflows/       # CI/CD pipelines
│       ├── web-build.yml    # Emscripten web build
│       └── android-build.yml # Android APK build
├── build/               # Build output directory
├── Makefile             # GNU Make build script
├── CMakeLists.txt       # CMake configuration
└── README.md            # This file
```

## Building

### Prerequisites

- **Raylib Library**: Install raylib on your system
- **C Compiler**: GCC, Clang, or MSVC
- **CMake** (optional): For CMake-based builds

### Linux

```bash
# Install dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install build-essential libraylib-dev

# Build with Make
make

# Or build with CMake
mkdir build
cd build
cmake ..
make
```

### macOS

```bash
# Install Raylib via Homebrew
brew install raylib

# Build with Make
make
```

### Windows

```bash
# Using MinGW-w64
mingw32-make

# Or using CMake with Visual Studio
cmake -G "Visual Studio 16 2019" ..
cmake --build .
```

## Running the Game

### Desktop

```bash
# After building
./voxelcraft

# Or with Make
make run
```

### Mobile (Android)

```bash
cd android
./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

### Web (Browser)

The web build requires Emscripten:

```bash
# Install Emscripten
emsdk install 3.1.31
emsdk activate 3.1.31
source emsdk_env.sh

# Build web version
emcc -o build-web/index.html -s WASM=1 ...
```

## Controls

### PC Controls

| Key | Action |
|-----|--------|
| W / Arrow Up | Move Forward |
| S / Arrow Down | Move Backward |
| A / Arrow Left | Move Left |
| D | Move Right |
| Space | Jump |
| Left Shift | Sprint |
| Mouse | Look Around |
| 1-9 | Select Inventory Slot |
| Mouse Wheel | Scroll Inventory |
| F5 | Change Camera Mode |
| ESC | Release Mouse |

### Mobile Controls

| Input | Action |
|-------|--------|
| Left Joystick | Movement |
| Right Joystick | Camera Look |
| Camera Button | Change Camera Mode |
| Tap Screen | Jump |

## Game States

1. **Home Screen**: Title screen with Start Game and Exit buttons
2. **Playing**: Main gameplay with 3D voxel world
3. **Inventory**: Block selection via bottom bar (accessible during play)

## Smart Asset Loading

The game automatically handles missing texture files:

1. First, it attempts to load textures from `assets/textures/`
2. If a texture is missing, it generates a procedural texture using pixel arrays
3. This ensures the game always runs without crashes

### Adding Custom Textures

Place 16x16 PNG images in the `assets/textures/` folder:

```
assets/textures/
├── grass.png
├── dirt.png
├── stone.png
├── wood.png
├── leaves.png
├── sand.png
├── water.png
├── brick.png
├── glass.png
├── wool.png
├── cobble.png
├── plank.png
├── slab.png
└── coal.png
```

## CI/CD

### GitHub Actions

The project includes automated build workflows:

- **Web Build**: Compiles to WebAssembly using Emscripten
- **Android Build**: Creates APK using Android NDK

Workflows are located in `.github/workflows/`

### Building Artifacts

| Platform | Artifact |
|----------|----------|
| Web | `voxelcraft-web.zip` |
| Android | `app-debug.apk` |
| Desktop | `voxelcraft` / `voxelcraft.exe` |

## Technical Details

### World Generation

The world is generated using a simplified Perlin-like noise function:

- Base terrain height varies based on 2D noise
- Surface layer is grass, followed by dirt
- Underground is stone with occasional dirt pockets
- Trees are randomly placed on grass above water level

### Rendering

- Voxel faces are only drawn if adjacent to air (face culling)
- Each face has slight color variation for depth
- Simple collision detection with ground

### Input Handling

- Device detection at startup
- Separate input paths for PC and mobile
- Mobile uses virtual joysticks with touch tracking

## Troubleshooting

### Game crashes on startup

1. Check if Raylib is properly installed
2. Verify all source files are present
3. Try rebuilding from scratch: `make clean && make`

### Textures not loading

- The game generates procedural textures as fallback
- For custom textures, ensure PNG files are 16x16 pixels

### Mobile controls not working

- Ensure touch input is enabled in your device settings
- Check that the device was detected as mobile

## License

This project is provided as-is for educational purposes.

## Credits

- **Raylib**: https://www.raylib.com/
- **Inspired by Minecraft**: https://www.minecraft.net/

## Contributing

Contributions are welcome! Please read the existing code style and submit pull requests.

---

*Made with passion for voxel games*
