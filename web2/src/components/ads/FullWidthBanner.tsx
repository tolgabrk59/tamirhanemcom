'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getSponsorsByPlacement } from '@/data/sponsors'
import type { Sponsor } from '@/types/sponsor'

export default function FullWidthBanner() {
  const [sponsor, setSponsor] = useState<Sponsor | null>(null)

  useEffect(() => {
    const sponsors = getSponsorsByPlacement('banner')
    if (sponsors.length > 0) {
      setSponsor(sponsors[Math.floor(Math.random() * sponsors.length)])
    }
  }, [])

  if (!sponsor) return null

  return (
    <section className="py-6 bg-surface-900">
      <div className="section-container">
        <a
          href={sponsor.url}
          target="_blank"
          rel="sponsored noopener"
          className="group flex flex-col md:flex-row items-center justify-between gap-6 py-6 px-8 rounded-2xl bg-brand-500/5 border border-brand-500/20 hover:border-brand-500/40 transition-all duration-300 hover:shadow-glow-sm"
        >
          {/* Left - Logo + Text */}
          <div className="flex items-center gap-6">
            <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/10">
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                fill
                className="object-contain p-2"
                sizes="80px"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">
                  {sponsor.name}
                </h3>
                <span className="text-[10px] text-surface-400 bg-white/10 px-1.5 py-0.5 rounded">
                  Reklam
                </span>
              </div>
              <p className="text-surface-300 text-sm md:text-base">
                {sponsor.description}
              </p>
            </div>
          </div>

          {/* Right - CTA */}
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-surface-950 px-8 py-3 rounded-xl font-bold transition-all group-hover:bg-brand-600 group-hover:shadow-glow">
              Teklif Al
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </a>
      </div>
    </section>
  )
}
