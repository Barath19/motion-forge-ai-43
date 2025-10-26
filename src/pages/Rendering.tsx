import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle2, Loader2, Play, Download, ArrowLeft } from 'lucide-react';

interface Scene {
  id: number;
  height: string;
  content: string;
  image: string;
  originalImage: string;
  name: string;
  seconds: number;
  prompt: string;
}

interface CompletedVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  completedAt: string;
  videoUrl: string;
}

const mockCompletedVideos: CompletedVideo[] = [
  {
    id: '1',
    title: 'RunPod Commercial - Final Edit',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop',
    duration: '1:36',
    completedAt: '2 hours ago',
    videoUrl: '#'
  },
  {
    id: '2',
    title: 'Product Demo v2',
    thumbnail: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=450&fit=crop',
    duration: '2:14',
    completedAt: '1 day ago',
    videoUrl: '#'
  },
  {
    id: '3',
    title: 'Max Adventures Episode 1',
    thumbnail: 'https://images.unsplash.com/photo-1574267432644-f610f5f6b2d5?w=800&h=450&fit=crop',
    duration: '1:48',
    completedAt: '3 days ago',
    videoUrl: '#'
  }
];

const Rendering = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scenes = (location.state?.scenes as Scene[]) || [];
  const [processingIndex, setProcessingIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(150); // 2.5 minutes in seconds

  useEffect(() => {
    if (processingIndex >= scenes.length) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Move to next scene
          setProcessingIndex((idx) => idx + 1);
          return 150; // Reset timer for next scene
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [processingIndex, scenes.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSceneStatus = (index: number) => {
    if (index < processingIndex) return 'completed';
    if (index === processingIndex) return 'processing';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        <Button 
          variant="ghost" 
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Video Rendering
          </h1>
          <p className="text-lg text-muted-foreground">
            Your scenes are being processed
          </p>
        </div>

        <Tabs defaultValue="rendering" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="rendering">Rendering Queue</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="rendering">
            <div className="space-y-4">
              {scenes.map((scene, index) => {
                const status = getSceneStatus(index);
                return (
                  <Card key={scene.id} className="border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                      <div className="space-y-1">
                        <CardTitle className="text-xl flex items-center gap-3">
                          {scene.content}
                          <Badge variant="outline" className="font-mono text-xs">
                            {scene.name}
                          </Badge>
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{scene.seconds} seconds</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {status === 'completed' ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                              Complete
                            </Badge>
                          </>
                        ) : status === 'processing' ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            <Badge>Processing</Badge>
                          </>
                        ) : (
                          <>
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <Badge variant="outline">Queued</Badge>
                          </>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4">
                        <img 
                          src={scene.image} 
                          alt={scene.content}
                          className="w-32 h-32 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium mb-2 text-sm text-muted-foreground">Prompt:</h4>
                          <p className="text-sm text-foreground leading-relaxed">
                            {scene.prompt}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {scenes.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground">No scenes to render</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCompletedVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden border-border/50 hover:border-primary/50 transition-colors">
                  <div className="relative aspect-video">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="icon" variant="secondary" className="rounded-full">
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                    <Badge className="absolute bottom-2 right-2 bg-black/70">
                      {video.duration}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {video.completedAt}
                    </span>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Rendering;
