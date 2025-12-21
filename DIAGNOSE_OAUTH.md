# Diagnose OAuth Fallback Issue

## Current Error

The upload is failing with service account quota error, and OAuth fallback isn't working.

## Check 1: Verify OAuth Secrets Are Set

Go to: https://supabase.com/dashboard/project/gosvleaijwscbrrnqkkt/settings/functions

Scroll to **"Secrets"** and verify you have these **exact names**:

- ✅ `GOOGLE_OAUTH_CLIENT_ID`
- ✅ `GOOGLE_OAUTH_CLIENT_SECRET`
- ✅ `GOOGLE_OAUTH_REFRESH_TOKEN`

**If any are missing, add them!**

## Check 2: Verify Secret Values

Make sure the values are correct:

1. **GOOGLE_OAUTH_CLIENT_ID**: Should look like `xxxxx.apps.googleusercontent.com`
2. **GOOGLE_OAUTH_CLIENT_SECRET**: Should look like `GOCSPX-xxxxx`
3. **GOOGLE_OAUTH_REFRESH_TOKEN**: Should be a long string starting with `1//` or similar

## Check 3: Test OAuth Token Refresh

If secrets are set but still not working, test the refresh token:

1. Open `get-refresh-token.js`
2. Make sure CLIENT_ID and CLIENT_SECRET are set
3. Run: `node get-refresh-token.js`
4. If it fails, your refresh token may be invalid/expired

## Check 4: Check Function Logs

1. Go to: https://supabase.com/dashboard/project/gosvleaijwscbrrnqkkt/functions/upload-photo/logs
2. Look for these log messages:
   - `"Service account quota error detected. Attempting OAuth fallback..."`
   - `"OAuth credentials found, retrying with OAuth..."`
   - `"Retrying upload with OAuth token..."`
   - `"OAuth fallback failed:"`

If you see "OAuth fallback failed", check the error message.

## Common Issues

### Issue 1: Secrets Not Set
**Symptom**: No OAuth fallback logs appear
**Fix**: Add all 3 OAuth secrets in Supabase

### Issue 2: Invalid Refresh Token
**Symptom**: Logs show "OAuth fallback failed" with "invalid_grant"
**Fix**: Generate a new refresh token using `get-refresh-token.js`

### Issue 3: Wrong Client ID/Secret
**Symptom**: Logs show "OAuth fallback failed" with authentication error
**Fix**: Verify Client ID and Secret match your OAuth credentials

### Issue 4: Function Not Redeployed
**Symptom**: Changes not taking effect
**Fix**: Redeploy: `supabase functions deploy upload-photo`

## Quick Fix Steps

1. **Verify all 6 secrets are set** (3 service account + 3 OAuth)
2. **Redeploy function**: `supabase functions deploy upload-photo`
3. **Test upload again**
4. **Check logs** for OAuth fallback messages
5. **If still failing**, share the log messages here

