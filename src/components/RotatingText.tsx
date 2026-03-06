'use client';

import { useState, useEffect } from 'react';

const rotatingTexts = [
  'En Kaliteli Servis',
  'En Güvenilir Servis',
  'En İyi Asistanınız',
];

export default function RotatingText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % rotatingTexts.length);
        setIsAnimating(false);
      }, 500); // Fade out süresi
    }, 3000); // Her 3 saniyede değiş

    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      className={`bg-gradient-to-r from-primary-400 via-primary-300 to-primary-400 bg-clip-text text-transparent transition-all duration-500 whitespace-nowrap ${
        isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
    >
      {rotatingTexts[currentIndex]}
    </span>
  );
}
