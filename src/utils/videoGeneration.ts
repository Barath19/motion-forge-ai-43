import { supabase } from '@/integrations/supabase/client';

export interface VideoGenerationOptions {
  prompt: string;
  image?: Blob;
}

export interface VideoJob {
  id: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  progress?: number;
  model?: string;
  size?: string;
  seconds?: string;
}

export interface VideoResult {
  success: boolean;
  filePath: string;
  publicUrl: string;
  videoId: string;
}

/**
 * Create a video generation job with OpenAI Sora 2
 */
export const createVideoJob = async (options: VideoGenerationOptions): Promise<VideoJob> => {
  const formData = new FormData();
  formData.append('prompt', options.prompt);
  
  if (options.image) {
    formData.append('image', options.image, 'reference.jpg');
  }

  const { data, error } = await supabase.functions.invoke('create-video', {
    body: formData,
  });

  if (error) {
    throw new Error(`Failed to create video: ${error.message}`);
  }

  return data as VideoJob;
};

/**
 * Check the status of a video generation job
 */
export const checkVideoStatus = async (videoId: string): Promise<VideoJob> => {
  const { data, error } = await supabase.functions.invoke('check-video-status', {
    body: { videoId },
  });

  if (error) {
    throw new Error(`Failed to check video status: ${error.message}`);
  }

  return data as VideoJob;
};

/**
 * Download completed video and upload to storage
 */
export const downloadAndStoreVideo = async (videoId: string): Promise<VideoResult> => {
  const { data, error } = await supabase.functions.invoke('download-video', {
    body: { videoId },
  });

  if (error) {
    throw new Error(`Failed to download video: ${error.message}`);
  }

  return data as VideoResult;
};

/**
 * Poll for video completion (checks every 10 seconds)
 */
export const pollForVideoCompletion = async (
  videoId: string,
  onProgress?: (job: VideoJob) => void
): Promise<VideoJob> => {
  const poll = async (): Promise<VideoJob> => {
    const job = await checkVideoStatus(videoId);
    
    if (onProgress) {
      onProgress(job);
    }

    if (job.status === 'completed') {
      return job;
    }

    if (job.status === 'failed') {
      throw new Error('Video generation failed');
    }

    // Wait 10 seconds before next poll
    await new Promise(resolve => setTimeout(resolve, 10000));
    return poll();
  };

  return poll();
};
