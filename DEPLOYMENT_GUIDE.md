# Deployment Guide - GitHub Pages & Lovable

This guide covers:
1. How refresh tokens work (they don't expire easily)
2. How to deploy securely to GitHub Pages
3. How to deploy to Lovable domain

---

## 1. OAuth Refresh Token Expiration

### Good News: Refresh Tokens Don't Expire Easily

**Refresh tokens are long-lived** and typically don't expire unless:
- You revoke access in your Google Account settings
- You generate a new refresh token (old one becomes invalid)
- The app is unused for 6+ months (rare)

### What Happens When Refresh Token Expires?

If your refresh token expires:

1. **You'll see errors** in Supabase logs: `"invalid_grant"` or `"token_expired"`
2. **Uploads will fail** with OAuth errors
3. **Solution**: Generate a new refresh token:
   - Use `get-refresh-token.js` or OAuth Playground
   - Update `GOOGLE_OAUTH_REFRESH_TOKEN` secret in Supabase
   - No code changes needed - just update the secret

### Monitoring Token Health

**Check Supabase logs regularly:**
- Go to: https://supabase.com/dashboard/project/gosvleaijwscbrrnqkkt/functions/upload-photo/logs
- Look for OAuth-related errors
- If you see `"invalid_grant"`, generate a new refresh token

---

## 2. Deploy to GitHub Pages

### Step 1: Set Up GitHub Secrets

1. Go to your GitHub repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:

   **Secret 1:**
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://gosvleaijwscbrrnqkkt.supabase.co`

   **Secret 2:**
   - **Name**: `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Value**: Your anon/public key from Supabase Dashboard

### Step 2: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### Step 3: Configure GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Under **"Source"**, select **"GitHub Actions"**
3. Save

### Step 4: Update Vite Config (if needed)

If your repo is at `https://username.github.io/repo-name/`, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/repo-name/',  // Replace with your repo name
  // ... rest of config
});
```

### Step 5: Push and Deploy

```powershell
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

GitHub Actions will automatically build and deploy!

---

## 3. Deploy to Lovable Domain

### Step 1: Set Environment Variables in Lovable

1. In Lovable dashboard, go to your project settings
2. Find **"Environment Variables"** or **"Secrets"**
3. Add:
   - `VITE_SUPABASE_URL`: `https://gosvleaijwscbrrnqkkt.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your anon key

### Step 2: Deploy

1. Click **"Deploy"** or **"Publish"** in Lovable
2. Lovable will build with the environment variables
3. Your site will be live on Lovable domain

### Step 3: Verify

1. Test all features on the deployed site
2. Check that uploads work
3. Verify RSVP works
4. Check gallery loads

---

## 4. Security Best Practices

### ✅ DO:

1. **Never commit secrets** to Git
2. **Use environment variables** for all sensitive data
3. **Keep `.env` in `.gitignore`**
4. **Use GitHub Secrets** for CI/CD
5. **Rotate refresh tokens** if compromised

### ❌ DON'T:

1. **Don't commit** `.env` files
2. **Don't hardcode** credentials in code
3. **Don't share** service account JSON files
4. **Don't expose** OAuth client secrets in frontend code

### Files to Add to .gitignore

Make sure `.gitignore` includes:

```
.env
.env.local
.env.production
*.json  # Service account JSON files
get-refresh-token.js  # Contains credentials (optional - you can keep it but don't commit real values)
```

---

## 5. What Gets Deployed

### Frontend (Public):
- ✅ React app code
- ✅ Supabase client (uses public anon key - safe)
- ✅ Configuration (weddingConfig.ts - no secrets)

### Backend (Supabase Edge Functions):
- ✅ Function code (deployed separately)
- ✅ Secrets stored securely in Supabase (not in Git)
- ✅ Service account JSON (in Supabase secrets)
- ✅ OAuth credentials (in Supabase secrets)

### What's NOT in Git:
- ❌ `.env` file
- ❌ Service account JSON files
- ❌ OAuth client secrets
- ❌ Refresh tokens

---

## 6. Troubleshooting Deployment

### Issue: Environment variables not working

**Solution:**
- Verify secrets are set in GitHub/Lovable
- Check variable names match exactly (case-sensitive)
- Redeploy after adding secrets

### Issue: Uploads fail on deployed site

**Solution:**
- Check Supabase secrets are set (not just local)
- Verify OAuth refresh token is still valid
- Check Supabase function logs

### Issue: CORS errors

**Solution:**
- Supabase Edge Functions already have CORS headers
- If issues persist, check Supabase project settings

---

## Summary

1. **Refresh tokens** are long-lived - monitor logs for expiration
2. **GitHub Pages**: Use GitHub Secrets for environment variables
3. **Lovable**: Set environment variables in Lovable dashboard
4. **Security**: Never commit secrets, use environment variables
5. **Backend secrets** stay in Supabase (not in Git)

Your project is ready to deploy securely! 🚀

