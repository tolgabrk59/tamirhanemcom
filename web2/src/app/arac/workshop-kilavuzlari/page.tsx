'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  FileText,
  Zap,
  Cog,
  Loader2,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  Info,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

const infoCards = [
  {
    icon: FileText,
    title: 'Teknik Dokumanlar',
    description: 'Araciniza ozel teknik semalar ve detayli bilgiler',
    color: 'text-brand-500',
  },
  {
    icon: Zap,
    title: 'Elektrik Semalari',
    description: 'Kapsamli elektrik ve elektronik sistem diyagramlari',
    color: 'text-yellow-400',
  },
  {
    icon: Cog,
    title: 'Tamir Prosedürleri',
    description: 'Adim adim tamir ve bakim talimatlari',
    color: 'text-blue-400',
  },
]

const usageSteps = [
  'Aracinizin marka ve modelini secin',
  'Ihtiyaciniz olan sistemi veya bileseni bulun',
  'Detayli tamir prosedurlerini ve teknik bilgileri inceleyin',
]

export default function WorkshopGuidesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleIframeLoad = () => {
    setLoading(false)
  }

  const handleIframeError = () => {
    setLoading(false)
    setError(true)
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Header */}
      <section className="section-container mb-8">
        <AnimatedSection>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-brand-500/50" />
              <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Profesyonel Kilavuzlar</span>
              <div className="w-8 h-px bg-brand-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Workshop <span className="text-gold">Kilavuzlari</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Araciniz icin detayli teknik dokumanlar, tamir prosedürleri ve bakim kilavuzlari
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Info Cards */}
      <section className="section-container mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {infoCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={0.1 + index * 0.08}>
              <div className="glass-card p-6 h-full hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-th-overlay/[0.05] mb-4', card.color)}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-2">{card.title}</h3>
                <p className="text-sm text-th-fg-sub">{card.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Workshop Content */}
      <section className="section-container mb-8">
        <AnimatedSection delay={0.25}>
          <div className="glass-card overflow-hidden">
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto mb-4" />
                  <p className="text-th-fg-sub font-medium">Workshop kilavuzlari yukleniyor...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center max-w-md">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-display font-bold text-th-fg mb-2">Yukleme Hatasi</h3>
                  <p className="text-th-fg-sub mb-6">Workshop kilavuzlari yuklenemedi.</p>
                  <a
                    href="http://127.0.0.1:3090"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold px-6 py-3 text-sm inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Yeni Sekmede Ac
                  </a>
                </div>
              </div>
            )}

            <iframe
              src="http://127.0.0.1:3090"
              className={cn('w-full border-0', (loading || error) && 'hidden')}
              style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}
              title="Workshop Kilavuzlari"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        </AnimatedSection>
      </section>

      {/* Usage Guide */}
      {!loading && !error && (
        <section className="section-container">
          <AnimatedSection delay={0.3}>
            <div className="glass-card p-6 md:p-8 border-brand-500/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-brand-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display font-bold text-th-fg mb-4">Workshop Kilavuzlarini Nasil Kullanirim?</h3>
                  <ul className="space-y-3">
                    {usageSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-th-fg">
                        <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>
      )}
    </div>
  )
}
