'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Chapter 3 — "The Goldsmith's Hand"
 * Text Behaviour: PANELS SWEEP FROM LEFT → exit RIGHT (opposite of Chapter 2)
 * "CRAFTED ONCE." shatters on exit
 */
export function Chapter3() {
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

        // 3. Animate OUT — Panel C shatters out separately
        if (i < 2) {
          masterTl.to(panel, {
            y: -40,
            opacity: 0,
            ease: 'power2.in',
            duration: exitEnd - exitStart,
          }, exitStart);
        }
      });

      // Force the master timeline to be exactly 1 unit long
      masterTl.set({}, {}, 1);

      // Panel C "CRAFTED ONCE." — character shatter exit
      const craftedEl = panelCRef.current!.querySelector('.shatter-text');
      if (craftedEl) {
        // Shatter: each character goes to random position
        const chars = craftedEl.querySelectorAll('.shatter-char');
        gsap.to(chars, {
          x: () => (Math.random() - 0.5) * 400,
          y: () => (Math.random() - 0.5) * 300,
          rotation: () => (Math.random() - 0.5) * 180,
          opacity: 0,
          stagger: 0.02,
          ease: 'power3.in',
          scrollTrigger: {
            trigger: containerRef.current,
            start: '88% bottom',
            end: '98% bottom',
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Split text into individual characters for shatter effect
  const renderShatterText = (text: string) => {
    return text.split('').map((char, i) => (
      <span
        key={i}
        className="shatter-char inline-block"
        style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div
      ref={containerRef}
      className="scroll-chapter flex items-center justify-start"
      style={{ paddingLeft: 'clamp(2rem, 8vw, 8rem)' }}
    >
      {/* Panel A */}
      <div
        ref={panelARef}
        className="scroll-chapter-content fixed top-1/2 -translate-y-1/2 left-[8vw] max-w-lg opacity-0"
      >
        <p
          className="font-display italic text-aurum-cream leading-snug"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
        >
          Each AURUM piece begins as a story.
        </p>
      </div>

      {/* Panel B */}
      <div
        ref={panelBRef}
        className="scroll-chapter-content fixed top-1/2 -translate-y-1/2 left-[8vw] max-w-lg opacity-0"
      >
        <p
          className="font-display italic text-aurum-cream leading-snug"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
        >
          A story about the person who will wear it.
        </p>
        <p
          className="font-body text-aurum-ivory-mid text-lg mt-4 leading-relaxed"
        >
          Where they&apos;ve been. What they&apos;ve carried.
        </p>
      </div>

      {/* Panel C — "CRAFTED ONCE." with shatter exit */}
      <div
        ref={panelCRef}
        className="scroll-chapter-content fixed top-1/2 -translate-y-1/2 left-[8vw] max-w-xl opacity-0"
      >
        <div className="shatter-text">
          <h2
            className="font-display font-bold text-aurum-gold leading-none"
            style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}
          >
            {renderShatterText('CRAFTED')}
          </h2>
          <h2
            className="font-display font-bold italic text-aurum-cream leading-none mt-2"
            style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}
          >
            {renderShatterText('ONCE.')}
          </h2>
        </div>
      </div>
    </div>
  );
}
