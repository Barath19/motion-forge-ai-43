import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
}: {
  titleComponent: string | React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const [viewportType, setViewportType] = React.useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");
  const [viewportHeight, setViewportHeight] = React.useState(() => {
    if (typeof window === "undefined") return 900;
    return window.innerHeight;
  });

  React.useEffect(() => {
    const detectViewport = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setViewportType("mobile");
      } else if (width <= 1180) {
        setViewportType("tablet");
      } else {
        setViewportType("desktop");
      }
    };
    detectViewport();
    window.addEventListener("resize", detectViewport);
    return () => {
      window.removeEventListener("resize", detectViewport);
    };
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [25, 12, 4]
  );
  const scaleKeyframes =
    viewportType === "mobile"
      ? [0.92, 1.08, 1.25]
      : viewportType === "tablet"
      ? [1, 1.16, 1.32]
      : [1.05, 1.22, 1.42];
  const cardScale = useTransform(scrollYProgress, [0, 0.5, 1], scaleKeyframes);
  const headlineTranslate = useTransform(scrollYProgress, [0, 1], [-90, -240]);
  const baseCardHeightRem =
    viewportType === "mobile" ? 30 : viewportType === "tablet" ? 36 : 40;
  const cardHeightPx = baseCardHeightRem * 16;
  const centerTranslate = React.useMemo(
    () => Math.max(0, viewportHeight / 2 - cardHeightPx / 2),
    [viewportHeight, cardHeightPx]
  );
  const cardTranslate = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [0, centerTranslate * 0.6, centerTranslate]
  );

  return (
    <div
      className="min-h-[70rem] md:min-h-[100rem] flex items-center justify-center relative p-2 md:p-16"
      ref={containerRef}
    >
      <div
        className="py-4 md:py-16 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={headlineTranslate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={cardTranslate} scale={cardScale} />
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

type CardProps = {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
};

export const Card = ({ rotate, scale, translate }: CardProps) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        translateY: translate,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="group relative max-w-5xl mx-auto h-[30rem] md:h-[40rem] w-full rounded-[40px] border border-white/10 bg-[linear-gradient(155deg,#1c1c1f,#050506)] p-3 md:p-6 shadow-2xl"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[40px] border border-white/10 opacity-60" />
      <div className="pointer-events-none absolute inset-[6px] rounded-[34px] border border-white/5 opacity-40" />
      <div className="pointer-events-none absolute inset-[10px] rounded-[30px] bg-gradient-to-br from-white/[0.08] via-transparent to-transparent opacity-70" />

      <div className="relative z-10 h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-black" aria-hidden="true">
        <div className="absolute inset-0 bg-black" />
        <span className="pointer-events-none absolute left-1/2 top-4 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full bg-white/15 blur-[0.5px]" />
        <span className="pointer-events-none absolute left-1/2 top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-[#0a0f27] shadow-[inset_0_0_4px_rgba(255,255,255,0.12)]" />
      </div>
    </motion.div>
  );
};
