'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Wrench,
  Gauge,
  Search,
  Fuel,
  Cog,
  Zap,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

const brands = ['BMW', 'Mercedes', 'Toyota', 'Volkswagen', 'Ford', 'Renault', 'Audi', 'Honda']
const models: Record<string, string[]> = {
  BMW: ['3 Serisi', '5 Serisi', 'X3', 'X5'],
  Mercedes: ['C Serisi', 'E Serisi', 'GLC', 'A Serisi'],
  Toyota: ['Corolla', 'Yaris', 'RAV4', 'Camry'],
  Volkswagen: ['Golf', 'Passat', 'Tiguan', 'Polo'],
  Ford: ['Focus', 'Fiesta', 'Kuga', 'Puma'],
  Renault: ['Clio', 'Megane', 'Kadjar', 'Captur'],
  Audi: ['A3', 'A4', 'Q3', 'Q5'],
  Honda: ['Civic', 'CR-V', 'Jazz', 'HR-V'],
}
const years = Array.from({ length: 25 }, (_, i) => 2024 - i)

type Tab = 'genel' | 'kronik' | 'bakim' | 'artieksi'

const specs = [
  { label: 'Motor', value: '2.0L Turbo', icon: Cog },
  { label: 'Beygir', value: '184 hp', icon: Zap },
  { label: 'Tork', value: '300 Nm', icon: Gauge },
  { label: 'Şanzıman', value: 'Otomatik (8 ileri)', icon: Cog },
  { label: 'Yakıt', value: '7.2L / 100km', icon: Fuel },
  { label: 'Hızlanma', value: '0-100: 7.1 sn', icon: Gauge },
]

const kronikSorunlar = [
  {
    title: 'Zincir Gergi Sorunu',
    description: 'N20 motorlarda yüksek km\'lerde zincir gergi mekanizması aşınıyor. Zamanında müdahale edilmezse motor hasarına yol açabilir.',
    severity: 'Yüksek',
  },
  {
    title: 'Yağ Kaçağı',
    description: 'Vanos solenoidi ve filtre muhafazası civarında yağ sızıntısı görülebilir. Contalar zaman içinde sertleşir.',
    severity: 'Orta',
  },
  {
    title: 'Sürüş Konforu Bozulması',
    description: 'Run-flat lastikler nedeniyle aşınmış lastiklerle sürüş kalitesi belirgin şekilde düşer.',
    severity: 'Düşük',
  },
]

const bakimProgrami = [
  { km: '10.000 km', islem: 'Yağ + Filtre Değişimi', sure: '~45 dk', fiyat: '1.500 - 2.500 TL' },
  { km: '20.000 km', islem: 'Hava + Polen Filtresi', sure: '~30 dk', fiyat: '800 - 1.200 TL' },
  { km: '40.000 km', islem: 'Fren Balata + Disk', sure: '~2 saat', fiyat: '3.000 - 5.000 TL' },
  { km: '60.000 km', islem: 'Şanzıman Yağı', sure: '~1.5 saat', fiyat: '2.500 - 4.000 TL' },
  { km: '80.000 km', islem: 'Buji + Ateşleme Bobini', sure: '~1 saat', fiyat: '2.000 - 3.500 TL' },
]

const artilar = [
  'Güçlü ve verimli motor performansı',
  'Premium iç mekan kalitesi',
  'Gelişmiş sürücü destek sistemleri',
  'Yüksek ikinci el değeri',
  'Sportif sürüş dinamikleri',
]

const eksiler = [
  'Yüksek bakım maliyetleri',
  'Yedek parça fiyatları',
  'Run-flat lastik maliyeti',
  'Bazı modellerde zincir gergi sorunu',
  'Sigortacı onarım maliyetleri',
]

