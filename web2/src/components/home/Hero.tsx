'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Droplets, Factory, ShieldCheck, CarFront, Recycle, Clock, Wrench, Tag, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { cityList, getDistrictsByCity } from '@/data/turkey-locations'

const quickCategories = [
  {
    label: 'Oto Yıkama', icon: Droplets, active: true,
    gradient: 'radial-gradient(ellipse 150% 150% at 50% 50%, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.08) 40%, rgba(59,130,246,0.03) 70%, transparent 100%)',
  },
  {
    label: 'Oto Sanayi', icon: Factory, active: false,
    gradient: 'radial-gradient(ellipse 150% 150% at 50% 50%, rgba(234,179,8,0.15) 0%, rgba(234,179,8,0.08) 40%, rgba(234,179,8,0.03) 70%, transparent 100%)',
  },
  {
    label: 'Oto Sigorta', icon: ShieldCheck, active: false,
    gradient: 'radial-gradient(ellipse 150% 150% at 50% 50%, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.08) 40%, rgba(239,68,68,0.03) 70%, transparent 100%)',
  },
  {
    label: 'Oto Kiralama', icon: CarFront, active: false,
    gradient: 'radial-gradient(ellipse 150% 150% at 50% 50%, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.08) 40%, rgba(34,197,94,0.03) 70%, transparent 100%)',
  },
  {
    label: '2. El Parça', icon: Recycle, active: false,
    gradient: 'radial-gradient(ellipse 150% 150% at 50% 50%, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.08) 40%, rgba(168,85,247,0.03) 70%, transparent 100%)',
  },
]

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0,
    },
  },
}

const fadeUpItem = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
}

interface SuggestionService {
  id: number
  name: string
  location: string
}

interface SuggestionCategory {
  name: string
  slug: string
  category_type: string | null
}

interface Suggestions {
  services: SuggestionService[]
  categories: SuggestionCategory[]
}

function normalizeTurkish(str: string): string {
  if (!str) return ''
  return str
    .replace(/İ/gi, 'i').replace(/I/gi, 'i')
    .replace(/Ş/gi, 's').replace(/ş/gi, 's')
    .replace(/Ğ/gi, 'g').replace(/ğ/gi, 'g')
    .replace(/Ü/gi, 'u').replace(/ü/gi, 'u')
    .replace(/Ö/gi, 'o').replace(/ö/gi, 'o')
    .replace(/Ç/gi, 'c').replace(/ç/gi, 'c')
    .replace(/ı/gi, 'i')
    .toLowerCase()
}

