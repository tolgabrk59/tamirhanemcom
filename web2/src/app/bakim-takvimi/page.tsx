'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  ArrowRight,
  DollarSign,
  Shield,
  TrendingUp,
  CheckCircle,
  Flower2,
  Sun,
  Leaf,
  Snowflake,
  Bell,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

const maintenanceSchedule = [
  {
    km: '5,000',
    months: 6,
    services: ['Motor yağı değişimi', 'Yağ filtresi değişimi', 'Genel kontrol'],
    cost: '600-1,200',
    priority: 'high' as const,
  },
  {
    km: '10,000',
    months: 12,
    services: ['Motor yağı + filtre', 'Hava filtresi', 'Kabin filtresi', 'Fren kontrolü'],
    cost: '800-1,500',
    priority: 'high' as const,
  },
  {
    km: '20,000',
    months: 24,
    services: ['Motor yağı + filtre', 'Tüm filtreler', 'Buji kontrolü', 'Fren balata kontrolü'],
    cost: '1,200-2,000',
    priority: 'high' as const,
  },
  {
    km: '30,000',
    months: 36,
    services: ['Uzun bakım paketi', 'Şanzıman yağı', 'Fren hidroliği', 'Diferansiyel yağı'],
    cost: '2,000-3,500',
    priority: 'medium' as const,
  },
  {
    km: '60,000',
    months: 60,
    services: ['Triger kayışı', 'Su pompası', 'Tüm sıvılar', 'Kapsamlı kontrol'],
    cost: '3,500-6,000',
    priority: 'high' as const,
  },
]

const seasonalMaintenance = [
  {
    season: 'İlkbahar',
    icon: Flower2,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
    tasks: ['Klima kontrolü', 'Polen filtresi', 'Yağmur suyu kanalları', 'Lastik kontrolü'],
  },
  {
    season: 'Yaz',
    icon: Sun,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    tasks: ['Klima gazı', 'Motor soğutma', 'Akü kontrolü', 'Yaz lastikleri'],
  },
  {
    season: 'Sonbahar',
    icon: Leaf,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    tasks: ['Silecek kontrolü', 'Sis farları', 'Fren kontrolü', 'Antifiriz seviyesi'],
  },
  {
    season: 'Kış',
    icon: Snowflake,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    tasks: ['Kış lastikleri', 'Akü kapasitesi', 'Isıtma sistemi', 'Antifiriz yenileme'],
  },
]

const benefits = [
  { icon: DollarSign, title: 'Maliyet Tasarrufu', desc: 'Küçük sorunları erken tespit ederek büyük tamiratları önleyin.' },
  { icon: Shield, title: 'Güvenlik', desc: 'Fren, süspansiyon ve diğer kritik sistemleri güvende tutun.' },
  { icon: TrendingUp, title: 'Değer Korunumu', desc: 'Bakımlı araçlar daha yüksek ikinci el değerine sahiptir.' },
]

