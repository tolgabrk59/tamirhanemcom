'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, AlertTriangle, Info, DollarSign, Link2, Cpu, Car, Shield, Wifi } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

interface OBDCode {
  code: string
  title: string
  severity: 'Yüksek' | 'Orta' | 'Düşük'
  description: string
  causes: string[]
  symptoms: string[]
  costRange: string
  relatedCodes: string[]
}

const popularCodes: { code: string; shortDesc: string }[] = [
  { code: 'P0300', shortDesc: 'Çoklu Ateşleme Hatası' },
  { code: 'P0171', shortDesc: 'Yakıt Karışımı Zayıf' },
  { code: 'P0420', shortDesc: 'Katalizör Verimi Düşük' },
  { code: 'P0442', shortDesc: 'Buharlaşmalı Emisyon Kaçağı' },
  { code: 'P0455', shortDesc: 'Büyük EVAP Kaçağı' },
  { code: 'P0128', shortDesc: 'Termostat Arıza' },
  { code: 'P0301', shortDesc: '1. Silindir Ateşleme' },
  { code: 'P0016', shortDesc: 'Kam Mili Konum' },
]

const sampleCodeData: Record<string, OBDCode> = {
  P0300: {
    code: 'P0300',
    title: 'Rastgele/Çoklu Silindir Ateşleme Hatası',
    severity: 'Yüksek',
    description:
      'Bu kod, motorun bir veya birden fazla silindirinde düzensiz ateşleme meydana geldiğini gösterir. ECU, krank mili konum sensöründen gelen verilerde düzensizlik tespit ettiğinde bu kodu kaydeder. Uzun süreli ihmal edilirse katalitik konvertöre hasar verebilir.',
    causes: [
      'Ateşleme bobini arızası veya aşınması',
      'Buji aşınması veya hatalı aralık',
      'Yakıt enjektörü tıkanıklığı veya sızıntısı',
      'Yakıt pompası basınç düşüşü',
      'Vakum kaçağı',
    ],
    symptoms: [
      'Motor titremesi ve düzensiz rölanti',
      'Güç kaybı ve ivmelenme sorunları',
      'Yakıt tüketiminde belirgin artış',
      'Egzozdan düzensiz ses ve koku',
      'Motor kontrol lambası yanıp sönme',
    ],
    costRange: '500 TL - 3,000 TL',
    relatedCodes: ['P0301', 'P0302', 'P0303'],
  },
  P0171: {
    code: 'P0171',
    title: 'Yakıt Sistemi Zayıf Karışım (Bank 1)',
    severity: 'Orta',
    description:
      'Motor kontrol ünitesi, yakıt karışımının olması gerekenden daha zayıf (fazla hava, az yakıt) olduğunu tespit etmiştir. Uzun vadede motor hasarına neden olabilir.',
    causes: [
      'Vakum kaçağı',
      'Kirli veya arızalı MAF sensörü',
      'Zayıf yakıt pompası',
      'Tıkanmış yakıt filtresi',
      'Arızalı oksijen sensörü',
    ],
    symptoms: [
      'Düzensiz rölanti',
      'Güç kaybı',
      'Motor sarsıntısı',
      'Yakıt tüketimi değişikliği',
    ],
    costRange: '300 TL - 2,500 TL',
    relatedCodes: ['P0174', 'P0300', 'P0172'],
  },
  P0420: {
    code: 'P0420',
    title: 'Katalizör Sistemi Verimi Eşik Altında (Bank 1)',
    severity: 'Orta',
    description:
      'Katalitik konvertörün verimi, kabul edilebilir eşik değerinin altına düşmüştür. Bu genellikle katalizörün aşındığını veya arızalandığını gösterir.',
    causes: [
      'Aşınmış katalitik konvertör',
      'Arızalı oksijen sensörü',
      'Egzoz kaçağı',
      'Motor ateşleme sorunu',
    ],
    symptoms: [
      'Motor kontrol lambası',
      'Egzoz kokusu',
      'Emisyon testinde başarısızlık',
      'Hafif güç kaybı',
    ],
    costRange: '2,000 TL - 8,000 TL',
    relatedCodes: ['P0421', 'P0430', 'P0300'],
  },
}

const obdCategories = [
  {
    letter: 'P',
    name: 'Powertrain',
    description: 'Motor ve şanzıman ile ilgili arıza kodları',
    icon: Car,
    count: '3000+',
  },
  {
    letter: 'C',
    name: 'Chassis',
    description: 'Şasi, fren, direksiyon ve süspansiyon kodları',
    icon: Shield,
    count: '1000+',
  },
  {
    letter: 'B',
    name: 'Body',
    description: 'Gövde, kapı, koltuk ve klima sistemleri',
    icon: Cpu,
    count: '1500+',
  },
  {
    letter: 'U',
    name: 'Network',
    description: 'İletişim ve ağ protokol hata kodları',
    icon: Wifi,
    count: '800+',
  },
]

