'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search,
  Star,
  ChevronRight,
  ChevronDown,
  Filter,
  Fuel,
  Gauge,
  Shield,
  Car,
  Loader2,
  AlertTriangle,
  Database,
  TrendingUp,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

/* eslint-disable @typescript-eslint/no-explicit-any */

interface AnalysisEntry {
  id: number
  brand: string
  model: string
  year: number
  summary: string
  image_url: string
  estimated_prices: {
    market_min: string
    market_max: string
    average: string
  } | null
  specs: {
    engine: string
    horsepower: string
    fuel_economy: string
    transmission: string
  } | null
  pros: string[]
  cons: string[]
  safety: {
    euro_ncap_stars: number
  } | null
  fuel_cost: {
    fuel_type: string
    average_consumption: number
  } | null
  updatedAt: string
}

function SafetyStars({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            'w-3 h-3',
            i < stars ? 'text-brand-500 fill-brand-500' : 'text-th-fg-muted/30'
          )}
        />
      ))}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center">
      <AnimatedSection>
        <div className="text-center">
          <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-th-fg mb-3">
            İncelemeler Yükleniyor...
          </h2>
          <p className="text-th-fg-sub max-w-md mx-auto">
            Daha önce analiz edilen araçlar getiriliyor.
          </p>
        </div>
      </AnimatedSection>
    </div>
  )
}

function EmptyState() {
  return (
    <AnimatedSection>
      <div className="glass-card p-12 text-center">
        <Database className="w-16 h-16 text-th-fg-muted/30 mx-auto mb-6" />
        <h3 className="text-2xl font-display font-bold text-th-fg mb-3">Henüz İnceleme Yok</h3>
        <p className="text-th-fg-sub text-sm max-w-md mx-auto mb-8">
          Araç analizi yaptıkça burada bir bilgi bankası oluşacak. İlk analizi başlatmak için aşağıdaki butona tıklayın.
        </p>
        <Link
          href="/arac/genel-bakis"
          className="btn-gold px-8 py-3 text-sm inline-flex items-center gap-2"
        >
          <Car className="w-4 h-4" />
          Araç Analizi Yap
        </Link>
      </div>
    </AnimatedSection>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <AnimatedSection>
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-display font-bold text-th-fg mb-3">Yükleme Hatası</h3>
        <p className="text-th-fg-sub text-sm mb-6">{message}</p>
        <button onClick={onRetry} className="btn-gold px-6 py-3 text-sm">
          Tekrar Dene
        </button>
      </div>
    </AnimatedSection>
  )
}

