'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Chapter 2 — "The Diamond's Journey"
 * Text Behaviour: PANELS SWEEP FROM RIGHT → exit LEFT
 */
export function Chapter2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelARef = useRef<HTMLDivElement>(null);
  const panelBRef = useRef<HTMLDivElement>(null);
  const panelCRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const panels = [panelARef.current!, panelBRef.current!, panelCRef.current!];

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      panels.forEach((panel, i) => {
        // Each panel gets 33% of timeline: 8% enter, 17% hold, 8% exit
        const startP = (i * 33) / 100;       
        const enterEnd = startP + 0.08;   
        const exitStart = startP + 0.25;
        const exitEnd = startP + 0.33;    
        
        // 1. Initial state (hidden below)
        gsap.set(panel, { y: 40, opacity: 0 });

        // 2. Animate IN
        masterTl.to(panel, {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          duration: enterEnd - startP,
        }, startP); 

        // 3. Animate OUT
        masterTl.to(panel, {
          y: -40,
          opacity: 0,
          ease: 'power2.in',
          duration: exitEnd - exitStart,
        }, exitStart);
      });

      // Force the master timeline to be exactly 1 unit long
      masterTl.set({}, {}, 1);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="scroll-chapter flex items-center justify-end"
      style={{ paddingRight: 'clamp(2rem, 8vw, 8rem)' }}
    >
      {/* Panel A */}
      <div
        ref={panelARef}
        className="scroll-chapter-content fixed top-1/2 -translate-y-1/2 right-[8vw] max-w-lg opacity-0"
      >
        <p
          className="font-display italic text-aurum-cream leading-snug"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
        >
          At 150 kilometres below the Earth&apos;s surface—
        </p>
      </div>

      {/* Panel B */}
      <div
        ref={panelBRef}
        className="scroll-chapter-content fixed top-1/2 -translate-y-1/2 right-[8vw] max-w-lg opacity-0"
      >
        <p
          className="font-display italic text-aurum-cream leading-snug"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
        >
          Under pressure 725,000 times greater than the atmosphere—
        </p>
      </div>

      {/* Panel C */}
      <div
        ref={panelCRef}
        className="scroll-chapter-content fixed top-1/2 -translate-y-1/2 right-[8vw] max-w-xl opacity-0"
      >
        <p
          className="font-display italic text-aurum-ivory leading-snug"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
        >
          Carbon atoms arrange themselves into the hardest structure in nature.
        </p>
        <p
          className="font-display font-bold italic text-aurum-gold mt-4"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}
        >
          A diamond.
        </p>
        {/* 3D data points rendered as DOM overlays */}
        <div className="flex gap-8 mt-8">
          <div className="text-center">
            <span className="font-accent text-aurum-gold-glow text-2xl font-bold">1,000°C</span>
            <span className="block text-aurum-ivory-deep text-xs mt-1 tracking-label uppercase">Temperature</span>
          </div>
          <div className="text-center">
            <span className="font-accent text-aurum-gold-glow text-2xl font-bold">150km</span>
            <span className="block text-aurum-ivory-deep text-xs mt-1 tracking-label uppercase">Depth</span>
          </div>
          <div className="text-center">
            <span className="font-accent text-aurum-gold-glow text-2xl font-bold">3B yrs</span>
            <span className="block text-aurum-ivory-deep text-xs mt-1 tracking-label uppercase">Formation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
