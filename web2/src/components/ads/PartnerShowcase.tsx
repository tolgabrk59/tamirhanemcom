'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getSponsorsByPlacement } from '@/data/sponsors'
import type { Sponsor } from '@/types/sponsor'

export default function PartnerShowcase() {
  const [partners, setPartners] = useState<Sponsor[]>([])

  useEffect(() => {
    setPartners(getSponsorsByPlacement('partner'))
  }, [])

  if (partners.length === 0) return null

  return (
    <section className="py-16 sm:py-24">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-brand-500/50" />
            <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">
              Partnörlerimiz
            </span>
            <div className="w-8 h-px bg-brand-500/50" />
          </div>
          <p className="text-th-fg-sub max-w-xl mx-auto text-sm">
            Güvenilir markalarla iş birliği yaparak size en iyi hizmeti sunuyoruz
          </p>
          <span className="inline-block text-[10px] text-th-fg-muted bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded mt-2">
            Sponsorlu İçerik
          </span>
        </div>

        {/* Partner Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partners.slice(0, 3).map((partner) => (
            <a
              key={partner.id}
              href={partner.url}
              target="_blank"
              rel="sponsored noopener"
              className="group rounded-2xl p-6 border border-th-border hover:border-brand-500/40 bg-th-bg-alt shadow-card-light hover:shadow-card-light-hover transition-all duration-300 hover:-translate-y-1"
            >
              {/* Logo */}
              <div className="relative w-full h-20 mb-4 rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-800">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain p-3 grayscale group-hover:grayscale-0 transition-all duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Content */}
              <h4 className="font-bold text-th-fg mb-2 group-hover:text-brand-500 transition-colors text-center">
                {partner.name}
              </h4>
              <p className="text-sm text-th-fg-sub text-center mb-4 line-clamp-2">
                {partner.description}
              </p>

              {/* CTA */}
              <div className="text-center">
                <span className="inline-flex items-center gap-1 text-brand-500 font-semibold text-sm group-hover:gap-2 transition-all">
                  İncele
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
