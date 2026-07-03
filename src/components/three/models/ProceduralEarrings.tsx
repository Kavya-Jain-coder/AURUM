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
  const leftGroupRef = useRef<THREE.Group>(null);
  const rightGroupRef = useRef<THREE.Group>(null);
  const currentScale = useRef(0);
  const currentOpacity = useRef(0);

  // Stud (top part)
  const studGeo = useMemo(() => new THREE.OctahedronGeometry(0.1, 1), []);
  
  // Connecting chain / drop bar
  const dropGeo = useMemo(() => new THREE.CylinderGeometry(0.01, 0.01, 0.8, 8), []);

  // Main teardrop pendant (lattice / wireframe look using Lathe and multiple rotated meshes)
  const teardropGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const r = Math.sin(t * Math.PI) * 0.25 * (1 - t * 0.5);
      const y = t * 0.6 - 0.3;
      pts.push(new THREE.Vector2(r, y));
    }
    return new THREE.LatheGeometry(pts, 32);
  }, []);

  const stoneGeo = useMemo(() => new THREE.OctahedronGeometry(0.15, 2), []);

  useFrame((state, delta) => {
    if (!leftGroupRef.current || !rightGroupRef.current) return;

    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, opacity, 0.05);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.05);

    const s = Math.max(currentScale.current, 0.001);
    leftGroupRef.current.scale.setScalar(s);
    rightGroupRef.current.scale.setScalar(s);
    
    leftGroupRef.current.visible = visible && currentScale.current > 0.01;
    rightGroupRef.current.visible = visible && currentScale.current > 0.01;

    // Elegant swaying motion for the earrings
    const time = state.clock.getElapsedTime();
    const sway = Math.sin(time * 0.8) * 0.1;
    const twist = Math.sin(time * 0.4) * 0.2;

    leftGroupRef.current.rotation.z = sway;
    leftGroupRef.current.rotation.y = twist;
    
    rightGroupRef.current.rotation.z = sway;
    rightGroupRef.current.rotation.y = -twist;

    const updateMaterial = (child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
        child.material.opacity = currentOpacity.current;
        child.material.transparent = currentOpacity.current < 0.99;
      }
    };
    
    leftGroupRef.current.traverse(updateMaterial);
    rightGroupRef.current.traverse(updateMaterial);
  });

  const renderEarring = () => (
    <>
      {/* Stud */}
      <mesh geometry={studGeo} position={[0, 0.8, 0]}>
        <meshPhysicalMaterial
          color="#FFFFFF" metalness={0.1} roughness={0.0} transmission={0.95} thickness={0.5} ior={2.42} envMapIntensity={5.0}
        />
      </mesh>
      
      {/* Stud base setting */}
      <mesh position={[0, 0.8, -0.05]}>
        <cylinderGeometry args={[0.11, 0.05, 0.05, 8]} />
        <meshStandardMaterial color="#E8E8E8" metalness={0.95} roughness={0.1} envMapIntensity={3.0} />
      </mesh>

      {/* Drop Bar */}
      <mesh geometry={dropGeo} position={[0, 0.35, 0]}>
        <meshStandardMaterial color="#E8E8E8" metalness={1.0} roughness={0.05} envMapIntensity={4.0} />
      </mesh>

      {/* Teardrop Gold Cage */}
      <mesh geometry={teardropGeo} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#E8E8E8" metalness={1.0} roughness={0.1} envMapIntensity={4.5} wireframe wireframeLinewidth={2} />
      </mesh>

      {/* Center Stone in Teardrop */}
      <mesh geometry={stoneGeo} position={[0, -0.3, 0]}>
        <meshPhysicalMaterial
          color="#E8F0F8" metalness={0.0} roughness={0.0} transmission={0.95} thickness={0.5} ior={2.42} envMapIntensity={6.0}
        />
      </mesh>
    </>
  );

  return (
    <group position={position}>
      {/* Left Earring */}
      <group ref={leftGroupRef} position={[-0.8, 0, 0]}>
        {renderEarring()}
      </group>

      {/* Right Earring */}
      <group ref={rightGroupRef} position={[0.8, 0, 0]}>
        {renderEarring()}
      </group>
    </group>
  );
}
