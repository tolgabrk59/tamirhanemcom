'use client'

import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Search,
  Wrench,
  Thermometer,
  Zap,
  Eye,
  ChevronRight,
  CheckCircle,
  DollarSign,
  Clock,
  MapPin,
  ArrowRight,
  Car,
  Gauge,
  Volume2,
  Droplets,
  Wind,
  KeyRound,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const commonSymptoms = [
  { name: 'Kalorifer Çalışmıyor', icon: Thermometer, color: 'text-red-400' },
  { name: 'Klima Çalışmıyor', icon: Wind, color: 'text-blue-400' },
  { name: 'Araç Yağ Sızdırıyor', icon: Droplets, color: 'text-yellow-400' },
  { name: 'Anahtar Dönmüyor', icon: KeyRound, color: 'text-purple-400' },
  { name: 'Motor Aşırı Isınıyor', icon: Thermometer, color: 'text-orange-400' },
  { name: 'Rölanti Düzensiz', icon: Gauge, color: 'text-green-400' },
]

const warningLights = [
  { name: 'Fren Uyarı Lambası', color: 'text-red-400' },
  { name: 'Soğutma Suyu Seviye Lambası', color: 'text-blue-400' },
  { name: 'Motor Sıcaklık Lambası', color: 'text-orange-400' },
  { name: 'ABS Lambası', color: 'text-yellow-400' },
  { name: 'Çekiş Kontrolü Lambası', color: 'text-green-400' },
  { name: 'Gaz Kelebeği Lambası', color: 'text-purple-400' },
]

const moreSymptoms = [
  'Egzoz Muayenesi Başarısız',
  'Araçtan Sıvı Sızıntısı',
  'Buğu Açıcı Çalışmıyor',
  'Frenlerim Ses Çıkarıyor',
  'Cam Suyu Çalışmıyor',
  'Fren Yaparken Araç Titriyor',
  'Akü Değişimi Sonrası Elektrik Sorunları',
  'Egzozdan Duman Çıkıyor',
  'Vakum Kaçağı Belirtileri',
  'Araç Titriyor',
  'Araçtan Garip Ses Geliyor',
  'Yakıt Kokusu Geliyor',
]

const troubleshootingParts = [
  'Alternatör',
  'Katalitik Konvertör',
  'Yakıt Pompası',
  'PCV Valfi',
  'Buji',
  'Marş Motoru',
  'Rot Başı',
  'Teker Rulmanı',
  'EGR Valfi',
  'Distribütör',
  'Gaz Kelebeği Sensörü',
  'Yakıt Basınç Regülatörü',
]

const sidebarLinks = {
  yolaGeriDon: [
    { label: 'Yakinimda oto tamir bul', href: '/servis-ara' },
    { label: 'Soru sor', href: '/soru-sor' },
    { label: 'Ucretsiz tamir tahminleri', href: '/fiyat-hesapla' },
    { label: 'Arac bakim tavsiyeleri', href: '/arac/bakim-tavsiyeleri' },
  ],
  aracArastir: [
    { label: 'Arac ansiklopedisi', href: '/arac' },
    { label: 'Kronik sorunlar', href: '/arac' },
    { label: 'OBD ariza kodlari', href: '/obd' },
  ],
}

