'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface CarPart {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number };
  href: string;
  color: string;
  icon: React.ReactNode;
}

const carParts: CarPart[] = [
  {
    id: 'motor',
    name: 'Motor',
    description: 'Motor bakımı, yağ değişimi, triger kayışı',
    position: { x: 20, y: 35 },
    href: '/servisler?category=motor-bakim',
    color: '#F59E0B',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'fren',
    name: 'Fren Sistemi',
    description: 'Fren balataları, diskler, hidrolik',
    position: { x: 15, y: 65 },
    href: '/servisler?category=fren',
    color: '#EF4444',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    id: 'sanziman',
    name: 'Şanzıman',
    description: 'Vites kutusu, debriyaj, diferansiyel',
    position: { x: 35, y: 55 },
    href: '/servisler?category=sanziman',
    color: '#3B82F6',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <circle cx="12" cy="12" r="3" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    id: 'elektrik',
    name: 'Elektrik',
    description: 'Akü, alternatör, marş motoru',
    position: { x: 45, y: 25 },
    href: '/servisler?category=elektrik',
    color: '#FBBF24',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'suspansiyon',
    name: 'Süspansiyon',
    description: 'Amortisörler, rotiller, salıncaklar',
    position: { x: 25, y: 75 },
    href: '/servisler?category=suspansiyon',
    color: '#8B5CF6',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
  },
  {
    id: 'klima',
    name: 'Klima',
    description: 'Klima gazı, kompresör, kalorifer',
    position: { x: 50, y: 40 },
    href: '/servisler?category=klima',
    color: '#06B6D4',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'lastik',
    name: 'Lastik',
    description: 'Lastik değişimi, balans, rot ayarı',
    position: { x: 75, y: 70 },
    href: '/servisler?category=lastik',
    color: '#6B7280',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
        <circle cx="12" cy="12" r="6" strokeWidth="2"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'egzoz',
    name: 'Egzoz',
    description: 'Egzoz borusu, katalitik konvertör',
    position: { x: 85, y: 55 },
    href: '/servisler?category=egzoz',
    color: '#F97316',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    ),
  },
];

