'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Settings, Shield } from 'lucide-react';
import {
  hasConsent,
  acceptAllCookies,
  acceptEssentialOnly,
  loadConsentedScripts,
  getStoredConsent,
} from '@/lib/consent';
import ConsentManager from './ConsentManager';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showManager, setShowManager] = useState(false);

  useEffect(() => {
    // Consent verilmemişse banner'ı göster
    if (!hasConsent()) {
      // Küçük bir gecikme ile göster (sayfa yüklendikten sonra)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Mevcut consent'e göre script'leri yükle
      const consent = getStoredConsent();
      if (consent) {
        loadConsentedScripts(consent);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = acceptAllCookies();
    loadConsentedScripts(consent);
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    acceptEssentialOnly();
    setIsVisible(false);
  };

  const handleOpenSettings = () => {
    setShowManager(true);
  };

  const handleCloseManager = () => {
    setShowManager(false);
    // Manager'dan kaydedildiyse banner'ı kapat
    if (hasConsent()) {
      const consent = getStoredConsent();
      if (consent) {
        loadConsentedScripts(consent);
      }
      setIsVisible(false);
    }
  };

  if (!isVisible && !showManager) return null;

  return (
    <>
      {/* Ana Banner */}
      {isVisible && !showManager && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slideInUp">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-secondary-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Çerez Politikası</h3>
                  <p className="text-white/80 text-sm">Gizliliğinize saygı duyuyoruz</p>
                </div>
              </div>
              <button
                onClick={handleAcceptEssential}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-secondary-600 mb-4 leading-relaxed">
                TamirHanem olarak, size daha iyi bir deneyim sunmak için çerezler kullanıyoruz.
                Çerezler, sitemizi nasıl kullandığınızı anlamamıza ve hizmetlerimizi geliştirmemize yardımcı olur.
                Tercihlerinizi dilediğiniz zaman değiştirebilirsiniz.
              </p>

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-secondary-500">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>KVKK Uyumlu</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-500">
                  <Cookie className="w-4 h-4 text-primary-500" />
                  <span>4 Çerez Kategorisi</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-500">
                  <Settings className="w-4 h-4 text-secondary-400" />
                  <span>Özelleştirilebilir</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Tümünü Kabul Et
                </button>
                <button
                  onClick={handleAcceptEssential}
                  className="flex-1 px-6 py-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-semibold rounded-xl transition-colors"
                >
                  Sadece Zorunlu
                </button>
                <button
                  onClick={handleOpenSettings}
                  className="flex-1 px-6 py-3 border-2 border-secondary-300 hover:border-primary-500 text-secondary-700 hover:text-primary-600 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Özelleştir
                </button>
              </div>

              {/* Footer Links */}
              <div className="mt-4 pt-4 border-t border-secondary-100 flex flex-wrap gap-4 text-sm">
                <a href="/kvkk" className="text-primary-600 hover:underline">
                  KVKK Aydınlatma Metni
                </a>
                <a href="/cerez-politikasi" className="text-primary-600 hover:underline">
                  Çerez Politikası
                </a>
                <a href="/gizlilik-politikasi" className="text-primary-600 hover:underline">
                  Gizlilik Politikası
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consent Manager Modal */}
      {showManager && (
        <ConsentManager onClose={handleCloseManager} />
      )}

      {/* Slide-in animation */}
      <style jsx global>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.4s ease-out forwards;
        }
      `}</style>
    </>
  );
}
