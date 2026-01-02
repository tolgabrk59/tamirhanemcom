'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from './ui/Icons';

interface CarPart {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  details: string[];
}

const SITE_YELLOW = '#FBC91D';

const carParts: CarPart[] = [
  {
    id: 'motor',
    name: 'Motor',
    description: 'Motor bakım & onarım',
    href: '/servisler?category=motor-bakim',
    icon: 'motor',
    details: ['Yağ değişimi', 'Triger kayışı', 'Motor revizyonu'],
  },
  {
    id: 'fren',
    name: 'Fren',
    description: 'Fren sistemi servisi',
    href: '/servisler?category=fren',
    icon: 'fren',
    details: ['Balata değişimi', 'Disk tornalama', 'Fren hidroliği'],
  },
  {
    id: 'lastik',
    name: 'Lastik',
    description: 'Lastik değişim & balans',
    href: '/servisler?category=lastik',
    icon: 'lastik',
    details: ['Lastik değişimi', 'Balans ayarı', 'Rot balans'],
  },
  {
    id: 'elektrik',
    name: 'Far & Elektrik',
    description: 'Elektrik & aydınlatma',
    href: '/servisler?category=elektrik',
    icon: 'elektrik',
    details: ['Akü değişimi', 'Far ayarı', 'Kablo tamiri'],
  },
  {
    id: 'karoser',
    name: 'Kaporta & Boya',
    description: 'Boya & kaporta',
    href: '/servisler?category=kaporta',
    icon: 'karoser',
    details: ['Boya işlemi', 'Göçük düzeltme', 'Çizik giderme'],
  },
];

export default function HeroSectionMobile() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${SITE_YELLOW} 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 py-12">
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Aracınız için
            <span className="block" style={{ color: SITE_YELLOW }}>
              her şey burada
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Uzman servisler, AI destekli arıza tespiti ve detaylı araç bilgileri
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-8 max-w-md mx-auto"
        >
          <Link
            href="/servisler"
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-all"
          >
            <div className="mb-2 flex items-center justify-center">
              <svg className="w-8 h-8" style={{ color: SITE_YELLOW }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-white font-semibold text-sm">Servis Bul</div>
          </Link>
          <Link
            href="/ai/ariza-tespit"
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-all"
          >
            <div className="mb-2 flex items-center justify-center">
              <svg className="w-8 h-8" style={{ color: SITE_YELLOW }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-white font-semibold text-sm">AI Asistan</div>
          </Link>
          <Link
            href="/kronik-sorunlar"
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-all"
          >
            <div className="mb-2 flex items-center justify-center">
              <svg className="w-8 h-8" style={{ color: SITE_YELLOW }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-white font-semibold text-sm">Kronik Sorunlar</div>
          </Link>
          <Link
            href="/fiyat-hesapla"
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-all"
          >
            <div className="mb-2 flex items-center justify-center">
              <svg className="w-8 h-8" style={{ color: SITE_YELLOW }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-white font-semibold text-sm">Fiyat Hesapla</div>
          </Link>
        </motion.div>

        {/* Service Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-3"
        >
          <h2 className="text-white text-xl font-bold text-center mb-4">
            Popüler Hizmetler
          </h2>
          {carParts.map((part, index) => (
            <motion.div
              key={part.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            >
              <Link
                href={part.href}
                className="block bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${SITE_YELLOW}20` }}
                  >
                    {getServiceIcon(part.icon, SITE_YELLOW)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{part.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{part.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {part.details.slice(0, 2).map((detail, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 text-center"
        >
          <Link
            href="/servisler"
            className="inline-block px-8 py-3 rounded-xl font-semibold text-gray-900 transition-all hover:scale-105"
            style={{ backgroundColor: SITE_YELLOW }}
          >
            Tüm Hizmetleri Gör
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function getServiceIcon(icon: string, color: string) {
  const iconProps = {
    className: "w-6 h-6",
    style: { color },
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (icon) {
    case 'motor':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m5.2-14.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m14.2 5.2l-4.2-4.2m0-6l-4.2-4.2" />
        </svg>
      );
    case 'fren':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>
      );
    case 'lastik':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case 'elektrik':
      return (
        <svg {...iconProps}>
          <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
        </svg>
      );
    case 'karoser':
      return (
        <svg {...iconProps}>
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
  }
}
