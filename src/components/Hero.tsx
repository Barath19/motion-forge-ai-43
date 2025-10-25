import { ContainerScroll } from '@/components/ui/container-scroll-animation';

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
        <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 to-accent/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                <div className="w-0 h-0 border-l-[16px] border-l-white/80 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1"></div>
              </div>
              <p className="text-sm text-muted-foreground">15s Promo · Orbit Sneakers</p>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
};

export default Hero;
