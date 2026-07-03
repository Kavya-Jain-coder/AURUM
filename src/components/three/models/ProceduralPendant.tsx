'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProceduralPendantProps {
  visible: boolean;
  opacity: number;
  scale: number;
  position?: [number, number, number];
}

export function ProceduralPendant({
  visible,
  opacity,
  scale: targetScale,
  position = [0, 0, 0],
}: ProceduralPendantProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentScale = useRef(0);
  const currentOpacity = useRef(0);

  // Minimalist high-luxury double interlocking rings
  const ringGeo = useMemo(() => {
    // A slightly flattened torus for elegance
    const geo = new THREE.TorusGeometry(0.3, 0.04, 64, 128);
    geo.scale(1, 1, 0.6);
    return geo;
  }, []);

  // Center diamond (round brilliant)
  const centerDiamondGeo = useMemo(() => new THREE.SphereGeometry(0.08, 64, 64), []);

  // Small bail
  const bailGeo = useMemo(() => new THREE.TorusGeometry(0.05, 0.015, 32, 64, Math.PI * 1.5), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, opacity, 0.05);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.05);

    groupRef.current.scale.setScalar(Math.max(currentScale.current, 0.001));
    groupRef.current.visible = visible && currentScale.current > 0.01;

    // Slow majestic rotation
    groupRef.current.rotation.y += delta * 0.2;
    groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
        child.material.opacity = currentOpacity.current;
        child.material.transparent = currentOpacity.current < 0.99;
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Bail */}
      <mesh geometry={bailGeo} position={[0, 0.45, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#D4A0A0" metalness={1.0} roughness={0.05} envMapIntensity={4.0} />
      </mesh>

      {/* Ring 1 (Rose Gold) */}
      <mesh geometry={ringGeo} rotation={[Math.PI / 6, Math.PI / 4, 0]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#D4A0A0" metalness={1.0} roughness={0.05} envMapIntensity={5.0} />
      </mesh>

      {/* Ring 2 (White Gold) */}
      <mesh geometry={ringGeo} rotation={[-Math.PI / 6, -Math.PI / 4, 0]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#E8E8E8" metalness={1.0} roughness={0.05} envMapIntensity={5.0} />
      </mesh>

      {/* Center Stone hanging perfectly in the middle */}
      <group position={[0, 0.1, 0]}>
        {/* Bezel */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.085, 0.015, 32, 64]} />
          <meshStandardMaterial color="#D4A0A0" metalness={1.0} roughness={0.05} envMapIntensity={4.0} />
        </mesh>
        {/* Diamond */}
        <mesh geometry={centerDiamondGeo}>
          <meshPhysicalMaterial
            color="#FFFFFF"
            metalness={0.1}
            roughness={0.0}
            transmission={0.99}
            thickness={0.5}
            ior={2.42}
            envMapIntensity={6.0}
          />
        </mesh>
      </group>
    </group>
  );
}
