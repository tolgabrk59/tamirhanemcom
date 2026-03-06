'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

// Dönen placeholder metinleri - site özellikleri ve hizmet kategorileri
const placeholderTexts = [
  // Hizmet Kategorileri
  'Motor Ustası',
  'Kaporta Boyacı',
  'Fren Sistemi',
  'Lastik Değişimi',
  'Klima Bakımı',
  'Oto Elektrikçi',
  'Şanzıman Tamiri',
  'Egzoz Sistemi',
  'Süspansiyon Bakımı',
  // Site Özellikleri
  'OBD Kod Anlamları',
  '2.El Parça',
  'Kronik Sorunlar',
  'Araç Değeri Hesapla',
  'Periyodik Bakım',
  'P0300 Arıza Kodu',
  'Yakınımdaki Servisler',
  'Fiyat Hesapla',
  'Servis Randevusu',
  'Şarj İstasyonları',
  'Geri Çağırmalar',
];

interface SearchSuggestion {
  type: 'service' | 'obd' | 'page' | 'category';
  title: string;
  description?: string;
  href: string;
  icon?: string;
}

const staticSuggestions: SearchSuggestion[] = [
  // Hizmetler
  { type: 'service', title: 'Servis Bul', description: 'Yakınındaki servisleri ara', href: '/servisler', icon: '🔧' },
  { type: 'service', title: 'Fiyat Hesapla', description: 'Tamir maliyetini öğren', href: '/fiyat-hesapla', icon: '💰' },
  { type: 'service', title: 'Randevu Al', description: 'Online servis randevusu', href: '/randevu', icon: '📅' },
  
  // Usta Kategorileri
  { type: 'category', title: 'Motor Ustası', description: 'Motor tamir ve bakım', href: '/servisler?category=motor', icon: '🔩' },
  { type: 'category', title: 'Kaporta Ustası', description: 'Kaporta ve boya işleri', href: '/servisler?category=kaporta', icon: '🎨' },
  { type: 'category', title: 'Elektrik Ustası', description: 'Oto elektrik servisi', href: '/servisler?category=elektrik', icon: '⚡' },
  { type: 'category', title: 'Fren Ustası', description: 'Fren sistemi bakımı', href: '/servisler?category=fren', icon: '🛑' },
  { type: 'category', title: 'Lastik Ustası', description: 'Lastik değişim ve balans', href: '/servisler?category=lastik', icon: '🔘' },
  { type: 'category', title: 'Klima Ustası', description: 'Klima bakım ve onarım', href: '/servisler?category=klima', icon: '❄️' },
  { type: 'category', title: 'Şanzıman Ustası', description: 'Şanzıman tamiri', href: '/servisler?category=sanziman', icon: '⚙️' },
  { type: 'category', title: 'Egzoz Ustası', description: 'Egzoz sistemi', href: '/servisler?category=egzoz', icon: '💨' },
  { type: 'category', title: 'Süspansiyon Ustası', description: 'Amortisör ve süspansiyon', href: '/servisler?category=suspansiyon', icon: '🔧' },
  
  // OBD Kodları
  { type: 'obd', title: 'OBD Kod Sorgula', description: 'Arıza kodunu çözümle', href: '/obd', icon: '📟' },
  { type: 'obd', title: 'P0300 - Rastgele Ateşleme', description: 'Motor ateşleme sorunu', href: '/obd?code=P0300', icon: '🔥' },
  { type: 'obd', title: 'P0171 - Yakıt Karışımı', description: 'Fakir yakıt karışımı', href: '/obd?code=P0171', icon: '⛽' },
  { type: 'obd', title: 'P0420 - Katalitik Konvertör', description: 'Egzoz emisyon sorunu', href: '/obd?code=P0420', icon: '🌫️' },
  { type: 'obd', title: 'P0442 - EVAP Sızıntı', description: 'Küçük buhar sızıntısı', href: '/obd?code=P0442', icon: '💧' },
  
  // Menü Sayfaları
  { type: 'page', title: 'Kronik Sorunlar', description: 'Model bazlı bilinen sorunlar', href: '/kronik-sorunlar', icon: '⚠️' },
  { type: 'page', title: 'Araç Değeri', description: 'Piyasa değeri hesapla', href: '/arac-degeri', icon: '📊' },
  { type: 'page', title: 'AI Arıza Tespit', description: 'Yapay zeka ile tanı', href: '/ai/ariza-tespit', icon: '🤖' },
  { type: 'page', title: 'Bakım Takvimi', description: 'Periyodik bakım planı', href: '/bakim-takvimi', icon: '📆' },
  { type: 'page', title: 'Şarj İstasyonları', description: 'Elektrikli araç şarj noktaları', href: '/sarj-istasyonlari', icon: '🔌' },
  { type: 'page', title: 'Geri Çağırmalar', description: 'Recall ve kampanya kontrol', href: '/geri-cagrima', icon: '📢' },
  { type: 'page', title: 'Arıza Rehberi', description: 'Belirtilerden arıza bul', href: '/ariza-rehberi', icon: '🔍' },
  { type: 'page', title: 'Fiyat Karşılaştır', description: 'Servis fiyat karşılaştırma', href: '/karsilastirma', icon: '💵' },
  { type: 'page', title: 'Lastik Seçimi', description: 'Aracınıza uygun lastik', href: '/arac/lastik-secimi', icon: '🛞' },
  { type: 'page', title: 'SSS', description: 'Sıkça sorulan sorular', href: '/sss', icon: '❓' },
  { type: 'page', title: 'Hakkımızda', description: 'TamirHanem hakkında', href: '/hakkimizda', icon: 'ℹ️' },
  { type: 'page', title: 'İletişim', description: 'Bize ulaşın', href: '/iletisim', icon: '📞' },
];