export default function AracPage() {
  const [selectedBrand, setSelectedBrand] = useState('BMW')
  const [selectedModel, setSelectedModel] = useState('3 Serisi')
  const [selectedYear, setSelectedYear] = useState('2022')
  const [showDetails, setShowDetails] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('genel')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'genel', label: 'Genel' },
    { id: 'kronik', label: 'Kronik Sorunlar' },
    { id: 'bakim', label: 'Bakım' },
    { id: 'artieksi', label: 'Artıları / Eksileri' },
  ]

  const handleInspect = () => {
    setShowDetails(true)
    setActiveTab('genel')
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
              Araç <span className="text-gold">Ansiklopedisi</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Aracının teknik detaylarını, kronik sorunlarını ve bakım rehberini incele
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Vehicle Selector */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Marka */}
              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Marka</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value)
                    setSelectedModel(models[e.target.value]?.[0] || '')
                  }}
                  className="input-dark appearance-none cursor-pointer"
                >
                  {brands.map((b) => (
                    <option key={b} value={b} className="bg-th-bg-alt">{b}</option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="input-dark appearance-none cursor-pointer"
                >
                  {(models[selectedBrand] || []).map((m) => (
                    <option key={m} value={m} className="bg-th-bg-alt">{m}</option>
                  ))}
                </select>
              </div>

              {/* Yıl */}
              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Yıl</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="input-dark appearance-none cursor-pointer"
                >
                  {years.map((y) => (
                    <option key={y} value={y} className="bg-th-bg-alt">{y}</option>
                  ))}
                </select>
              </div>

              {/* Button */}
              <div className="flex items-end">
                <button onClick={handleInspect} className="btn-gold w-full py-3.5 text-sm">
                  <Search className="w-4 h-4" />
                  İncele
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Feature Cards */}
      <section className="section-container mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: AlertTriangle,
              title: 'Kronik Sorunlar',
              description: 'Araç modelinize özel bilinen sorunlar',
              count: kronikSorunlar.length,
              color: 'text-red-400',
            },
            {
              icon: Wrench,
              title: 'Bakım Rehberi',
              description: 'Periyodik bakım programı ve tavsiyeleri',
              count: bakimProgrami.length,
              color: 'text-brand-500',
            },
            {
              icon: Gauge,
              title: 'Teknik Özellikler',
              description: 'Motor, şanzıman ve performans verileri',
              count: specs.length,
              color: 'text-blue-400',
            },
          ].map((card, index) => (
            <AnimatedSection key={card.title} delay={0.15 + index * 0.1}>
              <motion.div
                className="glass-card p-6 h-full"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-th-overlay/[0.05]', card.color)}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <span className="badge-gold">{card.count}</span>
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-2">{card.title}</h3>
                <p className="text-sm text-th-fg-sub">{card.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Vehicle Info Section */}
      {showDetails && (
        <section className="section-container">
          <AnimatedSection delay={0.2}>
            <div className="glass-card p-6 md:p-8">
              {/* Vehicle Title */}
              <div className="mb-6">
                <span className="badge-gold mb-3 inline-block">{selectedYear}</span>
                <h2 className="text-2xl font-display font-bold text-th-fg">
                  {selectedBrand} {selectedModel}
                </h2>
              </div>

              <div className="section-divider mb-6" />

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                      activeTab === tab.id
                        ? 'bg-brand-500 text-th-fg-invert'
                        : 'bg-th-overlay/[0.05] text-th-fg-sub hover:text-th-fg hover:bg-th-overlay/[0.08]'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'genel' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="p-4 rounded-xl bg-th-overlay/[0.03] border border-th-border/5"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <spec.icon className="w-4 h-4 text-brand-500" />
                          <span className="text-xs text-th-fg-sub font-medium">{spec.label}</span>
                        </div>
                        <span className="text-lg font-display font-bold text-th-fg">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'kronik' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {kronikSorunlar.map((sorun, index) => (
                    <div
                      key={index}
                      className="p-5 rounded-xl bg-th-overlay/[0.03] border border-th-border/5"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-display font-bold text-th-fg">{sorun.title}</h4>
                        <span
                          className={cn(
                            'text-xs px-3 py-1 rounded-full font-semibold',
                            sorun.severity === 'Yüksek'
                              ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                              : sorun.severity === 'Orta'
                                ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                                : 'bg-green-500/15 text-green-400 border border-green-500/20'
                          )}
                        >
                          {sorun.severity}
                        </span>
                      </div>
                      <p className="text-sm text-th-fg-sub leading-relaxed">{sorun.description}</p>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'bakim' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-th-border/10">
                          <th className="text-left py-3 px-4 text-th-fg-sub font-medium">Kilometre</th>
                          <th className="text-left py-3 px-4 text-th-fg-sub font-medium">İşlem</th>
                          <th className="text-left py-3 px-4 text-th-fg-sub font-medium">Süre</th>
                          <th className="text-left py-3 px-4 text-th-fg-sub font-medium">Tahmini Fiyat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bakimProgrami.map((item, index) => (
                          <tr
                            key={index}
                            className="border-b border-th-border/5 hover:bg-th-overlay/[0.02] transition-colors"
                          >
                            <td className="py-3 px-4">
                              <span className="badge-gold text-[10px]">{item.km}</span>
                            </td>
                            <td className="py-3 px-4 text-th-fg font-medium">{item.islem}</td>
                            <td className="py-3 px-4 text-th-fg-sub">{item.sure}</td>
                            <td className="py-3 px-4 text-brand-500 font-semibold">{item.fiyat}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'artieksi' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Artilar */}
                  <div className="p-5 rounded-xl bg-green-500/5 border border-green-500/10">
                    <div className="flex items-center gap-2 mb-4">
                      <ThumbsUp className="w-5 h-5 text-green-400" />
                      <h4 className="font-display font-bold text-green-400">Artıları</h4>
                    </div>
                    <ul className="space-y-3">
                      {artilar.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-th-fg">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Eksiler */}
                  <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/10">
                    <div className="flex items-center gap-2 mb-4">
                      <ThumbsDown className="w-5 h-5 text-red-400" />
                      <h4 className="font-display font-bold text-red-400">Eksileri</h4>
                    </div>
                    <ul className="space-y-3">
                      {eksiler.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-th-fg">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          </AnimatedSection>
        </section>
      )}
    </div>
  )
}
