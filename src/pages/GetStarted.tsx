import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Upload, X, Video, Loader2 } from 'lucide-react';
import GradientBackdrop from '@/components/GradientBackdrop';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { resizeImageTo1280x720 } from '@/utils/imageProcessing';
import { 
  createVideoJob, 
  pollForVideoCompletion, 
  downloadAndStoreVideo,
  type VideoJob 
} from '@/utils/videoGeneration';

interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  file: File;
}

interface GeneratedVideo {
  id: string;
  url: string;
  jobId: string;
}

const GetStarted = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [includeProductDemo, setIncludeProductDemo] = useState(false);
  const [includeCallToAction, setIncludeCallToAction] = useState(false);
  const [includeBranding, setIncludeBranding] = useState(false);
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
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const newImages: UploadedImage[] = [];

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image type`);
        return;
      }

      const url = URL.createObjectURL(file);
      const image: UploadedImage = {
        id: `${Date.now()}-${Math.random()}`,
        url,
        filename: file.name,
        size: file.size,
        file,
      };
      newImages.push(image);
    });

    if (newImages.length > 0) {
      setImages((prev) => [...prev, ...newImages]);
      toast.success(`${newImages.length} image${newImages.length > 1 ? 's' : ''} uploaded`);
      
      // Auto-select first image if none selected
      if (!selectedImageId && newImages.length > 0) {
        setSelectedImageId(newImages[0].id);
      }
    }
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

  const handleDelete = (id: string) => {
    setImages((prev) => {
      const imageToDelete = prev.find((img) => img.id === id);
      if (imageToDelete) {
        URL.revokeObjectURL(imageToDelete.url);
      }
      if (selectedImageId === id) {
        setSelectedImageId(null);
      }
      return prev.filter((img) => img.id !== id);
    });
    toast.success('Image deleted');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for your video');
      return;
    }

    const selectedImage = images.find((img) => img.id === selectedImageId);
    
    if (!selectedImage) {
      toast.error('Please select an image for the video reference');
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('Preparing image...');

    try {
      // Resize image to 1280x720
      const resizedImage = await resizeImageTo1280x720(selectedImage.file);
      
      // Build enhanced prompt with selected elements
      let enhancedPrompt = prompt;
      if (includeProductDemo) {
        enhancedPrompt += ' Include dynamic product demonstration shots.';
      }
      if (includeCallToAction) {
        enhancedPrompt += ' End with an engaging call-to-action.';
      }
      if (includeBranding) {
        enhancedPrompt += ' Maintain consistent branding throughout.';
      }

      setGenerationStatus('Creating video job...');
      
      // Create video job
      const job = await createVideoJob({
        prompt: enhancedPrompt,
        image: resizedImage,
      });

      toast.success(`Video job created: ${job.id}`);
      setGenerationStatus(`Generating video... (${job.status})`);

      // Poll for completion
      const completedJob = await pollForVideoCompletion(job.id, (currentJob: VideoJob) => {
        setGenerationStatus(`Generating video... ${currentJob.status} ${currentJob.progress ? `(${currentJob.progress}%)` : ''}`);
      });

      setGenerationStatus('Downloading and saving video...');
      
      // Download and store video
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
    <div className="min-h-screen bg-black text-white">
      <GradientBackdrop variant="section" />
      <main className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="mb-4 text-5xl font-bold">Video Studio</h1>
            <p className="text-xl text-white/80">Create product teaser videos with AI</p>
            {images.length > 0 && (
              <p className="mt-2 text-sm text-white/60">{images.length} image{images.length > 1 ? 's' : ''} uploaded</p>
            )}
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Image Upload */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">1. Upload Reference Image</h2>
              
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="aspect-square"
                >
                  <div
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleUploadClick}
                    className={`flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 ${
                      isDragging
                        ? 'border-primary bg-primary/10 scale-[1.02]'
                        : 'border-white/20 bg-white/5 hover:border-primary/50 hover:bg-white/10'
                    }`}
                  >
                    <Upload className="mb-2 h-8 w-8 text-white/60" />
                    <p className="text-xs font-medium text-white/80">Upload</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>
                </motion.div>

                {images.length > 0 && (
                  <AnimatePresence>
                    {images.map((image) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedImageId(image.id)}
                        className={`group relative aspect-square overflow-hidden rounded-xl cursor-pointer transition-all ${
                          selectedImageId === image.id
                            ? 'ring-4 ring-primary bg-primary/20'
                            : 'bg-white/5 hover:ring-2 hover:ring-white/30'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={image.filename}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/40" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(image.id);
                          }}
                          className="absolute right-1 top-1 rounded-full bg-black/70 p-1.5 opacity-0 transition-all duration-300 hover:bg-red-500 group-hover:opacity-100"
                          aria-label="Delete image"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                        {selectedImageId === image.id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="rounded-full bg-primary p-2">
                              <Video className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Right Column - Video Generation Form */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">2. Configure Your Video</h2>
              
              <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-lg">Video Description</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe your product teaser video... (e.g., 'A sleek smartphone floating in space with dynamic lighting')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] bg-black/50 border-white/20 text-white placeholder:text-white/40"
                    disabled={isGenerating}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base">Video Elements</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="product-demo"
                        checked={includeProductDemo}
                        onCheckedChange={(checked) => setIncludeProductDemo(checked as boolean)}
                        disabled={isGenerating}
                      />
                      <label htmlFor="product-demo" className="text-sm text-white/80 cursor-pointer">
                        Include product demonstration
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="call-to-action"
                        checked={includeCallToAction}
                        onCheckedChange={(checked) => setIncludeCallToAction(checked as boolean)}
                        disabled={isGenerating}
                      />
                      <label htmlFor="call-to-action" className="text-sm text-white/80 cursor-pointer">
                        Add call-to-action ending
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="branding"
                        checked={includeBranding}
                        onCheckedChange={(checked) => setIncludeBranding(checked as boolean)}
                        disabled={isGenerating}
                      />
                      <label htmlFor="branding" className="text-sm text-white/80 cursor-pointer">
                        Maintain consistent branding
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <p className="text-xs text-white/60">
                    • 12 seconds duration<br />
                    • 1280x720 landscape format<br />
                    • Powered by OpenAI Sora 2
                  </p>
                </div>

                <Button
                  onClick={handleGenerateVideo}
                  disabled={isGenerating || !selectedImageId || !prompt.trim()}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
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
                    <p className="text-sm text-white/90">{generationStatus}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Generated Video Display */}
          {generatedVideo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-12"
            >
              <h2 className="mb-6 text-3xl font-semibold">Generated Video</h2>
              <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/5 p-4">
                <video
                  src={generatedVideo.url}
                  controls
                  className="w-full rounded-lg"
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-white/60">Video ID: {generatedVideo.id}</p>
                  <a
                    href={generatedVideo.url}
                    download
                    className="text-sm text-primary hover:underline"
                  >
                    Download Video
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GetStarted;
