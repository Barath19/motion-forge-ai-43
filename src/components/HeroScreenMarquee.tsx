'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

const marqueeCopy = 'Create campaigns that actually convert';

const HeroScreenMarquee = () => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const originalTextRef = useRef<string>(marqueeCopy);

  useEffect(() => {
    const textEl = textRef.current;
    if (!textEl) return;

    const original = marqueeCopy.trim();
    originalTextRef.current = original;
    textEl.textContent = `${original} ${original}`;

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
      textEl.textContent = original;
    };
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-black">
      <div
        ref={textRef}
        className="whitespace-nowrap font-marquee text-2xl font-semibold uppercase tracking-[0.1em] text-white/80 md:text-3xl"
      >
        {marqueeCopy}
      </div>
    </div>
  );
};

export default HeroScreenMarquee;
