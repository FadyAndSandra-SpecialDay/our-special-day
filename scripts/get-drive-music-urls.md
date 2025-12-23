# How to Get Google Drive Music URLs for Playlist

Your Google Drive folder: `1oNv7irFHp1N-F2WnexkXZIhPzbBktsez`

## Method 1: Manual (Quick for a few files)

For each MP3 file in your folder:

1. **Open the file** in Google Drive (click on it)
2. **Copy the URL** from browser address bar:
   ```
   https://drive.google.com/file/d/FILE_ID_HERE/view?usp=sharing
   ```
3. **Extract the FILE_ID** (the part between `/d/` and `/view`)
4. **Convert to direct download link**:
   ```
   https://drive.google.com/uc?export=download&id=FILE_ID_HERE
   ```

## Method 2: Using Google Drive API (For many files)

Since you have many files, here's a JavaScript code you can run in browser console:

1. Open your Google Drive folder: https://drive.google.com/drive/u/1/folders/1oNv7irFHp1N-F2WnexkXZIhPzbBktsez
2. Open browser console (F12 > Console tab)
3. Run this code:

```javascript
// Get all file IDs from current folder view
const fileLinks = Array.from(document.querySelectorAll('[data-id]'))
  .map(el => {
    const fileId = el.getAttribute('data-id');
    const fileName = el.querySelector('[data-name]')?.getAttribute('data-name') || 'unknown';
    return { id: fileId, name: fileName };
  })
  .filter(f => f.id && f.name.endsWith('.mp3'));

// Generate direct download URLs
const downloadUrls = fileLinks.map(file => ({
  name: file.name,
  url: `https://drive.google.com/uc?export=download&id=${file.id}`
}));

// Copy to clipboard
const urlsArray = downloadUrls.map(f => `"${f.url}"`).join(',\n');
console.log('Copy this to your weddingConfig.ts:');
console.log(`backgroundMusicUrl: [\n${urlsArray}\n],`);
```

## Method 3: Python Script (Recommended for many files)

Create a file `get-drive-music.py`:

```python
import requests

FOLDER_ID = "1oNv7irFHp1N-F2WnexkXZIhPzbBktsez"
API_KEY = "YOUR_GOOGLE_API_KEY"  # Get from Google Cloud Console

url = f"https://www.googleapis.com/drive/v3/files"
params = {
    "q": f"'{FOLDER_ID}' in parents and mimeType='audio/mpeg'",
    "key": API_KEY,
    "fields": "files(id, name)"
}

response = requests.get(url, params=params)
files = response.json().get('files', [])

print("backgroundMusicUrl: [")
for file in files:
    print(f'  "https://drive.google.com/uc?export=download&id={file["id"]}",  // {file["name"]}')
print("],")
```

## Quick Solution: Right-click Method

1. Open each MP3 file in the folder
2. Right-click > **Share** > **Get link**
3. Copy the link
4. Extract FILE_ID from: `https://drive.google.com/file/d/FILE_ID/view`
5. Use: `https://drive.google.com/uc?export=download&id=FILE_ID`

## Important Notes

- Make sure files are set to "Anyone with the link can view"
- The `uc?export=download&id=` format works for public files
- For private files, you'll need to use Google Drive API with authentication

