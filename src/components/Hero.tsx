import { Play, TrendingUp, Brain, Zap } from 'lucide-react';
import Button from './Button';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

const Hero = () => {
  return (
    <section className="overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Ship scroll-stopping{' '}
              <span className="neon-underline inline-block">product videos</span>{' '}
              in minutes.
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              FrameLab is your AI motion designer—ideate, script, and storyboard vertical
              promos without opening an editor.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="primary" size="lg">
                Start building
              </Button>
              <Button variant="outline" size="lg">
                <Play className="w-5 h-5" />
                Watch demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-accent mb-1 justify-center">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-2xl font-bold">2×</span>
                </div>
                <p className="text-sm text-muted-foreground">faster launches</p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-accent mb-1 justify-center">
                  <Brain className="w-5 h-5" />
                  <span className="text-2xl font-bold">87%</span>
                </div>
                <p className="text-sm text-muted-foreground">higher ad recall</p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-accent mb-1 justify-center">
                  <Zap className="w-5 h-5" />
                  <span className="text-2xl font-bold">12+</span>
                </div>
                <p className="text-sm text-muted-foreground">ready templates</p>
              </div>
            </div>
          </div>
        }
      >
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-primary/30 to-accent/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 text-white/80 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Video Preview</p>
              <p className="text-xs text-muted-foreground mt-2">15s Promo · Orbit Sneakers</p>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
};

export default Hero;