export default function IncelemelerPage() {
  const [analyses, setAnalyses] = useState<AnalysisEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const fetchAnalyses = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/analyses')
      if (!res.ok) throw new Error('Veriler yüklenemedi')
      const result = await res.json()
      setAnalyses(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyses()
  }, [])

  const brands = Array.from(new Set(analyses.map((a) => a.brand))).sort((a, b) => a.localeCompare(b, 'tr'))
  const years = Array.from(new Set(analyses.map((a) => a.year))).sort((a, b) => b - a)

  const filtered = analyses.filter((a) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      a.brand.toLowerCase().includes(q) ||
      a.model.toLowerCase().includes(q) ||
      `${a.brand} ${a.model}`.toLowerCase().includes(q)
    const matchesBrand = !selectedBrand || a.brand === selectedBrand
    const matchesYear = !selectedYear || a.year === parseInt(selectedYear)
    return matchesSearch && matchesBrand && matchesYear
  })

  if (loading) return <LoadingState />

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Hero Section */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
              <Database className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">Araç Bilgi Bankası</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Araç <span className="text-gold">İncelemeleri</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              AI destekli detaylı araç analizleri. Her sorgulanan araç otomatik olarak bilgi bankasına eklenir.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-th-fg-muted">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              <span><strong className="text-th-fg">{analyses.length}</strong> araç analiz edildi</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Search & Filter */}
        {analyses.length > 0 && (
          <AnimatedSection delay={0.1}>
            <div className="glass-card p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative sm:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-sub pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Marka veya model ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-dark pl-9"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-sub pointer-events-none" />
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="input-dark pl-9 appearance-none cursor-pointer"
                  >
                    <option value="">Tüm Markalar</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-muted pointer-events-none" />
                </div>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-sub pointer-events-none" />
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="input-dark pl-9 appearance-none cursor-pointer"
                  >
                    <option value="">Tüm Yıllar</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-muted pointer-events-none" />
                </div>
              </div>

              <div className="mt-4 text-xs text-th-fg-muted">
                <span className="text-th-fg font-semibold">{filtered.length}</span> / {analyses.length} araç gösteriliyor
              </div>
            </div>
          </AnimatedSection>
        )}
      </section>

      {/* Content */}
      <section className="section-container mb-16">
        {error && <ErrorState message={error} onRetry={fetchAnalyses} />}

        {!error && analyses.length === 0 && <EmptyState />}

        {!error && analyses.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((car, index) => {
                const analysisUrl = `/arac/analiz?brand=${encodeURIComponent(car.brand)}&model=${encodeURIComponent(car.model)}&year=${car.year}`
                const hasImage = car.image_url && !imageErrors.has(car.id)

                return (
                  <AnimatedSection key={car.id} delay={0.05 + index * 0.03}>
                    <Link href={analysisUrl}>
                      <motion.div
                        className="glass-card overflow-hidden h-full group cursor-pointer"
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Image */}
                        <div className="relative h-40 bg-gradient-to-b from-th-overlay/[0.02] to-th-overlay/[0.06] flex items-center justify-center">
                          {hasImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={car.image_url}
                              alt={`${car.year} ${car.brand} ${car.model}`}
                              className="w-full h-full object-contain p-4 drop-shadow-lg"
                              onError={() => setImageErrors((prev) => new Set(prev).add(car.id))}
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-th-fg-muted/30">
                              <Car className="w-12 h-12" />
                              <span className="text-xs font-medium">{car.brand}</span>
                            </div>
                          )}
                          {/* Year badge */}
                          <span className="absolute top-3 right-3 text-[10px] font-bold bg-brand-500/10 text-brand-500 px-2 py-0.5 rounded-full border border-brand-500/20">
                            {car.year}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-display font-bold text-th-fg group-hover:text-brand-500 transition-colors leading-tight">
                                {car.brand} {car.model}
                              </h3>
                            </div>
                            {car.safety?.euro_ncap_stars != null && (
                              <div className="flex items-center gap-1 shrink-0" title="Euro NCAP">
                                <Shield className="w-3.5 h-3.5 text-green-400" />
                                <SafetyStars stars={car.safety.euro_ncap_stars} />
                              </div>
                            )}
                          </div>

                          <p className="text-xs text-th-fg-sub leading-relaxed mb-4 line-clamp-2">
                            {car.summary || 'Bu araç hakkında detaylı analiz mevcut.'}
                          </p>

                          {/* Quick specs */}
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {car.specs?.engine && (
                              <div className="flex items-center gap-1.5 text-[10px] text-th-fg-muted">
                                <Gauge className="w-3 h-3 text-brand-500/60" />
                                <span className="truncate">{car.specs.engine}</span>
                              </div>
                            )}
                            {car.specs?.horsepower && (
                              <div className="flex items-center gap-1.5 text-[10px] text-th-fg-muted">
                                <TrendingUp className="w-3 h-3 text-brand-500/60" />
                                <span className="truncate">{car.specs.horsepower}</span>
                              </div>
                            )}
                            {car.fuel_cost?.fuel_type && (
                              <div className="flex items-center gap-1.5 text-[10px] text-th-fg-muted">
                                <Fuel className="w-3 h-3 text-brand-500/60" />
                                <span className="truncate">{car.fuel_cost.fuel_type}</span>
                              </div>
                            )}
                            {car.specs?.fuel_economy && (
                              <div className="flex items-center gap-1.5 text-[10px] text-th-fg-muted">
                                <Fuel className="w-3 h-3 text-green-400/60" />
                                <span className="truncate">{car.specs.fuel_economy}</span>
                              </div>
                            )}
                          </div>

                          {/* Pros snippet */}
                          {car.pros?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {car.pros.slice(0, 3).map((pro, i) => (
                                <span key={i} className="text-[10px] bg-green-500/5 text-green-400 border border-green-500/10 rounded-full px-2 py-0.5 truncate max-w-[140px]">
                                  {pro}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-th-border/5">
                            <div>
                              {car.estimated_prices?.average ? (
                                <>
                                  <span className="text-[10px] text-th-fg-muted block">Ort. Fiyat</span>
                                  <span className="text-xs font-bold text-brand-500">{car.estimated_prices.average}</span>
                                </>
                              ) : (
                                <span className="text-[10px] text-th-fg-muted">Fiyat bilgisi mevcut</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-brand-500 text-xs font-semibold group-hover:gap-2.5 transition-all">
                              <span>Detaylar</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </AnimatedSection>
                )
              })}
            </div>

            {filtered.length === 0 && (
              <AnimatedSection>
                <div className="glass-card p-12 text-center">
                  <Search className="w-12 h-12 text-th-fg-muted mx-auto mb-4" />
                  <h3 className="text-xl font-display font-bold text-th-fg mb-2">Sonuç Bulunamadı</h3>
                  <p className="text-th-fg-sub text-sm">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
                </div>
              </AnimatedSection>
            )}
          </>
        )}
      </section>

      {/* CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.2}>
          <div className="glass-card p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-4">
              Aracınızı <span className="text-gold">Analiz Edin</span>
            </h3>
            <p className="text-th-fg-sub text-sm max-w-lg mx-auto mb-8">
              Marka, model ve yıl seçerek aracınızın detaylı teknik analizi, kronik sorunları, bakım maliyetleri ve piyasa değerini öğrenin.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/arac/genel-bakis"
                className="btn-gold px-10 py-4 text-sm inline-flex items-center gap-2"
              >
                <Car className="w-4 h-4" />
                Araç Analizi Yap
              </Link>
              <Link
                href="/servis-ara"
                className="px-10 py-4 text-sm inline-flex items-center gap-2 rounded-xl bg-th-fg/10 text-th-fg font-bold hover:bg-th-fg/20 transition-colors"
              >
                Servis Bul
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
