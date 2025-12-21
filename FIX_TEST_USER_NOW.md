# Fix OAuth "Access Blocked" Error - Quick Fix

## The Problem

You're seeing: **"Wedding Photo Upload has not completed the Google verification process"**

This happens because your OAuth app is in **testing mode** and your email isn't added as a test user.

## ✅ Quick Fix (2 Minutes)

### Step 1: Go to OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project: **wedding-photo-upload-481609** (or your project name)
3. Go to **APIs & Services** → **OAuth consent screen**

**Direct link:** https://console.cloud.google.com/apis/credentials/consent?project=wedding-photo-upload-481609

### Step 2: Add Your Email as Test User

1. Scroll down to the **"Test users"** section
2. Click **"+ ADD USERS"** button
3. Enter your email: **fo2sh.adel.habib@gmail.com**
4. Click **"ADD"**

### Step 3: Try Again

1. Go back to your terminal
2. Run: `node get-refresh-token.js`
3. Visit the URL it prints
4. You should now be able to authorize! ✅

## Visual Guide

```
Google Cloud Console
  ↓
APIs & Services
  ↓
OAuth consent screen
  ↓
Scroll to "Test users" section
  ↓
Click "+ ADD USERS"
  ↓
Enter: fo2sh.adel.habib@gmail.com
  ↓
Click "ADD"
  ↓
Wait 10 seconds
  ↓
Try the authorization URL again
```

## Still Not Working?

If you still get the error after adding your email:

1. **Wait 30 seconds** - Google needs time to update
2. **Clear browser cache** - Or try in incognito/private window
3. **Make sure you're signed in** to Google with the same email you added
4. **Check the email** - Make sure you added: `fo2sh.adel.habib@gmail.com` (exact match)

## After Adding Test User

Once you can authorize:
1. You'll see a "Allow" button
2. Click "Allow"
3. You'll be redirected to `http://localhost:8080/?code=...`
4. Copy the `code` parameter from the URL
5. Paste it in the terminal when prompted
6. You'll get your refresh token! 🎉

