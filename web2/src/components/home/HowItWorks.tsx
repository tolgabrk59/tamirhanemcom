'use client'

import { Search, CalendarCheck, CheckCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

interface Step {
  number: string
  title: string
  description: string
  icon: LucideIcon
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Servis Ara',
    description:
      'Konumuna yakın en iyi servisleri bul. Yorumları ve puanları karşılaştır, sana en uygun servisi seç.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Randevu Al',
    description:
      'Uygun saati seç, hemen randevunu oluştur. Servis seni onaylayınca bildirim alacaksın.',
    icon: CalendarCheck,
  },
  {
    number: '03',
    title: 'Teslim Al',
    description:
      'Aracını teslim al, puanla ve değerlendirmeni yap. Başkalarına yardımcı ol.',
    icon: CheckCircle,
  },
]

export default function HowItWorks() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-50" aria-hidden="true" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-brand-500/50" />
            <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">
              Adımlar
            </span>
            <div className="w-8 h-px bg-brand-500/50" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4">
            Nasıl <span className="text-gold">Çalışır?</span>
          </h2>
          <p className="text-th-fg text-lg max-w-xl mx-auto">
            Üç basit adımda aracının bakımını gerçekleştir
          </p>
        </AnimatedSection>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {/* Connecting line - desktop only */}
          <div className="hidden md:block absolute top-1/2 left-[16.67%] right-[16.67%] -translate-y-1/2 h-px z-0" aria-hidden="true">
            <div className="w-full h-full bg-gradient-to-r from-brand-500/30 via-brand-500/50 to-brand-500/30" />
            {/* Dots on the line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-500/60" />
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-500/60" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-500/60" />
          </div>

          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <AnimatedSection
                key={step.number}
                delay={idx * 0.15}
                className="relative z-10"
              >
                <div
                  className={cn(
                    'glass-card p-8 md:p-10 text-center relative overflow-hidden group',
                    'hover:-translate-y-1 transition-all duration-300'
                  )}
                >
                  {/* Large step number behind */}
                  <div
                    className="absolute -top-4 -right-2 font-display text-[8rem] font-extrabold text-brand-500/[0.04] leading-none select-none pointer-events-none group-hover:text-brand-500/[0.08] transition-colors duration-500"
                    aria-hidden="true"
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/15 flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-500/20 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-brand-500" />
                  </div>

                  {/* Step number label */}
                  <div className="text-brand-500/60 text-sm font-semibold mb-2 font-display">
                    Adım {step.number}
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-xl md:text-2xl mb-3 text-th-fg">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-th-fg-sub text-sm md:text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>

      {/* Section divider */}
      <div className="section-divider mt-24" />
    </section>
  )
}
