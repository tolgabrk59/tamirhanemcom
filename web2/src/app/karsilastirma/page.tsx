'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeftRight,
  ChevronRight,
  Search,
  Fuel,
  Gauge,
  Shield,
  Zap,
  DollarSign,
  TrendingUp,
  Car,
  Loader2,
  Clock,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'

interface ComparisonEntry {
  id: number
  brand1: string
  model1: string
  year1: number
  brand2: string
  model2: string
  year2: number
  createdAt: string
}

const comparisonCategories = [
  { icon: Gauge, label: 'Performans', description: 'Motor gucu, tork ve hizlanma verileri' },
  { icon: Fuel, label: 'Yakıt Tüketimi', description: 'Sehir ici, sehir disi ve karma tuketim' },
  { icon: Shield, label: 'Güvenlik', description: 'Euro NCAP puanı ve güvenlik donanımları' },
  { icon: DollarSign, label: 'Fiyat', description: 'Satis fiyati ve donanim karsilastirmasi' },
  { icon: Zap, label: 'Teknoloji', description: 'Multimedya, surus destek ve konfor ozellikleri' },
  { icon: TrendingUp, label: 'Değer', description: 'Ikinci el degeri ve sahip olma maliyeti' },
]

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'Az önce'
  if (diffMin < 60) return `${diffMin} dk önce`
  if (diffHour < 24) return `${diffHour} saat önce`
  if (diffDay < 7) return `${diffDay} gün önce`
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} hafta önce`
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function buildComparisonUrl(comp: ComparisonEntry): string {
  return `/karsilastirma/sonuc?brand1=${encodeURIComponent(comp.brand1)}&model1=${encodeURIComponent(comp.model1)}&year1=${comp.year1}&brand2=${encodeURIComponent(comp.brand2)}&model2=${encodeURIComponent(comp.model2)}&year2=${comp.year2}`
}

function formatBrandModel(brand: string, model: string): string {
  // BRAND MODEL formatından okunabilir hale getir
  const b = brand.charAt(0) + brand.slice(1).toLowerCase()
  // Model'de ilk kelimeyi capitalize et, gerisi küçük
  const words = model.split(' ')
  const m = words.map(w => {
    if (/^\d/.test(w)) return w // Sayı ile başlıyorsa olduğu gibi bırak
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  }).join(' ')
  return `${b} ${m}`
}

export default function KarsilastirmaPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [comparisons, setComparisons] = useState<ComparisonEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchComparisons() {
      try {
        const res = await fetch('/api/comparisons')
        if (res.ok) {
          const json = await res.json()
          setComparisons(json.data || [])
        }
      } catch {
        // Sessizce geç
      } finally {
        setLoading(false)
      }
    }
    fetchComparisons()
  }, [])

  const filteredComparisons = comparisons.filter((comp) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      comp.brand1.toLowerCase().includes(q) ||
      comp.model1.toLowerCase().includes(q) ||
      comp.brand2.toLowerCase().includes(q) ||
      comp.model2.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Hero Section */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
              <ArrowLeftRight className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">Araç Karşılaştırma</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Araç <span className="text-gold">Karşılaştırma</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Türkiye pazarındaki popüler araçları teknik özellikler, fiyat ve performans açısından detaylı olarak kıyaslayın.
            </p>
          </div>
        </AnimatedSection>

        {/* Create New + Search */}
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-sub pointer-events-none" />
                <input
                  type="text"
                  placeholder="Marka veya model ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-dark pl-9 w-full"
                />
              </div>
              <Link
                href="/karsilastirma/olustur"
                className="btn-gold px-8 py-3.5 text-sm shrink-0 flex items-center gap-2"
              >
                <ArrowLeftRight className="w-4 h-4" />
                Yeni Karşılaştırma
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Comparison Categories */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-3">
              Neyi <span className="text-gold">Karşılaştırıyoruz</span>?
            </h2>
            <p className="text-th-fg-sub text-sm max-w-xl mx-auto">
              Her karşılaştırmada bu kategorilerde detaylı analiz sunuyoruz
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {comparisonCategories.map((cat, index) => (
            <AnimatedSection key={cat.label} delay={0.15 + index * 0.06}>
              <motion.div
                className="glass-card p-4 text-center h-full"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-3">
                  <cat.icon className="w-5 h-5 text-brand-500" />
                </div>
                <h3 className="text-sm font-display font-bold text-th-fg mb-1">{cat.label}</h3>
                <p className="text-[10px] text-th-fg-sub leading-relaxed">{cat.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Comparisons List */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-3">
              Yapılan <span className="text-gold">Karşılaştırmalar</span>
            </h2>
            <p className="text-th-fg-sub text-sm max-w-xl mx-auto">
              Daha önce oluşturulmuş araç karşılaştırmaları
            </p>
          </div>
        </AnimatedSection>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : filteredComparisons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComparisons.map((comp, index) => (
              <AnimatedSection key={comp.id} delay={0.1 + index * 0.06}>
                <Link href={buildComparisonUrl(comp)}>
                  <motion.div
                    className="glass-card p-6 h-full cursor-pointer group"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      {comp.createdAt && (
                        <div className="flex items-center gap-1.5 text-[10px] text-th-fg-muted">
                          <Clock className="w-3 h-3" />
                          {formatRelativeDate(comp.createdAt)}
                        </div>
                      )}
                      <div className="w-8 h-8 rounded-full bg-red-500/15 border border-red-500/20 flex items-center justify-center">
                        <span className="text-[10px] font-extrabold text-red-400">VS</span>
                      </div>
                    </div>

                    {/* Cars */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 text-center">
                        <div className="w-12 h-12 rounded-xl bg-th-overlay/[0.05] flex items-center justify-center mx-auto mb-2">
                          <Car className="w-6 h-6 text-brand-500/60" />
                        </div>
                        <h3 className="text-sm font-display font-bold text-th-fg">
                          {formatBrandModel(comp.brand1, comp.model1.split(' ')[0])}
                        </h3>
                        <span className="text-[10px] text-th-fg-muted">{comp.year1}</span>
                      </div>

                      <div className="text-2xl font-display font-extrabold text-brand-500/30">vs</div>

                      <div className="flex-1 text-center">
                        <div className="w-12 h-12 rounded-xl bg-th-overlay/[0.05] flex items-center justify-center mx-auto mb-2">
                          <Car className="w-6 h-6 text-red-400/60" />
                        </div>
                        <h3 className="text-sm font-display font-bold text-th-fg">
                          {formatBrandModel(comp.brand2, comp.model2.split(' ')[0])}
                        </h3>
                        <span className="text-[10px] text-th-fg-muted">{comp.year2}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-center gap-1.5 text-brand-500 text-xs font-semibold group-hover:gap-2.5 transition-all">
                      <span>Karşılaştırmayı Gör</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection>
            <div className="glass-card p-12 text-center">
              {searchQuery ? (
                <>
                  <Search className="w-12 h-12 text-th-fg-muted mx-auto mb-4" />
                  <h3 className="text-xl font-display font-bold text-th-fg mb-2">Sonuç Bulunamadı</h3>
                  <p className="text-th-fg-sub text-sm">Farklı bir arama terimi deneyin veya yeni karşılaştırma oluşturun.</p>
                </>
              ) : (
                <>
                  <ArrowLeftRight className="w-12 h-12 text-th-fg-muted mx-auto mb-4" />
                  <h3 className="text-xl font-display font-bold text-th-fg mb-2">Henüz Karşılaştırma Yok</h3>
                  <p className="text-th-fg-sub text-sm mb-6">
                    İlk karşılaştırmanızı oluşturarak araçları detaylı analiz edin.
                  </p>
                  <Link
                    href="/karsilastirma/olustur"
                    className="btn-gold px-8 py-3 text-sm inline-flex items-center gap-2"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    Karşılaştırma Oluştur
                  </Link>
                </>
              )}
            </div>
          </AnimatedSection>
        )}
      </section>

      {/* CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.2}>
          <div className="glass-card p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-4">
              Kendi <span className="text-gold">Karşılaştırmanızı</span> Oluşturun
            </h3>
            <p className="text-th-fg-sub text-sm max-w-lg mx-auto mb-8">
              İstediğiniz iki aracı seçin, yapay zeka destekli detaylı analiz ile karşılaştırın.
            </p>
            <Link
              href="/karsilastirma/olustur"
              className="btn-gold px-10 py-4 text-sm inline-flex items-center gap-2"
            >
              Karşılaştırma Oluştur
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
