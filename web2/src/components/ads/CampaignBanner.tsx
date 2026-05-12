'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { getActiveCampaigns } from '@/data/campaigns'
import type { Campaign } from '@/types/sponsor'

const STORAGE_KEY = 'campaign-banner-dismissed'
const ROTATE_INTERVAL = 5000

export default function CampaignBanner() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY) === 'true'
    if (wasDismissed) return

    const active = getActiveCampaigns()
    if (active.length > 0) {
      setCampaigns(active)
      setDismissed(false)
    }
  }, [])

  useEffect(() => {
    if (campaigns.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % campaigns.length)
    }, ROTATE_INTERVAL)

    return () => clearInterval(interval)
  }, [campaigns.length])

  const handleDismiss = useCallback(() => {
    setDismissed(true)
    sessionStorage.setItem(STORAGE_KEY, 'true')
  }, [])

  if (dismissed || campaigns.length === 0) return null

  const campaign = campaigns[currentIndex]

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden fixed top-14 sm:top-16 left-0 right-0 z-[45]"
        >
          <div>
            <div className="flex items-center justify-end h-10 sm:h-11 px-4 relative">
              <div className="flex items-center gap-2 sm:gap-3 mr-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2 sm:gap-3 min-w-0"
                  >
                    <span className="text-sm sm:text-base flex-shrink-0">{campaign.emoji}</span>
                    <span className="text-brand-400 font-bold text-xs sm:text-sm truncate">
                      {campaign.title}
                    </span>
                    <span className="hidden sm:inline text-surface-300 text-xs truncate">
                      {campaign.description}
                    </span>
                    <Link
                      href={campaign.url}
                      className="flex-shrink-0 bg-brand-500 hover:bg-brand-400 text-surface-950 px-3 py-0.5 rounded-lg text-xs font-bold transition-colors"
                    >
                      {campaign.ctaText} →
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                onClick={handleDismiss}
                className="absolute right-4 text-surface-500 hover:text-white transition-colors text-sm leading-none"
                aria-label="Kampanya bannerını kapat"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