export default function OBDPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCode, setSelectedCode] = useState<OBDCode | null>(sampleCodeData['P0300'])

  const handleSearch = () => {
    const upper = searchQuery.toUpperCase().trim()
    if (sampleCodeData[upper]) {
      setSelectedCode(sampleCodeData[upper])
    }
  }

  const handleCodeClick = (code: string) => {
    if (sampleCodeData[code]) {
      setSelectedCode(sampleCodeData[code])
      setSearchQuery(code)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              OBD Kod <span className="text-gold">Merkezi</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Aracınızdaki arıza kodlarını anlayın, olası nedenleri ve çözümleri keşfet.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Search Section */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-fg-sub" />
                <input
                  type="text"
                  placeholder="OBD kodu girin... P0300, P0171, C0035..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="input-dark pl-12 text-base py-4"
                />
              </div>
              <button onClick={handleSearch} className="btn-gold px-10 py-4 text-sm shrink-0">
                <Search className="w-4 h-4" />
                Ara
              </button>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Popular Codes */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.15}>
          <h2 className="text-xl font-display font-bold text-th-fg mb-6">
            Sık Aranan Kodlar
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {popularCodes.map((item) => (
              <motion.button
                key={item.code}
                onClick={() => handleCodeClick(item.code)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'glass-card px-5 py-3 shrink-0 text-left transition-all duration-200',
                  selectedCode?.code === item.code && 'border-brand-500/40 shadow-glow-sm'
                )}
              >
                <span className="text-sm font-display font-bold text-brand-500 block">
                  {item.code}
                </span>
                <span className="text-xs text-th-fg-sub whitespace-nowrap">
                  {item.shortDesc}
                </span>
              </motion.button>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Code Detail */}
      {selectedCode && (
        <section className="section-container mb-12">
          <AnimatedSection delay={0.2}>
            <div className="glass-card p-6 md:p-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <span className="text-4xl md:text-5xl font-display font-extrabold text-gold">
                  {selectedCode.code}
                </span>
                <div>
                  <h2 className="text-xl font-display font-bold text-th-fg mb-1">
                    {selectedCode.title}
                  </h2>
                  <span
                    className={cn(
                      'text-xs px-3 py-1 rounded-full font-semibold inline-block',
                      selectedCode.severity === 'Yüksek'
                        ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                        : selectedCode.severity === 'Orta'
                          ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                          : 'bg-green-500/15 text-green-400 border border-green-500/20'
                    )}
                  >
                    {selectedCode.severity} Öncelik
                  </span>
                </div>
              </div>

              <div className="section-divider mb-6" />

              {/* Açıklama */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-brand-500" />
                  <h3 className="text-lg font-display font-bold text-th-fg">Açıklama</h3>
                </div>
                <p className="text-th-fg leading-relaxed text-sm">
                  {selectedCode.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Olası Nedenler */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="text-lg font-display font-bold text-th-fg">Olası Nedenler</h3>
                  </div>
                  <ol className="space-y-2.5">
                    {selectedCode.causes.map((cause, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-th-fg">
                        <span className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        {cause}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Belirtiler */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-display font-bold text-th-fg">Belirtiler</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {selectedCode.symptoms.map((symptom, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-th-fg">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tahmini Maliyet */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-brand-500" />
                  <h3 className="text-lg font-display font-bold text-th-fg">Tahmini Maliyet</h3>
                </div>
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-th-fg-sub text-sm">Onarım maliyet aralığı</span>
                    <span className="text-2xl font-display font-bold text-gold">
                      {selectedCode.costRange}
                    </span>
                  </div>
                  <p className="text-xs text-th-fg-muted mt-2">
                    * Fiyatlar servise, bölgeye ve araç modeline göre değişiklik gösterebilir.
                  </p>
                </div>
              </div>

              {/* Related Codes */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Link2 className="w-5 h-5 text-brand-500" />
                  <h3 className="text-lg font-display font-bold text-th-fg">İlişkili Kodlar</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedCode.relatedCodes.map((code) => (
                    <motion.button
                      key={code}
                      onClick={() => handleCodeClick(code)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl border border-brand-500/20 bg-brand-500/5 text-brand-500 text-sm font-semibold hover:bg-brand-500/10 hover:border-brand-500/40 transition-all"
                    >
                      {code}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* OBD Categories */}
      <section className="section-container py-24">
        <AnimatedSection delay={0.1}>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-th-fg mb-3">
              OBD Kod <span className="text-gold">Kategorileri</span>
            </h2>
            <p className="text-th-fg-sub text-sm">
              OBD-II standardı dört ana kategoriden oluşmaktadır
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {obdCategories.map((cat, index) => (
            <AnimatedSection key={cat.letter} delay={0.15 + index * 0.08}>
              <motion.div
                className="glass-card p-6 text-center h-full"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-display font-extrabold text-gold">
                    {cat.letter}
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-1">{cat.name}</h3>
                <p className="text-xs text-th-fg-sub mb-3">{cat.description}</p>
                <span className="badge-gold text-[10px]">{cat.count} kod</span>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </div>
  )
}
