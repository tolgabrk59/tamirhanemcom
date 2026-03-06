/**
 * KVKK / Cookie Consent Management
 * Çerez onay yönetimi ve KVKK uyumluluk helper'ları
 */

import { ConsentPreferences, ConsentCategory } from '@/types';

// Consent version - değişiklik yapıldığında güncellenmeli
export const CONSENT_VERSION = '1.0.0';

// LocalStorage key
export const CONSENT_STORAGE_KEY = 'tamirhanem_consent';

// Çerez kategorileri tanımları
export const CONSENT_CATEGORIES: ConsentCategory[] = [
  {
    id: 'essential',
    name: 'Zorunlu Çerezler',
    description: 'Sitenin temel işlevselliği için gerekli çerezlerdir. Bu çerezler olmadan site düzgün çalışmaz.',
    required: true,
    cookies: ['session_id', 'csrf_token', 'consent_preferences'],
    retentionPeriod: 'Oturum sonu',
  },
  {
    id: 'analytics',
    name: 'Analitik Çerezler',
    description: 'Ziyaretçi davranışlarını analiz etmek ve siteyi iyileştirmek için kullanılır. Google Analytics gibi araçları kapsar.',
    required: false,
    cookies: ['_ga', '_gid', '_gat'],
    retentionPeriod: '2 yıl',
  },
  {
    id: 'marketing',
    name: 'Pazarlama Çerezleri',
    description: 'Kişiselleştirilmiş reklamlar göstermek ve reklam kampanyalarını ölçmek için kullanılır.',
    required: false,
    cookies: ['_fbp', '_gcl_au', 'ads_id'],
    retentionPeriod: '1 yıl',
  },
  {
    id: 'personalization',
    name: 'Kişiselleştirme Çerezleri',
    description: 'Tercihlerinizi hatırlamak ve size özelleştirilmiş deneyim sunmak için kullanılır.',
    required: false,
    cookies: ['theme', 'language', 'recent_vehicles'],
    retentionPeriod: '1 yıl',
  },
];

// Veri saklama süreleri açıklaması
export const DATA_RETENTION_INFO = {
  personalData: '3 yıl (son işlem tarihinden itibaren)',
  analyticsData: '26 ay',
  marketingData: '1 yıl',
  vehicleData: '5 yıl (garanti ve servis takibi için)',
  communicationLogs: '10 yıl (yasal zorunluluk)',
};

/**
 * Varsayılan consent tercihleri
 */
export function getDefaultConsent(): ConsentPreferences {
  return {
    essential: true, // Her zaman true
    analytics: false,
    marketing: false,
    personalization: false,
    consentDate: new Date().toISOString(),
    consentVersion: CONSENT_VERSION,
  };
}

/**
 * LocalStorage'dan consent tercihlerini oku
 */
export function getStoredConsent(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as ConsentPreferences;

    // Version kontrolü - eski versiyon varsa yeniden onay iste
    if (parsed.consentVersion !== CONSENT_VERSION) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Consent tercihlerini LocalStorage'a kaydet
 */
export function saveConsent(preferences: Partial<ConsentPreferences>): ConsentPreferences {
  const fullPreferences: ConsentPreferences = {
    essential: true, // Her zaman true
    analytics: preferences.analytics ?? false,
    marketing: preferences.marketing ?? false,
    personalization: preferences.personalization ?? false,
    consentDate: new Date().toISOString(),
    consentVersion: CONSENT_VERSION,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(fullPreferences));
  }

  return fullPreferences;
}

/**
 * Tüm çerezleri kabul et
 */
export function acceptAllCookies(): ConsentPreferences {
  return saveConsent({
    analytics: true,
    marketing: true,
    personalization: true,
  });
}

/**
 * Sadece zorunlu çerezleri kabul et
 */
export function acceptEssentialOnly(): ConsentPreferences {
  return saveConsent({
    analytics: false,
    marketing: false,
    personalization: false,
  });
}

/**
 * Consent verilmiş mi kontrol et
 */
export function hasConsent(): boolean {
  return getStoredConsent() !== null;
}

/**
 * Belirli bir kategori için onay var mı
 */
export function hasConsentFor(category: 'analytics' | 'marketing' | 'personalization'): boolean {
  const consent = getStoredConsent();
  if (!consent) return false;
  return consent[category] === true;
}

/**
 * Consent'e göre script'leri yükle
 */
export function loadConsentedScripts(preferences: ConsentPreferences): void {
  if (typeof window === 'undefined') return;

  // Google Analytics
  if (preferences.analytics && !window.gtag) {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (gaId) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      const gtag = (...args: unknown[]) => {
        window.dataLayer.push(args);
      };
      gtag('js', new Date());
      gtag('config', gaId);
      window.gtag = gtag;
    }
  }

  // Facebook Pixel
  if (preferences.marketing) {
    const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
    if (fbPixelId && !window.fbq) {
      // Facebook Pixel initialization - simplified version
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      script.async = true;
      document.head.appendChild(script);

      // Initialize fbq queue
      window._fbq = window._fbq || [];
      window.fbq = window.fbq || ((...args: unknown[]) => {
        window._fbq.push(args);
      });

      script.onload = () => {
        if (window.fbq) {
          window.fbq('init', fbPixelId);
          window.fbq('track', 'PageView');
        }
      };
    }
  }
}

/**
 * Consent'i sıfırla (tercihleri değiştirmek için)
 */
export function resetConsent(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  }
}

// Global type declarations
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq: {
      (...args: unknown[]): void;
      callMethod?: (...args: unknown[]) => void;
      queue: unknown[];
      push: (...args: unknown[]) => void;
      loaded: boolean;
      version: string;
    };
    _fbq: typeof window.fbq;
  }
}
