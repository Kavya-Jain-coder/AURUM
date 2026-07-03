'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GoldParticlesProps {
  visible: boolean;
  collapse: number; // 0 = scattered nebula, 1 = collapsed into ring
  isMobile: boolean;
}

// Custom vertex shader for gold particles
const vertexShader = `
  uniform float uTime;
  uniform float uCollapse;
  attribute vec3 aInitialPos;
  attribute vec3 aTargetPos;
  attribute float aSize;
  attribute float aSpeed;
  varying float vAlpha;

  void main() {
    // Lerp between scattered position and ring target position
    vec3 pos = mix(aInitialPos, aTargetPos, uCollapse);

    // Organic drift when scattered
    float drift = 1.0 - uCollapse;
    pos.x += sin(uTime * 0.3 * aSpeed + aInitialPos.y * 2.0) * drift * 2.0;
    pos.y += cos(uTime * 0.2 * aSpeed + aInitialPos.x * 2.0) * drift * 2.0;
    pos.z += sin(uTime * 0.25 * aSpeed + aInitialPos.z * 2.0) * drift * 1.5;

    // Slight sparkle movement even when collapsed
    pos.x += sin(uTime * 2.0 + aInitialPos.y * 10.0) * 0.01 * uCollapse;
    pos.y += cos(uTime * 1.8 + aInitialPos.x * 10.0) * 0.01 * uCollapse;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    // Smaller point size for subtle stardust
    gl_PointSize = (aSize * 20.0 / max(-mvPos.z, 1.0)) * (0.3 + uCollapse * 0.7);
    gl_Position = projectionMatrix * mvPos;

    // Fade particles as they collapse into ring
    vAlpha = mix(0.4, 0.8, uCollapse);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    // Very soft glowing edges
    float alpha = 1.0 - smoothstep(0.1, 0.5, d);

    // Dimmed colors so additive blending creates a rich gold glow instead of blowing out to white
    vec3 goldDark = vec3(0.08, 0.05, 0.01);
    vec3 goldBright = vec3(0.2, 0.15, 0.05);
    float shimmer = sin(uTime * 2.0 + gl_PointCoord.x * 10.0) * 0.5 + 0.5;
    vec3 col = mix(goldDark, goldBright, shimmer);

    gl_FragColor = vec4(col, alpha * vAlpha);
  }
`;

export function GoldParticles({ visible, collapse, isMobile }: GoldParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // FIX 3: Particle count determined by device, reduced to prevent WebGL blowout
  const COUNT = isMobile ? 5000 : 20000;

  const { positions, initialPositions, targetPositions, sizes, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const initialPositions = new Float32Array(COUNT * 3);
    const targetPositions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;

      // Scattered nebula positions (sphere distribution)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 5;
      initialPositions[i3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      initialPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      initialPositions[i3 + 2] = r * Math.cos(phi);

      // Target ring positions (torus surface)
      const ringAngle = Math.random() * Math.PI * 2;
      const tubeAngle = Math.random() * Math.PI * 2;
      const ringRadius = 0.8;
      const tubeRadius = 0.08 + Math.random() * 0.05;
      targetPositions[i3 + 0] = (ringRadius + tubeRadius * Math.cos(tubeAngle)) * Math.cos(ringAngle);
      targetPositions[i3 + 1] = (ringRadius + tubeRadius * Math.cos(tubeAngle)) * Math.sin(ringAngle);
      targetPositions[i3 + 2] = tubeRadius * Math.sin(tubeAngle);

      // Start at initial positions
      positions[i3 + 0] = initialPositions[i3 + 0];
      positions[i3 + 1] = initialPositions[i3 + 1];
      positions[i3 + 2] = initialPositions[i3 + 2];

      sizes[i] = 1.0 + Math.random() * 3.0;
      speeds[i] = 0.5 + Math.random() * 1.5;
    }

    return { positions, initialPositions, targetPositions, sizes, speeds };
  }, [COUNT]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCollapse: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current || !pointsRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    materialRef.current.uniforms.uCollapse.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uCollapse.value,
      collapse,
      0.03
    );
    pointsRef.current.visible = visible;
  });

  return (
    <points ref={pointsRef} visible={visible}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aInitialPos"
          array={initialPositions}
          count={COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aTargetPos"
          array={targetPositions}
          count={COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          array={sizes}
          count={COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          array={speeds}
          count={COUNT}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
