# Google Drive Format Error Fix

If you're getting "MEDIA_ELEMENT_ERROR: Format error", Google Drive is returning HTML (virus scan page) instead of the actual MP3 file. This is a common issue.

## ✅ Solution: Use Self-Hosted Files (Recommended)

The most reliable solution is to host the files yourself:

### Step 1: Create Music Folder
```bash
mkdir public/music
```

### Step 2: Copy MP3 Files
Copy your MP3 files from Google Drive to `public/music/` folder:
- `public/music/song1.mp3`
- `public/music/song2.mp3`
- etc.

### Step 3: Update Config
```typescript
backgroundMusicUrl: [
  "/music/song1.mp3",
  "/music/song2.mp3",
],
```

**Advantages:**
- ✅ Works 100% reliably
- ✅ Fast loading (no external requests)
- ✅ No CORS issues
- ✅ Full control

---

## Alternative: Use Different Hosting Service

### Option 1: Dropbox
1. Upload to Dropbox
2. Get share link: `https://www.dropbox.com/s/abc123/song.mp3?dl=0`
3. Change to: `https://www.dropbox.com/s/abc123/song.mp3?dl=1`
4. Use in config

### Option 2: GitHub Releases
1. Create a GitHub release
2. Upload MP3 as release asset
3. Right-click > Copy link
4. Use raw.githubusercontent.com URL

### Option 3: Cloudflare R2 / AWS S3
- Upload to cloud storage
- Get direct public URL
- Use in config

---

## Why Google Drive Fails

Google Drive's direct download links:
- ❌ Return HTML pages (virus scan warnings) instead of files
- ❌ Have CORS restrictions
- ❌ Block direct audio playback in browsers
- ❌ Redirect through multiple pages

Even with `&confirm=t` parameter, it may not work reliably in all browsers.

---

## Quick Fix: Self-Host

**This is the fastest and most reliable solution:**

1. Download your MP3 files from Google Drive
2. Create `public/music/` folder
3. Copy files there
4. Update config to use `/music/filename.mp3`
5. Done! 🎉

