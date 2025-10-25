import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import Button from './Button';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-white/10' : ''
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">FrameLab</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#workflow" className="text-muted-foreground hover:text-foreground transition-colors">
              Workflow
            </a>
            <a href="#builder" className="text-muted-foreground hover:text-foreground transition-colors">
              Builder
            </a>
          </div>

          <Button variant="primary" size="sm">
            Request early access
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
