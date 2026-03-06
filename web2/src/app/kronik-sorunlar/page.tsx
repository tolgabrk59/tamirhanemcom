'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  DollarSign,
  FileWarning,
  Car,
  Star,
  BookOpen,
  Wrench,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

interface Brand {
  brand: string
}

interface Model {
  model: string
}

interface ChronicProblem {
  id: number
  brand: string
  model: string
  year_start?: number
  year_end?: number
  title: string
  component?: string
  risk_level?: string
  estimated_cost_band?: string
  complaint_count?: number
  crash_count?: number
  injury_count?: number
  death_count?: number
  fire_count?: number
  recall_count?: number
  sample_complaints?: string
}

const popularBrands = [
  { name: 'Toyota', problems: 145 },
  { name: 'Honda', problems: 132 },
  { name: 'Ford', problems: 128 },
  { name: 'Volkswagen', problems: 119 },
  { name: 'BMW', problems: 98 },
  { name: 'Mercedes', problems: 87 },
  { name: 'Renault', problems: 156 },
  { name: 'Fiat', problems: 143 },
]

const sidebarLinks = {
  yolaGeriDon: [
    { href: '/servis-ara', label: 'Yakınımda oto tamiri bul' },
    { href: '/arac', label: 'Araç sorununu teşhis et' },
    { href: '/belirtiler', label: 'Belirti rehberi' },
  ],
  aracArastir: [
    { href: '/arac', label: 'Araç genel bakış' },
    { href: '/guvenilirlik', label: 'Güvenilirlik puanları' },
    { href: '/bakim-takvimi', label: 'Bakım takvimi' },
    { href: '/geri-cagrima', label: 'Geri çağırmaları bul' },
  ],
  dahafazla: [
    { href: '/obd', label: 'OBD-II kod merkezi' },
    { href: '/lastikler', label: 'Lastik rehberi' },
  ],
}

