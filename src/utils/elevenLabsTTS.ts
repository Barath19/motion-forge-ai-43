import { supabase } from '@/integrations/supabase/client';

export interface TTSRequest {
  text: string;
}

export const convertTextToSpeech = async (text: string): Promise<Blob> => {
  try {
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { text },
    });

    if (error) {
      throw error;
    }

    // The response is already a blob from the edge function
    return data as Blob;
  } catch (error) {
    console.error('Error converting text to speech:', error);
    throw error;
  }
};
