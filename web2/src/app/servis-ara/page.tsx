'use client'

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  MapPin,
  Star,
  Phone,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  SlidersHorizontal,
  Shield,
  Truck,
  X,
  Wrench,
  ChevronDown as ChevronDownIcon,
  LayoutGrid,
  List,
  LocateFixed,
} from 'lucide-react'
import Image from 'next/image'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import { isServiceOpen } from '@/lib/service-utils'
import ServiceDetailPanel from '@/components/service-search/ServiceDetailPanel'
import { cityList, getDistrictsByCity } from '@/data/turkey-locations'

interface ServiceResult {
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
  categories: string[]
  description: string
  address: string
  working_hours: any
}

interface CategoryItem {
  id: number
  name: string
  slug: string
  category_type: string | null
}

// category_type null → 'industrial' (Oto Servis) olarak eşlenir
const CATEGORY_TYPE_KEY = (type: string | null): string => type || 'industrial'

const CATEGORY_TYPES = [
  { key: 'industrial', label: 'Oto Servis' },
  { key: 'car_wash', label: 'Oto Yıkama' },
  { key: 'roadside', label: 'Oto Yol Yardım' },
  { key: 'car_rental', label: 'Oto Kiralama' },
  { key: 'insurance', label: 'Oto Sigorta' },
] as const

const CATEGORY_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORY_TYPES.map((t) => [t.key, t.label])
)

interface BrandItem {
  brand: string
}

const ITEMS_PER_PAGE = 10
const MAX_VISIBLE_CATEGORIES = 3

type ViewMode = 'grid' | 'list'

