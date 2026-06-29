'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { collections } from '@/lib/products';

/**
 * Chapter 4 — "The Four Collections"
 * Text Behaviour: SCALES FROM CENTER
 * Enter: scale(0.8), opacity 0 → scale(1.0), opacity 1
 * Exit: scale(1.1), opacity 0
 */
export function Chapter4() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      collections.forEach((_, i) => {
        const card = cardRefs.current[i];
        if (!card) return;

        const startFraction = i * 0.25;
        const peakFraction = startFraction + 0.05;
        const endFraction = (i + 1) * 0.25;
        const exitStartFraction = endFraction - 0.05;

        // 1. Enter: scale from center
        masterTl.fromTo(
          card,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            duration: peakFraction - startFraction,
          },
          startFraction
        );

        // 2. Hold on screen, then Exit: scale up and fade out
        masterTl.to(card, {
          scale: 1.1,
          opacity: 0,
          ease: 'cubic-bezier(0.7, 0, 0.84, 0)',
          duration: endFraction - exitStartFraction,
        }, exitStartFraction);
      });
      
      // Force master timeline duration to 1
      masterTl.set({}, {}, 1);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="scroll-chapter flex items-center justify-center"
    >
      {collections.map((collection, i) => (
        <div
          key={collection.slug}
          ref={(el) => { cardRefs.current[i] = el; }}
          className="scroll-chapter-content fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-0"
          style={{ transform: 'translate(-50%, -50%) scale(0.8)' }}
        >
          {/* Collection label */}
          <span className="font-body text-aurum-ivory-deep text-xs tracking-label uppercase block mb-4">
            Collection {String(i + 1).padStart(2, '0')}
          </span>

          {/* Collection name */}
          <h2
            className="font-display font-bold italic text-aurum-gold leading-none"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              letterSpacing: '-0.02em',
            }}
          >
            {collection.name}
          </h2>

          {/* Tagline */}
          <p className="font-body text-aurum-ivory-mid text-base mt-4 max-w-md mx-auto leading-relaxed">
            {collection.tagline}
          </p>

          {/* Price range */}
          <p className="font-accent text-aurum-gold-pale text-lg mt-4">
            {collection.priceRange}
          </p>

          {/* CTA */}
          <button className="btn-outline-gold mt-8 text-sm px-8 py-3">
            View Collection →
          </button>

          {/* Gemstone accent line */}
          <div
            className="w-12 h-[1px] mx-auto mt-6 opacity-40"
            style={{ background: collection.gemAccent }}
          />
        </div>
      ))}
    </div>
  );
}
