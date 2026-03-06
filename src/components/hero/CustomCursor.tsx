'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { carParts } from './data';

interface CustomCursorProps {
  isOverCar: boolean;
  hoveredPart: string | null;
}

export function CustomCursor({ hoveredPart }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  const part = hoveredPart ? carParts.find(p => p.id === hoveredPart) : null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] hidden lg:flex items-center gap-2"
      style={{ left: position.x, top: position.y }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className="relative flex items-center justify-center -ml-4 -mt-4"
        animate={{
          width: part ? 'auto' : 32,
          height: 32,
          paddingLeft: part ? 10 : 0,
          paddingRight: part ? 10 : 0,
        }}
        style={{
          background: part
            ? `linear-gradient(135deg, ${part.color}90, ${part.color}60)`
            : 'rgba(251, 201, 29, 0.9)',
          borderRadius: 20,
          boxShadow: part
            ? `0 4px 20px ${part.color}80`
            : '0 4px 20px rgba(251, 201, 29, 0.5)',
        }}
      >
        {part ? (
          <>
            <span className="text-sm">{part.icon}</span>
            <span className="text-white text-xs font-bold ml-1.5">{part.name}</span>
          </>
        ) : (
          <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        )}
      </motion.div>

      {!part && (
        <motion.div
          className="absolute -ml-6 -mt-6 w-12 h-12 border-2 border-primary-500/30 rounded-full"
          animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