export default function Hero() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState<{ label: string; type: 'city' | 'district'; city?: string }[]>([])
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [activeLocationIndex, setActiveLocationIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<Suggestions>({ services: [], categories: [] })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [allCategories, setAllCategories] = useState<SuggestionCategory[]>([])

  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const locationWrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.96])

  const rotatingPhrases = [
    'Dijital Servisi',
    'Ekonomik Çözümü',
    'Güvenilir Ortağı',
    'Akıllı Rehberi',
    'Uzman Servisi',
    'Pratik Çözümü',
    'Tek Adresi',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [rotatingPhrases.length])

  // Kategorileri bir kere yükle
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setAllCategories(data.data.map((c: { name: string; slug: string; category_type: string | null }) => ({
            name: c.name,
            slug: c.slug,
            category_type: c.category_type,
          })))
        }
      })
      .catch(() => {})
  }, [])

  // Dışarı tıklama ile dropdown'ları kapat
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
        setActiveIndex(-1)
      }
      if (locationWrapperRef.current && !locationWrapperRef.current.contains(e.target as Node)) {
        setShowLocationSuggestions(false)
        setActiveLocationIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const totalSuggestions = suggestions.services.length + suggestions.categories.length

  const handleLocationChange = (value: string) => {
    setLocationQuery(value)
    setActiveLocationIndex(-1)
    if (value.trim().length < 1) {
      setLocationSuggestions([])
      setShowLocationSuggestions(false)
      return
    }
    const normalize = (s: string) =>
      s.toLowerCase().replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
    const q = normalize(value.trim())
    const results: { label: string; type: 'city' | 'district'; city?: string }[] = []
    // Şehirler
    for (const city of cityList) {
      if (normalize(city).includes(q)) {
        results.push({ label: city, type: 'city' })
      }
      if (results.length >= 8) break
    }
    // İlçeler
    if (results.length < 8) {
      for (const city of cityList) {
        for (const district of getDistrictsByCity(city)) {
          if (normalize(district).includes(q)) {
            results.push({ label: `${district}, ${city}`, type: 'district', city })
          }
          if (results.length >= 8) break
        }
        if (results.length >= 8) break
      }
    }
    setLocationSuggestions(results)
    setShowLocationSuggestions(results.length > 0)
  }

  const handleSelectLocation = (item: { label: string; type: 'city' | 'district'; city?: string }) => {
    setLocationQuery(item.label)
    setShowLocationSuggestions(false)
    setActiveLocationIndex(-1)
  }

  const handleLocationKeyDown = (e: React.KeyboardEvent) => {
    if (!showLocationSuggestions || locationSuggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveLocationIndex((prev) => (prev < locationSuggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveLocationIndex((prev) => (prev > 0 ? prev - 1 : locationSuggestions.length - 1))
    } else if (e.key === 'Enter' && activeLocationIndex >= 0) {
      e.preventDefault()
      handleSelectLocation(locationSuggestions[activeLocationIndex])
    } else if (e.key === 'Escape') {
      setShowLocationSuggestions(false)
      setActiveLocationIndex(-1)
    }
  }

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions({ services: [], categories: [] })
      setShowSuggestions(false)
      return
    }

    setSuggestionsLoading(true)
    try {
      const res = await fetch(`/api/services/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()

      const services: SuggestionService[] = (data.data || []).slice(0, 5).map((s: { id: number; name: string; location: string }) => ({
        id: s.id,
        name: s.name,
        location: s.location,
      }))

      const normalizedQuery = normalizeTurkish(query)
      const categories: SuggestionCategory[] = allCategories
        .filter((c) => normalizeTurkish(c.name).includes(normalizedQuery))
        .slice(0, 3)

      setSuggestions({ services, categories })
      setShowSuggestions(services.length > 0 || categories.length > 0)
      setActiveIndex(-1)
    } catch {
      setSuggestions({ services: [], categories: [] })
      setShowSuggestions(false)
    } finally {
      setSuggestionsLoading(false)
    }
  }, [allCategories])

  const handleInputChange = (value: string) => {
    setSearchQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (value.trim().length < 2) {
      setSuggestions({ services: [], categories: [] })
      setShowSuggestions(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value.trim())
    }, 300)
  }

  const handleSelectService = (name: string) => {
    setSearchQuery(name)
    setShowSuggestions(false)
    setActiveIndex(-1)
    router.push(`/servis-ara?q=${encodeURIComponent(name)}`)
  }

  const handleSelectCategory = (cat: SuggestionCategory) => {
    setShowSuggestions(false)
    setActiveIndex(-1)
    const params = new URLSearchParams()
    params.set('kategori', cat.name)
    // category_type null → 'industrial' (Oto Servis)
    params.set('tip', cat.category_type || 'industrial')
    router.push(`/servis-ara?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || totalSuggestions === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev < totalSuggestions - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalSuggestions - 1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      const serviceCount = suggestions.services.length
      if (activeIndex < serviceCount) {
        handleSelectService(suggestions.services[activeIndex].name)
      } else {
        const catIndex = activeIndex - serviceCount
        handleSelectCategory(suggestions.categories[catIndex])
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveIndex(-1)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    const params = new URLSearchParams()
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim())
    }
    if (locationQuery.trim()) {
      params.set('konum', locationQuery.trim())
    }
    router.push(`/servis-ara${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const handleCategoryClick = (category: string) => {
    router.push(`/servis-ara?kategori=${encodeURIComponent(category)}`)
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Background layers - theme-aware */}
      <div className="absolute inset-0 hero-bg" aria-hidden="true" />
      <div className="absolute inset-0 hero-glow-overlay" aria-hidden="true" />
      <div className="absolute inset-0 hero-mesh-overlay" aria-hidden="true" />

      {/* Category hover ambient atmosphere overlay */}
      <AnimatePresence>
        {hoveredCategory && (
          <motion.div
            key={hoveredCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: quickCategories.find((c) => c.label === hoveredCategory)?.gradient,
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Decorative glow dots */}
      <div className="glow-dot w-[500px] h-[500px] -top-40 -left-40 opacity-40" aria-hidden="true" />
      <div className="glow-dot w-[400px] h-[400px] top-1/3 -right-32 opacity-25" aria-hidden="true" />
      <div className="glow-dot w-[300px] h-[300px] bottom-20 left-1/4 opacity-20" aria-hidden="true" />

      {/* Floating decorative shapes */}
      <motion.div
        className="absolute top-[15%] right-[12%] w-20 h-20 rounded-full border border-brand-500/10"
        animate={{ y: [-10, 15, -10], rotate: [0, 90, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-[25%] left-[8%] w-14 h-14 rounded-lg border border-brand-500/10 rotate-45"
        animate={{ y: [10, -15, 10], rotate: [45, 135, 45] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute top-[40%] left-[15%] w-3 h-3 rounded-full bg-brand-500/20"
        animate={{ y: [-8, 12, -8], x: [-5, 5, -5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute top-[20%] left-[45%] w-2 h-2 rounded-full bg-brand-500/15"
        animate={{ y: [5, -10, 5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      {/* Content */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 section-container w-full pt-8 pb-28 lg:pb-36"
      >
        <motion.div
          className="flex flex-col items-center text-center"
          variants={staggerContainer}
          initial={false}
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={fadeUpItem}>
            <Badge variant="gold" className="mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-glow" />
              Türkiye&apos;nin Yeni Nesil Servis Platformu
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUpItem}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6"
          >
            <span>Aracınızın</span>
            <br />
            <span className="text-gold inline-flex items-baseline font-accent">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentPhraseIndex}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.045, delayChildren: 0.1 },
                    },
                    exit: {
                      opacity: 0,
                      transition: { duration: 0.25 },
                    },
                  }}
                  className="inline-flex"
                >
                  {rotatingPhrases[currentPhraseIndex].split('').map((char, i) => (
                    <motion.span
                      key={`${currentPhraseIndex}-${i}`}
                      variants={{
                        hidden: { opacity: 0, y: 8, scaleY: 0.6 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scaleY: 1,
                          transition: { duration: 0.15, ease: 'easeOut' },
                        },
                      }}
                      className={char === ' ' ? 'inline-block w-[0.25em]' : 'inline-block'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      delay: rotatingPhrases[currentPhraseIndex].length * 0.045 + 0.2,
                      duration: 0.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="inline-block w-[3px] h-[0.75em] bg-brand-500 ml-1 self-center rounded-full"
                  />
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUpItem}
            className="text-th-fg text-lg md:text-xl max-w-2xl mb-10 text-balance"
          >
            Servis bul, fiyat karşılaştır, arıza tespit et, bakım takibi yap.
            Tüm araç ihtiyaçlarınız için <strong className="font-bold text-brand-500">TamirHanem.</strong>
          </motion.p>

          {/* Search Bar */}
          <motion.form
            variants={fadeUpItem}
            onSubmit={handleSearch}
            className="w-full max-w-2xl mb-8"
          >
            <div ref={searchWrapperRef} className="relative">
              <div className="glass-card flex flex-col sm:flex-row items-stretch sm:items-center p-2 gap-2">
                <div className="flex-1 flex items-center gap-3 px-4">
                  {suggestionsLoading ? (
                    <Loader2 className="w-5 h-5 text-brand-500 shrink-0 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5 text-th-fg-sub shrink-0" />
                  )}
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Servis ara... (örn: motor bakım, fren, klima)"
                    value={searchQuery}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => {
                      if (totalSuggestions > 0) setShowSuggestions(true)
                    }}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    className="w-full bg-transparent border-none outline-none text-th-fg placeholder:text-th-fg-muted py-3 text-base"
                  />
                </div>
                <div ref={locationWrapperRef} className="flex items-center gap-3 px-4 sm:border-l sm:border-th-border/[0.06]">
                  <MapPin className="w-5 h-5 text-th-fg-sub shrink-0" />
                  <input
                    type="text"
                    placeholder="Şehir veya ilçe"
                    value={locationQuery}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    onFocus={() => {
                      if (locationSuggestions.length > 0) setShowLocationSuggestions(true)
                    }}
                    onKeyDown={handleLocationKeyDown}
                    autoComplete="off"
                    className="w-full bg-transparent border-none outline-none text-th-fg placeholder:text-th-fg-muted py-3 text-base sm:max-w-[160px]"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<Search className="w-4 h-4" />}
                  className="shrink-0 sm:w-auto w-full"
                >
                  <span className="hidden sm:inline">Servis Ara</span>
                  <span className="sm:hidden">Ara</span>
                </Button>
              </div>

              {/* Autocomplete Dropdown */}
              <AnimatePresence>
                {showSuggestions && totalSuggestions > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute left-0 right-0 top-full mt-2 z-50 glass-card overflow-hidden border border-th-border/[0.1] shadow-xl"
                  >
                    {/* Servisler */}
                    {suggestions.services.length > 0 && (
                      <div>
                        <div className="px-4 pt-3 pb-1.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-th-fg-muted">
                            Servisler
                          </span>
                        </div>
                        {suggestions.services.map((srv, idx) => (
                          <button
                            key={srv.id}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelectService(srv.name)}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100',
                              activeIndex === idx
                                ? 'bg-brand-500/[0.1] text-brand-400'
                                : 'text-th-fg hover:bg-th-overlay/[0.06]'
                            )}
                          >
                            <Wrench className="w-4 h-4 text-th-fg-sub shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{srv.name}</p>
                              <p className="text-[11px] text-th-fg-muted truncate">{srv.location}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Ayırıcı */}
                    {suggestions.services.length > 0 && suggestions.categories.length > 0 && (
                      <div className="mx-4 border-t border-th-border/[0.06]" />
                    )}

                    {/* Kategoriler */}
                    {suggestions.categories.length > 0 && (
                      <div>
                        <div className="px-4 pt-3 pb-1.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-th-fg-muted">
                            Kategoriler
                          </span>
                        </div>
                        {suggestions.categories.map((cat, idx) => {
                          const globalIdx = suggestions.services.length + idx
                          return (
                            <button
                              key={cat.slug}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleSelectCategory(cat)}
                              onMouseEnter={() => setActiveIndex(globalIdx)}
                              className={cn(
                                'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100',
                                activeIndex === globalIdx
                                  ? 'bg-brand-500/[0.1] text-brand-400'
                                  : 'text-th-fg hover:bg-th-overlay/[0.06]'
                              )}
                            >
                              <Tag className="w-4 h-4 text-brand-500/60 shrink-0" />
                              <p className="text-sm font-medium truncate">{cat.name}</p>
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* Alt bilgi */}
                    <div className="px-4 py-2 border-t border-th-border/[0.06]">
                      <p className="text-[10px] text-th-fg-muted">
                        <kbd className="px-1 py-0.5 rounded bg-th-overlay/[0.08] text-[9px] font-mono">↑↓</kbd>
                        {' '}gezin{' '}
                        <kbd className="px-1 py-0.5 rounded bg-th-overlay/[0.08] text-[9px] font-mono">Enter</kbd>
                        {' '}seç{' '}
                        <kbd className="px-1 py-0.5 rounded bg-th-overlay/[0.08] text-[9px] font-mono">Esc</kbd>
                        {' '}kapat
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Konum Autocomplete Dropdown */}
              <AnimatePresence>
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 z-50 w-[280px] bg-th-bg/95 backdrop-blur-xl rounded-xl overflow-hidden border border-th-border/[0.1] shadow-xl"
                  >
                    {locationSuggestions.map((item, idx) => (
                      <button
                        key={`${item.label}-${idx}`}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectLocation(item)}
                        onMouseEnter={() => setActiveLocationIndex(idx)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100',
                          activeLocationIndex === idx
                            ? 'bg-brand-500/[0.1] text-brand-400'
                            : 'text-th-fg hover:bg-th-overlay/[0.06]'
                        )}
                      >
                        <MapPin className={cn('w-4 h-4 shrink-0', item.type === 'city' ? 'text-brand-500' : 'text-th-fg-sub')} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{item.label}</p>
                          <p className="text-[10px] text-th-fg-muted">{item.type === 'city' ? 'İl' : 'İlçe'}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.form>

          {/* Quick Category Pills */}
          <motion.div
            variants={fadeUpItem}
            className="flex flex-wrap justify-center gap-2 mb-16"
          >
            {quickCategories.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => cat.active && handleCategoryClick(cat.label)}
                  onMouseEnter={() => setHoveredCategory(cat.label)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300',
                    cat.active
                      ? [
                          'bg-brand-500/[0.1] border border-brand-500/30 text-brand-400',
                          'hover:border-brand-500/50 hover:bg-brand-500/[0.15] hover:text-brand-300',
                          'shadow-[0_0_12px_rgba(251,201,29,0.1)] cursor-pointer',
                        ]
                      : [
                          'bg-th-overlay/[0.04] border border-th-border/[0.08] text-th-fg',
                          'cursor-not-allowed',
                        ]
                  )}
                >
                  <Icon className={cn('w-3.5 h-3.5', cat.active ? 'text-brand-500' : 'text-th-fg-sub')} />
                  {cat.label}
                  {cat.active ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-950 bg-brand-500 px-1.5 py-0.5 rounded-full ml-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-950/40 animate-pulse" />
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400/80 bg-amber-500/[0.1] border border-amber-500/20 px-1.5 py-0.5 rounded-full ml-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      Yakında
                    </span>
                  )}
                </button>
              )
            })}
          </motion.div>

          {/* App Store Badges */}
          <motion.div
            variants={fadeUpItem}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-brand-500 text-xs font-semibold tracking-wider">YAKINDA</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* App Store */}
              <div className="store-badge">
                <svg className="w-6 h-6 text-th-fg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-th-fg-sub leading-none">Download on the</p>
                  <p className="text-sm font-semibold text-th-fg leading-tight">App Store</p>
                </div>
              </div>

              {/* Google Play */}
              <div className="store-badge">
                <svg className="w-6 h-6 text-th-fg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-th-fg-sub leading-none">GET IT ON</p>
                  <p className="text-sm font-semibold text-th-fg leading-tight">Google Play</p>
                </div>
              </div>

              {/* AppGallery */}
              <div className="store-badge">
                <svg className="w-6 h-6 text-th-fg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-th-fg-sub leading-none">EXPLORE IT ON</p>
                  <p className="text-sm font-semibold text-th-fg leading-tight">AppGallery</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--surface)] to-transparent"
        aria-hidden="true"
      />
    </section>
  )
}
