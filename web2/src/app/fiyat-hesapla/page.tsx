'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronRight,
  Wrench,
  Car,
  Loader2,
  TrendingUp,
  Info,
  Calculator,
  CircleDollarSign,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'

// ─── Fiyat Verileri ─────────────────────────────────────────────
interface PricingItem {
  name: string
  min: number
  max: number
  category: string
}

const PRICING_DATA: PricingItem[] = [
  // Fren Sistemi
  { name: 'Fren Balata Değişimi', min: 800, max: 3000, category: 'Fren Sistemi' },
  { name: 'Fren Disk Değişimi', min: 1500, max: 5000, category: 'Fren Sistemi' },
  { name: 'Fren Hidrolik Sistemi', min: 500, max: 2000, category: 'Fren Sistemi' },

  // Motor
  { name: 'Motor Yağı Değişimi', min: 1000, max: 3500, category: 'Motor' },
  { name: 'Triger Seti Değişimi', min: 3000, max: 8000, category: 'Motor' },
  { name: 'Termostat Değişimi', min: 500, max: 2000, category: 'Motor' },
  { name: 'Su Pompası Değişimi', min: 1500, max: 4000, category: 'Motor' },
  { name: 'Radyatör Tamiri/Değişimi', min: 2000, max: 6000, category: 'Motor' },
  { name: 'Motor Conta Değişimi', min: 3000, max: 10000, category: 'Motor' },
  { name: 'Buji Değişimi', min: 400, max: 2000, category: 'Motor' },
  { name: 'Hava Filtresi Değişimi', min: 200, max: 800, category: 'Motor' },
  { name: 'Yakıt Filtresi Değişimi', min: 300, max: 1200, category: 'Motor' },
  { name: 'Turbo Tamiri', min: 5000, max: 20000, category: 'Motor' },

  // Şanzıman
  { name: 'Debriyaj Seti Değişimi', min: 3000, max: 8000, category: 'Şanzıman' },
  { name: 'Şanzıman Yağı Değişimi', min: 800, max: 3000, category: 'Şanzıman' },
  { name: 'Otomatik Şanzıman Tamiri', min: 5000, max: 25000, category: 'Şanzıman' },

  // Süspansiyon
  { name: 'Amortisör Değişimi', min: 1500, max: 5000, category: 'Süspansiyon' },
  { name: 'Rot Balans Ayarı', min: 300, max: 800, category: 'Süspansiyon' },
  { name: 'Salıncak Değişimi', min: 1000, max: 3500, category: 'Süspansiyon' },
  { name: 'Viraj Demiri', min: 800, max: 2500, category: 'Süspansiyon' },

  // Elektrik
  { name: 'Akü Değişimi', min: 1500, max: 5000, category: 'Elektrik' },
  { name: 'Alternatör Tamiri', min: 1500, max: 4000, category: 'Elektrik' },
  { name: 'Marş Motoru Tamiri', min: 1000, max: 3500, category: 'Elektrik' },
  { name: 'Far/Lamba Değişimi', min: 200, max: 2000, category: 'Elektrik' },

  // Klima
  { name: 'Klima Gazı Dolumu', min: 500, max: 1500, category: 'Klima' },
  { name: 'Klima Kompresörü Değişimi', min: 3000, max: 8000, category: 'Klima' },
  { name: 'Polen Filtresi Değişimi', min: 200, max: 600, category: 'Klima' },

  // Lastik
  { name: 'Lastik Değişimi (4 Adet)', min: 3000, max: 12000, category: 'Lastik' },
  { name: 'Lastik Balans', min: 200, max: 500, category: 'Lastik' },
  { name: 'Lastik Rotasyon', min: 150, max: 400, category: 'Lastik' },

  // Egzoz
  { name: 'Egzoz Tamiri', min: 500, max: 3000, category: 'Egzoz' },
  { name: 'Katalitik Konvertör', min: 3000, max: 15000, category: 'Egzoz' },

  // Periyodik Bakım
  { name: 'Periyodik Bakım (Küçük)', min: 2000, max: 5000, category: 'Periyodik Bakım' },
  { name: 'Periyodik Bakım (Büyük)', min: 4000, max: 10000, category: 'Periyodik Bakım' },

  // Kaporta / Boya
  { name: 'Boya (Tek Panel)', min: 2000, max: 5000, category: 'Kaporta / Boya' },
  { name: 'Göçük Düzeltme', min: 500, max: 3000, category: 'Kaporta / Boya' },
  { name: 'Cam Değişimi (Ön)', min: 2000, max: 6000, category: 'Kaporta / Boya' },
]

const ALL_CATEGORIES = Array.from(new Set(PRICING_DATA.map(p => p.category)))

// Araç segment çarpanları
const SEGMENT_MULTIPLIERS: Record<string, number> = {
  'Ekonomik': 0.85,
  'Orta Segment': 1.0,
  'Üst Segment': 1.35,
  'Premium / Lüks': 1.65,
}

function formatPrice(value: number): string {
  return Math.round(value).toLocaleString('tr-TR')
}

// ─── Ana Bileşen ────────────────────────────────────────────────

function FiyatHesaplaContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const serviceParam = searchParams.get('service') || ''

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedService, setSelectedService] = useState<PricingItem | null>(null)
  const [segment, setSegment] = useState<string>('Orta Segment')
  const [showAllCategories, setShowAllCategories] = useState(false)

  // URL'den gelen service parametresini eşleştir
  useEffect(() => {
    if (serviceParam) {
      const normalized = serviceParam.toLowerCase()
      const match = PRICING_DATA.find(p =>
        p.name.toLowerCase().includes(normalized) ||
        normalized.includes(p.name.toLowerCase().replace(/\s*\(.*?\)\s*/g, ''))
      )
      if (match) {
        setSelectedService(match)
        setSelectedCategory(match.category)
      } else {
        // Kategori eşleştirme dene
        const catMatch = ALL_CATEGORIES.find(c =>
          normalized.includes(c.toLowerCase()) || c.toLowerCase().includes(normalized)
        )
        if (catMatch) setSelectedCategory(catMatch)
      }
    }
  }, [serviceParam])

  // Filtrelenmiş servisler
  const filteredServices = useMemo(() => {
    let items = PRICING_DATA

    if (selectedCategory) {
      items = items.filter(p => p.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      )
    }

    return items
  }, [selectedCategory, searchQuery])

  // Hesaplanmış fiyat
  const multiplier = SEGMENT_MULTIPLIERS[segment] || 1.0
  const calculatedMin = selectedService ? Math.round(selectedService.min * multiplier) : 0
  const calculatedMax = selectedService ? Math.round(selectedService.max * multiplier) : 0
  const calculatedAvg = selectedService ? Math.round((calculatedMin + calculatedMax) / 2) : 0

  const visibleCategories = showAllCategories ? ALL_CATEGORIES : ALL_CATEGORIES.slice(0, 6)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="mx-auto">

        {/* Geri Butonu */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-th-fg-sub hover:text-th-fg transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri
        </button>

        {/* Başlık */}
        <AnimatedSection>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-4">
              <Calculator className="w-3.5 h-3.5" />
              Ücretsiz Fiyat Tahmini
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-th-fg mb-3">
              Tamir & Bakım Fiyat Hesapla
            </h1>
            <p className="text-sm text-th-fg-sub max-w-xl mx-auto leading-relaxed">
              Aracınız için tahmini tamir ve bakım maliyetlerini öğrenin.
              Gerçek fiyat teklifi almak için yakınızdaki servislere başvurun.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ─── Sol Kolon: Servis Seçimi ────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Arama */}
            <AnimatedSection delay={0.05}>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-muted pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Hizmet ara... (ör: fren, yağ, lastik)"
                  className="w-full bg-th-overlay/5 border border-th-border/15 rounded-2xl pl-10 pr-4 py-3.5 text-sm text-th-fg placeholder:text-th-fg-muted focus:outline-none focus:border-brand-500/40 transition-colors"
                />
              </div>
            </AnimatedSection>

            {/* Kategori Filtreleri */}
            <AnimatedSection delay={0.1}>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setSelectedCategory(''); setSelectedService(null) }}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all',
                    !selectedCategory
                      ? 'bg-brand-500/15 border-brand-500/30 text-brand-400'
                      : 'border-th-border/15 text-th-fg-sub hover:border-th-border/30 hover:text-th-fg'
                  )}
                >
                  Tümü
                </button>
                {visibleCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setSelectedService(null) }}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all',
                      selectedCategory === cat
                        ? 'bg-brand-500/15 border-brand-500/30 text-brand-400'
                        : 'border-th-border/15 text-th-fg-sub hover:border-th-border/30 hover:text-th-fg'
                    )}
                  >
                    {cat}
                  </button>
                ))}
                {ALL_CATEGORIES.length > 6 && (
                  <button
                    onClick={() => setShowAllCategories(v => !v)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-th-border/15 text-th-fg-muted hover:text-th-fg transition-all"
                  >
                    {showAllCategories ? 'Daha Az' : `+${ALL_CATEGORIES.length - 6}`}
                  </button>
                )}
              </div>
            </AnimatedSection>

            {/* Servis Listesi */}
            <AnimatedSection delay={0.15}>
              <div className="space-y-2">
                {filteredServices.length === 0 ? (
                  <div className="glass-card p-8 rounded-2xl text-center">
                    <Search className="w-8 h-8 text-th-fg-muted mx-auto mb-3" />
                    <p className="text-sm text-th-fg-sub">Aramanızla eşleşen hizmet bulunamadı.</p>
                  </div>
                ) : (
                  filteredServices.map(item => (
                    <button
                      key={item.name}
                      onClick={() => setSelectedService(item)}
                      className={cn(
                        'w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group',
                        selectedService?.name === item.name
                          ? 'border-brand-500/40 bg-brand-500/10'
                          : 'border-th-border/10 hover:border-th-border/25 bg-th-overlay/3 hover:bg-th-overlay/5'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                          selectedService?.name === item.name
                            ? 'bg-brand-500/20'
                            : 'bg-th-overlay/10 group-hover:bg-th-overlay/15'
                        )}>
                          <Wrench className={cn(
                            'w-4 h-4',
                            selectedService?.name === item.name ? 'text-brand-400' : 'text-th-fg-muted'
                          )} />
                        </div>
                        <div className="min-w-0">
                          <p className={cn(
                            'text-sm font-medium truncate',
                            selectedService?.name === item.name ? 'text-th-fg' : 'text-th-fg-sub group-hover:text-th-fg'
                          )}>
                            {item.name}
                          </p>
                          <p className="text-[11px] text-th-fg-muted">{item.category}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-sm font-semibold text-gold">
                          {formatPrice(item.min)} - {formatPrice(item.max)} ₺
                        </p>
                        <p className="text-[10px] text-th-fg-muted">referans fiyat</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </AnimatedSection>
          </div>

          {/* ─── Sağ Kolon: Hesaplama Kartı ──────────────────── */}
          <div className="lg:col-span-1">
            <AnimatedSection delay={0.2} direction="left">
              <div className="glass-card p-5 rounded-2xl sticky top-28 space-y-5">
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="w-4.5 h-4.5 text-brand-400" />
                  <h2 className="text-sm font-display font-bold text-th-fg">Fiyat Tahmini</h2>
                </div>

                {/* Seçili Hizmet */}
                {selectedService ? (
                  <>
                    <div className="p-3.5 rounded-xl bg-brand-500/8 border border-brand-500/15">
                      <p className="text-xs text-brand-400 mb-0.5">Seçili Hizmet</p>
                      <p className="text-sm font-semibold text-th-fg">{selectedService.name}</p>
                    </div>

                    {/* Araç Segmenti */}
                    <div>
                      <label className="text-xs text-th-fg-sub block mb-2">Araç Segmenti</label>
                      <div className="relative">
                        <select
                          value={segment}
                          onChange={e => setSegment(e.target.value)}
                          className="w-full appearance-none bg-th-overlay/5 border border-th-border/15 rounded-xl px-3 py-2.5 text-sm text-th-fg focus:outline-none focus:border-brand-500/40 pr-8"
                        >
                          {Object.keys(SEGMENT_MULTIPLIERS).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-th-fg-muted pointer-events-none" />
                      </div>
                    </div>

                    {/* Fiyat Gösterimi */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-th-fg-sub">
                        <span>Minimum</span>
                        <span className="font-semibold text-th-fg">{formatPrice(calculatedMin)} ₺</span>
                      </div>

                      {/* Fiyat Barı */}
                      <div className="relative h-2 rounded-full bg-th-overlay/10 overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-green-500 via-brand-500 to-red-500"
                          style={{ width: '100%' }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-brand-500 shadow-lg"
                          style={{ left: '50%', transform: 'translate(-50%, -50%)' }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-th-fg-sub">
                        <span>Maksimum</span>
                        <span className="font-semibold text-th-fg">{formatPrice(calculatedMax)} ₺</span>
                      </div>
                    </div>

                    {/* Ortalama Fiyat */}
                    <div className="text-center p-4 rounded-xl bg-gold/10 border border-gold/20">
                      <p className="text-xs text-gold/80 mb-1">Tahmini Ortalama</p>
                      <p className="text-3xl font-display font-extrabold text-gold">
                        {formatPrice(calculatedAvg)} ₺
                      </p>
                    </div>

                    {/* Segment Bilgisi */}
                    {segment !== 'Orta Segment' && (
                      <div className="flex items-start gap-2 text-[11px] text-th-fg-muted leading-relaxed">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>
                          {segment === 'Ekonomik'
                            ? 'Ekonomik araçlarda fiyatlar %15 daha düşük olabilir.'
                            : segment === 'Üst Segment'
                            ? 'Üst segment araçlarda fiyatlar %35 daha yüksek olabilir.'
                            : 'Premium/lüks markalarda fiyatlar %65 daha yüksek olabilir.'}
                        </span>
                      </div>
                    )}

                    {/* CTA */}
                    <Link
                      href={`/teklif-al`}
                      className="btn-gold w-full py-3 text-sm font-semibold rounded-xl inline-flex items-center justify-center gap-2"
                    >
                      Gerçek Fiyat Teklifi Al
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <Car className="w-10 h-10 text-th-fg-muted/40 mx-auto mb-3" />
                    <p className="text-sm text-th-fg-sub mb-1">Hizmet Seçin</p>
                    <p className="text-xs text-th-fg-muted leading-relaxed">
                      Soldaki listeden bir hizmet seçerek tahmini fiyatı görüntüleyin.
                    </p>
                  </div>
                )}

                {/* Uyarı */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-th-overlay/5 border border-th-border/10">
                  <Info className="w-3.5 h-3.5 text-th-fg-muted shrink-0 mt-0.5" />
                  <p className="text-[11px] text-th-fg-muted leading-relaxed">
                    Bu fiyatlar 2025 Türkiye piyasa referans değerleridir.
                    Gerçek fiyat; araç markası, modeli, yılı ve servisin konumuna göre değişiklik gösterebilir.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FiyatHesaplaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    }>
      <FiyatHesaplaContent />
    </Suspense>
  )
}
