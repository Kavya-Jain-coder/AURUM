'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useUiStore } from '@/store/uiStore';
import { SessionProvider } from 'next-auth/react';

gsap.registerPlugin(ScrollTrigger);

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const setIsMobile = useUiStore((s) => s.setIsMobile);

  useEffect(() => {
    // FIX 3: Detect mobile ONCE at mount, never recalculate
    const isMobile = window.innerWidth < 768 || navigator.maxTouchPoints > 0;
    setIsMobile(isMobile);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [setIsMobile]);

  return <SessionProvider>{children}</SessionProvider>;
}
