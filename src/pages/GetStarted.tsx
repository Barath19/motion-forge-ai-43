import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Upload, X, Download, Loader2, Mic, Square, Play, Volume2, LayoutGrid, ArrowLeft, History } from 'lucide-react';
import recordAudio from '@/assets/record-audio.mp3';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { resizeImageTo1280x720 } from '@/utils/imageProcessing';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
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

interface VideoHistoryItem {
  id: string;
  video_url: string;
  prompt: string;
  image_url: string | null;
  duration: string;
  model: string;
  created_at: string;
}

const soraDurations = ['4s', '8s', '12s'];
const wanDurations = ['5s', '12s'];

const GetStarted = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('8s');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [storyboardMode, setStoryboardMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'sora' | 'wan'>('sora');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { isRecording, audioBlob, startRecording, stopRecording, clearRecording } = useVoiceRecorder();
  const [isConvertingTTS, setIsConvertingTTS] = useState(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const [isPlayingRecordAudio, setIsPlayingRecordAudio] = useState(false);
  const recordAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditingAI, setIsEditingAI] = useState(false);
  const [originalImage, setOriginalImage] = useState<UploadedImage | null>(null);
  const [editedImagePreview, setEditedImagePreview] = useState<string | null>(null);
  const [videoHistory, setVideoHistory] = useState<VideoHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState(false);

  // Fetch video history on component mount
  useEffect(() => {
    fetchVideoHistory();
  }, []);

  const fetchVideoHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('videos_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideoHistory(data || []);
    } catch (error) {
      console.error('Error fetching video history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const saveVideoToHistory = async (videoUrl: string, imageUrl: string | null = null) => {
    try {
      const { error } = await supabase
        .from('videos_history')
        .insert({
          video_url: videoUrl,
          prompt: prompt,
          image_url: imageUrl,
          duration: duration,
          model: selectedModel,
        });

      if (error) throw error;
      
      // Refresh history
      await fetchVideoHistory();
    } catch (error) {
      console.error('Error saving video to history:', error);
      toast.error('Failed to save video to history');
    }
  };

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
    const newImage = {
      url,
      filename: file.name,
      file,
    };
    setUploadedImage(newImage);
    setOriginalImage(newImage); // Store original
    setEditedImagePreview(null); // Clear any preview
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
      setOriginalImage(null);
      setEditedImagePreview(null);
      toast.success('Image removed');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleGenerateVideo = async () => {
    // If storyboard mode is enabled, show loading and navigate after 15s
    if (storyboardMode) {
      setIsGeneratingStoryboard(true);
      setGenerationStatus('Generating storyboard...');
      
      // Mock 15 second loading
      await new Promise(resolve => setTimeout(resolve, 15000));
      
      setIsGeneratingStoryboard(false);
      setGenerationStatus('');
      navigate('/storyboard');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a video description');
      return;
    }
    
    if (!uploadedImage) {
      toast.error('Please upload a product image');
      return;
    }

    setIsGenerating(true);
    
    try {
      if (selectedModel === 'wan') {
        // Use RunPod Wan 2.5 API
        setGenerationStatus('Generating video with Wan 2.5...');
        
        const response = await fetch('https://api.runpod.ai/v2/wan-2-5/run', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer rpa_23OSI446GYJPN51TWZA4IZ9E0WBAB9QC5U7CAY8N1gqpqh'
          },
          body: JSON.stringify({
            input: {
              prompt: prompt,
              image: uploadedImage.url,
              negative_prompt: '',
              size: '1280*720',
              duration: parseInt(duration.replace('s', '')),
              seed: -1,
              enable_prompt_expansion: false,
              enable_safety_checker: true
            }
          })
        });

        if (!response.ok) {
          throw new Error(`RunPod API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('RunPod response:', data);
        
        // Note: You'll need to poll for completion or handle the job ID
        toast.success('Video generation job started!');
        setGenerationStatus('Job ID: ' + data.id);
        
      } else {
        // Use existing Sora workflow
        setGenerationStatus('Preparing image...');

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

        // Save to history
        await saveVideoToHistory(result.publicUrl, uploadedImage?.url || null);

        toast.success('Video generated successfully!');
        setGenerationStatus('Complete!');
      }
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

  const handleStopRecording = async () => {
    // If audio is playing, stop it
    if (isPlayingRecordAudio && recordAudioRef.current) {
      recordAudioRef.current.pause();
      recordAudioRef.current.currentTime = 0;
      setIsPlayingRecordAudio(false);
      toast.success('Playback stopped');
      return;
    }
    
    // Otherwise, stop recording and play the audio
    stopRecording();
    toast.success('Recording stopped');
    
    // Play the uploaded audio file after stopping recording
    if (!recordAudioRef.current) {
      recordAudioRef.current = new Audio(recordAudio);
      recordAudioRef.current.onended = () => {
        setIsPlayingRecordAudio(false);
      };
    }
    
    try {
      setIsPlayingRecordAudio(true);
      await recordAudioRef.current.play();
    } catch (error) {
      setIsPlayingRecordAudio(false);
      console.error('Failed to play audio:', error);
    }
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

  const handleEditImage = async () => {
    if (!uploadedImage || !editPrompt.trim()) {
      toast.error('Please enter an edit instruction');
      return;
    }

    setIsEditingAI(true);
    try {
      console.log('Starting image edit...');
      
      // Convert blob URL to base64
      const response = await fetch(uploadedImage.url);
      const blob = await response.blob();
      const reader = new FileReader();
      
      const base64Image = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      console.log('Image converted to base64');
      
      const { data, error } = await supabase.functions.invoke('edit-image', {
        body: { 
          imageUrl: base64Image,
          prompt: editPrompt 
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to edit image');
      }

      if (!data?.imageUrl) {
        throw new Error('No edited image returned');
      }

      console.log('Image edited successfully');
      
      // Show preview in dialog
      setEditedImagePreview(data.imageUrl);
      toast.success('Image edited! Review and save or revert.');
      setEditPrompt('');
    } catch (error) {
      console.error('Error editing image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to edit image');
    } finally {
      setIsEditingAI(false);
    }
  };

  const handleSaveEditedImage = async () => {
    if (!editedImagePreview) return;

    try {
      // Convert base64 to blob and create object URL
      const base64Response = await fetch(editedImagePreview);
      const blob = await base64Response.blob();
      const newFile = new File([blob], 'edited-image.png', { type: 'image/png' });
      const newUrl = URL.createObjectURL(blob);

      // Clean up old URL (but keep original)
      if (uploadedImage && uploadedImage.url !== originalImage?.url) {
        URL.revokeObjectURL(uploadedImage.url);
      }

      setUploadedImage({
        url: newUrl,
        filename: 'edited-image.png',
        file: newFile,
      });

      toast.success('Edited image saved!');
      setIsEditingImage(false);
      setEditedImagePreview(null);
    } catch (error) {
      console.error('Error saving edited image:', error);
      toast.error('Failed to save edited image');
    }
  };

  const handleRevertToOriginal = () => {
    if (!originalImage) return;

    // Clean up edited image URL
    if (uploadedImage && uploadedImage.url !== originalImage.url) {
      URL.revokeObjectURL(uploadedImage.url);
    }

    setUploadedImage(originalImage);
    setEditedImagePreview(null);
    toast.success('Reverted to original image');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground">
      {/* Storyboard Generation Overlay */}
      {isGeneratingStoryboard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">Generating Storyboard</h3>
            <p className="text-muted-foreground">Creating your scenes...</p>
          </div>
        </div>
      )}

      <main className="relative">
        {/* Header */}
        <div className="border-b border-border bg-[#0f0f0f] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="gap-2"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-medium text-foreground/90 flex items-center gap-3">
                  <Select 
                    value={selectedModel} 
                    onValueChange={(value: 'sora' | 'wan') => {
                      setSelectedModel(value);
                      // Reset duration to first option of new model
                      setDuration(value === 'wan' ? '5s' : '8s');
                    }}
                  >
                    <SelectTrigger className="w-[200px] bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="sora">OpenAI / SORA 2 Pro</SelectItem>
                      <SelectItem value="wan">Wan 2.5 (RunPod)</SelectItem>
                    </SelectContent>
                  </Select>
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {selectedModel === 'sora' 
                    ? "OpenAI's Sora 2 Pro is new state of the art video and audio generation model."
                    : "Wan 2.5 by RunPod - Fast and efficient video generation."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 min-h-[calc(100vh-88px)]">
          {/* Left Column - Input */}
          <div className="border-r border-border bg-[#0f0f0f] p-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">Input</h2>
              
              <div className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Image</label>
                  <p className="text-xs text-muted-foreground">
                    Drag and drop file(s) or provide a base64 encoded data URL
                  </p>
                  
                  {uploadedImage ? (
                    <div 
                      className="relative w-32 h-32 rounded-lg border border-border bg-card overflow-hidden group cursor-pointer"
                      onClick={() => !isGenerating && setIsEditingImage(true)}
                    >
                      <img
                        src={uploadedImage.url}
                        alt={uploadedImage.filename}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <p className="text-white text-xs font-medium text-center px-2">Click to edit</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        className="absolute top-1 right-1 rounded p-1 bg-destructive hover:bg-destructive/90 transition-colors z-10"
                        disabled={isGenerating}
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={handleUploadClick}
                      className={cn(
                        "relative w-32 h-32 rounded-lg border-2 border-dashed transition-all cursor-pointer",
                        isDragging
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                      )}
                    >
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="text-center">
                          <Upload className="mx-auto h-6 w-6 text-muted-foreground/40 mb-1" />
                          <p className="text-xs text-muted-foreground">
                            Upload
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

                {/* Prompt */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Prompt</label>
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
                    className="min-h-[140px] resize-none bg-card border-border text-foreground"
                    disabled={isGenerating}
                  />
                  {audioBlob && (
                    <div className="flex items-center gap-2 p-2 rounded bg-card border border-border">
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
                    <div className="flex items-center gap-2 p-2 rounded bg-card border border-border">
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

                {/* Storyboard Toggle */}
                <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                  <div className="flex-1">
                    <Label htmlFor="storyboard-mode" className="text-sm font-medium text-foreground">
                      Storyboard Mode
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enable to organize scenes before generating video
                    </p>
                  </div>
                  <Switch
                    id="storyboard-mode"
                    checked={storyboardMode}
                    onCheckedChange={setStoryboardMode}
                    disabled={isGenerating}
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Duration</label>
                  <p className="text-xs text-muted-foreground">Duration in seconds</p>
                  <div className="flex gap-2">
                    {(selectedModel === 'wan' ? wanDurations : soraDurations).map((d) => (
                      <Button
                        key={d}
                        variant={duration === d ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDuration(d)}
                        disabled={isGenerating}
                        className={cn("min-w-[60px]", duration === d && "shadow-lg ring-1 ring-primary/20")}
                      >
                        {d}
                      </Button>
                    ))}
                  </div>
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
                    disabled={isGenerating || isGeneratingStoryboard || !uploadedImage || !prompt.trim()}
                    className="flex-1"
                  >
                    {isGenerating || isGeneratingStoryboard ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      'Run'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Result */}
          <div className="bg-[#0a0a0a] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-medium text-muted-foreground">Result</h2>
                {(isGenerating || isGeneratingStoryboard) && (
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
              <TabsList className="bg-card border border-border mb-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
                <TabsTrigger value="history">
                  <History className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-0">
                <div className="rounded-lg border border-border bg-[#0f0f0f] overflow-hidden min-h-[500px] flex items-center justify-center">
                  {generatedVideo ? (
                    <video
                      src={generatedVideo.url}
                      controls
                      className="w-full"
                      autoPlay
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (isGenerating || isGeneratingStoryboard) ? (
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
                <div className="rounded-lg border border-border bg-[#0f0f0f] p-4 min-h-[500px]">
                  <pre className="text-xs text-muted-foreground">
                    {generatedVideo ? JSON.stringify(generatedVideo, null, 2) : '{}'}
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-0">
                <div className="rounded-lg border border-border bg-[#0f0f0f] p-4 min-h-[500px]">
                  {isLoadingHistory ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : videoHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                      <p className="text-sm text-muted-foreground">No videos in history yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {videoHistory.map((item) => (
                        <div key={item.id} className="rounded-lg border border-border bg-card overflow-hidden">
                          <video
                            src={item.video_url}
                            controls
                            className="w-full aspect-video"
                          />
                          <div className="p-3 space-y-2">
                            <p className="text-sm text-foreground line-clamp-2">{item.prompt}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="px-2 py-0.5 rounded bg-background">
                                {item.model === 'sora' ? 'SORA 2' : 'Wan 2.5'}
                              </span>
                              <span>{item.duration}</span>
                              <span>•</span>
                              <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                            <a
                              href={item.video_url}
                              download
                              className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
                            >
                              <Download className="h-3 w-3" />
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* AI Image Edit Dialog */}
        <Dialog open={isEditingImage} onOpenChange={setIsEditingImage}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Image with AI</DialogTitle>
              <DialogDescription>
                Describe how you want to modify the image, then save or revert to original
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Original Image */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Original</p>
                  {originalImage && (
                    <div className="aspect-square rounded-lg overflow-hidden border border-border">
                      <img
                        src={originalImage.url}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                
                {/* Edited Preview */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {editedImagePreview ? 'Edited' : 'Current'}
                  </p>
                  <div className="aspect-square rounded-lg overflow-hidden border border-border">
                    {editedImagePreview ? (
                      <img
                        src={editedImagePreview}
                        alt="Edited"
                        className="w-full h-full object-cover"
                      />
                    ) : uploadedImage ? (
                      <img
                        src={uploadedImage.url}
                        alt="Current"
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                </div>
              </div>

              <Textarea
                placeholder="e.g., Make it more colorful, add snow, change to sunset lighting..."
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={isEditingAI}
              />
              
              <div className="flex gap-3">
                {editedImagePreview ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleRevertToOriginal}
                      disabled={isEditingAI}
                      className="flex-1"
                    >
                      Revert to Original
                    </Button>
                    <Button
                      onClick={handleSaveEditedImage}
                      className="flex-1"
                    >
                      Save Edited Image
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingImage(false);
                        setEditPrompt('');
                      }}
                      disabled={isEditingAI}
                      className="flex-1"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={handleEditImage}
                      disabled={isEditingAI || !editPrompt.trim()}
                      className="flex-1"
                    >
                      {isEditingAI ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Editing...
                        </>
                      ) : (
                        'Edit Image'
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default GetStarted;
