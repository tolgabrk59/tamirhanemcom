'use client'

import { Search, CalendarCheck, Sparkles } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import Button from '@/components/ui/Button'

export default function CTA() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 bg-hero-gradient opacity-40"
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        <AnimatedSection>
          <div className="relative">
            {/* Decorative glow behind card */}
            <div className="absolute inset-0 -z-10" aria-hidden="true">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-brand-500/[0.06] blur-[100px]" />
            </div>

            <div className="glass-card p-10 md:p-16 text-center relative overflow-hidden">
              {/* Gold gradient accent line at top */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gold-gradient" aria-hidden="true" />

              {/* Sparkle */}
              <Sparkles className="w-10 h-10 text-brand-500 mx-auto mb-6" />

              {/* Content */}
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
                Aracına En İyi{' '}
                <span className="text-gold">Bakımı Sağla</span>
              </h2>

              <p className="text-th-fg text-lg max-w-lg mx-auto mb-10">
                Hemen ücretsiz üye ol, yakınındaki en iyi servisleri keşfet
                ve aracının kontrolünü eline al.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  href="/servis-ara"
                  icon={<Search className="w-5 h-5" />}
                >
                  Servis Ara
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  href="/randevu"
                  icon={<CalendarCheck className="w-5 h-5" />}
                >
                  Randevu Al
                </Button>
              </div>

              {/* Trust note */}
              <p className="mt-6 text-xs text-th-fg-muted">
                Ücretsiz kayıt &middot; Kredi kartı gerektirmez &middot; Anında kullanmaya başla
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
