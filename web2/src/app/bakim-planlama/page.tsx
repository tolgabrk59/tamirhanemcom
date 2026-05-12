'use client'

import { useState } from 'react'
import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import {
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  ChevronRight,
  AlertTriangle,
  Shield,
  TrendingUp,
  Wrench,
  Car,
  Snowflake,
  Sun,
  Leaf,
  CloudRain,
  Search,
  Bell,
  FileText,
} from 'lucide-react'

interface MaintenanceItem {
  km: string
  months: number
  services: string[]
  cost: string
  priority: 'high' | 'medium'
}

interface SeasonalItem {
  season: string
  icon: React.ElementType
  tasks: string[]
}

const maintenanceSchedule: MaintenanceItem[] = [
  {
    km: '5,000',
    months: 6,
    services: ['Motor yagi degisimi', 'Yag filtresi degisimi', 'Genel kontrol'],
    cost: '600-1,200',
    priority: 'high',
  },
  {
    km: '10,000',
    months: 12,
    services: ['Motor yagi + filtre', 'Hava filtresi', 'Kabin filtresi', 'Fren kontrolu'],
    cost: '800-1,500',
    priority: 'high',
  },
  {
    km: '20,000',
    months: 24,
    services: ['Motor yagi + filtre', 'Tum filtreler', 'Buji kontrolu', 'Fren balata kontrolu'],
    cost: '1,200-2,000',
    priority: 'high',
  },
  {
    km: '30,000',
    months: 36,
    services: ['Uzun bakim paketi', 'Sanziman yagi', 'Fren hidroligi', 'Diferansiyel yagi'],
    cost: '2,000-3,500',
    priority: 'medium',
  },
  {
    km: '60,000',
    months: 60,
    services: ['Triger kayisi', 'Su pompasi', 'Tum sivilar', 'Kapsamli kontrol'],
    cost: '3,500-6,000',
    priority: 'high',
  },
]

const seasonalMaintenance: SeasonalItem[] = [
  {
    season: 'Ilkbahar',
    icon: Leaf,
    tasks: ['Klima kontrolu', 'Polen filtresi', 'Yagmur suyu kanallari', 'Lastik kontrolu'],
  },
  {
    season: 'Yaz',
    icon: Sun,
    tasks: ['Klima gazi', 'Motor sogutma', 'Aku kontrolu', 'Yaz lastikleri'],
  },
  {
    season: 'Sonbahar',
    icon: CloudRain,
    tasks: ['Silecek kontrolu', 'Sis farlari', 'Fren kontrolu', 'Antifiriz seviyesi'],
  },
  {
    season: 'Kis',
    icon: Snowflake,
    tasks: ['Kis lastikleri', 'Aku kapasitesi', 'Isitma sistemi', 'Antifiriz yenileme'],
  },
]

const benefits = [
  {
    icon: DollarSign,
    title: 'Maliyet Tasarrufu',
    description: 'Kucuk sorunlari erken tespit ederek buyuk tamirlari onleyin',
  },
  {
    icon: Shield,
    title: 'Guvenlik',
    description: 'Fren, suspansiyon ve diger kritik sistemleri guvende tutun',
  },
  {
    icon: TrendingUp,
    title: 'Deger Korunumu',
    description: 'Bakimli araclar daha yuksek ikinci el degerine sahiptir',
  },
]