function ServiceCard({
  service,
  openStatus,
  viewMode = 'grid',
  onDetailClick,
}: {
  service: ServiceResult
  openStatus: { isOpen: boolean; nextTime: string | null; closingTime: string | null }
  viewMode?: ViewMode
  onDetailClick: (service: ServiceResult) => void
}) {
  const [showAllCats, setShowAllCats] = useState(false)
  const visibleCats = showAllCats ? service.categories : service.categories.slice(0, MAX_VISIBLE_CATEGORIES)
  const hiddenCount = service.categories.length - MAX_VISIBLE_CATEGORIES

  // ── LIST VIEW ──
  if (viewMode === 'list') {
    return (
      <motion.div
        className="glass-card overflow-hidden h-full flex flex-row"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {/* Image - side */}
        <div className="relative w-48 shrink-0 bg-th-bg-alt overflow-hidden hidden sm:block">
          {service.pic ? (
            <Image
              src={service.pic}
              alt={service.name}
              fill
              className="object-cover"
              sizes="192px"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-th-bg-alt to-th-bg-alt flex items-center justify-center">
              <Wrench className="w-8 h-8 text-th-fg-muted" />
            </div>
          )}
          {service.is_official_service && (
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-brand-500/20 text-brand-400 border border-brand-500/30 backdrop-blur-md">
                <Shield className="w-2.5 h-2.5" />
                Yetkili
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="text-base font-display font-bold text-th-fg truncate">
                {service.name}
              </h3>
              {service.provides_roadside_assistance && (
                <Truck className="w-3.5 h-3.5 text-green-400 shrink-0" />
              )}
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0',
                openStatus.isOpen
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', openStatus.isOpen ? 'bg-green-500' : 'bg-red-500')} />
              {openStatus.isOpen ? 'Açık' : 'Kapalı'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm mb-3">
            <div className="flex items-center gap-1.5 text-th-fg-sub">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{service.location || service.address}</span>
            </div>
            {service.rating && (
              <div className="flex items-center gap-1 shrink-0">
                <Star className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
                <span className="text-sm font-semibold text-th-fg">{service.rating}</span>
                {service.rating_count && (
                  <span className="text-xs text-th-fg-muted">({service.rating_count})</span>
                )}
              </div>
            )}
          </div>

          {/* Categories */}
          {service.categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {visibleCats.map((cat) => (
                <span key={cat} className="badge-gold text-[10px] px-2 py-0.5">
                  {cat}
                </span>
              ))}
              {hiddenCount > 0 && !showAllCats && (
                <button
                  type="button"
                  onClick={() => setShowAllCats(true)}
                  className="inline-flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300 transition-colors"
                >
                  +{hiddenCount} daha
                  <ChevronDownIcon className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-th-border/5">
            {service.phone ? (
              <a href={`tel:${service.phone}`} className="flex items-center gap-1.5 text-th-fg-sub text-sm hover:text-brand-400 transition-colors">
                <Phone className="w-3.5 h-3.5" />
                <span>{service.phone}</span>
              </a>
            ) : (
              <div />
            )}
            <button onClick={() => onDetailClick(service)} className="btn-ghost px-4 py-1.5 text-xs">
              Detay
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  // ── GRID VIEW ──
  return (
    <motion.div
      className="glass-card overflow-hidden h-full flex flex-col"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Service Image */}
      <div className="relative w-full h-36 bg-th-bg-alt overflow-hidden">
        {service.pic ? (
          <Image
            src={service.pic}
            alt={service.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-th-bg-alt to-th-bg-alt flex items-center justify-center">
            <Wrench className="w-8 h-8 text-th-fg-muted" />
          </div>
        )}
        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md',
              openStatus.isOpen
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', openStatus.isOpen ? 'bg-green-500' : 'bg-red-500')} />
            {openStatus.isOpen ? 'Açık' : 'Kapalı'}
          </span>
        </div>
        {/* Official badge */}
        {service.is_official_service && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-brand-500/20 text-brand-400 border border-brand-500/30 backdrop-blur-md">
              <Shield className="w-2.5 h-2.5" />
              Yetkili
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-1.5">
          <h3 className="text-sm font-display font-bold text-th-fg truncate">
            {service.name}
          </h3>
          {service.provides_roadside_assistance && (
            <Truck className="w-3.5 h-3.5 text-green-400 shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-1.5 text-th-fg-sub text-xs mb-2">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{service.location || service.address}</span>
        </div>

        {/* Rating */}
        {service.rating && (
          <div className="flex items-center gap-1.5 mb-3">
            <Star className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
            <span className="text-xs font-semibold text-th-fg">{service.rating}</span>
            {service.rating_count && (
              <span className="text-[10px] text-th-fg-muted">({service.rating_count})</span>
            )}
          </div>
        )}

        {/* Categories */}
        {service.categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {visibleCats.map((cat) => (
              <span key={cat} className="badge-gold text-[9px] px-1.5 py-0.5">
                {cat}
              </span>
            ))}
            {hiddenCount > 0 && !showAllCats && (
              <button
                type="button"
                onClick={() => setShowAllCats(true)}
                className="inline-flex items-center gap-0.5 text-[10px] text-brand-400 hover:text-brand-300 transition-colors"
              >
                +{hiddenCount} daha
                <ChevronDownIcon className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-th-border/5">
          {service.phone ? (
            <a href={`tel:${service.phone}`} className="flex items-center gap-1 text-th-fg-sub text-[11px] hover:text-brand-400 transition-colors">
              <Phone className="w-3 h-3" />
              <span className="hidden xl:inline">{service.phone}</span>
              <span className="xl:hidden">Ara</span>
            </a>
          ) : (
            <div />
          )}
          <button onClick={() => onDetailClick(service)} className="btn-ghost px-3 py-1.5 text-[11px]">
            Detay
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function ServisAraContent() {
  const searchParams = useSearchParams()

  // Filter states - initialized from URL params (defaults: Tekirdağ / Çorlu)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCategoryType, setSelectedCategoryType] = useState(searchParams.get('tip') || 'car_wash')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('kategori') || '')
  const [selectedCity, setSelectedCity] = useState(() => {
    const konumParam = searchParams.get('konum')
    if (!konumParam) return 'Tekirdağ'
    // Doğrudan şehir listesinde var mı?
    if (cityList.includes(konumParam)) return konumParam
    // Normalize ile eşleştir
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
    const normalizedParam = normalize(konumParam)
    const matched = cityList.find((c) => normalize(c) === normalizedParam)
    if (matched) return matched
    // İlçe olabilir — tüm şehirlerde ara
    for (const city of cityList) {
      const districts = getDistrictsByCity(city)
      const distMatch = districts.find((d) => normalize(d) === normalizedParam)
      if (distMatch) return city
    }
    return 'Tekirdağ'
  })
  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    const konumParam = searchParams.get('konum')
    if (!konumParam) return 'Çorlu'
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
    const normalizedParam = normalize(konumParam)
    // İlçe olarak eşleşiyor mu?
    for (const city of cityList) {
      const districts = getDistrictsByCity(city)
      const distMatch = districts.find((d) => normalize(d) === normalizedParam)
      if (distMatch) return distMatch
    }
    return 'Çorlu'
  })
  const [selectedBrand, setSelectedBrand] = useState('')
  const [showOpenOnly, setShowOpenOnly] = useState(false)
  const [showOfficialOnly, setShowOfficialOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'rating' | 'reviews'>('rating')
  const [locationDetecting, setLocationDetecting] = useState(false)
  const [locationDetected, setLocationDetected] = useState(false)

  // Data states
  const [services, setServices] = useState<ServiceResult[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [brands, setBrands] = useState<BrandItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasSearched, setHasSearched] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedService, setSelectedService] = useState<ServiceResult | null>(null)

  // Match geolocation city name to our static city list
  const matchCity = useCallback((geoCity: string): string => {
    if (!geoCity) return ''
    // Exact match first
    if (cityList.includes(geoCity)) return geoCity
    // Normalize and try case-insensitive match
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
    const normalizedGeo = normalize(geoCity)
    return cityList.find((c) => normalize(c) === normalizedGeo) || ''
  }, [])

  // Match district name to city's district list
  const matchDistrict = useCallback((city: string, geoDistrict: string): string => {
    if (!city || !geoDistrict) return ''
    const districts = getDistrictsByCity(city)
    if (districts.includes(geoDistrict)) return geoDistrict
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
    const normalizedGeo = normalize(geoDistrict)
    return districts.find((d) => normalize(d) === normalizedGeo) || ''
  }, [])

  // Auto-detect location via IP
  const detectLocation = useCallback(async () => {
    setLocationDetecting(true)
    try {
      const res = await fetch('/api/geolocation')
      const data = await res.json()
      if (data.success && data.city) {
        const matchedCity = matchCity(data.city)
        if (matchedCity) {
          setSelectedCity(matchedCity)
          const matchedDistrict = matchDistrict(matchedCity, data.district || '')
          if (matchedDistrict) setSelectedDistrict(matchedDistrict)
          setLocationDetected(true)
        }
      }
    } catch {
      // Silent fail
    } finally {
      setLocationDetecting(false)
    }
  }, [matchCity, matchDistrict])

  // Fetch categories, brands and auto-detect location on mount
  useEffect(() => {
    async function fetchFilters() {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands?vehicleType=otomobil'),
        ])
        const catData = await catRes.json()
        const brandData = await brandRes.json()

        if (catData.success) setCategories(catData.data || [])
        if (brandData.success) setBrands(brandData.data || [])
      } catch {
        // Filters failed silently
      }
    }
    fetchFilters()

    // Auto-detect location only if user explicitly requests it (button click)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Search function
  const handleSearch = useCallback(async () => {
    setLoading(true)
    setError(null)
    setCurrentPage(1)
    setHasSearched(true)

    try {
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.set('q', searchQuery.trim())
      if (selectedCity.trim()) params.set('city', selectedCity.trim())
      if (selectedDistrict.trim()) params.set('district', selectedDistrict.trim())
      if (selectedBrand) params.set('brand', selectedBrand)

      // Kategori filtreleme: alt kategori seçiliyse onu, yoksa tüm category_type kategorilerini gönder
      if (selectedCategory) {
        params.set('category', selectedCategory)
      } else if (selectedCategoryType) {
        const typeCategories = categories
          .filter((c) => CATEGORY_TYPE_KEY(c.category_type) === selectedCategoryType)
          .map((c) => c.name)
          .filter((n) => n !== 'Tüm Kategoriler' && n !== 'Diğer')
        if (typeCategories.length > 0) {
          params.set('categories', typeCategories.join(','))
        }
        // Kategori adları bulunamadıysa (category_type boş veya categories henüz yüklenmemiş)
        // categoryType parametresi ile API tarafında anahtar kelime tabanlı filtreleme yap
        params.set('categoryType', selectedCategoryType)
      }

      const res = await fetch(`/api/services/search?${params.toString()}`)
      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || 'Servisler yüklenemedi')
      }

      setServices(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      setServices([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedCity, selectedDistrict, selectedCategory, selectedCategoryType, selectedBrand, categories])

  // Auto-search if URL has params
  useEffect(() => {
    if (searchParams.get('q') || searchParams.get('kategori') || searchParams.get('konum')) {
      handleSearch()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Filter & sort services client-side
  const processedServices = services
    .filter((s) => {
      if (showOpenOnly) {
        const status = isServiceOpen(s.working_hours)
        if (!status.isOpen) return false
      }
      if (showOfficialOnly && !s.is_official_service) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
      if (sortBy === 'reviews') return (b.rating_count || 0) - (a.rating_count || 0)
      return 0
    })

  // Pagination
  const totalPages = Math.ceil(processedServices.length / ITEMS_PER_PAGE)
  const paginatedServices = processedServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  // Filter categories by selected category type
  const filteredCategories = useMemo(() => {
    if (!selectedCategoryType) return []
    return categories.filter((cat) => {
      return CATEGORY_TYPE_KEY(cat.category_type) === selectedCategoryType
    })
  }, [categories, selectedCategoryType])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategoryType('')
    setSelectedCategory('')
    setSelectedCity('')
    setSelectedDistrict('')
    setSelectedBrand('')
    setShowOpenOnly(false)
    setShowOfficialOnly(false)
    setLocationDetected(false)
  }

  const hasActiveFilters =
    searchQuery || selectedCategoryType || selectedCategory || selectedCity || selectedDistrict || selectedBrand || showOpenOnly || showOfficialOnly

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Servis <span className="text-gold">Ara</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Aracın için en uygun ve güvenilir servisi bul, hızlıca randevu al.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Search & Filter Section */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.1}>
          <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-3">
              {/* Search Input */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-sub" />
                <input
                  type="text"
                  placeholder="Servis adı veya hizmet ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-dark pl-9"
                />
              </div>

              {/* Category Type Select */}
              <div className="relative">
                <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-th-fg-sub pointer-events-none z-10" />
                <select
                  value={selectedCategoryType}
                  onChange={(e) => {
                    setSelectedCategoryType(e.target.value)
                    setSelectedCategory('')
                  }}
                  className="input-dark pl-8 pr-7 appearance-none cursor-pointer text-xs"
                >
                  <option value="">Ana Kategori</option>
                  {CATEGORY_TYPES.map((type) => (
                    <option key={type.key} value={type.key}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-th-fg-muted pointer-events-none" />
              </div>

              {/* Sub-Category Select */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={!selectedCategoryType}
                  className={cn(
                    'input-dark pr-7 appearance-none cursor-pointer text-xs',
                    !selectedCategoryType && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <option value="">
                    {selectedCategoryType ? 'Alt Kategori' : 'Önce ana kategori seçin'}
                  </option>
                  {filteredCategories
                    .filter((cat) => cat.name !== 'Tüm Kategoriler' && cat.name !== 'Diğer')
                    .map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-th-fg-muted pointer-events-none" />
              </div>

              {/* City Select */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-th-fg-sub pointer-events-none z-10" />
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value)
                    setSelectedDistrict('')
                    setLocationDetected(false)
                  }}
                  className={cn('input-dark pl-8 pr-7 appearance-none cursor-pointer text-xs', locationDetected && 'border-brand-500/30')}
                >
                  <option value="">İl</option>
                  {cityList.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {locationDetected ? (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2">
                    <LocateFixed className="w-3 h-3 text-brand-500" />
                  </span>
                ) : (
                  <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-th-fg-muted pointer-events-none" />
                )}
              </div>

              {/* District Select */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-th-fg-muted pointer-events-none z-10" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value)
                    setLocationDetected(false)
                  }}
                  disabled={!selectedCity}
                  className={cn(
                    'input-dark pl-8 pr-7 appearance-none cursor-pointer text-xs',
                    locationDetected && 'border-brand-500/30',
                    !selectedCity && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <option value="">
                    {selectedCity ? 'İlçe' : 'Önce il seçin'}
                  </option>
                  {selectedCity && getDistrictsByCity(selectedCity).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {locationDetected && selectedDistrict ? (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2">
                    <LocateFixed className="w-3 h-3 text-brand-500" />
                  </span>
                ) : (
                  <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-th-fg-muted pointer-events-none" />
                )}
              </div>

              {/* Brand Select */}
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="input-dark appearance-none cursor-pointer pr-7 text-xs"
                >
                  <option value="">Marka</option>
                  {brands.map((b) => (
                    <option key={b.brand} value={b.brand}>
                      {b.brand}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-th-fg-muted pointer-events-none" />
              </div>
            </div>

            {/* Location Detection Info */}
            {locationDetected && (
              <div className="mt-3 flex items-center gap-2 text-xs text-brand-400">
                <LocateFixed className="w-3 h-3" />
                <span>Konumunuz otomatik tespit edildi</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCity('')
                    setSelectedDistrict('')
                    setLocationDetected(false)
                  }}
                  className="text-th-fg-muted hover:text-th-fg transition-colors ml-1"
                >
                  (Temizle)
                </button>
              </div>
            )}
            {!locationDetected && !selectedCity && !locationDetecting && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={detectLocation}
                  className="inline-flex items-center gap-1.5 text-xs text-th-fg-sub hover:text-brand-400 transition-colors"
                >
                  <LocateFixed className="w-3 h-3" />
                  Konumumu otomatik tespit et
                </button>
              </div>
            )}
            {locationDetecting && (
              <div className="mt-3 flex items-center gap-2 text-xs text-th-fg-muted">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Konum tespit ediliyor...</span>
              </div>
            )}

            {/* Extra Filters & Search Button */}
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Open Only Toggle */}
                <button
                  type="button"
                  onClick={() => setShowOpenOnly(!showOpenOnly)}
                  className={cn(
                    'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                    showOpenOnly
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-th-overlay/[0.03] border-th-border/[0.06] text-th-fg-sub hover:border-th-border/10'
                  )}
                >
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      showOpenOnly ? 'bg-green-500' : 'bg-th-fg-muted'
                    )}
                  />
                  Sadece Açık
                </button>

                {/* Official Only Toggle */}
                <button
                  type="button"
                  onClick={() => setShowOfficialOnly(!showOfficialOnly)}
                  className={cn(
                    'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                    showOfficialOnly
                      ? 'bg-brand-500/10 border-brand-500/30 text-brand-400'
                      : 'bg-th-overlay/[0.03] border-th-border/[0.06] text-th-fg-sub hover:border-th-border/10'
                  )}
                >
                  <Shield className="w-3 h-3" />
                  Yetkili Servis
                </button>

                {/* Sort */}
                <div className="flex items-center gap-1 text-xs text-th-fg-muted">
                  <SlidersHorizontal className="w-3 h-3" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'rating' | 'reviews')}
                    className="bg-transparent border-none text-th-fg-sub text-xs cursor-pointer outline-none"
                  >
                    <option value="rating">Puana Göre</option>
                    <option value="reviews">Yoruma Göre</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Temizle
                  </button>
                )}
              </div>

              <button type="submit" className="btn-gold px-10 py-3 text-sm shrink-0" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Aranıyor...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Ara
                  </>
                )}
              </button>
            </div>
          </form>
        </AnimatedSection>
      </section>

      {/* Results Section */}
      <section className="section-container">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
            <p className="text-th-fg-sub">Servisler aranıyor...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <AnimatedSection>
            <div className="glass-card p-12 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-th-fg mb-2">Bir hata oluştu</h3>
              <p className="text-th-fg-sub mb-6">{error}</p>
              <button onClick={handleSearch} className="btn-gold px-6 py-2 text-sm">
                Tekrar Dene
              </button>
            </div>
          </AnimatedSection>
        )}

        {/* Results */}
        {!loading && !error && hasSearched && (
          <>
            <AnimatedSection delay={0.2}>
              <div className="flex items-center justify-between mb-6">
                <p className="text-th-fg-sub">
                  <span className="text-th-fg font-semibold">{processedServices.length}</span> servis
                  bulundu
                </p>
                <div className="flex items-center gap-1 bg-th-overlay/[0.03] border border-th-border/[0.06] rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-1.5 rounded-md transition-all',
                      viewMode === 'grid'
                        ? 'bg-brand-500/15 text-brand-400'
                        : 'text-th-fg-muted hover:text-th-fg'
                    )}
                    title="Grid görünüm"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-1.5 rounded-md transition-all',
                      viewMode === 'list'
                        ? 'bg-brand-500/15 text-brand-400'
                        : 'text-th-fg-muted hover:text-th-fg'
                    )}
                    title="Liste görünüm"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </AnimatedSection>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'gap-5',
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'flex flex-col'
                )}
              >
                {paginatedServices.map((service, index) => {
                  const openStatus = isServiceOpen(service.working_hours)

                  return (
                    <AnimatedSection key={service.id} delay={0.05 + index * 0.03}>
                      <ServiceCard service={service} openStatus={openStatus} viewMode={viewMode} onDetailClick={setSelectedService} />
                    </AnimatedSection>
                  )
                })}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {processedServices.length === 0 && (
              <AnimatedSection>
                <div className="glass-card p-12 text-center">
                  <Search className="w-12 h-12 text-th-fg-muted mx-auto mb-4" />
                  <h3 className="text-xl font-display font-bold text-th-fg mb-2">
                    Sonuç bulunamadı
                  </h3>
                  <p className="text-th-fg-sub">
                    Farklı filtreler deneyerek tekrar arayabilirsiniz.
                  </p>
                </div>
              </AnimatedSection>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <AnimatedSection delay={0.3}>
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-th-border/10 text-th-fg-sub hover:border-brand-500/30 hover:text-brand-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page: number
                    if (totalPages <= 5) {
                      page = i + 1
                    } else if (currentPage <= 3) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i
                    } else {
                      page = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all',
                          currentPage === page
                            ? 'bg-brand-500 text-th-fg-invert'
                            : 'border border-th-border/10 text-th-fg-sub hover:border-brand-500/30 hover:text-brand-500'
                        )}
                      >
                        {page}
                      </button>
                    )
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="text-th-fg-muted px-1">...</span>
                  )}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-th-border/10 text-th-fg-sub hover:border-brand-500/30 hover:text-brand-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-center text-xs text-th-fg-muted mt-3">
                  Sayfa {currentPage} / {totalPages}
                </p>
              </AnimatedSection>
            )}
          </>
        )}

        {/* Initial State - Before Search */}
        {!loading && !error && !hasSearched && (
          <AnimatedSection>
            <div className="glass-card p-12 text-center">
              <Search className="w-12 h-12 text-th-fg-muted mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-th-fg mb-2">Servis Aramaya Başla</h3>
              <p className="text-th-fg-sub">
                Filtreleri kullanarak veya doğrudan arayarak servis bulabilirsiniz.
              </p>
            </div>
          </AnimatedSection>
        )}
      </section>

      {/* Service Detail Panel */}
      <ServiceDetailPanel
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
      />
    </div>
  )
}

export default function ServisAraPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        </div>
      }
    >
      <ServisAraContent />
    </Suspense>
  )
}
