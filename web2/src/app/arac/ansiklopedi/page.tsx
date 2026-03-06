'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  Cog,
  Zap,
  Droplets,
  Disc3,
  ArrowUpDown,
  Fuel,
  Wind,
  CircleDot,
  ChevronRight,
  FileText,
  AlertTriangle,
  DollarSign,
  ChevronDown,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import {
  getAllSystems,
  searchEncyclopedia,
  type EncyclopediaSystem,
  type EncyclopediaSubsystem,
} from '@/data/encyclopedia-data'

// ─── İkon Eşleştirme ───────────────────────────────
const iconMap: Record<string, LucideIcon> = {
  engine: Cog,
  brake: Disc3,
  suspension: ArrowUpDown,
  electric: Zap,
  fuel: Fuel,
  cooling: Droplets,
  exhaust: Wind,
  transmission: CircleDot,
}

const colorMap: Record<string, string> = {
  red: 'text-red-400',
  orange: 'text-orange-400',
  blue: 'text-blue-400',
  yellow: 'text-yellow-400',
  green: 'text-green-400',
  cyan: 'text-cyan-400',
  gray: 'text-gray-400',
  purple: 'text-purple-400',
}

function getComponentCount(system: EncyclopediaSystem): number {
  let count = system.components?.length || 0
  if (system.subsystems) {
    for (const sub of system.subsystems) {
      if (sub) count += sub.components.length
    }
  }
  return count
}

