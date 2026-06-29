'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProceduralEarringsProps {
  visible: boolean;
  opacity: number;
  scale: number;
  position?: [number, number, number];
}

export function ProceduralEarrings({
  visible,
  opacity,
  scale: targetScale,
  position = [0, 0, 0],
}: ProceduralEarringsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentScale = useRef(0);
  const currentOpacity = useRef(0);

  // Post geometry (the back of the earring)
  const postGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.012, 0.012, 0.25, 8);
  }, []);

  // Setting bezel
  const bezelGeometry = useMemo(() => {
    return new THREE.TorusGeometry(0.1, 0.015, 12, 24);
  }, []);

  // Diamond
  const diamondGeoTop = useMemo(() => {
    return new THREE.ConeGeometry(0.09, 0.06, 8, 1);
  }, []);

  const diamondGeoBottom = useMemo(() => {
    return new THREE.ConeGeometry(0.09, 0.08, 8, 1);
  }, []);

  // Butterfly back
  const butterflyGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.04, 0.02, 0.06, 0.04, 0.03, 0.06);
    shape.bezierCurveTo(0, 0.08, -0.03, 0.06, -0.03, 0.06);
    shape.bezierCurveTo(-0.06, 0.04, -0.04, 0.02, 0, 0);
    const extrudeSettings = { depth: 0.01, bevelEnabled: false };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, opacity, 0.05);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.05);

    groupRef.current.scale.setScalar(Math.max(currentScale.current, 0.001));
    groupRef.current.visible = visible && currentScale.current > 0.01;

    // Gentle float animation
    groupRef.current.rotation.y += delta * 0.25;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.05;

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material instanceof THREE.MeshStandardMaterial || child.material instanceof THREE.MeshPhysicalMaterial) {
          child.material.opacity = currentOpacity.current;
          child.material.transparent = currentOpacity.current < 0.99;
        }
      }
    });
  });

  const renderStud = (xOffset: number) => (
    <group position={[xOffset, 0, 0]}>
      {/* Post */}
      <mesh geometry={postGeometry} position={[0, -0.12, 0]}>
        <meshStandardMaterial
          color="#C69B3C"
          metalness={0.98}
          roughness={0.05}
          envMapIntensity={3.0}
        />
      </mesh>

      {/* Bezel setting */}
      <mesh geometry={bezelGeometry} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <meshStandardMaterial
          color="#C69B3C"
          metalness={0.98}
          roughness={0.05}
          envMapIntensity={3.0}
        />
      </mesh>

      {/* Diamond top (crown) */}
      <mesh geometry={diamondGeoTop} position={[0, 0.06, 0]}>
        <meshPhysicalMaterial
          color="#E8F0F8"
          metalness={0.0}
          roughness={0.0}
          transmission={0.95}
          thickness={0.3}
          ior={2.42}
          envMapIntensity={4.0}
          clearcoat={1.0}
        />
      </mesh>

      {/* Diamond bottom (pavilion) */}
      <mesh geometry={diamondGeoBottom} position={[0, -0.02, 0]} rotation={[Math.PI, 0, 0]}>
        <meshPhysicalMaterial
          color="#E8F0F8"
          metalness={0.0}
          roughness={0.0}
          transmission={0.95}
          thickness={0.3}
          ior={2.42}
          envMapIntensity={4.0}
          clearcoat={1.0}
        />
      </mesh>

      {/* Butterfly back */}
      <mesh geometry={butterflyGeometry} position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#C69B3C"
          metalness={0.95}
          roughness={0.1}
          envMapIntensity={2.0}
        />
      </mesh>
    </group>
  );

  return (
    <group ref={groupRef} position={position}>
      {/* Left earring */}
      {renderStud(-0.5)}
      {/* Right earring */}
      {renderStud(0.5)}
    </group>
  );
}
