'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

/**
 * Chapter 5 — "Your Story Begins Here"
 * Text Behaviour: SPLITS VERTICALLY (most dramatic mechanic)
 * Poem text → splits via clip-path → AURUM logo + CTA
 */
export function Chapter5() {
  const containerRef = useRef<HTMLDivElement>(null);
  const poemRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!containerRef.current || !poemRef.current || !ctaRef.current) return;

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      const poemLines = poemRef.current!.querySelectorAll('.poem-line');
      
      // 1. Poem text staggers in (0% to 20%)
      masterTl.fromTo(
        poemLines,
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.2, // 20% of the timeline
          stagger: 0.05,
          ease: 'power2.out',
        },
        0
      );

      // 2. Text split animation (40% to 60%)
      poemLines.forEach((line, index) => {
        masterTl.to(line, {
          clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
          autoAlpha: 0,
          y: -60,
          ease: 'power2.in',
          duration: 0.2, // 20% of the timeline
        }, 0.4 + (index * 0.05));
      });

      // 3. CTA section fades in (70% to 90%)
      masterTl.fromTo(
        ctaRef.current!,
        { scale: 0.9, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.2, // 20% of the timeline
          ease: 'power3.out',
        },
        0.7
      );

      // Force master timeline duration to 1
      masterTl.set({}, {}, 1);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleEnterShop = () => {
    router.push('/shop');
  };

  return (
    <div
      ref={containerRef}
      className="scroll-chapter flex items-center justify-center"
    >
      {/* Poem text */}
      <div
        ref={poemRef}
        className="scroll-chapter-content fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
      >
        <p
          className="poem-line font-display italic text-aurum-ivory leading-snug invisible"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
        >
          You have been searching for something
        </p>
        <p
          className="poem-line font-display italic text-aurum-ivory leading-snug mt-3 invisible"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
        >
          you couldn&apos;t name.
        </p>
        <p
          className="poem-line font-display font-bold italic text-aurum-gold leading-snug mt-6 invisible"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
        >
          We made it for you.
        </p>
      </div>

      {/* CTA section */}
      <div
        ref={ctaRef}
        className="scroll-chapter-content fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center invisible"
      >
        {/* AURUM Logo */}
        <div className="relative w-80 h-24 mx-auto mb-6">
          <Image
            src="/images/Aurum_Logo.png"
            alt="AURUM"
            fill
            className="object-contain"
            style={{ filter: 'brightness(1.3) contrast(1.1)', mixBlendMode: 'screen', transform: 'scale(3.5)' }}
          />
        </div>

        <p className="font-body text-aurum-ivory-mid text-base mb-8 tracking-comfortable">
          87 pieces. Each one named. Each one yours.
        </p>

        <button
          onClick={handleEnterShop}
          className="btn-gold text-base px-12 py-4 tracking-section"
        >
          Enter the Collection
        </button>

        {/* Tagline */}
        <p className="font-display italic text-aurum-ivory-deep text-sm mt-8 tracking-comfortable">
          Worn by the universe. Made for you.
        </p>
      </div>
    </div>
  );
}
