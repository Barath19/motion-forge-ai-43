const MCP_ENDPOINT = 'https://mcp.aci.dev/gateway/mcp?bundle_key=GRlB9reeVkGPp9omez9X9INeFw3x6LugsVOJ';
const VOICE_ID = 'VD1if7jDVYtAKs4P0FIY';

export interface TTSRequest {
  text: string;
}

export const convertTextToSpeech = async (text: string): Promise<Blob> => {
  try {
    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'ELEVEN_LABS__STREAM_TEXT_TO_SPEECH',
        parameters: {
          path: {
            voice_id: VOICE_ID
          },
          header: {
            'Content-Type': 'application/json'
          },
          body: {
            text: text
          }
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`TTS request failed: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    return audioBlob;
  } catch (error) {
    console.error('Error converting text to speech:', error);
    throw error;
  }
};
