import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Builder from '@/components/Builder';
import Features from '@/components/Features';
import GradientBackdrop from '@/components/GradientBackdrop';
import Hero from '@/components/Hero';
import Workflow from '@/components/Workflow';
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
          <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 px-6 text-center md:gap-12">
            <div className="space-y-6 sm:-translate-y-10 md:-translate-y-16 lg:-translate-y-24 transition-transform duration-500">
              <p className="text-sm uppercase tracking-[0.4em] text-white/50">Lets get started.....</p>
              
              <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur md:p-10">
                <div className="grid gap-8 md:grid-cols-2 md:items-start md:gap-10">
                  <div className="space-y-4 text-base text-white/75 md:text-lg md:leading-relaxed">
                    <p>
                      Follow the guided flow to transform one product shot into a fully produced motion story. Each stage hands off cleanly to the next so you never leave creative mode.
                    </p>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                      Upload · Clean · Storyboard · Generate
                    </p>
                  </div>
                  <div className="space-y-6">
                    <AnimatePresence mode="wait">
                      <motion.div key={activeStep.id} initial={{
                      opacity: 0,
                      y: 32,
                      scale: 0.98
                    }} animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1
                    }} exit={{
                      opacity: 0,
                      y: -24,
                      scale: 0.98
                    }} transition={{
                      duration: 0.6,
                      ease: [0.22, 0.61, 0.36, 1]
                    }} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_45px_rgba(8,10,20,0.35)] md:p-7">
                        <div className="space-y-6">
                          <motion.div initial={{
                          opacity: 0,
                          x: -12
                        }} animate={{
                          opacity: 1,
                          x: 0
                        }} transition={{
                          duration: 0.45,
                          delay: 0.1
                        }} className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                                {activeStep.id}
                              </span>
                              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
                                {activeStep.accent}
                              </span>
                            </div>
                            <span className="rounded-full bg-white/8 p-3 text-white/80 shadow-[0_12px_30px_rgba(93,63,211,0.35)]">
                              <activeStep.icon className="h-5 w-5" />
                            </span>
                          </motion.div>
                          <div className="space-y-4">
                            <motion.h3 initial={{
                            opacity: 0,
                            y: 12
                          }} animate={{
                            opacity: 1,
                            y: 0
                          }} transition={{
                            duration: 0.45,
                            delay: 0.18
                          }} className="text-xl font-semibold text-white md:text-2xl">
                              {activeStep.title}
                            </motion.h3>
                            <motion.p initial={{
                            opacity: 0,
                            y: 12
                          }} animate={{
                            opacity: 1,
                            y: 0
                          }} transition={{
                            duration: 0.45,
                            delay: 0.22
                          }} className="text-sm text-white/70 md:text-base">
                              {activeStep.description}
                            </motion.p>
                            <motion.div initial={{
                            opacity: 0,
                            y: 16
                          }} animate={{
                            opacity: 1,
                            y: 0
                          }} transition={{
                            duration: 0.45,
                            delay: 0.28
                          }} className="rounded-xl border border-white/10 bg-black/60 px-4 py-5 text-sm text-white/70 backdrop-blur md:text-base">
                              {activeStep.card}
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex gap-2">
                        <button type="button" onClick={handlePrev} aria-label="Previous step" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10">
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button type="button" onClick={handleNext} aria-label="Next step" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {steps.map((step, index) => <button key={step.id} type="button" onClick={() => handleSelect(index)} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.28em] transition ${activeIndex === index ? 'border-white/40 bg-white/15 text-white' : 'border-white/10 bg-white/5 text-white/50 hover:border-white/25 hover:text-white/80'}`}>
                            {step.id}
                          </button>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Features />
        <Workflow />
        <Builder />
      </main>
    </div>;
};
export default Index;