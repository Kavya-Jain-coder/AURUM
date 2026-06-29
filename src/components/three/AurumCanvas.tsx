'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Preload } from '@react-three/drei';
import { useUiStore } from '@/store/uiStore';
import { SceneManager } from './SceneManager';
import { PostProcessingEffects } from './PostProcessingEffects';

export function AurumCanvas() {
  const isMobile = useUiStore((s) => s.isMobile);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}
    >
      <Canvas
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1}
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneManager />
          {/* FIX 3: Only render postprocessing on desktop */}
          {!isMobile && <PostProcessingEffects />}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
