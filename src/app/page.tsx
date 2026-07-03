'use client';

import dynamic from 'next/dynamic';
import { Chapter1 } from '@/components/scroll/Chapter1';
import { Chapter2 } from '@/components/scroll/Chapter2';
import { Chapter3 } from '@/components/scroll/Chapter3';
import { Chapter4 } from '@/components/scroll/Chapter4';
import { Chapter5 } from '@/components/scroll/Chapter5';
import { ScrollManager } from '@/components/scroll/ScrollManager';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Navbar } from '@/components/ui/Navbar';

// Dynamic import for Three.js canvas — avoid SSR
const AurumCanvas = dynamic(
  () => import('@/components/three/AurumCanvas').then((mod) => ({ default: mod.AurumCanvas })),
  { ssr: false }
);

export default function HomePage() {
  return (
    <>
      {/* Loading screen */}
      <LoadingScreen />

      {/* Navbar (appears at Chapter 5 / shop pages) */}
      <Navbar />

      {/* Fixed Three.js canvas (z-index: 0) */}
      <AurumCanvas />

      {/* Scroll chapters (z-index: 1, transparent backgrounds) */}
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          height: '1000vh',
          overflow: 'visible',
        }}
      >
        {/* Invisible scroll tracker */}
        <ScrollManager />

        {/* Chapter DOM overlays — all transparent, pointer-events: none */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {/* Chapter 1: 0vh – 100vh */}
          <div style={{ position: 'absolute', top: '0vh', height: '100vh', width: '100%' }}>
            <Chapter1 />
          </div>

          {/* Chapter 2: 100vh – 300vh */}
          <div style={{ position: 'absolute', top: '100vh', height: '200vh', width: '100%' }}>
            <Chapter2 />
          </div>

          {/* Chapter 3: 300vh – 500vh */}
          <div style={{ position: 'absolute', top: '300vh', height: '200vh', width: '100%' }}>
            <Chapter3 />
          </div>

          {/* Chapter 4: 500vh – 900vh */}
          <div style={{ position: 'absolute', top: '500vh', height: '400vh', width: '100%' }}>
            <Chapter4 />
          </div>

          {/* Chapter 5: 900vh – 1000vh */}
          <div style={{ position: 'absolute', top: '900vh', height: '100vh', width: '100%' }}>
            <Chapter5 />
          </div>
        </div>
      </main>
    </>
  );
}
