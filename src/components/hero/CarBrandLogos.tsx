'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const carBrands = [
  'BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Toyota', 'Honda', 'Ford',
  'Renault', 'Peugeot', 'Fiat', 'Hyundai', 'Kia', 'Nissan', 'Mazda',
  'Volvo', 'Skoda', 'Seat', 'Opel', 'Citroen', 'Dacia', 'Suzuki', 'Mitsubishi',
  'Alfa Romeo', 'Aston Martin', 'Bentley', 'BYD', 'Chery', 'Chevrolet',
  'Chrysler', 'Cupra', 'DS', 'Ferrari', 'Geely', 'Jaecoo', 'Jaguar', 'Jeep',
  'Lada', 'Lamborghini', 'Land Rover', 'Lexus', 'Maserati', 'MG', 'Mini',
  'Porsche', 'Range Rover', 'Seres', 'Skywell', 'Ssangyong', 'Subaru',
  'Tesla', 'Togg',
];

interface LogoItem {
  id: number;
  brand: string;
  x: number;
  y: number;
}

export function CarBrandLogos() {
  const [activeLogos, setActiveLogos] = useState<LogoItem[]>([]);
  const logoIdRef = useRef(0);

  useEffect(() => {
    const spawnLogo = () => {
      const randomBrand = carBrands[Math.floor(Math.random() * carBrands.length)];
      const newLogo: LogoItem = {
        id: logoIdRef.current++,
        brand: randomBrand,
        x: Math.random() * 60 + 20, // 20% - 80% of container width
        y: Math.random() * 50 + 25, // 25% - 75% of container height
      };
      setActiveLogos(prev => [...prev.slice(-3), newLogo]);
    };

    spawnLogo();
    const spawnInterval = setInterval(spawnLogo, 2500);
    return () => clearInterval(spawnInterval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[25]">
      <AnimatePresence>
        {activeLogos.map((logo) => (
          <motion.div
            key={logo.id}
            className="absolute flex items-center justify-center"
            style={{
              left: `${logo.x}%`,
              top: `${logo.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.3, filter: 'blur(10px)' }}
            animate={{
              opacity: [0, 0.25, 0.25, 0],
              scale: [0.3, 1, 1, 0.7],
              filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(5px)'],
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              duration: 5,
              times: [0, 0.15, 0.85, 1],
              ease: 'easeInOut',
            }}
            onAnimationComplete={() => {
              setActiveLogos(prev => prev.filter(l => l.id !== logo.id));
            }}
          >
            <span
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-widest uppercase"
              style={{
                color: 'white',
                textShadow: '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.3), 0 0 90px rgba(255,255,255,0.2)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '0.15em',
              }}
            >
              {logo.brand}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
