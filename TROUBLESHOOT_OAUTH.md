# Troubleshoot OAuth Test User Issue

## If Adding Test User Didn't Work

### Check 1: Verify Test User Was Added

1. Go to: https://console.cloud.google.com/apis/credentials/consent?project=wedding-photo-upload-481609
2. Scroll to **"Test users"** section
3. **Verify** your email `fo2sh.adel.habib@gmail.com` is listed there
4. If it's NOT there, add it again and click **"SAVE"** at the bottom

### Check 2: Make Sure You're Signed In Correctly

1. **Check which Google account you're using:**
   - Look at the top-right corner of Google Cloud Console
   - Make sure it shows: `fo2sh.adel.habib@gmail.com`
   - If it shows a different account, sign out and sign in with the correct one

2. **When authorizing:**
   - Make sure you're signed in to Google with `fo2sh.adel.habib@gmail.com`
   - Try opening the authorization URL in an incognito/private window
   - Sign in with `fo2sh.adel.habib@gmail.com` when prompted

### Check 3: Wait Longer

- Google can take **1-5 minutes** to sync test user changes
- Wait 2-3 minutes, then try again
- Clear browser cache or use incognito mode

### Check 4: Verify OAuth App Configuration

1. Go to: https://console.cloud.google.com/apis/credentials?project=wedding-photo-upload-481609
2. Find your OAuth 2.0 Client ID
3. Click on it to edit
4. Check **"Authorized redirect URIs"**:
   - Should include: `http://localhost:8080`
   - If missing, add it and **SAVE**

### Check 5: Try OAuth Playground Instead

If the script isn't working, use Google OAuth Playground:

1. Go to: https://developers.google.com/oauthplayground/
2. Click the **gear icon** (⚙️) in top-right
3. Check **"Use your own OAuth credentials"**
4. Enter:
   - **OAuth Client ID**: `YOUR_CLIENT_ID_HERE.apps.googleusercontent.com` (get from Google Cloud Console)
   - **OAuth Client secret**: `YOUR_CLIENT_SECRET_HERE` (get from Google Cloud Console)
5. In left panel, find **"Drive API v3"**
6. Select scope: `https://www.googleapis.com/auth/drive.file`
7. Click **"Authorize APIs"**
8. Sign in with `fo2sh.adel.habib@gmail.com`
9. Click **"Allow"**
10. Click **"Exchange authorization code for tokens"**
11. **Copy the "Refresh token"** from the response

### Check 6: Verify Project ID

Make sure you're working with the correct Google Cloud project:

1. Check the project ID in Google Cloud Console (top bar)
2. Should be: `wedding-photo-upload-481609`
3. If different, switch to the correct project

### Alternative: Use Different Email

If your email still doesn't work:

1. Add a different email you have access to as a test user
2. Sign in with that email when authorizing
3. Use that email's Google account for the refresh token

## Still Not Working?

Share these details:
1. What email is shown in Google Cloud Console (top-right)?
2. What email is listed in "Test users"?
3. What email are you using when you try to authorize?
4. Are they all the same?

