'use client'

import {
  User, Building2, ShieldCheck, BarChart3,
  FileText, PhoneCall, CreditCard, CalendarCheck,
  Receipt, Rocket,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

interface BenefitItem {
  icon: LucideIcon
  title: string
  desc: string
}

const OWNER_BENEFITS: BenefitItem[] = [
  { icon: CreditCard, title: 'Güvenli Ödeme Sistemi', desc: 'Paranız işlem tamamlanana kadar güvende' },
  { icon: BarChart3, title: 'Fiyat Karşılaştırma', desc: 'Birden fazla servisten teklif alın' },
  { icon: FileText, title: 'Dijital Bakım Karnesi', desc: 'Tüm servis geçmişiniz kayıt altında' },
  { icon: PhoneCall, title: '7/24 Yol Yardım', desc: 'Acil durumlarda anında destek' },
]

const SERVICE_BENEFITS: BenefitItem[] = [
  { icon: Rocket, title: 'Yeni Müşteriler', desc: 'Binlerce araç sahibine ulaşın' },
  { icon: CalendarCheck, title: 'Dijital Randevu Sistemi', desc: 'Online randevu yönetimi' },
  { icon: Receipt, title: 'Hızlı Tahsilat', desc: 'Güvenli ödeme altyapısı' },
  { icon: ShieldCheck, title: 'Ücretsiz Kayıt', desc: 'Başlangıç ücreti yok' },
]

function BenefitColumn({
  icon: HeaderIcon,
  title,
  benefits,
  ctaLabel,
  ctaHref,
  ctaVariant,
}: {
  icon: LucideIcon
  title: string
  benefits: BenefitItem[]
  ctaLabel: string
  ctaHref: string
  ctaVariant: 'primary' | 'secondary'
}) {
  return (
    <div className="glass-card p-6 md:p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
          <HeaderIcon className="w-6 h-6 text-th-bg" />
        </div>
        <h3 className="font-display text-xl md:text-2xl font-bold text-th-fg">{title}</h3>
      </div>

      {/* Items */}
      <div className="space-y-4 flex-1">
        {benefits.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-brand-500" />
              </div>
              <div>
                <p className="font-semibold text-th-fg">{item.title}</p>
                <p className="text-sm text-th-fg-sub">{item.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="mt-6 pt-6 border-t border-th-border/[0.06]">
        <a
          href={ctaHref}
          className={cn(
            'block w-full text-center py-3.5 rounded-xl font-bold text-sm transition-all duration-300',
            ctaVariant === 'primary'
              ? 'bg-brand-500 text-th-bg hover:bg-brand-400 hover:shadow-glow-sm'
              : 'bg-th-fg/10 text-th-fg hover:bg-th-fg/20'
          )}
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  )
}

export default function Benefits() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="section-container">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/20 mb-6">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span className="text-brand-500 text-sm font-semibold">TamirHanem Onaylı</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4">
            Herkes İçin <span className="text-gold">Avantajlı</span>
          </h2>
          <p className="text-th-fg text-lg max-w-2xl mx-auto">
            TamirHanem, hem araç sahiplerine hem de servis işletmelerine değer katıyor.
            Platformumuza katılın, avantajlardan yararlanın.
          </p>
        </AnimatedSection>

        {/* Two Column Benefits */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <AnimatedSection delay={0.1}>
            <BenefitColumn
              icon={User}
              title="Araç Sahipleri"
              benefits={OWNER_BENEFITS}
              ctaLabel="Ücretsiz Kayıt Ol"
              ctaHref="https://tamirhanem.net/register.html"
              ctaVariant="primary"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <BenefitColumn
              icon={Building2}
              title="Servis İşletmeleri"
              benefits={SERVICE_BENEFITS}
              ctaLabel="İşletme Başvurusu"
              ctaHref="https://tamirhanem.net/register.html"
              ctaVariant="secondary"
            />
          </AnimatedSection>
        </div>

        {/* Bottom CTA */}
        <AnimatedSection delay={0.3} className="mt-10">
          <div className="glass-card p-8 md:p-10 text-center bg-gradient-to-r from-brand-500/5 to-brand-500/10">
            <h3 className="font-display text-2xl font-bold text-th-fg mb-3">
              TamirHanem Ailesine Katılın
            </h3>
            <p className="text-th-fg-sub max-w-2xl mx-auto mb-6">
              İster araç sahibi olun ister servis işletmesi, TamirHanem ile otomotiv dünyasını daha kolay ve güvenilir hale getiriyoruz.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://tamirhanem.net/register.html"
                className="inline-flex items-center gap-2 bg-brand-500 text-th-bg px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:bg-brand-400 hover:shadow-glow-sm"
              >
                <User className="w-5 h-5" />
                Araç Sahibi Olarak Başla
              </a>
              <a
                href="https://tamirhanem.net/register.html"
                className="inline-flex items-center gap-2 bg-th-fg/10 text-th-fg px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:bg-th-fg/20"
              >
                <Building2 className="w-5 h-5" />
                Servis Olarak Katıl
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <div className="section-divider mt-24" />
    </section>
  )
}
