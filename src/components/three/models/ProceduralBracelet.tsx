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

  // Main bracelet band — larger torus
  const bandGeometry = useMemo(() => {
    return new THREE.TorusGeometry(1.0, 0.06, 24, 128);
  }, []);

  // Channel setting rail (inner rail that holds diamonds)
  const channelGeometry = useMemo(() => {
    return new THREE.TorusGeometry(1.0, 0.08, 6, 128);
  }, []);

  // Diamond positions around the bracelet
  const diamondPositions = useMemo(() => {
    const count = 42;
    const positions: { pos: [number, number, number]; rot: number }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions.push({
        pos: [
          Math.cos(angle) * 1.0,
          0,
          Math.sin(angle) * 1.0,
        ],
        rot: angle,
      });
    }
    return positions;
  }, []);

  const diamondGeo = useMemo(() => {
    return new THREE.OctahedronGeometry(0.03, 0);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, opacity, 0.05);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.05);

    groupRef.current.scale.setScalar(Math.max(currentScale.current, 0.001));
    groupRef.current.visible = visible && currentScale.current > 0.01;

    // Slow rotation + wobble
    groupRef.current.rotation.y += delta * 0.2;
    groupRef.current.rotation.x = Math.PI * 0.15 + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material instanceof THREE.MeshStandardMaterial || child.material instanceof THREE.MeshPhysicalMaterial) {
          child.material.opacity = currentOpacity.current;
          child.material.transparent = currentOpacity.current < 0.99;
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={position} rotation={[Math.PI * 0.15, 0, 0]}>
      {/* Main band */}
      <mesh geometry={bandGeometry}>
        <meshStandardMaterial
          color="#E8E8E8"
          metalness={0.95}
          roughness={0.08}
          envMapIntensity={3.0}
        />
      </mesh>

      {/* Channel rail (slightly flattened) */}
      <mesh geometry={channelGeometry} scale={[1, 0.5, 1]}>
        <meshStandardMaterial
          color="#E8E8E8"
          metalness={0.95}
          roughness={0.06}
          envMapIntensity={2.5}
        />
      </mesh>

      {/* Diamonds around the bracelet */}
      {diamondPositions.map((d, i) => (
        <mesh
          key={i}
          geometry={diamondGeo}
          position={d.pos}
          rotation={[0, d.rot, Math.PI / 4]}
          scale={[1, 1.3, 1]}
        >
          <meshPhysicalMaterial
            color="#E8F0F8"
            metalness={0.0}
            roughness={0.0}
            transmission={0.9}
            thickness={0.2}
            ior={2.42}
            envMapIntensity={4.0}
            clearcoat={1.0}
          />
        </mesh>
      ))}
    </group>
  );
}
