'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search,
  Car,
  AlertTriangle,
  DollarSign,
  Bell,
  MessageSquare,
  ChevronRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

interface Brand {
  brand: string
}

interface Model {
  model: string
}

interface Package {
  id: number
  paket: string
  full_model: string
}

interface ValidationResult {
  valid: boolean
  production_years: { start: number; end: number } | null
  message: string | null
}

const vehicleYears = Array.from({ length: 30 }, (_, i) => (2025 - i).toString())

const popularBrands = [
  { name: 'Toyota', value: 'TOYOTA' },
  { name: 'Honda', value: 'HONDA' },
  { name: 'Ford', value: 'FORD' },
  { name: 'Volkswagen', value: 'VOLKSWAGEN' },
  { name: 'BMW', value: 'BMW' },
  { name: 'Mercedes', value: 'MERCEDES-BENZ' },
  { name: 'Audi', value: 'AUDI' },
  { name: 'Hyundai', value: 'HYUNDAI' },
  { name: 'Renault', value: 'RENAULT' },
  { name: 'Fiat', value: 'FIAT' },
]

// ─── Marka Logo URL'leri ─────────────────────────────
const brandLogos: Record<string, string> = {
  Toyota: 'https://www.carlogos.org/car-logos/toyota-logo-2020.png',
  Honda: 'https://www.carlogos.org/car-logos/honda-logo-2000.png',
  Ford: 'https://www.carlogos.org/car-logos/ford-logo-2017.png',
  Volkswagen: 'https://www.carlogos.org/car-logos/volkswagen-logo.png',
  BMW: 'https://www.carlogos.org/car-logos/bmw-logo-2020.png',
  Mercedes: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png',
  Audi: 'https://www.carlogos.org/car-logos/audi-logo-2016.png',
  Hyundai: 'https://www.carlogos.org/car-logos/hyundai-logo-2011.png',
  Renault: 'https://www.carlogos.org/car-logos/renault-logo.png',
  Fiat: 'https://www.carlogos.org/car-logos/fiat-logo.png',
}

const infoCards = [
  {
    title: 'Kronik Sorunlar',
    desc: 'Her aracın kendine has problemleri vardır. Aracınızın sık karşılaşılan arızalarını öğrenin.',
    icon: AlertTriangle,
    link: '/kronik-sorunlar',
    color: 'text-red-400',
  },
  {
    title: 'Bakım Maliyetleri',
    desc: 'Yıllık ortalama bakım masrafları ve parça fiyatları hakkında bilgi edinin.',
    icon: DollarSign,
    link: '/fiyat-hesapla',
    color: 'text-brand-500',
  },
  {
    title: 'Geri Çağırmalar',
    desc: 'Güvenliğiniz için üretici tarafından yayınlanan geri çağırma bildirimlerini kontrol edin.',
    icon: Bell,
    link: '/geri-cagrima',
    color: 'text-yellow-400',
  },
  {
    title: 'Kullanıcı Yorumları',
    desc: 'Diğer araç sahiplerinin deneyimlerini ve tavsiyelerini okuyun.',
    icon: MessageSquare,
    link: '/incelemeler',
    color: 'text-blue-400',
  },
]

