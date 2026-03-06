'use client';

import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-64 h-32">
          <div className="absolute bottom-4 left-4 right-4 h-12 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-lg animate-pulse" />
          <div className="absolute bottom-14 left-12 right-12 h-10 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-t-2xl animate-pulse" style={{ animationDelay: '0.1s' }} />
          <div className="absolute bottom-0 left-8 w-10 h-10 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="absolute bottom-0 right-8 w-10 h-10 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
          <div className="absolute bottom-6 left-2 w-3 h-2 bg-primary-500/50 rounded-full animate-ping" />
          <div className="absolute bottom-6 right-2 w-3 h-2 bg-red-500/50 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 rounded-full"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <p className="text-white/50 text-xs tracking-wider">3D MODEL YUKLENIYOR</p>
      </div>
    </Html>
  );
}
