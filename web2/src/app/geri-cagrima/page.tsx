'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, AlertTriangle, ChevronDown, CheckCircle, Shield, Wrench, Calendar } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

interface GeriCagirma {
  id: number
  attributes: {
    kampanya_no: string
    marka: string
    model: string
    yil: number | null
    uretici: string
    bilesen: string
    sikayet: string
    sonuc: string
    cozum: string
    geri_cagirma_tarihi: string | null
    veri_kaynagi: string
  }
}

export default function GeriCagrimaPage() {
  const [markalar, setMarkalar] = useState<string[]>([])
  const [modeller, setModeller] = useState<string[]>([])
  const [yillar, setYillar] = useState<number[]>([])

  const [selectedMarka, setSelectedMarka] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedYil, setSelectedYil] = useState('')

  const [results, setResults] = useState<GeriCagirma[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    const fetchMarkalar = async () => {
      try {
        const res = await fetch('/api/geri-cagirmalar/markalar')
        const data = await res.json()
        setMarkalar(data.markalar || [])
      } catch (error) {
        console.error('Markalar yuklenemedi:', error)
      }
    }
    fetchMarkalar()
  }, [])

  useEffect(() => {
    if (!selectedMarka) {
      setModeller([])
      return
    }
    const fetchModeller = async () => {
      try {
        const res = await fetch(`/api/geri-cagirmalar/modeller?marka=${encodeURIComponent(selectedMarka)}`)
        const data = await res.json()
        setModeller(data.modeller || [])
      } catch (error) {
        console.error('Modeller yuklenemedi:', error)
      }
    }
    fetchModeller()
    setSelectedModel('')
  }, [selectedMarka])

  useEffect(() => {
    if (!selectedMarka || !selectedModel) {
      setYillar([])
      return
    }
    const fetchYillar = async () => {
      try {
        const res = await fetch(`/api/geri-cagirmalar/yillar?marka=${encodeURIComponent(selectedMarka)}&model=${encodeURIComponent(selectedModel)}`)
        const data = await res.json()
        setYillar(data.yillar || [])
      } catch (error) {
        console.error('Yillar yuklenemedi:', error)
      }
    }
    fetchYillar()
    setSelectedYil('')
  }, [selectedMarka, selectedModel])

  const handleSearch = async () => {
    if (!selectedMarka) return
    setLoading(true)
    setSearched(true)
    try {
      const params = new URLSearchParams()
      params.append('marka', selectedMarka)
      if (selectedModel) params.append('model', selectedModel)
      if (selectedYil) params.append('yil', selectedYil)
      const res = await fetch(`/api/geri-cagirmalar?${params.toString()}`)
      const data = await res.json()
      setResults(data.data || [])
    } catch (error) {
      console.error('Arama hatasi:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    try {
      return new Date(dateStr).toLocaleDateString('tr-TR')
    } catch {
      return dateStr
    }
  }

  const steps = [
    { icon: Search, title: 'Kontrol Edin', desc: 'Aracınız için aktif geri çağırma olup olmadığını düzenli olarak kontrol edin.' },
    { icon: Calendar, title: 'Randevu Alın', desc: 'Geri çağırma varsa, yetkili servisten randevu alın. İşlem genellikle ücretsizdir.' },
    { icon: Wrench, title: 'İşlemi Yaptırın', desc: 'Belirlenen tarihte servise giderek gerekli işlemleri yaptırın.' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-brand-500/50" />
              <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">NHTSA Güvenlik Bildirimleri</span>
              <div className="w-8 h-px bg-brand-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Araç Geri <span className="text-gold">Çağırmaları</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Aracınızın güvenliğini sağlayın. Güncel geri çağırma bildirimlerini kontrol edin.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Search Section */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-display font-bold text-th-fg mb-6">
              Aracınız İçin Geri Çağırma Kontrolü
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Marka</label>
                <select
                  value={selectedMarka}
                  onChange={(e) => setSelectedMarka(e.target.value)}
                  className="input-dark appearance-none cursor-pointer"
                >
                  <option value="">Marka Seçin</option>
                  {markalar.map((marka) => (
                    <option key={marka} value={marka} className="bg-th-bg-alt">{marka}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedMarka}
                  className="input-dark appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">Tüm Modeller</option>
                  {modeller.map((model) => (
                    <option key={model} value={model} className="bg-th-bg-alt">{model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-th-fg-sub mb-2 font-medium">Yıl</label>
                <select
                  value={selectedYil}
                  onChange={(e) => setSelectedYil(e.target.value)}
                  disabled={!selectedModel}
                  className="input-dark appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">Tüm Yıllar</option>
                  {yillar.map((yil) => (
                    <option key={yil} value={yil} className="bg-th-bg-alt">{yil}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={!selectedMarka || loading}
                  className="btn-gold w-full py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Search className="w-4 h-4" />
                  {loading ? 'Aranıyor...' : 'Sorgula'}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/10">
              <p className="text-xs text-th-fg-sub">
                <span className="text-brand-500 font-semibold">Kaynak:</span> NHTSA (National Highway Traffic Safety Administration) - ABD Ulusal Karayolu Trafik Güvenliği İdaresi
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Results */}
      {searched && (
        <section className="section-container mb-12">
          <AnimatedSection delay={0.15}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold text-th-fg">
                Sonuçlar
                <span className="ml-2 text-sm font-normal text-th-fg-muted">
                  ({results.length} kayıt bulundu)
                </span>
              </h3>
            </div>

            {results.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-display font-bold text-th-fg mb-2">
                  Geri Çağırma Bulunamadı
                </h4>
                <p className="text-th-fg-sub text-sm">
                  Seçtiğiniz kriterlere uygun geri çağırma kaydı bulunmamaktadır.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((item) => (
                  <div
                    key={item.id}
                    className="glass-card overflow-hidden transition-all duration-300 hover:shadow-glow-sm"
                  >
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs px-3 py-1 rounded-full font-semibold bg-red-500/15 text-red-400 border border-red-500/20">
                              {item.attributes.kampanya_no}
                            </span>
                            <span className="text-th-fg-muted text-sm">
                              {formatDate(item.attributes.geri_cagirma_tarihi)}
                            </span>
                          </div>
                          <h4 className="text-lg font-display font-bold text-th-fg mb-1">
                            {item.attributes.marka} {item.attributes.model} ({item.attributes.yil || '-'})
                          </h4>
                          <p className="text-th-fg-sub text-sm line-clamp-2">
                            {item.attributes.bilesen}
                          </p>
                        </div>
                        <ChevronDown
                          className={cn(
                            'w-5 h-5 text-th-fg-muted transition-transform duration-300',
                            expandedId === item.id && 'rotate-180'
                          )}
                        />
                      </div>
                    </div>

                    {expandedId === item.id && (
                      <div className="px-6 pb-6 border-t border-th-border/10">
                        <div className="pt-4 space-y-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                              <h5 className="font-display font-bold text-th-fg text-sm">Sorun</h5>
                            </div>
                            <p className="text-th-fg-sub text-sm leading-relaxed">
                              {item.attributes.sikayet || '-'}
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                              <h5 className="font-display font-bold text-th-fg text-sm">Olası Sonuçlar</h5>
                            </div>
                            <p className="text-th-fg-sub text-sm leading-relaxed">
                              {item.attributes.sonuc || '-'}
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <h5 className="font-display font-bold text-th-fg text-sm">Çözüm</h5>
                            </div>
                            <p className="text-th-fg-sub text-sm leading-relaxed">
                              {item.attributes.cozum || '-'}
                            </p>
                          </div>

                          <div className="pt-2 flex items-center gap-4 text-xs text-th-fg-muted">
                            <span>Üretici: {item.attributes.uretici}</span>
                            <span>Kaynak: {item.attributes.veri_kaynagi}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </AnimatedSection>
        </section>
      )}

      {/* Info Section */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.2}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-brand-500" />
                <h3 className="text-xl font-display font-bold text-th-fg">Geri Çağırma Nedir?</h3>
              </div>
              <p className="text-th-fg-sub text-sm mb-4 leading-relaxed">
                Araç geri çağırmaları, üretici firmaların güvenlik veya emisyon standartlarına uymayan araçları düzeltmek için yaptığı kampanyalardır. Bu işlemler genellikle ücretsizdir.
              </p>
              <ul className="space-y-2">
                {['Güvenlik riski taşıyan parçaların değişimi', 'Yazılım güncellemeleri', 'Emisyon standartlarına uyum'].map((text, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-th-fg-sub">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 md:p-8">
              <h3 className="text-xl font-display font-bold text-th-fg mb-6">Ne Yapmalısınız?</h3>
              <div className="space-y-5">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                      <step.icon className="w-5 h-5 text-brand-500" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-th-fg text-sm mb-1">{step.title}</h4>
                      <p className="text-th-fg-sub text-xs leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.25}>
          <div className="glass-card p-8 md:p-12 text-center">
            <h3 className="text-2xl font-display font-extrabold text-th-fg mb-3">
              Geri çağırma varsa ne yapmalıyım?
            </h3>
            <p className="text-th-fg-sub text-sm mb-6 max-w-lg mx-auto">
              Aracınız için geri çağırma kampanyası varsa, en yakın yetkili servisi bulun ve randevu alın.
            </p>
            <Link href="/servis-ara" className="btn-gold px-8 py-3 text-sm inline-flex">
              Yetkili Servisleri Bul
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
