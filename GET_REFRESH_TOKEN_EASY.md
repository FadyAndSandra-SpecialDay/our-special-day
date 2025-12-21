# Get Refresh Token - Easy Method (OAuth Playground)

Since the script isn't working, use Google OAuth Playground instead - it's easier!

## Step-by-Step

### Step 1: Open OAuth Playground

Go to: https://developers.google.com/oauthplayground/

### Step 2: Configure Your Credentials

1. Click the **gear icon** (⚙️) in the **top-right corner**
2. Check the box: **"Use your own OAuth credentials"**
3. Enter:
   - **OAuth Client ID**: `YOUR_CLIENT_ID_HERE.apps.googleusercontent.com` (get from Google Cloud Console)
   - **OAuth Client secret**: `YOUR_CLIENT_SECRET_HERE` (get from Google Cloud Console)
4. Click **"Close"**

### Step 3: Select Scope

1. In the **left panel**, scroll down to find **"Drive API v3"**
2. Expand it
3. Check this scope: **`https://www.googleapis.com/auth/drive.file`**
4. Click **"Authorize APIs"** button (top)

### Step 4: Authorize

1. You'll be redirected to Google sign-in
2. **Sign in with**: `fo2sh.adel.habib@gmail.com`
3. If you see "Access blocked" error:
   - Go back to Google Cloud Console
   - Add `fo2sh.adel.habib@gmail.com` as test user
   - Wait 2 minutes
   - Try again
4. Click **"Allow"** (or "Continue")

### Step 5: Exchange for Tokens

1. You'll be redirected back to OAuth Playground
2. Click **"Exchange authorization code for tokens"** button
3. You'll see a JSON response with tokens

### Step 6: Copy Refresh Token

In the response, find and copy the **"refresh_token"** value:

```json
{
  "access_token": "...",
  "expires_in": 3599,
  "refresh_token": "1//0xxxxx...",  ← COPY THIS!
  "scope": "...",
  "token_type": "Bearer"
}
```

### Step 7: Save to Supabase

1. Go to: https://supabase.com/dashboard/project/gosvleaijwscbrrnqkkt/settings/functions
2. Scroll to **"Secrets"**
3. Add/Update secret:
   - **Name**: `GOOGLE_OAUTH_REFRESH_TOKEN`
   - **Value**: Paste the refresh token you copied
4. Click **"Save"**

## Why This Works Better

- ✅ OAuth Playground handles redirects automatically
- ✅ No need to copy authorization codes manually
- ✅ Shows tokens immediately
- ✅ Works even if test user setup is tricky

## Troubleshooting

**If you still get "Access blocked":**

1. **Double-check test user:**
   - Go to: https://console.cloud.google.com/apis/credentials/consent?project=wedding-photo-upload-481609
   - Make sure `fo2sh.adel.habib@gmail.com` is in "Test users"
   - Click **"SAVE"** at the bottom if you just added it

2. **Wait longer:**
   - Google can take 2-5 minutes to sync
   - Wait, then try OAuth Playground again

3. **Use incognito mode:**
   - Open OAuth Playground in incognito/private window
   - Sign in with `fo2sh.adel.habib@gmail.com`

4. **Check which account you're using:**
   - Make sure you're signed in to Google with `fo2sh.adel.habib@gmail.com`
   - Not a different Google account

## After Getting Refresh Token

Once you have the refresh token:

1. ✅ Add it to Supabase as `GOOGLE_OAUTH_REFRESH_TOKEN`
2. ✅ Make sure `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET` are also set
3. ✅ Redeploy: `supabase functions deploy upload-photo`
4. ✅ Test upload - should work now!

