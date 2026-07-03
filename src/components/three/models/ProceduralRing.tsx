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

const materialPresets = {
  'default':       { color: '#D4AF37', metalness: 1.0, roughness: 0.05 }, // Rich gold
  'diamond-focus': { color: '#E8E8E8', metalness: 1.0, roughness: 0.03 },
  'white-gold':    { color: '#E8E8E8', metalness: 1.0, roughness: 0.03 },
  'rose-gold':     { color: '#E0BFB8', metalness: 1.0, roughness: 0.05 },
  'platinum':      { color: '#E5E4E2', metalness: 1.0, roughness: 0.02 },
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

  // Band: Ultra-smooth, comfort-fit Torus
  const bandGeometry = useMemo(() => {
    const geo = new THREE.TorusGeometry(0.8, 0.08, 128, 256);
    geo.scale(1, 1, 0.7); // Flatten slightly for a "D" shape
    return geo;
  }, []);

  // Diamond: Using a carefully scaled Icosahedron for a faceted "cushion cut" look
  const diamondGeo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.3, 0);
    // Scale to make it look like a brilliant cut (flatter on top, pointed on bottom)
    // By default Icosahedron is symmetric. We can modify vertices for a perfect diamond.
    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      if (y > 0.1) {
        positions.setY(i, 0.1); // Flatten the table
      } else if (y < 0) {
        positions.setY(i, y * 1.5); // Deepen the pavilion
      }
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Prongs: 4 curved prongs gripping the diamond
  const prongs = useMemo(() => {
    const count = 4;
    const radius = 0.22;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + (Math.PI / 4);
      return {
        pos: [
          Math.cos(angle) * radius,
          0.85, 
          Math.sin(angle) * radius,
        ] as [number, number, number],
        rot: angle
      };
    });
  }, []);
  
  // A curved prong that grabs the stone
  const prongGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.15, 0),
      new THREE.Vector3(-0.05, 0.22, 0), // Curves inward
    ]);
    return new THREE.TubeGeometry(curve, 16, 0.015, 16, false);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, opacity, 0.05);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.05);

    groupRef.current.scale.setScalar(Math.max(currentScale.current, 0.001));
    groupRef.current.visible = visible && currentScale.current > 0.01;

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
        child.material.opacity = currentOpacity.current;
        child.material.transparent = currentOpacity.current < 0.99;
      }
    });

    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[Math.PI * 0.1, 0, 0]}>
      {/* Main Solid Band */}
      <mesh geometry={bandGeometry}>
        <meshStandardMaterial
          color={preset.color}
          metalness={preset.metalness}
          roughness={preset.roughness}
          envMapIntensity={4.0}
        />
      </mesh>

      {/* Center Diamond */}
      <group position={[0, 0.92, 0]}>
        <mesh geometry={diamondGeo}>
          {/* @ts-ignore - dispersion is available in newer three.js versions but types might lag */}
          <meshPhysicalMaterial
            color="#FFFFFF"
            transmission={1.0}
            opacity={1}
            metalness={0}
            roughness={0}
            ior={2.42} // Diamond IOR
            thickness={1.0}
            dispersion={1.5} // Fire/Rainbow effect!
            envMapIntensity={6.0}
            clearcoat={1.0}
            clearcoatRoughness={0.0}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Prongs */}
      {prongs.map((p, i) => (
        <mesh key={`prong-${i}`} geometry={prongGeo} position={p.pos} rotation={[0, -p.rot, 0]}>
          <meshStandardMaterial
            color={preset.color}
            metalness={preset.metalness}
            roughness={preset.roughness}
            envMapIntensity={4.0}
          />
        </mesh>
      ))}
    </group>
  );
}
