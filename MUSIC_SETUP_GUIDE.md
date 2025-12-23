# Background Music Setup Guide

## 📁 Your Google Drive Music Folder

**Your folder:** https://drive.google.com/drive/u/1/folders/1oNv7irFHp1N-F2WnexkXZIhPzbBktsez

This folder contains your MP3 files. Follow the steps below to get direct download URLs for each file.

---

## 🎵 Best Options for Hosting Music (Fast Loading)

### Option 1: Google Drive (Recommended - You Already Have Files Here!)

Your music folder: https://drive.google.com/drive/u/1/folders/1oNv7irFHp1N-F2WnexkXZIhPzbBktsez

**Step-by-Step Instructions:**

1. **Open your Google Drive folder** (link above)

2. **For EACH MP3 file in the folder:**
   - **Right-click** the file
   - Click **Share** or **Get link**
   - Make sure it's set to **"Anyone with the link can view"**
   - **Copy the link** - it looks like:
     ```
     https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing
     ```

3. **Extract the File ID** (the part between `/d/` and `/view`)
   - From: `https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing`
   - File ID is: `1ABC123xyz`

4. **Convert to direct download link**:
   ```
   https://drive.google.com/uc?export=download&id=1ABC123xyz
   ```

5. **Add all URLs to your config**:
   ```typescript
   backgroundMusicUrl: [
     "https://drive.google.com/uc?export=download&id=FILE_ID_1",
     "https://drive.google.com/uc?export=download&id=FILE_ID_2",
     "https://drive.google.com/uc?export=download&id=FILE_ID_3",
     // Add all your MP3 files here
   ],
   ```

**Quick Method:** If you have many files, you can:
- Open each file individually
- Copy the share link
- Extract the ID and convert
- Add to the array in `weddingConfig.ts`

---

### Option 2: Dropbox

1. Upload MP3 to Dropbox
2. Get share link (e.g., `https://www.dropbox.com/s/abc123/music.mp3?dl=0`)
3. Change `?dl=0` to `?dl=1` for direct download:
   ```
   https://www.dropbox.com/s/abc123/music.mp3?dl=1
   ```

---

### Option 3: GitHub Releases (Free & Fast)

1. Create a new GitHub release in your repository
2. Upload MP3 files as release assets
3. Right-click the asset > Copy link address
4. Use the raw.githubusercontent.com URL

---

### Option 4: Self-Hosted (Fastest)

1. Place MP3 files in `public/music/` folder
2. Use relative paths:
   ```typescript
   backgroundMusicUrl: [
     "/music/song1.mp3",
     "/music/song2.mp3",
   ],
   ```

---

## 🎼 Playlist Configuration

### Single Song
```typescript
backgroundMusicUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID",
backgroundMusicShuffle: false,
```

### Multiple Songs (Playlist)
```typescript
backgroundMusicUrl: [
  "https://drive.google.com/uc?export=download&id=SONG1_ID",
  "https://drive.google.com/uc?export=download&id=SONG2_ID",
  "https://drive.google.com/uc?export=download&id=SONG3_ID",
],
backgroundMusicShuffle: true, // Random order
// or
backgroundMusicShuffle: false, // Play in order
```

---

## ⚡ Why Direct Audio Files Are Better Than Anghami

- ✅ **Much faster loading** - No heavy iframe/widget
- ✅ **Better performance** - Direct audio playback
- ✅ **More reliable** - No third-party service dependencies
- ✅ **Works offline** - If self-hosted
- ✅ **Full control** - Volume, looping, playlist management

---

## 🔧 Quick Configuration Steps

1. **Upload your music** to Google Drive (or preferred service)
2. **Get the direct download links** (see methods above)
3. **Open** `src/lib/weddingConfig.ts`
4. **Add your URLs**:
   ```typescript
   backgroundMusicUrl: [
     "YOUR_FIRST_SONG_URL",
     "YOUR_SECOND_SONG_URL",
   ],
   backgroundMusicShuffle: true, // or false for order
   backgroundMusicType: "audio", // Always use "audio" for direct files
   ```
5. **Save and test!**

---

## 🎮 Features

- ✅ **Auto-play** when page loads
- ✅ **Playlist support** - Multiple songs
- ✅ **Shuffle mode** - Random order
- ✅ **Next song button** - Skip to next song
- ✅ **Auto-advance** - Plays next song when current ends
- ✅ **Volume control** - Mute/unmute
- ✅ **Error handling** - Auto-skips broken URLs

---

## 📝 Example Configuration

```typescript
// In src/lib/weddingConfig.ts

backgroundMusicUrl: [
  "https://drive.google.com/uc?export=download&id=1ABC123xyz", // Wedding song 1
  "https://drive.google.com/uc?export=download&id=1DEF456abc", // Wedding song 2
  "https://drive.google.com/uc?export=download&id=1GHI789def", // Love song
  "/music/local-song.mp3", // Self-hosted song
],
backgroundMusicShuffle: true, // Play in random order
backgroundMusicType: "audio", // Use direct audio files
```

That's it! Your music will play automatically when visitors open the website. 🎉

