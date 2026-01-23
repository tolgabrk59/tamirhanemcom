'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Html, useGLTF, Center } from '@react-three/drei';
import Link from 'next/link';
import * as THREE from 'three';

interface CarPart {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  href: string;
  color: string;
  icon: string;
}

const carParts: CarPart[] = [
  { id: 'motor', name: 'Motor', description: 'Motor bakımı, yağ değişimi', position: [0.8, 0.4, 0], href: '/servisler?category=motor-bakim', color: '#F59E0B', icon: '⚙️' },
  { id: 'fren-on', name: 'Ön Fren', description: 'Fren balataları, diskler', position: [1.3, 0.15, 0.6], href: '/servisler?category=fren', color: '#EF4444', icon: '🛑' },
  { id: 'fren-arka', name: 'Arka Fren', description: 'Fren balataları, diskler', position: [-1.1, 0.15, 0.6], href: '/servisler?category=fren', color: '#EF4444', icon: '🛑' },
  { id: 'lastik-on', name: 'Ön Lastik', description: 'Lastik değişimi, balans', position: [1.3, 0.15, -0.6], href: '/servisler?category=lastik', color: '#6B7280', icon: '🔘' },
  { id: 'lastik-arka', name: 'Arka Lastik', description: 'Lastik değişimi, balans', position: [-1.1, 0.15, -0.6], href: '/servisler?category=lastik', color: '#6B7280', icon: '🔘' },
  { id: 'far', name: 'Far Sistemi', description: 'Far değişimi, ayar', position: [1.8, 0.35, 0], href: '/servisler?category=elektrik', color: '#FBBF24', icon: '💡' },
  { id: 'egzoz', name: 'Egzoz', description: 'Egzoz sistemi', position: [-1.9, 0.2, 0], href: '/servisler?category=egzoz', color: '#F97316', icon: '💨' },
  { id: 'karoser', name: 'Karoser', description: 'Boya, kaporta işleri', position: [0, 0.7, 0.7], href: '/servisler?category=kaporta', color: '#8B5CF6', icon: '🚗' },
];

// Porsche 911 GLTF Model Component
function PorscheModel({ hoveredPart, setHoveredPart }: { hoveredPart: string | null; setHoveredPart: (id: string | null) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/car.glb');
  
  // Clone the scene to avoid sharing materials
  const clonedScene = scene.clone();
  
  // No auto rotation - user can manually rotate

  // Apply materials and settings to the model
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Enhance material properties
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.envMapIntensity = 1.5;
              }
            });
          } else if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = 1.5;
          }
        }
      }
    });
  }, [clonedScene]);

  return (
    <group ref={groupRef} position={[0, -0.35, 0]} scale={[0.8, 0.8, 0.8]}>
      {/* The actual Porsche model */}
      <Center>
        <primitive object={clonedScene} />
      </Center>
      
      {/* Interactive Hotspots */}
      {carParts.map((part) => (
        <group key={part.id} position={part.position}>
          <Html center distanceFactor={3}>
            <Link href={part.href}>
              <div 
                className={`relative cursor-pointer transition-all duration-300 ${
                  hoveredPart === part.id ? 'scale-150 z-50' : 'scale-100'
                }`}
                onMouseEnter={() => setHoveredPart(part.id)}
                onMouseLeave={() => setHoveredPart(null)}
              >
                {/* Outer pulse ring */}
                <div 
                  className="absolute rounded-full animate-ping"
                  style={{ 
                    backgroundColor: `${part.color}40`,
                    width: 36, 
                    height: 36, 
                    left: -18, 
                    top: -18,
                  }}
                />
                {/* Inner glow */}
                <div 
                  className="absolute rounded-full animate-pulse"
                  style={{ 
                    backgroundColor: `${part.color}60`,
                    width: 28, 
                    height: 28, 
                    left: -14, 
                    top: -14,
                    filter: 'blur(4px)'
                  }}
                />
                {/* Main hotspot */}
                <div 
                  className="relative w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white/60 backdrop-blur-sm"
                  style={{ 
                    backgroundColor: part.color,
                    boxShadow: `0 0 20px ${part.color}80`
                  }}
                >
                  <span className="text-xs">{part.icon}</span>
                </div>
                
                {/* Tooltip on hover */}
                {hoveredPart === part.id && (
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-md text-white px-4 py-3 rounded-xl whitespace-nowrap shadow-2xl z-50 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{part.icon}</span>
                      <p className="font-bold text-base">{part.name}</p>
                    </div>
                    <p className="text-sm text-gray-400">{part.description}</p>
                    <div 
                      className="mt-2 text-xs py-1.5 px-3 rounded-lg text-center font-medium"
                      style={{ backgroundColor: `${part.color}30`, color: part.color }}
                    >
                      Servis Bul →
                    </div>
                  </div>
                )}
              </div>
            </Link>
          </Html>
        </group>
      ))}
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/car.glb');

function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-800/95 to-slate-900/98">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🚗</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-white font-medium">3D Model Yükleniyor</p>
        <p className="text-gray-400 text-sm">Porsche 911 Carrera 4S</p>
      </div>
    </div>
  );
}

