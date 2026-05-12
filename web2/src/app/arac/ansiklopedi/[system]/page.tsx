'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Cog,
  Zap,
  Droplets,
  Disc3,
  ArrowUpDown,
  Fuel,
  Wind,
  CircleDot,
  Lightbulb,
  Search,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import {
  getSystemBySlug,
  type EncyclopediaSubsystem,
  type EncyclopediaComponent,
} from '@/data/encyclopedia-data'

// ─── İkon & Renk Eşleştirme ────────────────────────
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

const colorBgMap: Record<string, string> = {
  red: 'from-red-500/20 to-red-500/5',
  orange: 'from-orange-500/20 to-orange-500/5',
  blue: 'from-blue-500/20 to-blue-500/5',
  yellow: 'from-yellow-500/20 to-yellow-500/5',
  green: 'from-green-500/20 to-green-500/5',
  cyan: 'from-cyan-500/20 to-cyan-500/5',
  gray: 'from-gray-500/20 to-gray-500/5',
  purple: 'from-purple-500/20 to-purple-500/5',
}

// ─── Bileşen Kartı ──────────────────────────────────
function ComponentCard({ comp }: { comp: EncyclopediaComponent }) {
  return (
    <div className="glass-card p-5 hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300 group">
      <h4 className="font-display font-bold text-th-fg mb-2 group-hover:text-brand-500 transition-colors">
        {comp.name}
      </h4>
      <p className="text-sm text-th-fg-sub line-clamp-2 mb-3">{comp.description}</p>

      {/* İşlev */}
      {comp.function && (
        <p className="text-xs text-th-fg-muted mb-3 line-clamp-2">
          <span className="font-semibold text-brand-500">İşlev:</span> {comp.function}
        </p>
      )}

      {/* Belirtiler */}
      {comp.symptoms.length > 0 && (
        <div className="mb-3">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-th-fg-muted mb-1.5">Arıza Belirtileri</p>
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

      {/* Tamir Tavsiyeleri */}
      {comp.repairAdvice && comp.repairAdvice.length > 0 && (
        <div className="mb-3">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-th-fg-muted mb-1.5">Tamir Önerileri</p>
          <ul className="space-y-0.5">
            {comp.repairAdvice.slice(0, 2).map((advice, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[11px] text-th-fg-sub">
                <Wrench className="w-3 h-3 text-brand-500 mt-0.5 shrink-0" />
                <span className="line-clamp-1">{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alt Bilgi */}
      <div className="flex items-center justify-between pt-3 border-t border-th-border/[0.06]">
        {comp.estimatedCost ? (
          <span className="text-xs font-semibold text-brand-500">
            {comp.estimatedCost.min.toLocaleString('tr-TR')} - {comp.estimatedCost.max.toLocaleString('tr-TR')} ₺
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3 text-[10px] text-th-fg-muted">
          {comp.laborTime && <span>⏱ {comp.laborTime}</span>}
          <span>{comp.symptoms.length} belirti</span>
        </div>
      </div>
    </div>
  )
}

// ─── Ana Sayfa ──────────────────────────────────────
export default function SystemPage() {
  const params = useParams()
  const systemSlug = params.system as string
  const system = getSystemBySlug(systemSlug)

  if (!system) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-display font-extrabold text-th-fg mb-4">Sistem Bulunamadı</h1>
          <p className="text-th-fg-sub mb-6">Aradığınız sistem mevcut değil.</p>
          <Link href="/arac/ansiklopedi" className="btn-gold px-6 py-3 text-sm inline-flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Ansiklopediye Dön
          </Link>
        </div>
      </div>
    )
  }

  const Icon = iconMap[system.icon] || Cog
  const colorClass = colorMap[system.color] || 'text-th-fg-sub'
  const bgGradient = colorBgMap[system.color] || 'from-brand-500/20 to-brand-500/5'

  // Tüm bileşenleri topla
  const subsystems = (system.subsystems || []).filter((s): s is EncyclopediaSubsystem => s !== undefined)
  const allComponents: EncyclopediaComponent[] = []

  for (const sub of subsystems) {
    allComponents.push(...sub.components)
  }
  if (system.components) {
    allComponents.push(...system.components)
  }

  allComponents.sort((a, b) => a.name.localeCompare(b.name, 'tr-TR'))

  return (
    <div className="min-h-screen pt-24 pb-20 lg:pb-24">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Hero */}
      <section className="section-container mb-12">
        <AnimatedSection>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-th-fg-muted mb-6">
            <Link href="/" className="hover:text-brand-500 transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/arac/ansiklopedi" className="hover:text-brand-500 transition-colors">Ansiklopedi</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-th-fg font-medium">{system.name}</span>
          </div>

          <div className={cn('glass-card p-8 md:p-12 bg-gradient-to-br', bgGradient)}>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className={cn('w-20 h-20 rounded-2xl bg-th-overlay/[0.08] flex items-center justify-center shrink-0', colorClass)}>
                <Icon className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-display font-extrabold text-th-fg mb-3">
                  {system.name}
                </h1>
                <p className="text-th-fg-sub text-lg leading-relaxed mb-4">{system.description}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-th-fg-sub">
                    <span className="font-bold text-th-fg">{allComponents.length}</span> Bileşen
                  </div>
                  {subsystems.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-th-fg-sub">
                      <span className="font-bold text-th-fg">{subsystems.length}</span> Alt Sistem
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Alt Sistemler + Bileşenler */}
      {subsystems.length > 0 ? (
        subsystems.map((sub, subIdx) => (
          <section key={sub.id} className="section-container mb-10">
            <AnimatedSection delay={0.1 + subIdx * 0.05}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-brand-500/50" />
                <h2 className="font-display text-xl font-bold text-th-fg">{sub.name}</h2>
                <span className="text-xs text-th-fg-muted bg-th-overlay/[0.05] px-2 py-0.5 rounded-full">
                  {sub.components.length} parça
                </span>
                <div className="flex-1 h-px bg-brand-500/20" />
              </div>
              {sub.description && (
                <p className="text-sm text-th-fg-sub mb-6">{sub.description}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sub.components.map((comp) => (
                  <ComponentCard key={comp.id} comp={comp} />
                ))}
              </div>
            </AnimatedSection>
          </section>
        ))
      ) : system.components.length > 0 ? (
        <section className="section-container mb-10">
          <AnimatedSection delay={0.1}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-brand-500/50" />
              <h2 className="font-display text-xl font-bold text-th-fg">Sistem Bileşenleri</h2>
              <div className="flex-1 h-px bg-brand-500/20" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allComponents.map((comp) => (
                <ComponentCard key={comp.id} comp={comp} />
              ))}
            </div>
          </AnimatedSection>
        </section>
      ) : null}

      {/* Bakım Önerisi */}
      <section className="section-container mb-10">
        <AnimatedSection delay={0.3}>
          <div className="glass-card p-6 md:p-8 bg-gradient-to-r from-brand-500/5 to-brand-500/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center shrink-0">
                <Lightbulb className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-th-fg mb-2">Bakım Önerisi</h3>
                <p className="text-sm text-th-fg-sub leading-relaxed">
                  {system.name} düzenli bakım gerektirir. Arıza belirtilerini erken fark etmek,
                  büyük masrafların önüne geçer. Yukarıdaki bileşenleri inceleyerek detaylı bilgi
                  ve tamir önerilerine ulaşabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.4}>
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="text-2xl font-display font-extrabold text-th-fg mb-4">
              {system.name} İçin Servis mi Arıyorsunuz?
            </h2>
            <p className="text-th-fg-sub mb-6 max-w-xl mx-auto">
              Alanında uzman sertifikalı servislerden teklif alın
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/servis-ara"
                className="btn-gold px-8 py-3.5 text-sm inline-flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Servis Bul
              </Link>
              <Link
                href="/arac/ansiklopedi"
                className="inline-flex items-center gap-2 bg-th-fg/10 text-th-fg px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:bg-th-fg/20"
              >
                <ChevronLeft className="w-4 h-4" />
                Tüm Sistemler
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
