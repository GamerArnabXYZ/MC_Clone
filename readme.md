# VoxelCraft

VoxelCraft is a standalone, mobile-first Minecraft-Classic style game client written in C.

> VoxelCraft is your own project/fork. It is **not** the original ClassiCube project.

## Project focus

- ✅ **Primary target:** Android (mobile-first)
- ✅ **Secondary target:** Web
- ❌ Other legacy platform build instructions removed from this README on purpose

## Networking note

VoxelCraft currently uses Classicube infrastructure for some server/services/asset endpoints for compatibility.
Only branding/app identity is VoxelCraft.

## Build (Android)

### Option A: CI build
Use the **Build VoxelCraft (Android + Web)** workflow from GitHub Actions.

### Option B: Local Android build
```bash
make android
```

## Build (Web)

### Option A: CI build
Use the same GitHub Actions workflow. Web artifact is uploaded and deployed to `web` branch.

### Option B: Local web build
```bash
make web
```

> Local web build requires `emcc` (Emscripten SDK).

## Output artifacts

### Android
- `app-arm64-v8a-release.apk`
- `app-armeabi-v7a-release.apk`

### Web
- `voxelcraft.js`
- `VoxelCraft.js`
- `deploy/` package (with `texpacks/default.zip`)

## Repo structure (important)

- `src/` → core C client source
- `src/android/` → Android platform glue
- `src/webclient/` → web platform glue
- `misc/android/` → Android Java/manifest resources
- `.github/workflows/build.yml` → single CI workflow for Android + Web

## Branding policy

- Product/game visible name: **VoxelCraft**
- Compatibility endpoints/URLs may still reference Classicube services until migrated

## Quick start (recommended)

1. Push code to `main` or manually run workflow.
2. Download Android/web artifacts from workflow run.
3. Test on mobile first, then web.

---
If you want, next step I can also generate a short **DEPLOY.md** only for Android+Web release process.
