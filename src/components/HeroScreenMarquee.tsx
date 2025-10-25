'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

const HeroScreenMarquee = () => {
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const textEl = textRef.current;
    if (!textEl) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(textEl, {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: textEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }, textEl);

    return () => {
      ctx.revert();
    };
  }, []);

  const renderText = () => (
    <>
      Create <span className="bg-primary px-2 text-primary-foreground">campaigns</span> that actually <span className="bg-primary px-2 text-primary-foreground">convert</span>
    </>
  );

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-black">
      <div
        ref={textRef}
        className="whitespace-nowrap font-marquee text-2xl font-semibold uppercase tracking-[0.1em] text-white/80 md:text-3xl"
      >
        {renderText()} &nbsp;&nbsp; {renderText()}
      </div>
    </div>
  );
};

export default HeroScreenMarquee;
