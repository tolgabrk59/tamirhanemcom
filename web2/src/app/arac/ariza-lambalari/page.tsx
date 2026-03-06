'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  AlertTriangle,
  Info,
  ChevronRight,
  CircleAlert,
  Lightbulb,
  HelpCircle,
  Calendar,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

interface WarningLight {
  id: string
  name: string
  category: 'red' | 'yellow' | 'green' | 'blue'
  description: string
  action: string
}

const warningLights: WarningLight[] = [
  { id: 'engine-oil', name: 'Motor Yagi Basinci', category: 'red', description: 'Motor yagi basincinin dusuk oldugunu gosterir.', action: 'Araci hemen durdurun ve yag seviyesini kontrol edin.' },
  { id: 'brake-system', name: 'Fren Sistemi', category: 'red', description: 'Fren hidroligi dusuk, fren balatalari asinmis veya fren sisteminde sorun var.', action: 'El freni kapaliysa ve lamba yaniyorsa hemen en yakin servise gidin.' },
  { id: 'engine-temp', name: 'Motor Sicakligi', category: 'red', description: 'Motor asiri isiniyor. Dusuk antifriz seviyesi veya termostat arizasi olabilir.', action: 'Araci guvenli bir yere cekin ve motoru kapatin.' },
  { id: 'battery', name: 'Aku / Sarj Sistemi', category: 'red', description: 'Sarj sisteminde sorun var, aku duzgun sarj olmuyor.', action: 'Gereksiz elektrikli cihazlari kapatin ve en yakin servise gidin.' },
  { id: 'airbag', name: 'Airbag / SRS', category: 'red', description: 'Hava yastigi sisteminde ariza tespit edildi.', action: 'Guvenliginiz icin en kisa surede servise goturun.' },
  { id: 'power-steering', name: 'Direksiyon Sistemi', category: 'red', description: 'Hidrolik veya elektrikli direksiyon sisteminde ariza.', action: 'Dikkatli surun ve en yakin servise gidin.' },
  { id: 'seatbelt', name: 'Emniyet Kemeri', category: 'red', description: 'Surucu veya yolcularin emniyet kemeri takili degil.', action: 'Tum yolcularin emniyet kemerlerini taktigindan emin olun.' },
  { id: 'coolant-level', name: 'Antifriz Seviyesi', category: 'red', description: 'Motor sogutma sivisi seviyesi cok dusuk.', action: 'Motoru durdurun, sogumasini bekleyin ve antifriz seviyesini kontrol edin.' },

  { id: 'check-engine', name: 'Motor Ariza (Check Engine)', category: 'yellow', description: 'Motor veya emisyon sisteminde sorun algilandi.', action: 'Yanip sonuyorsa acil, sabit yaniyorsa yakin zamanda servise gidin.' },
  { id: 'tpms', name: 'Lastik Basinci (TPMS)', category: 'yellow', description: 'Bir veya daha fazla lastik basinci onerilen seviyenin altinda.', action: 'Lastik basinçlarini kontrol edin ve onerilen seviyeye getirin.' },
  { id: 'abs', name: 'ABS (Kilitlenme Onleyici)', category: 'yellow', description: 'ABS sisteminde ariza var. Normal fren calisir ama kilitlenme onleme devre disi.', action: 'Dikkatli surun, ozellikle kaygan zeminlerde.' },
  { id: 'traction-control', name: 'Traction Control / ESP', category: 'yellow', description: 'Traksiyon veya stabilite kontrol sisteminde sorun.', action: 'Sabit yaniyorsa sistem devre disi.' },
  { id: 'dpf', name: 'DPF (Dizel Partikul Filtresi)', category: 'yellow', description: 'Dizel araclarda partikul filtresi kurum ile tikanmis.', action: 'Yuksek devirde uzun yol yaparak filtrenin temizlenmesini saglayin.' },
  { id: 'fuel-low', name: 'Dusuk Yakit', category: 'yellow', description: 'Yakit deposu dusuk seviyede.', action: 'En yakin benzin istasyonunda yakit doldurun.' },
  { id: 'service', name: 'Servis Uyarisi', category: 'yellow', description: 'Planli bakim zamani geldi veya bakim gerekiyor.', action: 'Arac bakim planini kontrol edin ve gerekli bakimlari yaptirin.' },
  { id: 'oil-change', name: 'Yag Degisimi', category: 'yellow', description: 'Motor yagi degisim zamani geldi.', action: 'Motor yagi ve yag filtresi degisimi yaptirin.' },
  { id: 'bulb-failure', name: 'Ampul Arizasi', category: 'yellow', description: 'Bir veya daha fazla dis aydinlatma lambasi yanmiyor.', action: 'Tum dis lambalari kontrol edin ve yanmayan ampulu degistirin.' },

  { id: 'headlights', name: 'Kisa Farlar', category: 'green', description: 'Dusuk farlar (kisa farlar) acik.', action: 'Bilgilendirme amacli - farlariniz acik.' },
  { id: 'cruise-control', name: 'Hiz Sabitleyici', category: 'green', description: 'Cruise control sistemi aktif.', action: 'Fren veya debriyaja basarak sistemi devre disi birakabilirsiniz.' },
  { id: 'eco-mode', name: 'Eco Modu', category: 'green', description: 'Ekonomik surus modu aktif.', action: 'Normal surus icin modu kapatabilirsiniz.' },
  { id: 'start-stop', name: 'Start/Stop Sistemi', category: 'green', description: 'Otomatik motor durdurma/calistirma sistemi aktif.', action: 'Trafik isiklarinda motor otomatik olarak duracak.' },

  { id: 'high-beam', name: 'Uzun Far', category: 'blue', description: 'Uzun farlar (yuksek huzme) aktif.', action: 'Karsi trafikte kapatmayi unutmayin.' },
]

