'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Icon } from './ui/Icons';

// Parça verileri
interface CarPart {
  id: string;
  name: string;
  description: string;
  href: string;
  color: string;
  icon: string;
  position: { top: string; left: string };
  details: string[];
  priceRange: string;
}

const carParts: CarPart[] = [
  {
    id: 'motor',
    name: 'Motor',
    description: 'Motor bakım & onarım',
    href: '/servisler?category=motor-bakim',
    color: '#F59E0B',
    icon: 'motor',
    position: { top: '40%', left: '25%' },
    details: ['Yağ değişimi', 'Triger kayışı', 'Motor revizyonu', 'Conta değişimi'],
    priceRange: '500 - 15.000 TL',
  },
  {
    id: 'fren',
    name: 'Fren',
    description: 'Fren sistemi servisi',
    href: '/servisler?category=fren',
    color: '#EF4444',
    icon: 'fren',
    position: { top: '72%', left: '32%' },
    details: ['Balata değişimi', 'Disk tornalama', 'Fren hidroliği', 'ABS tamiri'],
    priceRange: '400 - 3.000 TL',
  },
  {
    id: 'lastik',
    name: 'Lastik',
    description: 'Lastik değişim & balans',
    href: '/servisler?category=lastik',
    color: '#6366F1',
    icon: 'lastik',
    position: { top: '75%', left: '70%' },
    details: ['Lastik değişimi', 'Balans ayarı', 'Rot balans', 'Jant düzeltme'],
    priceRange: '200 - 8.000 TL',
  },
  {
    id: 'elektrik',
    name: 'Far & Elektrik',
    description: 'Elektrik & aydınlatma',
    href: '/servisler?category=elektrik',
    color: '#10B981',
    icon: 'elektrik',
    position: { top: '45%', left: '15%' },
    details: ['Akü değişimi', 'Far ayarı', 'Kablo tamiri', 'Sensör değişimi'],
    priceRange: '300 - 5.000 TL',
  },
  {
    id: 'karoser',
    name: 'Kaporta&Boya',
    description: 'Boya & kaporta',
    href: '/servisler?category=kaporta',
    color: '#8B5CF6',
    icon: 'karoser',
    position: { top: '35%', left: '55%' },
    details: ['Boya işlemi', 'Göçük düzeltme', 'Çizik giderme', 'Parça değişimi'],
    priceRange: '1.000 - 20.000 TL',
  },
  {
    id: 'egzoz',
    name: 'Egzoz',
    description: 'Egzoz sistemi',
    href: '/servisler?category=egzoz',
    color: '#F97316',
    icon: 'egzoz',
    position: { top: '60%', left: '85%' },
    details: ['Egzoz değişimi', 'Susturucu tamiri', 'Katalitik konvertör', 'Sızıntı onarımı'],
    priceRange: '500 - 8.000 TL',
  },
];

// Quick action buttons
const quickActions = [
  { id: 'servis', label: 'Servis Bul', icon: 'search', href: '/servisler', color: '#FBC91D' },
  { id: 'fiyat', label: 'Fiyat Hesapla', icon: 'money', href: '/fiyat-hesapla', color: '#10B981' },
  { id: 'ariza', label: 'Arıza Tespit', icon: 'wrench', href: '/ai/ariza-tespit', color: '#8B5CF6' },
  { id: 'obd', label: 'OBD Kodları', icon: 'chart', href: '/obd', color: '#3B82F6' },
];

// Stats interface
interface Stats {
  serviceCount: number;
  cityCount: number;
  customerCount: number;
}

