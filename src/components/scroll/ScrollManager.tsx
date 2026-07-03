'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useUiStore } from '@/store/uiStore';

/**
 * ScrollManager — Maps scroll position to chapter index + local progress.
 * Communicates with Three.js SceneManager via Zustand uiStore.
 */
export function ScrollManager() {
  const containerRef = useRef<HTMLDivElement>(null);
  const setScrollProgress = useUiStore((s) => s.setScrollProgress);
  const setActiveChapter = useUiStore((s) => s.setActiveChapter);
  const setChapterProgress = useUiStore((s) => s.setChapterProgress);
  const prevProgress = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Define custom chapter thresholds (out of 1000vh total)
    // Ch1: 0-10% (100vh)
    // Ch2: 10-30% (200vh)
    // Ch3: 30-50% (200vh)
    // Ch4: 50-90% (400vh)
    // Ch5: 90-100% (100vh)
    const thresholds = [0.0, 0.1, 0.3, 0.5, 0.9, 1.0];

    const masterTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;

        // Throttle: skip updates where progress barely changed
        if (Math.abs(progress - prevProgress.current) < 0.001) return;
        prevProgress.current = progress;

        setScrollProgress(progress);

        // Determine active chapter based on thresholds
        let active = 0;
        let localProgress = 0;
        
        for (let i = 0; i < thresholds.length - 1; i++) {
          if (progress >= thresholds[i] && progress <= thresholds[i + 1]) {
            active = i;
            const range = thresholds[i + 1] - thresholds[i];
            localProgress = (progress - thresholds[i]) / range;
            break;
          }
        }
        
        // Edge case for exactly 1.0
        if (progress === 1.0) {
          active = 4;
          localProgress = 1.0;
        }

        setActiveChapter(active);
        setChapterProgress(Math.min(localProgress, 1));
      },
    });

    return () => {
      masterTrigger.kill();
    };
  }, [setScrollProgress, setActiveChapter, setChapterProgress]);

  return (
    <div
      ref={containerRef}
      style={{
        height: '1000vh',
        overflow: 'visible', // FIX 2: never overflow: hidden
        position: 'relative',
      }}
    />
  );
}
