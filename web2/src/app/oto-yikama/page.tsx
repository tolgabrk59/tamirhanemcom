'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Droplets,
  MapPin,
  Search,
  ChevronRight,
  Clock,
  Star,
  Sparkles,
  Car,
  Shield,
  CheckCircle2,
  Timer,
  Leaf,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

const washTypes = [
  {
    title: 'Dış Yıkama',
    description: 'Basınçlı su, köpük ve kurulama ile dış temizlik',
    icon: Droplets,
    duration: '20-30 dk',
    priceRange: '150 - 300 TL',
  },
  {
    title: 'İç Dış Yıkama',
    description: 'Komple iç temizlik ve dış yıkama paketi',
    icon: Sparkles,
    duration: '45-60 dk',
    priceRange: '300 - 600 TL',
  },
  {
    title: 'Detaylı Temizlik',
    description: 'Derin iç temizlik, koltuk yıkama ve detaylı bakım',
    icon: Star,
    duration: '2-3 saat',
    priceRange: '800 - 1.500 TL',
  },
  {
    title: 'Seramik Kaplama',
    description: 'Uzun süreli koruma sağlayan profesyonel seramik kaplama',
    icon: Shield,
    duration: '4-8 saat',
    priceRange: '3.000 - 8.000 TL',
  },
  {
    title: 'Pasta Cila',
    description: 'Boya yenileme, çizik giderme ve parlatma işlemi',
    icon: Car,
    duration: '3-5 saat',
    priceRange: '1.500 - 4.000 TL',
  },
  {
    title: 'Motor Yıkama',
    description: 'Motor bölümü temizliği ve koruma spreyleme',
    icon: Timer,
    duration: '30-45 dk',
    priceRange: '200 - 500 TL',
  },
]

const benefits = [
  {
    icon: Star,
    title: 'Profesyonel Ekipman',
    description: 'Yüksek kaliteli basınçlı yıkama ve buhar makineleri ile temizlik.',
  },
  {
    icon: Leaf,
    title: 'Çevre Dostu',
    description: 'Su tasarrufu sağlayan ve çevre dostu temizlik ürünleri kullanılır.',
  },
  {
    icon: Clock,
    title: 'Randevulu Hizmet',
    description: 'Online randevu ile bekleme süresini sıfıra indirin.',
  },
  {
    icon: Shield,
    title: 'Garanti',
    description: 'Detaylı temizlik ve kaplama işlemlerinde hizmet garantisi.',
  },
]

const steps = [
  { step: '01', title: 'Konum Seçin', description: 'Size en yakın oto yıkama noktasını bulun' },
  { step: '02', title: 'Paket Belirleyin', description: 'İhtiyacınıza uygun yıkama paketini seçin' },
  { step: '03', title: 'Randevu Alın', description: 'Uygun saatte online randevu oluşturun' },
  { step: '04', title: 'Tertemiz Araç', description: 'Aracınız profesyonelce temizlensin' },
]

const popularCities = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Konya', 'Adana', 'Tekirdağ',
]

export default function OtoYikamaPage() {
  const [selectedCity, setSelectedCity] = useState('')

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Hero Section */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
              <Droplets className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">Oto Yıkama</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Profesyonel Oto <span className="text-gold">Yıkama</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Dış yıkamadan detaylı temizliğe, seramik kaplamadan pasta cilaya kadar tüm oto yıkama hizmetleri tek çatı altında.
            </p>
          </div>
        </AnimatedSection>

        {/* Search Card */}
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative lg:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-sub pointer-events-none" />
                <input
                  type="text"
                  placeholder="Oto yıkama adı ara..."
                  className="input-dark pl-9"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-sub pointer-events-none" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="input-dark pl-9 appearance-none cursor-pointer"
                >
                  <option value="">Şehir Seçin</option>
                  {popularCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <Link
                  href={`/servis-ara?tip=car_wash${selectedCity ? `&konum=${encodeURIComponent(selectedCity)}` : ''}`}
                  className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Yıkama Bul
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Wash Types */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-3">
              Yıkama <span className="text-gold">Paketleri</span>
            </h2>
            <p className="text-th-fg-sub text-sm max-w-xl mx-auto">
              Aracınızın ihtiyacına uygun temizlik paketini seçin
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {washTypes.map((wash, index) => (
            <AnimatedSection key={wash.title} delay={0.15 + index * 0.08}>
              <motion.div
                className="glass-card p-6 h-full"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <wash.icon className="w-6 h-6 text-brand-500" />
                  </div>
                  <span className="badge-gold text-[10px]">{wash.priceRange}</span>
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-1">{wash.title}</h3>
                <p className="text-sm text-th-fg-sub mb-3">{wash.description}</p>
                <div className="flex items-center gap-2 text-xs text-th-fg-muted">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{wash.duration}</span>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-3">
              Nasıl <span className="text-gold">Çalışır</span>?
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <AnimatedSection key={item.step} delay={0.1 + index * 0.08}>
              <div className="glass-card p-6 h-full relative">
                <span className="text-4xl font-display font-extrabold text-brand-500/20 absolute top-4 right-4">
                  {item.step}
                </span>
                <h3 className="text-lg font-display font-bold text-th-fg mb-2">{item.title}</h3>
                <p className="text-sm text-th-fg-sub">{item.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-3">
              Neden <span className="text-gold">Tamirhanem</span>?
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <AnimatedSection key={benefit.title} delay={0.1 + index * 0.08}>
              <motion.div
                className="glass-card p-6 flex items-start gap-4 h-full"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                  <benefit.icon className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-th-fg mb-1">{benefit.title}</h3>
                  <p className="text-sm text-th-fg-sub">{benefit.description}</p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.2}>
          <div className="glass-card p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-4">
              Aracınız <span className="text-gold">Tertemiz</span> Olsun
            </h3>
            <p className="text-th-fg-sub text-sm max-w-lg mx-auto mb-8">
              Size en yakın profesyonel oto yıkama noktasını bulun ve aracınızı pırıl pırıl hale getirin.
            </p>
            <Link
              href="/servis-ara?tip=car_wash"
              className="btn-gold px-10 py-4 text-sm inline-flex items-center gap-2"
            >
              Oto Yıkama Bul
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