// Floating particle component
const FloatingParticle = ({ delay, duration, x, y, size }: { delay: number; duration: number; x: number; y: number; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-primary-400/30"
    style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
    animate={{
      y: [0, -30, 0],
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

// Main Hero Component
export default function HeroSection() {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<CarPart | null>(null);
  const [stats, setStats] = useState<Stats>({ serviceCount: 500, cityCount: 81, customerCount: 50000 });
  const [isMobile, setIsMobile] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotating phrases for the hero title
  const rotatingPhrases = [
    'Dijital Servisi',
    'Ekonomik Çözümü',
    'Güvenilir Ortağı',
    'Akıllı Rehberi',
    'Uzman Servisi',
    'Pratik Çözümü',
    'Tek Adresi',
  ];

  // Rotate phrases every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [rotatingPhrases.length]);

  // Mouse position for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation for mouse tracking
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Transform mouse position to rotation values
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);
  
  // Glow position
  const glowX = useTransform(smoothMouseX, [-0.5, 0.5], ['30%', '70%']);
  const glowY = useTransform(smoothMouseY, [-0.5, 0.5], ['30%', '70%']);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isMobile) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY, isMobile]);

  // Reset mouse position on leave
  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const json = await res.json();
        if (json.success && json.data) {
          setStats({
            serviceCount: json.data.serviceCount || 500,
            cityCount: json.data.cityCount || 81,
            customerCount: json.data.customerCount || 50000
          });
        }
      } catch (error) {
        console.error('[HeroSection] Stats fetch error:', error);
      }
    };
    fetchStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return Math.floor(num / 1000) + 'K+';
    }
    return num + '+';
  };

  const handlePartClick = (part: CarPart) => {
    setSelectedPart(part);
  };

  // Generate random particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 3,
    duration: Math.random() * 3 + 3,
  }));

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slogan - Top right */}
      <div className="hidden lg:flex items-center h-14 px-6 absolute top-0 right-0 z-50">
        <motion.span 
          className="text-2xl font-[family-name:var(--font-handwriting)] italic text-primary-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Her Araç Kıymetlidir
        </motion.span>
      </div>

      {/* Dynamic glow that follows mouse */}
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none hidden lg:block"
        style={{
          background: 'radial-gradient(circle, rgba(251,201,29,0.15) 0%, rgba(251,201,29,0.05) 40%, transparent 70%)',
          left: glowX,
          top: glowY,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]"
          animate={{ 
            x: [0, 50, 0], 
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <FloatingParticle key={p.id} {...p} />
        ))}
      </div>

      {/* Grid pattern with animation */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}
        animate={{ opacity: [0.02, 0.04, 0.02] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(251,201,29,0.02) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Main content */}
      <div className="relative min-h-screen flex flex-col lg:flex-row items-center">
        {/* Left panel - Info */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center px-6 lg:px-12 xl:px-20 py-20 lg:py-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
              whileHover={{ scale: 1.05, borderColor: 'rgba(251,201,29,0.5)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.span 
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-white/70 text-sm">{stats.serviceCount}+ Onaylı Servis</span>
            </motion.div>

            {/* Heading with letter animation */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Aracınızın
              </motion.span>
              <br />
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-yellow-400 to-primary-500 inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ 
                  backgroundSize: '200% auto',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentPhraseIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      backgroundPosition: ['0% center', '100% center', '0% center'],
                    }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      opacity: { duration: 0.3 },
                      y: { duration: 0.3 },
                      backgroundPosition: { duration: 5, repeat: Infinity, ease: "linear" }
                    }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-yellow-400 to-primary-500 inline-block"
                    style={{ backgroundSize: '200% auto' }}
                  >
                    {rotatingPhrases[currentPhraseIndex]}
                  </motion.span>
                </AnimatePresence>
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-white/50 text-lg mb-10 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Aracınız için en uygun servisi bulun, fiyat karşılaştırın ve randevunuzu hemen oluşturun.
            </motion.p>

            {/* Quick actions with stagger */}
            <div className="flex flex-wrap gap-3 mb-10">
              {quickActions.map((action, idx) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                >
                  <Link href={action.href}>
                    <motion.div
                      className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group overflow-hidden backdrop-blur-sm"
                      whileHover={{ 
                        scale: 1.05, 
                        y: -3,
                        borderColor: 'rgba(251,201,29,0.4)',
                        boxShadow: '0 10px 40px rgba(251,201,29,0.15)'
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <span className="text-lg relative z-10">{action.icon}</span>
                      <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors relative z-10">
                        {action.label}
                      </span>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Stats with floating animation */}
            <div className="flex gap-8">
              {[
                { value: stats.serviceCount + '+', label: 'Servis' },
                { value: stats.cityCount.toString(), label: 'İl' },
                { value: formatNumber(stats.customerCount), label: 'Kullanıcı' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + idx * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div 
                    className="text-2xl lg:text-3xl font-bold text-white"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, delay: idx * 0.2, repeat: Infinity }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-white/40 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right panel - Car Image with 3D Parallax */}
        <div className="w-full lg:w-3/5 relative flex items-center justify-center py-10 lg:py-0 perspective-1000">
          {/* Glow effect behind car */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] bg-primary-500/20 rounded-full blur-[100px]" />
          </motion.div>

          {/* Car Image Container with 3D transform */}
          <motion.div
            className="relative w-full max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              rotateX: isMobile ? 0 : rotateX,
              rotateY: isMobile ? 0 : rotateY,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Car Image */}
            <div className="relative aspect-[16/10]">
              {/* Reflection/Shadow under car */}
              <motion.div 
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-16 hidden lg:block"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%)',
                  filter: 'blur(10px)',
                }}
                animate={{ 
                  scaleX: [1, 1.05, 1],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <Image
                src="/images/car-hero-audi.png"
                alt="Araç Servisi"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />

              {/* Hotspots - Desktop only */}
              <div className="hidden lg:block">
                {carParts.map((part, index) => (
                  <motion.button
                    key={part.id}
                    className="absolute cursor-pointer outline-none group z-10"
                    style={{ top: part.position.top, left: part.position.left }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1 + index * 0.1, type: "spring", stiffness: 200 }}
                    onMouseEnter={() => setHoveredPart(part.id)}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(part)}
                  >
                    {/* Multiple pulse rings */}
                    {[0, 0.5, 1].map((delay) => (
                      <motion.span
                        key={delay}
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: part.color }}
                        animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                        transition={{ duration: 2, delay, repeat: Infinity }}
                      />
                    ))}

                    {/* Main button with glassmorphism */}
                    <motion.div
                      className="relative w-12 h-12 rounded-full flex items-center justify-center text-lg backdrop-blur-md border-2 shadow-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${part.color}CC, ${part.color}99)`,
                        borderColor: 'rgba(255,255,255,0.5)',
                        boxShadow: `0 0 30px ${part.color}60, inset 0 1px 1px rgba(255,255,255,0.3)`
                      }}
                      whileHover={{ 
                        scale: 1.3,
                        boxShadow: `0 0 50px ${part.color}80, inset 0 1px 1px rgba(255,255,255,0.3)`
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {part.icon}
                    </motion.div>

                    {/* Tooltip with glassmorphism */}
                    <AnimatePresence>
                      {hoveredPart === part.id && (
                        <motion.div
                          className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-black/70 backdrop-blur-xl text-white text-sm font-medium whitespace-nowrap z-20 border border-white/20"
                          initial={{ opacity: 0, x: -10, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -10, scale: 0.9 }}
                          style={{ boxShadow: `0 0 20px ${part.color}40` }}
                        >
                          <div className="font-bold">{part.name}</div>
                          <div className="text-xs text-white/60">{part.description}</div>
                          <div className="absolute left-0 top-1/2 -translate-x-1.5 -translate-y-1/2 w-3 h-3 bg-black/70 rotate-45 border-l border-b border-white/20" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>

              {/* Connecting lines - SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block" style={{ transform: 'translateZ(20px)' }}>
                {carParts.map((part, idx) => {
                  const startX = parseFloat(part.position.left);
                  const startY = parseFloat(part.position.top);
                  const endX = 105; // Right side panel position
                  const endY = 20 + idx * 12;
                  
                  return (
                    <motion.line
                      key={part.id}
                      x1={`${startX}%`}
                      y1={`${startY}%`}
                      x2={`${endX}%`}
                      y2={`${endY}%`}
                      stroke={hoveredPart === part.id ? part.color : 'rgba(255,255,255,0.1)'}
                      strokeWidth={hoveredPart === part.id ? 2 : 1}
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ 
                        pathLength: 1, 
                        opacity: hoveredPart === part.id ? 0.8 : 0.2,
                        strokeWidth: hoveredPart === part.id ? 2 : 1
                      }}
                      transition={{ duration: 1, delay: 1.5 + idx * 0.1 }}
                    />
                  );
                })}
              </svg>
            </div>

            {/* Part categories - Side panel (Desktop) */}
            <motion.div
              className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 flex-col gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              {carParts.map((part, idx) => (
                <motion.button
                  key={part.id}
                  className="relative w-14 h-14 rounded-xl flex items-center justify-center text-xl transition-all overflow-hidden backdrop-blur-sm"
                  style={{
                    background: hoveredPart === part.id 
                      ? `linear-gradient(135deg, ${part.color}40, ${part.color}20)` 
                      : 'rgba(255,255,255,0.05)',
                    borderColor: hoveredPart === part.id ? part.color : 'rgba(255,255,255,0.1)',
                    borderWidth: 2,
                    boxShadow: hoveredPart === part.id ? `0 0 30px ${part.color}40` : 'none'
                  }}
                  whileHover={{ 
                    scale: 1.15,
                    boxShadow: `0 0 30px ${part.color}60`
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePartClick(part)}
                  onMouseEnter={() => setHoveredPart(part.id)}
                  onMouseLeave={() => setHoveredPart(null)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + idx * 0.08 }}
                >
                  {/* Shimmer effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10">{part.icon}</span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile quick actions */}
      <motion.div
        className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent z-40"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {carParts.slice(0, 4).map((part) => (
            <motion.button
              key={part.id}
              onClick={() => handlePartClick(part)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 whitespace-nowrap backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{part.icon}</span>
              <span className="text-white/80 text-sm">{part.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Part Detail Modal with enhanced animations */}
      <AnimatePresence>
        {selectedPart && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={() => setSelectedPart(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative w-full max-w-lg bg-gray-900/90 backdrop-blur-2xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl"
              initial={{ scale: 0.8, y: 50, rotateX: -10 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, y: 50, rotateX: 10 }}
              transition={{ type: "spring", damping: 25 }}
              style={{ boxShadow: `0 0 100px ${selectedPart.color}30` }}
            >
              {/* Header with gradient */}
              <div 
                className="relative p-6 pb-4"
                style={{ 
                  background: `linear-gradient(135deg, ${selectedPart.color}30, transparent)` 
                }}
              >
                {/* Animated particles in header */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full"
                      style={{ 
                        backgroundColor: selectedPart.color,
                        left: `${20 + i * 15}%`,
                        top: '50%'
                      }}
                      animate={{
                        y: [-20, 20],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  ))}
                </div>

                {/* Close button */}
                <motion.button
                  onClick={() => setSelectedPart(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center hover:bg-black/50 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>

                {/* Part icon and name */}
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${selectedPart.color}, ${selectedPart.color}CC)`,
                      boxShadow: `0 10px 40px ${selectedPart.color}50`
                    }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    {selectedPart.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedPart.name}</h3>
                    <p className="text-white/60">{selectedPart.description}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Services with stagger animation */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {selectedPart.details.map((detail, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-sm text-white/70 border border-white/10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ 
                        backgroundColor: `${selectedPart.color}20`,
                        borderColor: `${selectedPart.color}50`
                      }}
                    >
                      <motion.div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: selectedPart.color }}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                      />
                      {detail}
                    </motion.div>
                  ))}
                </div>

                {/* Price */}
                <motion.div 
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 mb-6"
                  whileHover={{ borderColor: `${selectedPart.color}50` }}
                >
                  <span className="text-white/50 text-sm">Fiyat Aralığı</span>
                  <span className="text-white font-semibold">{selectedPart.priceRange}</span>
                </motion.div>

                {/* CTA */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={selectedPart.href}
                    className="relative flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-medium overflow-hidden"
                    style={{ backgroundColor: selectedPart.color }}
                    onClick={() => setSelectedPart(null)}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                    <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="relative z-10">{selectedPart.name} Ustası Bul</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
