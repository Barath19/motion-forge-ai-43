import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const formData = await req.formData();
    const prompt = formData.get('prompt') as string;
    const imageFile = formData.get('image') as File;
    const duration = formData.get('duration') as string || '12';
    const resolution = formData.get('resolution') as string || '1280x720';

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Strip 's' suffix from duration (e.g., '4s' -> '4')
    const durationValue = duration.replace(/s$/i, '');

    console.log('Creating video with prompt:', prompt);
    console.log('Duration:', durationValue);
    console.log('Resolution:', resolution);
    console.log('Image file:', imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : 'none');

    // Create form data for OpenAI API
    const openaiFormData = new FormData();
    openaiFormData.append('model', 'sora-2');
    openaiFormData.append('prompt', prompt);
    openaiFormData.append('seconds', durationValue);
    openaiFormData.append('size', resolution);
    
    if (imageFile) {
      openaiFormData.append('input_reference', imageFile, imageFile.name);
    }

    console.log('Sending request to OpenAI...');
    const response = await fetch('https://api.openai.com/v1/videos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: openaiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${errorText}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const videoJob = await response.json();
    console.log('Video job created:', videoJob);

    return new Response(
      JSON.stringify(videoJob),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-video function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
