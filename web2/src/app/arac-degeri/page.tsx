'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Calculator,
  Car,
  Gauge,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Shield,
  Paintbrush,
  Clock,
  MapPin,
  Info,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 25 }, (_, i) => currentYear - i)

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface ResultData {
  avgPrice: number
  minPrice: number
  maxPrice: number
  medianPrice: number
  count: number
  rangeLow: number
  rangeHigh: number
  source: 'arabam.com' | 'estimate'
  arabamUrl?: string
}

export default function AracDegeriPage() {
  const [brands, setBrands] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [brandsLoading, setBrandsLoading] = useState(true)
  const [modelsLoading, setModelsLoading] = useState(false)
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState(currentYear - 3)
  const [mileage, setMileage] = useState(50000)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ResultData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Redis cache'den markaları çek
  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch('/api/brands?vehicleType=otomobil')
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setBrands(json.data.map((item: { brand: string }) => item.brand))
        }
      } catch {
        console.error('Markalar yüklenemedi')
      } finally {
        setBrandsLoading(false)
      }
    }
    fetchBrands()
  }, [])

  // Redis cache'den modelleri çek (marka değişince)
  const fetchModels = useCallback(async (selectedBrand: string) => {
    if (!selectedBrand) {
      setModels([])
      return
    }
    setModelsLoading(true)
    try {
      const res = await fetch(`/api/models?brand=${encodeURIComponent(selectedBrand)}&vehicleType=otomobil`)
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setModels(json.data.map((item: { model: string }) => item.model))
      }
    } catch {
      console.error('Modeller yüklenemedi')
      setModels([])
    } finally {
      setModelsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchModels(brand)
  }, [brand, fetchModels])

  const handleCalculate = async () => {
    if (!brand || !model) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const params = new URLSearchParams({
        brand,
        model,
        year: year.toString(),
        km: mileage.toString(),
      })

      const response = await fetch(`/api/arac-degeri?${params}`)

      if (!response.ok) throw new Error('API hatası')

      const data: ResultData = await response.json()
      setResult(data)
    } catch {
      setError('Fiyat verisi alınamadı. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const priceFactors = [
    { icon: TrendingUp, title: 'Kilometre', description: 'Düşük km daha yüksek değer', color: 'text-brand-500' },
    { icon: CheckCircle, title: 'Bakım Geçmişi', description: 'Düzenli bakım değeri artırır', color: 'text-green-400' },
    { icon: Paintbrush, title: 'Renk & Donanım', description: 'Popüler renkler tercih edilir', color: 'text-purple-400' },
    { icon: Clock, title: 'Kaza Geçmişi', description: 'Hasarsız araçlar daha değerli', color: 'text-orange-400' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
              <BarChart3 className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">Güncel Piyasa Verisi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Aracınız <span className="text-gold">Ne Kadar?</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto mb-8">
              arabam.com güncel ilan verilerine dayalı gerçek piyasa değerini öğrenin.
              İkinci el araç fiyatlarını karşılaştırın.
            </p>
          </div>
        </AnimatedSection>

        {/* Info Box */}
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6 max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                <h4 className="font-display font-bold text-th-fg mb-1 text-sm">Nasıl Hesaplanıyor?</h4>
                <p className="text-xs text-th-fg-sub leading-relaxed">
                  arabam.com üzerindeki güncel ilanlar analiz edilerek, benzer araçların ortalama fiyatı hesaplanmaktadır.
                  Aşırı yüksek ve düşük fiyatlar filtrelenerek gerçekçi bir değer aralığı sunulmaktadır.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Calculator Section */}
      <section className="section-container mb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatedSection delay={0.15}>
              <div className="glass-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-brand-500" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-th-fg">
                    Araç Bilgilerini Girin
                  </h2>
                </div>

                <div className="section-divider mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Marka */}
                  <div>
                    <label className="block text-xs text-th-fg-sub mb-2 font-medium">
                      Marka <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={brand}
                      onChange={(e) => {
                        setBrand(e.target.value)
                        setModel('')
                      }}
                      disabled={brandsLoading}
                      className="input-dark appearance-none cursor-pointer text-sm py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" className="bg-th-bg-alt">
                        {brandsLoading ? 'Markalar yükleniyor...' : 'Marka Seçin'}
                      </option>
                      {brands.map((b) => (
                        <option key={b} value={b} className="bg-th-bg-alt">{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-xs text-th-fg-sub mb-2 font-medium">
                      Model <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      disabled={!brand || modelsLoading}
                      className="input-dark appearance-none cursor-pointer text-sm py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" className="bg-th-bg-alt">
                        {modelsLoading ? 'Modeller yükleniyor...' : 'Model Seçin'}
                      </option>
                      {models.map((m) => (
                        <option key={m} value={m} className="bg-th-bg-alt">{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Yıl */}
                  <div>
                    <label className="block text-xs text-th-fg-sub mb-2 font-medium">
                      Model Yılı <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="input-dark appearance-none cursor-pointer text-sm py-3.5"
                    >
                      {years.map((y) => (
                        <option key={y} value={y} className="bg-th-bg-alt">{y}</option>
                      ))}
                    </select>
                  </div>

                  {/* Kilometre */}
                  <div>
                    <label className="block text-xs text-th-fg-sub mb-2 font-medium">
                      Kilometre
                    </label>
                    <div className="relative">
                      <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-muted" />
                      <input
                        type="number"
                        value={mileage}
                        onChange={(e) => setMileage(Number(e.target.value))}
                        min={0}
                        max={500000}
                        step={5000}
                        placeholder="Örnek: 75000"
                        className="input-dark pl-11 text-sm py-3.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={handleCalculate}
                  disabled={!brand || !model || isLoading}
                  className="btn-gold w-full mt-6 py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      arabam.com Verileri Alınıyor...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Değeri Hesapla
                    </span>
                  )}
                </button>

                {/* Error */}
                {error && (
                  <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                      <div>
                        <p className="text-red-400 font-medium text-sm">{error}</p>
                        <p className="text-red-400/70 text-xs mt-1">
                          Farklı seçenekler deneyin veya arabam.com üzerinden kontrol edin.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Result */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <h3 className="text-lg font-display font-bold text-th-fg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        Piyasa Değeri
                      </h3>
                      <div className="flex items-center gap-2">
                        {result.source === 'arabam.com' ? (
                          <span className="badge-gold text-[11px]">
                            {result.count} ilan analiz edildi
                          </span>
                        ) : (
                          <span className="text-[11px] bg-orange-500/10 text-orange-400 px-2.5 py-1 rounded-full font-semibold">
                            Tahmini değerleme
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Kaynak Bilgisi */}
                    {result.source === 'estimate' && (
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 mb-4">
                        <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-orange-400">
                          arabam.com&apos;dan canlı veri alınamadı. Gösterilen fiyatlar piyasa tahminine dayalıdır.
                          Güncel fiyatlar için aşağıdaki arabam.com linkini kullanın.
                        </p>
                      </div>
                    )}

                    {/* Main Value */}
                    <div className="glass-card p-6 md:p-8 mb-6 border-brand-500/20">
                      <div className="text-center">
                        <p className="text-brand-500 font-semibold text-sm mb-2">
                          {result.source === 'arabam.com' ? 'arabam.com Piyasa Değeri' : 'Tahmini Piyasa Değeri'}
                        </p>
                        <p className="text-4xl md:text-5xl font-display font-extrabold text-gold mb-3">
                          {formatCurrency(result.avgPrice)}
                        </p>
                        <p className="text-th-fg-sub text-base">
                          {formatCurrency(result.rangeLow)} - {formatCurrency(result.rangeHigh)}
                        </p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-center">
                        <p className="text-[10px] text-green-400 font-medium mb-1">En Düşük</p>
                        <p className="text-sm font-display font-bold text-green-400">{formatCurrency(result.minPrice)}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
                        <p className="text-[10px] text-red-400 font-medium mb-1">En Yüksek</p>
                        <p className="text-sm font-display font-bold text-red-400">{formatCurrency(result.maxPrice)}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
                        <p className="text-[10px] text-blue-400 font-medium mb-1">Medyan</p>
                        <p className="text-sm font-display font-bold text-blue-400">{formatCurrency(result.medianPrice)}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-center">
                        <p className="text-[10px] text-purple-400 font-medium mb-1">İlan Sayısı</p>
                        <p className="text-sm font-display font-bold text-purple-400">
                          {result.count > 0 ? result.count : '—'}
                        </p>
                      </div>
                    </div>

                    {/* arabam.com Link */}
                    {result.arabamUrl && (
                      <a
                        href={result.arabamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-xl bg-brand-500/5 border border-brand-500/20 hover:bg-brand-500/10 transition-colors group mb-6"
                      >
                        <div>
                          <p className="font-display font-bold text-th-fg text-sm">
                            arabam.com&apos;da Görüntüle
                          </p>
                          <p className="text-xs text-th-fg-muted">
                            {brand} {model} ({year}) güncel ilanları
                          </p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-brand-500 group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}

                    {/* Info */}
                    <div className="p-4 rounded-xl bg-th-overlay/[0.03] border border-th-border/10">
                      <p className="text-xs text-th-fg-sub">
                        <strong className="text-th-fg">{brand} {model}</strong> ({year}) modelinin
                        {result.source === 'arabam.com'
                          ? ' arabam.com güncel ilan fiyatlarından hesaplandı.'
                          : ' piyasa verileri baz alınarak tahmin edildi.'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <AnimatedSection delay={0.2}>
              <div className="glass-card p-6 border-brand-500/20">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-brand-500" />
                </div>
                <h4 className="font-display font-bold text-th-fg text-lg mb-2">Profesyonel Ekspertiz</h4>
                <p className="text-th-fg-sub text-sm mb-5 leading-relaxed">
                  Aracınızın gerçek değerini öğrenmek için profesyonel ekspertiz hizmeti alın.
                </p>
                <Link href="/servis-ara" className="btn-gold w-full py-3 text-sm">
                  Ekspertiz Bul
                </Link>
              </div>
            </AnimatedSection>

            {/* Price Factors */}
            <AnimatedSection delay={0.25}>
              <div className="glass-card p-6">
                <h3 className="font-display font-bold text-th-fg mb-4">
                  Fiyatı Etkileyen Faktörler
                </h3>
                <ul className="space-y-4">
                  {priceFactors.map((factor) => (
                    <li key={factor.title} className="flex items-start gap-3">
                      <div className={cn('w-8 h-8 rounded-lg bg-th-overlay/[0.05] flex items-center justify-center shrink-0', factor.color)}>
                        <factor.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-th-fg text-sm">{factor.title}</p>
                        <p className="text-[11px] text-th-fg-muted">{factor.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            {/* External Link */}
            <AnimatedSection delay={0.3}>
              <a
                href="https://www.arabam.com/arabam-kac-para"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-5 flex items-center justify-between group hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300 block"
              >
                <div>
                  <p className="font-display font-bold text-th-fg text-sm">arabam.com</p>
                  <p className="text-xs text-th-fg-muted">Resmi değerleme aracı</p>
                </div>
                <ExternalLink className="w-4 h-4 text-th-fg-muted group-hover:text-brand-500 transition-colors" />
              </a>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.2}>
          <div className="glass-card p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-4">
              Aracınızı Satmak mı <span className="text-gold">İstiyorsunuz?</span>
            </h3>
            <p className="text-th-fg-sub mb-8 max-w-2xl mx-auto">
              Güvenilir servislerden ücretsiz ekspertiz teklifi alın ve aracınızı en iyi fiyata satın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/servis-ara" className="btn-gold px-8 py-3 text-sm inline-flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Servis Bul
              </Link>
              <Link
                href="/randevu"
                className="px-8 py-3 rounded-xl border border-th-border/20 bg-th-overlay/[0.05] text-th-fg hover:bg-th-overlay/[0.08] transition-all text-sm font-semibold inline-flex items-center gap-2"
              >
                <Car className="w-4 h-4" />
                Randevu Al
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
