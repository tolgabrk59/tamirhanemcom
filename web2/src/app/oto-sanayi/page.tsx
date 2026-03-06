'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Wrench,
  MapPin,
  Search,
  Shield,
  Clock,
  Star,
  ChevronRight,
  Cog,
  Hammer,
  PaintBucket,
  Zap,
  Car,
  CheckCircle2,
  Users,
  Award,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

const serviceCategories = [
  {
    title: 'Mekanik Bakım',
    description: 'Motor, şanzıman, fren ve süspansiyon onarımları',
    icon: Cog,
    count: '2.500+',
  },
  {
    title: 'Elektrik & Elektronik',
    description: 'Akü, alternatör, sensör ve beyin tamiri',
    icon: Zap,
    count: '1.200+',
  },
  {
    title: 'Kaporta & Boya',
    description: 'Kaporta düzeltme, boyama ve parlatma hizmetleri',
    icon: PaintBucket,
    count: '800+',
  },
  {
    title: 'Periyodik Bakım',
    description: 'Yağ değişimi, filtre, balata ve genel kontrol',
    icon: Wrench,
    count: '3.000+',
  },
  {
    title: 'Egzoz & Emisyon',
    description: 'Egzoz tamiri, katalitik konvertör ve emisyon ayarı',
    icon: Car,
    count: '600+',
  },
  {
    title: 'Özel Servis',
    description: 'Modifiye, aksesuar montajı ve özel projeler',
    icon: Hammer,
    count: '400+',
  },
]

const stats = [
  { value: '5.000+', label: 'Kayıtlı Oto Sanayi' },
  { value: '81', label: 'İl Genelinde' },
  { value: '50.000+', label: 'Tamamlanan İş' },
  { value: '4.6', label: 'Ortalama Puan' },
]

const benefits = [
  {
    icon: Shield,
    title: 'Güvenilir Ustalar',
    description: 'Tüm kayıtlı ustalar doğrulanmış ve deneyimli profesyonellerdir.',
  },
  {
    icon: Star,
    title: 'Kullanıcı Yorumları',
    description: 'Gerçek müşteri yorumları ve puanlamalarıyla en iyi servisi bulun.',
  },
  {
    icon: Clock,
    title: 'Hızlı Randevu',
    description: 'Online randevu sistemiyle bekleme süresini minimuma indirin.',
  },
  {
    icon: Award,
    title: 'Fiyat Karşılaştırma',
    description: 'Farklı servislerin fiyatlarını karşılaştırarak en uygununu seçin.',
  },
]

const steps = [
  { step: '01', title: 'Hizmeti Seçin', description: 'Aracınız için gereken hizmeti belirleyin' },
  { step: '02', title: 'Konum Belirleyin', description: 'Size en yakın oto sanayi noktalarını görün' },
  { step: '03', title: 'Karşılaştırın', description: 'Fiyat, puan ve yorumları inceleyerek karar verin' },
  { step: '04', title: 'Randevu Alın', description: 'Online randevu oluşturup aracınızı teslim edin' },
]

const popularCities = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Konya', 'Adana', 'Gaziantep',
]

export default function OtoSanayiPage() {
  const [selectedCity, setSelectedCity] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Hero Section */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
              <Wrench className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">Oto Sanayi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Oto Sanayi <span className="text-gold">Rehberi</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Türkiye genelindeki binlerce oto sanayi ve bağımsız servis arasından aracınıza en uygun olanı bulun.
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
                  placeholder="Hizmet veya usta adı ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  href={`/servis-ara?tip=industrial${selectedCity ? `&konum=${encodeURIComponent(selectedCity)}` : ''}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
                  className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Servis Bul
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Stats */}
      <section className="section-container mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <AnimatedSection key={stat.label} delay={0.1 + index * 0.06}>
              <div className="glass-card p-6 text-center">
                <span className="text-2xl md:text-3xl font-display font-extrabold text-gold block mb-1">
                  {stat.value}
                </span>
                <span className="text-xs text-th-fg-sub">{stat.label}</span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Service Categories */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-3">
              Hizmet <span className="text-gold">Kategorileri</span>
            </h2>
            <p className="text-th-fg-sub text-sm max-w-xl mx-auto">
              İhtiyacınıza uygun hizmet kategorisini seçin
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((cat, index) => (
            <AnimatedSection key={cat.title} delay={0.15 + index * 0.08}>
              <motion.div
                className="glass-card p-6 h-full"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <cat.icon className="w-6 h-6 text-brand-500" />
                  </div>
                  <span className="badge-gold text-[10px]">{cat.count} servis</span>
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-1">{cat.title}</h3>
                <p className="text-sm text-th-fg-sub">{cat.description}</p>
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
              Size En Yakın <span className="text-gold">Oto Sanayiyi</span> Bulun
            </h3>
            <p className="text-th-fg-sub text-sm max-w-lg mx-auto mb-8">
              Binlerce doğrulanmış oto sanayi ve bağımsız servis noktası arasından aracınıza en uygun olanı keşfedin.
            </p>
            <Link
              href="/servis-ara?tip=industrial"
              className="btn-gold px-10 py-4 text-sm inline-flex items-center gap-2"
            >
              Tüm Servisleri Gör
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
