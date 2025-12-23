# Convert M4A Files to MP3

The current music files are in M4A format, which can cause format errors in some browsers. For best compatibility, convert them to MP3 format.

## Quick Conversion Methods

### Method 1: Using VLC Media Player (Free)

1. **Download VLC** (if not installed): https://www.videolan.org/vlc/
2. **Open VLC**
3. **Go to**: Media → Convert / Save (Ctrl+R)
4. **Click**: "Add" and select your M4A files from `public/music/`
5. **Click**: "Convert / Save"
6. **Profile**: Select "Audio - MP3"
7. **Destination**: Click "Browse" and select `public/music/` folder
8. **File name**: Use the same name (VLC will add .mp3 automatically)
9. **Click**: "Start"

### Method 2: Using Online Converter (Easiest)

1. Go to: https://cloudconvert.com/m4a-to-mp3 (or similar)
2. Upload your M4A files
3. Convert to MP3
4. Download and place in `public/music/` folder

### Method 3: Using FFmpeg (Command Line)

If you have FFmpeg installed:

```powershell
cd "public\music"
ffmpeg -i "die with smile.m4a" -codec:a libmp3lame -b:a 192k "die with smile.mp3"
ffmpeg -i "La leçon particulière.m4a" -codec:a libmp3lame -b:a 192k "La leçon particulière.mp3"
```

### Method 4: Using Audacity (Free)

1. **Download Audacity**: https://www.audacityteam.org/
2. **Open** your M4A file in Audacity
3. **Go to**: File → Export → Export as MP3
4. **Settings**: Choose quality (192 kbps is good)
5. **Save** to `public/music/` folder

## After Conversion

1. **Delete** the old `.m4a` files from `public/music/`
2. **Keep only** the new `.mp3` files
3. **Run**: `npm run generate-music` to update the music list
4. **Test** the website - music should now play correctly!

## Why MP3?

- ✅ Universal browser support
- ✅ Smaller file size (usually)
- ✅ No codec compatibility issues
- ✅ Works on all devices

---

**Note**: If you prefer to keep M4A files, they should work in most modern browsers, but MP3 is more reliable for web playback.

