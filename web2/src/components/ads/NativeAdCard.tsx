'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getSponsorsByPlacement } from '@/data/sponsors'
import type { Sponsor } from '@/types/sponsor'

export default function NativeAdCard() {
  const [sponsor, setSponsor] = useState<Sponsor | null>(null)

  useEffect(() => {
    const sponsors = getSponsorsByPlacement('native')
    if (sponsors.length > 0) {
      setSponsor(sponsors[Math.floor(Math.random() * sponsors.length)])
    }
  }, [])

  if (!sponsor) return null

  return (
    <section className="py-8">
      <div className="section-container">
        <a
          href={sponsor.url}
          target="_blank"
          rel="sponsored noopener"
          className="group block rounded-2xl border border-th-border hover:border-brand-500/40 bg-th-bg-alt shadow-card-light hover:shadow-card-light-hover transition-all duration-300 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
            {/* Logo */}
            <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 relative rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-800 border border-th-border">
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                fill
                className="object-contain p-2"
                sizes="96px"
              />
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h3 className="text-xl font-bold text-th-fg group-hover:text-brand-500 transition-colors">
                  {sponsor.name}
                </h3>
                <span className="text-[10px] text-th-fg-muted bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded font-medium">
                  Sponsorlu
                </span>
              </div>
              <p className="text-th-fg-sub">
                {sponsor.description}
              </p>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-surface-950 px-6 py-3 rounded-xl font-semibold transition-colors group-hover:bg-brand-600 group-hover:shadow-glow-sm">
                Hemen İncele
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>

          {/* Gold accent border */}
          <div className="h-0.5 bg-gold-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>
    </section>
  )
}
