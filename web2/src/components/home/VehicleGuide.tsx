'use client'

import Link from 'next/link'
import {
  AlertTriangle, ClipboardList, Circle, ShieldCheck,
  Lightbulb, CalendarDays,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

interface GuideCard {
  href: string
  icon: LucideIcon
  title: string
  description: string
}

const GUIDE_CARDS: GuideCard[] = [
  {
    href: '/geri-cagrima',
    icon: AlertTriangle,
    title: 'Geri Çağırmalar',
    description: 'Aracınızın geri çağırma durumunu kontrol edin',
  },
  {
    href: '/#yaygin-problemler',
    icon: ClipboardList,
    title: 'Yaygın Problemler',
    description: 'Araç modelinize özel sorunları keşfedin',
  },
  {
    href: '/lastikler',
    icon: Circle,
    title: 'Lastikler',
    description: 'Lastik seçimi ve bakım rehberi',
  },
  {
    href: '/guvenilirlik',
    icon: ShieldCheck,
    title: 'Güvenilirlik',
    description: 'Araç modellerinin güvenilirlik puanları',
  },
  {
    href: '/belirtiler',
    icon: Lightbulb,
    title: 'Belirti Rehberi',
    description: 'Araç sorunlarını belirtilerden tanıyın',
  },
  {
    href: '/bakim-takvimi',
    icon: CalendarDays,
    title: 'Bakım Takvimi',
    description: 'Periyodik bakım zamanlarını takip edin',
  },
]

export default function VehicleGuide() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="section-container">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-brand-500/50" />
            <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">
              Araç Rehberi
            </span>
            <div className="w-8 h-px bg-brand-500/50" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4">
            Tüm araç ihtiyaçlarınız için <span className="text-gold">tek yer</span>
          </h2>
          <p className="text-th-fg text-lg max-w-xl mx-auto">
            Aracınızı bakımda tutma, sorunları giderme ve daha fazlası için yardım alın
          </p>
        </AnimatedSection>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {GUIDE_CARDS.map((card, idx) => {
            const Icon = card.icon
            return (
              <AnimatedSection key={card.href} delay={idx * 0.08} className="group">
                <Link
                  href={card.href}
                  className={cn(
                    'glass-card p-6 md:p-8 flex items-start gap-4 h-full',
                    'transition-all duration-300',
                    'hover:-translate-y-1 hover:shadow-glow-sm'
                  )}
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-base md:text-lg mb-1 text-th-fg group-hover:text-brand-500 transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-th-fg-sub text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </Link>
              </AnimatedSection>
            )
          })}
        </div>
      </div>

      <div className="section-divider mt-24" />
    </section>
  )
}
