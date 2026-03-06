'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Cog,
  Disc,
  Gauge,
  Zap,
  Thermometer,
  Settings,
  Wind,
  Fuel,
  CheckCircle,
  DollarSign,
  Info,
  Mail,
  MapPin,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const categories = [
  {
    name: 'Motor Parcalari',
    icon: Cog,
    parts: ['Yag Filtresi', 'Hava Filtresi', 'Buji', 'Triger Kayisi', 'V Kayisi', 'Motor Yagi'],
    href: '/arac/yedek-parca/motor',
  },
  {
    name: 'Fren Sistemi',
    icon: Disc,
    parts: ['Balata', 'Disk', 'Kampana', 'Fren Hidroligi', 'ABS Sensoru'],
    href: '/arac/yedek-parca/fren',
  },
  {
    name: 'Suspansiyon',
    icon: Gauge,
    parts: ['Amortisor', 'Helezon Yay', 'Rotil', 'Rot Kolu', 'Viraj Denge Cubugu'],
    href: '/arac/yedek-parca/suspansiyon',
  },
  {
    name: 'Elektrik & Aydinlatma',
    icon: Zap,
    parts: ['Aku', 'Alternator', 'Mars Motoru', 'Far Ampulu', 'Stop Lambasi'],
    href: '/arac/yedek-parca/elektrik',
  },
  {
    name: 'Sogutma Sistemi',
    icon: Thermometer,
    parts: ['Radyator', 'Termostat', 'Su Pompasi', 'Antifriz', 'Fan Kayisi'],
    href: '/arac/yedek-parca/sogutma',
  },
  {
    name: 'Sanziman & Debriyaj',
    icon: Settings,
    parts: ['Debriyaj Seti', 'Sanziman Yagi', 'Kardan Mili', 'Diferansiyel'],
    href: '/arac/yedek-parca/sanziman',
  },
  {
    name: 'Egzoz Sistemi',
    icon: Wind,
    parts: ['Katalitik Konvertor', 'Egzoz Susturucusu', 'Lambda Sensoru', 'Egzoz Borusu'],
    href: '/arac/yedek-parca/egzoz',
  },
  {
    name: 'Yakit Sistemi',
    icon: Fuel,
    parts: ['Yakit Pompasi', 'Yakit Filtresi', 'Enjektor', 'Yakit Deposu'],
    href: '/arac/yedek-parca/yakit',
  },
]

const popularParts = [
  { name: 'Yag Filtresi', avgCost: '50-150 TL', lifespan: '10.000 km', difficulty: 'Kolay' as const },
  { name: 'Fren Balatasi', avgCost: '200-600 TL', lifespan: '40.000 km', difficulty: 'Orta' as const },
  { name: 'Aku', avgCost: '800-2.000 TL', lifespan: '3-5 yil', difficulty: 'Kolay' as const },
  { name: 'Triger Kayisi', avgCost: '500-1.500 TL', lifespan: '60.000 km', difficulty: 'Zor' as const },
  { name: 'Amortisor', avgCost: '400-1.200 TL', lifespan: '80.000 km', difficulty: 'Orta' as const },
  { name: 'Buji', avgCost: '50-200 TL', lifespan: '30.000 km', difficulty: 'Kolay' as const },
]

const stats = [
  { value: '500+', label: 'Parca Bilgisi', sub: 'Detayli aciklamalar' },
  { value: '50+', label: 'Marka Kapsami', sub: 'Tum populer markalar' },
  { value: 'Guncel', label: 'Fiyat Bilgileri', sub: '2026 piyasa fiyatlari' },
]

