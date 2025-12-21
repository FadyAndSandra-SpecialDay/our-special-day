# OAuth Refresh Token - How It Works

## Refresh Token Expiration

### Good News: They Don't Expire Easily! ✅

**OAuth refresh tokens are designed to be long-lived** and typically don't expire unless:

1. **You revoke access** in your Google Account settings
2. **You generate a new refresh token** (the old one becomes invalid)
3. **The app is unused for 6+ months** (very rare)
4. **You change your Google account password** (sometimes)

### What Happens When It Expires?

If your refresh token expires:

1. **You'll see errors** in Supabase logs:
   - `"invalid_grant"` 
   - `"token_expired"`
   - `"OAuth token refresh failed"`

2. **Uploads will fail** with OAuth errors

3. **Solution is simple:**
   - Generate a new refresh token (takes 2 minutes)
   - Update `GOOGLE_OAUTH_REFRESH_TOKEN` secret in Supabase
   - **No code changes needed** - just update the secret!

### How to Generate New Refresh Token

**Option 1: Using Script**
```powershell
node get-refresh-token.js
```

**Option 2: Using OAuth Playground**
- Go to: https://developers.google.com/oauthplayground/
- Follow `GET_REFRESH_TOKEN_EASY.md`

### Monitoring Token Health

**Check Supabase logs regularly:**
- Dashboard → Edge Functions → upload-photo → Logs
- Look for OAuth-related errors
- If you see `"invalid_grant"`, it's time to refresh

---

## How the Project Handles Expiration

The code automatically:
1. ✅ Tries service account first
2. ✅ Falls back to OAuth if service account fails
3. ✅ Provides clear error messages if OAuth fails
4. ✅ Logs detailed information for debugging

**You don't need to change code** - just update the secret when needed!

