'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Chapter 1 — "Born From Stars"
 * Text Behaviour: FADES FROM BELOW, exits upward
 * Each word staggers in from y:40px → y:0, opacity 0→1
 */
export function Chapter1() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !heroRef.current || !subtextRef.current) return;

    const ctx = gsap.context(() => {
      // Hero text — masked line reveal (curtain effect)
      const heroLines = heroRef.current!.querySelectorAll('.hero-line-inner');

      gsap.fromTo(
        heroLines,
        { y: '110%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      );

      // Subtext appears at scroll 0.4
      gsap.fromTo(
        subtextRef.current!,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: '40% bottom',
            end: '55% bottom',
            scrub: 1,
          },
        }
      );

      // Exit — all text moves upward and fades out
      gsap.to([heroRef.current!, subtextRef.current!], {
        y: -50,
        opacity: 0,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: containerRef.current,
          start: '70% top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="scroll-chapter flex items-center justify-start"
      style={{ paddingLeft: 'clamp(2rem, 8vw, 8rem)' }}
    >
      <div className="scroll-chapter-content max-w-2xl">
        <div ref={heroRef} className="flex flex-col gap-2">
          <div className="overflow-hidden">
            <h1
              className="hero-line-inner font-display font-bold italic text-aurum-cream leading-none"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', letterSpacing: '-0.02em', paddingBottom: '0.1em' }}
            >
              Every atom of gold
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1
              className="hero-line-inner font-display font-bold italic text-aurum-cream leading-none"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', letterSpacing: '-0.02em', paddingBottom: '0.1em' }}
            >
              in this ring
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1
              className="hero-line-inner font-display font-bold italic text-aurum-gold leading-none"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', letterSpacing: '-0.02em', paddingBottom: '0.1em' }}
            >
              was forged in a dying star.
            </h1>
          </div>
        </div>

        <div ref={subtextRef} className="mt-8 opacity-0">
          <p className="font-body text-aurum-ivory-mid text-lg leading-relaxed max-w-md">
            4.6 billion years ago. A supernova explosion scattered it across the cosmos.
          </p>
          <p className="font-body text-aurum-ivory-mid text-lg leading-relaxed mt-3 max-w-md">
            It waited. <span className="text-aurum-gold-pale italic">For you.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
