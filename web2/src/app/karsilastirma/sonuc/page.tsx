'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowLeftRight,
  Zap,
  AlertTriangle,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  TrendingUp,
  Car,
  Shield,
  Gauge,
  Star,
  Trophy,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

/* eslint-disable @typescript-eslint/no-explicit-any */
type VehicleData = Record<string, any>

// ─── Loading State ──────────────────────────────
function LoadingState({ car1, car2 }: { car1: string; car2: string }) {
  return (
    <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center">
      <AnimatedSection>
        <div className="text-center">
          <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-th-fg mb-3">
            Karşılaştırma Hazırlanıyor...
          </h2>
          <p className="text-th-fg-sub max-w-md mx-auto mb-6">
            <span className="font-semibold text-brand-500">{car1}</span> ve{' '}
            <span className="font-semibold text-red-400">{car2}</span> analiz ediliyor.
          </p>
          <div className="flex gap-2 justify-center">
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" />
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <AnimatedSection>
        <div className="glass-card p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-display font-bold text-th-fg mb-3">Bir Sorun Oluştu</h2>
          <p className="text-th-fg-sub mb-6">{message}</p>
          <Link
            href="/karsilastirma/olustur"
            className="inline-flex items-center gap-2 bg-brand-500 text-th-bg px-6 py-3 rounded-xl font-bold hover:bg-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Yeni Karşılaştırma
          </Link>
        </div>
      </AnimatedSection>
    </div>
  )
}

// ─── Karşılaştırma Satırı ───────────────────────
function CompareRow({ label, val1, val2, highlight }: { label: string; val1: string; val2: string; highlight?: boolean }) {
  return (
    <div className={cn(
      'grid grid-cols-3 gap-4 py-3 border-b border-th-border/[0.06] last:border-0 items-center',
      highlight && 'bg-brand-500/5 -mx-4 px-4 rounded-lg'
    )}>
      <span className="text-sm font-semibold text-brand-500 text-center">{val1 || '-'}</span>
      <span className="text-xs text-th-fg-muted text-center font-medium">{label}</span>
      <span className="text-sm font-semibold text-red-400 text-center">{val2 || '-'}</span>
    </div>
  )
}

// ─── Karşılaştırma Bölümü ───────────────────────
function CompareSection({
  title,
  icon: Icon,
  iconColor,
  rows,
}: {
  title: string
  icon: any
  iconColor: string
  rows: { label: string; val1: string; val2: string; highlight?: boolean }[]
}) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-display font-bold text-th-fg mb-5 flex items-center justify-center gap-2">
        <Icon className={cn('w-5 h-5', iconColor)} />
        {title}
      </h3>
      <div className="space-y-0">
        {rows.map((row) => (
          <CompareRow key={row.label} {...row} />
        ))}
      </div>
    </div>
  )
}

