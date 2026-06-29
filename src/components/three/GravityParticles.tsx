'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GravityParticlesProps {
  visible: boolean;
  isMobile: boolean;
}

export function GravityParticles({ visible, isMobile }: GravityParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = isMobile ? 2000 : 10000;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread across top of screen
      positions[i3 + 0] = (Math.random() - 0.5) * 8;
      positions[i3 + 1] = 4 + Math.random() * 4; // Start above viewport
      positions[i3 + 2] = (Math.random() - 0.5) * 4;
      velocities[i] = 0.3 + Math.random() * 1.2; // Fall speed
    }
    return { positions, velocities };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !visible) return;
    pointsRef.current.visible = visible;

    const posAttr = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Gravity fall
      arr[i3 + 1] -= velocities[i] * delta;
      // Slight horizontal drift
      arr[i3 + 0] += Math.sin(state.clock.getElapsedTime() + i * 0.1) * 0.002;

      // Reset when below viewport
      if (arr[i3 + 1] < -4) {
        arr[i3 + 0] = (Math.random() - 0.5) * 8;
        arr[i3 + 1] = 4 + Math.random() * 2;
        arr[i3 + 2] = (Math.random() - 0.5) * 4;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} visible={visible}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#F5D98A"
        size={0.02}
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
