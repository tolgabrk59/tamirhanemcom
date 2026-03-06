'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import { turkeyLocations, cityList } from '@/data/turkey-locations'
import {
  Zap,
  Search,
  Star,
  Phone,
  Navigation,
  Clock,
  Filter,
  Grid3X3,
  List,
  Heart,
  ExternalLink,
  Loader2,
  X,
  Map,
  PlugZap,
  Battery,
  BatteryCharging,
} from 'lucide-react'

interface Connector {
  type: string
  typeName: string
  powerKw: number | null
  quantity: number
}

interface ChargingStation {
  id: number
  name: string
  address: string
  rating: number | null
  reviewCount: number
  phone: string | null
  website: string | null
  hours: string | null
  latitude: number | null
  longitude: number | null
  category: string
  thumbnail: string | null
  distance: number | null
  connectors?: Connector[]
  maxPowerKw?: number | null
  operatorName?: string | null
  is24Hours?: boolean | null
  isPublic?: boolean
  usageCost?: string | null
}

type ChargingType = 'all' | 'ac' | 'dc'
type ConnectorFilter = 'all' | 'type2' | 'ccs' | 'chademo' | 'tesla'

const CONNECTOR_TYPES: Record<ConnectorFilter, { label: string; types: string[] }> = {
  all: { label: 'Tümü', types: [] },
  type2: { label: 'Type 2', types: ['TYPE2', 'Type 2'] },
  ccs: { label: 'CCS', types: ['CCS1', 'CCS2', 'CCS'] },
  chademo: { label: 'CHAdeMO', types: ['CHADEMO', 'CHAdeMO'] },
  tesla: { label: 'Tesla', types: ['TESLA_SUPERCHARGER', 'TESLA_DESTINATION', 'Tesla'] },
}

const chargingTypeCards = [
  {
    type: 'ac' as const,
    title: 'AC Şarj (Tip 2)',
    desc: '3.7-22 kW - 4-8 saat',
    icon: PlugZap,
  },
  {
    type: 'dc' as const,
    title: 'DC Hızlı Şarj',
    desc: '50-350 kW - 15-45 dk',
    icon: BatteryCharging,
  },
  {
    type: 'dc' as const,
    title: 'Tesla Supercharger',
    desc: '250 kW - 15-20 dk',
    icon: Battery,
    connectorOverride: 'tesla' as ConnectorFilter,
  },
]

