'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Wrench,
  Disc,
  Lightbulb,
  Cog,
  Car,
  Snowflake,
  Wind,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

const categories = [
  { id: 'motor', name: 'Motor Sorunları', icon: Wrench, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { id: 'fren', name: 'Fren Sistemi', icon: Disc, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  { id: 'elektrik', name: 'Elektrik', icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  { id: 'sanziman', name: 'Şanzıman', icon: Cog, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { id: 'suspansiyon', name: 'Süspansiyon', icon: Car, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  { id: 'klima', name: 'Klima & Isıtma', icon: Snowflake, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { id: 'egzoz', name: 'Egzoz Sistemi', icon: Wind, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' },
  { id: 'diger', name: 'Diğer', icon: HelpCircle, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
]

const commonSymptoms = [
  { symptom: 'Motor Check Lambası Yanıyor', category: 'motor', severity: 'high' as const, link: '/obd' },
  { symptom: 'Araç Sarsılıyor', category: 'motor', severity: 'medium' as const, link: '/arac' },
  { symptom: 'Fren Sesi Geliyor', category: 'fren', severity: 'high' as const, link: '/arac' },
  { symptom: 'Direksiyon Titriyor', category: 'suspansiyon', severity: 'medium' as const, link: '/arac' },
  { symptom: 'Klima Soğutmuyor', category: 'klima', severity: 'low' as const, link: '/arac' },
  { symptom: 'Vites Geçmiyor', category: 'sanziman', severity: 'high' as const, link: '/arac' },
  { symptom: 'Farlar Yanmıyor', category: 'elektrik', severity: 'medium' as const, link: '/arac' },
  { symptom: 'Egzozdan Duman Çıkıyor', category: 'egzoz', severity: 'high' as const, link: '/arac' },
  { symptom: 'Akü Şarj Olmuyor', category: 'elektrik', severity: 'high' as const, link: '/obd' },
  { symptom: 'Motor Sesi Artıyor', category: 'motor', severity: 'medium' as const, link: '/arac' },
  { symptom: 'Süspansiyon Gıcırdıyor', category: 'suspansiyon', severity: 'low' as const, link: '/arac' },
  { symptom: 'Şanzıman Sarsıntısı', category: 'sanziman', severity: 'medium' as const, link: '/arac' },
]

const severityConfig = {
  high: { label: 'Acil', bg: 'bg-red-500/15 text-red-400 border border-red-500/20' },
  medium: { label: 'Orta', bg: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' },
  low: { label: 'Düşük', bg: 'bg-green-500/15 text-green-400 border border-green-500/20' },
}

export default function BelirtilerPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSymptoms = searchQuery
    ? commonSymptoms.filter((s) => s.symptom.toLowerCase().includes(searchQuery.toLowerCase()))
    : selectedCategory
      ? commonSymptoms.filter((s) => s.category === selectedCategory)
      : commonSymptoms

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-brand-500/50" />
              <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Belirti Rehberi</span>
              <div className="w-8 h-px bg-brand-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Araç Belirtileri <span className="text-gold">Rehberi</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto mb-8">
              Aracınızda gözlemlediğiniz belirtileri seçin, olası arızaları ve çözüm önerilerini öğrenin.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto">
              <div className="glass-card p-2">
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-fg-sub" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        if (e.target.value) setSelectedCategory(null)
                      }}
                      placeholder="Belirti ara... (motor sesi, titreme, duman)"
                      className="input-dark pl-12 text-base py-3.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Categories */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.1}>
          <h2 className="text-lg font-display font-bold text-th-fg mb-6 text-center">
            Kategoriye Göre Ara
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
                  setSearchQuery('')
                }}
                className={cn(
                  'glass-card p-4 text-center transition-all duration-300 hover:-translate-y-0.5',
                  selectedCategory === cat.id && 'border-brand-500/40 shadow-glow-sm bg-brand-500/5'
                )}
              >
                <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center mx-auto mb-2', cat.bg)}>
                  <cat.icon className={cn('w-5 h-5', cat.color)} />
                </div>
                <div className="text-xs font-medium text-th-fg-sub">{cat.name}</div>
              </button>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Symptoms List */}
      <section className="section-container mb-16">
        <AnimatedSection delay={0.15}>
          <h2 className="text-xl font-display font-bold text-th-fg mb-6">
            {searchQuery
              ? `"${searchQuery}" için sonuçlar`
              : selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name + ' Belirtileri'
                : 'Yaygın Belirtiler'}
          </h2>

          {filteredSymptoms.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Search className="w-16 h-16 text-th-fg-muted mx-auto mb-4" />
              <p className="text-th-fg-sub text-sm">Bu kriterlere uygun belirti bulunamadı.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSymptoms.map((symptom, idx) => {
                const cat = categories.find((c) => c.id === symptom.category)
                const sev = severityConfig[symptom.severity]
                return (
                  <Link
                    key={idx}
                    href={symptom.link}
                    className="glass-card p-5 hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      {cat && (
                        <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center', cat.bg)}>
                          <cat.icon className={cn('w-5 h-5', cat.color)} />
                        </div>
                      )}
                      <span className={cn('px-3 py-1 rounded-full text-[10px] font-bold', sev.bg)}>
                        {sev.label}
                      </span>
                    </div>
                    <h3 className="text-base font-display font-bold text-th-fg mb-1 group-hover:text-brand-500 transition-colors">
                      {symptom.symptom}
                    </h3>
                    <p className="text-th-fg-muted text-xs mb-3">
                      {cat?.name}
                    </p>
                    <div className="flex items-center text-brand-500 font-medium text-xs">
                      Detayları Gör
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </AnimatedSection>
      </section>

      {/* CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.2}>
          <div className="glass-card p-8 md:p-12 text-center">
            <Sparkles className="w-10 h-10 text-brand-500 mx-auto mb-4" />
            <h3 className="text-2xl font-display font-extrabold text-th-fg mb-3">
              Belirtinizi Bulamadınız mı?
            </h3>
            <p className="text-th-fg-sub text-sm mb-6 max-w-lg mx-auto">
              AI destekli arıza tespit sistemimizi kullanarak aracınızın sorununu teşhis edin.
            </p>
            <Link href="/arac" className="btn-gold px-8 py-3 text-sm inline-flex">
              AI Arıza Tespiti
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
