import GradientBackdrop from '@/components/GradientBackdrop';
import Hero from '@/components/Hero';

const Index = () => {
  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <section className="relative min-h-screen overflow-hidden bg-black text-white">
          <GradientBackdrop variant="section" />
          <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 px-6 text-center md:gap-12">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.4em] text-white/50">
                Afterlight Mode
              </p>
              <h2 className="text-3xl font-semibold md:text-5xl">
                Immerse clients in motion-first product storytelling.
              </h2>
              <p className="mx-auto max-w-3xl text-base text-white/70 md:text-lg">
                Keep scrolling to hand off production-ready scenes, adapt camera paths in real-time, and export artifacts straight to your editors.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
