'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, ArrowRight } from 'lucide-react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if announcement was dismissed
    const dismissed = localStorage.getItem('announcementDismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;

    // Show again after 24 hours
    if (!dismissed || Date.now() - dismissedTime > 24 * 60 * 60 * 1000) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('announcementDismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 text-secondary-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {/* Icon with pulse */}
          <div className="relative flex-shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <div className="absolute inset-0 bg-white/50 rounded-full animate-ping" />
          </div>

          {/* Text */}
          <p className="text-sm sm:text-base font-bold text-center">
            <span className="hidden sm:inline">🎉 Oto Yıkama Hizmeti Başladı! </span>
            <span className="sm:hidden">🎉 Oto Yıkama Aktif! </span>
            <Link
              href="/giris-yap"
              className="underline underline-offset-2 hover:no-underline inline-flex items-center gap-1"
            >
              Hemen randevu alın
              <ArrowRight className="w-4 h-4" />
            </Link>
          </p>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-secondary-900/10 rounded-full transition-colors ml-2"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
