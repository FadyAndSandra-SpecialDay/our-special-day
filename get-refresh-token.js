// Run: node get-refresh-token.js
// This will give you a URL to visit and authorize

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ⚠️ REPLACE THESE WITH YOUR ACTUAL VALUES FROM GOOGLE CLOUD CONSOLE
// Get these from: https://console.cloud.google.com/apis/credentials?project=YOUR_PROJECT_ID
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';
const REDIRECT_URI = 'http://localhost:8080';

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
  `response_type=code&` +
  `scope=${encodeURIComponent('https://www.googleapis.com/auth/drive.file')}&` +
  `access_type=offline&` +
  `prompt=consent`;

console.log('\n1. Visit this URL in your browser:');
console.log(authUrl);
console.log('\n2. Authorize the app and copy the "code" from the redirect URL');
console.log('   (It will look like: http://localhost:8080/?code=4/0A...)\n');

rl.question('Enter the authorization code: ', async (code) => {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code.trim(),
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    
    const data = await response.json();
    if (data.refresh_token) {
      console.log('\n✅ Success! Your refresh token:');
      console.log(data.refresh_token);
      console.log('\n📋 Save this token - you\'ll need it for Supabase secrets!');
      console.log('\nNext steps:');
      console.log('1. Go to Supabase Dashboard → Settings → Edge Functions → Secrets');
      console.log('2. Add secret: GOOGLE_OAUTH_REFRESH_TOKEN');
      console.log('3. Paste the refresh token above as the value');
    } else {
      console.error('\n❌ Error getting refresh token:');
      console.error(JSON.stringify(data, null, 2));
      if (data.error === 'invalid_grant') {
        console.error('\n💡 Tip: The authorization code may have expired. Try again with a fresh code.');
      }
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
  rl.close();
});

