# Fix These Errors - Action Plan

## 🔴 Current Errors

1. **Gallery Error**: `SERVICE_ACCOUNT_JSON not configured`
2. **RSVP Error**: `SERVICE_ACCOUNT_JSON not configured`  
3. **Upload Error**: Service account quota + OAuth fallback not working

## ✅ Solution: Set Missing Secrets

### Step 1: Go to Supabase Secrets

**Link:** https://supabase.com/dashboard/project/gosvleaijwscbrrnqkkt/settings/functions

Scroll down to **"Secrets"** section.

### Step 2: Add These 6 Secrets

You need to add **all 6 secrets** with the same service account JSON content (for secrets 1-3) and OAuth credentials (for secrets 4-6):

#### Secret 1: SERVICE_ACCOUNT_JSON
- **Name**: `SERVICE_ACCOUNT_JSON`
- **Value**: Your full service account JSON file content
- **Why**: Used by `get-gallery` function

#### Secret 2: GOOGLE_SERVICE_ACCOUNT_JSON  
- **Name**: `GOOGLE_SERVICE_ACCOUNT_JSON`
- **Value**: Same JSON as Secret 1 (copy-paste)
- **Why**: Used by `save-rsvp` and `preflight` functions

#### Secret 3: GOOGLE_SERVICE_ACCOUNT
- **Name**: `GOOGLE_SERVICE_ACCOUNT`
- **Value**: Same JSON as Secret 1 (copy-paste)
- **Why**: Used by `upload-photo` function

#### Secret 4: GOOGLE_OAUTH_CLIENT_ID
- **Name**: `GOOGLE_OAUTH_CLIENT_ID`
- **Value**: Your OAuth Client ID (from Google Cloud Console)
- **Why**: Used by `upload-photo` for OAuth fallback

#### Secret 5: GOOGLE_OAUTH_CLIENT_SECRET
- **Name**: `GOOGLE_OAUTH_CLIENT_SECRET`
- **Value**: Your OAuth Client Secret (from Google Cloud Console)
- **Why**: Used by `upload-photo` for OAuth fallback

#### Secret 6: GOOGLE_OAUTH_REFRESH_TOKEN
- **Name**: `GOOGLE_OAUTH_REFRESH_TOKEN`
- **Value**: Your OAuth Refresh Token (from `get-refresh-token.js` or OAuth Playground)
- **Why**: Used by `upload-photo` for OAuth fallback

### Step 3: Get Your Service Account JSON

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project: `wedding-photo-upload-481609`
3. Go to **APIs & Services** → **Credentials**
4. Find service account: `wedding-photo-upload@wedding-photo-upload-481609.iam.gserviceaccount.com`
5. Click on it → **Keys** tab → **Add Key** → **Create new key** → **JSON**
6. Download the JSON file
7. **Copy the entire JSON content** - this is what you paste into secrets 1, 2, and 3

### Step 4: Get Your OAuth Credentials (if not done yet)

If you haven't set up OAuth yet:

1. **Get Client ID & Secret:**
   - Google Cloud Console → **APIs & Services** → **Credentials**
   - Find your OAuth 2.0 Client ID
   - Copy Client ID and Client Secret

2. **Get Refresh Token:**
   - Run: `node get-refresh-token.js`
   - Follow the instructions it prints
   - Copy the refresh token it outputs

### Step 5: Add All Secrets

1. In Supabase Dashboard → **Settings** → **Edge Functions** → **Secrets**
2. Click **"Add new secret"** for each of the 6 secrets above
3. Paste the values
4. Click **"Save"** for each

### Step 6: Redeploy Functions

After setting secrets, redeploy:

```powershell
cd "E:\Projects\software development\FSWedding\our-special-day"
supabase functions deploy
```

### Step 7: Test

1. Refresh your website
2. Test Gallery - should load images
3. Test RSVP - should save to Google Sheet
4. Test Upload - should upload to Google Drive

## 📋 Quick Checklist

- [ ] `SERVICE_ACCOUNT_JSON` secret added
- [ ] `GOOGLE_SERVICE_ACCOUNT_JSON` secret added
- [ ] `GOOGLE_SERVICE_ACCOUNT` secret added
- [ ] `GOOGLE_OAUTH_CLIENT_ID` secret added
- [ ] `GOOGLE_OAUTH_CLIENT_SECRET` secret added
- [ ] `GOOGLE_OAUTH_REFRESH_TOKEN` secret added
- [ ] Functions redeployed
- [ ] Gallery tested - works ✅
- [ ] RSVP tested - works ✅
- [ ] Upload tested - works ✅

## 🚨 Important Notes

- **All 3 service account secrets** (1-3) should have the **exact same JSON content**
- **OAuth secrets** (4-6) are required for uploads to work (service accounts can't upload to regular Drive folders)
- After adding secrets, **always redeploy functions** for changes to take effect

