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
    { label: 'Yakınımda oto tamir bul', href: '/servis-ara' },
    { label: 'Soru sor', href: '/soru-sor' },
    { label: 'Ücretsiz tamir tahminleri', href: '/fiyat-hesapla' },
    { label: 'Araç bakım tavsiyeleri', href: '/arac/bakim-tavsiyeleri' },
  ],
  aracArastir: [
    { label: 'Araç ansiklopedisi', href: '/arac' },
    { label: 'Kronik sorunlar', href: '/arac' },
    { label: 'OBD arıza kodları', href: '/obd' },
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
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
              <AlertTriangle className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">Arıza Teşhis</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Arıza Belirti <span className="text-gold">Rehberi</span>
            </h1>
            <p className="text-th-fg-sub text-lg mb-6">
              Aracınızdaki belirtilerden yola çıkarak olası sorunları tespit edin.
              Erken teşhis, büyük tamiratları önler ve cebinizi korur.
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
                  Aracınızın Sorununu <span className="text-gold">Teşhis Edin</span>
                </h2>
                <div className="text-th-fg-sub text-sm leading-relaxed space-y-3">
                  <p>
                    İster rahatsız edici bir tıkırtı, benzin kokusu veya gösterge panelinizdeki bir uyarı lambası ile başlasın,
                    tanımlanamayan araç sorunu midenizi bulandırabilir.
                  </p>
                  <p>
                    TamirHanem, sizin için kaputun altına bakması için güvenilir bir tamirci bulmanızı kolaylaştırır.
                    Ancak önce aracınızı teşhis etmek yararlıdır çünkü bir tamirin ne kadar acil olduğunu bileceksiniz.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Troubleshooting Quizzes */}
            <AnimatedSection delay={0.15}>
              <div>
                <h2 className="text-xl font-display font-bold text-th-fg mb-6">
                  Arıza Teşhis <span className="text-gold">Testleri</span>
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
                        Motor Kontrol Lambası Yanıyor
                      </h3>
                      <p className="text-xs text-th-fg-sub">
                        Aracınızın check engine lambasının ne işaret ediyor olabileceğini öğrenin.
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
                        Araç Çalışmıyor
                      </h3>
                      <p className="text-xs text-th-fg-sub">
                        Birkaç kısa soruyu yanıtlayarak çalışmayan aracın nedenini daraltın.
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
                  Yaygın <span className="text-gold">Belirtiler</span>
                </h2>
                <p className="text-th-fg-sub text-sm mb-6">
                  Aracınızın sağlığını takip etmek için teknisyen olmanıza gerek yok -
                  sadece olağandışı değişiklikler konusunda dikkatli olmanız gerekir.
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
                  Araç Uyarı <span className="text-gold">Lambaları</span>
                </h2>
                <p className="text-th-fg-sub text-sm mb-6">
                  Gösterge paneli uyarı lambaları, aracınızın iç sistemlerinin sorun büyümeden önce
                  potansiyel bir sorunu işaret etmesinin bir yoludur.
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
                    Tüm uyarı lambalarını görün
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* Auto Parts Troubleshooting */}
            <AnimatedSection delay={0.35}>
              <div>
                <h2 className="text-xl font-display font-bold text-th-fg mb-6">
                  Arızalı Oto Parçaları <span className="text-gold">Sorun Giderme</span>
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
                    Daha fazla oto parça belirtisi görün
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
                  Onaylı Servis Bul
                </h3>
                <p className="text-xs text-th-fg-sub mb-4">
                  Yakınınızda yüksek kaliteli bir oto tamir servisi bulun
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
                <h3 className="font-display font-bold text-th-fg mb-4">Yola Geri Dön</h3>
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

                <h3 className="font-display font-bold text-th-fg mb-4">Bir Araç Araştır</h3>
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

                <h3 className="font-display font-bold text-th-fg mb-4">Daha Fazlası</h3>
                <ul className="space-y-2.5">
                  <li>
                    <Link
                      href="/obd"
                      className="text-sm text-th-fg-sub hover:text-brand-500 transition-colors flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3 h-3 text-brand-500/50" />
                      Teşhis OBD-II kodları
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ariza-bul"
                      className="text-sm text-th-fg-sub hover:text-brand-500 transition-colors flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3 h-3 text-brand-500/50" />
                      Arıza bul
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
