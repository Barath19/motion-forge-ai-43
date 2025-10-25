import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const Storyboard = () => {
  const [tiles] = useState([
    { id: 1, height: 'h-64', content: 'Scene 1', color: 'bg-gradient-to-br from-primary/20 to-primary/5' },
    { id: 2, height: 'h-80', content: 'Scene 2', color: 'bg-gradient-to-br from-secondary/20 to-secondary/5' },
    { id: 3, height: 'h-72', content: 'Scene 3', color: 'bg-gradient-to-br from-accent/20 to-accent/5' },
    { id: 4, height: 'h-96', content: 'Scene 4', color: 'bg-gradient-to-br from-primary/30 to-primary/10' },
    { id: 5, height: 'h-64', content: 'Scene 5', color: 'bg-gradient-to-br from-secondary/30 to-secondary/10' },
    { id: 6, height: 'h-88', content: 'Scene 6', color: 'bg-gradient-to-br from-accent/30 to-accent/10' },
    { id: 7, height: 'h-72', content: 'Scene 7', color: 'bg-gradient-to-br from-primary/25 to-primary/8' },
    { id: 8, height: 'h-80', content: 'Scene 8', color: 'bg-gradient-to-br from-secondary/25 to-secondary/8' },
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
              className={`${tile.height} ${tile.color} break-inside-avoid hover:scale-[1.02] transition-transform cursor-pointer border-border/50`}
            >
              <CardContent className="h-full flex flex-col items-center justify-center p-6">
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  {tile.content}
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  Click to edit scene details
                </p>
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
