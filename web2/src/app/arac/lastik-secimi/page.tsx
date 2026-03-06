'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  CircleDot,
  Loader2,
  CheckCircle2,
  X,
  Sun,
  Snowflake,
  Globe,
  Star,
  Lightbulb,
  ChevronRight,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

interface TireData {
  standard_size: string
  alternative_sizes: string[]
  recommended_pressure: { front: string; rear: string }
  recommended_brands: {
    name: string
    model: string
    segment?: string
    price_per_tire?: string
    set_price?: string
    price_range: string
    rating: number
    features: string[]
  }[]
  seasonal_recommendations: { summer: string; winter: string; all_season: string }
  maintenance_tips: string[]
}

const tireBrands = [
  { name: 'Michelin', rating: 4.8, price: '₺₺₺', features: ['Uzun ömür', 'Sessiz sürüş', 'Premium kalite'] },
  { name: 'Continental', rating: 4.7, price: '₺₺₺', features: ['Yüksek performans', 'Güvenlik', 'Teknoloji'] },
  { name: 'Goodyear', rating: 4.6, price: '₺₺₺', features: ['Dayanıklılık', 'Konfor', 'Güvenilir'] },
  { name: 'Pirelli', rating: 4.7, price: '₺₺₺', features: ['Spor performans', 'Tutuş', 'İtalyan'] },
  { name: 'Bridgestone', rating: 4.6, price: '₺₺₺', features: ['Japon kalitesi', 'Uzun ömür', 'Güvenlik'] },
  { name: 'Lassa', rating: 4.3, price: '₺₺', features: ['Uygun fiyat', 'Yerli üretim', 'Güvenilir'] },
  { name: 'Petlas', rating: 4.2, price: '₺₺', features: ['Ekonomik', 'Türk markası', 'Dayanıklı'] },
  { name: 'Hankook', rating: 4.4, price: '₺₺', features: ['Fiyat/performans', 'Kaliteli', 'Kore'] },
]

const tireTypes = [
  {
    id: 'summer',
    title: 'Yaz Lastikleri',
    temp: '+7°C üzeri',
    icon: Sun,
    color: 'text-yellow-400',
    description: 'Sıcak havalarda optimum performans ve yakıt tasarrufu',
    pros: ['Düşük yuvarlanma direnci', 'Yüksek kavrama', 'Uzun ömür'],
    cons: ['Soğukta sertleşir', 'Karda tehlikeli'],
  },
  {
    id: 'winter',
    title: 'Kış Lastikleri',
    temp: '+7°C altı',
    icon: Snowflake,
    color: 'text-blue-400',
    description: 'Kar, buz ve soğuk koşullarda maksimum güvenlik',
    pros: ['Kar ve buzda kavrama', 'Esnek karışım', 'Güvenli'],
    cons: ['Yazın hızlı aşınır', 'Yüksek yuvarlanma direnci'],
  },
  {
    id: 'all-season',
    title: '4 Mevsim Lastikleri',
    temp: 'Her koşul',
    icon: Globe,
    color: 'text-green-400',
    description: 'Yıl boyu kullanım için pratik ve ekonomik çözüm',
    pros: ['Tüm mevsimlerde kullanım', 'Tasarruf sağlar', 'Pratik'],
    cons: ['Uzman performansı yok', 'Aşırı koşullarda yetersiz'],
  },
]

