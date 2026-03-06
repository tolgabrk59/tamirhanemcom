'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, ChevronDown, ChevronUp, Check, AlertTriangle, ArrowRight, BarChart3, MessageCircle } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

interface BrandData {
  brand: string
  score: number
  description: string
  turkishMarketConsensus: string
  pros: string[]
  commonIssues: string[]
}

const reliabilityData: BrandData[] = [
  {
    brand: 'Toyota',
    score: 4.7,
    description: 'Dünyanın en güvenilir markalarından biri. Düşük bakım maliyetleri ve uzun ömürlü mekanik aksamlarıyla bilinir.',
    turkishMarketConsensus: 'Sanayide en az sorun çıkaran marka. Yedek parça bol ve uygun.',
    pros: ['Düşük arıza oranı', 'Ekonomik yedek parça', 'Yüksek ikinci el değeri'],
    commonIssues: ['Pas sorunu (eski modeller)', 'İç mekan kalitesi orta'],
  },
  {
    brand: 'Honda',
    score: 4.5,
    description: 'Motor dayanıklılığı ile ünlü Japon markası. VTEC motorları yüksek performans ve güvenilirlik sunar.',
    turkishMarketConsensus: 'Motoru sağlam, yakıt cimrisi. Ama yedek parça biraz zor bulunur.',
    pros: ['Motor dayanıklılığı', 'Düşük yakıt tüketimi', 'Uzun ömürlü şanzıman'],
    commonIssues: ['Yedek parça bulunabilirliği', 'Elektrik aksamı hassas'],
  },
  {
    brand: 'BMW',
    score: 3.8,
    description: 'Premium sürüş deneyimi sunan Alman markası. Performans odaklı mühendislik, bakım maliyetleri yüksek.',
    turkishMarketConsensus: 'Sürüşü efsane ama cebini yakar. Zincir gergi ve yağ kaçağına dikkat.',
    pros: ['Sürüş dinamikleri', 'Güçlü motor seçenekleri', 'Teknoloji donanımı'],
    commonIssues: ['Zincir gergi sorunu', 'Yağ kaçakları', 'Yüksek bakım maliyeti'],
  },
  {
    brand: 'Mercedes',
    score: 3.9,
    description: 'Konfor ve prestij markası. Yeni nesil modellerde teknoloji yoğun, bakım gereksinimleri arttı.',
    turkishMarketConsensus: 'Konforu rakipsiz ama sanayide pahalı. Özellikle elektronik aksamda sorun çıkabiliyor.',
    pros: ['Üstün konfor', 'Güvenlik teknolojileri', 'Prestij değeri'],
    commonIssues: ['Elektronik arızalar', 'Süspansiyon maliyetleri', 'Yedek parça fiyatları'],
  },
  {
    brand: 'Volkswagen',
    score: 4.0,
    description: 'Alman mühendisliğinin pratik yüzü. DSG şanzıman ve TSI motorlarıyla bilinen, yaygın servis ağına sahip marka.',
    turkishMarketConsensus: 'Sağlam araç ama DSG bakımını ihmal etme. Parça bulmak kolay.',
    pros: ['Sağlam yapı kalitesi', 'Yaygın servis ağı', 'İyi sürüş hissi'],
    commonIssues: ['DSG şanzıman bakımı', 'Turbo aktuatör', 'Yağ tüketimi'],
  },
  {
    brand: 'Renault',
    score: 3.5,
    description: 'Ekonomik ve pratik Fransız markası. Türkiye\'de en yaygın araçlardan, yedek parça bolluğu avantaj.',
    turkishMarketConsensus: 'Ucuz, parçası bol, tamircisi çok. Ama elektrik aksamı ve turbo dikkat ister.',
    pros: ['Ekonomik fiyat', 'Bol yedek parça', 'Geniş servis ağı'],
    commonIssues: ['Elektrik sorunları', 'Turbo arızaları', 'Şanzıman titreşimi'],
  },
  {
    brand: 'Ford',
    score: 3.7,
    description: 'Amerikan mühendisliği, Avrupa tasarımı. EcoBoost motorları verimli ama bazı modellerde sorun çıkabiliyor.',
    turkishMarketConsensus: 'Sağlam şasi, iyi sürüş. PowerShift şanzımandan uzak dur.',
    pros: ['Sağlam şasi', 'İyi yol tutuşu', 'Ekonomik bakım'],
    commonIssues: ['PowerShift şanzıman', 'EcoBoost soğutma', 'Kapı menteşe aşınması'],
  },
  {
    brand: 'Fiat',
    score: 3.3,
    description: 'İtalyan pratikliği ve ekonomisi. Şehir içi kullanımda ideal, bakım maliyetleri düşük ama dayanıklılık orta.',
    turkishMarketConsensus: 'Şehir arabası olarak ideal, ucuz ve pratik. Ama uzun yolda güven vermez.',
    pros: ['Ekonomik fiyat', 'Düşük bakım maliyeti', 'Şehir içi pratiklik'],
    commonIssues: ['Pas sorunu', 'Süspansiyon aşınması', 'Elektrik arızaları'],
  },
]