export default function VehicleOverviewPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedPackage, setSelectedPackage] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch('/api/brands?vehicleType=otomobil')
        if (res.ok) {
          const result = await res.json()
          setBrands(result.data || [])
        }
      } catch (error) {
        console.error('Error fetching brands:', error)
      }
    }
    fetchBrands()
  }, [])

  useEffect(() => {
    async function fetchModels() {
      if (!selectedBrand) {
        setModels([])
        return
      }
      try {
        const res = await fetch(`/api/models?brand=${encodeURIComponent(selectedBrand)}&vehicleType=otomobil`)
        if (res.ok) {
          const result = await res.json()
          setModels(result.data || [])
        }
      } catch (error) {
        console.error('Error fetching models:', error)
      }
    }
    fetchModels()
  }, [selectedBrand])

  useEffect(() => {
    async function fetchPackages() {
      if (!selectedBrand || !selectedModel) {
        setPackages([])
        return
      }
      try {
        const res = await fetch(`/api/packages?brand=${encodeURIComponent(selectedBrand)}&model=${encodeURIComponent(selectedModel)}`)
        if (res.ok) {
          const result = await res.json()
          setPackages(result.data || [])
        }
      } catch (error) {
        console.error('Error fetching packages:', error)
      }
    }
    fetchPackages()
  }, [selectedBrand, selectedModel])

  useEffect(() => {
    async function validateVehicle() {
      if (!selectedBrand || !selectedModel || !selectedYear) {
        setValidationResult(null)
        return
      }

      setIsValidating(true)
      try {
        const modelToValidate = selectedPackage || selectedModel
        const res = await fetch('/api/ai/validate-vehicle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brand: selectedBrand,
            model: modelToValidate,
            year: selectedYear,
          }),
        })

        if (res.ok) {
          const result = await res.json()
          setValidationResult(result)
        }
      } catch (error) {
        console.error('Validation error:', error)
        setValidationResult(null)
      } finally {
        setIsValidating(false)
      }
    }

    const timer = setTimeout(validateVehicle, 500)
    return () => clearTimeout(timer)
  }, [selectedBrand, selectedModel, selectedPackage, selectedYear])

  const canSubmit = selectedBrand && selectedModel && selectedYear && validationResult?.valid && !isValidating

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-brand-500/50" />
              <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Araç İncele</span>
              <div className="w-8 h-px bg-brand-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Aracınızı <span className="text-gold">Tanıyın</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Sahip olduğunuz veya almayı düşündüğünüz araç hakkında bilmeniz gereken her şey burada.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Vehicle Selector */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Marka</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value)
                    setSelectedModel('')
                    setSelectedPackage('')
                  }}
                  className="input-dark appearance-none cursor-pointer"
                >
                  <option value="" className="bg-th-bg-alt">Marka Seçin</option>
                  {brands.map((brand) => (
                    <option key={brand.brand} value={brand.brand} className="bg-th-bg-alt">{brand.brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value)
                    setSelectedPackage('')
                  }}
                  disabled={!selectedBrand}
                  className="input-dark appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="" className="bg-th-bg-alt">Model Seçin</option>
                  {models.map((model) => (
                    <option key={model.model} value={model.model} className="bg-th-bg-alt">{model.model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Paket</label>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  disabled={!selectedModel || packages.length === 0}
                  className="input-dark appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="" className="bg-th-bg-alt">Paket Seçin</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.full_model} className="bg-th-bg-alt">{pkg.paket || pkg.full_model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Yıl</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="input-dark appearance-none cursor-pointer"
                >
                  <option value="" className="bg-th-bg-alt">Yıl Seçin</option>
                  {vehicleYears.map((year) => (
                    <option key={year} value={year} className="bg-th-bg-alt">{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Validation */}
            {isValidating && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 mb-4">
                <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
                <span className="text-sm text-brand-500">Araç bilgisi doğrulanıyor...</span>
              </div>
            )}

            {validationResult && !validationResult.valid && !isValidating && (
              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display font-bold text-yellow-400 mb-1">Geçersiz Yıl/Model Kombinasyonu</h4>
                    <p className="text-sm text-th-fg-sub">
                      {validationResult.message || `${selectedBrand} ${selectedModel} modeli ${selectedYear} yılında üretilmemiştir.`}
                    </p>
                    {validationResult.production_years && (
                      <p className="text-sm text-yellow-400/80 mt-1 font-medium">
                        Bu model {validationResult.production_years.start} - {validationResult.production_years.end} yılları arasında üretilmiştir.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {validationResult && validationResult.valid && !isValidating && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-400">
                  Geçerli araç kombinasyonu
                  {validationResult.production_years && (
                    <span className="text-green-400/70 ml-1">
                      ({validationResult.production_years.start} - {validationResult.production_years.end} üretim)
                    </span>
                  )}
                </span>
              </div>
            )}

            <Link
              href={canSubmit
                ? `/arac/analiz?brand=${encodeURIComponent(selectedBrand)}&model=${encodeURIComponent(selectedPackage || selectedModel)}&year=${encodeURIComponent(selectedYear)}`
                : '#'}
              onClick={(e) => { if (!canSubmit) e.preventDefault() }}
              className={cn(
                'w-full py-4 rounded-xl font-display font-bold text-center transition-all flex items-center justify-center gap-2',
                canSubmit
                  ? 'bg-brand-500 text-th-fg-invert hover:bg-brand-600 shadow-glow-sm'
                  : 'bg-th-overlay/[0.05] text-th-fg-muted cursor-not-allowed'
              )}
            >
              <Search className="w-4 h-4" />
              {isValidating ? 'Doğrulanıyor...' : 'Aracı İncele'}
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Popular Brands */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.15}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-px bg-brand-500/50" />
            <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Popüler Markalar</span>
            <div className="w-8 h-px bg-brand-500/50" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {popularBrands.map((b) => (
              <button
                key={b.value}
                onClick={() => {
                  setSelectedBrand(b.value)
                  setSelectedModel('')
                  setSelectedPackage('')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="glass-card p-5 text-center group hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300"
              >
                {brandLogos[b.name] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brandLogos[b.name]}
                    alt={`${b.name} logo`}
                    className="w-12 h-12 object-contain mx-auto mb-3 opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <Car className="w-8 h-8 text-th-fg-sub mx-auto mb-3 group-hover:text-brand-500 transition-colors" />
                )}
                <span className="font-display font-bold text-th-fg group-hover:text-brand-500 transition-colors text-sm">{b.name}</span>
              </button>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Info Cards */}
      <section className="section-container">
        <AnimatedSection delay={0.2}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-brand-500/50" />
            <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Neden Araştırmalısınız?</span>
            <div className="w-8 h-px bg-brand-500/50" />
          </div>
          <p className="text-th-fg-sub text-center max-w-2xl mx-auto mb-8">
            Bilinçli bir araç sahibi olmak, sürpriz masraflardan kaçınmanın en iyi yoludur.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {infoCards.map((card, idx) => (
              <Link
                key={idx}
                href={card.link}
                className="glass-card p-6 group hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300 border-b-2 border-transparent hover:border-brand-500/40"
              >
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-th-overlay/[0.05] mb-4', card.color)}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-2 group-hover:text-brand-500 transition-colors">{card.title}</h3>
                <p className="text-sm text-th-fg-sub">{card.desc}</p>
                <ChevronRight className="w-4 h-4 text-th-fg-muted mt-3 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