export default function BakimTakvimiPage() {
  const [currentKm, setCurrentKm] = useState('')
  const [yearlyKm, setYearlyKm] = useState('')
  const [lastService, setLastService] = useState('')

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-brand-500/50" />
              <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Bakım Rehberi</span>
              <div className="w-8 h-px bg-brand-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Bakım <span className="text-gold">Takvimi</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Aracınızın ömrünü uzatın. Kilometre ve yıl bazlı periyodik bakım planınızı oluşturun.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Vehicle Input */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-display font-bold text-th-fg mb-6">Aracınızın Bakım Planı</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Mevcut Kilometre</label>
                <input
                  type="number"
                  placeholder="Örn: 45000"
                  value={currentKm}
                  onChange={(e) => setCurrentKm(e.target.value)}
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Yıllık Ortalama KM</label>
                <input
                  type="number"
                  placeholder="Örn: 15000"
                  value={yearlyKm}
                  onChange={(e) => setYearlyKm(e.target.value)}
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Son Bakım Tarihi</label>
                <input
                  type="date"
                  value={lastService}
                  onChange={(e) => setLastService(e.target.value)}
                  className="input-dark"
                />
              </div>
              <div className="flex items-end">
                <button className="btn-gold w-full py-3.5 text-sm">
                  <Calendar className="w-4 h-4" />
                  Plan Oluştur
                </button>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/10">
              <p className="text-xs text-th-fg-sub">
                <span className="text-brand-500 font-semibold">İpucu:</span> Bakım planınızı PDF olarak indirebilir ve serviste kullanabilirsiniz.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Maintenance Schedule */}
      <section className="section-container mb-16">
        <AnimatedSection delay={0.12}>
          <h2 className="text-2xl font-display font-bold text-th-fg mb-8 text-center">
            Standart Bakım <span className="text-gold">Takvimi</span>
          </h2>
        </AnimatedSection>

        <div className="space-y-4">
          {maintenanceSchedule.map((item, idx) => (
            <AnimatedSection key={idx} delay={0.14 + idx * 0.04}>
              <div className="glass-card p-6 hover:shadow-glow-sm transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={cn(
                        'text-xs px-3 py-1 rounded-full font-bold border',
                        item.priority === 'high'
                          ? 'bg-red-500/15 text-red-400 border-red-500/20'
                          : 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'
                      )}>
                        {item.km} KM
                      </span>
                      <span className="text-th-fg-muted text-xs">veya {item.months} ay</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-display font-bold text-th-fg text-sm mb-2">Yapılacak İşlemler:</h3>
                        <ul className="space-y-1.5">
                          {item.services.map((service, sidx) => (
                            <li key={sidx} className="flex items-start gap-2 text-xs text-th-fg-sub">
                              <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-th-fg text-sm mb-2">Tahmini Maliyet:</h3>
                        <p className="text-2xl font-display font-extrabold text-gold">{item.cost} TL</p>
                        <p className="text-[10px] text-th-fg-muted mt-1">* Araç modeline göre değişebilir</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/servis-ara"
                    className="btn-gold px-6 py-3 text-xs shrink-0"
                  >
                    Fiyat Al
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Seasonal Maintenance */}
      <section className="section-container mb-16">
        <AnimatedSection delay={0.15}>
          <h2 className="text-2xl font-display font-bold text-th-fg mb-8 text-center">
            Mevsimsel Bakım <span className="text-gold">Kontrolleri</span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasonalMaintenance.map((season, idx) => (
            <AnimatedSection key={season.season} delay={0.17 + idx * 0.06}>
              <div className="glass-card p-6 text-center h-full">
                <div className={cn('w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-4', season.bg)}>
                  <season.icon className={cn('w-7 h-7', season.color)} />
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-3">{season.season}</h3>
                <ul className="space-y-2">
                  {season.tasks.map((task, tidx) => (
                    <li key={tidx} className="flex items-start gap-2 text-xs text-th-fg-sub text-left">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
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
      <section className="section-container mb-16">
        <AnimatedSection delay={0.2}>
          <h2 className="text-2xl font-display font-bold text-th-fg mb-8 text-center">
            Düzenli Bakımın <span className="text-gold">Faydaları</span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => (
            <AnimatedSection key={benefit.title} delay={0.22 + idx * 0.06}>
              <div className="glass-card p-6 text-center h-full">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-brand-500" />
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-2">{benefit.title}</h3>
                <p className="text-xs text-th-fg-sub leading-relaxed">{benefit.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Reminder CTA */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.25}>
          <div className="glass-card p-8 md:p-12 text-center">
            <Bell className="w-10 h-10 text-brand-500 mx-auto mb-4" />
            <h3 className="text-2xl font-display font-extrabold text-th-fg mb-3">
              Bakım hatırlatıcısı almak ister misiniz?
            </h3>
            <p className="text-th-fg-sub text-sm mb-6 max-w-lg mx-auto">
              Kilometre ve tarih bazlı hatırlatıcılar ile bakımlarınızı asla kaçırmayın.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="input-dark flex-1"
              />
              <button className="btn-gold px-8 py-3 text-sm shrink-0">
                Kayıt Ol
              </button>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.28}>
          <div className="glass-card p-8 text-center">
            <h3 className="text-xl font-display font-extrabold text-th-fg mb-3">
              Bakım zamanı geldi mi?
            </h3>
            <p className="text-th-fg-sub text-sm mb-6">
              En yakın servisi bulun ve bakım için randevu alın.
            </p>
            <Link href="/servis-ara" className="btn-gold px-8 py-3 text-sm inline-flex">
              Servisleri İncele
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
