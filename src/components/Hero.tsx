import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import PrismaticBurst from '@/components/PrismaticBurst';

const Hero = () => {
  return (
    <div className="flex flex-col overflow-hidden pb-[500px] pt-[200px]">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold">
              Ship scroll-stopping <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                product videos
              </span>
              <br />
              <span className="text-2xl md:text-4xl font-normal text-muted-foreground mt-4 inline-block">
                in minutes with AI
              </span>
            </h1>
          </>
        }
      >
        <div className="w-full h-full relative">
          <PrismaticBurst
            animationType="rotate3d"
            intensity={2}
            speed={0.5}
            distort={1.0}
            paused={false}
            offset={{ x: 0, y: 0 }}
            hoverDampness={0.25}
            rayCount={24}
            mixBlendMode="lighten"
            colors={['#ff007a', '#4d3dff', '#ffffff']}
          />
        </div>
      </ContainerScroll>
    </div>
  );
};

export default Hero;
