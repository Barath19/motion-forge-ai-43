import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import PrismaticBurst from '@/components/PrismaticBurst';
import Button from '@/components/Button';

const Hero = () => {
  return (
    <section className="relative flex flex-col overflow-hidden min-h-[180vh] pb-[520px] pt-[120px] md:min-h-[220vh] md:pb-[820px] md:pt-[180px]">
      <div className="absolute inset-0 -z-10">
        <div className="relative h-full w-full">
          <PrismaticBurst
            animationType="rotate3d"
            intensity={2.8}
            speed={0.6}
            distort={1.1}
            paused={false}
            offset={{ x: 0, y: 0 }}
            hoverDampness={0.35}
            rayCount={36}
            mixBlendMode="screen"
            colors={['#ff007a', '#6d4dff', '#33d9ff', '#ffffff']}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff20,transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/10" />
        </div>
      </div>

      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold leading-tight">
              Meet
              <br />
              <span className="text-5xl md:text-[7rem] font-bold mt-1 leading-none tracking-tight">
                FrameLab
              </span>
            </h1>
          </>
        }
      >
        <div className="flex h-full w-full flex-col items-center justify-between rounded-2xl border border-white/10 bg-black/50 p-6 text-white backdrop-blur-md md:p-10">
          <div className="flex w-full flex-col items-center space-y-5 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
              Real-time preview
            </span>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold leading-tight text-white/90 md:text-3xl">
                Generative motion graphics, tuned to your brand in seconds.
              </h2>
              <p className="max-w-2xl text-base text-white/70 md:text-lg">
                Combine ML-powered animation, smart camera moves, and studio-grade light effects to launch campaigns that convert.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col items-center space-y-6 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              <Button size="lg" className="shadow-lg shadow-fuchsia-500/25">
                Start generating
              </Button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
              >
                <span className="h-2 w-2 animate-ping rounded-full bg-white/80" />
                Watch a 40s demo
              </button>
            </div>
            <dl className="grid gap-4 text-xs font-medium text-white/60 md:grid-cols-3 md:text-sm">
              <div className="space-y-1">
                <dt className="text-white/40">Creative teams shipped</dt>
                <dd className="text-white/90">2.3k+</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-white/40">Average turnaround</dt>
                <dd className="text-white/90">11 minutes</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-white/40">Brand palettes supported</dt>
                <dd className="text-white/90">64 gradients</dd>
              </div>
            </dl>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
};

export default Hero;
