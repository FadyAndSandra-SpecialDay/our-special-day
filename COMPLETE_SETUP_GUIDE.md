# Complete Setup Guide - Wedding Photo Upload

This is your **one-stop guide** for setting up the entire photo upload feature. Follow these steps in order.

**📋 Quick Reference:** See `YOUR_CONFIG.md` for your specific service account email and API key.

---

## Step 1: Supabase Project Setup

### 1.1 Verify Project Connection

Your project is already connected to: **gosvleaijwscbrrnqkkt**

- Dashboard: https://supabase.com/dashboard/project/gosvleaijwscbrrnqkkt
- If you need to change projects, run: `supabase link --project-ref YOUR_PROJECT_REF`

### 1.2 Set Environment Variables

1. Create/update `.env` file in project root:
   ```env
   VITE_SUPABASE_URL=https://gosvleaijwscbrrnqkkt.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
   ```

2. Get your anon key:
   - Go to: https://supabase.com/dashboard/project/gosvleaijwscbrrnqkkt/settings/api
   - Copy the **anon/public** key
   - Replace `your_anon_key_here` in `.env`

---

## Step 2: Google Cloud Project Setup

### 2.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click project dropdown → **"New Project"**
3. Name: "Wedding Photo Upload" (or any name)
4. Click **"Create"** and select it

### 2.2 Enable Google Drive API

1. Go to **APIs & Services** → **Library**
2. Search for **"Google Drive API"**
3. Click **"Enable"**
4. Wait for it to enable

**Your Configuration:**
- **Service Account Email**: `wedding-photo-upload@wedding-photo-upload-481609.iam.gserviceaccount.com`
- **API Key**: `AQ.Ab8RN6JD2wANPAAA_J0owfR4RLfBKcGa-NucGF5CRCVKZGfIxw`
  - Note: For the upload feature, we primarily use the service account JSON file for authentication. The API key may be used for API restrictions or other services.

---

## Step 3: Create Service Account

### 3.1 Create Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"Service account"**
3. Fill in:
   - **Name**: `wedding-photo-upload`
   - **Description**: "Service account for wedding photo uploads"
4. Click **"CREATE AND CONTINUE"**
5. Skip optional steps → Click **"DONE"**

**Your service account email should be:**
`wedding-photo-upload@wedding-photo-upload-481609.iam.gserviceaccount.com`

### 3.2 Download Service Account Key

1. Find your service account in the list
2. Click on the service account email: `wedding-photo-upload@wedding-photo-upload-481609.iam.gserviceaccount.com`
3. Go to **"Keys"** tab
4. Click **"ADD KEY"** → **"Create new key"**
5. Select **"JSON"** format
6. Click **"CREATE"** - file downloads automatically
7. **SAVE THIS FILE SECURELY** - you'll need it in Step 6

**⚠️ IMPORTANT:** 
- Never commit this JSON file to Git!
- The JSON file should contain `client_email: "wedding-photo-upload@wedding-photo-upload-481609.iam.gserviceaccount.com"`

---

## Step 4: Set Up Google Sheets (RSVP Feature)

### 4.1 Share Google Sheet with Service Account

Your Google Sheet ID: `13o9Y6YLPMtz-YFREYNu1L4o4dYrj3Dr-V3C_UstGeMs`

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/13o9Y6YLPMtz-YFREYNu1L4o4dYrj3Dr-V3C_UstGeMs
2. Click **"Share"** button (top right)
3. Add this service account email:
   ```
   wedding-photo-upload@wedding-photo-upload-481609.iam.gserviceaccount.com
   ```
4. Set permission to **"Editor"** (so it can write RSVP responses)
5. **Uncheck** "Notify people"
6. Click **"Share"**

**Why?** The service account needs write access to save RSVP responses to the sheet.

---

## Step 5: Set Up Google Drive Folders

### 5.1 Create Upload Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder (e.g., "Wedding Photos 2026")
3. Right-click folder → **"Share"**

### 5.2 Share Upload Folder with Service Account

1. Use this service account email:
   ```
   wedding-photo-upload@wedding-photo-upload-481609.iam.gserviceaccount.com
   ```
2. In the share dialog:
   - Paste the service account email above
   - Set permission to **"Editor"**
   - **Uncheck** "Notify people"
3. Click **"Share"**

### 5.3 Get Folder IDs

