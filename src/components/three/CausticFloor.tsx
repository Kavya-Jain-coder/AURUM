'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CausticFloorProps {
  visible: boolean;
}

const causticFragShader = `
  uniform float uTime;
  varying vec2 vUv;

  float causticPattern(vec2 uv, float time) {
    float c = 0.0;
    vec2 p = uv * 8.0;
    for (float i = 1.0; i < 6.0; i++) {
      p = abs(p) / dot(p, p) - vec2(0.9 + sin(time * 0.2) * 0.1);
      c += 1.0 / (1.0 + length(p) * 4.0);
    }
    return c;
  }

  void main() {
    float c = causticPattern(vUv, uTime);
    // Gold-tinted caustics
    vec3 col = vec3(c * 0.8, c * 0.6, c * 0.2) * 0.4;
    gl_FragColor = vec4(col, c * 0.3);
  }
`;

const causticVertShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export function CausticFloor({ visible }: CausticFloorProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current || !meshRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    meshRef.current.visible = visible;
  });

  return (
    <mesh
      ref={meshRef}
      visible={visible}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.5, 0]}
    >
      <planeGeometry args={[10, 10, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={causticVertShader}
        fragmentShader={causticFragShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
