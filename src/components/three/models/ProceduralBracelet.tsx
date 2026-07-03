'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProceduralBraceletProps {
  visible: boolean;
  opacity: number;
  scale: number;
  position?: [number, number, number];
}

export function ProceduralBracelet({
  visible,
  opacity,
  scale: targetScale,
  position = [0, 0, 0],
}: ProceduralBraceletProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentScale = useRef(0);
  const currentOpacity = useRef(0);

  // Very sleek, polished, solid gold bangle (Cartier Love style)
  const bangleGeo = useMemo(() => {
    // Flattened torus for a D-shape comfort fit bangle
    const geo = new THREE.TorusGeometry(1.0, 0.12, 64, 128);
    geo.scale(1, 1, 0.5); // Flatten the Y axis to make it wide but flat
    return geo;
  }, []);
  
  // Minimal inner/outer rims are not needed with a torus, but keeping them subtle
  const rimGeo = useMemo(() => {
    const geo = new THREE.TorusGeometry(1.0, 0.015, 16, 128);
    geo.scale(1, 1, 0.5);
    return geo;
  }, []);

  // Flush set diamonds
  const diamonds = useMemo(() => {
    const count = 6;
    const positions: { pos: [number, number, number]; rot: number }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions.push({
        pos: [
          Math.cos(angle) * 1.05, // Move slightly out to sit on the Torus surface
          0,
          Math.sin(angle) * 1.05,
        ],
        rot: angle,
      });
    }
    return positions;
  }, []);

  const diamondGeo = useMemo(() => new THREE.SphereGeometry(0.04, 32, 32), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, opacity, 0.05);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.05);

    groupRef.current.scale.setScalar(Math.max(currentScale.current, 0.001));
    groupRef.current.visible = visible && currentScale.current > 0.01;

    // Smooth rotation
    groupRef.current.rotation.y += delta * 0.15;
    groupRef.current.rotation.x = Math.PI * 0.15 + Math.sin(state.clock.getElapsedTime() * 0.4) * 0.05;

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
        child.material.opacity = currentOpacity.current;
        child.material.transparent = currentOpacity.current < 0.99;
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main Bangle Surface */}
      <mesh geometry={bangleGeo} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#E8E8E8"
          metalness={1.0}
          roughness={0.05}
          envMapIntensity={4.5}
        />
      </mesh>

      {/* Flush Set Diamonds */}
      {diamonds.map((d, i) => (
        <group key={i} position={d.pos} rotation={[0, -d.rot, 0]}>
          {/* Bezel indentation */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.045, 0.005, 16, 32]} />
            <meshStandardMaterial color="#E8E8E8" metalness={1.0} roughness={0.2} />
          </mesh>
          {/* Diamond */}
          <mesh geometry={diamondGeo}>
            <meshPhysicalMaterial
              color="#FFFFFF"
              metalness={0.1}
              roughness={0.0}
              transmission={0.99}
              thickness={0.2}
              ior={2.42}
              envMapIntensity={6.0}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
