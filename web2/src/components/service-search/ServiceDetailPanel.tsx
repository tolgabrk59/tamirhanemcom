'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Star,
  MapPin,
  Phone,
  Shield,
  Truck,
  Wrench,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Calendar,
  Car,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { isServiceOpen } from '@/lib/service-utils'

interface Service {
  id: number
  name: string
  location: string
  rating: number | null
  rating_count: number | null
  latitude: number | null
  longitude: number | null
  phone: string | null
  pic: string | null
  is_official_service: boolean
  provides_roadside_assistance: boolean
  categories?: string[]
  description?: string
  address?: string
  working_hours?: any
  supported_vehicles?: any[]
  supports_all_vehicles?: boolean
}

interface ServiceDetailPanelProps {
  service: Service | null
  isOpen: boolean
  onClose: () => void
}

export default function ServiceDetailPanel({ service, isOpen, onClose }: ServiceDetailPanelProps) {
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [showAllBrands, setShowAllBrands] = useState(false)

  // Reset expand states when service changes
  useEffect(() => {
    setShowAllCategories(false)
    setShowAllBrands(false)
  }, [service?.id])

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!service) return null

  const openStatus = isServiceOpen(service.working_hours)
  const imageUrl = service.pic
    ? service.pic.startsWith('http')
      ? service.pic
      : `https://api.tamirhanem.com${service.pic}`
    : null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Slide Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-th-bg border-l border-th-border/[0.06] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="shrink-0 border-b border-th-border/[0.06] px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-th-fg">Servis Detayları</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-th-overlay/[0.06] text-th-fg-sub hover:text-th-fg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Service Image */}
              <div className="relative h-52 bg-th-bg-alt overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={service.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 448px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-th-bg-alt to-th-bg-alt flex items-center justify-center">
                    <Wrench className="w-16 h-16 text-th-fg-muted" />
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-th-bg/80 via-transparent to-transparent" />

                {/* Status badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md',
                      openStatus.isOpen
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    )}
                  >
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        openStatus.isOpen ? 'bg-green-500' : 'bg-red-500'
                      )}
                    />
                    {openStatus.isOpen ? 'Açık' : 'Kapalı'}
                  </span>
                </div>

                {/* Official badge */}
                {service.is_official_service && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-500/20 text-brand-400 border border-brand-500/30 backdrop-blur-md">
                      <Shield className="w-3.5 h-3.5" />
                      Yetkili Servis
                    </span>
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="p-6 space-y-6">
                {/* Name & Rating */}
                <div>
                  <h3 className="text-2xl font-display font-bold text-th-fg mb-3">
                    {service.name}
                  </h3>
                  {service.rating && (
                    <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 text-brand-500 fill-brand-500" />
                      <span className="font-bold text-th-fg">
                        {service.rating.toFixed(1)}
                      </span>
                      <span className="text-th-fg-sub text-sm">
                        ({service.rating_count || 0} değerlendirme)
                      </span>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="bg-th-overlay/[0.03] border border-th-border/[0.06] rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-500/10 p-2 rounded-lg shrink-0">
                      <MapPin className="w-5 h-5 text-brand-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-th-fg text-sm mb-1">Konum</h4>
                      <p className="text-th-fg-sub text-sm">
                        {service.address || service.location}
                      </p>
                      {service.latitude && service.longitude && (
                        <a
                          href={`https://www.google.com/maps?q=${service.latitude},${service.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-brand-400 text-sm hover:text-brand-300 transition-colors mt-2"
                        >
                          Haritada Göster
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                {service.phone && (
                  <div className="bg-th-overlay/[0.03] border border-th-border/[0.06] rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500/10 p-2 rounded-lg shrink-0">
                        <Phone className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-th-fg text-sm mb-0.5">Telefon</h4>
                        <a
                          href={`tel:${service.phone}`}
                          className="text-th-fg-sub text-sm hover:text-brand-400 transition-colors"
                        >
                          {service.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Categories / Hizmetler */}
                {service.categories && service.categories.length > 0 && (
                  <div>
                    <h4 className="font-display font-semibold text-th-fg mb-3">Hizmetler</h4>
                    <div className="flex flex-wrap gap-2">
                      {(showAllCategories
                        ? service.categories
                        : service.categories.slice(0, 8)
                      ).map((cat, idx) => (
                        <span
                          key={idx}
                          className="badge-gold text-xs px-3 py-1"
                        >
                          {cat}
                        </span>
                      ))}
                      {service.categories.length > 8 && (
                        <button
                          onClick={() => setShowAllCategories(!showAllCategories)}
                          className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors bg-brand-500/10 px-3 py-1 rounded-full"
                        >
                          {showAllCategories ? (
                            <>
                              Daha az göster
                              <ChevronUp className="w-3 h-3" />
                            </>
                          ) : (
                            <>
                              +{service.categories.length - 8} daha
                              <ChevronDown className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Supported Brands */}
                <div>
                  <h4 className="font-display font-semibold text-th-fg mb-3">
                    Hizmet Verilen Markalar
                  </h4>
                  {service.supports_all_vehicles ? (
                    <div className="bg-gradient-to-r from-brand-500/10 to-blue-500/10 border border-brand-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-brand-500 p-2 rounded-lg shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-th-fg-invert" />
                        </div>
                        <div>
                          <span className="font-semibold text-brand-400 text-sm">
                            Tüm Markalara Hizmet Verilmektedir
                          </span>
                          <p className="text-th-fg-muted text-xs mt-1">
                            Bu servis tüm araç marka ve modellerine bakım ve onarım hizmeti
                            sunmaktadır.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : service.supported_vehicles && service.supported_vehicles.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {(showAllBrands
                        ? service.supported_vehicles
                        : service.supported_vehicles.slice(0, 12)
                      ).map((vehicle: any, idx: number) => {
                        const brandName =
                          typeof vehicle === 'string'
                            ? vehicle
                            : vehicle.brand || vehicle.name || vehicle
                        return (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 bg-th-overlay/[0.04] border border-th-border/[0.08] text-th-fg text-xs px-3 py-1.5 rounded-full"
                          >
                            <Car className="w-3.5 h-3.5 text-th-fg-muted" />
                            {brandName}
                          </span>
                        )
                      })}
                      {service.supported_vehicles.length > 12 && (
                        <button
                          onClick={() => setShowAllBrands(!showAllBrands)}
                          className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors bg-brand-500/10 px-3 py-1.5 rounded-full"
                        >
                          {showAllBrands ? (
                            <>
                              Daha az göster
                              <ChevronUp className="w-3 h-3" />
                            </>
                          ) : (
                            <>
                              +{service.supported_vehicles.length - 12} daha
                              <ChevronDown className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-th-fg-muted text-sm italic">Marka bilgisi bulunmuyor</p>
                  )}
                </div>

                {/* Features */}
                {(service.provides_roadside_assistance || service.is_official_service) && (
                  <div className="grid grid-cols-2 gap-3">
                    {service.provides_roadside_assistance && (
                      <div className="bg-blue-500/[0.08] border border-blue-500/20 rounded-xl p-4 text-center">
                        <Truck className="w-6 h-6 text-blue-400 mx-auto mb-1.5" />
                        <span className="text-xs font-medium text-blue-300">Yol Yardımı</span>
                      </div>
                    )}
                    {service.is_official_service && (
                      <div className="bg-green-500/[0.08] border border-green-500/20 rounded-xl p-4 text-center">
                        <Shield className="w-6 h-6 text-green-400 mx-auto mb-1.5" />
                        <span className="text-xs font-medium text-green-300">Yetkili Servis</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Opening Hours Info */}
                {!openStatus.isOpen && openStatus.nextTime && (
                  <div className="bg-th-overlay/[0.03] border border-th-border/[0.06] rounded-xl p-4">
                    <p className="text-th-fg-sub text-sm">
                      <span className="text-red-400 font-medium">Şu an kapalı</span>
                      {' · '}
                      Açılış: <span className="text-th-fg">{openStatus.nextTime}</span>
                    </p>
                  </div>
                )}
                {openStatus.isOpen && openStatus.closingTime && (
                  <div className="bg-th-overlay/[0.03] border border-th-border/[0.06] rounded-xl p-4">
                    <p className="text-th-fg-sub text-sm">
                      <span className="text-green-400 font-medium">Şu an açık</span>
                      {' · '}
                      Kapanış: <span className="text-th-fg">{openStatus.closingTime}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Bottom Buttons */}
            <div className="shrink-0 p-5 border-t border-th-border/[0.06] bg-th-bg space-y-3">
              {/* Detaylı Bilgilendirme Button */}
              <Link
                href={`/servis-ara/${service.id}`}
                className="flex items-center justify-center gap-2 w-full btn-ghost py-4 rounded-xl text-sm font-medium border border-th-border/20 hover:border-brand-500/30 hover:text-brand-500 transition-all"
              >
                <ExternalLink className="w-5 h-5" />
                Detaylı Bilgilendirme
              </Link>
              
              {/* Randevu Al Button */}
              <Link
                href={`/randevu?servis=${encodeURIComponent(service.name)}&servis_id=${service.id}`}
                className="flex items-center justify-center gap-2 w-full btn-gold py-4 rounded-xl text-sm font-bold shadow-glow hover:shadow-glow-lg transition-all hover:scale-[1.02]"
              >
                <Calendar className="w-5 h-5" />
                Randevu Al
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