export default function HeroSearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
  // Rotating placeholder
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  
  // Mount check for portal
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Rotate placeholder every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  
  // Update dropdown position when open
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // 8px gap
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);
  
  const currentPlaceholder = useMemo(() => {
    return `${placeholderTexts[placeholderIndex]} ara...`;
  }, [placeholderIndex]);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.length > 0) {
      const filtered = staticSuggestions.filter(s =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(query.toLowerCase()))
      );
      setSuggestions(filtered.slice(0, 6));
    } else {
      // Show popular suggestions when empty
      setSuggestions(staticSuggestions.slice(0, 6));
    }
  }, [query]);

  // Close modal on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Check if it looks like an OBD code
      if (/^[PBCU][0-9]{4}$/i.test(query.trim())) {
        router.push(`/obd?code=${query.trim().toUpperCase()}`);
      } else {
        // General search - go to services with search query
        router.push(`/servisler?search=${encodeURIComponent(query.trim())}`);
      }
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    router.push(suggestion.href);
    setIsOpen(false);
    setQuery('');
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'service': return 'Servis';
      case 'obd': return 'OBD';
      case 'page': return 'Sayfa';
      case 'category': return 'Kategori';
      default: return '';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'service': return 'bg-primary-500/20 text-primary-300';
      case 'obd': return 'bg-blue-500/20 text-blue-300';
      case 'page': return 'bg-purple-500/20 text-purple-300';
      case 'category': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mb-8">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={currentPlaceholder}
            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary-400 hover:text-primary-300 transition-colors"
          >
            <span className="text-sm font-medium mr-2 hidden sm:inline">Ara</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </form>

      {/* Search Modal - Centered on screen */}
      {isMounted && isOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-fadeIn">
            {/* Modal Header with Search */}
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={currentPlaceholder}
                  autoFocus
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-lg"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Suggestions List */}
            <div className="max-h-[50vh] overflow-y-auto">
              <div className="p-2">
                <p className="text-xs text-gray-500 px-3 py-2 uppercase tracking-wider">
                  {query ? 'Sonuçlar' : 'Popüler Aramalar'}
                </p>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-left group"
                  >
                    <span className="text-3xl">{suggestion.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-lg">{suggestion.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(suggestion.type)}`}>
                          {getTypeLabel(suggestion.type)}
                        </span>
                      </div>
                      {suggestion.description && (
                        <p className="text-sm text-gray-400">{suggestion.description}</p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quick Actions Footer */}
            <div className="border-t border-white/10 p-4 flex gap-3 flex-wrap bg-white/5">
              <button
                onClick={() => { router.push('/servisler'); setIsOpen(false); }}
                className="text-sm bg-primary-500/20 text-primary-300 px-4 py-2 rounded-full hover:bg-primary-500/30 transition-colors flex items-center gap-2"
              >
                🔧 Tüm Servisler
              </button>
              <button
                onClick={() => { router.push('/obd'); setIsOpen(false); }}
                className="text-sm bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full hover:bg-blue-500/30 transition-colors flex items-center gap-2"
              >
                📟 OBD Sorgula
              </button>
              <button
                onClick={() => { router.push('/kronik-sorunlar'); setIsOpen(false); }}
                className="text-sm bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full hover:bg-orange-500/30 transition-colors flex items-center gap-2"
              >
                ⚠️ Kronik Sorunlar
              </button>
              <button
                onClick={() => { router.push('/arac-degeri'); setIsOpen(false); }}
                className="text-sm bg-green-500/20 text-green-300 px-4 py-2 rounded-full hover:bg-green-500/30 transition-colors flex items-center gap-2"
              >
                📊 Araç Değeri
              </button>
            </div>
            
            {/* Keyboard hint */}
            <div className="px-4 py-2 bg-black/30 text-center">
              <span className="text-xs text-gray-500">ESC ile kapat</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