export default function ŞarjİstasyonlarıPage() {
  const [stations, setStations] = useState<ChargingStation[]>([])
  const [filteredStations, setFilteredStations] = useState<ChargingStation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [city, setCity] = useState('İstanbul')
  const [district, setDistrict] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<number[]>([])
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)

  // Filters
  const [showFilters, setShowFilters] = useState(false)
  const [chargingType, setChargingType] = useState<ChargingType>('all')
  const [connectorFilter, setConnectorFilter] = useState<ConnectorFilter>('all')
  const [minPower, setMinPower] = useState<number>(0)
  const [only24Hours, setOnly24Hours] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const districts = city ? [...(turkeyLocations[city] || [])].sort() : []

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('ev-favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  const toggleFavorite = (stationId: number) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(stationId)
        ? prev.filter((id) => id !== stationId)
        : [...prev, stationId]
      localStorage.setItem('ev-favorites', JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  // Apply filters
  useEffect(() => {
    let filtered = [...stations]

    if (chargingType !== 'all') {
      filtered = filtered.filter((station) => {
        if (!station.maxPowerKw) return true
        if (chargingType === 'ac') return station.maxPowerKw <= 22
        if (chargingType === 'dc') return station.maxPowerKw > 22
        return true
      })
    }

    if (connectorFilter !== 'all') {
      const targetTypes = CONNECTOR_TYPES[connectorFilter].types
      filtered = filtered.filter((station) => {
        if (!station.connectors) return true
        return station.connectors.some((c) =>
          targetTypes.some((t) => c.type?.includes(t) || c.typeName?.includes(t))
        )
      })
    }

    if (minPower > 0) {
      filtered = filtered.filter(
        (station) => station.maxPowerKw && station.maxPowerKw >= minPower
      )
    }

    if (only24Hours) {
      filtered = filtered.filter((station) => station.is24Hours === true)
    }

    if (showOnlyFavorites) {
      filtered = filtered.filter((station) => favorites.includes(station.id))
    }

    setFilteredStations(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [stations, chargingType, connectorFilter, minPower, only24Hours, showOnlyFavorites, favorites])

  // Request location - removed (IP-based is inaccurate on desktop)

  const fetchStations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const searchQuery = district ? `${district}, ${city}` : city
      let url = `/api/ev-chargers?city=${encodeURIComponent(searchQuery)}`
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        const allStations = data.data.stations || []
        setStations(allStations)
      } else {
        setError(data.error || 'Şarj istasyonları yüklenemedi')
      }
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }, [city, district])

  useEffect(() => {
    fetchStations()
  }, [fetchStations])

  const openInMaps = (station: ChargingStation) => {
    if (station.latitude && station.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`,
        '_blank'
      )
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          station.name + ' ' + station.address
        )}`,
        '_blank'
      )
    }
  }

  const openAllInMaps = () => {
    const searchQuery = district ? `${district}, ${city}` : city
    window.open(
      `https://www.google.com/maps/search/elektrikli+arac+sarj+istasyonu+${encodeURIComponent(
        searchQuery
      )}`,
      '_blank'
    )
  }

  const formatDistance = (distance: number | null) => {
    if (!distance) return null
    if (distance < 1) return `${Math.round(distance * 1000)} m`
    return `${distance.toFixed(1)} km`
  }

  const formatPower = (power: number | null | undefined) => {
    if (!power) return null
    return power >= 1 ? `${power} kW` : `${power * 1000} W`
  }

  const getChargingTypeLabel = (power: number | null | undefined) => {
    if (!power) return null
    if (power <= 22) return { label: 'AC', colorClass: 'bg-blue-500/15 text-blue-400 border-blue-500/20' }
    if (power <= 150) return { label: 'DC', colorClass: 'bg-orange-500/15 text-orange-400 border-orange-500/20' }
    return { label: 'Ultra DC', colorClass: 'bg-red-500/15 text-red-400 border-red-500/20' }
  }

  const clearFilters = () => {
    setChargingType('all')
    setConnectorFilter('all')
    setMinPower(0)
    setOnly24Hours(false)
    setShowOnlyFavorites(false)
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredStations.length / itemsPerPage)
  const paginatedStations = filteredStations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const activeFilterCount = [
    chargingType !== 'all',
    connectorFilter !== 'all',
    minPower > 0,
    only24Hours,
    showOnlyFavorites,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-8">
        <AnimatedSection>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-sm font-medium mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Canlı Veri
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Şarj <span className="text-gold">İstasyonları</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Elektrikli aracınız için en yakın sarj noktalarını bulun
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Search Section */}
      <section className="section-container mb-8">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6 md:p-8">
            <div className="space-y-4">
              {/* City & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-th-fg mb-2 font-medium">İl</label>
                  <select
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value)
                      setDistrict('')
                    }}
                    className="input-dark appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-th-bg-alt">İl Secin</option>
                    {cityList.map((c) => (
                      <option key={c} value={c} className="bg-th-bg-alt">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-th-fg mb-2 font-medium">İlce</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={!city || districts.length === 0}
                    className="input-dark appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="" className="bg-th-bg-alt">Tüm İlçeler</option>
                    {districts.sort().map((d) => (
                      <option key={d} value={d} className="bg-th-bg-alt">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    'flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all text-sm',
                    showFilters || activeFilterCount > 0
                      ? 'bg-brand-500/15 border border-brand-500/25 text-brand-500'
                      : 'border border-th-border/20 text-th-fg-sub hover:text-brand-500 hover:border-brand-500/30'
                  )}
                >
                  <Filter className="w-5 h-5" />
                  <span className="hidden sm:inline">Filtreler</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-brand-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={fetchStations}
                  className="btn-gold py-3 text-sm"
                >
                  <Search className="w-5 h-5" />
                  Ara
                </button>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="pt-4 border-t border-th-border/10 space-y-4">
                  {/* Charging Type */}
                  <div>
                    <label className="block text-sm text-th-fg mb-2 font-medium">
                      Şarj Tipi
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: 'all' as const, label: 'Tümü' },
                        { value: 'ac' as const, label: 'AC (Yavaş)' },
                        { value: 'dc' as const, label: 'DC (Hızlı)' },
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setChargingType(type.value)}
                          className={cn(
                            'flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all border',
                            chargingType === type.value
                              ? 'bg-brand-500/10 border-brand-500 text-brand-500'
                              : 'border-th-border/10 text-th-fg-sub hover:border-brand-500/30'
                          )}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Connector Type */}
                  <div>
                    <label className="block text-sm text-th-fg mb-2 font-medium">
                      Konnektor Tipi
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(CONNECTOR_TYPES).map(([key, { label }]) => (
                        <button
                          key={key}
                          onClick={() => setConnectorFilter(key as ConnectorFilter)}
                          className={cn(
                            'px-3 py-2 rounded-xl text-sm font-medium transition-all border',
                            connectorFilter === key
                              ? 'bg-brand-500/10 border-brand-500 text-brand-500'
                              : 'border-th-border/10 text-th-fg-sub hover:border-brand-500/30'
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Min Power */}
                  <div>
                    <label className="block text-sm text-th-fg mb-2 font-medium">
                      Minimum Guc: {minPower > 0 ? `${minPower} kW` : 'Tümü'}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="350"
                      step="10"
                      value={minPower}
                      onChange={(e) => setMinPower(parseInt(e.target.value))}
                      className="w-full h-2 bg-th-overlay/10 rounded-lg appearance-none cursor-pointer accent-[#FBC91D]"
                    />
                    <div className="flex justify-between text-xs text-th-fg-muted mt-1">
                      <span>Tümü</span>
                      <span>50 kW</span>
                      <span>150 kW</span>
                      <span>350 kW</span>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={only24Hours}
                        onChange={(e) => setOnly24Hours(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#FBC91D]"
                      />
                      <span className="text-th-fg-sub text-sm">Sadece 24 Saat Açık</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showOnlyFavorites}
                        onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#FBC91D]"
                      />
                      <span className="text-th-fg-sub text-sm">
                        Sadece Favoriler ({favorites.length})
                      </span>
                    </label>
                  </div>

                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-brand-500 text-sm hover:text-brand-400 font-medium transition-colors flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Filtreleri Temizle
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Map */}
      {!loading && filteredStations.length > 0 && (
        <section className="section-container mb-8">
          <AnimatedSection delay={0.15}>
            <div className="glass-card overflow-hidden">
              <iframe
                src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=elektrikli+arac+sarj+istasyonu+${encodeURIComponent(
                  district ? `${district}, ${city}` : city
                )}&zoom=12`}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* Results Header */}
      <section className="section-container mb-6">
        <AnimatedSection delay={0.2}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold text-th-fg">
                {loading
                  ? 'Aranıyor...'
                  : filteredStations.length > 0
                    ? 'Size En Yakın Şarj İstasyonları'
                    : 'Sonuç Bulunamadı'}
              </h2>
              {!loading && filteredStations.length > 0 && (
                <p className="text-th-fg-sub text-sm mt-1">
                  {district ? `${district}, ${city}` : city} bölgesinde{' '}
                  {filteredStations.length} istasyon bulundu
                  {totalPages > 1 && ` (Sayfa ${currentPage} / ${totalPages})`}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!loading && filteredStations.length > 0 && (
                <button
                  onClick={openAllInMaps}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-th-border/20 text-th-fg-sub text-sm hover:text-brand-500 hover:border-brand-500/30 transition-all"
                >
                  <Map className="w-4 h-4" />
                  Haritada Göster
                </button>
              )}

              <div className="flex rounded-xl border border-th-border/20 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    viewMode === 'grid'
                      ? 'bg-brand-500 text-white'
                      : 'text-th-fg-muted hover:text-th-fg'
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    viewMode === 'list'
                      ? 'bg-brand-500 text-white'
                      : 'text-th-fg-muted hover:text-th-fg'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Error */}
      {error && (
        <section className="section-container mb-6">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        </section>
      )}

      {/* Loading */}
      {loading && (
        <section className="section-container mb-8">
          <div
            className={cn(
              'grid gap-6',
              viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            )}
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-th-overlay/10 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-5 bg-th-overlay/10 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-th-overlay/10 rounded w-full mb-2" />
                    <div className="h-4 bg-th-overlay/10 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stations */}
      {!loading && filteredStations.length > 0 && (
        <section className="section-container mb-12">
          <div
            className={cn(
              'grid gap-4',
              viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            )}
          >
            {paginatedStations.map((station, index) => {
              const powerInfo = getChargingTypeLabel(station.maxPowerKw)
              const isFavorite = favorites.includes(station.id)

              return (
                <AnimatedSection key={station.id} delay={0.05 + index * 0.03}>
                  <div className="glass-card overflow-hidden h-full flex flex-col group hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300">
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(station.id)
                      }}
                      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-th-overlay/20 backdrop-blur-sm transition-all hover:scale-110"
                    >
                      <Heart
                        className={cn(
                          'w-4 h-4 transition-colors',
                          isFavorite ? 'text-red-500 fill-red-500' : 'text-th-fg-muted'
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        'relative p-5 flex-1 flex flex-col',
                        viewMode === 'list' ? 'flex-row items-center gap-6' : ''
                      )}
                    >
                      {/* İcon */}
                      <div className={cn(viewMode === 'list' ? 'flex-shrink-0' : 'mb-4', 'relative')}>
                        <div className="w-14 h-14 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Zap className="w-7 h-7 text-brand-500" />
                        </div>
                        {station.distance && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500/15 border border-green-500/25 text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {formatDistance(station.distance)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className={cn(viewMode === 'list' ? 'flex-1 min-w-0' : 'flex-1')}>
                        <div className="flex items-start gap-2 mb-1">
                          <h3 className="font-display font-bold text-th-fg text-base group-hover:text-brand-500 transition-colors truncate flex-1">
                            {station.name}
                          </h3>
                          {powerInfo && (
                            <span
                              className={cn(
                                'text-xs font-bold px-2 py-0.5 rounded-full border flex-shrink-0',
                                powerInfo.colorClass
                              )}
                            >
                              {powerInfo.label}
                            </span>
                          )}
                        </div>

                        {station.operatorName && (
                          <p className="text-brand-500 text-sm font-medium truncate">
                            {station.operatorName}
                          </p>
                        )}

                        <p className="text-th-fg-sub text-sm mt-1 line-clamp-2">
                          {station.address}
                        </p>

                        {/* Connectors */}
                        {station.connectors && station.connectors.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {station.connectors.slice(0, 3).map((conn, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 bg-th-overlay/5 border border-th-border/10 text-th-fg-sub text-xs px-2 py-1 rounded-lg"
                              >
                                {conn.typeName || conn.type}
                                {conn.powerKw && (
                                  <span className="text-brand-500 font-medium">
                                    {conn.powerKw}kW
                                  </span>
                                )}
                              </span>
                            ))}
                            {station.connectors.length > 3 && (
                              <span className="text-th-fg-muted text-xs px-1">
                                +{station.connectors.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* İnfo Row */}
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          {station.maxPowerKw && (
                            <div className="flex items-center gap-1.5 text-brand-500 text-sm">
                              <Zap className="w-4 h-4" />
                              {formatPower(station.maxPowerKw)}
                            </div>
                          )}

                          {station.rating && (
                            <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-brand-500 fill-brand-500" />
                              <span className="text-th-fg font-medium text-sm">
                                {station.rating}
                              </span>
                              <span className="text-th-fg-muted text-sm">
                                ({station.reviewCount})
                              </span>
                            </div>
                          )}

                          {station.is24Hours && (
                            <span className="text-green-400 text-xs font-medium bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                              24 Saat
                            </span>
                          )}

                          {station.phone && (
                            <a
                              href={`tel:${station.phone}`}
                              className="flex items-center gap-1.5 text-th-fg-muted hover:text-brand-500 transition-colors text-sm"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                        </div>

                        {station.usageCost && (
                          <p className="text-th-fg-muted text-xs mt-2 truncate">
                            {station.usageCost}
                          </p>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className={cn(viewMode === 'list' ? 'flex-shrink-0' : 'mt-4')}>
                        <button
                          onClick={() => openInMaps(station)}
                          className="btn-gold w-full py-3 text-sm"
                        >
                          <Navigation className="w-4 h-4" />
                          Yol Tarifi
                        </button>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </section>
      )}

      {/* Pagination */}
      {!loading && filteredStations.length > 0 && totalPages > 1 && (
        <section className="section-container mb-12">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn-gold px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Önceki
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'w-10 h-10 rounded-xl font-medium transition-all',
                  currentPage === page
                    ? 'bg-brand-500 text-white'
                    : 'border border-th-border/20 text-th-fg-sub hover:text-brand-500 hover:border-brand-500/30'
                )}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn-gold px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sonraki →
            </button>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && filteredStations.length === 0 && !error && (
        <section className="section-container mb-12">
          <div className="glass-card p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-brand-500" />
            </div>
            <h3 className="text-xl font-display font-bold text-th-fg mb-3">
              {showOnlyFavorites
                ? 'Favori İstasyonunuz Yok'
                : 'Şarj İstasyonu Bulunamadi'}
            </h3>
            <p className="text-th-fg-sub max-w-md mx-auto mb-4">
              {showOnlyFavorites
                ? 'Henuz favori istasyon eklemediniz. Kalp ikonuna tiklayarak favorilerinize ekleyebilirsiniz.'
                : activeFilterCount > 0
                  ? 'Secili filtrelerle eslesen istasyon bulunamadi. Filtreleri temizlemeyi deneyin.'
                  : `${district ? `${district}, ${city}` : city} için sarj istasyonu bulunamadi. Farkli bir ilce deneyin.`}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-brand-500 hover:text-brand-400 font-medium text-sm"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>
        </section>
      )}

      {/* Charging Type İnfo Cards */}
      <section className="section-container">
        <AnimatedSection delay={0.1}>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-3">
              Şarj <span className="text-gold">Tipleri</span>
            </h2>
            <p className="text-th-fg-sub text-sm">Aracınıza uygun sarj tipini seçin</p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {chargingTypeCards.map((item, i) => (
            <AnimatedSection key={item.title} delay={0.15 + i * 0.08}>
              <button
                onClick={() => {
                  if (item.connectorOverride) {
                    setConnectorFilter(item.connectorOverride)
                  }
                  setChargingType(item.type)
                  setShowFilters(true)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="glass-card p-6 w-full text-left hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-brand-500" />
                </div>
                <h3 className="text-th-fg font-display font-bold text-lg">{item.title}</h3>
                <p className="text-th-fg-sub text-sm mt-1">{item.desc}</p>
              </button>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </div>
  )
}
