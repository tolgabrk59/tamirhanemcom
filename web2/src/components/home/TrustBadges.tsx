'use client'

import { ShieldCheck, Lock, ClipboardCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'

interface Badge {
  icon: LucideIcon
  title: string
  subtitle: string
}

const BADGES: Badge[] = [
  {
    icon: ShieldCheck,
    title: 'KVKK Uyumlu',
    subtitle: 'Verileriniz güvende',
  },
  {
    icon: Lock,
    title: 'Güvenli Ödeme',
    subtitle: '256-bit SSL şifreleme',
  },
  {
    icon: ClipboardCheck,
    title: 'Şeffaf Takip',
    subtitle: 'Her adımda bilgilendirilirsiniz',
  },
]

export default function TrustBadges() {
  return (
    <section className="relative py-12 md:py-16">
      <div className="section-container">
        <AnimatedSection>
          <div className="glass-card p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {BADGES.map((badge) => {
                const Icon = badge.icon
                return (
                  <div key={badge.title} className="flex items-center gap-4 justify-center">
                    <div className="w-14 h-14 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-th-bg" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-th-fg">{badge.title}</h4>
                      <p className="text-sm text-th-fg-muted">{badge.subtitle}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
