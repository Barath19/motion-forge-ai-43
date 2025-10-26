import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import scene1 from '@/assets/storyboard/scene-1.jpg';
import scene2 from '@/assets/storyboard/scene-2.jpeg';
import scene3 from '@/assets/storyboard/scene-3.jpg';
import scene4 from '@/assets/storyboard/scene-4.jpeg';
import scene5 from '@/assets/storyboard/scene-5.jpeg';
import scene6 from '@/assets/storyboard/scene-6.jpeg';
import scene7 from '@/assets/storyboard/scene-7.jpeg';
import scene8 from '@/assets/storyboard/scene-8.jpeg';

const Storyboard = () => {
  const [tiles] = useState([
    { id: 1, height: 'h-64', content: 'Scene 1', image: scene1 },
    { id: 2, height: 'h-80', content: 'Scene 2', image: scene2 },
    { id: 3, height: 'h-72', content: 'Scene 3', image: scene3 },
    { id: 4, height: 'h-96', content: 'Scene 4', image: scene4 },
    { id: 5, height: 'h-64', content: 'Scene 5', image: scene5 },
    { id: 6, height: 'h-88', content: 'Scene 6', image: scene6 },
    { id: 7, height: 'h-72', content: 'Scene 7', image: scene7 },
    { id: 8, height: 'h-80', content: 'Scene 8', image: scene8 },
  ]);

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
    </div>
  );
};

export default Storyboard;
