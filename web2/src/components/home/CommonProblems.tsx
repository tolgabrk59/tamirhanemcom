'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { commonProblemsData, getUniqueBrands, getProblemsByBrand } from '@/data/common-problems'
import type { CommonProblem } from '@/types'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

export default function CommonProblems() {
  const brands = getUniqueBrands()
  const [activeBrand, setActiveBrand] = useState(brands[0])
  const problems = getProblemsByBrand(activeBrand)

  return (
    <section id="yaygin-problemler" className="relative py-24 md:py-32">
      <div className="section-container">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-brand-500/50" />
            <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">
              Araç Sorunları
            </span>
            <div className="w-8 h-px bg-brand-500/50" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4">
            Sık Görülen <span className="text-gold">Araç Sorunları</span>
          </h2>
          <p className="text-th-fg text-lg max-w-xl mx-auto">
            Marka bazında en yaygın arızalar ve tahmini tamir maliyetleri
          </p>
        </AnimatedSection>

        {/* Brand Tabs */}
        <AnimatedSection delay={0.1} className="flex flex-wrap justify-center gap-2 mb-10">
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => setActiveBrand(brand)}
              className={cn(
                'px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300',
                activeBrand === brand
                  ? 'bg-brand-500 text-th-bg shadow-glow-sm'
                  : 'glass-card text-th-fg-sub hover:text-brand-500 hover:border-brand-500/30'
              )}
            >
              {brand}
            </button>
          ))}
        </AnimatedSection>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {problems.map((problem, idx) => (
            <AnimatedSection key={problem.id} delay={idx * 0.08}>
              <ProblemCard problem={problem} />
            </AnimatedSection>
          ))}
        </div>

        {/* View All */}
        <AnimatedSection delay={0.3} className="flex justify-center mt-10">
          <Link
            href="/ariza-bul"
            className={cn(
              'inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300',
              'bg-brand-500/10 border border-brand-500/20 text-brand-500',
              'hover:bg-brand-500/20 hover:border-brand-500/40 hover:shadow-glow-sm'
            )}
          >
            Tüm Arızaları Gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>

      <div className="section-divider mt-24" />
    </section>
  )
}

function ProblemCard({ problem }: { problem: CommonProblem }) {
  return (
    <div
      className={cn(
        'glass-card p-6 md:p-8 h-full flex flex-col',
        'transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-glow-sm'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-sm text-brand-500 font-medium">{problem.brand}</span>
          {problem.model && (
            <span className="text-sm text-th-fg-muted"> / {problem.model}</span>
          )}
        </div>
        <span className="text-xs bg-brand-500/10 text-brand-500 px-2.5 py-1 rounded-lg font-medium">
          {problem.frequency}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-base md:text-lg mb-2 text-th-fg">
        {problem.title}
      </h3>

      {/* Description */}
      <p className="text-th-fg-sub text-sm leading-relaxed mb-4 line-clamp-2">
        {problem.description}
      </p>

      {/* Symptoms */}
      <div className="mb-4 flex-1">
        <span className="text-xs font-medium text-th-fg-muted uppercase tracking-wide">
          Belirtiler:
        </span>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {problem.symptoms.slice(0, 3).map((symptom, i) => (
            <span
              key={i}
              className="text-xs bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-lg"
            >
              {symptom}
            </span>
          ))}
          {problem.symptoms.length > 3 && (
            <span className="text-xs text-th-fg-muted">
              +{problem.symptoms.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Cost */}
      <div className="flex items-center justify-between pt-4 border-t border-th-border/[0.06]">
        <div>
          <span className="text-xs text-th-fg-muted">Tahmini Maliyet</span>
          <p className="text-base font-bold text-th-fg">{problem.estimatedCost}</p>
        </div>
        <Link
          href={`/ariza-bul?brand=${problem.brand}&problem=${encodeURIComponent(problem.title)}`}
          className="text-brand-500 text-sm font-medium hover:underline"
        >
          Detay
        </Link>
      </div>
    </div>
  )
}
