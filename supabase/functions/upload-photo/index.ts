import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getAccessToken(scopes: string) {
  const saJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON') || Deno.env.get('SERVICE_ACCOUNT_JSON');
  if (!saJson) throw new Error('SERVICE_ACCOUNT_JSON (or GOOGLE_SERVICE_ACCOUNT_JSON) not configured');

  const sa = JSON.parse(saJson);
  const privateKeyPem = sa.private_key as string;
  const clientEmail = sa.client_email as string;
  if (!privateKeyPem || !clientEmail) throw new Error('Invalid service account JSON');

  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: scopes,
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const toBase64Url = (obj: any) => {
    const s = JSON.stringify(obj);
    const b = new TextEncoder().encode(s);
    const base64 = btoa(String.fromCharCode(...new Uint8Array(b)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const headerB64 = toBase64Url(header);
  const payloadB64 = toBase64Url(payload);
  const unsigned = `${headerB64}.${payloadB64}`;

  const pem = privateKeyPem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '');
  const derStr = atob(pem);
  const der = new Uint8Array(derStr.split('').map((c) => c.charCodeAt(0))).buffer;

  const key = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  const sigBytes = new Uint8Array(signature);
  let sigBase64 = '';
  for (let i = 0; i < sigBytes.length; i++) sigBase64 += String.fromCharCode(sigBytes[i]);
  sigBase64 = btoa(sigBase64).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const jwt = `${unsigned}.${sigBase64}`;
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(jwt)}`,
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Failed to obtain access token: ${txt}`);
  }

  const data = await resp.json();
  return data.access_token as string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folderId = (formData.get('folderId') as string) || Deno.env.get('UPLOAD_FOLDER_ID');

    if (!file) throw new Error('File is required');
    if (!folderId) throw new Error('folderId is required');

    console.log(`Uploading file: ${file.name} to folder: ${folderId}`);

    const scopes = 'https://www.googleapis.com/auth/drive';
    const token = await getAccessToken(scopes);

    // Build multipart form-data for Drive upload (metadata + file)
    const metadata = { name: file.name, parents: [folderId] };
    const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;

    const uploadForm = new FormData();
    uploadForm.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    uploadForm.append('file', file, file.name);

    const uploadResp = await fetch(uploadUrl, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: uploadForm });
    if (!uploadResp.ok) {
      const errorText = await uploadResp.text();
      console.error('Drive upload error:', errorText);
      throw new Error(`Drive upload failed: ${uploadResp.status}`);
    }

    const result = await uploadResp.json();
    console.log('File uploaded:', result.id);

    // Optionally set the file to be viewable by anyone with the link (requires drive.permissions scope)
    try {
      const permResp = await fetch(`https://www.googleapis.com/drive/v3/files/${result.id}/permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: 'reader', type: 'anyone' }),
      });
      if (!permResp.ok) {
        const err = await permResp.text();
        console.warn('Could not set public permission:', err);
      }
    } catch (permErr) {
      console.warn('Permission setting error:', permErr);
    }

    const fullUrl = `https://drive.google.com/uc?export=view&id=${result.id}`;

    return new Response(JSON.stringify({ success: true, id: result.id, name: result.name, url: fullUrl }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error uploading photo:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});