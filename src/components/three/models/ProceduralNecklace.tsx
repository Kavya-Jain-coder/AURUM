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

  // Smooth snake chain hanging down naturally
  const chainCurve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 150;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI;
      const x = (t - Math.PI / 2) * 1.5;
      // Elegant natural hanging curve
      const y = 0.9 * Math.cosh(x / 0.9) - 1.4;
      const z = Math.sin(t) * 0.3 - 0.3; // Curves around the neck backward
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const chainGeometry = useMemo(() => new THREE.TubeGeometry(chainCurve, 256, 0.012, 16, false), [chainCurve]);
  
  // Elegant pear-shaped diamond
  const diamondGeo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.25, 0);
    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // Shape it into a pear/teardrop
      if (y > 0.1) {
        positions.setY(i, 0.1); // flatten table
      } else if (y < 0) {
        positions.setY(i, y * 2.0); // stretch bottom
      }
      
      // Taper the top slightly
      if (y > 0) {
        positions.setX(i, x * 0.8);
        positions.setZ(i, z * 0.8);
      }
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Small gold bail (connector)
  const bailGeo = useMemo(() => {
    const geo = new THREE.TorusGeometry(0.04, 0.012, 32, 64);
    geo.scale(1, 1.5, 1);
    return geo;
  }, []);

  // V-prong at the bottom tip of the pear diamond
  const bottomProngGeo = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.04, 0.1, 16);
    return geo;
  }, []);

  const pendantPos = useMemo(() => {
    const point = chainCurve.getPoint(0.5); // Center of the curve
    return [point.x, point.y - 0.04, point.z] as [number, number, number];
  }, [chainCurve]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, opacity, 0.05);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.05);

    groupRef.current.scale.setScalar(Math.max(currentScale.current, 0.001));
    groupRef.current.visible = visible && currentScale.current > 0.01;

    // Gentle sway
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
        child.material.opacity = currentOpacity.current;
        child.material.transparent = currentOpacity.current < 0.99;
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Chain */}
      <mesh geometry={chainGeometry}>
        <meshStandardMaterial color="#E8E8E8" metalness={1.0} roughness={0.05} envMapIntensity={5.0} />
      </mesh>

      {/* Pendant Assembly */}
      <group position={pendantPos}>
        {/* Bail (attaches pendant to chain) */}
        <mesh geometry={bailGeo} position={[0, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <meshStandardMaterial color="#E8E8E8" metalness={1.0} roughness={0.05} envMapIntensity={5.0} />
        </mesh>

        {/* The Pear Diamond */}
        <mesh geometry={diamondGeo} position={[0, -0.15, 0]}>
          {/* @ts-ignore - dispersion is available in newer three.js */}
          <meshPhysicalMaterial
            color="#FFFFFF"
            transmission={1.0}
            opacity={1}
            metalness={0}
            roughness={0}
            ior={2.42}
            thickness={0.8}
            dispersion={1.5} // Fire/Rainbow effect!
            envMapIntensity={6.0}
            clearcoat={1.0}
            clearcoatRoughness={0.0}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Bottom V-Prong securing the tip */}
        <mesh geometry={bottomProngGeo} position={[0, -0.63, 0]} rotation={[0, 0, Math.PI]}>
          <meshStandardMaterial color="#E8E8E8" metalness={1.0} roughness={0.05} envMapIntensity={5.0} />
        </mesh>
        
        {/* Top Prongs */}
        <mesh position={[-0.15, 0.0, 0]} rotation={[0, 0, -Math.PI / 8]}>
          <cylinderGeometry args={[0.015, 0.015, 0.1, 16]} />
          <meshStandardMaterial color="#E8E8E8" metalness={1.0} roughness={0.05} envMapIntensity={5.0} />
        </mesh>
        <mesh position={[0.15, 0.0, 0]} rotation={[0, 0, Math.PI / 8]}>
          <cylinderGeometry args={[0.015, 0.015, 0.1, 16]} />
          <meshStandardMaterial color="#E8E8E8" metalness={1.0} roughness={0.05} envMapIntensity={5.0} />
        </mesh>
      </group>
    </group>
  );
}
