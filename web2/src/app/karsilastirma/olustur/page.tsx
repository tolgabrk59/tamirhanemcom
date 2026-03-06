'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeftRight,
  ChevronDown,
  Loader2,
  Info,
  AlertTriangle,
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

interface CarSelection {
  brand: string
  model: string
  year: string
  valid: boolean
  isValidating: boolean
}

const vehicleYears = Array.from({ length: 30 }, (_, i) => (2025 - i).toString())

function ComparisonSelector({
  label,
  number,
  onChange,
}: {
  label: string
  number: 1 | 2
  onChange: (data: CarSelection) => void
}) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedPackage, setSelectedPackage] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [loadingModels, setLoadingModels] = useState(false)

  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

  // Fetch brands
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
      } finally {
        setLoadingBrands(false)
      }
    }
    fetchBrands()
  }, [])

  // Fetch models
  useEffect(() => {
    if (!selectedBrand) {
      setModels([])
      return
    }
    setLoadingModels(true)
    async function fetchModels() {
      try {
        const res = await fetch(`/api/models?brand=${encodeURIComponent(selectedBrand)}&vehicleType=otomobil`)
        if (res.ok) {
          const result = await res.json()
          setModels(result.data || [])
        }
      } catch (error) {
        console.error('Error fetching models:', error)
      } finally {
        setLoadingModels(false)
      }
    }
    fetchModels()
  }, [selectedBrand])

  // Fetch packages
  useEffect(() => {
    if (!selectedBrand || !selectedModel) {
      setPackages([])
      return
    }
    async function fetchPackages() {
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

  // Validate vehicle (debounced)
  useEffect(() => {
    if (!selectedBrand || !selectedModel || !selectedYear) {
      setValidationResult(null)
      return
    }

    setIsValidating(true)
    const timer = setTimeout(async () => {
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
    }, 500)

    return () => clearTimeout(timer)
  }, [selectedBrand, selectedModel, selectedPackage, selectedYear])

  // Notify parent
  useEffect(() => {
    onChange({
      brand: selectedBrand,
      model: selectedPackage || selectedModel,
      year: selectedYear,
      valid: validationResult?.valid === true,
      isValidating,
    })
  }, [selectedBrand, selectedModel, selectedPackage, selectedYear, validationResult, isValidating, onChange])

  return (
    <div className="glass-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
          <span className="text-lg font-display font-extrabold text-brand-500">{number}</span>
        </div>
        <h3 className="text-lg font-display font-bold text-th-fg">{label}</h3>
      </div>

      <div className="space-y-4">
        {/* Brand */}
        <div>
          <label className="block text-xs text-th-fg-sub mb-2 font-medium">Marka</label>
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value)
                setSelectedModel('')
                setSelectedPackage('')
                setSelectedYear('')
                setValidationResult(null)
              }}
              disabled={loadingBrands}
              className={cn('input-dark appearance-none cursor-pointer pr-8', loadingBrands && 'opacity-50')}
            >
              <option value="" className="bg-th-bg-alt">{loadingBrands ? 'Yükleniyor...' : 'Marka Seçin'}</option>
              {brands.map((b) => (
                <option key={b.brand} value={b.brand} className="bg-th-bg-alt">{b.brand}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-muted pointer-events-none" />
          </div>
        </div>

        {/* Model */}
        <div>
          <label className="block text-xs text-th-fg-sub mb-2 font-medium">Model</label>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value)
                setSelectedPackage('')
                setValidationResult(null)
              }}
              disabled={!selectedBrand || loadingModels}
              className={cn('input-dark appearance-none cursor-pointer pr-8', (!selectedBrand || loadingModels) && 'opacity-50')}
            >
              <option value="" className="bg-th-bg-alt">
                {!selectedBrand ? 'Önce marka seçin' : loadingModels ? 'Yükleniyor...' : 'Model Seçin'}
              </option>
              {models.map((m) => (
                <option key={m.model} value={m.model} className="bg-th-bg-alt">{m.model}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-muted pointer-events-none" />
          </div>
        </div>

        {/* Package */}
        <div>
          <label className="block text-xs text-th-fg-sub mb-2 font-medium">Paket (Opsiyonel)</label>
          <div className="relative">
            <select
              value={selectedPackage}
              onChange={(e) => {
                setSelectedPackage(e.target.value)
                setValidationResult(null)
              }}
              disabled={!selectedModel || packages.length === 0}
              className={cn('input-dark appearance-none cursor-pointer pr-8', (!selectedModel || packages.length === 0) && 'opacity-50')}
            >
              <option value="" className="bg-th-bg-alt">Paket Seçin (Opsiyonel)</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.full_model} className="bg-th-bg-alt">{pkg.paket || pkg.full_model}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-muted pointer-events-none" />
          </div>
        </div>

        {/* Year */}
        <div>
          <label className="block text-xs text-th-fg-sub mb-2 font-medium">Yıl</label>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value)
                setValidationResult(null)
              }}
              className="input-dark appearance-none cursor-pointer pr-8"
            >
              <option value="" className="bg-th-bg-alt">Yıl Seçin</option>
              {vehicleYears.map((y) => (
                <option key={y} value={y} className="bg-th-bg-alt">{y}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-muted pointer-events-none" />
          </div>
        </div>

        {/* Validation Status */}
        {isValidating && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
            <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
            <span className="text-sm text-brand-500">Araç bilgisi doğrulanıyor...</span>
          </div>
        )}

        {validationResult && !validationResult.valid && !isValidating && (
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-bold text-yellow-400 text-sm mb-1">Geçersiz Yıl/Model Kombinasyonu</h4>
                <p className="text-xs text-th-fg-sub">
                  {validationResult.message || `${selectedBrand} ${selectedModel} modeli ${selectedYear} yılında üretilmemiştir.`}
                </p>
                {validationResult.production_years && (
                  <p className="text-xs text-yellow-400/80 mt-1 font-medium">
                    Bu model {validationResult.production_years.start} - {validationResult.production_years.end} yılları arasında üretilmiştir.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {validationResult && validationResult.valid && !isValidating && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
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
      </div>
    </div>
  )
}

export default function KarsilastirmaOlusturPage() {
  const [car1, setCar1] = useState<CarSelection>({ brand: '', model: '', year: '', valid: false, isValidating: false })
  const [car2, setCar2] = useState<CarSelection>({ brand: '', model: '', year: '', valid: false, isValidating: false })

  const handleCar1Change = useCallback((data: CarSelection) => {
    setCar1(data)
  }, [])

  const handleCar2Change = useCallback((data: CarSelection) => {
    setCar2(data)
  }, [])

  const bothValid = car1.valid && car2.valid && !car1.isValidating && !car2.isValidating
  const bothFilled = car1.brand && car1.model && car1.year && car2.brand && car2.model && car2.year

  const comparisonUrl = bothValid
    ? `/karsilastirma/sonuc?brand1=${encodeURIComponent(car1.brand)}&model1=${encodeURIComponent(car1.model)}&year1=${car1.year}&brand2=${encodeURIComponent(car2.brand)}&model2=${encodeURIComponent(car2.model)}&year2=${car2.year}`
    : '#'

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
              <ArrowLeftRight className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">Yeni Karşılaştırma</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Karşılaştırma <span className="text-gold">Oluştur</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              İstediğiniz iki aracı seçin, yapay zeka destekli detaylı analiz ile karşılaştıralım.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Selection Area */}
      <section className="section-container mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative">
          {/* VS Badge */}
          <div className="hidden md:flex absolute left-1/2 top-[220px] transform -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              className="w-16 h-16 rounded-full bg-red-500/15 border-2 border-red-500/30 flex items-center justify-center backdrop-blur-sm"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-lg font-display font-extrabold text-red-400">VS</span>
            </motion.div>
          </div>

          <AnimatedSection delay={0.1} direction="left">
            <ComparisonSelector label="Araç 1" number={1} onChange={handleCar1Change} />
          </AnimatedSection>

          {/* Mobile VS */}
          <div className="flex md:hidden justify-center -my-4">
            <div className="w-12 h-12 rounded-full bg-red-500/15 border-2 border-red-500/30 flex items-center justify-center">
              <span className="text-sm font-display font-extrabold text-red-400">VS</span>
            </div>
          </div>

          <AnimatedSection delay={0.15} direction="right">
            <ComparisonSelector label="Araç 2" number={2} onChange={handleCar2Change} />
          </AnimatedSection>
        </div>
      </section>

      {/* Action Button */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.2}>
          <div className="text-center">
            <Link
              href={comparisonUrl}
              className={cn(
                'inline-flex items-center justify-center gap-3 px-12 py-4 rounded-xl text-base font-display font-bold transition-all',
                bothValid
                  ? 'btn-gold shadow-glow-sm hover:shadow-glow-md'
                  : 'bg-th-overlay/[0.05] border border-th-border/10 text-th-fg-muted cursor-not-allowed'
              )}
              onClick={(e) => {
                if (!bothValid) e.preventDefault()
              }}
            >
              {car1.isValidating || car2.isValidating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Doğrulanıyor...
                </>
              ) : bothValid ? (
                <>
                  <ArrowLeftRight className="w-5 h-5" />
                  Karşılaştırmayı Başlat
                </>
              ) : bothFilled ? (
                <>
                  <AlertTriangle className="w-5 h-5" />
                  Araç Bilgileri Geçersiz
                </>
              ) : (
                <>
                  <Info className="w-5 h-5" />
                  Lütfen Her İki Aracı Seçin
                </>
              )}
            </Link>

            {bothValid && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 space-y-2"
              >
                <p className="text-xs text-th-fg-muted">
                  {car1.brand} {car1.model} ({car1.year}) vs {car2.brand} {car2.model} ({car2.year})
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <Info className="w-4 h-4 text-yellow-400 shrink-0" />
                  <p className="text-xs text-yellow-400/90">
                    Karşılaştırma yapay zeka tarafından yapıldığı için 1-2 dakika sürebilir.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </AnimatedSection>
      </section>

      {/* Info Section */}
      <section className="section-container">
        <AnimatedSection delay={0.25}>
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <h3 className="text-base font-display font-bold text-th-fg mb-2">Nasıl Çalışır?</h3>
                <ul className="space-y-2 text-sm text-th-fg-sub">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                    Karşılaştırmak istediğiniz iki aracın marka, model ve yılını seçin.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                    Yapay zeka destekli sistemimiz araçları performans, yakıt, güvenlik ve fiyat kategorilerinde analiz eder.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                    Detaylı karşılaştırma raporu ve öneriler saniyeler içinde hazırlanır.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
