'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import heroVideo from '@/assets/hero-video.mp4';
import heroVideo2 from '@/assets/hero-video-2.mp4';

type CardItem = {
  id: string;
  title: string;
  caption: string;
  className: string;
  type?: 'feature' | 'video';
  videoSrc?: string;
};

const cards: CardItem[] = [
  {
    id: 'hero-video',
    title: 'Product Showcase',
    caption: 'AI-powered video generation in action.',
    className:
      'bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.35),rgba(10,10,12,0.9)_100%)]',
    type: 'video',
    videoSrc: heroVideo
  },
  {
    id: 'hero-video-2',
    title: 'Creative Vision',
    caption: 'Transform ideas into stunning visuals.',
    className:
      'bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.35),rgba(10,10,12,0.9)_100%)]',
    type: 'video',
    videoSrc: heroVideo2
  }
];

const HeroScrollCards = () => {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(listEl, {
        xPercent: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: listEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }, listEl);

    return () => {
      ctx.revert();
    };
  }, []);

  const renderCards = [...cards, ...cards];

  return (
    <div className="relative mx-auto mt-24 md:mt-32 flex w-[96vw] max-w-[120rem] items-center justify-center overflow-hidden rounded-[48px] border border-white/10 bg-white/[0.04] px-12 py-12 shadow-[0_30px_80px_rgba(10,10,16,0.45)] backdrop-blur">
      <div className="pointer-events-none absolute inset-0 rounded-[42px] border border-white/10 opacity-50" />
      <div className="pointer-events-none absolute inset-[12px] rounded-[36px] border border-white/5 opacity-30" />
      <div className="pointer-events-none absolute inset-[16px] rounded-[32px] bg-gradient-to-br from-white/[0.08] via-transparent to-transparent opacity-60" />

      <div ref={listRef} className="relative flex w-max gap-10 px-4">
        {renderCards.map((card, index) => (
          <div
            key={`${card.id}-${index}`}
            className={`flex h-[360px] md:h-[420px] w-auto flex-col overflow-hidden rounded-[32px] border border-white/15 p-7 text-left text-white shadow-[0_18px_45px_rgba(6,7,12,0.45)] ${card.className}`}
            style={{ aspectRatio: '9 / 16' }}
          >
            <div className="flex flex-1 items-center justify-center relative overflow-hidden rounded-2xl">
              {card.type === 'video' && card.videoSrc ? (
                <video
                  src={card.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <button
                  type="button"
                  className="group inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur transition-all duration-300 hover:border-white/60 hover:bg-white/20"
                  aria-label="Play preview"
                >
                  <Play className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
                </button>
              )}
            </div>
            <div className="pt-6 text-xs font-medium uppercase tracking-[0.3em] text-white/60">
              FrameLab
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroScrollCards;
