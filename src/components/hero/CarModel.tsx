'use client';

import { useRef, useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { carParts, hotspotPositions } from './data';

interface CarModelProps {
  onLoaded: () => void;
  onPartClick: (partId: string) => void;
  hoveredPart: string | null;
  setHoveredPart: (partId: string | null) => void;
}

export function CarModel({ onLoaded, onPartClick, hoveredPart, setHoveredPart }: CarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [gltf, setGltf] = useState<any>(null);

  useEffect(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      '/models/car1.glb',
      (loadedGltf) => {
        loadedGltf.scene.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        setGltf(loadedGltf);
        onLoaded();
      },
      undefined,
      (error) => {
        console.error('[CarModel] Error loading car model:', error);
      }
    );

    return () => {
      dracoLoader.dispose();
    };
  }, [onLoaded]);

  useEffect(() => {
    if (!gltf) return;
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.cursor = 'pointer';
      }
    });
  }, [gltf]);

  if (!gltf) return null;

  return (
    <group ref={groupRef} position={[0, 0.2, 0]} scale={0.95}>
      <primitive object={gltf.scene} />

      {Object.entries(hotspotPositions).map(([partId, position]) => {
        const part = carParts.find(p => p.id === partId);
        if (!part) return null;
        const isHovered = hoveredPart === partId;

        return (
          <Html
            key={partId}
            position={position}
            center
            sprite
            zIndexRange={[10, 0]}
            style={{ pointerEvents: 'auto' }}
          >
            <div
              className="relative cursor-pointer flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onPartClick(partId);
              }}
              onMouseEnter={() => setHoveredPart(partId)}
              onMouseLeave={() => setHoveredPart(null)}
            >
              <span
                className="absolute w-6 h-6 rounded-full animate-ping opacity-25"
                style={{ backgroundColor: part.color }}
              />
              <div
                className={`relative w-3 h-3 rounded-full border border-white/80 transition-all duration-300 ${isHovered ? 'scale-150' : 'scale-100'}`}
                style={{
                  background: part.color,
                  boxShadow: `0 0 ${isHovered ? '12px' : '6px'} ${part.color}`,
                }}
              />
              <div
                className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-medium whitespace-nowrap transition-all duration-300 ${isHovered ? 'opacity-100 scale-105' : 'opacity-80'}`}
                style={{
                  backgroundColor: `${part.color}CC`,
                  color: 'white',
                  boxShadow: isHovered ? `0 4px 12px ${part.color}50` : `0 2px 8px ${part.color}50`,
                }}
              >
                {part.name}
              </div>
            </div>
          </Html>
        );
      })}
    </group>
  );
}
