'use client'

import Link from 'next/link'
import {
  ArrowRight, CheckCircle2, HelpCircle, AlertCircle,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

const INFO_ITEMS = [
  {
    icon: CheckCircle2,
    title: 'OBD-II Nedir?',
    desc: "1996'dan itibaren tüm araçlarda bulunan standart teşhis sistemidir.",
  },
  {
    icon: HelpCircle,
    title: 'Kodlar Nasıl Okunur?',
    desc: 'OBD tarayıcı cihazı veya oto servislerdeki teşhis cihazları ile okunur.',
  },
  {
    icon: AlertCircle,
    title: 'Ne Zaman Servise Gitmeliyim?',
    desc: 'Check Engine lambası yanıp sönüyorsa acil, sabit yanıyorsa yakın zamanda gidin.',
  },
]

const OBD_EXAMPLES = [
  { code: 'P0300', desc: 'Rastgele Ateşleme Hatası', severity: 'Yüksek', color: 'amber' },
  { code: 'P0420', desc: 'Katalitik Konvertör Verimliliği', severity: 'Orta', color: 'yellow' },
  { code: 'P0171', desc: 'Sistem Çok Fakir (Bank 1)', severity: 'Yüksek', color: 'amber' },
  { code: 'P0455', desc: 'EVAP Büyük Kaçak', severity: 'Düşük', color: 'green' },
]

const severityColors: Record<string, string> = {
  amber: 'bg-amber-500/15 text-amber-400',
  yellow: 'bg-yellow-500/15 text-yellow-400',
  green: 'bg-emerald-500/15 text-emerald-400',
}

export default function ObdInfo() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Content */}
          <AnimatedSection direction="right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/20 mb-6">
              <span className="text-brand-500 text-sm font-semibold">OBD-II Arıza Kodları</span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-4 text-th-fg">
              Aracınızdaki Arıza Kodlarını <span className="text-gold">Anlayın</span>
            </h2>

            <p className="text-th-fg-sub text-base leading-relaxed mb-8">
              OBD-II (On-Board Diagnostics) sistemi, aracınızın motor ve emisyon sistemlerini
              sürekli izler. Check Engine lambası yandığında, sistem bir arıza kodu kaydeder.
              Bu kodları anlayarak sorunun ne olduğunu ve ne kadar acil olduğunu öğrenebilirsiniz.
            </p>

            <div className="space-y-5 mb-8">
              {INFO_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-brand-500" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-th-fg mb-1">{item.title}</h4>
                      <p className="text-sm text-th-fg-sub">{item.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Link
              href="/obd"
              className={cn(
                'inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300',
                'bg-brand-500 text-th-bg',
                'hover:bg-brand-400 hover:shadow-glow-sm'
              )}
            >
              Tüm OBD Kodlarını İncele
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>

          {/* Right - OBD Examples */}
          <AnimatedSection delay={0.2} direction="left">
            <div className="glass-card p-6 md:p-8">
              <h3 className="font-display font-bold text-th-fg mb-6">Örnek OBD Kodları</h3>

              <div className="space-y-3">
                {OBD_EXAMPLES.map((item) => (
                  <Link
                    key={item.code}
                    href={`/obd/${item.code.toLowerCase()}`}
                    className={cn(
                      'block rounded-xl p-4 transition-all duration-300',
                      'bg-th-bg/50 hover:bg-brand-500/5 hover:shadow-glow-sm',
                      'border border-th-border/[0.06] hover:border-brand-500/20'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-brand-500">{item.code}</span>
                        <p className="text-sm text-th-fg-sub mt-0.5">{item.desc}</p>
                      </div>
                      <span className={cn('text-xs px-2.5 py-1 rounded-lg font-medium', severityColors[item.color])}>
                        {item.severity}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-th-border/[0.06] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-th-fg-muted" />
                <p className="text-sm text-th-fg-muted">
                  500+ OBD kodu açıklaması veritabanımızda mevcut
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <div className="section-divider mt-24" />
    </section>
  )
}
