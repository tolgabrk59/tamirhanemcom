'use client'

import { useState } from 'react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import {
  Code2,
  Copy,
  Check,
  AlertTriangle,
  Server,
  Zap,
  Shield,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  category: string
}

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/health',
    description: 'Saglik kontrolu',
    category: 'Genel',
  },
  {
    method: 'POST',
    path: '/api/ai/diagnose',
    description: 'AI ariza tespiti',
    category: 'AI',
  },
  {
    method: 'GET',
    path: '/api/obd/code/{code}',
    description: 'OBD kod sorgulama',
    category: 'OBD',
  },
  {
    method: 'GET',
    path: '/api/brands',
    description: 'Marka listesi',
    category: 'Arac',
  },
  {
    method: 'GET',
    path: '/api/services',
    description: 'Servis arama',
    category: 'Servis',
  },
  {
    method: 'GET',
    path: '/api/services/{id}',
    description: 'Servis detayi',
    category: 'Servis',
  },
  {
    method: 'POST',
    path: '/api/appointments',
    description: 'Randevu olusturma',
    category: 'Randevu',
  },
  {
    method: 'GET',
    path: '/api/reviews/{serviceId}',
    description: 'Servis degerlendirmeleri',
    category: 'Servis',
  },
]

const methodColors: Record<string, { text: string; bg: string; border: string }> = {
  GET: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  POST: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  PUT: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  DELETE: {
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
}

const features = [
  {
    icon: Server,
    title: 'RESTful API',
    description: 'Standart HTTP yontemleri ve JSON yanitlari',
  },
  {
    icon: Shield,
    title: 'Guvenli',
    description: 'JWT tabanli kimlik dogrulama',
  },
  {
    icon: Zap,
    title: 'Hizli',
    description: 'Dusuk gecikme sureli yanit',
  },
]

export default function ApiDocsPage() {
  const [copiedPath, setCopiedPath] = useState<string | null>(null)

  const copyToClipboard = (path: string) => {
    navigator.clipboard.writeText(path)
    setCopiedPath(path)
    setTimeout(() => setCopiedPath(null), 2000)
  }

  const groupedEndpoints = endpoints.reduce<Record<string, Endpoint[]>>(
    (acc, ep) => {
      if (!acc[ep.category]) acc[ep.category] = []
      acc[ep.category].push(ep)
      return acc
    },
    {}
  )

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Hero */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-full mb-6">
              <Code2 className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">
                Gelistiriciler Icin
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-3">
              API <span className="text-brand-500">Dokumantasyonu</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              TamirHanem API&apos;sini entegre etmek icin ihtiyaciniz olan tum bilgiler
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Features */}
      <section className="section-container mb-12">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <AnimatedSection key={feature.title} delay={idx * 0.1}>
                <div className="glass-card p-6 text-center hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300">
                  <Icon className="w-8 h-8 text-brand-500 mx-auto mb-3" />
                  <h3 className="font-display font-bold text-th-fg mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-th-fg-sub text-sm">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </section>

      {/* OpenAPI Spec */}
      <section className="section-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="w-5 h-5 text-brand-500" />
              <h2 className="text-xl font-display font-bold text-th-fg">
                OpenAPI Spesifikasyonu
              </h2>
            </div>
            <p className="text-th-fg-sub text-sm mb-4">
              API spesifikasyonuna erismek icin asagidaki endpoint&apos;i kullanin:
            </p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-th-overlay/[0.05] border border-th-border/[0.08]">
              <code className="text-brand-500 text-sm font-mono flex-1">
                GET /api/openapi.json
              </code>
              <button
                onClick={() => copyToClipboard('/api/openapi.json')}
                className="p-2 rounded-lg hover:bg-brand-500/10 transition-colors"
              >
                {copiedPath === '/api/openapi.json' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-th-fg-muted" />
                )}
              </button>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Endpoints */}
      <section className="section-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <AnimatedSection delay={0.15}>
          <h2 className="text-xl font-display font-extrabold text-th-fg mb-2">
            Endpoint&apos;ler
          </h2>
        </AnimatedSection>

        {Object.entries(groupedEndpoints).map(([category, eps], catIdx) => (
          <AnimatedSection key={category} delay={0.2 + catIdx * 0.05}>
            <div className="glass-card p-6 md:p-8">
              <h3 className="text-lg font-display font-bold text-th-fg mb-4 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-brand-500" />
                {category}
              </h3>
              <div className="space-y-3">
                {eps.map((ep) => {
                  const colors = methodColors[ep.method]
                  return (
                    <div
                      key={`${ep.method}-${ep.path}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-th-overlay/[0.03] border border-th-border/[0.06] hover:border-brand-500/20 transition-colors group"
                    >
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-bold font-mono',
                          colors.bg,
                          colors.text,
                          colors.border,
                          'border'
                        )}
                      >
                        {ep.method}
                      </span>
                      <code className="text-th-fg text-sm font-mono flex-1">
                        {ep.path}
                      </code>
                      <span className="text-th-fg-muted text-xs hidden sm:block">
                        {ep.description}
                      </span>
                      <button
                        onClick={() => copyToClipboard(ep.path)}
                        className="p-1.5 rounded-lg hover:bg-brand-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        {copiedPath === ep.path ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-th-fg-muted" />
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </AnimatedSection>
        ))}

        {/* Warning */}
        <AnimatedSection delay={0.5}>
          <div className="glass-card p-6 border-amber-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-400 text-sm mb-1">
                  Gelistirme Asamasinda
                </h4>
                <p className="text-th-fg-sub text-sm">
                  Interaktif API dokumantasyonu yakinda eklenecektir. API
                  hakkinda sorulariniz icin{' '}
                  <a
                    href="mailto:dev@tamirhanem.com"
                    className="text-brand-500 hover:underline"
                  >
                    dev@tamirhanem.com
                  </a>{' '}
                  adresinden bize ulasin.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
