'use client'

import { useState, useEffect } from 'react'
import {
  ArrowRight, Loader2, ChevronDown,
  Wrench, Cog, Zap, Paintbrush, Circle, Thermometer, CircleDot, Wind,
  Droplets, ShieldCheck, Car, Battery, Gauge, Fuel, Radio, Eye,
  Hammer, Settings, Disc, Lightbulb, Snowflake, Flame, Lock,
  ScanLine, Layers, Package, Sparkles, SquareStack,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// ─── Kategori → İkon eşleştirmesi ─────────────────
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  // Bakım & Onarım
  'periyodik bakım': Wrench,
  'bakım': Wrench,
  'motor': Cog,
  'motor tamir': Cog,
  'mekanik': Settings,
  'mekanik onarım': Settings,
  // Elektrik & Elektronik
  'elektrik': Zap,
  'elektronik': Zap,
  'akü': Battery,
  'aydınlatma': Lightbulb,
  // Dış Görünüm
  'boya': Paintbrush,
  'kaporta': Paintbrush,
  'boya / kaporta': Paintbrush,
  'boya/kaporta': Paintbrush,
  'cam': Eye,
  'cam filmi': Eye,
  'detaylı temizlik': Sparkles,
  // Lastik & Fren
  'lastik': Circle,
  'fren': CircleDot,
  'rot balans': Disc,
  'balans': Disc,
  // İklimlendirme
  'klima': Snowflake,
  'kalorifer': Flame,
  'ısıtma': Flame,
  // Egzoz & Yakıt
  'egzoz': Wind,
  'yakıt': Fuel,
  'lpg': Fuel,
  // Yıkama
  'oto yıkama': Droplets,
  'yıkama': Droplets,
  'dış yıkama': Droplets,
  'iç yıkama': Droplets,
  // Güvenlik & Sigorta
  'sigorta': ShieldCheck,
  'oto sigorta': ShieldCheck,
  'kilit': Lock,
  'alarm': Lock,
  'immobilizer': Lock,
  // Araç Hizmetleri
  'kiralama': Car,
  'oto kiralama': Car,
  'oto sanayi': Hammer,
  'muayene': ScanLine,
  'ekspertiz': ScanLine,
  // Ses & Multimedya
  'ses sistemi': Radio,
  'multimedya': Radio,
  // Diğer
  'suspensiyon': Gauge,
  'şanzıman': Layers,
  'yedek parça': Package,
  '2.el parça': Package,
  'aksesuar': SquareStack,
}

function getCategoryIcon(name: string): LucideIcon {
  const normalized = name.toLowerCase().trim()
  // Tam eşleşme
  if (CATEGORY_ICON_MAP[normalized]) return CATEGORY_ICON_MAP[normalized]
  // Kısmi eşleşme
  for (const [key, icon] of Object.entries(CATEGORY_ICON_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) return icon
  }
  return Wrench // varsayılan
}

// ─── 3 satır = mobil 6, tablet 9, desktop 12 ─────
const ROWS = 2
const INITIAL_COUNTS = { mobile: 2 * ROWS, tablet: 3 * ROWS, desktop: 4 * ROWS }

interface CategoryData {
  id: number
  name: string
  slug: string
  description: string
  category_type: string | null
  service_count: number
}

export default function Categories() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          const sorted = [...data.data]
            .sort((a: CategoryData, b: CategoryData) => b.service_count - a.service_count)
          setCategories(sorted)
        } else {
          setError('Kategoriler yüklenemedi')
        }
      })
      .catch(() => setError('Kategoriler yüklenemedi'))
      .finally(() => setLoading(false))
  }, [])

  const buildHref = (cat: CategoryData) => {
    const params = new URLSearchParams()
    params.set('kategori', cat.name)
    if (cat.category_type) params.set('tip', cat.category_type)
    return `/servis-ara?${params.toString()}`
  }

  // Desktop'ta 12, ama tüm breakpoint'ler için en büyüğü al
  const initialCount = INITIAL_COUNTS.desktop
  const visibleCategories = showAll ? categories : categories.slice(0, initialCount)
  const hasMore = categories.length > initialCount

  return (
    <section className="relative py-24 md:py-32">
      <div className="section-container">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-brand-500/50" />
            <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">
              Kategoriler
            </span>
            <div className="w-8 h-px bg-brand-500/50" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4">
            Hizmet <span className="text-gold">Kategorileri</span>
          </h2>
          <p className="text-th-fg text-lg max-w-xl mx-auto">
            Aracın için ihtiyacın olan her türlü hizmet, tek bir platformda
          </p>
        </AnimatedSection>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-th-fg-muted">{error}</p>
          </div>
        )}

        {/* Category Grid */}
        {!loading && !error && categories.length > 0 && (
          <>
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              <AnimatePresence initial={false}>
                {visibleCategories.map((category, idx) => {
                  const Icon = getCategoryIcon(category.name)
                  return (
                    <motion.div
                      key={category.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: idx >= initialCount ? (idx - initialCount) * 0.04 : 0 }}
                    >
                      <AnimatedSection
                        delay={idx < initialCount ? idx * 0.05 : 0}
                        className="group h-full"
                      >
                        <Link
                          href={buildHref(category)}
                          className={cn(
                            'glass-card p-6 md:p-8 block h-full',
                            'transition-all duration-300',
                            'hover:-translate-y-1 hover:shadow-glow-sm'
                          )}
                        >
                          {/* Icon */}
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-brand-500/10 border border-brand-500/15 flex items-center justify-center mb-5 group-hover:bg-brand-500/20 transition-colors duration-300">
                            <Icon className="w-6 h-6 md:w-7 md:h-7 text-brand-500" />
                          </div>

                          {/* Name */}
                          <h3 className="font-display font-bold text-base md:text-lg mb-2 text-th-fg">
                            {category.name}
                          </h3>

                          {/* Description */}
                          {category.description && (
                            <p className="text-th-fg-sub text-sm leading-relaxed mb-4 line-clamp-2">
                              {category.description}
                            </p>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-3 border-t border-th-border/[0.06]">
                            <span className="text-xs text-th-fg-muted">
                              {category.service_count} servis
                            </span>
                            <div className="flex items-center text-brand-500/0 group-hover:text-brand-500 transition-all duration-300">
                              <ArrowRight className="w-4 h-4 -translate-x-2 group-hover:translate-x-0 transition-transform duration-300" />
                            </div>
                          </div>
                        </Link>
                      </AnimatedSection>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>

            {/* Tüm Kategoriler Butonu */}
            {hasMore && (
              <AnimatedSection delay={0.3} className="flex justify-center mt-10">
                <button
                  type="button"
                  onClick={() => setShowAll((prev) => !prev)}
                  className={cn(
                    'inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300',
                    'bg-brand-500/10 border border-brand-500/20 text-brand-500',
                    'hover:bg-brand-500/20 hover:border-brand-500/40 hover:shadow-glow-sm'
                  )}
                >
                  {showAll ? 'Daha Az Göster' : `Tüm Kategorilere Göz At (${categories.length})`}
                  <ChevronDown className={cn('w-4 h-4 transition-transform duration-300', showAll && 'rotate-180')} />
                </button>
              </AnimatedSection>
            )}
          </>
        )}

        {/* Empty */}
        {!loading && !error && categories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-th-fg-muted">Henüz kategori bulunmuyor</p>
          </div>
        )}
      </div>

      {/* Section divider */}
      <div className="section-divider mt-24" />
    </section>
  )
}
