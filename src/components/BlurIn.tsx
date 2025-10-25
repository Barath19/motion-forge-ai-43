'use client';

import clsx from 'clsx';
import { motion, useInView } from 'framer-motion';
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

  return (
    <MotionComponent
      ref={elementRef as any}
      initial={{ filter: 'blur(20px)', opacity: 0 }}
      animate={isInView ? { filter: 'blur(0px)', opacity: 1 } : {}}
      transition={{ duration: 1.2 }}
      className={clsx(
        'text-xl text-center sm:text-4xl font-bold tracking-tighter md:text-6xl md:leading-[4rem]',
        className
      )}
    >
      {children}
    </MotionComponent>
  );
};
