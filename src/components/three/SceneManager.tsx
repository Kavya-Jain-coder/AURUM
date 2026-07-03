'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useUiStore } from '@/store/uiStore';
import { ProceduralRing } from './models/ProceduralRing';
import { ProceduralNecklace } from './models/ProceduralNecklace';
import { ProceduralBracelet } from './models/ProceduralBracelet';
import { ProceduralEarrings } from './models/ProceduralEarrings';
import { GoldParticles } from './GoldParticles';
import { CausticFloor } from './CausticFloor';
import { OrbitalParticles } from './OrbitalParticles';
import { GravityParticles } from './GravityParticles';

/**
 * SceneManager — FIX 5: All models are created at mount and kept in memory.
 * Only opacity/visibility changes per chapter — never mount/unmount.
 * This eliminates pop-in between scroll chapters.
 */
export function SceneManager() {
  const activeChapter = useUiStore((s) => s.activeChapter);
  const chapterProgress = useUiStore((s) => s.chapterProgress);
  const isMobile = useUiStore((s) => s.isMobile);
  const { camera } = useThree();

  const groupRef = useRef<THREE.Group>(null);

  const scrollProgress = useUiStore((s) => s.scrollProgress);

  // Chapter-specific camera animation using continuous math
  useFrame(() => {
    const targetPos = new THREE.Vector3(0, 0, 5);
    let targetFov = 35;
    
    // Evaluate continuous camera position based on global scroll progress
    // Thresholds: Ch1(0-0.1), Ch2(0.1-0.3), Ch3(0.3-0.5), Ch4(0.5-0.9), Ch5(0.9-1.0)
    const p = scrollProgress;

    if (p < 0.1) {
      // Chapter 1: Born From Stars (Fixed at front)
      targetPos.set(0, 0, 5);
      targetFov = 35;
    } else if (p < 0.3) {
      // Chapter 2: Diamond's Journey (Orbit from front to 45 deg right, slightly up)
      const localP = (p - 0.1) / 0.2;
      const angle = localP * Math.PI * 0.25;
      targetPos.set(Math.sin(angle) * 5, localP * 1.5, Math.cos(angle) * 5);
      targetFov = 35;
    } else if (p < 0.5) {
      // Chapter 3: Goldsmith's Hand (Orbit around the back and return to front)
      const localP = (p - 0.3) / 0.2;
      // Start from PI*0.25, go around to PI*2
      const angle = (Math.PI * 0.25) + localP * (Math.PI * 1.75);
      // Start at y=1.5, end at y=0
      const y = 1.5 - localP * 1.5;
      targetPos.set(Math.sin(angle) * 5, y, Math.cos(angle) * 5);
      targetFov = 35 + localP * 3; // Shift to 38
    } else if (p < 0.9) {
      // Chapter 4: Four Collections (Fixed camera, slight FOV shifts)
      targetPos.set(0, 0, 5);
      
      const localP = (p - 0.5) / 0.4;
      const subIndex = Math.floor(localP * 4);
      const fovTargets = [35, 40, 35, 30];
      targetFov = fovTargets[Math.min(subIndex, 3)];
    } else {
      // Chapter 5: Your Story Begins (Pull back then dramatic zoom in)
      const localP = (p - 0.9) / 0.1;
      const pullBack = localP < 0.5
        ? 5 + localP * 4 // Pull back to 7
        : 7 - (localP - 0.5) * 10; // Zoom in to 2
      targetPos.set(0, 0, Math.max(pullBack, 2));
      targetFov = localP > 0.8 ? 25 : 35;
    }

    camera.position.lerp(targetPos, 0.04);
    camera.lookAt(0, 0, 0);
    (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(
      (camera as THREE.PerspectiveCamera).fov, targetFov, 0.03
    );

    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  });

  // Calculate sub-collection index for Chapter 4 (0.5 to 0.9)
  const ch4SubIndex = scrollProgress >= 0.5 && scrollProgress < 0.9 
    ? Math.floor(((scrollProgress - 0.5) / 0.4) * 4) 
    : -1;

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.2} color="#F5D98A" />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#F4EADE" />
      <directionalLight position={[-3, 2, -3]} intensity={0.3} color="#C69B3C" />
      <pointLight position={[0, -2, 3]} intensity={0.5} color="#E8B84B" distance={10} />
      {/* Rim light — dramatic backlight for silhouette edges */}
      <directionalLight position={[-2, 1, -5]} intensity={0.6} color="#F5D98A" />
      <Environment preset="city" environmentIntensity={0.8} />

      {/* === CHAPTER 0: Born From Stars — Gold Particles + Ring === */}
      <GoldParticles
        visible={activeChapter === 0}
        collapse={activeChapter === 0 ? chapterProgress : 0}
        isMobile={isMobile}
      />
      <ProceduralRing
        visible={activeChapter === 0 && chapterProgress > 0.75}
        opacity={activeChapter === 0 ? Math.max(0, (chapterProgress - 0.75) * 4) : 0}
        scale={activeChapter === 0 ? 1 : 0}
        autoRotate
      />

      {/* === CHAPTER 1: Diamond's Journey — Ring + Caustic Floor === */}
      <ProceduralRing
        visible={activeChapter === 1}
        opacity={activeChapter === 1 ? 1 : 0}
        scale={activeChapter === 1 ? 1.2 : 0}
        material="diamond-focus"
        autoRotate
        position={[0, 0.3, 0]}
      />
      <CausticFloor visible={activeChapter === 1} />

      {/* === CHAPTER 2: Goldsmith's Hand — Necklace + Orbital Particles === */}
      <ProceduralNecklace
        visible={activeChapter === 2}
        opacity={activeChapter === 2 ? 1 : 0}
        scale={activeChapter === 2 ? 0.3 + chapterProgress * 0.7 : 0}
      />
      <OrbitalParticles
        visible={activeChapter === 2}
        count={isMobile ? 1000 : 5000}
      />

      {/* === CHAPTER 3: Four Collections — All 4 models with crossfade === */}
      <group visible={activeChapter === 3}>
        <ProceduralRing
          visible={activeChapter === 3}
          opacity={ch4SubIndex === 0 ? 1 : 0}
          scale={ch4SubIndex === 0 ? 1 : 0}
          autoRotate
        />
        <ProceduralNecklace
          visible={activeChapter === 3}
          opacity={ch4SubIndex === 1 ? 1 : 0}
          scale={ch4SubIndex === 1 ? 0.8 : 0}
        />
        <ProceduralBracelet
          visible={activeChapter === 3}
          opacity={ch4SubIndex === 2 ? 1 : 0}
          scale={ch4SubIndex === 2 ? 1 : 0}
        />
        <ProceduralEarrings
          visible={activeChapter === 3}
          opacity={ch4SubIndex === 3 ? 1 : 0}
          scale={ch4SubIndex === 3 ? 1 : 0}
        />
      </group>

      {/* === CHAPTER 4: Your Story — All models in orbit + gravity particles === */}
      <group visible={activeChapter === 4}>
        <group rotation={[0, useRef(0).current, 0]}>
          <ProceduralRing
            visible={activeChapter === 4 && chapterProgress < 0.9}
            opacity={activeChapter === 4 && chapterProgress < 0.9 ? 0.8 : 0}
            scale={0.5}
            position={[2, 0, 0]}
            autoRotate
          />
          <ProceduralNecklace
            visible={activeChapter === 4 && chapterProgress < 0.9}
            opacity={activeChapter === 4 && chapterProgress < 0.9 ? 0.8 : 0}
            scale={0.4}
            position={[-2, 0, 0]}
          />
          <ProceduralBracelet
            visible={activeChapter === 4 && chapterProgress < 0.9}
            opacity={activeChapter === 4 && chapterProgress < 0.9 ? 0.8 : 0}
            scale={0.5}
            position={[0, 0, 2]}
          />
          <ProceduralEarrings
            visible={activeChapter === 4 && chapterProgress < 0.9}
            opacity={activeChapter === 4 && chapterProgress < 0.9 ? 0.8 : 0}
            scale={0.5}
            position={[0, 0, -2]}
          />
        </group>
        {/* Final single ring at scroll 0.9+ */}
        <ProceduralRing
          visible={activeChapter === 4 && chapterProgress >= 0.85}
          opacity={activeChapter === 4 ? Math.max(0, (chapterProgress - 0.85) * 6.67) : 0}
          scale={activeChapter === 4 && chapterProgress >= 0.85 ? 2.5 : 0}
          autoRotate
        />
      </group>

      <GravityParticles
        visible={activeChapter === 4}
        isMobile={isMobile}
      />
    </group>
  );
}