export default function ArizaRehberiPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
              <AlertTriangle className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">Ariza Teshis</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Ariza Belirti <span className="text-gold">Rehberi</span>
            </h1>
            <p className="text-th-fg-sub text-lg mb-6">
              Aracinizdaki belirtilerden yola cikarak olasi sorunlari tespit edin.
              Erken teshis, buyuk tamiratlari onler ve cebinizi korur.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: '40+ Belirti', icon: CheckCircle },
                { label: 'Tahmini Maliyet', icon: DollarSign },
                { label: 'Aciliyet Seviyesi', icon: Clock },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-th-overlay/[0.05] border border-th-border/10 text-xs text-th-fg-sub"
                >
                  <badge.icon className="w-4 h-4 text-brand-500" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Main Content Grid */}
      <div className="section-container">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Intro */}
            <AnimatedSection delay={0.1}>
              <div>
                <h2 className="text-2xl font-display font-bold text-th-fg mb-4">
                  Aracinizin Sorununu <span className="text-gold">Teshis Edin</span>
                </h2>
                <div className="text-th-fg-sub text-sm leading-relaxed space-y-3">
                  <p>
                    Ister rahatsiz edici bir tikirti, benzin kokusu veya gosterge panelinizdeki bir uyari lambasi ile baslasin,
                    tanimlanamayan arac sorunu midenizi bulandirabilir.
                  </p>
                  <p>
                    TamirHanem, sizin icin kaputun altina bakmasi icin guvenilir bir tamirci bulmanizi kolaylastirir.
                    Ancak once aracinizi teshis etmek yararlidir cunku bir tamirin ne kadar acil oldugunu bileceksiniz.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Troubleshooting Quizzes */}
            <AnimatedSection delay={0.15}>
              <div>
                <h2 className="text-xl font-display font-bold text-th-fg mb-6">
                  Ariza Teshis <span className="text-gold">Testleri</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Link href="/ariza-bul" className="group">
                    <motion.div
                      className="glass-card p-6 h-full"
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-orange-400" />
                      </div>
                      <h3 className="text-base font-display font-bold text-th-fg mb-2 group-hover:text-brand-500 transition-colors">
                        Motor Kontrol Lambasi Yaniyor
                      </h3>
                      <p className="text-xs text-th-fg-sub">
                        Aracinizin check engine lambasinin ne isaret ediyor olabilecegini ogrenin.
                      </p>
                    </motion.div>
                  </Link>
                  <Link href="/ariza-bul" className="group">
                    <motion.div
                      className="glass-card p-6 h-full"
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                        <KeyRound className="w-6 h-6 text-red-400" />
                      </div>
                      <h3 className="text-base font-display font-bold text-th-fg mb-2 group-hover:text-brand-500 transition-colors">
                        Arac Calismiyor
                      </h3>
                      <p className="text-xs text-th-fg-sub">
                        Birkac kisa soruyu yanitlayarak calismayan aracin nedenini daraltin.
                      </p>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* Common Symptoms */}
            <AnimatedSection delay={0.2}>
              <div>
                <h2 className="text-xl font-display font-bold text-th-fg mb-3">
                  Yaygin <span className="text-gold">Belirtiler</span>
                </h2>
                <p className="text-th-fg-sub text-sm mb-6">
                  Aracinizin sagligini takip etmek icin teknisyen olmaniza gerek yok -
                  sadece olagandisi degisiklikler konusunda dikkatli olmaniz gerekir.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {commonSymptoms.map((symptom, idx) => (
                    <Link key={idx} href="/ariza-bul" className="group">
                      <motion.div
                        className="glass-card p-5 text-center h-full"
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={cn('w-10 h-10 rounded-xl bg-th-overlay/[0.05] flex items-center justify-center mx-auto mb-3', symptom.color)}>
                          <symptom.icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-display font-bold text-th-fg group-hover:text-brand-500 transition-colors">
                          {symptom.name}
                        </h3>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* More Symptoms List */}
            <AnimatedSection delay={0.25}>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {moreSymptoms.map((item, idx) => (
                    <Link
                      key={idx}
                      href="/ariza-bul"
                      className="text-sm text-th-fg-sub hover:text-brand-500 transition-colors py-2 border-b border-th-border/10 flex items-center justify-between group"
                    >
                      <span>{item}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Warning Lights */}
            <AnimatedSection delay={0.3}>
              <div>
                <h2 className="text-xl font-display font-bold text-th-fg mb-3">
                  Arac Uyari <span className="text-gold">Lambalari</span>
                </h2>
                <p className="text-th-fg-sub text-sm mb-6">
                  Gosterge paneli uyari lambalari, aracinizin ic sistemlerinin sorun buyumeden once
                  potansiyel bir sorunu isaret etmesinin bir yoludur.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {warningLights.map((light, idx) => (
                    <Link key={idx} href="/ariza-bul" className="group">
                      <motion.div
                        className="glass-card p-4 text-center"
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={cn('w-10 h-10 rounded-full bg-th-overlay/[0.08] flex items-center justify-center mx-auto mb-3', light.color)}>
                          <Eye className="w-5 h-5" />
                        </div>
                        <h3 className="text-[11px] font-display font-bold text-th-fg group-hover:text-brand-500 transition-colors">
                          {light.name}
                        </h3>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                <div className="mt-4 text-right">
                  <Link
                    href="/ariza-bul"
                    className="text-xs text-brand-500 hover:text-brand-400 font-semibold inline-flex items-center gap-1 transition-colors"
                  >
                    Tum uyari lambalarini gorun
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* Auto Parts Troubleshooting */}
            <AnimatedSection delay={0.35}>
              <div>
                <h2 className="text-xl font-display font-bold text-th-fg mb-6">
                  Arizali Oto Parcalari <span className="text-gold">Sorun Giderme</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {troubleshootingParts.map((part, idx) => (
                    <Link
                      key={idx}
                      href="/arac/yedek-parca"
                      className="text-sm text-th-fg-sub hover:text-brand-500 transition-colors py-2 border-b border-th-border/10 flex items-center justify-between group"
                    >
                      <span>{part}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
                <div className="mt-4">
                  <Link
                    href="/arac/yedek-parca"
                    className="text-xs text-brand-500 hover:text-brand-400 font-semibold inline-flex items-center gap-1 transition-colors"
                  >
                    Daha fazla oto parca belirtisi gorun
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Find a Shop Card */}
            <AnimatedSection delay={0.15}>
              <div className="glass-card p-6 border-brand-500/20">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-brand-500" />
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-2">
                  Onayli Servis Bul
                </h3>
                <p className="text-xs text-th-fg-sub mb-4">
                  Yakininizda yuksek kaliteli bir oto tamir servisi bulun
                </p>
                <Link href="/servis-ara" className="btn-gold w-full py-3 text-sm">
                  <Search className="w-4 h-4" />
                  Servis Ara
                </Link>
              </div>
            </AnimatedSection>

            {/* Quick Links */}
            <AnimatedSection delay={0.2}>
              <div className="glass-card p-6">
                <h3 className="font-display font-bold text-th-fg mb-4">Yola Geri Don</h3>
                <ul className="space-y-2.5">
                  {sidebarLinks.yolaGeriDon.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-th-fg-sub hover:text-brand-500 transition-colors flex items-center gap-1.5"
                      >
                        <ChevronRight className="w-3 h-3 text-brand-500/50" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="section-divider my-4" />

                <h3 className="font-display font-bold text-th-fg mb-4">Bir Arac Arastir</h3>
                <ul className="space-y-2.5">
                  {sidebarLinks.aracArastir.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        href={link.href}
                        className="text-sm text-th-fg-sub hover:text-brand-500 transition-colors flex items-center gap-1.5"
                      >
                        <ChevronRight className="w-3 h-3 text-brand-500/50" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="section-divider my-4" />

                <h3 className="font-display font-bold text-th-fg mb-4">Daha Fazlasi</h3>
                <ul className="space-y-2.5">
                  <li>
                    <Link
                      href="/obd"
                      className="text-sm text-th-fg-sub hover:text-brand-500 transition-colors flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3 h-3 text-brand-500/50" />
                      Teshis OBD-II kodlari
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ariza-bul"
                      className="text-sm text-th-fg-sub hover:text-brand-500 transition-colors flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3 h-3 text-brand-500/50" />
                      Ariza bul
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  )
}
