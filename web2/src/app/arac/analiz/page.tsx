'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Zap,
  AlertTriangle,
  Settings,
  CircleDot,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  TrendingUp,
  TrendingDown,
  Car,
  Shield,
  Gauge,
  Droplets,
  Cpu,
  Fuel,
  Wrench,
  ChevronDown,
  ChevronUp,
  Star,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

/* eslint-disable @typescript-eslint/no-explicit-any */
type VehicleData = Record<string, any>

// ─── Loading / Error ─────────────────────────────
function LoadingState({ brand, model, year }: { brand: string; model: string; year: string }) {
  return (
    <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center">
      <AnimatedSection>
        <div className="text-center">
          <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-th-fg mb-3">
            Araç Verileri Analiz Ediliyor...
          </h2>
          <p className="text-th-fg-sub max-w-md mx-auto mb-6">
            {year} {brand} {model} için teknik veriler derleniyor, kronik sorunlar ve piyasa değeri analiz ediliyor.
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
            href="/arac/genel-bakis"
            className="inline-flex items-center gap-2 bg-brand-500 text-th-bg px-6 py-3 rounded-xl font-bold hover:bg-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri Dön
          </Link>
        </div>
      </AnimatedSection>
    </div>
  )
}

// ─── Yakıt Maliyeti Hesaplayıcı ──────────────────
function FuelCostCalculator({ fuelCost }: { fuelCost: any }) {
  const [monthlyKm, setMonthlyKm] = useState(1500)
  const consumption = parseFloat(fuelCost?.average_consumption) || 6
  const price = parseFloat(fuelCost?.current_fuel_price) || 43

  const monthly = useMemo(() => Math.round((monthlyKm / 100) * consumption * price), [monthlyKm, consumption, price])
  const yearly = monthly * 12

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-display font-bold text-th-fg mb-5 flex items-center gap-2">
        <Fuel className="w-5 h-5 text-brand-500" />
        Yakıt Maliyeti Hesaplayıcı
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-th-fg-sub">Aylık Kilometre</span>
            <span className="font-bold text-brand-500">{monthlyKm.toLocaleString('tr-TR')} km</span>
          </div>
          <input
            type="range"
            min={500}
            max={5000}
            step={100}
            value={monthlyKm}
            onChange={(e) => setMonthlyKm(Number(e.target.value))}
            className="w-full h-2 bg-th-overlay/[0.08] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-brand-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-th-fg-muted mt-1">
            <span>500 km</span>
            <span>5.000 km</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-th-overlay/[0.03] rounded-xl p-3 border border-th-border/[0.06]">
            <span className="text-[10px] text-th-fg-muted block">Tüketim</span>
            <span className="text-sm font-bold text-th-fg">{consumption} L/100km</span>
          </div>
          <div className="bg-brand-500/10 rounded-xl p-3 border border-brand-500/20">
            <span className="text-[10px] text-brand-500/70 block">Aylık</span>
            <span className="text-sm font-bold text-brand-500">{monthly.toLocaleString('tr-TR')} ₺</span>
          </div>
          <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/20">
            <span className="text-[10px] text-red-400/70 block">Yıllık</span>
            <span className="text-sm font-bold text-red-400">{yearly.toLocaleString('tr-TR')} ₺</span>
          </div>
        </div>
        <p className="text-[10px] text-th-fg-muted text-center">
          {fuelCost?.fuel_type || 'Benzin'} fiyatı: {price} ₺/L baz alınmıştır
        </p>
      </div>
    </div>
  )
}

