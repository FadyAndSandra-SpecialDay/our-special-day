# 🎵 Automatic Music Detection Setup

## ✨ How It Works

The website **automatically detects all MP3 files** in the `public/music/` folder. You don't need to manually update any configuration files!

## 📁 Adding Music Files

### Step 1: Add MP3 Files
Simply copy your MP3 files to the `public/music/` folder:
```
public/
  music/
    song1.mp3
    song2.mp3
    song3.mp3
    ... (any number of MP3 files)
```

### Step 2: Generate Music List (Automatic)
The music list is automatically generated when you:
- Run `npm run build` (runs automatically)
- Run `npm run generate-music` (manual generation)

### Step 3: Push to GitHub
1. Add files: `git add public/music/*.mp3`
2. Commit: `git commit -m "Add music files"`
3. Push: `git push`

**That's it!** The website will automatically include all MP3 files from the folder.

---

## 🔄 Workflow

### During Development:
```bash
# Add new MP3 files to public/music/
# Then run:
npm run generate-music
# Or just run dev server - it will work
npm run dev
```

### Before Building:
```bash
# The build script automatically runs generate-music
npm run build
```

### On GitHub Actions:
The build process automatically:
1. Runs `npm run generate-music`
2. Detects all MP3 files in `public/music/`
3. Generates `src/lib/musicList.ts`
4. Builds the website with all music included

---

## 📝 Generated File

The script creates `src/lib/musicList.ts` automatically:
```typescript
// Auto-generated file - DO NOT EDIT MANUALLY
export const musicFiles: string[] = [
  "/music/song1.mp3",
  "/music/song2.mp3",
  "/music/song3.mp3",
];
```

**⚠️ Don't edit this file manually!** It's regenerated automatically.

---

## 🎮 Features

- ✅ **Automatic detection** - All MP3 files in `public/music/` are included
- ✅ **No manual config** - Just add files and push to GitHub
- ✅ **Alphabetical sorting** - Files are sorted automatically
- ✅ **Shuffle support** - Random or sequential playback
- ✅ **Auto-advance** - Plays next song when current ends

---

## 🚀 Quick Start

1. **Add MP3 files** to `public/music/` folder
2. **Run** `npm run generate-music` (or it runs on build)
3. **Push to GitHub** - All files are included automatically!

No need to edit `weddingConfig.ts` or any other files! 🎉

