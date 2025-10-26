import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MCP_ENDPOINT = 'https://mcp.aci.dev/gateway/mcp?bundle_key=GRlB9reeVkGPp9omez9X9INeFw3x6LugsVOJ';
const VOICE_ID = 'NBqeXKdZHweef6y0B67V';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    console.log('Converting text to speech:', text);

    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'ELEVEN_LABS__CREATE_SPEECH',
        parameters: {
          voice_id: VOICE_ID,
          text: text
        }
      }),
    });

    console.log('MCP response status:', response.status);
    console.log('MCP response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MCP API error:', response.status, errorText);
      throw new Error(`TTS request failed: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    console.log('Audio blob size:', audioBlob.size, 'type:', audioBlob.type);
    
    return new Response(audioBlob, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
