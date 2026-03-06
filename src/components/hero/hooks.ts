'use client';

import { useRef } from 'react';

const soundFiles: { [key: string]: string } = {
  motor: '/sounds/motor.mp3',
  egzoz: '/sounds/egzoz.mp3',
  fren: '/sounds/fren.mp3',
  lastik: '/sounds/lastik.mp3',
  elektrik: '/sounds/elektrik.mp3',
  klima: '/sounds/klima.mp3',
  cam: '/sounds/cam.mp3',
  suspansiyon: '/sounds/suspansiyon.mp3',
  icmekan: '/sounds/icmekan.mp3',
  karoser: '/sounds/karoser.mp3',
};

export function useSoundEffects() {
  const audioCache = useRef<{ [key: string]: HTMLAudioElement }>({});

  const playSound = (partId: string) => {
    try {
      const soundFile = soundFiles[partId];
      if (!soundFile) return;

      if (!audioCache.current[partId]) {
        audioCache.current[partId] = new Audio(soundFile);
        audioCache.current[partId].volume = 0.5;
      }

      const audio = audioCache.current[partId];
      audio.currentTime = 0;
      audio.play().catch(() => {});

      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 3000);
    } catch {
      // Sound not supported
    }
  };

  return { playSound };
}
