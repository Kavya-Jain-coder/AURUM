'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
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

        // Each card gets 25% of timeline: 5% enter, 15% hold, 5% exit
        const startFraction = i * 0.25;
        const enterEnd = startFraction + 0.05;
        const exitStart = startFraction + 0.20;
        const exitEnd = (i + 1) * 0.25;

        // 1. Enter: scale from center
        masterTl.fromTo(
          card,
          { scale: 0.8, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            duration: enterEnd - startFraction,
          },
          startFraction
        );

        // 2. Exit: scale up and fade out (skip last card — it stays until Chapter 5)
        if (i < collections.length - 1) {
          masterTl.to(card, {
            scale: 1.1,
            autoAlpha: 0,
            ease: 'cubic-bezier(0.7, 0, 0.84, 0)',
            duration: exitEnd - exitStart,
          }, exitStart);
        }
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
          className="scroll-chapter-content fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center invisible"
          style={{ transform: 'translate(-50%, -50%) scale(0.8)', zIndex: 10 }}
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
          <Link
            href={`/shop?collection=${collection.slug}`}
            className="btn-outline-gold mt-8 text-sm px-8 py-3 inline-block cursor-pointer"
          >
            View Collection →
          </Link>

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