const categoryInfo = {
  red: { name: 'Kirmizi - Acil', desc: 'Ciddi ve potansiyel olarak tehlikeli sorunlar.', dotColor: 'bg-red-500', textColor: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' },
  yellow: { name: 'Sari - Dikkat', desc: 'Acil olmayan ama kontrol edilmesi gereken sorunlar.', dotColor: 'bg-amber-500', textColor: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20' },
  green: { name: 'Yesil - Bilgi', desc: 'Bir sistemin duzgun calistigini gosterir.', dotColor: 'bg-green-500', textColor: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20' },
  blue: { name: 'Mavi - Bilgi', desc: 'Belirli bir ozelligin aktif oldugunu gosterir.', dotColor: 'bg-blue-500', textColor: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
}

const faqs = [
  { q: 'Ariza lambasi yandiginda ne yapmaliyim?', a: 'Oncelikle lambanin rengine bakin. Kirmizi ise araci guvenli bir yerde durdurun. Sari/turuncu ise dikkatli surmeye devam edip en kisa surede servise gidin.' },
  { q: 'Check Engine lambasi yanip sonuyorsa ne anlama gelir?', a: 'Yanip sonen Check Engine lambasi genellikle motor ateslemesinde ciddi bir sorun oldugunu gosterir. Araci sert kullanmayin ve en kisa surede servise ulasin.' },
  { q: 'Birden fazla lamba ayni anda yanarsa ne yapmaliyim?', a: 'Birden fazla uyari lambasi ayni anda yaniyorsa, bu genellikle elektrik sistemi veya aku ile ilgili bir soruna isaret eder.' },
]

export default function ArizaLambalariPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredLights = useMemo(() => {
    return warningLights.filter((light) => {
      const matchesSearch =
        light.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        light.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || light.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const groupedLights = useMemo(() => {
    const groups: Record<string, WarningLight[]> = { red: [], yellow: [], green: [], blue: [] }
    filteredLights.forEach((light) => {
      if (groups[light.category]) groups[light.category].push(light)
    })
    return groups
  }, [filteredLights])

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Header */}
      <section className="section-container mb-8">
        <AnimatedSection>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-brand-500/50" />
              <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Ariza Lambalari</span>
              <div className="w-8 h-px bg-brand-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Arac Ariza <span className="text-gold">Lambalari</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Gosterge panelindeki uyari lambalarinin anlamlarini ogrenin.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Search */}
      <section className="section-container mb-8">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-4 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-fg-sub" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Lamba adi veya aciklama ile ara..."
                className="input-dark pl-12 py-4 w-full"
              />
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Category Filter */}
      <section className="section-container mb-8">
        <AnimatedSection delay={0.15}>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                !selectedCategory ? 'bg-brand-500 text-th-fg-invert' : 'bg-th-overlay/[0.05] text-th-fg-sub hover:text-th-fg'
              )}
            >
              Tumu
            </button>
            {(Object.keys(categoryInfo) as Array<keyof typeof categoryInfo>).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={cn(
                  'px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
                  selectedCategory === key
                    ? 'bg-brand-500 text-th-fg-invert'
                    : 'bg-th-overlay/[0.05] text-th-fg-sub hover:text-th-fg'
                )}
              >
                <span className={cn('w-2.5 h-2.5 rounded-full', categoryInfo[key].dotColor)} />
                {categoryInfo[key].name.split(' - ')[0]}
              </button>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Color Guide */}
      <section className="section-container mb-10">
        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.entries(categoryInfo) as [keyof typeof categoryInfo, typeof categoryInfo[keyof typeof categoryInfo]][]).map(([key, info]) => (
              <div key={key} className={cn('glass-card p-5 text-center', info.borderColor)}>
                <div className={cn('w-10 h-10 rounded-full mx-auto mb-3', info.dotColor, 'opacity-80')} />
                <h3 className={cn('font-display font-bold text-sm mb-1', info.textColor)}>{info.name.split(' - ')[0]}</h3>
                <p className="text-xs text-th-fg-sub">{info.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Warning Lights Grid */}
      <section className="section-container mb-12">
        {filteredLights.length === 0 ? (
          <AnimatedSection>
            <div className="text-center py-16">
              <HelpCircle className="w-12 h-12 text-th-fg-muted mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-th-fg mb-2">Sonuc Bulunamadi</h3>
              <p className="text-th-fg-sub">"{searchQuery}" icin ariza lambasi bulunamadi.</p>
            </div>
          </AnimatedSection>
        ) : (
          <div className="space-y-10">
            {(Object.entries(groupedLights) as [keyof typeof categoryInfo, WarningLight[]][]).map(([category, lights]) => {
              if (lights.length === 0) return null
              const info = categoryInfo[category]

              return (
                <AnimatedSection key={category} delay={0.25}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className={cn('w-3 h-3 rounded-full', info.dotColor)} />
                    <h2 className={cn('text-xl font-display font-bold', info.textColor)}>{info.name}</h2>
                    <span className="badge-gold text-[10px]">{lights.length} lamba</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lights.map((light) => (
                      <div
                        key={light.id}
                        className={cn('glass-card p-5 hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300', info.borderColor)}
                      >
                        <div className="flex items-start gap-3">
                          <CircleAlert className={cn('w-8 h-8 shrink-0', info.textColor)} />
                          <div className="flex-1">
                            <h3 className="font-display font-bold text-th-fg mb-2">{light.name}</h3>
                            <p className="text-sm text-th-fg-sub mb-3">{light.description}</p>
                            <div className={cn('rounded-lg p-3', info.bgColor, info.borderColor, 'border')}>
                              <p className="text-sm flex items-start gap-2">
                                <Info className={cn('w-4 h-4 shrink-0 mt-0.5', info.textColor)} />
                                <span className="text-th-fg text-xs">{light.action}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.3}>
          <div className="glass-card p-8 text-center border-brand-500/20">
            <Lightbulb className="w-10 h-10 text-brand-500 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-extrabold text-th-fg mb-3">Ariza Lambaniz mi Yandi?</h2>
            <p className="text-th-fg-sub mb-6 max-w-lg mx-auto">
              Uyari lambasi yanan araciniz icin hemen randevu alin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/randevu" className="btn-gold px-8 py-3 text-sm inline-flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Randevu Al
              </Link>
              <Link href="/obd" className="px-8 py-3 rounded-xl border border-brand-500/20 bg-brand-500/5 text-brand-500 text-sm font-semibold hover:bg-brand-500/10 transition-all inline-flex items-center gap-2">
                <Search className="w-4 h-4" />
                OBD Kodlarini Incele
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* FAQ */}
      <section className="section-container">
        <AnimatedSection delay={0.35}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-px bg-brand-500/50" />
            <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Sikca Sorulan Sorular</span>
            <div className="w-8 h-px bg-brand-500/50" />
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-card p-6">
                <h3 className="font-display font-bold text-th-fg mb-2">{faq.q}</h3>
                <p className="text-sm text-th-fg-sub leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
