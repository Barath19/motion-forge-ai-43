import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Builder from '@/components/Builder';
import Features from '@/components/Features';
import GradientBackdrop from '@/components/GradientBackdrop';
import Hero from '@/components/Hero';
import Workflow from '@/components/Workflow';
import Button from '@/components/Button';
import { UploadCloud, Eraser, PanelsTopLeft, Clapperboard, ChevronLeft, ChevronRight } from 'lucide-react';
const steps = [{
  id: '01',
  title: 'Drag & Drop',
  description: 'Drop your hero product shot anywhere on the canvas — FrameLab detects it instantly.',
  card: 'Supports PNG, PSD, and RAW so your lighting and shadows stay intact.',
  icon: UploadCloud,
  accent: 'Import'
}, {
  id: '02',
  title: 'Polish',
  description: 'Clean if necessary with AI-assisted masking — keep reflections, lose distractions.',
  card: 'Feathered edges + auto-color balance give you studio-grade cutouts.',
  icon: Eraser,
  accent: 'Refine'
}, {
  id: '03',
  title: 'Storyboard',
  description: 'Generate a storyboard from your prompt, visual style, and tone in seconds.',
  card: 'Camera moves, copy beats, and timing cues auto-populate every frame.',
  icon: PanelsTopLeft,
  accent: 'Compose'
}, {
  id: '04',
  title: 'Render',
  description: 'Export the final video — motion, lighting, and music aligned to the narrative.',
  card: 'Ready-to-edit MP4s slot straight into Premiere, Resolve, or your editor of choice.',
  icon: Clapperboard,
  accent: 'Deliver'
}];
const Index = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setActiveIndex(prev => (prev + 1) % steps.length);
    }, 6000);
    return () => clearTimeout(timeout);
  }, [activeIndex]);
  const activeStep = useMemo(() => steps[activeIndex], [activeIndex]);
  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + steps.length) % steps.length);
  };
  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % steps.length);
  };
  const handleSelect = (index: number) => {
    setActiveIndex(index);
  };
  return <div className="min-h-screen bg-transparent text-white">
      <main>
        <Hero />
        <section className="relative min-h-screen overflow-hidden bg-black text-white">
          <GradientBackdrop variant="section" />
          <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-start pt-32 gap-8 px-6 text-center md:gap-12">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </div>
        </section>
        
        
        
      </main>
    </div>;
};
export default Index;