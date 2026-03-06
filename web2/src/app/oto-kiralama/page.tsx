'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Car,
  MapPin,
  Calendar,
  Shield,
  Clock,
  Search,
  ChevronRight,
  Star,
  Users,
  Fuel,
  Settings2,
  CheckCircle2,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

const vehicleCategories = [
  {
    title: 'Ekonomik',
    description: 'Bütce dostu, yakıt tasarruflu araclar',
    icon: Fuel,
    priceRange: '800 - 1.500 TL/gun',
    example: 'Fiat Egea, Renault Clio',
  },
  {
    title: 'Konfor',
    description: 'Genis ve konforlu sedanlar',
    icon: Users,
    priceRange: '1.500 - 3.000 TL/gun',
    example: 'Toyota Corolla, VW Passat',
  },
  {
    title: 'SUV',
    description: 'Genis aile araclari ve araziye uygun',
    icon: Car,
    priceRange: '2.500 - 5.000 TL/gun',
    example: 'Dacia Duster, Hyundai Tucson',
  },
  {
    title: 'Premium',
    description: 'Lüks ve prestijli araclar',
    icon: Star,
    priceRange: '5.000 - 15.000 TL/gun',
    example: 'BMW 5, Mercedes E',
  },
]

const benefits = [
  {
    icon: Shield,
    title: 'Kasko Dahil',
    description: 'Tum kiralama sürecinde tam kasko güvencesi standart olarak sunulur.',
  },
  {
    icon: Clock,
    title: '7/24 Yol Yardim',
    description: 'Herhangi bir sorun yasadiginizda 7 gun 24 saat destek hattimiz yanınızda.',
  },
  {
    icon: Settings2,
    title: 'Bakimli Araclar',
    description: 'Tum araclarimiz düzenli bakim ve kontrol sürecinden gecmistir.',
  },
  {
    icon: CheckCircle2,
    title: 'Kolay Rezervasyon',
    description: 'Online rezervasyon sistemiyle dakikalar icinde arac kiralayabilirsiniz.',
  },
]

const steps = [
  { step: '01', title: 'Konum Sec', description: 'Arac almak istediginiz konumu belirleyin' },
  { step: '02', title: 'Tarih Belirle', description: 'Kiralama baslangic ve bitis tarihlerinizi secin' },
  { step: '03', title: 'Arac Sec', description: 'Size uygun arac sinifini ve modeli secin' },
  { step: '04', title: 'Yola Cik', description: 'Ödemenizi yapin ve aracınızı teslim alin' },
]

const popularLocations = [
  'Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa', 'Trabzon', 'Mugla', 'Adana',
]

export default function OtoKiralamaPage() {
  const [selectedCity, setSelectedCity] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Hero Section */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
              <Car className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">Oto Kiralama</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Güvenilir Araç <span className="text-gold">Kiralama</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Türkiye genelinde yüzlerce noktada uygun fiyatlı ve güvenilir araç kiralama hizmeti. İhtiyacınıza uygun aracı bulun, hemen rezervasyon yapın.
            </p>
          </div>
        </AnimatedSection>

        {/* Search Card */}
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Konum</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-sub pointer-events-none" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="input-dark pl-9 appearance-none cursor-pointer"
                  >
                    <option value="">Sehir Secin</option>
                    {popularLocations.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Alis Tarihi</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-sub pointer-events-none" />
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="input-dark pl-9"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Iade Tarihi</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-sub pointer-events-none" />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="input-dark pl-9"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Link
                  href={`/servis-ara?tip=car_rental${selectedCity ? `&konum=${encodeURIComponent(selectedCity)}` : ''}`}
                  className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Arac Bul
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Vehicle Categories */}
      <section className="section-container mb-16">
        <AnimatedSection delay={0.15}>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-3">
              Araç <span className="text-gold">Sınıfları</span>
            </h2>
            <p className="text-th-fg-sub text-sm max-w-xl mx-auto">
              İhtiyacınıza ve bütçenize uygun araç sınıfını seçin
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicleCategories.map((cat, index) => (
            <AnimatedSection key={cat.title} delay={0.2 + index * 0.08}>
              <motion.div
                className="glass-card p-6 h-full"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
                  <cat.icon className="w-6 h-6 text-brand-500" />
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-1">{cat.title}</h3>
                <p className="text-xs text-th-fg-sub mb-3">{cat.description}</p>
                <p className="text-xs text-th-fg-muted mb-2">{cat.example}</p>
                <span className="badge-gold text-[10px]">{cat.priceRange}</span>
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
            <p className="text-th-fg-sub text-sm max-w-xl mx-auto">
              Dört basit adımda aracınızı kiralayın
            </p>
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
            <p className="text-th-fg-sub text-sm max-w-xl mx-auto">
              Araç kiralama deneyiminizi farklı kılan özellikler
            </p>
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
              Hemen Araç <span className="text-gold">Kiralayın</span>
            </h3>
            <p className="text-th-fg-sub text-sm max-w-lg mx-auto mb-8">
              Türkiye genelindeki güvenilir kiralama noktalarından size en uygun aracı bulun ve yola çıkın.
            </p>
            <Link
              href="/servis-ara?tip=car_rental"
              className="btn-gold px-10 py-4 text-sm inline-flex items-center gap-2"
            >
              Kiralama Noktalarını Gör
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