// ─── Ana İçerik ─────────────────────────────────
function ComparisonResultContent() {
  const searchParams = useSearchParams()
  const brand1 = searchParams?.get('brand1') || ''
  const model1 = searchParams?.get('model1') || ''
  const year1 = searchParams?.get('year1') || ''
  const brand2 = searchParams?.get('brand2') || ''
  const model2 = searchParams?.get('model2') || ''
  const year2 = searchParams?.get('year2') || ''

  const [data1, setData1] = useState<VehicleData | null>(null)
  const [data2, setData2] = useState<VehicleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const car1Name = `${year1} ${brand1} ${model1}`
  const car2Name = `${year2} ${brand2} ${model2}`

  useEffect(() => {
    if (!brand1 || !model1 || !year1 || !brand2 || !model2 || !year2) {
      setError('Eksik araç bilgisi. Lütfen iki araç seçerek tekrar deneyin.')
      setLoading(false)
      return
    }

    async function fetchBoth() {
      try {
        const [res1, res2] = await Promise.all([
          fetch('/api/ai/research', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ brand: brand1, model: model1, year: year1 }),
          }),
          fetch('/api/ai/research', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ brand: brand2, model: model2, year: year2 }),
          }),
        ])

        if (!res1.ok || !res2.ok) {
          throw new Error('Araç verisi alınamadı. Lütfen tekrar deneyin.')
        }

        const [d1, d2] = await Promise.all([res1.json(), res2.json()])
        setData1(d1)
        setData2(d2)

        // Kıyaslama kaydını kaydet (fire-and-forget)
        fetch('/api/comparisons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ brand1, model1, year1, brand2, model2, year2 }),
        }).catch(() => {})
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Veri alınırken sorun oluştu.')
      } finally {
        setLoading(false)
      }
    }

    fetchBoth()
  }, [brand1, model1, year1, brand2, model2, year2])

  if (loading) return <LoadingState car1={car1Name} car2={car2Name} />
  if (error || !data1 || !data2) return <ErrorState message={error} />

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Header */}
      <section className="section-container mb-8">
        <AnimatedSection>
          <Link href="/karsilastirma/olustur" className="inline-flex items-center gap-2 text-th-fg-sub hover:text-brand-500 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Yeni Karşılaştırma</span>
          </Link>

          {/* Hero Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* VS Badge */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-14 h-14 rounded-full bg-red-500/15 border-2 border-red-500/30 flex items-center justify-center backdrop-blur-sm">
                <span className="text-base font-display font-extrabold text-red-400">VS</span>
              </div>
            </div>

            {/* Car 1 */}
            <div className="glass-card overflow-hidden border-brand-500/20">
              <div className="relative h-48 bg-th-overlay/[0.03] flex items-center justify-center">
                {data1.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data1.image_url} alt={car1Name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                ) : (
                  <Car className="w-16 h-16 text-th-fg-muted" />
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-display font-extrabold text-brand-500 mb-1">{car1Name}</h2>
                <p className="text-xs text-th-fg-sub line-clamp-2">{data1.summary}</p>
                {data1.estimated_prices?.average && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="inline-block bg-brand-500/10 border border-brand-500/20 rounded-lg px-3 py-1">
                      <span className="text-sm font-bold text-brand-500">{data1.estimated_prices.average}</span>
                    </div>
                    {data1.estimated_prices_source === 'arabam.com' && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        arabam.com
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile VS */}
            <div className="flex md:hidden justify-center -my-3">
              <div className="w-10 h-10 rounded-full bg-red-500/15 border-2 border-red-500/30 flex items-center justify-center">
                <span className="text-xs font-display font-extrabold text-red-400">VS</span>
              </div>
            </div>

            {/* Car 2 */}
            <div className="glass-card overflow-hidden border-red-500/20">
              <div className="relative h-48 bg-th-overlay/[0.03] flex items-center justify-center">
                {data2.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data2.image_url} alt={car2Name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                ) : (
                  <Car className="w-16 h-16 text-th-fg-muted" />
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-display font-extrabold text-red-400 mb-1">{car2Name}</h2>
                <p className="text-xs text-th-fg-sub line-clamp-2">{data2.summary}</p>
                {data2.estimated_prices?.average && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="inline-block bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1">
                      <span className="text-sm font-bold text-red-400">{data2.estimated_prices.average}</span>
                    </div>
                    {data2.estimated_prices_source === 'arabam.com' && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        arabam.com
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Column Headers */}
      <section className="section-container mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <span className="text-sm font-display font-bold text-brand-500">{brand1} {model1}</span>
          </div>
          <div className="text-center">
            <ArrowLeftRight className="w-4 h-4 text-th-fg-muted mx-auto" />
          </div>
          <div className="text-center">
            <span className="text-sm font-display font-bold text-red-400">{brand2} {model2}</span>
          </div>
        </div>
      </section>

      {/* Comparison Sections */}
      <section className="section-container space-y-6">

        {/* Teknik Özellikler */}
        <AnimatedSection delay={0.05}>
          <CompareSection
            title="Teknik Özellikler"
            icon={Zap}
            iconColor="text-brand-500"
            rows={[
              { label: 'Motor', val1: data1.specs?.engine, val2: data2.specs?.engine },
              { label: 'Beygir Gücü', val1: data1.specs?.horsepower, val2: data2.specs?.horsepower, highlight: true },
              { label: 'Tork', val1: data1.specs?.torque, val2: data2.specs?.torque },
              { label: 'Şanzıman', val1: data1.specs?.transmission, val2: data2.specs?.transmission },
              { label: 'Çekiş', val1: data1.specs?.drivetrain, val2: data2.specs?.drivetrain },
              { label: 'Yakıt Tüketimi', val1: data1.specs?.fuel_economy, val2: data2.specs?.fuel_economy, highlight: true },
            ]}
          />
        </AnimatedSection>

        {/* Performans */}
        {(data1.performance || data2.performance) && (
          <AnimatedSection delay={0.08}>
            <CompareSection
              title="Performans"
              icon={Gauge}
              iconColor="text-blue-400"
              rows={[
                { label: '0-100 km/h', val1: data1.performance?.acceleration_0_100, val2: data2.performance?.acceleration_0_100, highlight: true },
                { label: 'Maks. Hız', val1: data1.performance?.top_speed, val2: data2.performance?.top_speed },
                { label: 'Frenleme', val1: data1.performance?.braking_100_0, val2: data2.performance?.braking_100_0 },
                { label: 'Bagaj Hacmi', val1: data1.performance?.trunk_volume, val2: data2.performance?.trunk_volume },
                { label: 'Boş Ağırlık', val1: data1.performance?.curb_weight, val2: data2.performance?.curb_weight },
              ]}
            />
          </AnimatedSection>
        )}

        {/* Güvenlik */}
        {(data1.safety || data2.safety) && (
          <AnimatedSection delay={0.1}>
            <div className="glass-card p-6">
              <h3 className="text-lg font-display font-bold text-th-fg mb-5 flex items-center justify-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Güvenlik (Euro NCAP)
              </h3>
              {/* Stars */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn('w-4 h-4', i < (data1.safety?.euro_ncap_stars || 0) ? 'text-brand-500 fill-brand-500' : 'text-th-fg-muted/30')} />
                  ))}
                </div>
                <div className="text-center text-xs text-th-fg-muted">NCAP Yıldızı</div>
                <div className="flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn('w-4 h-4', i < (data2.safety?.euro_ncap_stars || 0) ? 'text-red-400 fill-red-400' : 'text-th-fg-muted/30')} />
                  ))}
                </div>
              </div>
              <CompareRow label="Yetişkin Yolcu" val1={data1.safety?.adult_occupant} val2={data2.safety?.adult_occupant} />
              <CompareRow label="Çocuk Yolcu" val1={data1.safety?.child_occupant} val2={data2.safety?.child_occupant} />
              <CompareRow label="Yaya Güvenliği" val1={data1.safety?.pedestrian} val2={data2.safety?.pedestrian} />
              <CompareRow label="Güvenlik Asistanı" val1={data1.safety?.safety_assist} val2={data2.safety?.safety_assist} />
            </div>
          </AnimatedSection>
        )}

        {/* Piyasa Değeri */}
        {(data1.estimated_prices || data2.estimated_prices) && (
          <AnimatedSection delay={0.12}>
            <div className="glass-card p-6">
              <h3 className="text-lg font-display font-bold text-th-fg mb-5 flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-500" />
                Piyasa Değeri
              </h3>
              {/* Kaynak etiketleri */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex justify-center">
                  {data1.estimated_prices_source === 'arabam.com' ? (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      arabam.com
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      tahmini
                    </span>
                  )}
                </div>
                <div className="text-center text-xs text-th-fg-muted">Kaynak</div>
                <div className="flex justify-center">
                  {data2.estimated_prices_source === 'arabam.com' ? (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      arabam.com
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      tahmini
                    </span>
                  )}
                </div>
              </div>
              <CompareRow label="Minimum" val1={data1.estimated_prices?.market_min} val2={data2.estimated_prices?.market_min} />
              <CompareRow label="Ortalama" val1={data1.estimated_prices?.average} val2={data2.estimated_prices?.average} highlight />
              <CompareRow label="Maksimum" val1={data1.estimated_prices?.market_max} val2={data2.estimated_prices?.market_max} />
            </div>
          </AnimatedSection>
        )}

        {/* Bakım */}
        <AnimatedSection delay={0.14}>
          <CompareSection
            title="Bakım Bilgileri"
            icon={Settings}
            iconColor="text-blue-400"
            rows={[
              { label: 'Yağ Tipi', val1: data1.maintenance?.oil_type, val2: data2.maintenance?.oil_type },
              { label: 'Yağ Kapasitesi', val1: data1.maintenance?.oil_capacity, val2: data2.maintenance?.oil_capacity },
              { label: 'Yıllık Bakım', val1: data1.annual_maintenance_cost?.total, val2: data2.annual_maintenance_cost?.total, highlight: true },
            ]}
          />
        </AnimatedSection>

        {/* Kronik Sorunlar */}
        <AnimatedSection delay={0.16}>
          <div className="glass-card p-6">
            <h3 className="text-lg font-display font-bold text-th-fg mb-5 flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Kronik Sorunlar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Car 1 Problems */}
              <div>
                <h4 className="text-sm font-display font-bold text-brand-500 mb-3 text-center">{brand1} {model1}</h4>
                <div className="space-y-2">
                  {(data1.chronic_problems || []).slice(0, 5).map((item: any, idx: number) => (
                    <div key={idx} className="bg-th-overlay/[0.03] rounded-xl p-3 border border-th-border/[0.06]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-th-fg">{item.problem}</span>
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full',
                          item.severity === 'Yüksek' ? 'bg-red-500/10 text-red-400' : item.severity === 'Orta' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'
                        )}>{item.severity}</span>
                      </div>
                      <p className="text-[10px] text-th-fg-sub line-clamp-2">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Car 2 Problems */}
              <div>
                <h4 className="text-sm font-display font-bold text-red-400 mb-3 text-center">{brand2} {model2}</h4>
                <div className="space-y-2">
                  {(data2.chronic_problems || []).slice(0, 5).map((item: any, idx: number) => (
                    <div key={idx} className="bg-th-overlay/[0.03] rounded-xl p-3 border border-th-border/[0.06]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-th-fg">{item.problem}</span>
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full',
                          item.severity === 'Yüksek' ? 'bg-red-500/10 text-red-400' : item.severity === 'Orta' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'
                        )}>{item.severity}</span>
                      </div>
                      <p className="text-[10px] text-th-fg-sub line-clamp-2">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Artılar & Eksiler */}
        <AnimatedSection delay={0.18}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Car 1 */}
            <div className="space-y-4">
              <div className="glass-card p-5 border-green-500/10">
                <h4 className="font-display font-bold text-green-400 mb-3 flex items-center gap-2 text-sm">
                  <ThumbsUp className="w-4 h-4" /> {brand1} {model1} Artıları
                </h4>
                <ul className="space-y-2">
                  {(data1.pros || []).map((item: string, idx: number) => (
                    <li key={idx} className="text-xs text-th-fg-sub flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-card p-5 border-red-500/10">
                <h4 className="font-display font-bold text-red-400 mb-3 flex items-center gap-2 text-sm">
                  <ThumbsDown className="w-4 h-4" /> {brand1} {model1} Eksileri
                </h4>
                <ul className="space-y-2">
                  {(data1.cons || []).map((item: string, idx: number) => (
                    <li key={idx} className="text-xs text-th-fg-sub flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Car 2 */}
            <div className="space-y-4">
              <div className="glass-card p-5 border-green-500/10">
                <h4 className="font-display font-bold text-green-400 mb-3 flex items-center gap-2 text-sm">
                  <ThumbsUp className="w-4 h-4" /> {brand2} {model2} Artıları
                </h4>
                <ul className="space-y-2">
                  {(data2.pros || []).map((item: string, idx: number) => (
                    <li key={idx} className="text-xs text-th-fg-sub flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-card p-5 border-red-500/10">
                <h4 className="font-display font-bold text-red-400 mb-3 flex items-center gap-2 text-sm">
                  <ThumbsDown className="w-4 h-4" /> {brand2} {model2} Eksileri
                </h4>
                <ul className="space-y-2">
                  {(data2.cons || []).map((item: string, idx: number) => (
                    <li key={idx} className="text-xs text-th-fg-sub flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={0.2}>
          <div className="text-center py-8">
            <Link
              href="/karsilastirma/olustur"
              className="inline-flex items-center gap-2 btn-gold px-8 py-3 rounded-xl font-display font-bold shadow-glow-sm hover:shadow-glow-md transition-all"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Yeni Karşılaştırma Yap
            </Link>
          </div>
        </AnimatedSection>

      </section>
    </div>
  )
}

export default function KarsilastirmaSonucPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    }>
      <ComparisonResultContent />
    </Suspense>
  )
}