// ─── Değer Kaybı Grafiği ──────────────────────────
function DepreciationChart({ depreciation }: { depreciation: any }) {
  if (!depreciation?.yearly?.length) return null
  const items: Array<{ year: number; value: string; loss_pct: number }> = depreciation.yearly
  const maxPct = 100

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-display font-bold text-th-fg mb-2 flex items-center gap-2">
        <TrendingDown className="w-5 h-5 text-red-400" />
        Değer Kaybı Projeksiyonu
      </h3>
      {depreciation.current_value && (
        <p className="text-sm text-th-fg-sub mb-5">Güncel değer: <span className="font-bold text-brand-500">{depreciation.current_value}</span></p>
      )}
      <div className="space-y-3">
        {items.map((item: any) => {
          const remaining = maxPct - (item.loss_pct || 0)
          return (
            <div key={item.year} className="flex items-center gap-3">
              <span className="text-xs text-th-fg-muted w-12 shrink-0">+{item.year} yıl</span>
              <div className="flex-1 h-6 bg-th-overlay/[0.05] rounded-lg overflow-hidden relative">
                <div
                  className={cn(
                    'h-full rounded-lg transition-all duration-500',
                    remaining > 70 ? 'bg-green-500/60' : remaining > 40 ? 'bg-yellow-500/60' : 'bg-red-500/60'
                  )}
                  style={{ width: `${remaining}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-th-fg">
                  {item.value}
                </span>
              </div>
              <span className="text-[10px] text-red-400 w-10 text-right shrink-0">
                {item.loss_pct > 0 ? `-${item.loss_pct}%` : '-'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── OBD Kodları ─────────────────────────────────
function OBDCodes({ codes }: { codes: any[] }) {
  const [expanded, setExpanded] = useState<number | null>(null)
  if (!codes?.length) return null

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-display font-bold text-th-fg mb-5 flex items-center gap-2">
        <Cpu className="w-5 h-5 text-orange-400" />
        Yaygın OBD-II Arıza Kodları
      </h3>
      <div className="space-y-2">
        {codes.map((item: any, idx: number) => (
          <div key={idx} className="bg-th-overlay/[0.03] rounded-xl border border-th-border/[0.06] overflow-hidden">
            <button
              type="button"
              onClick={() => setExpanded(expanded === idx ? null : idx)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-th-overlay/[0.03] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded">
                  {item.code}
                </span>
                <span className="text-sm text-th-fg font-medium">{item.description}</span>
              </div>
              {expanded === idx ? <ChevronUp className="w-4 h-4 text-th-fg-muted" /> : <ChevronDown className="w-4 h-4 text-th-fg-muted" />}
            </button>
            {expanded === idx && (
              <div className="px-4 pb-4 pt-1 border-t border-th-border/[0.06]">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full',
                    item.severity === 'Yüksek' ? 'bg-red-500/10 text-red-400' : item.severity === 'Orta' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'
                  )}>
                    {item.severity}
                  </span>
                </div>
                <p className="text-xs text-th-fg-sub">{item.common_cause}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Ana Sayfa ───────────────────────────────────
function VehicleAnalysisContent() {
  const searchParams = useSearchParams()
  const brand = searchParams?.get('brand') || ''
  const model = searchParams?.get('model') || ''
  const year = searchParams?.get('year') || ''

  const [data, setData] = useState<VehicleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (!brand || !model || !year) {
      setError('Eksik araç bilgisi. Lütfen tekrar seçim yapın.')
      setLoading(false)
      return
    }
    async function fetchData() {
      try {
        const res = await fetch('/api/ai/research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ brand, model, year }),
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || 'Analiz başarısız oldu.')
        }
        setData(await res.json())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Veri alınırken sorun oluştu.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [brand, model, year])

  if (loading) return <LoadingState brand={brand} model={model} year={year} />
  if (error || !data) return <ErrorState message={error} />

  const displayName = `${year} ${brand} ${model}`
  const safety = data.safety
  const performance = data.performance
  const fluids = data.fluids
  const competitors = data.competitors as any[] | undefined
  const obdCodes = data.common_obd_codes as any[] | undefined
  const annualCost = data.annual_maintenance_cost
  const depreciation = data.depreciation
  const fuelCost = data.fuel_cost

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Hero */}
      <section className="section-container mb-8">
        <AnimatedSection>
          <Link href="/arac/genel-bakis" className="inline-flex items-center gap-2 text-th-fg-sub hover:text-brand-500 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Geri Dön</span>
          </Link>

          <div className="grid lg:grid-cols-5 gap-8 glass-card overflow-hidden">
            <div className="lg:col-span-2 relative min-h-[260px] bg-th-overlay/[0.03] flex items-center justify-center">
              {data.image_url && !imageError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.image_url} alt={displayName} className="w-full h-full object-cover absolute inset-0" onError={() => setImageError(true)} />
              ) : (
                <div className="flex flex-col items-center text-th-fg-muted">
                  <Car className="w-16 h-16 mb-2" />
                  <span className="text-sm">{brand} {model}</span>
                </div>
              )}
            </div>
            <div className="lg:col-span-3 p-6 md:p-8 flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-4">
                {displayName} <span className="text-gold">Analizi</span>
              </h1>
              <p className="text-th-fg-sub leading-relaxed">{data.summary}</p>

              {data.estimated_prices && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl px-4 py-2">
                    <span className="text-[10px] text-brand-500/70 uppercase tracking-wider block">Ortalama</span>
                    <span className="text-sm font-bold text-brand-500">{data.estimated_prices.average}</span>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2">
                    <span className="text-[10px] text-green-400/70 uppercase tracking-wider block">Min</span>
                    <span className="text-sm font-bold text-green-400">{data.estimated_prices.market_min}</span>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                    <span className="text-[10px] text-red-400/70 uppercase tracking-wider block">Max</span>
                    <span className="text-sm font-bold text-red-400">{data.estimated_prices.market_max}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section className="section-container">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ═══ SOL KOLON ═══ */}
          <div className="lg:col-span-2 space-y-6">

            {/* Teknik Özellikler */}
            <AnimatedSection delay={0.05}>
              <div className="glass-card p-6">
                <h3 className="text-lg font-display font-bold text-th-fg mb-5 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand-500" />
                  Teknik Özellikler
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { l: 'Motor', v: data.specs?.engine },
                    { l: 'Güç', v: data.specs?.horsepower },
                    { l: 'Tork', v: data.specs?.torque },
                    { l: 'Şanzıman', v: data.specs?.transmission },
                    { l: 'Çekiş', v: data.specs?.drivetrain },
                    { l: 'Yakıt Tüketimi', v: data.specs?.fuel_economy },
                  ].map((s) => (
                    <div key={s.l} className="bg-th-overlay/[0.03] rounded-xl p-3 border border-th-border/[0.06]">
                      <span className="text-xs text-th-fg-muted block mb-1">{s.l}</span>
                      <span className="text-sm font-semibold text-th-fg">{s.v || '-'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Performans */}
            {performance && (
              <AnimatedSection delay={0.08}>
                <div className="glass-card p-6">
                  <h3 className="text-lg font-display font-bold text-th-fg mb-5 flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-blue-400" />
                    Performans Verileri
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { l: '0-100 km/h', v: performance.acceleration_0_100 },
                      { l: 'Maks. Hız', v: performance.top_speed },
                      { l: 'Frenleme (100-0)', v: performance.braking_100_0 },
                      { l: 'Bagaj Hacmi', v: performance.trunk_volume },
                      { l: 'Yakıt Deposu', v: performance.fuel_tank },
                      { l: 'Boş Ağırlık', v: performance.curb_weight },
                    ].map((s) => (
                      <div key={s.l} className="bg-th-overlay/[0.03] rounded-xl p-3 border border-th-border/[0.06] text-center">
                        <span className="text-xs text-th-fg-muted block mb-1">{s.l}</span>
                        <span className="text-sm font-bold text-th-fg">{s.v || '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Güvenlik Puanı */}
            {safety && (
              <AnimatedSection delay={0.1}>
                <div className="glass-card p-6">
                  <h3 className="text-lg font-display font-bold text-th-fg mb-5 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    Güvenlik (Euro NCAP)
                  </h3>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'w-6 h-6',
                            i < (safety.euro_ncap_stars || 0) ? 'text-brand-500 fill-brand-500' : 'text-th-fg-muted/30'
                          )}
                        />
                      ))}
                    </div>
                    {safety.test_year && <span className="text-xs text-th-fg-muted">({safety.test_year} testi)</span>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { l: 'Yetişkin Yolcu', v: safety.adult_occupant, c: 'text-green-400' },
                      { l: 'Çocuk Yolcu', v: safety.child_occupant, c: 'text-blue-400' },
                      { l: 'Yaya Güvenliği', v: safety.pedestrian, c: 'text-yellow-400' },
                      { l: 'Güvenlik Asistanı', v: safety.safety_assist, c: 'text-purple-400' },
                    ].map((s) => (
                      <div key={s.l} className="flex items-center justify-between bg-th-overlay/[0.03] rounded-xl p-3 border border-th-border/[0.06]">
                        <span className="text-xs text-th-fg-sub">{s.l}</span>
                        <span className={cn('text-sm font-bold', s.c)}>{s.v || '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Kronik Sorunlar */}
            <AnimatedSection delay={0.12}>
              <div className="glass-card p-6">
                <h3 className="text-lg font-display font-bold text-th-fg mb-5 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Kronik Sorunlar
                </h3>
                <div className="space-y-3">
                  {(data.chronic_problems || []).map((item: any, idx: number) => (
                    <div key={idx} className="bg-th-overlay/[0.03] rounded-xl p-4 border border-th-border/[0.06]">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-th-fg text-sm">{item.problem}</h4>
                        <span className={cn('text-[10px] font-bold px-2 py-1 rounded-full',
                          item.severity === 'Yüksek' ? 'bg-red-500/10 text-red-400' : item.severity === 'Orta' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'
                        )}>{item.severity} Risk</span>
                      </div>
                      <p className="text-xs text-th-fg-sub mb-3">{item.description}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-th-overlay/[0.08] rounded-full overflow-hidden">
                          <div className={cn('h-full rounded-full',
                            item.significance_score > 7 ? 'bg-red-500' : item.significance_score > 4 ? 'bg-yellow-500' : 'bg-green-500'
                          )} style={{ width: `${item.significance_score * 10}%` }} />
                        </div>
                        <span className="text-[10px] text-th-fg-muted">Önem: {item.significance_score}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* OBD Kodları */}
            {obdCodes && obdCodes.length > 0 && (
              <AnimatedSection delay={0.14}>
                <OBDCodes codes={obdCodes} />
              </AnimatedSection>
            )}

            {/* Bakım Bilgileri */}
            <AnimatedSection delay={0.16}>
              <div className="glass-card p-6">
                <h3 className="text-lg font-display font-bold text-th-fg mb-5 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  Bakım Bilgileri
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-brand-500/10 border border-brand-500/20 p-4 rounded-xl">
                    <span className="text-xs text-brand-500/70 block mb-1 font-semibold">Önerilen Yağ</span>
                    <span className="text-lg font-bold text-brand-500">{data.maintenance?.oil_type}</span>
                  </div>
                  <div className="bg-brand-500/10 border border-brand-500/20 p-4 rounded-xl">
                    <span className="text-xs text-brand-500/70 block mb-1 font-semibold">Yağ Kapasitesi</span>
                    <span className="text-lg font-bold text-brand-500">{data.maintenance?.oil_capacity}</span>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-th-border/[0.08]">
                      <th className="text-left px-4 py-3 text-th-fg-muted text-xs font-semibold uppercase tracking-wider">Kilometre</th>
                      <th className="text-left px-4 py-3 text-th-fg-muted text-xs font-semibold uppercase tracking-wider">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-th-border/[0.06]">
                    {(data.maintenance?.intervals || []).map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-th-overlay/[0.03] transition-colors">
                        <td className="px-4 py-3 font-medium text-th-fg">{item.km}</td>
                        <td className="px-4 py-3 text-th-fg-sub">{item.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimatedSection>

            {/* Sıvı & Akü */}
            {fluids && (
              <AnimatedSection delay={0.18}>
                <div className="glass-card p-6">
                  <h3 className="text-lg font-display font-bold text-th-fg mb-5 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-cyan-400" />
                    Sıvı &amp; Akü Bilgileri
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { l: 'Antifriz Tipi', v: fluids.coolant_type },
                      { l: 'Antifriz Kapasitesi', v: fluids.coolant_capacity },
                      { l: 'Fren Hidroliği', v: fluids.brake_fluid },
                      { l: 'Şanzıman Yağı', v: fluids.transmission_oil },
                      { l: 'Şanzıman Kapasitesi', v: fluids.transmission_capacity },
                      { l: 'Akü Tipi', v: fluids.battery_type },
                    ].map((s) => (
                      <div key={s.l} className="flex items-center justify-between bg-th-overlay/[0.03] rounded-xl p-3 border border-th-border/[0.06]">
                        <span className="text-xs text-th-fg-sub">{s.l}</span>
                        <span className="text-sm font-semibold text-th-fg">{s.v || '-'}</span>
                      </div>
                    ))}
                  </div>
                  {fluids.battery_spec && (
                    <p className="text-xs text-th-fg-muted mt-3">Önerilen akü: <span className="text-th-fg font-medium">{fluids.battery_spec}</span></p>
                  )}
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* ═══ SAĞ KOLON ═══ */}
          <div className="space-y-6">

            {/* Lastik & Basınç */}
            <AnimatedSection delay={0.05} direction="right">
              <div className="glass-card p-6">
                <h3 className="text-lg font-display font-bold text-th-fg mb-5 flex items-center gap-2">
                  <CircleDot className="w-5 h-5 text-th-fg-sub" />
                  Lastik &amp; Basınç
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-th-fg-muted block mb-1">Standart Boyut</span>
                    <span className="text-xl font-bold text-th-fg">{data.tires?.standard}</span>
                  </div>
                  <div>
                    <span className="text-xs text-th-fg-muted block mb-1">Basınç (Ön/Arka)</span>
                    <span className="text-lg font-semibold text-th-fg">{data.tires?.pressure}</span>
                  </div>
                  {data.tires?.alternative?.length > 0 && (
                    <div>
                      <span className="text-xs text-th-fg-muted block mb-2">Alternatifler</span>
                      <div className="flex flex-wrap gap-2">
                        {data.tires.alternative.map((s: string, i: number) => (
                          <span key={i} className="bg-th-overlay/[0.05] border border-th-border/[0.08] text-th-fg px-3 py-1 rounded-lg text-xs font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* Yakıt Maliyeti */}
            {fuelCost && (
              <AnimatedSection delay={0.08} direction="right">
                <FuelCostCalculator fuelCost={fuelCost} />
              </AnimatedSection>
            )}

            {/* Değer Kaybı */}
            {depreciation && (
              <AnimatedSection delay={0.1} direction="right">
                <DepreciationChart depreciation={depreciation} />
              </AnimatedSection>
            )}

            {/* Piyasa Değeri */}
            {data.estimated_prices && (
              <AnimatedSection delay={0.12} direction="right">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-display font-bold text-th-fg mb-5 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand-500" />
                    Piyasa Değeri
                  </h3>
                  <div className="space-y-3">
                    {[
                      { l: 'Minimum', v: data.estimated_prices.market_min, c: 'text-green-400' },
                      { l: 'Ortalama', v: data.estimated_prices.average, c: 'text-brand-500' },
                      { l: 'Maksimum', v: data.estimated_prices.market_max, c: 'text-red-400' },
                    ].map((p) => (
                      <div key={p.l} className="flex justify-between items-center py-2 border-b border-th-border/[0.06] last:border-0">
                        <span className="text-sm text-th-fg-sub">{p.l}</span>
                        <span className={cn('text-sm font-bold', p.c)}>{p.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Yıllık Bakım Maliyeti */}
            {annualCost && (
              <AnimatedSection delay={0.14} direction="right">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-display font-bold text-th-fg mb-2 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-brand-500" />
                    Yıllık Bakım Maliyeti
                  </h3>
                  {annualCost.total && (
                    <p className="text-2xl font-display font-extrabold text-brand-500 mb-4">{annualCost.total}</p>
                  )}
                  <div className="space-y-2">
                    {(annualCost.breakdown || []).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-th-border/[0.06] last:border-0">
                        <div>
                          <span className="text-th-fg">{item.item}</span>
                          {item.frequency && <span className="text-th-fg-muted text-[10px] ml-2">({item.frequency})</span>}
                        </div>
                        <span className="font-bold text-th-fg">{item.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Artılar & Eksiler */}
            <AnimatedSection delay={0.16} direction="right">
              <div className="glass-card p-6 border-green-500/10">
                <h4 className="font-display font-bold text-green-400 mb-4 flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" /> Artıları
                </h4>
                <ul className="space-y-2">
                  {(data.pros || []).map((item: string, idx: number) => (
                    <li key={idx} className="text-sm text-th-fg-sub flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.18} direction="right">
              <div className="glass-card p-6 border-red-500/10">
                <h4 className="font-display font-bold text-red-400 mb-4 flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4" /> Eksileri
                </h4>
                <ul className="space-y-2">
                  {(data.cons || []).map((item: string, idx: number) => (
                    <li key={idx} className="text-sm text-th-fg-sub flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            {/* Rakip Araçlar */}
            {competitors && competitors.length > 0 && (
              <AnimatedSection delay={0.2} direction="right">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-display font-bold text-th-fg mb-5 flex items-center gap-2">
                    <Car className="w-5 h-5 text-purple-400" />
                    Rakip Araçlar
                  </h3>
                  <div className="space-y-3">
                    {competitors.map((comp: any, idx: number) => (
                      <div key={idx} className="bg-th-overlay/[0.03] rounded-xl p-4 border border-th-border/[0.06]">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-th-fg text-sm">{comp.name}</h4>
                          <span className="text-[10px] text-brand-500 font-medium">{comp.price_range}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-start gap-1.5">
                            <span className="mt-0.5 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                            <span className="text-th-fg-sub">{comp.advantage}</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="mt-0.5 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                            <span className="text-th-fg-sub">{comp.disadvantage}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default function VehicleAnalysisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    }>
      <VehicleAnalysisContent />
    </Suspense>
  )
}
