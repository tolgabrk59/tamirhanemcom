'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  Info,
  DollarSign,
  Link2,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Search,
  Wrench,
  Activity,
  ChevronRight,
  ShieldAlert,
  Clock,
} from 'lucide-react'

interface ObdCodeData {
  code: string
  title: string
  description: string
  causes: string[]
  fixes: string[]
  symptoms: string[]
  severity: 'high' | 'medium' | 'low'
  category: string
  estimatedCostMin: number | null
  estimatedCostMax: number | null
}

const STRAPI_API = 'https://api.tamirhanem.com/api'

const severityConfig = {
  high: {
    label: 'Yuksek Oncelik',
    badgeClass: 'bg-red-500/15 text-red-400 border border-red-500/20',
    iconClass: 'text-red-400',
  },
  medium: {
    label: 'Orta Oncelik',
    badgeClass: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
    iconClass: 'text-yellow-400',
  },
  low: {
    label: 'Dusuk Oncelik',
    badgeClass: 'bg-green-500/15 text-green-400 border border-green-500/20',
    iconClass: 'text-green-400',
  },
}

export default function ObdCodePage() {
  const params = useParams()
  const code = (params.code as string)?.toUpperCase() || ''

  const [obdCode, setObdCode] = useState<ObdCodeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) return

    const fetchObdCode = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `${STRAPI_API}/obd-codes?filters[code][$eq]=${code}&pagination[limit]=1`,
          { next: { revalidate: 3600 } }
        )

        if (response.ok) {
          const json = await response.json()
          const items = json.data || []

          if (items.length > 0) {
            const item = items[0]
            const attrs = item.attributes || item

            const severityMap: Record<string, ObdCodeData['severity']> = {
              'YUKSEK': 'high',
              'high': 'high',
              'ORTA': 'medium',
              'medium': 'medium',
              'DUSUK': 'low',
              'low': 'low',
            }

            let causes: string[] = []
            let solutions: string[] = []

            if (attrs.causes) {
              if (Array.isArray(attrs.causes)) {
                causes = attrs.causes
              } else if (typeof attrs.causes === 'string') {
                try {
                  causes = JSON.parse(attrs.causes)
                } catch {
                  causes = attrs.causes.split('\n').filter((c: string) => c.trim())
                }
              }
            }

            if (attrs.solutions) {
              if (Array.isArray(attrs.solutions)) {
                solutions = attrs.solutions
              } else if (typeof attrs.solutions === 'string') {
                try {
                  solutions = JSON.parse(attrs.solutions)
                } catch {
                  solutions = attrs.solutions.split('\n').filter((s: string) => s.trim())
                }
              }
            }

            setObdCode({
              code: attrs.code,
              title: attrs.title,
              description: attrs.description || '',
              causes,
              fixes: solutions,
              symptoms: [],
              severity: severityMap[attrs.severity] || 'medium',
              category: attrs.category || '',
              estimatedCostMin: attrs.estimated_cost_min || null,
              estimatedCostMax: attrs.estimated_cost_max || null,
            })
          } else {
            setError('Bu OBD kodu veritabaninda bulunamadi.')
          }
        } else {
          setError('Veri cekilirken bir hata olustu.')
        }
      } catch {
        setError('Baglanti hatasi. Lutfen tekrar deneyin.')
      } finally {
        setLoading(false)
      }
    }

    fetchObdCode()
  }, [code])

  // Save to history
  useEffect(() => {
    if (obdCode) {
      try {
        const history = JSON.parse(localStorage.getItem('obd-history') || '[]')
        const newEntry = {
          code: obdCode.code,
          title: obdCode.title,
          severity: obdCode.severity,
          viewedAt: new Date().toISOString(),
        }
        const filtered = history.filter(
          (h: { code: string }) => h.code !== obdCode.code
        )
        filtered.unshift(newEntry)
        localStorage.setItem('obd-history', JSON.stringify(filtered.slice(0, 20)))
      } catch {
        // ignore localStorage errors
      }
    }
  }, [obdCode])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />
        <section className="section-container">
          <div className="glass-card p-12 text-center">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto mb-4" />
            <p className="text-th-fg-sub">
              <span className="text-brand-500 font-display font-bold">{code}</span>{' '}
              kodu yukleniyor...
            </p>
          </div>
        </section>
      </div>
    )
  }

  if (error || !obdCode) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />
        <section className="section-container">
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-display font-extrabold text-th-fg mb-3">
              OBD Kodu Bulunamadi
            </h1>
            <p className="text-th-fg-sub mb-6">{error || 'Aradiginiz OBD ariza kodu bulunamadi.'}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/obd"
                className="btn-gold px-6 py-3 text-sm inline-flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                OBD Kod Ara
              </Link>
              <Link
                href="/"
                className="px-6 py-3 rounded-xl border border-th-border/20 text-th-fg-sub text-sm hover:text-th-fg transition-colors inline-flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Ana Sayfa
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const severity = severityConfig[obdCode.severity]

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Breadcrumb */}
      <section className="section-container mb-8">
        <AnimatedSection>
          <div className="flex items-center gap-2 text-sm text-th-fg-muted">
            <Link href="/" className="hover:text-brand-500 transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/obd" className="hover:text-brand-500 transition-colors">
              OBD Kodlari
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-500 font-medium">{obdCode.code}</span>
          </div>
        </AnimatedSection>
      </section>

      {/* Code Header */}
      <section className="section-container mb-8">
        <AnimatedSection delay={0.05}>
          <div className="glass-card p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <span className="text-4xl md:text-5xl font-display font-extrabold text-gold">
                {obdCode.code}
              </span>
              <div>
                <h1 className="text-xl font-display font-bold text-th-fg mb-2">
                  {obdCode.title}
                </h1>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'text-xs px-3 py-1 rounded-full font-semibold inline-block',
                      severity.badgeClass
                    )}
                  >
                    {severity.label}
                  </span>
                  {obdCode.category && (
                    <span className="text-xs px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 font-medium">
                      {obdCode.category}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {obdCode.description && (
              <>
                <div className="section-divider mb-6" />
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-brand-500" />
                    <h2 className="text-lg font-display font-bold text-th-fg">
                      Aciklama
                    </h2>
                  </div>
                  <p className="text-th-fg-sub text-sm leading-relaxed">
                    {obdCode.description}
                  </p>
                </div>
              </>
            )}
          </div>
        </AnimatedSection>
      </section>

      {/* Causes & Fixes */}
      <section className="section-container mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Causes */}
          {obdCode.causes.length > 0 && (
            <AnimatedSection delay={0.1}>
              <div className="glass-card p-6 md:p-8 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h2 className="text-lg font-display font-bold text-th-fg">
                    Olasi Nedenler
                  </h2>
                </div>
                <ol className="space-y-3">
                  {obdCode.causes.map((cause, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-th-fg">
                      <span className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      {cause}
                    </li>
                  ))}
                </ol>
              </div>
            </AnimatedSection>
          )}

          {/* Fixes */}
          {obdCode.fixes.length > 0 && (
            <AnimatedSection delay={0.15}>
              <div className="glass-card p-6 md:p-8 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Wrench className="w-5 h-5 text-green-400" />
                  <h2 className="text-lg font-display font-bold text-th-fg">
                    Cozum Onerileri
                  </h2>
                </div>
                <ol className="space-y-3">
                  {obdCode.fixes.map((fix, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-th-fg">
                      <span className="w-6 h-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      {fix}
                    </li>
                  ))}
                </ol>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Estimated Cost */}
      {obdCode.estimatedCostMin && obdCode.estimatedCostMax && (
        <section className="section-container mb-8">
          <AnimatedSection delay={0.2}>
            <div className="glass-card p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-brand-500" />
                <h2 className="text-lg font-display font-bold text-th-fg">
                  Tahmini Maliyet
                </h2>
              </div>
              <div className="glass-card p-5">
                <div className="flex items-center justify-between">
                  <span className="text-th-fg-sub text-sm">Onarim maliyet araligi</span>
                  <span className="text-2xl font-display font-bold text-gold">
                    {obdCode.estimatedCostMin.toLocaleString('tr-TR')} -{' '}
                    {obdCode.estimatedCostMax.toLocaleString('tr-TR')} TL
                  </span>
                </div>
                <p className="text-xs text-th-fg-muted mt-2">
                  * Fiyatlar servise, bolgeye ve arac modeline gore degisiklik gosterebilir.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* Quick Actions */}
      <section className="section-container mb-8">
        <AnimatedSection delay={0.25}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/ai/ariza-tespit"
              className="glass-card p-5 text-center hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300 group"
            >
              <ShieldAlert className="w-8 h-8 text-brand-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-display font-bold text-th-fg mb-1">
                AI ile Tani
              </h3>
              <p className="text-xs text-th-fg-sub">
                Belirtilerinizi anlatin, AI teshis etsin
              </p>
            </Link>

            <Link
              href="/servis-ara"
              className="glass-card p-5 text-center hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300 group"
            >
              <Search className="w-8 h-8 text-brand-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-display font-bold text-th-fg mb-1">
                Servis Bul
              </h3>
              <p className="text-xs text-th-fg-sub">
                Yakininizdaki en iyi servisi kesfet
              </p>
            </Link>

            <Link
              href="/obd"
              className="glass-card p-5 text-center hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300 group"
            >
              <Activity className="w-8 h-8 text-brand-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-display font-bold text-th-fg mb-1">
                Diger OBD Kodlari
              </h3>
              <p className="text-xs text-th-fg-sub">
                Tum OBD ariza kodlarini arastirir
              </p>
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