export default function TireSelectionPage() {
  const [brands, setBrands] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [packages, setPackages] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])

  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedPackage, setSelectedPackage] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedSeason, setSelectedSeason] = useState<'summer' | 'winter' | 'all_season'>('summer')

  const [loading, setLoading] = useState(false)
  const [tireData, setTireData] = useState<TireData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/brands?vehicleType=otomobil')
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) setBrands(data.data.map((item: { brand: string }) => item.brand))
        else if (data.brands) setBrands(data.brands)
      })
      .catch(err => console.error('Error fetching brands:', err))
  }, [])

  useEffect(() => {
    if (selectedBrand) {
      setModels([]); setPackages([]); setSelectedModel(''); setSelectedPackage(''); setSelectedYear(''); setTireData(null)
      fetch(`/api/models?brand=${encodeURIComponent(selectedBrand)}&vehicleType=otomobil`)
        .then(res => res.json())
        .then(data => {
          if (data.data && Array.isArray(data.data)) setModels(data.data.map((item: { model?: string; full_model?: string }) => item.model || item.full_model || ''))
          else if (data.models) setModels(data.models)
        })
        .catch(err => console.error('Error fetching models:', err))
    }
  }, [selectedBrand])

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      setPackages([]); setSelectedPackage(''); setTireData(null)
      fetch(`/api/packages?brand=${encodeURIComponent(selectedBrand)}&model=${encodeURIComponent(selectedModel)}`)
        .then(res => res.json())
        .then(data => {
          if (data.data && Array.isArray(data.data)) {
            const names = data.data.map((item: { paket?: string; package?: string; name?: string }) =>
              typeof item === 'string' ? item : (item.paket || item.package || item.name || '')
            ).filter((p: string) => p)
            setPackages(names)
          } else if (data.packages) setPackages(data.packages)
        })
        .catch(err => console.error('Error fetching packages:', err))
    }
  }, [selectedBrand, selectedModel])

  useEffect(() => {
    if (selectedModel) {
      setSelectedYear(''); setTireData(null)
      const currentYear = new Date().getFullYear()
      setYears(Array.from({ length: currentYear - 1999 }, (_, i) => (currentYear - i).toString()))
    }
  }, [selectedModel])

  const searchTireInfo = async () => {
    if (!selectedBrand || !selectedModel || !selectedYear) return
    setLoading(true); setError(''); setTireData(null)
    try {
      const response = await fetch('/api/ai/tire-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: selectedBrand, model: selectedModel, package: selectedPackage, year: selectedYear, season: selectedSeason }),
      })
      if (!response.ok) throw new Error('Veri alınamadı')
      const data = await response.json()
      setTireData(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const canSearch = selectedBrand && selectedModel && selectedYear

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-brand-500/50" />
              <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Lastik Rehberi</span>
              <div className="w-8 h-px bg-brand-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Lastik Seçimi <span className="text-gold">Rehberi</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Aracınız için en uygun lastiği bulun. Marka, model ve yıla göre öneriler alın.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Vehicle Selector */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <CircleDot className="w-6 h-6 text-brand-500" />
              <div>
                <h2 className="text-lg font-display font-bold text-th-fg">Aracınızı Seçin</h2>
                <p className="text-xs text-th-fg-sub">Doğru lastik boyutunu öğrenin</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Marka</label>
                <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="input-dark appearance-none cursor-pointer">
                  <option value="" className="bg-th-bg-alt">Marka Seçin</option>
                  {brands.map((b) => <option key={b} value={b} className="bg-th-bg-alt">{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Model</label>
                <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand} className="input-dark appearance-none cursor-pointer disabled:opacity-50">
                  <option value="" className="bg-th-bg-alt">Model Seçin</option>
                  {models.map((m) => <option key={m} value={m} className="bg-th-bg-alt">{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Paket</label>
                <select value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)} disabled={!selectedModel || packages.length === 0} className="input-dark appearance-none cursor-pointer disabled:opacity-50">
                  <option value="" className="bg-th-bg-alt">Paket Seçin</option>
                  {packages.map((p, i) => <option key={`${p}-${i}`} value={p} className="bg-th-bg-alt">{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Yıl</label>
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} disabled={!selectedModel} className="input-dark appearance-none cursor-pointer disabled:opacity-50">
                  <option value="" className="bg-th-bg-alt">Yıl Seçin</option>
                  {years.map((y) => <option key={y} value={y} className="bg-th-bg-alt">{y}</option>)}
                </select>
              </div>
            </div>

            {/* Lastik Tipi Seçimi */}
            <div className="mb-5">
              <label className="block text-xs text-th-fg-sub mb-3 font-medium">Lastik Tipi</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { id: 'summer' as const, label: 'Yaz Lastiği', icon: Sun, color: 'text-yellow-400', activeColor: 'border-yellow-400/50 bg-yellow-400/10' },
                  { id: 'winter' as const, label: 'Kış Lastiği', icon: Snowflake, color: 'text-blue-400', activeColor: 'border-blue-400/50 bg-blue-400/10' },
                  { id: 'all_season' as const, label: '4 Mevsim', icon: Globe, color: 'text-green-400', activeColor: 'border-green-400/50 bg-green-400/10' },
                ]).map((season) => (
                  <button
                    key={season.id}
                    type="button"
                    onClick={() => { setSelectedSeason(season.id); setTireData(null) }}
                    className={cn(
                      'flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200',
                      selectedSeason === season.id
                        ? `${season.activeColor} ${season.color}`
                        : 'border-th-border/20 text-th-fg-sub hover:border-th-border/40'
                    )}
                  >
                    <season.icon className={cn('w-4 h-4', selectedSeason === season.id ? season.color : 'text-th-fg-muted')} />
                    {season.label}
                  </button>
                ))}
              </div>
            </div>

            {canSearch && (
              <button onClick={searchTireInfo} disabled={loading} className="btn-gold w-full md:w-auto px-8 py-3 text-sm flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Araştırılıyor...</> : <><Search className="w-4 h-4" /> Lastik Önerisi Al</>}
              </button>
            )}

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            {/* AI Results */}
            {tireData && (
              <div className="mt-6 space-y-6">
                <div className="p-6 rounded-xl bg-brand-500/10 border border-brand-500/20">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-8 h-8 text-brand-500 shrink-0" />
                    <div>
                      <p className="text-sm text-th-fg-sub mb-1">Önerilen Lastik Boyutu</p>
                      <p className="text-3xl font-display font-extrabold text-gold">{tireData.standard_size}</p>
                      {tireData.alternative_sizes?.length > 0 && (
                        <p className="text-xs text-th-fg-sub mt-2">Alternatif: {tireData.alternative_sizes.join(', ')}</p>
                      )}
                    </div>
                  </div>
                </div>

                {tireData.recommended_pressure && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4">
                      <p className="text-xs text-th-fg-sub mb-1">Ön Lastik Basıncı</p>
                      <p className="text-2xl font-display font-extrabold text-gold">{tireData.recommended_pressure.front}</p>
                    </div>
                    <div className="glass-card p-4">
                      <p className="text-xs text-th-fg-sub mb-1">Arka Lastik Basıncı</p>
                      <p className="text-2xl font-display font-extrabold text-gold">{tireData.recommended_pressure.rear}</p>
                    </div>
                  </div>
                )}

                {tireData.recommended_brands?.length > 0 && (
                  <div>
                    <h3 className="font-display font-bold text-th-fg mb-4">AI Tarafından Önerilen Lastikler</h3>
                    <div className="space-y-3">
                      {tireData.recommended_brands.map((brand, idx) => (
                        <div key={idx} className="glass-card p-5 hover:-translate-y-0.5 hover:shadow-glow-sm transition-all duration-300">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            {/* Sol: Marka bilgisi */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-display font-bold text-th-fg text-lg">{brand.name}</h4>
                                {brand.segment && (
                                  <span className={cn(
                                    'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                                    brand.segment === 'Premium' ? 'bg-brand-500/20 text-brand-500' :
                                    brand.segment === 'Ekonomik' ? 'bg-green-500/20 text-green-400' :
                                    'bg-blue-500/20 text-blue-400'
                                  )}>
                                    {brand.segment}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-th-fg-sub mb-2">{brand.model}</p>
                              <div className="flex items-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={cn('w-3 h-3', i < Math.floor(brand.rating) ? 'text-brand-500 fill-brand-500' : 'text-th-fg-muted')} />
                                ))}
                                <span className="text-xs text-th-fg-sub ml-1">{brand.rating}</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {brand.features?.map((feature, fidx) => (
                                  <span key={fidx} className="text-[10px] px-2 py-0.5 rounded-full bg-th-overlay/[0.05] text-th-fg-sub">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {/* Sağ: Fiyat bilgisi */}
                            <div className="md:text-right shrink-0 md:min-w-[160px]">
                              {brand.price_per_tire && (
                                <p className="text-2xl font-display font-extrabold text-gold">{brand.price_per_tire}</p>
                              )}
                              <p className="text-xs text-th-fg-muted">adet fiyatı</p>
                              {brand.set_price && (
                                <p className="text-sm font-semibold text-th-fg mt-1">4&apos;lü set: <span className="text-brand-500">{brand.set_price}</span></p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tireData.seasonal_recommendations && (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="glass-card p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sun className="w-5 h-5 text-yellow-400" />
                        <h4 className="font-display font-bold text-th-fg text-sm">Yaz Önerisi</h4>
                      </div>
                      <p className="text-xs text-th-fg-sub leading-relaxed">{tireData.seasonal_recommendations.summer}</p>
                    </div>
                    <div className="glass-card p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Snowflake className="w-5 h-5 text-blue-400" />
                        <h4 className="font-display font-bold text-th-fg text-sm">Kış Önerisi</h4>
                      </div>
                      <p className="text-xs text-th-fg-sub leading-relaxed">{tireData.seasonal_recommendations.winter}</p>
                    </div>
                    <div className="glass-card p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-5 h-5 text-green-400" />
                        <h4 className="font-display font-bold text-th-fg text-sm">4 Mevsim Önerisi</h4>
                      </div>
                      <p className="text-xs text-th-fg-sub leading-relaxed">{tireData.seasonal_recommendations.all_season}</p>
                    </div>
                  </div>
                )}

                {tireData.maintenance_tips?.length > 0 && (
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-brand-500" />
                      <h4 className="font-display font-bold text-th-fg">Bakım Tavsiyeleri</h4>
                    </div>
                    <ul className="space-y-2">
                      {tireData.maintenance_tips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-th-fg-sub flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </AnimatedSection>
      </section>

      {/* Tire Types */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.2}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-px bg-brand-500/50" />
            <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Lastik Tiplerini Karşılaştırın</span>
            <div className="w-8 h-px bg-brand-500/50" />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tireTypes.map((tire, index) => (
            <AnimatedSection key={tire.id} delay={0.25 + index * 0.08} className="h-full">
              <div className="glass-card overflow-hidden h-full flex flex-col hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300">
                <div className="p-6 border-b border-th-border/10 text-center">
                  <tire.icon className={cn('w-10 h-10 mx-auto mb-3', tire.color)} />
                  <h3 className="text-xl font-display font-extrabold text-th-fg mb-1">{tire.title}</h3>
                  <span className="badge-gold text-[10px]">{tire.temp}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-th-fg-sub mb-5">{tire.description}</p>
                  <div className="mb-4">
                    <h4 className="text-sm font-display font-bold text-green-400 mb-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Avantajlar</h4>
                    <ul className="space-y-1.5">
                      {tire.pros.map((p, i) => (
                        <li key={i} className="text-xs text-th-fg flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1 shrink-0" />{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto">
                    <h4 className="text-sm font-display font-bold text-red-400 mb-2 flex items-center gap-1"><X className="w-4 h-4" /> Dezavantajlar</h4>
                    <ul className="space-y-1.5">
                      {tire.cons.map((c, i) => (
                        <li key={i} className="text-xs text-th-fg flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1 shrink-0" />{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Popular Brands */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.35}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-px bg-brand-500/50" />
            <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Popüler Lastik Markaları</span>
            <div className="w-8 h-px bg-brand-500/50" />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tireBrands.map((brand, index) => (
            <AnimatedSection key={brand.name} delay={0.4 + index * 0.03}>
              <div className="glass-card p-5 hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-th-fg">{brand.name}</h3>
                  <span className="text-brand-500 font-bold text-lg">{brand.price}</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn('w-4 h-4', i < Math.floor(brand.rating) ? 'text-brand-500 fill-brand-500' : 'text-th-fg-muted')} />
                  ))}
                  <span className="text-xs text-th-fg-sub ml-1">{brand.rating}</span>
                </div>
                <ul className="space-y-1.5">
                  {brand.features.map((f, i) => (
                    <li key={i} className="text-xs text-th-fg-sub flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-brand-500" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.5}>
          <div className="glass-card p-8 md:p-12 text-center border-brand-500/20">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-4">
              Lastik Değişimi İçin Teklif Alın
            </h2>
            <p className="text-th-fg-sub mb-8 max-w-xl mx-auto">
              Yakınındaki servisleri bulun ve lastik fiyatlarını karşılaştırın.
            </p>
            <Link href="/fiyat-hesapla?service=Lastik%20Değişimi" className="btn-gold px-8 py-4 text-sm inline-flex items-center gap-2">
              Ücretsiz Fiyat Teklifi Al
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
