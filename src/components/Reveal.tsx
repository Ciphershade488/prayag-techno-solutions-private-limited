import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: string;
  once?: boolean;
}

function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => setPrefersReduced(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  return prefersReduced;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  y = 24,
  className = '',
  as = 'div',
  once = true,
  ...rest
}) => {
  const reduceMotion = usePrefersReducedMotion();
  const delaySeconds = delay > 10 ? delay / 1000 : delay;

  // Safe fallback if motion is not loaded or during SSR/environment quirks
  const MotionComponent = (motion && ((motion as any)[as] || motion.div)) || null;

  if (!MotionComponent || reduceMotion) {
    const Tag = (as as any) || 'div';
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionComponent
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.6, delay: delaySeconds, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
};

export default Reveal;
