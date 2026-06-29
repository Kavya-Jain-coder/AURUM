'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OrbitalParticlesProps {
  visible: boolean;
  count: number;
}

export function OrbitalParticles({ visible, count }: OrbitalParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.5 + Math.sin(i * 0.7) * 0.3;
      positions[i3 + 0] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(i * 0.5) * 0.4;
      positions[i3 + 2] = Math.sin(angle) * radius;
      sizes[i] = 0.5 + Math.random() * 1.5;
    }
    return { positions, sizes };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.visible = visible;

    const posAttr = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = (i / count) * Math.PI * 2 + t * 0.3;
      const radius = 1.5 + Math.sin(i * 0.7) * 0.3;
      arr[i3 + 0] = Math.cos(angle) * radius;
      arr[i3 + 1] = Math.sin(i * 0.5 + t * 0.2) * 0.4;
      arr[i3 + 2] = Math.sin(angle) * radius;
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
        <bufferAttribute
          attach="attributes-size"
          array={sizes}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#E8B84B"
        size={0.015}
        transparent
        opacity={0.7}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
