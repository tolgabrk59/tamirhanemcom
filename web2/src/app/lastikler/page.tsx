'use client'

import Link from 'next/link'
import { Sun, Snowflake, CloudSun, AlertTriangle, Gauge, RefreshCw, Eye, CircleAlert, CheckCircle, ArrowRight } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

const tireTypes = [
  {
    id: 'summer',
    title: 'Yaz Lastikleri',
    description: 'Sıcak havalarda optimum performans',
    temp: '+7 C üzeri',
    icon: Sun,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/20',
    features: ['Düsük yuvarlanma direnci', 'Yüksek kavrama', 'Uzun ömür'],
  },
  {
    id: 'winter',
    title: 'Kış Lastikleri',
    description: 'Soğuk ve karlı koşullarda güvenlik',
    temp: '+7 C altı',
    icon: Snowflake,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    features: ['Kar ve buzda kavrama', 'Esnek lastik karışımı', 'M+S işareti'],
  },
  {
    id: 'all-season',
    title: '4 Mevsim Lastikleri',
    description: 'Yıl boyu kullanım için pratik',
    temp: 'Her koşul',
    icon: CloudSun,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10 border-green-500/20',
    features: ['Tüm mevsimlerde kullanım', 'Tasarruf sağlar', 'Orta performans'],
  },
]

const maintenanceTips = [
  { icon: Gauge, title: 'Hava Basıncı', desc: 'Ayda bir kez kontrol edin. Doğru basınç yakıt tasarrufu sağlar.' },
  { icon: RefreshCw, title: 'Rotasyon', desc: 'Her 10.000 km\'de bir lastik rotasyonu yapın.' },
  { icon: Eye, title: 'Diş Derinliği', desc: 'Minimum 1.6mm olmalı. Güvenlik için düzenli kontrol edin.' },
  { icon: CircleAlert, title: 'Hasar Kontrolü', desc: 'Çatlak, kabarcık veya kesik olup olmadığını kontrol edin.' },
]

const replaceReasons = [
  { title: 'Diş Derinliği 1.6mm\'nin Altında', desc: 'Yasal minimum değerin altına düştüğünde hemen değiştirin.' },
  { title: 'Yaş 6 Yıldan Fazla', desc: 'Üretim tarihinden 6 yıl geçmişse, diş derinliği yeterli olsa bile değiştirmeyi düşünün.' },
  { title: 'Görünür Hasar', desc: 'Yan yüzeyde çatlak, kabarcık veya büyük kesikler varsa acilen değiştirin.' },
  { title: 'Düzensiz Aşınma', desc: 'Tek taraflı veya yamuk aşınma gözlemleniyorsa rotbalans ve lastik değişimi gerekebilir.' },
]

export default function LastiklerPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-brand-500/50" />
              <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Lastik Rehberi</span>
              <div className="w-8 h-px bg-brand-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Lastik <span className="text-gold">Rehberi</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Aracınız için doğru lastiği seçin. Mevsimsel öneriler, bakım ipuçları ve güvenlik bilgileri.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Tire Types */}
      <section className="section-container mb-16">
        <AnimatedSection delay={0.05}>
          <h2 className="text-2xl font-display font-bold text-th-fg mb-8 text-center">
            Lastik <span className="text-gold">Tipleri</span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {tireTypes.map((tire, index) => (
            <AnimatedSection key={tire.id} delay={0.1 + index * 0.08}>
              <div className="glass-card p-6 h-full hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300">
                <div className={cn('w-14 h-14 rounded-xl border flex items-center justify-center mb-4', tire.bgColor)}>
                  <tire.icon className={cn('w-7 h-7', tire.color)} />
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-2">{tire.title}</h3>
                <p className="text-th-fg-sub text-sm mb-3">{tire.description}</p>
                <div className="p-3 rounded-lg bg-th-overlay/[0.03] border border-th-border/5 mb-4">
                  <p className="text-xs text-th-fg-sub">
                    Kullanım Sıcaklığı: <span className="text-brand-500 font-semibold">{tire.temp}</span>
                  </p>
                </div>
                <ul className="space-y-2">
                  {tire.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-th-fg-sub">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Maintenance Tips */}
      <section className="section-container mb-16">
        <AnimatedSection delay={0.1}>
          <h2 className="text-2xl font-display font-bold text-th-fg mb-8 text-center">
            Bakım <span className="text-gold">İpuçları</span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {maintenanceTips.map((tip, index) => (
            <AnimatedSection key={tip.title} delay={0.12 + index * 0.06}>
              <div className="glass-card p-6 text-center h-full">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
                  <tip.icon className="w-6 h-6 text-brand-500" />
                </div>
                <h3 className="font-display font-bold text-th-fg mb-2">{tip.title}</h3>
                <p className="text-xs text-th-fg-sub leading-relaxed">{tip.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* When to Replace */}
      <section className="section-container mb-16">
        <AnimatedSection delay={0.15}>
          <h2 className="text-2xl font-display font-bold text-th-fg mb-8 text-center">
            Ne Zaman <span className="text-gold">Değiştirmeli?</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="glass-card p-6 md:p-8">
            <div className="space-y-4">
              {replaceReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-500/15 border border-red-500/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-th-fg text-sm mb-1">{reason.title}</h3>
                    <p className="text-th-fg-sub text-xs leading-relaxed">{reason.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.25}>
          <div className="glass-card p-8 md:p-12 text-center">
            <h3 className="text-2xl font-display font-extrabold text-th-fg mb-3">
              Lastik değişimi için teklif alın
            </h3>
            <p className="text-th-fg-sub text-sm mb-6 max-w-lg mx-auto">
              Yakınınızdaki servisleri bulun ve lastik fiyatlarını karşılaştırın.
            </p>
            <Link href="/servis-ara" className="btn-gold px-8 py-3 text-sm inline-flex">
              Fiyat Teklifi Al
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