export default function BakimPlanlamaPage() {
  const [currentKm, setCurrentKm] = useState('')
  const [yearlyKm, setYearlyKm] = useState('')
  const [lastServiceDate, setLastServiceDate] = useState('')
  const [showPlan, setShowPlan] = useState(false)
  const [email, setEmail] = useState('')

  const handleCreatePlan = () => {
    if (currentKm) {
      setShowPlan(true)
    }
  }

  const getNextMaintenance = (): MaintenanceItem | null => {
    if (!currentKm) return null
    const km = parseInt(currentKm.replace(/\D/g, ''))
    return maintenanceSchedule.find((item) => {
      const itemKm = parseInt(item.km.replace(/\D/g, ''))
      return itemKm > km
    }) || maintenanceSchedule[maintenanceSchedule.length - 1]
  }

  const nextMaintenance = getNextMaintenance()

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-sm font-medium mb-4">
              <Calendar className="w-4 h-4" />
              Bakim Rehberi
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Bakim <span className="text-gold">Planlama</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-3xl mx-auto">
              Aracinizin omrunu uzatin. Kilometre ve yil bazli periyodik bakim
              planinizi olusturun ve yaklasan bakimlari takip edin.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Vehicle Input Section */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-display font-bold text-th-fg mb-6 flex items-center gap-2">
              <Car className="w-5 h-5 text-brand-500" />
              Aracinizin Bakim Plani
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm text-th-fg mb-2 font-medium">
                  Mevcut Kilometre *
                </label>
                <input
                  type="number"
                  value={currentKm}
                  onChange={(e) => setCurrentKm(e.target.value)}
                  placeholder="Orn: 45000"
                  className="input-dark"
                />
              </div>

              <div>
                <label className="block text-sm text-th-fg mb-2 font-medium">
                  Yillik Ortalama KM
                </label>
                <input
                  type="number"
                  value={yearlyKm}
                  onChange={(e) => setYearlyKm(e.target.value)}
                  placeholder="Orn: 15000"
                  className="input-dark"
                />
              </div>

              <div>
                <label className="block text-sm text-th-fg mb-2 font-medium">
                  Son Bakim Tarihi
                </label>
                <input
                  type="date"
                  value={lastServiceDate}
                  onChange={(e) => setLastServiceDate(e.target.value)}
                  className="input-dark cursor-pointer"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleCreatePlan}
                  disabled={!currentKm}
                  className="btn-gold w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="w-4 h-4" />
                  Plan Olustur
                </button>
              </div>
            </div>

            {/* Next Maintenance Hint */}
            {showPlan && nextMaintenance && (
              <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/15">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-th-fg font-medium">
                      Sonraki bakim: {nextMaintenance.km} KM veya{' '}
                      {nextMaintenance.months} ay
                    </p>
                    <p className="text-xs text-th-fg-sub mt-1">
                      Tahmini maliyet: {nextMaintenance.cost} TL
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </AnimatedSection>
      </section>

      {/* Maintenance Schedule */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.15}>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-3">
              Standart Bakim <span className="text-gold">Takvimi</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="space-y-4">
          {maintenanceSchedule.map((item, idx) => {
            const itemKm = parseInt(item.km.replace(/\D/g, ''))
            const currentKmNum = currentKm
              ? parseInt(currentKm.replace(/\D/g, ''))
              : 0
            const isPast = showPlan && currentKmNum >= itemKm
            const isNext =
              showPlan && nextMaintenance && item.km === nextMaintenance.km

            return (
              <AnimatedSection key={idx} delay={0.2 + idx * 0.05}>
                <div
                  className={cn(
                    'glass-card p-6 transition-all duration-300',
                    isNext && 'border-brand-500/30 shadow-glow-sm',
                    isPast && 'opacity-60'
                  )}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span
                          className={cn(
                            'px-4 py-2 rounded-xl font-display font-bold text-sm border',
                            item.priority === 'high'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          )}
                        >
                          {item.km} KM
                        </span>
                        <span className="text-th-fg-sub text-sm flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          veya {item.months} ay
                        </span>
                        {isNext && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 font-semibold">
                            Siradaki Bakim
                          </span>
                        )}
                        {isPast && !isNext && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-semibold">
                            Tamamlandi
                          </span>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-display font-bold text-th-fg mb-2">
                            Yapilacak Islemler:
                          </h3>
                          <ul className="space-y-1.5">
                            {item.services.map((service, sidx) => (
                              <li
                                key={sidx}
                                className="flex items-start gap-2 text-sm text-th-fg-sub"
                              >
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                {service}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-sm font-display font-bold text-th-fg mb-2">
                            Tahmini Maliyet:
                          </h3>
                          <p className="text-2xl font-display font-bold text-gold">
                            {item.cost} TL
                          </p>
                          <p className="text-xs text-th-fg-muted mt-1">
                            * Arac modeline gore degisebilir
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Link
                        href="/randevu"
                        className="btn-gold px-6 py-3 text-sm whitespace-nowrap"
                      >
                        Randevu Al
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </section>

      {/* Seasonal Maintenance */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.1}>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-3">
              Mevsimsel Bakim <span className="text-gold">Kontrolleri</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasonalMaintenance.map((season, idx) => (
            <AnimatedSection key={season.season} delay={0.15 + idx * 0.08}>
              <div className="glass-card p-6 text-center h-full hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
                  <season.icon className="w-7 h-7 text-brand-500" />
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-4">
                  {season.season}
                </h3>
                <ul className="space-y-2 text-left">
                  {season.tasks.map((task, tidx) => (
                    <li
                      key={tidx}
                      className="flex items-start gap-2 text-sm text-th-fg-sub"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.1}>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-3">
              Duzenli Bakimin <span className="text-gold">Faydalari</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => (
            <AnimatedSection key={benefit.title} delay={0.15 + idx * 0.08}>
              <div className="glass-card p-6 text-center h-full hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-brand-500" />
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-th-fg-sub">{benefit.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Reminder CTA */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.2}>
          <div className="glass-card p-8 md:p-12 text-center">
            <Bell className="w-10 h-10 text-brand-500 mx-auto mb-4" />
            <h3 className="text-2xl font-display font-extrabold text-th-fg mb-4">
              Bakim Hatirlaticisi
            </h3>
            <p className="text-th-fg-sub mb-6 max-w-lg mx-auto">
              Kilometre ve tarih bazli hatirlaticilar ile bakimlarinizi asla kacirmayin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                className="input-dark flex-1"
              />
              <button className="btn-gold px-8 py-3 text-sm whitespace-nowrap">
                Kayit Ol
              </button>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Final CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.25}>
          <div className="glass-card p-8 text-center">
            <h3 className="text-2xl font-display font-extrabold text-th-fg mb-4">
              Bakim zamani geldi mi?
            </h3>
            <p className="text-th-fg-sub mb-6 max-w-lg mx-auto">
              En yakin servisi bulun ve bakim icin randevu alin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/servis-ara"
                className="btn-gold px-8 py-3 text-sm inline-flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Servisleri Incele
              </Link>
              <Link
                href="/randevu"
                className="px-8 py-3 rounded-xl border border-brand-500/20 text-brand-500 font-semibold text-sm hover:bg-brand-500/10 transition-all inline-flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Randevu Al
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
