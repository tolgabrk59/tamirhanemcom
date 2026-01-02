'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const navLinks = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/servisler', label: 'Servis Bul' },
    { href: '/randevu-al', label: 'Randevu Al' },
    { href: '/fiyat-hesapla', label: 'Fiyat Hesapla' },
  ];

  const megaMenus = {
    aracim: {
      title: 'Aracınız',
      columns: [
        {
          title: 'Temel Bilgiler',
          items: [
            { href: '/arac/genel-bakis', label: 'Aracınıza Genel Bakış', desc: 'Aracınızın özelliklerini ve verilerini keşfedin' },
            { href: '/arac/bakim-tavsiyeleri', label: 'Araç Bakımı Tavsiyeleri', desc: 'Uzman bakım önerileri ve ipuçları' },
            { href: '/arac/ansiklopedi', label: 'Araç Ansiklopedisi', desc: 'Otomotiv sistemleri hakkında detaylı bilgi' },
            { href: '/arac/yedek-parca', label: 'Parça Kütüphanesi', desc: 'Parça bilgileri ve fiyat karşılaştırması' },
            { href: '/arac/lastik-secimi', label: 'Lastik Seçimi', desc: 'Aracınıza uygun lastik bulun' },
          ]
        },
        {
          title: 'Sorun Giderme',
          items: [
            { href: '/ariza-rehberi', label: 'Arıza Rehberi', desc: 'Yaygın arızalar ve çözüm önerileri' },
            { href: '/kronik-sorunlar', label: 'Kronik Sorunlar', desc: 'Model bazlı bilinen sorunlar' },
            { href: '/forum', label: 'Forum', desc: 'Toplulukla deneyimlerinizi paylaşın' },
            { href: '/obd', label: 'OBD-II Kodları', desc: 'Arıza kodlarını anlamlandırın' },
            { href: '/bakim-planlama', label: 'Bakım Planlama', desc: 'Bakım takvimi ve hatırlatıcılar' },
          ]
        }
      ]
    },
    rehber: {
      title: 'Araç Rehberi',
      columns: [
        {
          title: 'Araştırma',
          items: [
            { href: '/incelemeler', label: 'Araba İncelemeleri', desc: 'Diğer araç sahiplerinin yorumları' },
            { href: '/karsilastirma', label: 'Önceki Karşılaştırmalar', desc: 'İhtiyaçlarınıza uygun aracı seçin' },
            { href: '/karsilastirma/olustur', label: 'Araba Karşılaştır', desc: 'İki aracı yan yana kıyaslayın (AI)' },
            { href: '/guvenilirlik', label: 'Güvenilirlik Derecelendirmeleri', desc: 'Marka ve model istatistikleri' },
            { href: '/arac/workshop-kilavuzlari', label: 'Workshop Kılavuzları', desc: 'Teknik dökümanlar ve tamir prosedürleri' },
          ]
        },
        {
          title: 'Araçlar & Rehberler',
          items: [
            { href: '/arac/deger-hesaplama', label: 'Araç Değer Hesaplama', desc: 'Aracınızın güncel piyasa değerini öğrenin' },
            { href: '/arac/videolar', label: 'Video İçerik Merkezi', desc: 'DIY bakım videoları ve rehberler' },
            { href: '/arac/elektrikli-araclar', label: 'Elektrikli Araç Rehberi', desc: 'EV şarj, bakım ve batarya bilgileri' },
          ]
        }
      ]
    },
    asistan: {
      title: 'AI Asistanım',
      columns: [
        {
          title: 'Yapay Zeka Araçları',
          items: [
            { href: '/ai/ariza-tespit', label: 'TamirHanem Asistan', desc: 'Belirtilerden arızayı tespit edin' },
            { href: '/ai/sohbet', label: 'TamirHanem Sohbet', desc: 'Araç sorunlarınız hakkında sohbet edin' },
          ]
        }
      ]
    }
  };


  // Generic icon for all menu items
  const MenuIcon = ({ className = "text-[#454545]" }: { className?: string }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
    </svg>
  );


  return (
    <header className={`${isHomePage ? 'bg-primary-600' : 'bg-white border-b border-secondary-200'} shadow-sm sticky top-0 z-50`}>

      {/* Main Header */}
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-extrabold tracking-tight hover:opacity-90 transition-opacity">
              <span className="text-[#454545]">tamirhane</span>
              <span className={isHomePage ? 'text-white' : 'text-primary-600'}>m</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${isHomePage ? 'text-[#454545] hover:bg-primary-500' : 'text-[#454545] hover:bg-secondary-100'} hover:text-secondary-900 px-3 py-2 rounded-lg font-bold transition-colors text-base`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mega Menu Triggers */}
            {Object.entries(megaMenus).map(([key, menu]) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => setActiveMenu(key)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className={`${isHomePage ? 'text-[#454545] hover:bg-primary-500' : 'text-[#454545] hover:bg-secondary-100'} hover:text-secondary-900 px-3 py-2 rounded-lg font-bold transition-colors flex items-center gap-1 text-base`}>
                  {key === 'asistan' && (
                    <svg className="w-4 h-4 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  {menu.title}
                  <svg className={`w-3 h-3 transition-transform ${activeMenu === key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown - positioned under the trigger */}
                {activeMenu === key && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className={`bg-white rounded-xl shadow-2xl border border-secondary-100 overflow-hidden ${menu.columns.length > 1 ? 'w-[480px]' : 'w-[280px]'}`}>
                      {/* Header */}
                      <div className="bg-primary-500 px-4 py-3">
                        <h2 className="text-white font-semibold text-sm">{menu.title}</h2>
                      </div>

                      <div className={`p-4 ${menu.columns.length > 1 ? 'grid grid-cols-2 gap-4' : ''}`}>
                        {menu.columns.map((column, idx) => (
                          <div key={idx}>
                            <h3 className="text-xs font-bold text-[#454545] uppercase tracking-wider mb-3 flex items-center gap-2">
                              <span className="w-6 h-0.5 bg-primary-500 rounded"></span>
                              {column.title}
                            </h3>
                            <ul className="space-y-1">
                              {column.items.map((item) => (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-50 transition-all group"
                                    onClick={() => setActiveMenu(null)}
                                  >
                                    <MenuIcon />
                                    <div>
                                      <p className="font-medium text-[#454545] group-hover:text-primary-600 transition-colors text-sm">
                                        {item.label}
                                      </p>
                                      {'desc' in item && (
                                        <p className="text-xs text-secondary-400">{item.desc}</p>
                                      )}
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Auth - Modern Dropdown */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Giriş Dropdown */}
            <div className="relative group">
              <button className={`flex items-center gap-1 ${isHomePage ? 'bg-white text-[#454545] hover:bg-gray-50' : 'bg-primary-600 text-[#454545] hover:bg-primary-700'} px-4 py-2 rounded-lg font-medium text-sm transition-colors`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Giriş Yap
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-64">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Hesap Türü Seçin</p>

                  <a href="https://tamirhanem.net/login.html" className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 transition-colors group/item">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Araç Sahibi</p>
                      <p className="text-xs text-gray-500">Giriş yap veya kayıt ol</p>
                    </div>
                  </a>

                  <a href="https://tamirhanem.net/esnaf-login.html" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors group/item mt-1">
                    <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Esnaf / Servis</p>
                      <p className="text-xs text-gray-500">İşletme hesabı</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Kayıt Ol Button */}
            <a href="https://tamirhanem.net/register.html" className="bg-secondary-900 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-secondary-800 transition-colors">
              Kayıt Ol
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMenuOpen(prev => !prev);
            }}
            className={`lg:hidden p-3 rounded-lg cursor-pointer select-none touch-manipulation ${isHomePage ? 'hover:bg-primary-700 active:bg-primary-700' : 'hover:bg-secondary-100 active:bg-secondary-200'}`}
            aria-label="Menüyü aç/kapat"
            aria-expanded={isMenuOpen}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <svg className={`w-7 h-7 pointer-events-none ${isHomePage ? 'text-white' : 'text-[#454545]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-primary-600 border-t border-primary-500">
          <div className="px-4 py-4 space-y-2">

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-white hover:bg-primary-500 px-3 py-2 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {Object.entries(megaMenus).map(([key, menu]) => (
              <div key={key} className="border-t border-primary-500 pt-3 mt-3">
                <p className="text-white font-semibold px-3 mb-2">{menu.title}</p>
                {menu.columns.map((column, idx) => (
                  <div key={idx} className="mb-3">
                    <p className="text-primary-200 text-xs font-bold uppercase px-3 mb-1">{column.title}</p>
                    {column.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 text-primary-50 hover:bg-primary-500 px-3 py-2 rounded-lg text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >

                        <MenuIcon className="text-primary-200" />

                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            ))}


            <div className="border-t border-primary-500 pt-3 mt-3 space-y-3">
              {/* Araç Sahibi */}
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white text-xs font-semibold mb-2">Araç Sahibi misin?</p>
                <div className="flex gap-2">
                  <a href="https://tamirhanem.net/login.html" className="flex-1 bg-white text-[#454545] px-3 py-2 rounded-lg font-medium text-center text-sm" onClick={() => setIsMenuOpen(false)}>
                    Giriş
                  </a>
                  <a href="https://tamirhanem.net/register.html" className="flex-1 bg-primary-700 text-white px-3 py-2 rounded-lg font-medium text-center text-sm" onClick={() => setIsMenuOpen(false)}>
                    Kayıt
                  </a>
                </div>
              </div>

              {/* Esnaf */}
              <div className="bg-secondary-900/50 rounded-lg p-3">
                <p className="text-white text-xs font-semibold mb-2">Esnaf mısın?</p>
                <div className="flex gap-2">
                  <a href="https://tamirhanem.net/esnaf-login.html" className="flex-1 bg-white text-[#454545] px-3 py-2 rounded-lg font-medium text-center text-sm" onClick={() => setIsMenuOpen(false)}>
                    Giriş
                  </a>
                  <a href="https://tamirhanem.net/esnaf-register.html" className="flex-1 bg-secondary-700 text-white px-3 py-2 rounded-lg font-medium text-center text-sm" onClick={() => setIsMenuOpen(false)}>
                    Kayıt
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
