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

  // Heart shape using THREE.Shape
  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const s = 0.15;
    shape.moveTo(0, s * -0.5);
    shape.bezierCurveTo(0, s * -0.8, s * -0.8, s * -1.2, s * -1.2, s * -0.6);
    shape.bezierCurveTo(s * -1.2, s * 0.2, 0, s * 0.6, 0, s * 1.2);
    shape.bezierCurveTo(0, s * 0.6, s * 1.2, s * 0.2, s * 1.2, s * -0.6);
    shape.bezierCurveTo(s * 0.8, s * -1.2, 0, s * -0.8, 0, s * -0.5);

    const extrudeSettings = {
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 3,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // Bail ring
  const bailGeometry = useMemo(() => {
    return new THREE.TorusGeometry(0.05, 0.008, 8, 16);
  }, []);

  // Chain (short section)
  const chainCurve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 40; i++) {
      const t = (i / 40) * Math.PI;
      const x = (t - Math.PI / 2) * 0.8;
      const y = -0.3 * Math.cosh(x / 0.6) + 0.8;
      points.push(new THREE.Vector3(x, y, 0));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const chainGeometry = useMemo(() => {
    return new THREE.TubeGeometry(chainCurve, 80, 0.01, 8, false);
  }, [chainCurve]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, opacity, 0.05);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.05);

    groupRef.current.scale.setScalar(Math.max(currentScale.current, 0.001));
    groupRef.current.visible = visible && currentScale.current > 0.01;

    groupRef.current.rotation.y += delta * 0.2;

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.opacity = currentOpacity.current;
        child.material.transparent = currentOpacity.current < 0.99;
      }
    });
  });

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
      <mesh geometry={bailGeometry} position={[0, 0.42, 0]}>
        <meshStandardMaterial
          color="#C69B3C"
          metalness={0.98}
          roughness={0.05}
          envMapIntensity={3.0}
        />
      </mesh>

      {/* Heart pendant */}
      <mesh geometry={heartGeometry} position={[0, 0.25, -0.02]} rotation={[0, 0, Math.PI]}>
        <meshStandardMaterial
          color="#C69B3C"
          metalness={0.98}
          roughness={0.04}
          envMapIntensity={3.5}
        />
      </mesh>

      {/* Centre diamond on heart */}
      <mesh position={[0, 0.28, 0.04]}>
        <icosahedronGeometry args={[0.03, 2]} />
        <meshPhysicalMaterial
          color="#E8F0F8"
          metalness={0.0}
          roughness={0.0}
          transmission={0.95}
          thickness={0.2}
          ior={2.42}
          envMapIntensity={4.0}
        />
      </mesh>
    </group>
  );
}