export default function InteractiveCar3D() {
  const [activePart, setActivePart] = useState<CarPart | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse/touch drag for rotation
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    setRotation(prev => prev + diff * 0.5);
    setStartX(clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className="relative">
      {/* Decorative Ring */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-primary-400/10 rounded-[2rem] blur-xl"></div>

      {/* Main Container */}
      <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-bold">Parçayı Seçin</h3>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Sürükleyerek döndürün</span>
          </div>
        </div>

        {/* 3D Car Container */}
        <div 
          ref={containerRef}
          className="relative w-full aspect-[16/10] cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Technical Drawing Style Car */}
          <div 
            className="absolute inset-0 transition-transform duration-100"
            style={{ 
              transform: `perspective(1000px) rotateY(${rotation * 0.1}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            <svg viewBox="0 0 500 280" className="w-full h-full">
              <defs>
                {/* Gradients */}
                <linearGradient id="carBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#64748B" stopOpacity="0.4"/>
                  <stop offset="50%" stopColor="#475569" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#334155" stopOpacity="0.4"/>
                </linearGradient>
                <linearGradient id="engineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.8"/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Ground shadow */}
              <ellipse cx="250" cy="260" rx="180" ry="15" fill="#000" opacity="0.2"/>

              {/* Car Outline - Technical drawing style */}
              <g stroke="#64748B" strokeWidth="1.5" fill="none">
                {/* Main body outline */}
                <path 
                  d="M60 160 
                     L70 130 L90 100 L130 70 L200 55 L320 55 L380 70 L420 100 L440 130 L450 160
                     L450 190 L440 200 L60 200 L50 190 Z"
                  fill="url(#carBodyGrad)"
                  strokeWidth="2"
                />
                
                {/* Hood lines */}
                <path d="M60 160 L150 160 L160 130 L90 130 L70 160" strokeDasharray="5,3"/>
                <path d="M90 130 L95 100 L130 80" strokeDasharray="5,3"/>
                
                {/* Front windshield */}
                <path d="M160 130 L175 75 L210 60 L205 120 L160 130" fill="#0EA5E9" fillOpacity="0.15"/>
                
                {/* Side windows */}
                <path d="M210 60 L320 55 L330 60 L335 115 L205 120 Z" fill="#0EA5E9" fillOpacity="0.15"/>
                
                {/* Rear windshield */}
                <path d="M335 115 L340 65 L380 80 L400 110 L395 125 L335 120" fill="#0EA5E9" fillOpacity="0.15"/>
                
                {/* Pillar lines */}
                <line x1="205" y1="60" x2="205" y2="120" strokeWidth="3"/>
                <line x1="265" y1="55" x2="265" y2="118" strokeWidth="3"/>
                <line x1="335" y1="60" x2="335" y2="120" strokeWidth="3"/>
                
                {/* Door line */}
                <line x1="265" y1="118" x2="265" y2="190" strokeWidth="1.5"/>
                
                {/* Door handle */}
                <rect x="220" y="145" width="20" height="4" rx="2" fill="#64748B"/>
                <rect x="340" y="145" width="20" height="4" rx="2" fill="#64748B"/>
              </g>

              {/* Engine Block - Transparent view */}
              <g transform="translate(75, 100)" filter="url(#glow)">
                {/* Engine outer */}
                <rect x="0" y="10" width="80" height="60" rx="5" fill="url(#engineGrad)" opacity="0.7"/>
                {/* Engine details */}
                <rect x="5" y="0" width="70" height="15" rx="3" fill="#0EA5E9" opacity="0.5"/>
                <text x="40" y="10" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">MOTOR</text>
                {/* Cylinders */}
                <g fill="#0284C7" opacity="0.6">
                  <rect x="10" y="20" width="15" height="45" rx="2"/>
                  <rect x="30" y="20" width="15" height="45" rx="2"/>
                  <rect x="50" y="20" width="15" height="45" rx="2"/>
                </g>
                {/* Spark plugs */}
                <g fill="#FCD34D">
                  <circle cx="17" cy="15" r="3"/>
                  <circle cx="37" cy="15" r="3"/>
                  <circle cx="57" cy="15" r="3"/>
                </g>
              </g>

              {/* Transmission */}
              <g transform="translate(165, 145)">
                <rect x="0" y="0" width="60" height="45" rx="5" fill="#3B82F6" opacity="0.5"/>
                <text x="30" y="25" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">ŞNZ</text>
              </g>

              {/* Exhaust */}
              <g transform="translate(380, 170)">
                <rect x="0" y="0" width="60" height="15" rx="3" fill="#F97316" opacity="0.5"/>
                <circle cx="55" cy="8" r="5" fill="#F97316" opacity="0.7"/>
              </g>

              {/* Wheels */}
              <g>
                {/* Front wheel */}
                <circle cx="120" cy="200" r="35" fill="#1F2937" stroke="#475569" strokeWidth="3"/>
                <circle cx="120" cy="200" r="25" fill="#374151" stroke="#4B5563" strokeWidth="2"/>
                <circle cx="120" cy="200" r="10" fill="#6B7280"/>
                {/* Wheel spokes */}
                <g stroke="#9CA3AF" strokeWidth="2">
                  <line x1="120" y1="178" x2="120" y2="190"/>
                  <line x1="120" y1="210" x2="120" y2="222"/>
                  <line x1="98" y1="200" x2="110" y2="200"/>
                  <line x1="130" y1="200" x2="142" y2="200"/>
                </g>
                {/* Brake disc */}
                <circle cx="120" cy="200" r="18" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4,2" opacity="0.6"/>
                
                {/* Rear wheel */}
                <circle cx="380" cy="200" r="35" fill="#1F2937" stroke="#475569" strokeWidth="3"/>
                <circle cx="380" cy="200" r="25" fill="#374151" stroke="#4B5563" strokeWidth="2"/>
                <circle cx="380" cy="200" r="10" fill="#6B7280"/>
                {/* Wheel spokes */}
                <g stroke="#9CA3AF" strokeWidth="2">
                  <line x1="380" y1="178" x2="380" y2="190"/>
                  <line x1="380" y1="210" x2="380" y2="222"/>
                  <line x1="358" y1="200" x2="370" y2="200"/>
                  <line x1="390" y1="200" x2="402" y2="200"/>
                </g>
                {/* Brake disc */}
                <circle cx="380" cy="200" r="18" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4,2" opacity="0.6"/>
              </g>

              {/* Suspension lines */}
              <g stroke="#8B5CF6" strokeWidth="2" opacity="0.6">
                <path d="M85 160 L100 200" strokeDasharray="3,3"/>
                <path d="M140 160 L140 200" strokeDasharray="3,3"/>
                <path d="M350 160 L360 200" strokeDasharray="3,3"/>
                <path d="M400 160 L400 200" strokeDasharray="3,3"/>
              </g>

              {/* Headlights */}
              <ellipse cx="55" cy="155" rx="8" ry="15" fill="#FCD34D" opacity="0.8"/>
              <ellipse cx="55" cy="155" rx="4" ry="8" fill="#FEF3C7"/>
              
              {/* Taillights */}
              <ellipse cx="448" cy="155" rx="6" ry="12" fill="#EF4444" opacity="0.8"/>
            </svg>
          </div>

          {/* Interactive Hotspots */}
          {carParts.map((part) => (
            <Link
              key={part.id}
              href={part.href}
              className="absolute group"
              style={{ 
                left: `${part.position.x}%`, 
                top: `${part.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseEnter={() => setActivePart(part)}
              onMouseLeave={() => setActivePart(null)}
            >
              {/* Pulse animation */}
              <div 
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ backgroundColor: part.color }}
              />
              {/* Hotspot button */}
              <div 
                className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-125 shadow-lg"
                style={{ 
                  backgroundColor: `${part.color}33`,
                  borderColor: part.color,
                  borderWidth: 2
                }}
              >
                <div style={{ color: part.color }}>
                  {part.icon}
                </div>
              </div>
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-16 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-gray-900 rounded-lg px-3 py-2 shadow-xl border border-gray-700 whitespace-nowrap">
                  <p className="text-white font-semibold text-sm">{part.name}</p>
                  <p className="text-gray-400 text-xs">{part.description}</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-gray-700"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Active Part Detail Panel */}
        {activePart && (
          <div 
            className="absolute top-4 right-4 bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-700 w-48 animate-fadeIn"
          >
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${activePart.color}33` }}
              >
                <div style={{ color: activePart.color }}>
                  {activePart.icon}
                </div>
              </div>
              <div>
                <p className="text-white font-bold">{activePart.name}</p>
                <p className="text-gray-400 text-xs">{activePart.description}</p>
              </div>
            </div>
            <Link 
              href={activePart.href}
              className="block w-full text-center text-sm py-2 rounded-lg mt-2 transition-colors"
              style={{ 
                backgroundColor: activePart.color,
                color: '#000'
              }}
            >
              Servis Bul →
            </Link>
          </div>
        )}

        {/* Stats Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-400">500+</p>
            <p className="text-xs text-gray-400">Onaylı Servis</p>
          </div>
          <div className="text-center border-x border-white/10">
            <p className="text-2xl font-bold text-primary-400">81</p>
            <p className="text-xs text-gray-400">İl Kapsama</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-400">50K+</p>
            <p className="text-xs text-gray-400">Mutlu Müşteri</p>
          </div>
        </div>
      </div>
    </div>
  );
}