1. **Upload Folder:**
   - Open the upload folder in Google Drive
   - Look at the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - Copy the **FOLDER_ID** (the long string after `/folders/`)

2. **Gallery Folder:**
   - Your current gallery folder ID: `1l4IlQOJ5z7tA-Nn3_T3zsJHVAzPRrE2D`
   - If you need to change it, get the ID from the folder URL

### 5.4 Update Project Configuration

1. Open `src/lib/weddingConfig.ts`
2. Update folder IDs if needed:
   ```typescript
   uploadFolderId: "YOUR_UPLOAD_FOLDER_ID_HERE",
   galleryFolderId: "YOUR_GALLERY_FOLDER_ID_HERE",
   ```

---

## Step 6: Set Up OAuth (Required for Regular Drive Folders)

**Why?** Service accounts can't upload to regular Drive folders due to Google's quota limitations. OAuth uses your personal Google account quota.

### 6.1 Create OAuth Credentials

1. In Google Cloud Console → **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. If prompted, configure OAuth consent screen:
   - **User Type**: External
   - **App name**: "Wedding Photo Upload"
   - **User support email**: Your email
   - **Developer contact**: Your email
   - Click **"Save and Continue"**
   - **Scopes**: Add `https://www.googleapis.com/auth/drive.file`
   - Click **"Save and Continue"**
   - **Test users**: Add your email (e.g., `fo2sh.adel.habib@gmail.com`)
   - Click **"Save and Continue"**
4. Back to Credentials:
   - **Application type**: Web application
   - **Name**: "Wedding Upload OAuth"
   - **Authorized redirect URIs**: `http://localhost:8080`
   - Click **"Create"**
5. **Save the Client ID and Client Secret**

### 6.2 Get Refresh Token

**Option A: Using Google OAuth Playground (Easiest)**

