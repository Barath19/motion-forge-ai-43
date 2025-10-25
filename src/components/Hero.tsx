import { BlurIn } from '@/components/BlurIn';
import GradientBackdrop from '@/components/GradientBackdrop';
import HeroScreenMarquee from '@/components/HeroScreenMarquee';
import HeroScrollCards from '@/components/HeroScrollCards';
import { StaggeredFade } from '@/components/StaggeredFade';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

const Hero = () => {
  return (
    <section className="relative flex flex-col overflow-hidden min-h-[170vh] pb-[420px] pt-[48px] md:min-h-[210vh] md:pb-[680px] md:pt-[110px]">
      <GradientBackdrop variant="hero" />
      <div
        className="pointer-events-none absolute inset-0 -z-[5] bg-repeat bg-[length:140px_140px] opacity-[0.18] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGZpbHRlciBpZD0ibiI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsdGVyPSJ1cmwoI24pIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')"
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-48 z-10 h-[26rem] w-[48rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(156,126,255,0.35)0%,rgba(60,30,120,0.12)50%,transparent 85%)] blur-3xl md:top-56 md:h-[32rem] md:w-[60rem]" />

      <div className="relative z-20">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-5xl font-semibold leading-tight md:text-6xl">
              <StaggeredFade
                as="span"
                direction="up"
                text="Meet"
                className="pb-2 font-meet italic text-4xl tracking-[0.18em] text-white/90 md:text-5xl md:tracking-[0.22em]"
              />
                <BlurIn
                  as="span"
                  className="block text-[3.8rem] font-bold mt-1 leading-none tracking-tight text-white md:text-[8rem]"
                >
                  FrameLab
                </BlurIn>
              </h1>
            </>
          }
        >
          <HeroScreenMarquee />
        </ContainerScroll>
      </div>
      <div className="relative z-20">
        <HeroScrollCards />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[460px] bg-gradient-to-b from-transparent via-black/30 via-45% via-black/55 via-75% via-black/75 to-black" />
    </section>
  );
};

export default Hero;
