'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  MapPin,
  LocateFixed,
  Loader2,
  Search,
  ChevronRight,
  RotateCcw,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { cityList, getDistrictsByCity } from '@/data/turkey-locations'
import { useLocationStore } from '@/lib/useLocationStore'

interface LocationPickerModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = 'main' | 'city' | 'district'

export default function LocationPickerModal({ isOpen, onClose }: LocationPickerModalProps) {
  const { location, detecting, error, setLocation, clearLocation, detectLocation } = useLocationStore()

  const [step, setStep] = useState<Step>('main')
  const [citySearch, setCitySearch] = useState('')
  const [pendingCity, setPendingCity] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Step değişince input'a focus
  useEffect(() => {
    if ((step === 'city' || step === 'district') && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [step])

  // Modal kapanınca reset
  useEffect(() => {
    if (!isOpen) {
      setStep('main')
      setCitySearch('')
      setPendingCity('')
    }
  }, [isOpen])

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return cityList
    const q = citySearch.toLowerCase().replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
    return cityList.filter((c) => {
      const norm = c.toLowerCase().replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
      return norm.includes(q)
    })
  }, [citySearch])

  const districts = useMemo(() => {
    if (!pendingCity) return []
    return getDistrictsByCity(pendingCity)
  }, [pendingCity])

  const filteredDistricts = useMemo(() => {
    if (!citySearch.trim()) return districts
    const q = citySearch.toLowerCase().replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
    return districts.filter((d) => {
      const norm = d.toLowerCase().replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
      return norm.includes(q)
    })
  }, [citySearch, districts])

  const handleDetect = async () => {
    const result = await detectLocation()
    if (result) {
      onClose()
    }
  }

  const handleCitySelect = (city: string) => {
    setPendingCity(city)
    setCitySearch('')
    setStep('district')
  }

  const handleDistrictSelect = (district: string) => {
    setLocation({
      city: pendingCity,
      district,
      lat: null,
      lon: null,
      isManuallySet: true,
    })
    onClose()
  }

  const handleCityOnlySelect = () => {
    setLocation({
      city: pendingCity,
      district: '',
      lat: null,
      lon: null,
      isManuallySet: true,
    })
    onClose()
  }

  const handleReset = () => {
    clearLocation()
    onClose()
  }

  // Keyboard: Escape ile kapat
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (step !== 'main') {
          setStep(step === 'district' ? 'city' : 'main')
          setCitySearch('')
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, step, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm bg-th-bg border border-th-border/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-th-border/[0.06]">
          <div className="flex items-center gap-2">
            {step !== 'main' && (
              <button
                type="button"
                onClick={() => {
                  setStep(step === 'district' ? 'city' : 'main')
                  setCitySearch('')
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-th-fg-sub hover:text-th-fg hover:bg-th-bg-alt transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            )}
            <div className="flex items-center gap-2 text-th-fg">
              <MapPin className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold font-display">
                {step === 'main' && 'Konumunuz'}
                {step === 'city' && 'Şehir Seçin'}
                {step === 'district' && pendingCity}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-th-fg-muted hover:text-th-fg hover:bg-th-bg-alt transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          <AnimatePresence mode="wait">
            {/* ─── ANA EKRAN ─── */}
            {step === 'main' && (
              <motion.div
                key="main"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {/* Mevcut konum gösterimi */}
                {location.city && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-500/5 border border-brand-500/15">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-brand-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-th-fg">
                        {location.city}{location.district ? `, ${location.district}` : ''}
                      </div>
                      <div className="text-[11px] text-th-fg-muted">
                        {location.isManuallySet ? 'Manuel seçim' : 'Otomatik tespit'}
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-brand-500 shrink-0" />
                  </div>
                )}

                {/* Otomatik tespit butonu */}
                <button
                  type="button"
                  onClick={handleDetect}
                  disabled={detecting}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl border transition-all',
                    'bg-th-bg-alt border-th-border/10 hover:border-brand-500/30 hover:bg-brand-500/5',
                    detecting && 'opacity-60 cursor-wait'
                  )}
                >
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                    {detecting ? (
                      <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
                    ) : (
                      <LocateFixed className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-semibold text-th-fg">
                      {detecting ? 'Konum tespit ediliyor...' : 'Mevcut Konumu Kullan'}
                    </div>
                    <div className="text-[11px] text-th-fg-muted">
                      GPS ile gerçek konumunuzu belirleyin
                    </div>
                  </div>
                  {!detecting && <ChevronRight className="w-4 h-4 text-th-fg-muted shrink-0" />}
                </button>

                {/* Hata mesajı */}
                {error && (
                  <div className="text-xs text-red-400 px-1">{error}</div>
                )}

                {/* Manuel seçim butonu */}
                <button
                  type="button"
                  onClick={() => setStep('city')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border bg-th-bg-alt border-th-border/10 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                    <Search className="w-5 h-5 text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-semibold text-th-fg">Manuel Şehir Seç</div>
                    <div className="text-[11px] text-th-fg-muted">
                      81 ilden birini seçin
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-th-fg-muted shrink-0" />
                </button>

                {/* Konum sıfırla */}
                {location.city && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs text-th-fg-muted hover:text-red-400 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Konumu Sıfırla
                  </button>
                )}
              </motion.div>
            )}

            {/* ─── ŞEHİR SEÇİMİ ─── */}
            {step === 'city' && (
              <motion.div
                key="city"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Arama */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-sub" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Şehir ara..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="input-dark pl-9 text-sm"
                  />
                </div>

                {/* Şehir listesi */}
                <div className="max-h-72 overflow-y-auto -mx-1 px-1 space-y-0.5 scrollbar-thin">
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors',
                        city === location.city
                          ? 'bg-brand-500/10 text-brand-500 font-semibold'
                          : 'text-th-fg-sub hover:text-th-fg hover:bg-th-bg-alt'
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-th-fg-muted" />
                        {city}
                      </span>
                      {city === location.city && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                  {filteredCities.length === 0 && (
                    <div className="py-6 text-center text-sm text-th-fg-muted">
                      Sonuç bulunamadı
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── İLÇE SEÇİMİ ─── */}
            {step === 'district' && (
              <motion.div
                key="district"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Arama */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-sub" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="İlçe ara..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="input-dark pl-9 text-sm"
                  />
                </div>

                {/* Tüm il butonu */}
                <button
                  type="button"
                  onClick={handleCityOnlySelect}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-brand-500 font-semibold hover:bg-brand-500/10 transition-colors mb-1"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    Tüm {pendingCity}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* İlçe listesi */}
                <div className="max-h-64 overflow-y-auto -mx-1 px-1 space-y-0.5 scrollbar-thin">
                  {filteredDistricts.map((district) => (
                    <button
                      key={district}
                      type="button"
                      onClick={() => handleDistrictSelect(district)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors',
                        district === location.district && pendingCity === location.city
                          ? 'bg-brand-500/10 text-brand-500 font-semibold'
                          : 'text-th-fg-sub hover:text-th-fg hover:bg-th-bg-alt'
                      )}
                    >
                      <span>{district}</span>
                      {district === location.district && pendingCity === location.city && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ))}
                  {filteredDistricts.length === 0 && (
                    <div className="py-6 text-center text-sm text-th-fg-muted">
                      Sonuç bulunamadı
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