1. Go to [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click gear icon (⚙️) → Check **"Use your own OAuth credentials"**
3. Enter your **Client ID** and **Client Secret**
4. In left panel, find **"Drive API v3"**
5. Select scope: `https://www.googleapis.com/auth/drive.file`
6. Click **"Authorize APIs"** → Sign in → Click **"Allow"**
7. Click **"Exchange authorization code for tokens"**
8. **Copy the "Refresh token"**

**Option B: Using Script**

1. Open `get-refresh-token.js` in project root
2. Replace `YOUR_CLIENT_ID_HERE` and `YOUR_CLIENT_SECRET_HERE` with your credentials
3. Run: `node get-refresh-token.js`
4. Visit the URL it prints
5. Authorize and copy the code from redirect URL
6. Paste code when prompted
7. **Copy the refresh token** it outputs

---

## Step 7: Configure Supabase Secrets

### 7.1 Set Service Account Secret

**Important:** The service account JSON is used for:
- ✅ Google Sheets (RSVP saving) - works with service account
- ✅ Google Drive uploads - needs OAuth fallback for regular folders
- ✅ Gallery images - reads from Drive folders

**Note:** Different functions use different secret names. Set **all three** to ensure compatibility:

1. Go to: https://supabase.com/dashboard/project/gosvleaijwscbrrnqkkt/settings/functions
2. Scroll to **"Secrets"** section
3. Add the same JSON content with **three different names**:

   **Secret 1 (for upload-photo):**
   - **Name**: `GOOGLE_SERVICE_ACCOUNT`
   - **Value**: Paste the **ENTIRE JSON** from your service account file

   **Secret 2 (for save-rsvp, preflight):**
   - **Name**: `GOOGLE_SERVICE_ACCOUNT_JSON`
   - **Value**: Same JSON content as above

   **Secret 3 (for get-gallery, legacy compatibility):**
   - **Name**: `SERVICE_ACCOUNT_JSON`
   - **Value**: Same JSON content as above

4. Click **"Save"** for each secret

**Tip:** You can copy-paste the same JSON value into all three secrets - they're just different names for the same content.

### 7.2 Set OAuth Secrets

1. In same Secrets section, add three more secrets:

   **Secret 1:**
   - **Name**: `GOOGLE_OAUTH_CLIENT_ID`
   - **Value**: Your OAuth Client ID (from Step 5.1)

   **Secret 2:**
   - **Name**: `GOOGLE_OAUTH_CLIENT_SECRET`
   - **Value**: Your OAuth Client Secret (from Step 5.1)

   **Secret 3:**
   - **Name**: `GOOGLE_OAUTH_REFRESH_TOKEN`
   - **Value**: Your Refresh Token (from Step 5.2)

2. Click **"Save"** for each

---

## Step 8: Deploy Supabase Edge Functions

### 8.1 Deploy Functions

**Via Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/gosvleaijwscbrrnqkkt/functions
2. For each function, click **"Deploy"** or **"Redeploy"**:
   - `upload-photo`
   - `get-gallery`
   - `get-guests`
   - `save-rsvp`

**Via CLI:**
```powershell
cd "E:\Projects\software development\FSWedding\our-special-day"
supabase functions deploy
```

---

## Step 9: Test the Features

### 9.1 Start Development Server

```powershell
npm run dev
```

### 9.2 Test RSVP Feature

1. Open http://localhost:8080 in your browser
2. Scroll to **"RSVP"** section
3. Type a guest name (at least 2 characters)
4. Select your name from the dropdown
5. Choose "Yes, Attending" or "Regretfully Decline"
6. Click **"Submit RSVP"**
7. Check your Google Sheet - the RSVP should appear in columns B, C, D

### 9.3 Test Upload Feature

1. Open http://localhost:8080 in your browser
2. Scroll to **"Upload Your Photos"** section
3. Upload a test image (drag & drop or click to browse)
4. Click **"Upload All"**
5. Check:
   - ✅ Image shows green checkmark (success)
   - ✅ Image appears in your Google Drive folder
   - ❌ If error, check browser console and Supabase logs

### 9.4 Check Logs (if errors)

1. Go to: https://supabase.com/dashboard/project/gosvleaijwscbrrnqkkt/functions/upload-photo/logs
2. Look for error messages
3. Common issues:
   - **"Service Accounts do not have storage quota"** → OAuth not set up correctly
   - **"Missing credentials"** → Secrets not set in Supabase
   - **"403 Forbidden"** → Folder not shared with service account

---

## Troubleshooting

### Error: "Service Accounts do not have storage quota"

**Solution:** Make sure OAuth secrets are set correctly (Step 6.2). The function will automatically fall back to OAuth when service account fails.

### Error: "Access blocked" when getting refresh token

**Solution:** Add your email as a test user in OAuth consent screen (Step 5.1, Test users section).

### Error: "Missing credentials"

**Solution:** Verify all secrets are set in Supabase Dashboard → Settings → Edge Functions → Secrets.

### Error: "403 Forbidden" on upload

**Solution:** 
1. Verify folder is shared with service account email (Step 5.2)
2. Check folder ID is correct in `weddingConfig.ts` (Step 5.4)

### Error: "Failed to save RSVP to Google Sheets"

**Solution:**
1. Verify Google Sheet is shared with service account email (Step 4.1)
2. Check service account has "Editor" permission on the sheet
3. Verify `GOOGLE_SERVICE_ACCOUNT` secret is set correctly in Supabase

### Images not appearing in Drive

**Solution:**
1. Check folder ID in `weddingConfig.ts`
2. Verify folder is shared with service account
3. Check Supabase function logs for errors

---

## Summary Checklist

- [ ] Step 1: Supabase project connected and `.env` file configured
- [ ] Step 2: Google Cloud project created and Drive API enabled
- [ ] Step 3: Service account created and JSON key downloaded
- [ ] Step 4: Google Sheet shared with service account (for RSVP)
- [ ] Step 5: Google Drive folders created, shared with service account, and IDs updated in config
- [ ] Step 6: OAuth credentials created and refresh token obtained
- [ ] Step 7: All secrets set in Supabase (Service Account + OAuth)
- [ ] Step 8: Edge functions deployed
- [ ] Step 9: RSVP and Upload features tested and working

---

## Quick Reference Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/gosvleaijwscbrrnqkkt
- **Supabase API Settings**: https://supabase.com/dashboard/project/gosvleaijwscbrrnqkkt/settings/api
- **Supabase Secrets**: https://supabase.com/dashboard/project/gosvleaijwscbrrnqkkt/settings/functions
- **Google Cloud Console**: https://console.cloud.google.com
- **Google Drive**: https://drive.google.com
- **OAuth Playground**: https://developers.google.com/oauthplayground/

---

**Once all steps are complete, your photo upload feature will be fully functional! 🎉**

