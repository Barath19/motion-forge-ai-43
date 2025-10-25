import { useEffect, useRef } from 'react';
import { Play, TrendingUp, Brain, Zap } from 'lucide-react';
import Button from './Button';
import gsap from 'gsap';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
      });
      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out',
      });
      gsap.from('.hero-buttons', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.4,
        ease: 'power3.out',
      });
      gsap.from('.hero-stats', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      });
      gsap.from('.hero-mockup', {
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        delay: 0.3,
        ease: 'power3.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div>
            <h1 className="hero-title text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
              Ship scroll-stopping{' '}
              <span className="neon-underline inline-block">product videos</span>{' '}
              in minutes.
            </h1>
            <p className="hero-subtitle text-xl text-muted-foreground mb-8 leading-relaxed">
              FrameLab is your AI motion designer—ideate, script, and storyboard vertical
              promos without opening an editor.
            </p>
            <div className="hero-buttons flex flex-wrap gap-4 mb-12">
              <Button variant="primary" size="lg">
                Start building
              </Button>
              <Button variant="outline" size="lg">
                <Play className="w-5 h-5" />
                Watch demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="hero-stats glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-accent mb-1">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-2xl font-bold">2×</span>
                </div>
                <p className="text-sm text-muted-foreground">faster launches</p>
              </div>
              <div className="hero-stats glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-accent mb-1">
                  <Brain className="w-5 h-5" />
                  <span className="text-2xl font-bold">87%</span>
                </div>
                <p className="text-sm text-muted-foreground">higher ad recall</p>
              </div>
              <div className="hero-stats glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-accent mb-1">
                  <Zap className="w-5 h-5" />
                  <span className="text-2xl font-bold">12+</span>
                </div>
                <p className="text-sm text-muted-foreground">ready templates</p>
              </div>
            </div>
          </div>

          {/* Right Column - Mockup */}
          <div className="hero-mockup relative">
            <div className="glass-strong rounded-2xl p-4 shadow-glow">
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-white/80 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Video Preview</p>
                  </div>
                </div>
                {/* Badge */}
                <div className="absolute top-4 left-4 glass px-3 py-2 rounded-lg text-sm font-medium">
                  15s Promo · Orbit Sneakers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
