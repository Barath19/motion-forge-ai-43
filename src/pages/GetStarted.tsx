import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Upload, X, Video, Loader2, Check, Info, Lightbulb } from 'lucide-react';
import GradientBackdrop from '@/components/GradientBackdrop';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { resizeImageTo1280x720 } from '@/utils/imageProcessing';
import { 
  createVideoJob, 
  pollForVideoCompletion, 
  downloadAndStoreVideo,
  type VideoJob 
} from '@/utils/videoGeneration';

interface UploadedImage {
  url: string;
  filename: string;
  file: File;
}

interface GeneratedVideo {
  id: string;
  url: string;
  jobId: string;
}

const quickSuggestions = [
  'Smooth rotation',
  'Dynamic zoom',
  'Studio lighting',
  'Premium feel',
  'Cinematic angles',
  'Slow motion',
];

const GetStarted = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFiles = (files: FileList) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const file = files[0];
    
    if (!file) return;
    
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or WebP image');
      return;
    }
    
    if (file.size > maxSize) {
      toast.error('Image must be less than 10MB');
      return;
    }

    const url = URL.createObjectURL(file);
    setUploadedImage({
      url,
      filename: file.name,
      file,
    });
    toast.success('Image uploaded successfully');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage.url);
      setUploadedImage(null);
      toast.success('Image removed');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const addSuggestionToPrompt = (suggestion: string) => {
    if (prompt.trim()) {
      setPrompt(prev => `${prev}, ${suggestion.toLowerCase()}`);
    } else {
      setPrompt(suggestion.toLowerCase());
    }
  };

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a video description');
      return;
    }
    
    if (!uploadedImage) {
      toast.error('Please upload a product image');
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('Preparing image...');

    try {
      const resizedImage = await resizeImageTo1280x720(uploadedImage.file);
      
      setGenerationStatus('Creating video job...');
      const job = await createVideoJob({
        prompt,
        image: resizedImage,
      });

      toast.success(`Video job created: ${job.id}`);
      setGenerationStatus(`Generating video... (${job.status})`);

      const completedJob = await pollForVideoCompletion(job.id, (currentJob: VideoJob) => {
        setGenerationStatus(`Generating video... ${currentJob.status} ${currentJob.progress ? `(${currentJob.progress}%)` : ''}`);
      });

      setGenerationStatus('Downloading and saving video...');
      const result = await downloadAndStoreVideo(completedJob.id);

      setGeneratedVideo({
        id: result.videoId,
        url: result.publicUrl,
        jobId: completedJob.id,
      });

      toast.success('Video generated successfully!');
      setGenerationStatus('Complete!');
    } catch (error) {
      console.error('Error generating video:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate video');
      setGenerationStatus('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GradientBackdrop variant="section" />
      <main className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr,1fr]">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">1. Upload Product Image</h2>
                  <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                    Required
                  </span>
                </div>
                
                <div
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleUploadClick}
                  className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all ${
                    isDragging
                      ? 'border-primary bg-primary/5 scale-[0.98]'
                      : uploadedImage
                      ? 'border-primary/30 bg-muted/30'
                      : 'border-muted-foreground/30 bg-muted/20 cursor-pointer hover:border-primary/50 hover:bg-muted/40'
                  }`}
                  style={{ minHeight: '280px' }}
                >
                  {uploadedImage ? (
                    <div className="relative h-full min-h-[280px]">
                      <img
                        src={uploadedImage.url}
                        alt={uploadedImage.filename}
                        className="h-full w-full object-contain"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        className="absolute right-3 top-3 rounded-full bg-background/90 p-2 shadow-lg transition-all hover:bg-destructive hover:text-destructive-foreground"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-full min-h-[280px] flex-col items-center justify-center p-8 text-center">
                      <Upload className="mb-4 h-12 w-12 text-muted-foreground/40" />
                      <p className="mb-2 text-base font-medium text-foreground">
                        Drop your image here or{' '}
                        <span className="text-primary">browse</span>
                      </p>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Will be auto-resized to 1280 x 720px
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="h-3.5 w-3.5" />
                        <span>Supports: JPG, PNG, WebP (Max 10MB)</span>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              </motion.div>

              {/* Video Description Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">2. Video Description</h2>
                  <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                    Required
                  </span>
                </div>

                <div className="space-y-3">
                  <label htmlFor="prompt" className="text-sm font-medium text-muted-foreground">
                    Prompt
                  </label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe your product teaser video... e.g., 'A sleek smartwatch rotating slowly to showcase its features, with dynamic lighting highlighting the display'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    maxLength={500}
                    className="min-h-[140px] resize-none"
                    disabled={isGenerating}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <p className="text-muted-foreground">
                      Be specific about movements, angles, and visual effects
                    </p>
                    <p className="text-muted-foreground">
                      {prompt.length} / 500
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Quick Suggestions</p>
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => addSuggestionToPrompt(suggestion)}
                        disabled={isGenerating}
                        className="rounded-full text-xs"
                      >
                        + {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleGenerateVideo}
                  disabled={isGenerating || !uploadedImage || !prompt.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Video className="mr-2 h-5 w-5" />
                      Generate Video
                    </>
                  )}
                </Button>

                {generationStatus && (
                  <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
                    <p className="text-sm">{generationStatus}</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Video Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-semibold">Video Preview</h2>
                
                {generatedVideo ? (
                  <div className="overflow-hidden rounded-2xl border border-border bg-muted/20">
                    <video
                      src={generatedVideo.url}
                      controls
                      className="w-full"
                      autoPlay
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="space-y-3 p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Video ID: {generatedVideo.id}</span>
                      </div>
                      <a
                        href={generatedVideo.url}
                        download
                        className="block w-full"
                      >
                        <Button variant="outline" className="w-full">
                          Download Video
                        </Button>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/10 p-8">
                    <Video className="mb-4 h-16 w-16 text-muted-foreground/30" />
                    <p className="text-center text-sm text-muted-foreground">
                      Your generated video will appear here
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Pro Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="space-y-4 rounded-xl border border-border bg-muted/10 p-6"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Pro Tips</h3>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>Use high-quality product images with clean backgrounds</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>Be specific about camera movements and lighting</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>Include emotional keywords to enhance the mood</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>Generation typically takes 2-5 minutes depending on complexity</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GetStarted;
