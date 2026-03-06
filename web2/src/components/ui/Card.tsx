'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export default function Card({
  children,
  className,
  hover = true,
  glow = false,
}: CardProps) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -4,
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
            }
          : undefined
      }
      className={cn(
        'glass-card p-6',
        hover && 'group cursor-pointer hover:border-brand-500/20 transition-all duration-300',
        glow && 'hover:shadow-glow',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
