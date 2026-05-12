'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getSponsorsByPlacement } from '@/data/sponsors'
import type { Sponsor } from '@/types/sponsor'

export default function SidebarAd() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])

  useEffect(() => {
    const allSponsors = getSponsorsByPlacement('sidebar')
    // Rastgele 3 sponsor seç
    const shuffled = allSponsors.sort(() => 0.5 - Math.random())
    setSponsors(shuffled.slice(0, 3))
  }, [])

  if (sponsors.length === 0) return null

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="w-8 h-px bg-brand-500/50" />
        <span className="text-brand-500 text-xs font-semibold tracking-widest uppercase">
          Önerilen Servisler
        </span>
        <div className="w-8 h-px bg-brand-500/50" />
        <span className="text-[10px] text-th-fg-muted bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">
          Reklam
        </span>
      </div>

      {/* 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.id}
            href={sponsor.url}
            target="_blank"
            rel="sponsored noopener"
            className="group rounded-2xl border border-th-border bg-th-bg-alt shadow-card-light hover:shadow-card-light-hover hover:border-brand-500/40 transition-all duration-300 overflow-hidden"
          >
            {/* Logo */}
            <div className="relative w-full h-28 bg-surface-100 dark:bg-surface-800 border-b border-th-border">
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h4 className="font-bold text-th-fg mb-1 group-hover:text-brand-500 transition-colors text-center text-sm">
                {sponsor.name}
              </h4>
              <p className="text-xs text-th-fg-sub mb-3 text-center line-clamp-2">
                {sponsor.description}
              </p>

              {/* CTA */}
              <span className="inline-flex items-center justify-center gap-1.5 w-full bg-brand-500 hover:bg-brand-600 text-surface-950 px-3 py-2 rounded-lg font-semibold text-xs transition-colors">
                İncele
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>

            {/* Gold accent on hover */}
            <div className="h-0.5 bg-gold-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  )
}
