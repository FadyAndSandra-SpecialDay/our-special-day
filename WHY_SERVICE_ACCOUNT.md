# Why We Use Service Account (And Why It Fails for Uploads)

## Why Service Account?

We use service account because it works for **most** Google services:

✅ **Google Sheets (RSVP)** - Service account works perfectly, no quota issues
✅ **Reading Google Drive (Gallery)** - Service account works fine for reading
❌ **Uploading to Google Drive** - Service account **CANNOT** upload to regular folders

## Google's Limitation

**Service accounts don't have storage quota** for regular Google Drive folders. This is a Google policy, not a bug.

**What works:**
- Service accounts CAN upload to **Shared Drives** (Team Drives)
- Service accounts CAN read from regular Drive folders
- Service accounts CAN write to Google Sheets

**What doesn't work:**
- Service accounts CANNOT upload to regular "My Drive" folders

## Our Solution: OAuth Fallback

The code is designed to:
1. **Try service account first** (works for Sheets, reading Drive)
2. **If upload fails with quota error** → automatically fall back to OAuth
3. **OAuth uses YOUR personal Google account quota** → works with regular folders

## Why OAuth Fallback Isn't Working

The error shows the OAuth fallback **isn't being triggered**. This means:

1. **OAuth secrets are missing** - The function can't find:
   - `GOOGLE_OAUTH_CLIENT_ID`
   - `GOOGLE_OAUTH_CLIENT_SECRET`
   - `GOOGLE_OAUTH_REFRESH_TOKEN`

2. **Or OAuth token refresh is failing** - The refresh token might be invalid/expired

## Check the Logs

After the next upload attempt, check Supabase logs:
https://supabase.com/dashboard/project/gosvleaijwscbrrnqkkt/functions/upload-photo/logs

Look for these messages:
- ✅ `"Service account quota error detected. Attempting OAuth fallback..."` - OAuth fallback triggered
- ✅ `"OAuth check: clientId=SET, clientSecret=SET, refreshToken=SET"` - All OAuth secrets found
- ❌ `"OAuth check: clientId=MISSING"` - OAuth secrets not set
- ❌ `"OAuth fallback failed:"` - OAuth token refresh failed

## Solutions

### Option 1: Set Up OAuth (Recommended)

1. Set all 3 OAuth secrets in Supabase
2. The function will automatically use OAuth when service account fails
3. Uploads will work to regular Drive folders

### Option 2: Use Shared Drive

1. Create a Shared Drive (Team Drive) in Google Drive
2. Share it with your service account
3. Update `uploadFolderId` in `weddingConfig.ts` to the Shared Drive folder ID
4. Service account will work (no OAuth needed)

### Option 3: Use OAuth Only (Skip Service Account)

We could modify the code to use OAuth first for uploads, but service account is still needed for:
- Google Sheets (RSVP)
- Reading Drive folders (Gallery)

So we keep service account for those features and use OAuth fallback for uploads.

## Current Status

- ✅ Service account works for RSVP (Google Sheets)
- ✅ Service account works for Gallery (reading Drive)
- ❌ Service account fails for Uploads (quota limitation)
- ❌ OAuth fallback not working (secrets missing or invalid)

## Next Step

**Set the OAuth secrets** and the fallback will work automatically!

