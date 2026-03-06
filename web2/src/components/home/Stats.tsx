'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { Building2, Users, Star, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatItem {
  target: number
  suffix: string
  label: string
  decimals?: number
  icon: LucideIcon
}

const statsData: StatItem[] = [
  { target: 12000, suffix: '+', label: 'Kayıtlı Servis', icon: Building2 },
  { target: 150000, suffix: '+', label: 'Mutlu Kullanıcı', icon: Users },
  { target: 81, suffix: '', label: 'Şehir', icon: MapPin },
  { target: 4.8, suffix: '/5', label: 'Ortalama Puan', decimals: 1, icon: Star },
]

function AnimatedCounter({
  target,
  suffix,
  decimals = 0,
  isInView,
}: {
  target: number
  suffix: string
  decimals?: number
  isInView: boolean
}) {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    stiffness: 50,
    damping: 30,
    duration: 2,
  })
  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    if (isInView) {
      motionValue.set(target)
    }
  }, [isInView, motionValue, target])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (decimals > 0) {
        setDisplayValue(latest.toFixed(decimals))
      } else {
        setDisplayValue(
          Math.round(latest).toLocaleString('tr-TR')
        )
      }
    })
    return unsubscribe
  }, [springValue, decimals])

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh-gradient" aria-hidden="true" />

      {/* Top divider */}
      <div className="section-divider absolute top-0 left-0" />

      <div className="section-container relative z-10" ref={ref}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {statsData.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/15 mb-4">
                  <Icon className="w-6 h-6 text-brand-500" />
                </div>

                {/* Number */}
                <div
                  className={cn(
                    'font-display font-extrabold text-4xl md:text-5xl text-gold mb-2',
                    'tabular-nums'
                  )}
                >
                  <AnimatedCounter
                    target={stat.target}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    isInView={isInView}
                  />
                </div>
                <div className="text-th-fg-sub text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="section-divider absolute bottom-0 left-0" />
    </section>
  )
}
