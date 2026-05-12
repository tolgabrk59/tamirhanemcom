'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { getSponsorsByPlacement } from '@/data/sponsors'
import type { Sponsor } from '@/types/sponsor'

export default function SponsorBand() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSponsors(getSponsorsByPlacement('band'))
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || sponsors.length === 0) return

    let animationId: number
    let scrollPos = 0
    const speed = 0.5

    const animate = () => {
      scrollPos += speed
      if (scrollPos >= el.scrollWidth / 2) {
        scrollPos = 0
      }
      el.scrollLeft = scrollPos
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    const handleMouseEnter = () => cancelAnimationFrame(animationId)
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate)
    }

    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      el.removeEventListener('mouseenter', handleMouseEnter)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [sponsors])

  if (sponsors.length === 0) return null

  const duplicated = [...sponsors, ...sponsors]

  return (
    <section className="py-4 bg-surface-900 border-t border-surface-700/50">
      <div className="section-container">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-brand-400 font-semibold text-xs tracking-wider uppercase">
              Sponsorlarımız
            </span>
            <span className="text-[10px] text-surface-400 bg-surface-800 px-1.5 py-0.5 rounded">
              Reklam
            </span>
          </div>

          <div
            ref={scrollRef}
            className="flex items-center gap-8 overflow-hidden flex-1"
          >
            {duplicated.map((sponsor, i) => (
              <a
                key={`${sponsor.id}-${i}`}
                href={sponsor.url}
                target="_blank"
                rel="sponsored noopener"
                className="flex-shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                title={sponsor.name}
              >
                <div className="relative w-24 h-10 md:w-28 md:h-12">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                    sizes="112px"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
