'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Html, useGLTF, Center } from '@react-three/drei';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
// Optimized Three.js imports - only import what's needed for tree-shaking
import { Group, Mesh, MeshStandardMaterial } from 'three';
import type { Group as GroupType } from 'three';
import { Icon } from './ui/Icons';

// Kategori ve parça verileri
interface CarPart {
  id: string;
  name: string;
  category: string;
  description: string;
  details: string[];
  priceRange: string;
  duration: string;
  href: string;
  color: string;
  icon: string;
  position: [number, number, number]; // 3D pozisyon
}

const categories = [
  { id: 'all', name: 'Tümü', icon: 'car', color: '#FBC91D' },
  { id: 'motor', name: 'Motor', icon: 'motor', color: '#F59E0B' },
  { id: 'fren', name: 'Fren', icon: 'fren', color: '#EF4444' },
  { id: 'lastik', name: 'Lastik', icon: 'lastik', color: '#6366F1' },
  { id: 'elektrik', name: 'Elektrik', icon: 'elektrik', color: '#10B981' },
  { id: 'karoser', name: 'Karoser', icon: 'karoser', color: '#8B5CF6' },
];

const carParts: CarPart[] = [
  {
    id: 'motor',
    name: 'Motor',
    category: 'motor',
    description: 'Aracınızın kalbi - periyodik bakım şart',
    details: ['Yağ değişimi', 'Filtre değişimi', 'Triger kayışı', 'Motor arıza tespiti'],
    priceRange: '500 - 15.000 ₺',
    duration: '1-4 saat',
    href: '/servisler?category=motor-bakim',
    color: '#F59E0B',
    icon: 'motor',
    position: [0.8, 0.4, 0]
  },
  {
    id: 'fren-on',
    name: 'Ön Frenler',
    category: 'fren',
    description: 'Güvenliğiniz için kritik öneme sahip',
    details: ['Balata değişimi', 'Disk değişimi', 'Fren hidroliği', 'ABS sensör'],
    priceRange: '600 - 4.000 ₺',
    duration: '1-2 saat',
    href: '/servisler?category=fren',
    color: '#EF4444',
    icon: 'fren',
    position: [1.3, 0.15, 0.6]
  },
  {
    id: 'fren-arka',
    name: 'Arka Frenler',
    category: 'fren',
    description: 'Dengeli frenleme için önemli',
    details: ['Balata değişimi', 'Kampana/Disk', 'El freni ayarı'],
    priceRange: '500 - 3.500 ₺',
    duration: '1-2 saat',
    href: '/servisler?category=fren',
    color: '#EF4444',
    icon: 'fren',
    position: [-1.1, 0.15, 0.6]
  },
  {
    id: 'lastik-on',
    name: 'Ön Lastikler',
    category: 'lastik',
    description: 'Yol tutuş ve güvenlik',
    details: ['Lastik değişimi', 'Balans ayarı', 'Rot ayarı', 'Lastik tamiri'],
    priceRange: '800 - 8.000 ₺',
    duration: '30dk - 1 saat',
    href: '/servisler?category=lastik',
    color: '#6366F1',
    icon: 'lastik',
    position: [1.3, 0.15, -0.6]
  },
  {
    id: 'lastik-arka',
    name: 'Arka Lastikler',
    category: 'lastik',
    description: 'Stabilite ve çekiş',
    details: ['Lastik değişimi', 'Balans ayarı', 'Jant düzeltme'],
    priceRange: '800 - 8.000 ₺',
    duration: '30dk - 1 saat',
    href: '/servisler?category=lastik',
    color: '#6366F1',
    icon: 'lastik',
    position: [-1.1, 0.15, -0.6]
  },
  {
    id: 'far',
    name: 'Far Sistemi',
    category: 'elektrik',
    description: 'Gece sürüş güvenliği',
    details: ['Far ampulü', 'Xenon/LED', 'Far ayarı', 'Far camı'],
    priceRange: '200 - 5.000 ₺',
    duration: '30dk - 2 saat',
    href: '/servisler?category=elektrik',
    color: '#10B981',
    icon: 'elektrik',
    position: [1.8, 0.35, 0]
  },
  {
    id: 'egzoz',
    name: 'Egzoz Sistemi',
    category: 'motor',
    description: 'Emisyon ve performans',
    details: ['Egzoz değişimi', 'Katalitik konvertör', 'Susturucu'],
    priceRange: '500 - 8.000 ₺',
    duration: '1-3 saat',
    href: '/servisler?category=egzoz',
    color: '#F97316',
    icon: 'egzoz',
    position: [-1.9, 0.2, 0]
  },
  {
    id: 'karoser',
    name: 'Karoser',
    category: 'karoser',
    description: 'Boya ve kaporta işleri',
    details: ['Boyama', 'Göçük düzeltme', 'Parlatma', 'Seramik kaplama'],
    priceRange: '2.000 - 30.000 ₺',
    duration: '1-5 gün',
    href: '/servisler?category=kaporta',
    color: '#8B5CF6',
    icon: 'karoser',
    position: [0, 0.7, 0.8]
  },
];

