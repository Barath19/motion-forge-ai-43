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

      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-5xl font-semibold leading-tight md:text-6xl">
              <StaggeredFade
                as="span"
                direction="up"
                text="Meet"
                className="block pb-2"
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
      <div className="relative z-20">
        <HeroScrollCards />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[460px] bg-gradient-to-b from-transparent via-black/30 via-45% via-black/55 via-75% via-black/75 to-black" />
    </section>
  );
};

export default Hero;
