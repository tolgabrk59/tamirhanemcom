'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function TireModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.4, 32, 64]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.1} />
      </mesh>

      {[...Array(24)].map((_, i) => (
        <mesh
          key={i}
          rotation={[Math.PI / 2, 0, (i / 24) * Math.PI * 2]}
          position={[
            Math.cos((i / 24) * Math.PI * 2) * 1,
            0,
            Math.sin((i / 24) * Math.PI * 2) * 1,
          ]}
        >
          <boxGeometry args={[0.08, 0.45, 0.15]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
        </mesh>
      ))}

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.08, 16, 32]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.2} metalness={0.9} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.15, 32]} />
        <meshStandardMaterial color="#a0a0a0" roughness={0.3} metalness={0.8} />
      </mesh>

      {[...Array(5)].map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i / 5) * Math.PI * 2]} position={[0, 0, 0]}>
          <boxGeometry args={[0.12, 0.12, 0.5]} />
          <meshStandardMaterial color="#b0b0b0" roughness={0.2} metalness={0.9} />
        </mesh>
      ))}

      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
        <meshStandardMaterial color="#808080" roughness={0.3} metalness={0.9} />
      </mesh>
    </group>
  );
}
