import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import scene1 from '@/assets/storyboard/scene-1.jpg';
import scene2 from '@/assets/storyboard/scene-2.jpeg';
import scene3 from '@/assets/storyboard/scene-3.jpg';
import scene4 from '@/assets/storyboard/scene-4.jpeg';
import scene5 from '@/assets/storyboard/scene-5.jpeg';
import scene6 from '@/assets/storyboard/scene-6.jpeg';
import scene7 from '@/assets/storyboard/scene-7.jpeg';
import scene8 from '@/assets/storyboard/scene-8.jpeg';

interface Scene {
  id: number;
  height: string;
  content: string;
  image: string;
  name: string;
  seconds: number;
  prompt: string;
}

const Storyboard = () => {
  const [tiles, setTiles] = useState<Scene[]>([
    { 
      id: 1, height: 'h-64', content: 'Scene 1', image: scene1,
      name: 'scene01_intro', seconds: 12,
      prompt: 'Pixar-quality intro: inside a bustling open-plan office of colorful monsters that share a cohesive cartoony style. Max, a chubby purple monster in a pinstripe vest and tie, types furiously on an outdated beige keyboard.'
    },
    { 
      id: 2, height: 'h-80', content: 'Scene 2', image: scene2,
      name: 'scene02_breakdown', seconds: 12,
      prompt: 'Close-ups of Max\'s ancient hardware struggling: dusty fans wheeze, loading bars crawl, a retro printer spits out a page that reads "you cannot train, deploy the model on this."'
    },
    { 
      id: 3, height: 'h-72', content: 'Scene 3', image: scene3,
      name: 'scene03_discovery', seconds: 12,
      prompt: 'Moody hallway transition as Max trudges slowly, feet heavy, until a glowing white cube with purple light floats between his legs. The cube rotates, lid lifting to reveal a radiant key engraved "RunPod."'
    },
    { 
      id: 4, height: 'h-96', content: 'Scene 4', image: scene4,
      name: 'scene04_transformation', seconds: 12,
      prompt: 'Energetic montage back at Max\'s desk powered by the RunPod cube. High-tech holographic monitors blaze, renders complete instantly, coworkers cheer and high-five while vibrant analytics swirl around.'
    },
    { 
      id: 5, height: 'h-64', content: 'Scene 5', image: scene5,
      name: 'scene05_discovery_detail', seconds: 12,
      prompt: 'Close-up of Max examining the glowing RunPod cube with wonder, purple reflections dancing across his expressive face as magical particles float in the air around him.'
    },
    { 
      id: 6, height: 'h-88', content: 'Scene 6', image: scene6,
      name: 'scene06_typing', seconds: 12,
      prompt: 'Dynamic shot of Max\'s hands typing rapidly on keyboard with renewed energy, holographic code and data streams flowing around, purple and blue lighting creating an energetic atmosphere.'
    },
    { 
      id: 7, height: 'h-72', content: 'Scene 7', image: scene7,
      name: 'scene07_presentation', seconds: 12,
      prompt: 'Wide shot of elegant office with Max standing confidently, papers and documents visible, warm sunlight streaming through windows, professional business atmosphere with monster coworkers in background.'
    },
    { 
      id: 8, height: 'h-80', content: 'Scene 8', image: scene8,
      name: 'scene08_victory', seconds: 12,
      prompt: 'Triumphant conference room finale. Max presents crisp printouts to an applauding monster team seated around a reflective glass table. Sunlight floods the room as the team erupts in cheers.'
    },
  ]);

  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedSeconds, setEditedSeconds] = useState(12);
  const [editedPrompt, setEditedPrompt] = useState('');
  const [changeInstruction, setChangeInstruction] = useState('');
  const [showChangeMode, setShowChangeMode] = useState(false);

  const handleSceneClick = (scene: Scene) => {
    setSelectedScene(scene);
    setEditedName(scene.name);
    setEditedSeconds(scene.seconds);
    setEditedPrompt(scene.prompt);
    setChangeInstruction('');
    setShowChangeMode(false);
    setIsDialogOpen(true);
  };

  const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
    try {
      // If it's already a base64 string, return it
      if (imageUrl.startsWith('data:')) {
        return imageUrl;
      }

      // For local imports, we need to fetch and convert
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  };

  const handleGenerateImage = async () => {
    if (!selectedScene) return;

    setIsGenerating(true);
    try {
      let requestBody: any = {
        prompt: editedPrompt
      };

      // If in change mode, include the change instruction and existing image
      if (showChangeMode && changeInstruction.trim()) {
        const base64Image = await convertImageToBase64(selectedScene.image);
        requestBody = {
          prompt: editedPrompt,
          changeInstruction: changeInstruction,
          existingImageBase64: base64Image
        };
      }

      const { data, error } = await supabase.functions.invoke('generate-scene-image', {
        body: requestBody
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      // Update the scene with the new image and data
      setTiles(prevTiles => 
        prevTiles.map(tile => 
          tile.id === selectedScene.id 
            ? { 
                ...tile, 
                image: data.imageUrl,
                name: editedName,
                seconds: editedSeconds,
                prompt: editedPrompt
              }
            : tile
        )
      );

      setSelectedScene(prev => prev ? {
        ...prev,
        image: data.imageUrl,
        name: editedName,
        seconds: editedSeconds,
        prompt: editedPrompt
      } : null);

      toast.success(showChangeMode ? 'Image modified successfully!' : 'Image generated successfully!');
      setShowChangeMode(false);
      setChangeInstruction('');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Storyboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Organize your scenes and visualize your story
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {tiles.map((tile) => (
            <Card 
              key={tile.id} 
              onClick={() => handleSceneClick(tile)}
              className={`${tile.height} break-inside-avoid hover:scale-[1.02] transition-all cursor-pointer border-border/50 overflow-hidden group`}
            >
              <CardContent className="h-full relative p-0">
                <img 
                  src={tile.image} 
                  alt={tile.content}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {tile.content}
                  </h3>
                  <p className="text-sm text-white/80">
                    Click to edit scene details
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card className="h-64 break-inside-avoid hover:scale-[1.02] transition-transform cursor-pointer border-dashed border-2 border-border/50 bg-background/50">
            <CardContent className="h-full flex flex-col items-center justify-center p-6">
              <Plus className="w-12 h-12 mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Add New Scene
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Scene</DialogTitle>
          </DialogHeader>
          
          {selectedScene && (
            <div className="space-y-6">
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
                <img 
                  src={selectedScene.image} 
                  alt={selectedScene.content}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="scene-name">Scene Name</Label>
                  <Input
                    id="scene-name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="e.g., scene01_intro"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="scene-seconds">Duration (seconds)</Label>
                  <Input
                    id="scene-seconds"
                    type="number"
                    value={editedSeconds}
                    onChange={(e) => setEditedSeconds(Number(e.target.value))}
                    min={1}
                    max={60}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="scene-prompt">Scene Prompt</Label>
                  <Textarea
                    id="scene-prompt"
                    value={editedPrompt}
                    onChange={(e) => setEditedPrompt(e.target.value)}
                    placeholder="Describe the scene in detail..."
                    className="min-h-[200px]"
                    disabled={showChangeMode}
                  />
                </div>

                {showChangeMode && (
                  <div className="grid gap-2 p-4 border border-primary/20 rounded-lg bg-primary/5">
                    <Label htmlFor="change-instruction">Change Instruction</Label>
                    <Textarea
                      id="change-instruction"
                      value={changeInstruction}
                      onChange={(e) => setChangeInstruction(e.target.value)}
                      placeholder="e.g., remove the people from background, change lighting to sunset, add more details..."
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      This will modify the current image based on your instruction
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowChangeMode(!showChangeMode);
                    if (showChangeMode) {
                      setChangeInstruction('');
                    }
                  }}
                  disabled={isGenerating}
                >
                  {showChangeMode ? 'Back to Generate' : 'Change Scene'}
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setShowChangeMode(false);
                      setChangeInstruction('');
                    }}
                    disabled={isGenerating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerateImage}
                    disabled={isGenerating || (!editedPrompt.trim() && !showChangeMode) || (showChangeMode && !changeInstruction.trim())}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {showChangeMode ? 'Modifying...' : 'Generating...'}
                      </>
                    ) : (
                      showChangeMode ? 'Apply Changes' : 'Generate Image'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Storyboard;
