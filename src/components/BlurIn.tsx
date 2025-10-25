'use client';

import clsx from 'clsx';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import * as React from 'react';

type BlurInProps<T extends keyof JSX.IntrinsicElements = 'h2'> = {
  children: React.ReactNode;
  as?: T;
  className?: string;
};

export const BlurIn = <T extends keyof JSX.IntrinsicElements = 'h2'>({
  children,
  as,
  className
}: BlurInProps<T>) => {
  const elementRef = React.useRef<HTMLElement | null>(null);
  const isInView = useInView(elementRef, { once: true });
  const tag = as ?? 'h2';
  const MotionComponent = (motion as Record<string, any>)[tag] ?? motion.h2;

  const { scrollYProgress } = useScroll({
    target: elementRef,
    offset: ['start start', 'end start']
  });

  const blur = useTransform(scrollYProgress, [0, 0.5], ['0px', '20px']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <MotionComponent
      ref={elementRef as any}
      initial={{ filter: 'blur(20px)', opacity: 0 }}
      animate={isInView ? { filter: 'blur(0px)', opacity: 1 } : {}}
      style={{ filter: blur, opacity, willChange: 'filter, opacity' }}
      transition={{ duration: 1.2 }}
      className={clsx(
        'text-xl text-center sm:text-4xl font-bold tracking-tighter md:text-6xl md:leading-[4rem] transform-gpu',
        className
      )}
    >
      {children}
    </MotionComponent>
  );
};
