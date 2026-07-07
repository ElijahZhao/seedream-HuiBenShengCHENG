'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  delay?: number;
  className?: string;
  threshold?: number;
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold]);

  const directionClasses = {
    up: 'reveal',
    down: 'animate-fade-in-down',
    left: 'reveal-left',
    right: 'reveal-right',
    scale: 'reveal-scale',
  };

  const delayClass = delay > 0 ? `delay-${Math.min(delay * 1000, 1000)}` : '';

  return (
    <div
      ref={ref}
      className={`${directionClasses[direction]} ${delayClass} ${isVisible ? 'active' : ''} ${className}`}
      style={{ animationDelay: delay > 0 ? `${delay}s` : undefined }}
    >
      {children}
    </div>
  );
}
