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
      Create <span className="px-2 text-white" style={{ backgroundColor: 'hsl(270 80% 50%)' }}>campaigns</span> that actually <span className="px-2 text-white" style={{ backgroundColor: 'hsl(270 80% 50%)' }}>convert</span>
    </>
  );

  return (
    <div className="flex w-full items-center justify-center overflow-hidden bg-black py-24">
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
