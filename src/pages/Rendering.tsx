import { useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Loader2 } from 'lucide-react';

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

const Rendering = () => {
  const location = useLocation();
  const scenes = (location.state?.scenes as Scene[]) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Video Rendering
          </h1>
          <p className="text-lg text-muted-foreground">
            Your scenes are queued for processing
          </p>
        </div>

        <div className="space-y-4">
          {scenes.map((scene, index) => (
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
                  {index === 0 ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <Badge>Processing</Badge>
                    </>
                  ) : index === 1 || index === 2 ? (
                    <>
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <Badge variant="secondary">Queued</Badge>
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <Badge variant="outline">Pending</Badge>
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
          ))}
        </div>

        {scenes.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No scenes to render</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Rendering;