export default function EncyclopediaPage() {
  const systems = getAllSystems()
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [expandedSystem, setExpandedSystem] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const searchResults = searchQuery.length >= 2 ? searchEncyclopedia(searchQuery) : []

  const totalComponents = systems.reduce((acc, sys) => acc + getComponentCount(sys), 0)
  const totalSymptoms = systems.reduce((acc, sys) => {
    let count = 0
    if (sys.subsystems) {
      for (const sub of sys.subsystems) {
        if (sub) {
          for (const comp of sub.components) {
            count += comp.symptoms.length
          }
        }
      }
    }
    for (const comp of sys.components) {
      count += comp.symptoms.length
    }
    return acc + count
  }, 0)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-20 lg:pb-24">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-brand-500/50" />
              <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Araç Ansiklopedisi</span>
              <div className="w-8 h-px bg-brand-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Otomotiv Sistemleri <span className="text-gold">Rehberi</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto mb-8">
              Aracınızın tüm sistemleri ve bileşenleri hakkında detaylı bilgi edinin.
              Arıza belirtilerini öğrenin, uzman tamir tavsiyeleri alın.
            </p>

            {/* İstatistikler */}
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="text-3xl font-display font-extrabold text-th-fg">{systems.length}</div>
                <div className="text-sm text-brand-500 font-medium">Ana Sistem</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-extrabold text-th-fg">{totalComponents}</div>
                <div className="text-sm text-brand-500 font-medium">Bileşen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-extrabold text-th-fg">{totalSymptoms}+</div>
                <div className="text-sm text-brand-500 font-medium">Arıza Belirtisi</div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Arama */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.1}>
          <div className="max-w-2xl mx-auto relative" ref={searchRef}>
            <div className="glass-card p-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-fg-sub" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowResults(e.target.value.length >= 2)
                  }}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  placeholder="Sistem, parça veya belirti ara..."
                  className="input-dark pl-12 text-base py-4 w-full"
                />
              </div>
            </div>

            {showResults && searchQuery.length >= 2 && (
              <div className="absolute top-full mt-2 w-full glass-card max-h-96 overflow-y-auto z-50">
                {searchResults.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-th-fg-sub">Sonuç bulunamadı</p>
                    <p className="text-xs text-th-fg-muted mt-1">Farklı bir arama terimi deneyin</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-0.5">
                    <p className="text-[10px] text-th-fg-muted px-3 py-1 font-semibold uppercase tracking-wider">
                      {searchResults.length} sonuç bulundu
                    </p>
                    {searchResults.slice(0, 15).map((result, idx) => {
                      const Icon = iconMap[result.system.icon] || Cog
                      const colorClass = colorMap[result.system.color] || 'text-th-fg-sub'

                      // Eşleşen belirtiyi bul
                      const words = searchQuery.toLowerCase().split(/\s+/).filter(w => w.length >= 2)
                      const matchedSymptom = result.component.symptoms.find(s => {
                        const sl = s.toLowerCase()
                        return words.some(w => sl.includes(w))
                      })

                      return (
                        <Link
                          key={`${result.component.slug}-${idx}`}
                          href={`/arac/ansiklopedi/${result.system.slug}`}
                          onClick={() => setShowResults(false)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-th-overlay/[0.05] transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                            <Icon className={cn('w-5 h-5', colorClass)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            {/* Bileşen adı */}
                            <div className="font-display font-bold text-th-fg text-sm group-hover:text-brand-500 transition-colors">
                              {result.component.name}
                            </div>
                            {/* Eşleşen belirti varsa göster */}
                            {matchedSymptom && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                                <span className="text-xs text-red-400 truncate">Belirti: {matchedSymptom}</span>
                              </div>
                            )}
                            {/* Sistem > Alt sistem yolu */}
                            <div className="text-[11px] text-th-fg-muted truncate mt-0.5">
                              {result.system.name}
                              {result.subsystem && ` → ${result.subsystem.name}`}
                              {result.component.estimatedCost && (
                                <span className="text-brand-500 ml-2">
                                  {result.component.estimatedCost.min.toLocaleString('tr-TR')}-{result.component.estimatedCost.max.toLocaleString('tr-TR')} ₺
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-th-fg-muted group-hover:text-brand-500 transition-colors shrink-0" />
                        </Link>
                      )
                    })}
                    {searchResults.length > 15 && (
                      <p className="text-xs text-th-fg-muted text-center py-2">
                        +{searchResults.length - 15} sonuç daha...
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </AnimatedSection>
      </section>

      {/* Sistemler */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.15}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-px bg-brand-500/50" />
            <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Tüm Sistemler</span>
            <div className="w-8 h-px bg-brand-500/50" />
          </div>
        </AnimatedSection>

        <div className="space-y-4">
          {systems.map((system, index) => {
            const Icon = iconMap[system.icon] || Cog
            const colorClass = colorMap[system.color] || 'text-th-fg-sub'
            const componentCount = getComponentCount(system)
            const subsystems = (system.subsystems || []).filter((s): s is EncyclopediaSubsystem => s !== undefined)
            const isExpanded = expandedSystem === system.id

            return (
              <AnimatedSection key={system.id} delay={0.2 + index * 0.05}>
                <div className="glass-card overflow-hidden">
                  {/* Sistem Başlığı */}
                  <button
                    type="button"
                    onClick={() => setExpandedSystem(isExpanded ? null : system.id)}
                    className="w-full p-6 flex items-center gap-4 group hover:bg-th-overlay/[0.02] transition-colors text-left"
                  >
                    <div className={cn('w-14 h-14 rounded-2xl bg-th-overlay/[0.05] flex items-center justify-center shrink-0', colorClass)}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-display font-bold text-th-fg group-hover:text-brand-500 transition-colors">{system.name}</h3>
                        <span className="badge-gold text-[10px]">{componentCount} Bileşen</span>
                        {subsystems.length > 0 && (
                          <span className="text-[10px] text-th-fg-muted bg-th-overlay/[0.05] px-2 py-0.5 rounded-full">{subsystems.length} Alt Sistem</span>
                        )}
                      </div>
                      <p className="text-sm text-th-fg-sub">{system.description}</p>
                    </div>
                    <ChevronDown className={cn(
                      'w-5 h-5 text-th-fg-muted group-hover:text-brand-500 transition-all shrink-0',
                      isExpanded && 'rotate-180'
                    )} />
                  </button>

                  {/* Alt Sistemler ve Bileşenler */}
                  {isExpanded && subsystems.length > 0 && (
                    <div className="border-t border-th-border/[0.06] px-6 pb-6">
                      {subsystems.map((sub) => (
                        <div key={sub.id} className="mt-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Wrench className="w-4 h-4 text-brand-500" />
                            <h4 className="font-display font-bold text-sm text-th-fg">{sub.name}</h4>
                            <span className="text-[10px] text-th-fg-muted">({sub.components.length} parça)</span>
                          </div>
                          <p className="text-xs text-th-fg-muted mb-3">{sub.description}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {sub.components.map((comp) => (
                              <div
                                key={comp.id}
                                className="group/comp bg-th-overlay/[0.03] border border-th-border/[0.06] rounded-xl p-3 hover:border-brand-500/20 hover:bg-brand-500/[0.03] transition-all"
                              >
                                <h5 className="font-display font-bold text-sm text-th-fg mb-1 group-hover/comp:text-brand-500 transition-colors">
                                  {comp.name}
                                </h5>
                                <p className="text-xs text-th-fg-sub line-clamp-2 mb-2">{comp.description}</p>

                                {/* Belirtiler */}
                                {comp.symptoms.length > 0 && (
                                  <div className="mb-2">
                                    <p className="text-[9px] font-semibold uppercase tracking-wider text-th-fg-muted mb-1">Belirtiler</p>
                                    <div className="flex flex-wrap gap-1">
                                      {comp.symptoms.slice(0, 3).map((symptom, i) => (
                                        <span key={i} className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">
                                          {symptom}
                                        </span>
                                      ))}
                                      {comp.symptoms.length > 3 && (
                                        <span className="text-[10px] text-th-fg-muted">+{comp.symptoms.length - 3}</span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Maliyet */}
                                {comp.estimatedCost && (
                                  <div className="flex items-center justify-between pt-2 border-t border-th-border/[0.04]">
                                    <span className="text-[10px] text-th-fg-muted">Tahmini Maliyet</span>
                                    <span className="text-xs font-semibold text-brand-500">
                                      {comp.estimatedCost.min.toLocaleString('tr-TR')} - {comp.estimatedCost.max.toLocaleString('tr-TR')} ₺
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Direkt bileşenler (subsystem yoksa) */}
                  {isExpanded && subsystems.length === 0 && system.components.length > 0 && (
                    <div className="border-t border-th-border/[0.06] px-6 pb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                        {system.components.map((comp) => (
                          <div
                            key={comp.id}
                            className="group/comp bg-th-overlay/[0.03] border border-th-border/[0.06] rounded-xl p-3 hover:border-brand-500/20 hover:bg-brand-500/[0.03] transition-all"
                          >
                            <h5 className="font-display font-bold text-sm text-th-fg mb-1 group-hover/comp:text-brand-500 transition-colors">
                              {comp.name}
                            </h5>
                            <p className="text-xs text-th-fg-sub line-clamp-2 mb-2">{comp.description}</p>
                            {comp.symptoms.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {comp.symptoms.slice(0, 3).map((symptom, i) => (
                                  <span key={i} className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">
                                    {symptom}
                                  </span>
                                ))}
                                {comp.symptoms.length > 3 && (
                                  <span className="text-[10px] text-th-fg-muted">+{comp.symptoms.length - 3}</span>
                                )}
                              </div>
                            )}
                            {comp.estimatedCost && (
                              <div className="flex items-center justify-between pt-2 mt-2 border-t border-th-border/[0.04]">
                                <span className="text-[10px] text-th-fg-muted">Tahmini Maliyet</span>
                                <span className="text-xs font-semibold text-brand-500">
                                  {comp.estimatedCost.min.toLocaleString('tr-TR')} - {comp.estimatedCost.max.toLocaleString('tr-TR')} ₺
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </section>

      {/* Özellikler */}
      <section className="section-container mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: FileText, title: 'Detaylı Açıklamalar', desc: 'Her sistem ve bileşen için kapsamlı teknik açıklamalar ve çalışma prensipleri', color: 'text-blue-400' },
            { icon: AlertTriangle, title: 'Arıza Teşhisi', desc: 'Yaygın arıza belirtileri, nedenleri ve çözüm önerileri ile hızlı teşhis', color: 'text-red-400' },
            { icon: DollarSign, title: 'Maliyet Tahminleri', desc: 'Tamir ve parça değişim maliyetleri için güncel piyasa fiyat tahminleri', color: 'text-brand-500' },
          ].map((feature, index) => (
            <AnimatedSection key={feature.title} delay={0.3 + index * 0.08}>
              <div className="glass-card p-6 h-full">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-th-overlay/[0.05] mb-4', feature.color)}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-2">{feature.title}</h3>
                <p className="text-sm text-th-fg-sub">{feature.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.4}>
          <div className="glass-card p-8 md:p-12 text-center border-brand-500/20">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-4">
              Aracınız İçin Güvenilir Servis mi Arıyorsunuz?
            </h2>
            <p className="text-th-fg-sub mb-8 max-w-xl mx-auto">
              Binlerce sertifikalı servis arasından size en uygun olanı bulun
            </p>
            <Link
              href="/servis-ara"
              className="btn-gold px-8 py-4 text-sm inline-flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Servis Bul
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
