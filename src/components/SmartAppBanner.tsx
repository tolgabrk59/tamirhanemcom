'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type Platform = 'ios' | 'android' | 'huawei' | null;

const platformConfig = {
  ios: {
    name: 'App Store',
    subtitle: "App Store'dan İndir",
    url: '#', // Uygulama yayınlandığında güncellenecek
    icon: (
      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    bgColor: 'bg-gradient-to-r from-gray-900 to-gray-800',
  },
  android: {
    name: 'Google Play',
    subtitle: "Google Play'den İndir",
    url: '#', // Uygulama yayınlandığında güncellenecek
    icon: (
      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
      </svg>
    ),
    bgColor: 'bg-gradient-to-r from-green-600 to-green-500',
  },
  huawei: {
    name: 'AppGallery',
    subtitle: "AppGallery'den İndir",
    url: '#', // Uygulama yayınlandığında güncellenecek
    icon: (
      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
    bgColor: 'bg-gradient-to-r from-red-600 to-red-500',
  },
};

export default function SmartAppBanner() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('appBannerDismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();

    // Check for Huawei first (as it also contains 'android')
    if (userAgent.includes('huawei') || userAgent.includes('hmscore')) {
      setPlatform('huawei');
      setIsVisible(true);
    }
    // Check for iOS
    else if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
      setIsVisible(true);
    }
    // Check for Android
    else if (userAgent.includes('android')) {
      setPlatform('android');
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Remember dismissal for 7 days
    localStorage.setItem('appBannerDismissed', Date.now().toString());
    setTimeout(() => {
      const dismissedTime = localStorage.getItem('appBannerDismissed');
      if (dismissedTime && Date.now() - parseInt(dismissedTime) > 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem('appBannerDismissed');
      }
    }, 0);
  };

  if (!isVisible || isDismissed || !platform) return null;

  const config = platformConfig[platform];

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 ${config.bgColor} shadow-2xl shadow-black/50 safe-area-bottom`}>
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* App Icon */}
          <div className="flex-shrink-0 w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-secondary-900 font-black text-lg">TH</span>
          </div>

          {/* App Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-base">TamirHanem</h3>
              <span className="bg-primary-500 text-secondary-900 text-[10px] font-bold px-1.5 py-0.5 rounded">YAKINDA</span>
            </div>
            <p className="text-white/70 text-sm truncate">Araç bakım & servis platformu</p>
            <div className="flex items-center gap-1 mt-0.5">
              {[1,2,3,4,5].map((star) => (
                <svg key={star} className="w-3 h-3 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
              <span className="text-white/50 text-xs ml-1">5.0</span>
            </div>
          </div>

          {/* Store Button */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <button
              onClick={() => window.open(config.url, '_blank')}
              className="bg-white text-secondary-900 px-4 py-2 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors"
            >
              İndir
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Store indicator */}
        <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-white/10">
          {config.icon}
          <span className="text-white/80 text-xs">{config.subtitle}</span>
        </div>
      </div>
    </div>
  );
}