export default function GuvenilirlikPage() {
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null)

  const getScoreBadge = (score: number) => {
    if (score >= 4.5) return { bg: 'bg-green-500/15 border-green-500/20 text-green-400', bar: 'bg-green-500' }
    if (score >= 4.0) return { bg: 'bg-yellow-500/15 border-yellow-500/20 text-yellow-400', bar: 'bg-yellow-500' }
    if (score >= 3.5) return { bg: 'bg-orange-500/15 border-orange-500/20 text-orange-400', bar: 'bg-orange-500' }
    return { bg: 'bg-red-500/15 border-red-500/20 text-red-400', bar: 'bg-red-500' }
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
              <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Gerçek Piyasa Verileri</span>
              <div className="w-8 h-px bg-brand-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Güvenilirlik <span className="text-gold">Puanları</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto mb-8">
              Türkiye şartlarında en az arıza yapan, sanayi dostu ve uzun ömürlü otomobil markalarını analiz ettik.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="glass-card px-5 py-2.5 inline-flex items-center gap-2">
                <span className="text-brand-500 font-display font-bold text-lg">{reliabilityData.length}</span>
                <span className="text-th-fg-sub text-sm">Marka Analizi</span>
              </div>
              <div className="glass-card px-5 py-2.5 inline-flex items-center gap-2">
                <span className="text-green-400 font-display font-bold text-lg">%100</span>
                <span className="text-th-fg-sub text-sm">Yerel Veri</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Ranking List */}
      <section className="section-container mb-16">
        <div className="space-y-4">
          {reliabilityData.map((brand, index) => {
            const scoreBadge = getScoreBadge(brand.score)
            const isExpanded = expandedBrand === brand.brand

            return (
              <AnimatedSection key={brand.brand} delay={0.05 + index * 0.04}>
                <div className="glass-card overflow-hidden hover:shadow-glow-sm transition-all duration-300">
                  <div
                    className="p-6 md:p-8 cursor-pointer"
                    onClick={() => setExpandedBrand(isExpanded ? null : brand.brand)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      {/* Rank + Brand */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-th-overlay/[0.08] flex items-center justify-center shrink-0">
                          <span className="text-sm font-display font-extrabold text-th-fg">#{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-display font-bold text-th-fg mb-1">{brand.brand}</h3>
                          <p className="text-th-fg-sub text-sm line-clamp-1">{brand.description}</p>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={cn('text-3xl font-display font-extrabold px-4 py-1 rounded-xl border inline-block', scoreBadge.bg)}>
                            {brand.score}
                            <span className="text-xs text-th-fg-muted font-normal ml-1">/ 5</span>
                          </div>
                          <div className="w-full bg-th-overlay/[0.08] rounded-full h-1.5 mt-2">
                            <div
                              className={cn('h-1.5 rounded-full', scoreBadge.bar)}
                              style={{ width: `${(brand.score / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-th-fg-muted" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-th-fg-muted" />
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-th-border/10">
                      <div className="pt-6 grid md:grid-cols-2 gap-6">
                        {/* Market Consensus */}
                        <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/10">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="w-4 h-4 text-brand-500" />
                            <span className="text-xs font-bold text-brand-500 uppercase">TR Piyasa Yorumu</span>
                          </div>
                          <p className="text-sm text-th-fg italic leading-relaxed">"{brand.turkishMarketConsensus}"</p>
                        </div>

                        {/* Pros & Issues */}
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Check className="w-4 h-4 text-green-400" />
                              <h4 className="text-xs font-bold text-green-400 uppercase">Artıları</h4>
                            </div>
                            <ul className="space-y-1">
                              {brand.pros.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-th-fg-sub">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                              <h4 className="text-xs font-bold text-red-400 uppercase">Kronik Sorunlar</h4>
                            </div>
                            <ul className="space-y-1">
                              {brand.commonIssues.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-th-fg-sub">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </section>

      {/* Info Cards */}
      <section className="section-container mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedSection delay={0.1}>
            <div className="glass-card p-6 md:p-8 h-full">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-brand-500" />
                <h3 className="text-xl font-display font-bold text-th-fg">Bu Puanlar Neye Göre Verildi?</h3>
              </div>
              <p className="text-th-fg-sub text-sm leading-relaxed mb-6">
                Puanlamalarımız global verilerin (JD Power, Consumer Reports) yanı sıra Türkiye'deki sanayi ustalarının görüşleri, yedek parça bulunabilirliği ve ikinci el piyasasındaki değer koruma oranları harmanlanarak oluşturulmuştur.
              </p>
              <Link href="/servis-ara" className="text-brand-500 font-semibold text-sm hover:underline inline-flex items-center gap-1">
                Bakım Maliyetlerini Hesapla
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="glass-card p-6 md:p-8 h-full flex flex-col justify-center">
              <h3 className="text-xl font-display font-bold text-th-fg mb-4">Arıza Bildirimi Yapın</h3>
              <p className="text-th-fg-sub text-sm mb-6 leading-relaxed">
                Kendi aracınızda yaşadığınız sorunları paylaşarak bu veritabanının gelişmesine katkıda bulunun.
              </p>
              <button className="btn-gold w-full py-3.5 text-sm" disabled>
                Deneyim Paylaş (Yakında)
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
