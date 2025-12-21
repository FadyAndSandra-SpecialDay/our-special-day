# Quick Fix: Set Missing Secrets

## Current Errors

1. ❌ Gallery: `SERVICE_ACCOUNT_JSON not configured`
2. ❌ RSVP: `SERVICE_ACCOUNT_JSON not configured`
3. ❌ Upload: Service account quota error (OAuth fallback not working)

## Solution: Set All Required Secrets

Go to: https://supabase.com/dashboard/project/gosvleaijwscbrrnqkkt/settings/functions

Scroll to **"Secrets"** section and add these secrets:

### Secret 1: GOOGLE_SERVICE_ACCOUNT
- **Name**: `GOOGLE_SERVICE_ACCOUNT`
- **Value**: Your service account JSON (full content)
- **Used by**: `upload-photo` function

### Secret 2: GOOGLE_SERVICE_ACCOUNT_JSON
- **Name**: `GOOGLE_SERVICE_ACCOUNT_JSON`
- **Value**: Same JSON as above (copy-paste)
- **Used by**: `save-rsvp`, `preflight` functions

### Secret 3: SERVICE_ACCOUNT_JSON
- **Name**: `SERVICE_ACCOUNT_JSON`
- **Value**: Same JSON as above (copy-paste)
- **Used by**: `get-gallery` function

### Secret 4: GOOGLE_OAUTH_CLIENT_ID
- **Name**: `GOOGLE_OAUTH_CLIENT_ID`
- **Value**: Your OAuth Client ID
- **Used by**: `upload-photo` (OAuth fallback)

### Secret 5: GOOGLE_OAUTH_CLIENT_SECRET
- **Name**: `GOOGLE_OAUTH_CLIENT_SECRET`
- **Value**: Your OAuth Client Secret
- **Used by**: `upload-photo` (OAuth fallback)

### Secret 6: GOOGLE_OAUTH_REFRESH_TOKEN
- **Name**: `GOOGLE_OAUTH_REFRESH_TOKEN`
- **Value**: Your OAuth Refresh Token
- **Used by**: `upload-photo` (OAuth fallback)

## Steps

1. **Get your service account JSON:**
   - Download from Google Cloud Console
   - Service account: `wedding-photo-upload@wedding-photo-upload-481609.iam.gserviceaccount.com`

2. **Get your OAuth credentials:**
   - Follow Step 6 in `COMPLETE_SETUP_GUIDE.md`
   - Or use `get-refresh-token.js` script

3. **Add all 6 secrets in Supabase Dashboard**

4. **Redeploy functions:**
   ```powershell
   supabase functions deploy
   ```

5. **Test again**

## Quick Checklist

- [ ] `GOOGLE_SERVICE_ACCOUNT` secret set
- [ ] `GOOGLE_SERVICE_ACCOUNT_JSON` secret set
- [ ] `SERVICE_ACCOUNT_JSON` secret set
- [ ] `GOOGLE_OAUTH_CLIENT_ID` secret set
- [ ] `GOOGLE_OAUTH_CLIENT_SECRET` secret set
- [ ] `GOOGLE_OAUTH_REFRESH_TOKEN` secret set
- [ ] Functions redeployed
- [ ] Tested gallery, RSVP, and upload

