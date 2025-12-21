# Your Specific Configuration

This file contains your specific service account and API details for quick reference.

## Service Account Details

**Service Account Email:**
```
wedding-photo-upload@wedding-photo-upload-481609.iam.gserviceaccount.com
```

**Project ID:** `wedding-photo-upload-481609`

## API Key

**Google Drive API Key:**
```
YOUR_API_KEY_HERE
```
**Note:** Replace with your actual API key from Google Cloud Console if needed. For most use cases, the service account JSON is sufficient.

## Important Notes

1. **Service Account JSON File**: You need to download the full JSON key file for this service account from Google Cloud Console. The JSON file contains all the credentials needed for authentication.

2. **Sharing Resources**: When sharing Google resources, use this email:
   ```
   wedding-photo-upload@wedding-photo-upload-481609.iam.gserviceaccount.com
   ```
   - **Google Sheet** (for RSVP): Share with "Editor" permission
   - **Google Drive Folders** (for uploads): Share with "Editor" permission

3. **Supabase Secret**: In Step 7 of `COMPLETE_SETUP_GUIDE.md`, you'll paste the entire JSON file content (not just the email) into the `GOOGLE_SERVICE_ACCOUNT` secret.

4. **Google Sheet ID**: `13o9Y6YLPMtz-YFREYNu1L4o4dYrj3Dr-V3C_UstGeMs`
   - This is already configured in `weddingConfig.ts`
   - Make sure this sheet is shared with the service account above

## Quick Checklist

- [ ] Service account JSON file downloaded
- [ ] Google Sheet shared with: `wedding-photo-upload@wedding-photo-upload-481609.iam.gserviceaccount.com` (Editor)
- [ ] Google Drive folders shared with: `wedding-photo-upload@wedding-photo-upload-481609.iam.gserviceaccount.com` (Editor)
- [ ] Service account JSON pasted into Supabase secret: `GOOGLE_SERVICE_ACCOUNT`
- [ ] OAuth credentials set up (for regular Drive folders)

