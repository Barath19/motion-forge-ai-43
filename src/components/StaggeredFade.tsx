'use client';

import { cn } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import * as React from 'react';

type TextStaggeredFadeProps<T extends keyof JSX.IntrinsicElements = 'h2'> = {
  text: string;
  direction: 'up' | 'down';
  className?: string;
  as?: T;
  staggerChildren?: number;
};

export const StaggeredFade = <T extends keyof JSX.IntrinsicElements = 'h2'>({
  text,
  direction,
  className = '',
  as,
  staggerChildren = 0.07
}: TextStaggeredFadeProps<T>) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren
      }
    }
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: direction === 'down' ? -18 : 18
    },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.07 }
    })
  };

  const letters = text.split('');
  const ref = React.useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true });

  const tag = as ?? 'h2';
  const MotionComponent = (motion as Record<string, any>)[tag] ?? motion.h2;

  return (
    <MotionComponent
      ref={ref as any}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      variants={containerVariants}
      className={cn(
        'text-xl text-center sm:text-4xl font-bold tracking-tighter md:text-6xl md:leading-[4rem]',
        className
      )}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={`${letter}-${i}`}
          variants={letterVariants}
          custom={i}
          style={{ display: 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </MotionComponent>
  );
};
