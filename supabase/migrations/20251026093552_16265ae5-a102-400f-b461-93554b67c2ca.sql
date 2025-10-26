-- Create videos_history table to store generated videos
CREATE TABLE public.videos_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  image_url TEXT,
  duration TEXT NOT NULL,
  model TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.videos_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view all videos (public history)
CREATE POLICY "Anyone can view videos history" 
ON public.videos_history 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to insert videos
CREATE POLICY "Anyone can create videos history" 
ON public.videos_history 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_videos_history_created_at ON public.videos_history(created_at DESC);