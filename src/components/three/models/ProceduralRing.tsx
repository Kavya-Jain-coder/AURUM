'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProceduralRingProps {
  visible: boolean;
  opacity: number;
  scale: number;
  autoRotate?: boolean;
  material?: 'default' | 'diamond-focus' | 'white-gold' | 'rose-gold' | 'platinum';
  position?: [number, number, number];
}

// Material presets
const materialPresets = {
  'default':       { color: '#C69B3C', metalness: 0.98, roughness: 0.05 },
  'diamond-focus': { color: '#C69B3C', metalness: 0.98, roughness: 0.04 },
  'white-gold':    { color: '#E8E8E8', metalness: 0.95, roughness: 0.08 },
  'rose-gold':     { color: '#D4A0A0', metalness: 0.97, roughness: 0.06 },
  'platinum':      { color: '#D8D8D8', metalness: 0.95, roughness: 0.04 },
};

export function ProceduralRing({
  visible,
  opacity,
  scale: targetScale,
  autoRotate = false,
  material = 'default',
  position = [0, 0, 0],
}: ProceduralRingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentScale = useRef(0);
  const currentOpacity = useRef(0);

  const preset = materialPresets[material];

  // Create ring band geometry — a torus
  const bandGeometry = useMemo(() => {
    return new THREE.TorusGeometry(0.8, 0.08, 32, 128);
  }, []);

  // Create diamond (icosahedron on top of band)
  const diamondGeometry = useMemo(() => {
    // Diamond: two cones joined at the base (brilliant cut approximation)
    const geo = new THREE.ConeGeometry(0.12, 0.18, 8, 1);
    return geo;
  }, []);

  // Lower pavilion of diamond
  const pavilionGeometry = useMemo(() => {
    return new THREE.ConeGeometry(0.12, 0.14, 8, 1);
  }, []);

  // Prong geometries (6 small cylinders holding the diamond)
  const prongGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.008, 0.008, 0.12, 8);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth opacity & scale transitions (luxury: always smooth, never snap)
    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, opacity, 0.05);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.05);

    groupRef.current.scale.setScalar(Math.max(currentScale.current, 0.001));
    groupRef.current.visible = visible && currentScale.current > 0.01;

    // Update material opacity
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.opacity = currentOpacity.current;
        child.material.transparent = currentOpacity.current < 0.99;
      }
    });

    // Auto-rotate
    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const prongPositions = useMemo(() => {
    const count = 6;
    const radius = 0.09;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return [
        Math.cos(angle) * radius,
        0.88,
        Math.sin(angle) * radius,
      ] as [number, number, number];
    });
  }, []);

  return (
    <group ref={groupRef} position={position} rotation={[Math.PI * 0.1, 0, 0]}>
      {/* Ring band */}
      <mesh geometry={bandGeometry} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color={preset.color}
          metalness={preset.metalness}
          roughness={preset.roughness}
          envMapIntensity={3.0}
        />
      </mesh>

      {/* Diamond crown (upper cone, inverted) */}
      <mesh geometry={diamondGeometry} position={[0, 0.97, 0]}>
        <meshPhysicalMaterial
          color="#E8F0F8"
          metalness={0.0}
          roughness={0.0}
          transmission={0.95}
          thickness={0.5}
          ior={2.42}
          envMapIntensity={3.0}
          clearcoat={1.0}
        />
      </mesh>

      {/* Diamond pavilion (lower cone) */}
      <mesh geometry={pavilionGeometry} position={[0, 0.83, 0]} rotation={[Math.PI, 0, 0]}>
        <meshPhysicalMaterial
          color="#E8F0F8"
          metalness={0.0}
          roughness={0.0}
          transmission={0.95}
          thickness={0.5}
          ior={2.42}
          envMapIntensity={3.0}
          clearcoat={1.0}
        />
      </mesh>

      {/* Prongs */}
      {prongPositions.map((pos, i) => (
        <mesh key={i} geometry={prongGeometry} position={pos}>
          <meshStandardMaterial
            color={preset.color}
            metalness={preset.metalness}
            roughness={preset.roughness}
            envMapIntensity={3.0}
          />
        </mesh>
      ))}
    </group>
  );
}
