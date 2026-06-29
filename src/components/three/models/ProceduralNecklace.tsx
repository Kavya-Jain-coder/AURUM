'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProceduralNecklaceProps {
  visible: boolean;
  opacity: number;
  scale: number;
  position?: [number, number, number];
}

export function ProceduralNecklace({
  visible,
  opacity,
  scale: targetScale,
  position = [0, 0, 0],
}: ProceduralNecklaceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentScale = useRef(0);
  const currentOpacity = useRef(0);

  // Create chain links as a catenary curve
  const chainCurve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 100;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI;
      const x = (t - Math.PI / 2) * 1.2;
      // Catenary curve: y = a * cosh(x/a) - offset
      const y = -0.4 * Math.cosh(x / 0.8) + 1.2;
      const z = Math.sin(t * 0.5) * 0.1;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const chainGeometry = useMemo(() => {
    return new THREE.TubeGeometry(chainCurve, 120, 0.015, 12, false);
  }, [chainCurve]);

  // Pendant — teardrop shape using lathe geometry
  const pendantGeometry = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    // Teardrop profile
    for (let i = 0; i < 20; i++) {
      const t = i / 19;
      const r = Math.sin(t * Math.PI) * 0.12 * (1 - t * 0.3);
      const y = t * 0.3 - 0.15;
      pts.push(new THREE.Vector2(r, y));
    }
    pts.push(new THREE.Vector2(0, 0.15)); // Top point
    return new THREE.LatheGeometry(pts, 24);
  }, []);

  // Bail (connector between chain and pendant)
  const bailGeometry = useMemo(() => {
    return new THREE.TorusGeometry(0.04, 0.008, 8, 16, Math.PI);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, opacity, 0.05);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.05);

    groupRef.current.scale.setScalar(Math.max(currentScale.current, 0.001));
    groupRef.current.visible = visible && currentScale.current > 0.01;

    // Gentle sway
    groupRef.current.rotation.y += delta * 0.15;
    groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.03;

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.opacity = currentOpacity.current;
        child.material.transparent = currentOpacity.current < 0.99;
      }
    });
  });

  // Chain bottom center point for pendant placement
  const pendantPos = useMemo(() => {
    const point = chainCurve.getPoint(0.5);
    return [point.x, point.y - 0.15, point.z] as [number, number, number];
  }, [chainCurve]);

  return (
    <group ref={groupRef} position={position}>
      {/* Chain */}
      <mesh geometry={chainGeometry}>
        <meshStandardMaterial
          color="#C69B3C"
          metalness={0.98}
          roughness={0.05}
          envMapIntensity={3.0}
        />
      </mesh>

      {/* Bail */}
      <mesh geometry={bailGeometry} position={[pendantPos[0], pendantPos[1] + 0.04, pendantPos[2]]} rotation={[0, 0, 0]}>
        <meshStandardMaterial
          color="#C69B3C"
          metalness={0.98}
          roughness={0.05}
          envMapIntensity={3.0}
        />
      </mesh>

      {/* Pendant */}
      <mesh geometry={pendantGeometry} position={pendantPos}>
        <meshStandardMaterial
          color="#C69B3C"
          metalness={0.98}
          roughness={0.04}
          envMapIntensity={3.5}
        />
      </mesh>

      {/* Small diamond on pendant */}
      <mesh position={[pendantPos[0], pendantPos[1], pendantPos[2] + 0.05]}>
        <icosahedronGeometry args={[0.04, 2]} />
        <meshPhysicalMaterial
          color="#E8F0F8"
          metalness={0.0}
          roughness={0.0}
          transmission={0.95}
          thickness={0.3}
          ior={2.42}
          envMapIntensity={3.0}
        />
      </mesh>
    </group>
  );
}
