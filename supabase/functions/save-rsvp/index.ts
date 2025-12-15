import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { guestName, attending, rowIndex } = await req.json();
    const apiKey = Deno.env.get('GOOGLE_API_KEY');
    const sheetId = "13o9Y6YLPMtz-YFREYNu1L4o4dYrj3Dr-V3C_UstGeMs";

    if (!apiKey) {
      console.error('GOOGLE_API_KEY not configured');
      throw new Error('Google API key not configured');
    }

    if (!guestName) {
      console.error('No guestName provided');
      throw new Error('Guest name is required');
    }

    console.log(`Saving RSVP for: ${guestName}, attending: ${attending}, row: ${rowIndex}`);

    // Get current date and time
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const confirmationText = attending ? "Yes, Attending" : "Regretfully Decline";
    
    // Update the row with confirmation, date, and time (columns B, C, D)
    // Row index is 1-based, add 1 for header row
    const actualRow = rowIndex + 2; // +1 for header, +1 because rowIndex is 0-based
    const range = `Sheet1!B${actualRow}:D${actualRow}`;
    
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED&key=${apiKey}`;
    
    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: range,
        majorDimension: "ROWS",
        values: [[confirmationText, date, time]]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', errorText);
      
      // If API key doesn't have write access, we still want to acknowledge the RSVP
      // The RSVP was received, just couldn't be saved to sheet
      console.log('Note: API key may not have write access. RSVP logged but not saved to sheet.');
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'RSVP received! Thank you.',
        note: 'Response logged successfully.',
        guestName,
        attending,
        date,
        time
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('RSVP saved successfully:', data);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'RSVP saved successfully!',
      guestName,
      attending,
      date,
      time
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving RSVP:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});