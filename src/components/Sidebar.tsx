'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Droplets, X, ArrowRight, Briefcase } from 'lucide-react';

// SVG Icons as components - Gray colored
const HomeIcon = () => (
  <svg className="w-5 h-5 text-[#454545]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5 text-[#454545]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5 text-[#454545]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CalculatorIcon = () => (
  <svg className="w-5 h-5 text-[#454545]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const CarIcon = () => (
  <svg className="w-5 h-5 text-[#454545]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 0-7 0m14 0a2 2 0 012 2v5a2 2 0 01-2 2h-1m-12-9a2 2 0 00-2 2v5a2 2 0 002 2h1m0-9l1.5-4.5A2 2 0 017.4 4h9.2a2 2 0 011.9 1.5L20 9M5 16a2 2 0 100-4 2 2 0 000 4zm14 0a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-5 h-5 text-[#454545]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const RobotIcon = () => (
  <svg className="w-5 h-5 text-[#454545]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5 text-[#454545]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ServiceIcon = () => (
  <Briefcase className="w-5 h-5 text-[#454545]" strokeWidth={1.5} />
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`w-4 h-4 text-[#454545] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [showLoginSpotlight, setShowLoginSpotlight] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const pathname = usePathname();

  // Check if login spotlight should be shown
  useEffect(() => {
    const dismissed = localStorage.getItem('loginSpotlightDismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    // Show again after 7 days
    if (!dismissed || Date.now() - dismissedTime > 7 * 24 * 60 * 60 * 1000) {
      // Small delay for better UX
      const timer = setTimeout(() => setShowLoginSpotlight(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissLoginSpotlight = () => {
    setShowLoginSpotlight(false);
    localStorage.setItem('loginSpotlightDismissed', Date.now().toString());
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setExpandedMenu(null);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // Reset expanded menu when sidebar collapses
  useEffect(() => {
    if (!isHovered) {
      setExpandedMenu(null);
    }
  }, [isHovered]);

  const navLinks = [
    { href: '/', label: 'Ana Sayfa', icon: HomeIcon },
    { href: '/servisler', label: 'Servis Ara', icon: SearchIcon },
    { href: '/randevu-al', label: 'Randevu Al', icon: CalendarIcon },
  ];

  const megaMenus = {
    hizmetlerimiz: {
      title: 'Hizmetlerimiz',
      icon: ServiceIcon,
      columns: [
        {
          title: 'Hizmetler',
          items: [
            { href: '/oto-yikama', label: 'Oto Yıkama' },
            { href: '/oto-sanayi', label: 'Oto Sanayi' },
            { href: '/oto-kiralama', label: 'Oto Kiralama' },
            { href: '/oto-sigorta', label: 'Oto Sigorta' },
            { href: '/arac/2-el-parca', label: '2.El Parça' },
          ]
        }
      ]
    },
    aracim: {
      title: 'Araç Bilgi Ekranı',
      icon: CarIcon,
      columns: [
        {
          title: 'Temel Bilgiler',
          items: [
            { href: '/arac/genel-bakis', label: 'Aracınıza Genel Bakış' },
            { href: '/arac-degeri', label: 'Araç Değeri Hesapla' },
            { href: '/arac/bakim-tavsiyeleri', label: 'Bakım Tavsiyeleri' },
            { href: '/arac/ansiklopedi', label: 'Araç Ansiklopedisi' },
            { href: '/arac/yedek-parca', label: 'Parça Kütüphanesi' },
            { href: '/arac/2-el-parca', label: '2.El Parça Pazaryeri' },
            { href: '/arac/lastik-secimi', label: 'Lastik Seçimi' },
            { href: '/arac/ariza-lambalari', label: 'Arıza Lambaları' },
            { href: '/sarj-istasyonlari', label: 'Şarj İstasyonları' },
          ]
        },
        {
          title: 'Sorun Giderme',
          items: [
            { href: '/ariza-rehberi', label: 'Arıza Rehberi' },
            { href: '/kronik-sorunlar', label: 'Kronik Sorunlar' },
            { href: '/geri-cagrima', label: 'Geri Çağırmalar' },
            { href: '/obd', label: 'OBD-II Kodları' },
            { href: '/bakim-planlama', label: 'Bakım Planlama' },
            { href: '/arac/park-mesaj', label: 'Hatalı Park Bildirimi' },
            { href: '/arac/plaka-kayit', label: 'Plakamı Kaydet' },
          ]
        }
      ]
    },
    rehber: {
      title: 'Araç Rehberi',
      icon: BookIcon,
      columns: [
        {
          title: 'Araştırma',
          items: [
            { href: '/incelemeler', label: 'Araba İncelemeleri' },
            { href: '/karsilastirma', label: 'Önceki Karşılaştırmalar' },
            { href: '/karsilastirma/olustur', label: 'Araba Karşılaştır' },
            { href: '/guvenilirlik', label: 'Güvenilirlik Derecelendirmeleri' },
            { href: '/arac/workshop-kilavuzlari', label: 'Workshop Kılavuzları' },
            { href: '/arac/videolar', label: 'Video İçerik Merkezi' },
          ]
        }
      ]
    },
    asistan: {
      title: 'AI Asistan',
      icon: RobotIcon,
      columns: [
        {
          title: 'Yapay Zeka Araçları',
          items: [
            { href: '/ai/ariza-tespit', label: 'TamirHanem Asistan' },
            { href: '/ai/sohbet', label: 'TamirHanem Sohbet' },
          ]
        }
      ]
    }
  };

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const toggleMenu = (key: string) => {
    if (isHovered || isMobileOpen) {
      setExpandedMenu(expandedMenu === key ? null : key);
    }
  };

  const isExpanded = isHovered;

  const SidebarContent = ({ alwaysExpanded = false }: { alwaysExpanded?: boolean }) => {
    const showLabels = alwaysExpanded || isExpanded;

    return (
      <div className="flex flex-col h-full">
        {/* Navigation - starts from top */}
        <nav className="flex-1 py-4 px-2 space-y-1" aria-label="Ana navigasyon">
          {/* Main Links */}
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                  ${isActiveLink(link.href)
                    ? 'bg-white/20 text-[#454545]'
                    : 'text-[#454545] hover:bg-white/10'
                  }`}
                title={!showLabels ? link.label : undefined}
              >
                <span className="flex-shrink-0">
                  <Icon />
                </span>
                {showLabels && (
                  <span className="text-[15px] font-semibold whitespace-nowrap font-[family-name:var(--font-jakarta)]">
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-4 border-t border-[#454545]/20" />

          {/* Expandable Menus */}
          {Object.entries(megaMenus).map(([key, menu]) => {
            const Icon = menu.icon;
            return (
              <div key={key}>
                <button
                  onClick={() => toggleMenu(key)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                    ${expandedMenu === key
                      ? 'bg-white/15 text-[#454545]'
                      : 'text-[#454545] hover:bg-white/10'
                    }`}
                  title={!showLabels ? menu.title : undefined}
                >
                  <span className="flex-shrink-0">
                    <Icon />
                  </span>
                  {showLabels && (
                    <>
                      <span className="flex-1 text-left text-[15px] font-semibold whitespace-nowrap font-[family-name:var(--font-jakarta)]">
                        {menu.title}
                      </span>
                      <ChevronIcon isOpen={expandedMenu === key} />
                    </>
                  )}
                </button>

                {/* Submenu */}
                {expandedMenu === key && showLabels && (
                  <div className="mt-1 ml-3 pl-3 border-l-2 border-[#454545]/30 space-y-2">
                    {menu.columns.map((column, idx) => (
                      <div key={idx}>
                        <p className="text-[#454545]/60 text-xs font-bold uppercase px-3 mb-1 font-[family-name:var(--font-jakarta)]">{column.title}</p>
                        {column.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 font-[family-name:var(--font-jakarta)]
                              ${isActiveLink(item.href)
                                ? 'bg-white/20 text-[#454545]'
                                : 'text-[#454545]/80 hover:bg-white/10 hover:text-[#454545]'
                              }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer - Auth Buttons */}
        {showLabels && (
          <div className="p-4 border-t border-[#454545]/20 space-y-2">
            {/* Mobile Login Spotlight */}
            {showLoginSpotlight && alwaysExpanded && (
              <div className="relative bg-gradient-to-r from-primary-400 to-primary-300 text-secondary-900 px-3 py-3 rounded-xl mb-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dismissLoginSpotlight();
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-secondary-800 text-white rounded-full flex items-center justify-center hover:bg-secondary-700 transition-colors shadow-lg z-10"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-secondary-800 rounded-full flex items-center justify-center animate-pulse">
                    <Droplets className="w-4 h-4 text-primary-400" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Oto Yıkama Aktif!</p>
                    <p className="text-xs text-secondary-700">Giriş yapın ve randevu alın</p>
                  </div>
                </div>
                {/* Arrow pointing down */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary-300 rotate-45"></div>
              </div>
            )}
            <a
              href="https://app.tamirhanem.com/login.html"
              className="flex items-center justify-center gap-2 w-full bg-white text-[#454545] px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors font-[family-name:var(--font-jakarta)]"
            >
              <UserIcon />
              Giriş Yap
            </a>
            <a
              href="https://app.tamirhanem.com/register.html"
              className="flex items-center justify-center w-full bg-white/10 text-[#454545] px-4 py-2.5 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-[#454545]/20 font-[family-name:var(--font-jakarta)]"
            >
              Kayıt Ol
            </a>
          </div>
        )}

        {/* Collapsed state - user icon positioned above AI assistant button */}
        {!showLabels && (
          <div className="p-2 pb-4 border-t border-[#454545]/20">
            <a
              href="https://app.tamirhanem.com/login.html"
              className="flex items-center justify-center w-full p-3 rounded-lg text-[#454545] hover:bg-white/10 transition-colors"
              title="Giriş Yap"
            >
              <UserIcon />
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-primary-600 shadow-lg">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-[#454545]">tamirhane</span>
              <span className="text-[#454545]">m</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMobileOpen(prev => !prev);
            }}
            className="p-3 rounded-lg hover:bg-primary-500 active:bg-primary-700 transition-colors cursor-pointer select-none touch-manipulation"
            aria-label="Menüyü aç/kapat"
            aria-expanded={isMobileOpen}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <svg className="w-6 h-6 text-[#454545] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[45] backdrop-blur-sm touch-manipulation"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMobileOpen(false);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            setIsMobileOpen(false);
          }}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        />
      )}

      {/* Mobile Sidebar - Always expanded */}
      <aside
        className={`lg:hidden fixed top-14 left-0 bottom-0 w-72 bg-primary-600 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent alwaysExpanded={true} />
      </aside>

      {/* Desktop Bottom Navigation Bar */}
      <nav className="hidden lg:flex fixed bottom-0 left-16 right-0 h-14 bg-primary-500 z-40 items-center justify-between px-2 2xl:px-6 overflow-visible">
        {/* Main Navigation Links */}
        <div className="flex items-center gap-0.5 2xl:gap-1 flex-1 min-w-0 overflow-visible">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1 2xl:gap-2 px-1.5 lg:px-2 2xl:px-4 py-2 rounded-lg transition-all flex-shrink
                  ${isActiveLink(link.href)
                    ? 'bg-white/20 text-[#454545]'
                    : 'text-[#454545] hover:bg-white/10'
                  }`}
              >
                <Icon />
                <span className="text-[11px] lg:text-xs 2xl:text-sm font-semibold font-[family-name:var(--font-jakarta)] whitespace-nowrap">{link.label}</span>
              </Link>
            );
          })}

          {/* Divider */}
          <div className="h-6 w-px bg-[#454545]/30 mx-0.5 lg:mx-1 2xl:mx-2 flex-shrink-0" />

          {/* Mega Menu Dropdowns */}
          {Object.entries(megaMenus).map(([key, menu]) => {
            const Icon = menu.icon;
            const hasMultipleColumns = menu.columns.length > 1;
            return (
              <div key={key} className="relative flex-shrink" onMouseEnter={() => setHoveredMenu(key)} onMouseLeave={() => setHoveredMenu(null)}>
                <button
                  className="flex items-center gap-1 2xl:gap-2 px-1.5 lg:px-2 2xl:px-4 py-2 rounded-lg text-[#454545] hover:bg-white/10 transition-all"
                >
                  <Icon />
                  <span className="text-[11px] lg:text-xs 2xl:text-sm font-semibold font-[family-name:var(--font-jakarta)] whitespace-nowrap">{menu.title}</span>
                  <svg className={`w-3 h-3 2xl:w-4 2xl:h-4 transition-transform ${hoveredMenu === key ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>

                {/* Dropdown - opens upward */}
                {hoveredMenu === key && (
                  <div className={`absolute bottom-full left-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-visible before:content-[''] before:absolute before:w-full before:h-4 before:-bottom-4 before:left-0 transition-all z-[60] ${hasMultipleColumns ? 'w-[420px]' : 'w-56'}`}>
                    {/* Header */}
                    <div className="bg-primary-500 px-4 py-2">
                      <h3 className="text-secondary-800 font-semibold text-sm font-[family-name:var(--font-jakarta)]">{menu.title}</h3>
                    </div>

                    <div className={`p-3 ${hasMultipleColumns ? 'grid grid-cols-2 gap-3' : ''}`}>
                      {menu.columns.map((column, idx) => (
                        <div key={idx}>
                          <h4 className="text-xs font-bold text-[#454545] uppercase tracking-wider mb-2 flex items-center gap-2 font-[family-name:var(--font-jakarta)]">
                            <span className="w-4 h-0.5 bg-primary-500 rounded"></span>
                            {column.title}
                          </h4>
                          <div className="space-y-0.5">
                            {column.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={`block px-3 py-1.5 rounded-lg text-sm transition-colors font-[family-name:var(--font-jakarta)]
                                ${isActiveLink(item.href)
                                    ? 'bg-primary-50 text-primary-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                  }`}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Divider */}
          <div className="h-6 w-px bg-[#454545]/30 mx-0.5 lg:mx-1 2xl:mx-2 flex-shrink-0" />

          {/* WhatsApp Support Button */}
          <a
            href="https://wa.me/905446207275"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 2xl:gap-2 px-2 2xl:px-4 py-2 bg-[#128C7E] hover:bg-[#075E54] rounded-lg transition-all text-white font-semibold text-[11px] lg:text-xs 2xl:text-sm shadow-md hover:shadow-lg font-[family-name:var(--font-jakarta)] flex-shrink-0 whitespace-nowrap"
            title="WhatsApp Destek"
          >
            <svg className="w-4 h-4 2xl:w-5 2xl:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="hidden xl:inline">Destek</span>
          </a>

          {/* Bug Report Button */}
          <Link
            href="/hata-bildir"
            className="flex items-center justify-center gap-1 2xl:gap-2 px-2 2xl:px-4 py-2 bg-transparent border-2 border-secondary-600/60 hover:border-secondary-600 hover:bg-secondary-600/10 rounded-lg transition-all text-secondary-700 font-semibold text-[11px] lg:text-xs 2xl:text-sm font-[family-name:var(--font-jakarta)] flex-shrink-0 whitespace-nowrap"
            title="Hata Bildir"
          >
            <svg className="w-4 h-4 2xl:w-5 2xl:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="hidden xl:inline">Bildir</span>
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-1 2xl:gap-2 flex-shrink-0 ml-2">
          <div className="relative">
            <a
              href="https://app.tamirhanem.com/login.html"
              className="flex items-center justify-center gap-1 2xl:gap-2 px-2 2xl:px-4 py-2 text-[#454545] hover:bg-white/10 rounded-lg transition-colors text-[11px] lg:text-xs 2xl:text-sm font-semibold font-[family-name:var(--font-jakarta)] whitespace-nowrap"
              title="Giriş Yap"
            >
              <UserIcon />
              <span className="hidden xl:inline">Giriş</span>
            </a>

            {/* Login Spotlight - Oto Yıkama Announcement */}
            {showLoginSpotlight && (
              <div className="absolute bottom-full right-0 mb-3 z-[100] animate-bounce-slow">
                <div className="relative bg-gradient-to-r from-primary-500 to-primary-400 text-secondary-900 px-4 py-3 rounded-xl shadow-2xl min-w-[260px]">
                  {/* Close button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dismissLoginSpotlight();
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-secondary-800 text-white rounded-full flex items-center justify-center hover:bg-secondary-700 transition-colors shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {/* Content */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center animate-pulse">
                      <Droplets className="w-5 h-5 text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm mb-1">Oto Yıkama Aktif!</p>
                      <p className="text-xs text-secondary-700 mb-2">Giriş yapın ve hemen randevu alın.</p>
                      <a
                        href="https://app.tamirhanem.com/login.html"
                        className="inline-flex items-center gap-1 text-xs font-bold text-secondary-900 hover:underline"
                      >
                        Giriş Yap
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Arrow pointing down */}
                  <div className="absolute -bottom-2 right-8 w-4 h-4 bg-primary-400 rotate-45"></div>
                </div>
              </div>
            )}
          </div>
          <a
            href="https://app.tamirhanem.com/register.html"
            className="px-2 xl:px-3 2xl:px-4 py-2 bg-[#454545] text-primary-500 rounded-lg font-semibold text-[11px] lg:text-xs 2xl:text-sm hover:bg-[#555] transition-colors font-[family-name:var(--font-jakarta)] whitespace-nowrap"
          >
            Kayıt
          </a>
        </div>
      </nav>
    </>
  );
}
