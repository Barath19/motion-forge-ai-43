import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MCP_ENDPOINT = 'https://mcp.aci.dev/gateway/mcp?bundle_key=GRlB9reeVkGPp9omez9X9INeFw3x6LugsVOJ';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice_id = 'NBqeXKdZHweef6y0B67V' } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    console.log('Converting text to speech:', text);

    // Initialize MCP session first
    const initResponse = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: {
            name: 'text-to-speech',
            version: '1.0.0'
          }
        }
      }),
    });

    const initData = await initResponse.json();
    console.log('MCP initialization response:', initData);

    // Extract session ID from response headers
    const sessionId = initResponse.headers.get('x-mcp-session-id') || 
                     initResponse.headers.get('mcp-session-id') ||
                     initData.sessionId;
    
    console.log('Session ID:', sessionId);

    // Now call the tool with session ID header
    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionId && { 'x-mcp-session-id': sessionId }),
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'ELEVEN_LABS__CREATE_SPEECH',
          arguments: {
            voice_id: voice_id,
            text: text
          }
        }
      }),
    });

    console.log('MCP response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('MCP API error:', response.status, errorText);
      throw new Error(`TTS request failed: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    console.log('Response content-type:', contentType);

    // If response is JSON, it might contain base64 audio
    if (contentType?.includes('application/json')) {
      const jsonResponse = await response.json();
      console.log('JSON response keys:', Object.keys(jsonResponse));
      
      // Try to find audio data in various possible fields
      const audioBase64 = jsonResponse.audio || jsonResponse.data || jsonResponse.content || jsonResponse.result;
      
      if (!audioBase64) {
        console.error('Full response:', JSON.stringify(jsonResponse).substring(0, 1000));
        throw new Error('No audio data found in response');
      }

      // Decode base64 to binary
      const binaryString = atob(audioBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      console.log('Decoded audio size:', bytes.length, 'bytes');
      
      return new Response(bytes, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'audio/mpeg',
        },
      });
    } else {
      // If response is already binary audio
      const audioBlob = await response.blob();
      console.log('Audio blob size:', audioBlob.size);
      
      return new Response(audioBlob, {
        headers: {
          ...corsHeaders,
          'Content-Type': contentType || 'audio/mpeg',
        },
      });
    }
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
