import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Upload, X, Download, Loader2, Mic, Square, Play, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { resizeImageTo1280x720 } from '@/utils/imageProcessing';
import { 
  createVideoJob, 
  pollForVideoCompletion, 
  downloadAndStoreVideo,
  type VideoJob 
} from '@/utils/videoGeneration';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { convertTextToSpeech } from '@/utils/elevenLabsTTS';

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

const durations = ['4s', '8s', '12s'];

const GetStarted = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('8s');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { isRecording, audioBlob, startRecording, stopRecording, clearRecording } = useVoiceRecorder();
  const [isConvertingTTS, setIsConvertingTTS] = useState(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);

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

  const handleStartRecording = async () => {
    try {
      await startRecording();
      toast.success('Recording started');
    } catch (error) {
      toast.error('Failed to start recording. Please allow microphone access.');
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    toast.success('Recording stopped');
  };

  const handleConvertToSpeech = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter text to convert to speech');
      return;
    }

    setIsConvertingTTS(true);
    try {
      const audioBlob = await convertTextToSpeech(prompt);
      const url = URL.createObjectURL(audioBlob);
      setTtsAudioUrl(url);
      toast.success('Text converted to speech!');
    } catch (error) {
      console.error('Error converting to speech:', error);
      toast.error('Failed to convert text to speech');
    } finally {
      setIsConvertingTTS(false);
    }
  };

  const handlePlayTTS = () => {
    if (ttsAudioUrl && audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground">
      <main className="relative">
        {/* Header */}
        <div className="border-b border-border/10 bg-[#0f0f0f] px-6 py-4">
          <h1 className="text-lg font-medium text-foreground/90">OpenAI / SORA 2 Pro I2V</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            OpenAI's Sora 2 Pro is new state of the art video and audio generation model.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 min-h-[calc(100vh-88px)]">
          {/* Left Column - Input */}
          <div className="border-r border-border/10 bg-[#0f0f0f] p-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">Input</h2>
              
              <Tabs defaultValue="playground" className="mb-6">
                <TabsList className="bg-background/50">
                  <TabsTrigger value="playground">API Playground</TabsTrigger>
                  <TabsTrigger value="logs">Session logs</TabsTrigger>
                </TabsList>
                <TabsContent value="playground" className="space-y-6 mt-6">
                  {/* Prompt */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground/90">Prompt</label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={isRecording ? handleStopRecording : handleStartRecording}
                          disabled={isGenerating}
                          className="h-8"
                        >
                          {isRecording ? (
                            <>
                              <Square className="h-3 w-3 mr-1 fill-current" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Mic className="h-3 w-3 mr-1" />
                              Record
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleConvertToSpeech}
                          disabled={isGenerating || isConvertingTTS || !prompt.trim()}
                          className="h-8"
                        >
                          {isConvertingTTS ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Converting...
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3 w-3 mr-1" />
                              TTS
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      placeholder="Describe your video scene..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      maxLength={500}
                      className="min-h-[140px] resize-none bg-background border-border/20 text-foreground"
                      disabled={isGenerating}
                    />
                    {audioBlob && (
                      <div className="flex items-center gap-2 p-2 rounded bg-background/50 border border-border/20">
                        <audio src={URL.createObjectURL(audioBlob)} controls className="flex-1 h-8" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearRecording}
                          className="h-8 px-2"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    {ttsAudioUrl && (
                      <div className="flex items-center gap-2 p-2 rounded bg-background/50 border border-border/20">
                        <audio ref={audioRef} src={ttsAudioUrl} className="hidden" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePlayTTS}
                          className="h-8"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Play TTS
                        </Button>
                        <audio src={ttsAudioUrl} controls className="flex-1 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/90">Duration</label>
                    <p className="text-xs text-muted-foreground">Duration in seconds</p>
                    <div className="flex gap-2">
                      {durations.map((d) => (
                        <Button
                          key={d}
                          variant={duration === d ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDuration(d)}
                          disabled={isGenerating}
                          className="min-w-[60px]"
                        >
                          {d}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/90">Image</label>
                    <p className="text-xs text-muted-foreground">
                      Drag and drop file(s) or provide a base64 encoded data URL
                    </p>
                    
                    {uploadedImage ? (
                      <div className="relative flex items-center gap-3 rounded-lg border border-border/20 bg-background p-3">
                        <img
                          src={uploadedImage.url}
                          alt={uploadedImage.filename}
                          className="h-12 w-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground/80 truncate">{uploadedImage.filename}</p>
                        </div>
                        <button
                          onClick={handleRemoveImage}
                          className="rounded p-1 hover:bg-destructive/10 transition-colors"
                          disabled={isGenerating}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleUploadClick}
                        className={`relative rounded-lg border-2 border-dashed transition-all cursor-pointer ${
                          isDragging
                            ? 'border-primary bg-primary/5'
                            : 'border-border/30 bg-background hover:border-border/50'
                        }`}
                      >
                        <div className="flex items-center justify-center p-8">
                          <div className="text-center">
                            <Upload className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Enter URL or base64 data
                            </p>
                          </div>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleFileInput}
                          className="hidden"
                        />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      jpeg, jpg, png up to 15 MB (single file)
                    </p>
                  </div>

                  {/* Additional Settings */}
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-foreground/90 flex items-center justify-between py-2 hover:text-foreground transition-colors">
                      Additional settings
                      <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="mt-3 text-sm text-muted-foreground">
                      Advanced options coming soon...
                    </div>
                  </details>

                  {/* Cost Info */}
                  <div className="rounded-lg border border-border/20 bg-background/50 px-4 py-3">
                    <p className="text-sm text-green-500/80 flex items-center gap-2">
                      <span className="text-lg">$</span>
                      A video generation will cost $1.20
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPrompt('');
                        setDuration('8s');
                        setUploadedImage(null);
                        setGeneratedVideo(null);
                        setGenerationStatus('');
                      }}
                      disabled={isGenerating}
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={handleGenerateVideo}
                      disabled={isGenerating || !uploadedImage || !prompt.trim()}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Running...
                        </>
                      ) : (
                        'Run'
                      )}
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="logs">
                  <p className="text-sm text-muted-foreground">No session logs yet</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column - Result */}
          <div className="bg-[#0a0a0a] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-medium text-muted-foreground">Result</h2>
                {isGenerating && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-500">Running</span>
                  </div>
                )}
              </div>
              {generatedVideo && (
                <a
                  href={generatedVideo.url}
                  download
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download video
                </a>
              )}
            </div>

            <Tabs defaultValue="preview">
              <TabsList className="bg-background/50 mb-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-0">
                <div className="rounded-lg border border-border/10 bg-[#0f0f0f] overflow-hidden min-h-[500px] flex items-center justify-center">
                  {generatedVideo ? (
                    <video
                      src={generatedVideo.url}
                      controls
                      className="w-full"
                      autoPlay
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : isGenerating ? (
                    <div className="text-center p-12">
                      <div className="inline-block mb-4">
                        <svg className="w-16 h-16 text-muted-foreground/20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/>
                          <path d="M3 9h18M9 3v18" strokeWidth="1.5"/>
                        </svg>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">Generating video...</p>
                      {generationStatus && (
                        <p className="text-xs text-muted-foreground/60 mb-4">{generationStatus}</p>
                      )}
                      <div className="max-w-md mx-auto">
                        <div className="h-1 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-primary animate-pulse w-1/3" style={{ transition: 'width 0.3s' }} />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground/40 mt-4">
                        Bored? <span className="text-primary/60">Enable Subway Surfer mode...</span>
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-12">
                      <div className="inline-block mb-4">
                        <svg className="w-16 h-16 text-muted-foreground/20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/>
                          <path d="M3 9h18M9 3v18" strokeWidth="1.5"/>
                        </svg>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your generated video will appear here
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="json">
                <div className="rounded-lg border border-border/10 bg-[#0f0f0f] p-4 min-h-[500px]">
                  <pre className="text-xs text-muted-foreground">
                    {generatedVideo ? JSON.stringify(generatedVideo, null, 2) : '{}'}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GetStarted;