export default function Car3DViewer() {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
      {/* Decorative outer glow */}
      <div className="absolute -inset-6 bg-gradient-to-r from-primary-500/20 via-blue-500/10 to-primary-400/20 rounded-[2.5rem] blur-2xl" />

      {/* Main Container */}
      <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/98 backdrop-blur-lg rounded-3xl shadow-2xl ring-1 ring-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-slate-800/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <span className="text-lg">🏎️</span>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold">3D Araç Modeli</h3>
              <p className="text-xs text-gray-400">Porsche 911 Carrera 4S</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span>Döndür & Keşfet</span>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="relative h-[420px] w-full">
          <Suspense fallback={<LoadingSpinner />}>
            <Canvas 
              shadows 
              dpr={[1, 2]}
              onCreated={() => setIsLoaded(true)}
            >
              <PerspectiveCamera makeDefault position={[5, 2.5, 5]} fov={35} />
              
              {/* Enhanced Lighting for realistic car rendering */}
              <ambientLight intensity={0.4} />
              <directionalLight 
                position={[10, 15, 10]} 
                intensity={1.8} 
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
              />
              <directionalLight position={[-8, 8, -8]} intensity={0.6} color="#93C5FD" />
              <spotLight 
                position={[0, 15, 0]} 
                intensity={0.8} 
                angle={0.5} 
                penumbra={1} 
                castShadow
              />
              <pointLight position={[5, 2, 0]} intensity={0.3} color="#FCD34D" />
              <pointLight position={[-5, 2, 0]} intensity={0.3} color="#60A5FA" />

              {/* Simple hemisphere light instead of external HDR */}
              <hemisphereLight intensity={0.6} groundColor="#1a1a2e" />

              {/* Porsche Model */}
              <PorscheModel hoveredPart={hoveredPart} setHoveredPart={setHoveredPart} />
              
              {/* Ground Shadow */}
              <ContactShadows 
                position={[0, -0.5, 0]} 
                opacity={0.7} 
                scale={8} 
                blur={2.5} 
                far={6}
              />
              
              {/* Controls */}
              <OrbitControls 
                enablePan={false}
                enableZoom={true}
                minDistance={4}
                maxDistance={12}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2.1}
                autoRotate={false}
                autoRotateSpeed={0}
              />
            </Canvas>
          </Suspense>
        </div>

        {/* Selected Part Detail Panel */}
        {hoveredPart && (
          <div className="absolute top-20 right-4 bg-gradient-to-br from-gray-900/98 to-gray-800/95 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/10 w-56 animate-fadeIn z-20">
            {carParts.filter(p => p.id === hoveredPart).map(part => (
              <div key={part.id}>
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${part.color}25` }}
                  >
                    {part.icon}
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{part.name}</p>
                    <p className="text-gray-400 text-xs">{part.description}</p>
                  </div>
                </div>
                <Link 
                  href={part.href}
                  className="block w-full text-center text-sm py-2.5 rounded-xl transition-all duration-300 text-white font-semibold hover:scale-105"
                  style={{ 
                    backgroundColor: part.color,
                    boxShadow: `0 4px 20px ${part.color}50`
                  }}
                >
                  Servis Bul →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Part Legend */}
        <div className="p-4 border-t border-white/10 bg-gradient-to-r from-slate-800/30 to-transparent">
          <div className="flex flex-wrap gap-2 justify-center">
            {carParts.filter((_, i) => i < 6).map(part => (
              <button
                key={part.id}
                onClick={() => setHoveredPart(hoveredPart === part.id ? null : part.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                  hoveredPart === part.id 
                    ? 'scale-110 shadow-lg' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{ 
                  backgroundColor: hoveredPart === part.id ? `${part.color}30` : 'rgba(255,255,255,0.05)',
                  color: hoveredPart === part.id ? part.color : '#9CA3AF',
                  borderColor: part.color,
                  borderWidth: hoveredPart === part.id ? 1 : 0
                }}
              >
                <span>{part.icon}</span>
                <span>{part.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-4 pb-4 grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-gradient-to-br from-primary-500/10 to-transparent border border-primary-500/20">
            <p className="text-2xl font-bold text-primary-400">500+</p>
            <p className="text-xs text-gray-400">Onaylı Servis</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
            <p className="text-2xl font-bold text-blue-400">81</p>
            <p className="text-xs text-gray-400">İl Kapsama</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
            <p className="text-2xl font-bold text-green-400">50K+</p>
            <p className="text-xs text-gray-400">Mutlu Müşteri</p>
          </div>
        </div>
      </div>
    </div>
  );
}