// 3D Porsche Model Component
function PorscheModel({
  selectedCategory,
  hoveredPart,
  setHoveredPart,
  onPartClick
}: {
  selectedCategory: string;
  hoveredPart: string | null;
  setHoveredPart: (id: string | null) => void;
  onPartClick: (part: CarPart) => void;
}) {
  const groupRef = useRef<GroupType>(null);
  const { scene } = useGLTF('/models/car.glb');

  const clonedScene = scene.clone();

  // Filtrelenmiş parçalar
  const filteredParts = selectedCategory === 'all'
    ? carParts
    : carParts.filter(p => p.category === selectedCategory);

  // Auto rotation when not hovering
  useFrame(() => {
    if (groupRef.current && !hoveredPart) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  // Apply materials
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material instanceof MeshStandardMaterial) {
          child.material.envMapIntensity = 1.5;
        }
      }
    });
  }, [clonedScene]);

  return (
    <group ref={groupRef} position={[0, -0.35, 0]} scale={[0.85, 0.85, 0.85]}>
      <Center>
        <primitive object={clonedScene} />
      </Center>

      {/* Interactive Hotspots */}
      {filteredParts.map((part) => (
        <group key={part.id} position={part.position}>
          <Html center distanceFactor={3}>
            <motion.div
              className="relative cursor-pointer"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: hoveredPart === part.id ? 1.4 : 1,
                opacity: 1
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onMouseEnter={() => setHoveredPart(part.id)}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => onPartClick(part)}
            >
              {/* Outer pulse ring */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  backgroundColor: `${part.color}40`,
                  width: 44,
                  height: 44,
                  left: -22,
                  top: -22,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 0, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Inner glow */}
              <div
                className="absolute rounded-full animate-pulse"
                style={{
                  backgroundColor: `${part.color}60`,
                  width: 32,
                  height: 32,
                  left: -16,
                  top: -16,
                  filter: 'blur(6px)'
                }}
              />

              {/* Main hotspot button */}
              <motion.div
                className="relative w-9 h-9 rounded-full flex items-center justify-center shadow-xl border-2 border-white/70 backdrop-blur-sm"
                style={{
                  backgroundColor: part.color,
                  boxShadow: `0 0 25px ${part.color}90`
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon id={part.icon} className="w-5 h-5" color="white" />
              </motion.div>

              {/* Tooltip on hover */}
              <AnimatePresence>
                {hoveredPart === part.id && (
                  <motion.div
                    className="absolute left-12 top-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-xl text-white px-5 py-4 rounded-2xl whitespace-nowrap shadow-2xl z-50 border border-white/10"
                    initial={{ opacity: 0, x: -10, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon id={part.icon} className="w-6 h-6" color={part.color} />
                      <div>
                        <p className="font-bold text-lg">{part.name}</p>
                        <p className="text-sm text-gray-400">{part.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10">
                      <div>
                        <p className="text-xs text-gray-500">Fiyat</p>
                        <p className="text-sm font-semibold text-primary-400">{part.priceRange}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Süre</p>
                        <p className="text-sm font-semibold text-green-400">{part.duration}</p>
                      </div>
                    </div>
                    <motion.div
                      className="mt-3 text-xs py-2 px-4 rounded-xl text-center font-semibold"
                      style={{ backgroundColor: `${part.color}30`, color: part.color }}
                      whileHover={{ backgroundColor: `${part.color}50` }}
                    >
                      Tıkla → Usta Bul
                    </motion.div>

                    {/* Arrow */}
                    <div
                      className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-0 h-0"
                      style={{
                        borderTop: '8px solid transparent',
                        borderBottom: '8px solid transparent',
                        borderRight: '8px solid rgba(17, 24, 39, 0.95)'
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Html>
        </group>
      ))}
    </group>
  );
}

// Preload model
useGLTF.preload('/models/car.glb');

// Loading Component
function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon id="car" className="w-8 h-8" color="#FBC91D" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-white font-semibold text-lg">3D Model Yükleniyor</p>
        <p className="text-gray-400 text-sm">Porsche 911 Carrera 4S</p>
      </div>
    </div>
  );
}

// Main Component
export default function InteractiveCarExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPart, setSelectedPart] = useState<CarPart | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePartClick = (part: CarPart) => {
    setSelectedPart(part);
  };

  const handleClose = () => {
    setSelectedPart(null);
  };

  return (
    <div className="relative w-full">
      {/* Outer Glow Effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-purple-500/10 to-cyan-500/20 rounded-[2.5rem] blur-2xl opacity-70" />

      {/* Main Container */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">

        {/* Header */}
        <div className="relative px-5 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Icon id="car" className="w-6 h-6" color="white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">3D Araç Parça Seçici</h3>
                <p className="text-gray-400 text-xs">Parçaya tıklayın, usta bulun</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-gray-300 text-sm font-medium">500+ Usta Hazır</span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-3 border-b border-white/5 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {categories.map(cat => (
              <motion.button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300`}
                style={{
                  backgroundColor: selectedCategory === cat.id ? cat.color : 'rgba(255,255,255,0.05)',
                  color: selectedCategory === cat.id ? (cat.id === 'all' ? '#1F2937' : 'white') : '#9CA3AF',
                  boxShadow: selectedCategory === cat.id ? `0 4px 20px ${cat.color}40` : 'none'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon id={cat.icon} className="w-5 h-5" color={selectedCategory === cat.id ? (cat.id === 'all' ? '#1F2937' : 'white') : '#9CA3AF'} />
                <span>{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="relative h-[450px] w-full">
          <Suspense fallback={<LoadingSpinner />}>
            <Canvas
              shadows
              dpr={[1, 2]}
              onCreated={() => setIsLoaded(true)}
              className="touch-none"
            >
              <PerspectiveCamera makeDefault position={[5, 2.5, 5]} fov={35} />

              {/* Lighting */}
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[10, 15, 10]}
                intensity={2}
                castShadow
                shadow-mapSize={[2048, 2048]}
              />
              <directionalLight position={[-8, 8, -8]} intensity={0.7} color="#93C5FD" />
              <spotLight position={[0, 15, 0]} intensity={1} angle={0.5} penumbra={1} castShadow />
              <pointLight position={[5, 2, 0]} intensity={0.4} color="#FCD34D" />
              <pointLight position={[-5, 2, 0]} intensity={0.4} color="#60A5FA" />

              {/* Environment */}
              <Environment preset="city" />

              {/* Car Model */}
              <PorscheModel
                selectedCategory={selectedCategory}
                hoveredPart={hoveredPart}
                setHoveredPart={setHoveredPart}
                onPartClick={handlePartClick}
              />

              {/* Ground Shadow */}
              <ContactShadows
                position={[0, -0.5, 0]}
                opacity={0.7}
                scale={10}
                blur={2.5}
                far={6}
              />

              {/* Controls */}
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={3.5}
                maxDistance={10}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2.1}
                autoRotate={!hoveredPart && !selectedPart}
                autoRotateSpeed={0.6}
              />
            </Canvas>
          </Suspense>

          {/* Instructions Overlay */}
          {isLoaded && !selectedPart && (
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <span className="text-gray-300 text-sm">Döndürmek için sürükle • Noktaya tıkla</span>
            </motion.div>
          )}
        </div>

        {/* Part Detail Modal */}
        <AnimatePresence>
          {selectedPart && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm z-20"
                onClick={handleClose}
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute inset-4 sm:inset-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl z-30 overflow-hidden border border-white/10 shadow-2xl flex flex-col"
              >
                {/* Modal Header */}
                <div
                  className="relative px-6 py-5 border-b border-white/10"
                  style={{ background: `linear-gradient(135deg, ${selectedPart.color}25 0%, transparent 100%)` }}
                >
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-4">
                    <motion.div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl text-3xl"
                      style={{ backgroundColor: selectedPart.color }}
                      initial={{ rotate: -15, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                    >
                      <Icon id={selectedPart.icon} className="w-8 h-8" color="white" />
                    </motion.div>
                    <div>
                      <motion.h2
                        className="text-2xl font-bold text-white"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {selectedPart.name}
                      </motion.h2>
                      <motion.p
                        className="text-gray-400"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        {selectedPart.description}
                      </motion.p>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-auto p-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Services */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                          <Icon id="wrench" className="w-4 h-4" color="white" />
                        </span>
                        Yapılan İşlemler
                      </h3>
                      <div className="space-y-2">
                        {selectedPart.details.map((detail, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 + idx * 0.05 }}
                            className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors"
                          >
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: selectedPart.color }}
                            />
                            <span className="text-gray-300">{detail}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Price & Duration */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-5 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon id="money" className="w-5 h-5" color="#22C55E" />
                          <h3 className="text-gray-400 text-sm">Tahmini Fiyat Aralığı</h3>
                        </div>
                        <p className="text-3xl font-bold text-white">{selectedPart.priceRange}</p>
                        <p className="text-gray-500 text-sm mt-1">Parça ve işçilik dahil</p>
                      </div>

                      <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-5 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon id="calendar" className="w-5 h-5" color="#60A5FA" />
                          <h3 className="text-gray-400 text-sm">Tahmini Süre</h3>
                        </div>
                        <p className="text-2xl font-bold text-white">{selectedPart.duration}</p>
                        <p className="text-gray-500 text-sm mt-1">Ortalama işlem süresi</p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-5 border-t border-white/10 bg-white/5">
                  <Link
                    href={selectedPart.href}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      backgroundColor: selectedPart.color,
                      boxShadow: `0 10px 40px ${selectedPart.color}50`
                    }}
                  >
                    <Icon id="search" className="w-5 h-5" color="white" />
                    <span>{selectedPart.name} Ustası Bul</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Quick Stats */}
        <div className="px-4 py-4 border-t border-white/5 grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-gradient-to-br from-primary-500/15 to-transparent border border-primary-500/20">
            <p className="text-2xl font-bold text-primary-400">500+</p>
            <p className="text-xs text-gray-400">Onaylı Servis</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-500/15 to-transparent border border-blue-500/20">
            <p className="text-2xl font-bold text-blue-400">81</p>
            <p className="text-xs text-gray-400">İl Kapsama</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-gradient-to-br from-green-500/15 to-transparent border border-green-500/20">
            <p className="text-2xl font-bold text-green-400">50K+</p>
            <p className="text-xs text-gray-400">Mutlu Müşteri</p>
          </div>
        </div>
      </div>
    </div>
  );
}