export default function YedekParcaPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
              <Cog className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">Kapsamli Parca Bilgisi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Yedek Parca <span className="text-gold">Kutuphanesi</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto mb-8">
              Aracinizdaki her parcayi taniyin. Omru, maliyeti ve degisim zamani hakkinda bilgi edinin.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-fg-sub" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Hangi parcayi ariyorsunuz? (Orn: Balata, Aku, Filtre)"
                  className="input-dark pl-12 pr-24 text-base py-4"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 btn-gold px-5 py-2.5 text-xs">
                  <Search className="w-4 h-4" />
                  Ara
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Categories Grid */}
      <section className="section-container mb-16">
        <AnimatedSection delay={0.1}>
          <h2 className="text-2xl font-display font-bold text-th-fg mb-8 text-center">
            Kategoriye Gore <span className="text-gold">Kesfet</span>
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <AnimatedSection key={category.name} delay={0.12 + index * 0.05}>
              <Link href={category.href}>
                <motion.div
                  className="glass-card p-6 h-full group cursor-pointer"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                    <category.icon className="w-7 h-7 text-brand-500" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-th-fg mb-3 group-hover:text-brand-500 transition-colors">
                    {category.name}
                  </h3>
                  <ul className="space-y-2">
                    {category.parts.slice(0, 4).map((part) => (
                      <li key={part} className="text-xs text-th-fg-sub flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full shrink-0" />
                        {part}
                      </li>
                    ))}
                    {category.parts.length > 4 && (
                      <li className="text-xs text-brand-500 font-medium">
                        +{category.parts.length - 4} daha fazla
                      </li>
                    )}
                  </ul>
                </motion.div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Popular Parts */}
      <section className="section-container mb-16">
        <AnimatedSection delay={0.1}>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-bold text-th-fg mb-3">
              En Cok Aranan <span className="text-gold">Parcalar</span>
            </h2>
            <p className="text-th-fg-sub text-sm">
              Arac sahiplerinin en sik degistirdigi parcalar ve ortalama maliyetleri
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularParts.map((part, index) => (
            <AnimatedSection key={part.name} delay={0.15 + index * 0.05}>
              <motion.div
                className="glass-card p-6 group cursor-pointer"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                    <Cog className="w-6 h-6 text-brand-500" />
                  </div>
                  <span
                    className={cn(
                      'text-xs px-3 py-1 rounded-full font-semibold',
                      part.difficulty === 'Kolay'
                        ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                        : part.difficulty === 'Orta'
                          ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                          : 'bg-red-500/15 text-red-400 border border-red-500/20'
                    )}
                  >
                    {part.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-4 group-hover:text-brand-500 transition-colors">
                  {part.name}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-th-fg-sub">Ortalama Maliyet</span>
                    <span className="text-base font-display font-bold text-gold">{part.avgCost}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-th-fg-sub">Ortalama Omur</span>
                    <span className="text-sm font-semibold text-th-fg">{part.lifespan}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="section-container mb-16">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="text-4xl md:text-5xl font-display font-extrabold text-gold mb-2 group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <p className="text-th-fg font-semibold text-lg">{stat.label}</p>
                  <p className="text-th-fg-muted text-sm mt-1">{stat.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Features */}
      <section className="section-container mb-16">
        <AnimatedSection delay={0.1}>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-bold text-th-fg mb-3">
              Neden TamirHanem <span className="text-gold">Yedek Parca Kutuphanesi?</span>
            </h2>
            <p className="text-th-fg-sub text-sm">
              Araciniz icin dogru parcayi bulmak artik cok daha kolay
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: CheckCircle,
              title: 'Dogrulanmis Bilgiler',
              description: 'Tum parca bilgileri uzman mekanikler tarafindan dogrulanmistir',
            },
            {
              icon: DollarSign,
              title: 'Guncel Fiyatlar',
              description: 'Piyasa fiyatlari duzenli olarak guncellenir',
            },
            {
              icon: Info,
              title: 'Detayli Aciklamalar',
              description: 'Her parcanin islevi ve degisim zamani hakkinda bilgi',
            },
          ].map((feature, index) => (
            <AnimatedSection key={feature.title} delay={0.15 + index * 0.1}>
              <motion.div
                className="glass-card p-6 h-full"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-brand-500" />
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-2">{feature.title}</h3>
                <p className="text-sm text-th-fg-sub">{feature.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.2}>
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-4">
              Aradiginiz Parcayi <span className="text-gold">Bulamadiniz mi?</span>
            </h2>
            <p className="text-th-fg-sub text-base mb-8 max-w-xl mx-auto">
              Uzman ekibimize sorun, size yardimci olalim. 7/24 destek hattimiz hizmetinizde.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/iletisim" className="btn-gold px-8 py-3 text-sm inline-flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Bize Ulasin
              </Link>
              <Link
                href="/servis-ara"
                className="px-8 py-3 rounded-xl border border-th-border/20 bg-th-overlay/[0.05] text-th-fg hover:bg-th-overlay/[0.08] transition-all text-sm font-semibold inline-flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Servis Bul
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