export default function KronikSorunlarPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [searchResults, setSearchResults] = useState<ChronicProblem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

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
        const res = await fetch(`/api/models?brand=${encodeURIComponent(selectedBrand)}`)
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

  const handleSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)
    try {
      const params = new URLSearchParams()
      if (selectedBrand) params.append('brand', selectedBrand)
      if (selectedModel) params.append('model', selectedModel)
      if (selectedYear) params.append('year', selectedYear)
      if (searchQuery.trim()) params.append('problem', searchQuery)

      const res = await fetch(`/api/kronik-sorunlar?${params.toString()}`)
      if (res.ok) {
        const result = await res.json()
        setSearchResults(result.data || [])
      }
    } catch (error) {
      console.error('Error searching problems:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const getRiskBadge = (risk?: string) => {
    if (!risk) return 'bg-th-overlay/[0.08] text-th-fg-sub border-th-border/10'
    const r = risk.toLowerCase()
    if (r.includes('high') || r.includes('yüksek')) return 'bg-red-500/15 text-red-400 border-red-500/20'
    if (r.includes('medium') || r.includes('orta')) return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'
    if (r.includes('low') || r.includes('düşük')) return 'bg-green-500/15 text-green-400 border-green-500/20'
    return 'bg-th-overlay/[0.08] text-th-fg-sub border-th-border/10'
  }

  const parseComplaints = (raw?: string): string[] => {
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed.filter((c: string) => c && c.trim())
      if (typeof parsed === 'string') return [parsed]
    } catch {
      const text = raw.trim()
      if (text) {
        return text.split(/[\n;]/).map((c: string) => c.trim()).filter((c: string) => c.length > 0)
      }
    }
    return []
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-brand-500/50" />
              <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Kronik Sorunlar</span>
              <div className="w-8 h-px bg-brand-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Araç Sorunları ve <span className="text-gold">Şikayetleri</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto mb-6">
              Araç sahiplerinin şikayetlerine dayalı en yaygın sorunları bulun. Binlerce kullanıcı deneyiminden faydalanın.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="glass-card px-4 py-2 inline-flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-brand-500" />
                <span className="text-th-fg-sub">15,000+ Şikayet</span>
              </div>
              <div className="glass-card px-4 py-2 inline-flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-brand-500" />
                <span className="text-th-fg-sub">Gerçek Kullanıcı Verileri</span>
              </div>
              <div className="glass-card px-4 py-2 inline-flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-brand-500" />
                <span className="text-th-fg-sub">Tahmini Maliyet</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Main Content */}
      <div className="section-container">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vehicle Search */}
            <AnimatedSection delay={0.1}>
              <div className="glass-card p-6 md:p-8">
                <h2 className="text-lg font-display font-bold text-th-fg mb-4">
                  Aracınızı etkileyen yaygın sorunları bulun
                </h2>
                <p className="text-th-fg-sub text-sm mb-4">
                  Marka ve modelinizi seçerek sorunları kontrol edin:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <select
                    className="input-dark appearance-none cursor-pointer"
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value)
                      setSelectedModel('')
                    }}
                  >
                    <option value="">Marka</option>
                    {brands.map((brand) => (
                      <option key={brand.brand} value={brand.brand} className="bg-th-bg-alt">{brand.brand}</option>
                    ))}
                  </select>

                  <select
                    className="input-dark appearance-none cursor-pointer disabled:opacity-50"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={!selectedBrand}
                  >
                    <option value="">Model</option>
                    {models.map((model) => (
                      <option key={model.model} value={model.model} className="bg-th-bg-alt">{model.model}</option>
                    ))}
                  </select>

                  <select
                    className="input-dark appearance-none cursor-pointer"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">Yıl</option>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <option key={year} value={year} className="bg-th-bg-alt">{year}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="btn-gold w-full py-3.5 text-sm disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  {isSearching ? 'Aranıyor...' : 'Sorgula'}
                </button>
              </div>
            </AnimatedSection>

            {/* Problem Search */}
            <AnimatedSection delay={0.12}>
              <div className="glass-card p-6 md:p-8">
                <h2 className="text-lg font-display font-bold text-th-fg mb-4">
                  Belirli bir sorun mu arıyorsunuz?
                </h2>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-fg-sub" />
                    <input
                      type="text"
                      placeholder="Araç sorununuz nedir?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="input-dark pl-12"
                    />
                  </div>
                  <button onClick={handleSearch} className="btn-gold px-8 py-3 text-sm shrink-0">
                    Ara
                  </button>
                </div>
              </div>
            </AnimatedSection>

            {/* Search Results */}
            {hasSearched && (
              <AnimatedSection delay={0.14}>
                <h2 className="text-xl font-display font-bold text-th-fg mb-4">Arama Sonuçları</h2>
                {searchResults.length === 0 ? (
                  <div className="glass-card p-12 text-center">
                    <Search className="w-16 h-16 text-th-fg-muted mx-auto mb-4" />
                    <p className="text-th-fg-sub text-sm">Sonuç bulunamadı. Lütfen farklı bir arama deneyin.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults.map((problem) => {
                      const complaints = parseComplaints(problem.sample_complaints)
                      return (
                        <div key={problem.id} className="glass-card overflow-hidden hover:shadow-glow-sm transition-all duration-300">
                          {/* Header */}
                          <div className="p-5 border-b border-th-border/10">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-display font-bold text-th-fg">
                                {problem.brand} {problem.model}
                              </h3>
                              <div className="flex gap-2">
                                {problem.year_start && problem.year_end && (
                                  <span className="badge-gold text-[10px]">{problem.year_start}-{problem.year_end}</span>
                                )}
                                {problem.risk_level && (
                                  <span className={cn('text-[10px] px-3 py-1 rounded-full font-bold border', getRiskBadge(problem.risk_level))}>
                                    {problem.risk_level}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {problem.component && (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-th-overlay/[0.05] text-th-fg-sub">
                                  {problem.component}
                                </span>
                              )}
                              {Number(problem.recall_count) > 0 && (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                  Geri Çağırma
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 space-y-4">
                            {/* Problem Description */}
                            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                              <div className="flex items-start gap-2">
                                <FileWarning className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                <div>
                                  <h4 className="font-display font-bold text-th-fg text-sm mb-1">Sorun Açıklaması</h4>
                                  <p className="text-th-fg-sub text-sm leading-relaxed">{problem.title}</p>
                                </div>
                              </div>
                            </div>

                            {/* Complaints */}
                            {complaints.length > 0 && (
                              <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/10">
                                <div className="flex items-start gap-2">
                                  <MessageSquare className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                                  <div className="flex-1">
                                    <h4 className="font-display font-bold text-th-fg text-sm mb-2">Belirtiler / Şikayetler</h4>
                                    <ul className="space-y-1">
                                      {complaints.slice(0, 5).map((complaint, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-xs text-th-fg-sub">
                                          <span className="w-1 h-1 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                                          {complaint}
                                        </li>
                                      ))}
                                    </ul>
                                    {complaints.length > 5 && (
                                      <p className="text-[10px] text-th-fg-muted mt-2">+{complaints.length - 5} daha fazla şikayet</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Stats */}
                            {(Number(problem.complaint_count) > 0 || Number(problem.crash_count) > 0 || Number(problem.recall_count) > 0) && (
                              <div className="flex flex-wrap gap-3">
                                {Number(problem.complaint_count) > 0 && (
                                  <div className="glass-card px-4 py-2 text-center">
                                    <div className="text-lg font-display font-bold text-brand-500">{problem.complaint_count}</div>
                                    <div className="text-[10px] text-th-fg-muted">Şikayet</div>
                                  </div>
                                )}
                                {Number(problem.crash_count) > 0 && (
                                  <div className="glass-card px-4 py-2 text-center">
                                    <div className="text-lg font-display font-bold text-red-400">{problem.crash_count}</div>
                                    <div className="text-[10px] text-th-fg-muted">Kaza</div>
                                  </div>
                                )}
                                {Number(problem.recall_count) > 0 && (
                                  <div className="glass-card px-4 py-2 text-center">
                                    <div className="text-lg font-display font-bold text-purple-400">{problem.recall_count}</div>
                                    <div className="text-[10px] text-th-fg-muted">Geri Çağırma</div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Cost */}
                            {problem.estimated_cost_band && (
                              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-green-400" />
                                  <span className="font-display font-bold text-th-fg text-sm">Tahmini Maliyet:</span>
                                  <span className="text-green-400 font-semibold text-sm">{problem.estimated_cost_band}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </AnimatedSection>
            )}

            {/* Popular Brands */}
            <AnimatedSection delay={0.16}>
              <h2 className="text-xl font-display font-bold text-th-fg mb-6">
                Markaya Göre <span className="text-gold">Sorunlar</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {popularBrands.map((brand) => (
                  <button
                    key={brand.name}
                    onClick={() => {
                      setSelectedBrand(brand.name)
                      setSelectedModel('')
                      setSelectedYear('')
                      setSearchQuery('')
                    }}
                    className="glass-card p-5 text-center hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-3">
                      <Car className="w-6 h-6 text-brand-500" />
                    </div>
                    <h3 className="font-display font-bold text-th-fg text-sm mb-1 group-hover:text-brand-500 transition-colors">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-th-fg-muted">{brand.problems} sorun</p>
                    <div className="mt-2 text-brand-500 text-xs font-semibold flex items-center justify-center gap-1">
                      Tümünü gör
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <AnimatedSection delay={0.18}>
              <div className="glass-card p-6 sticky top-28 space-y-8">
                {/* Yola Geri Don */}
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-th-border/10">
                    <Wrench className="w-4 h-4 text-brand-500" />
                    <h3 className="text-sm font-display font-bold text-th-fg">Yola Geri Dön</h3>
                  </div>
                  <ul className="space-y-3">
                    {sidebarLinks.yolaGeriDon.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-th-fg-sub text-sm hover:text-brand-500 transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arac Arastir */}
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-th-border/10">
                    <BookOpen className="w-4 h-4 text-brand-500" />
                    <h3 className="text-sm font-display font-bold text-th-fg">Araç Araştır</h3>
                  </div>
                  <ul className="space-y-3">
                    {sidebarLinks.aracArastir.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-th-fg-sub text-sm hover:text-brand-500 transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Daha Fazlasi */}
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-th-border/10">
                    <Star className="w-4 h-4 text-brand-500" />
                    <h3 className="text-sm font-display font-bold text-th-fg">Daha Fazlası</h3>
                  </div>
                  <ul className="space-y-3">
                    {sidebarLinks.dahafazla.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-th-fg-sub text-sm hover:text-brand-500 transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  )
}
