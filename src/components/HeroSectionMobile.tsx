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

// Use Tailwind classes instead of inline styles

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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_theme(colors.primary.500)_1px,_transparent_0)] bg-[length:40px_40px]" />
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
            <span className="block text-primary-400">
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
            <div className="text-3xl mb-2">🔧</div>
            <div className="text-white font-semibold text-sm">Servis Bul</div>
          </Link>
          <Link
            href="/ai/ariza-tespit"
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-all"
          >
            <div className="text-3xl mb-2">🤖</div>
            <div className="text-white font-semibold text-sm">AI Asistan</div>
          </Link>
          <Link
            href="/kronik-sorunlar"
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-all"
          >
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-white font-semibold text-sm">Kronik Sorunlar</div>
          </Link>
          <Link
            href="/fiyat-hesapla"
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-all"
          >
            <div className="text-3xl mb-2">💰</div>
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
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary-500/20"
                  >
                    <span className="text-2xl">{getIconEmoji(part.icon)}</span>
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
            className="inline-block px-8 py-3 rounded-xl font-semibold text-gray-900 bg-primary-500 hover:bg-primary-400 transition-all hover:scale-105"
          >
            Tüm Hizmetleri Gör
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function getIconEmoji(icon: string): string {
  const iconMap: Record<string, string> = {
    motor: '⚙️',
    fren: '🛑',
    lastik: '🔧',
    elektrik: '⚡',
    karoser: '🎨',
  };
  return iconMap[icon] || '🔧';
}
