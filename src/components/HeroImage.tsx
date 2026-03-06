'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  {
    src: '/images/hero-mechanic-final.png',
    alt: 'TamirHanem Profesyonel Servis'
  },
  {
    src: 'https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&w=1200',
    alt: 'TamirHanem Detaylı Temizlik ve Bakım'
  }
];

export default function HeroImage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:block absolute right-[50px] bottom-[-25px] z-20 pointer-events-none w-[900px] h-[1080px]">
      <div className="relative w-full h-full">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-3xl opacity-30 transform translate-y-1/4" />

        {/* Image Slider */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex items-end justify-center"
          >
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              width={900}
              height={1080}
              className="object-contain relative z-10"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
