'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { turkeyLocations, cityList } from '@/data/turkey-locations';

interface Connector {
  type: string;
  typeName: string;
  powerKw: number | null;
  quantity: number;
}

interface ChargingStation {
  id: number;
  name: string;
  address: string;
  rating: number | null;
  reviewCount: number;
  phone: string | null;
  website: string | null;
  hours: string | null;
  latitude: number | null;
  longitude: number | null;
  category: string;
  thumbnail: string | null;
  distance: number | null;
  connectors?: Connector[];
  maxPowerKw?: number | null;
  operatorName?: string | null;
  is24Hours?: boolean | null;
  isPublic?: boolean;
  usageCost?: string | null;
}

type ChargingType = 'all' | 'ac' | 'dc';
type ConnectorFilter = 'all' | 'type2' | 'ccs' | 'chademo' | 'tesla';

const CONNECTOR_TYPES: Record<ConnectorFilter, { label: string; types: string[] }> = {
  all: { label: 'Tümü', types: [] },
  type2: { label: 'Type 2', types: ['TYPE2', 'Type 2'] },
  ccs: { label: 'CCS', types: ['CCS1', 'CCS2', 'CCS'] },
  chademo: { label: 'CHAdeMO', types: ['CHADEMO', 'CHAdeMO'] },
  tesla: { label: 'Tesla', types: ['TESLA_SUPERCHARGER', 'TESLA_DESTINATION', 'Tesla'] },
};

export default function SarjIstasyonlariPage() {
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [filteredStations, setFilteredStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('İstanbul');
  const [district, setDistrict] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [locationRequested, setLocationRequested] = useState(false);

  // Yeni filtreler
  const [showFilters, setShowFilters] = useState(false);
  const [chargingType, setChargingType] = useState<ChargingType>('all');
  const [connectorFilter, setConnectorFilter] = useState<ConnectorFilter>('all');
  const [minPower, setMinPower] = useState<number>(0);
  const [only24Hours, setOnly24Hours] = useState(false);

  // Favoriler
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // İlçeleri şehre göre al
  const districts = city ? turkeyLocations[city] || [] : [];

  // Favorileri localStorage'dan yükle
  useEffect(() => {
    const savedFavorites = localStorage.getItem('ev-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Favorileri kaydet
  const toggleFavorite = (stationId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(stationId)
        ? prev.filter(id => id !== stationId)
        : [...prev, stationId];
      localStorage.setItem('ev-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // Filtreleri uygula
  useEffect(() => {
    let filtered = [...stations];

    // Şarj tipi filtresi
    if (chargingType !== 'all') {
      filtered = filtered.filter(station => {
        if (!station.maxPowerKw) return true;
        if (chargingType === 'ac') return station.maxPowerKw <= 22;
        if (chargingType === 'dc') return station.maxPowerKw > 22;
        return true;
      });
    }

    // Konnektör filtresi
    if (connectorFilter !== 'all') {
      const targetTypes = CONNECTOR_TYPES[connectorFilter].types;
      filtered = filtered.filter(station => {
        if (!station.connectors) return true;
        return station.connectors.some(c =>
          targetTypes.some(t => c.type?.includes(t) || c.typeName?.includes(t))
        );
      });
    }

    // Minimum güç filtresi
    if (minPower > 0) {
      filtered = filtered.filter(station =>
        station.maxPowerKw && station.maxPowerKw >= minPower
      );
    }

    // 24 saat filtresi
    if (only24Hours) {
      filtered = filtered.filter(station => station.is24Hours === true);
    }

    // Favoriler filtresi
    if (showOnlyFavorites) {
      filtered = filtered.filter(station => favorites.includes(station.id));
    }

    setFilteredStations(filtered);
  }, [stations, chargingType, connectorFilter, minPower, only24Hours, showOnlyFavorites, favorites]);

  // Sayfa yüklendiğinde konum iste
  useEffect(() => {
    if (!locationRequested && navigator.geolocation) {
      setLocationRequested(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Konum alınamadı');
          }
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
      );
    }
  }, [locationRequested]);

  const fetchStations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const searchQuery = district ? `${district}, ${city}` : city;
      let url = `/api/ev-chargers?city=${encodeURIComponent(searchQuery)}`;

      if (userLocation) {
        url += `&lat=${userLocation.lat}&lng=${userLocation.lng}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        // Sadece ilk 6 sonucu göster
        const limitedStations = (data.data.stations || []).slice(0, 6);
        setStations(limitedStations);
      } else {
        setError(data.error || 'Şarj istasyonları yüklenemedi');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }, [city, district, userLocation]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const openInMaps = (station: ChargingStation) => {
    if (station.latitude && station.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.name + ' ' + station.address)}`, '_blank');
    }
  };

  const openAllInMaps = () => {
    const searchQuery = district ? `${district}, ${city}` : city;
    window.open(`https://www.google.com/maps/search/elektrikli+araç+şarj+istasyonu+${encodeURIComponent(searchQuery)}`, '_blank');
  };

  const formatDistance = (distance: number | null) => {
    if (!distance) return null;
    if (distance < 1) return `${Math.round(distance * 1000)} m`;
    return `${distance.toFixed(1)} km`;
  };

  const formatPower = (power: number | null | undefined) => {
    if (!power) return null;
    return power >= 1 ? `${power} kW` : `${power * 1000} W`;
  };

  const getChargingTypeLabel = (power: number | null | undefined) => {
    if (!power) return null;
    if (power <= 22) return { label: 'AC', color: 'bg-blue-500' };
    if (power <= 150) return { label: 'DC', color: 'bg-orange-500' };
    return { label: 'Ultra DC', color: 'bg-red-500' };
  };

  const clearFilters = () => {
    setChargingType('all');
    setConnectorFilter('all');
    setMinPower(0);
    setOnly24Hours(false);
    setShowOnlyFavorites(false);
  };

  const activeFilterCount = [
    chargingType !== 'all',
    connectorFilter !== 'all',
    minPower > 0,
    only24Hours,
    showOnlyFavorites,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">
                {userLocation ? 'Konum Alındı • Uzaklığa Göre Sıralı' : 'Canlı Veri'}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Elektrikli Araç Şarj İstasyonları
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Elektrikli aracınız için en yakın şarj noktalarını bulun
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
              <div className="space-y-4">
                {/* İl ve İlçe Seçimi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-secondary-600 text-xs font-medium mb-2">İl</label>
                    <select
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setDistrict('');
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-secondary-200 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    >
                      <option value="">İl Seçin</option>
                      {cityList.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-secondary-600 text-xs font-medium mb-2">İlçe</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      disabled={!city || districts.length === 0}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-secondary-200 text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Tüm İlçeler</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Butonlar */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                            setCity('');
                            setDistrict('');
                          },
                          () => alert('Konum alınamadı. Lütfen tarayıcı ayarlarından konum iznini verin.'),
                          { enableHighAccuracy: true, timeout: 10000 }
                        );
                      }
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                      userLocation
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-secondary-700 hover:bg-gray-200 border border-secondary-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="hidden sm:inline">{userLocation ? 'Konum Alındı' : 'Konumumu Kullan'}</span>
                  </button>

                  {/* Filtreler Butonu */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                      showFilters || activeFilterCount > 0
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-secondary-700 hover:bg-gray-200 border border-secondary-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="hidden sm:inline">Filtreler</span>
                    {activeFilterCount > 0 && (
                      <span className="bg-white text-primary-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={fetchStations}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Ara
                  </button>
                </div>

                {/* Filtre Paneli */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-secondary-100 space-y-4">
                        {/* Şarj Tipi */}
                        <div>
                          <label className="block text-secondary-600 text-xs font-medium mb-2">Şarj Tipi</label>
                          <div className="flex gap-2">
                            {[
                              { value: 'all', label: 'Tümü' },
                              { value: 'ac', label: 'AC (Yavaş)' },
                              { value: 'dc', label: 'DC (Hızlı)' },
                            ].map((type) => (
                              <button
                                key={type.value}
                                onClick={() => setChargingType(type.value as ChargingType)}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                  chargingType === type.value
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-secondary-700 hover:bg-gray-200'
                                }`}
                              >
                                {type.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Konnektör Tipi */}
                        <div>
                          <label className="block text-secondary-600 text-xs font-medium mb-2">Konnektör Tipi</label>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(CONNECTOR_TYPES).map(([key, { label }]) => (
                              <button
                                key={key}
                                onClick={() => setConnectorFilter(key as ConnectorFilter)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                  connectorFilter === key
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-secondary-700 hover:bg-gray-200'
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Minimum Güç */}
                        <div>
                          <label className="block text-secondary-600 text-xs font-medium mb-2">
                            Minimum Güç: {minPower > 0 ? `${minPower} kW` : 'Tümü'}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="350"
                            step="10"
                            value={minPower}
                            onChange={(e) => setMinPower(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                          />
                          <div className="flex justify-between text-xs text-secondary-500 mt-1">
                            <span>Tümü</span>
                            <span>50 kW</span>
                            <span>150 kW</span>
                            <span>350 kW</span>
                          </div>
                        </div>

                        {/* Toggle Seçenekler */}
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={only24Hours}
                              onChange={(e) => setOnly24Hours(e.target.checked)}
                              className="w-4 h-4 rounded border-secondary-300 bg-white text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-secondary-700 text-sm">Sadece 24 Saat Açık</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showOnlyFavorites}
                              onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                              className="w-4 h-4 rounded border-secondary-300 bg-white text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-secondary-700 text-sm">Sadece Favoriler ({favorites.length})</span>
                          </label>
                        </div>

                        {/* Filtreleri Temizle */}
                        {activeFilterCount > 0 && (
                          <button
                            onClick={clearFilters}
                            className="text-primary-600 text-sm hover:text-primary-700 font-medium transition-colors"
                          >
                            Filtreleri Temizle
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section - Full Width */}
      {!loading && filteredStations.length > 0 && (
        <section className="w-full">
          <iframe
            src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=elektrikli+araç+şarj+istasyonu+${encodeURIComponent(district ? `${district}, ${city}` : city)}&zoom=12`}
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </section>
      )}

      {/* Results Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">
                {loading ? 'Aranıyor...' : filteredStations.length > 0 ? 'Size En Yakın Şarj İstasyonları' : 'Sonuç Bulunamadı'}
              </h2>
              {!loading && filteredStations.length > 0 && (
                <p className="text-secondary-600 mt-1">
                  {district ? `${district}, ${city}` : city} bölgesinde {filteredStations.length} istasyon bulundu
                  {userLocation && ' • Uzaklığa göre sıralı'}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!loading && filteredStations.length > 0 && (
                <button
                  onClick={openAllInMaps}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-200 text-secondary-700 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-all text-sm shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Haritada Göster
                </button>
              )}

              <div className="flex bg-white border border-secondary-200 rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-secondary-500 hover:text-secondary-700'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-secondary-500 hover:text-secondary-700'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
            >
              <p className="text-red-600">{error}</p>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stations Grid/List */}
          {!loading && filteredStations.length > 0 && (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              <AnimatePresence>
                {filteredStations.map((station, index) => {
                  const powerInfo = getChargingTypeLabel(station.maxPowerKw);
                  const isFavorite = favorites.includes(station.id);

                  return (
                    <motion.div
                      key={station.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group relative bg-white rounded-2xl border border-secondary-100 hover:border-primary-300 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col"
                    >
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(station.id);
                        }}
                        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-all hover:scale-110 border border-secondary-100"
                      >
                        <svg
                          className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-secondary-400'}`}
                          fill={isFavorite ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>

                      <div className={`relative p-5 flex-1 flex flex-col ${viewMode === 'list' ? 'flex-row items-center gap-6' : ''}`}>
                        {/* Icon with Badges */}
                        <div className={`${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'} relative`}>
                          <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          {/* Distance Badge */}
                          {station.distance && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                              {formatDistance(station.distance)}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className={`${viewMode === 'list' ? 'flex-1 min-w-0' : 'flex-1'}`}>
                          <div className="flex items-start gap-2 mb-1">
                            <h3 className="font-semibold text-secondary-900 text-lg group-hover:text-primary-600 transition-colors truncate flex-1">
                              {station.name}
                            </h3>
                            {/* Power Badge */}
                            {powerInfo && (
                              <span className={`${powerInfo.color} text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0`}>
                                {powerInfo.label}
                              </span>
                            )}
                          </div>

                          {/* Operator */}
                          {station.operatorName && (
                            <p className="text-primary-600 text-sm font-medium truncate">
                              {station.operatorName}
                            </p>
                          )}

                          <p className="text-secondary-600 text-sm mt-1 line-clamp-2">
                            {station.address}
                          </p>

                          {/* Connectors */}
                          {station.connectors && station.connectors.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {station.connectors.slice(0, 3).map((conn, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 bg-gray-100 text-secondary-700 text-xs px-2 py-1 rounded-md"
                                >
                                  <span>{conn.typeName || conn.type}</span>
                                  {conn.powerKw && (
                                    <span className="text-primary-600 font-medium">{conn.powerKw}kW</span>
                                  )}
                                </span>
                              ))}
                              {station.connectors.length > 3 && (
                                <span className="text-secondary-500 text-xs px-1">
                                  +{station.connectors.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Info Row */}
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            {station.distance && viewMode === 'list' && (
                              <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {formatDistance(station.distance)}
                              </div>
                            )}

                            {station.maxPowerKw && (
                              <div className="flex items-center gap-1.5 text-yellow-600 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {formatPower(station.maxPowerKw)}
                              </div>
                            )}

                            {station.rating && (
                              <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-secondary-900 font-medium text-sm">{station.rating}</span>
                                <span className="text-secondary-500 text-sm">({station.reviewCount})</span>
                              </div>
                            )}

                            {station.is24Hours && (
                              <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                                24 Saat
                              </span>
                            )}

                            {station.phone && (
                              <a
                                href={`tel:${station.phone}`}
                                className="flex items-center gap-1.5 text-secondary-500 hover:text-primary-600 transition-colors text-sm"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {station.phone}
                              </a>
                            )}
                          </div>

                          {/* Usage Cost */}
                          {station.usageCost && (
                            <p className="text-secondary-500 text-xs mt-2 truncate">
                              {station.usageCost}
                            </p>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className={`${viewMode === 'list' ? 'flex-shrink-0' : 'mt-4'}`}>
                          <button
                            onClick={() => openInMaps(station)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            Yol Tarifi
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredStations.length === 0 && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary-100">
                <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-3">
                {showOnlyFavorites ? 'Favori İstasyonunuz Yok' : 'Şarj İstasyonu Bulunamadı'}
              </h3>
              <p className="text-secondary-600 max-w-md mx-auto">
                {showOnlyFavorites
                  ? 'Henüz favori istasyon eklemediniz. Kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.'
                  : activeFilterCount > 0
                  ? 'Seçili filtrelerle eşleşen istasyon bulunamadı. Filtreleri temizlemeyi deneyin.'
                  : `${district ? `${district}, ${city}` : city} için şarj istasyonu bulunamadı. Farklı bir ilçe deneyin.`
                }
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Filtreleri Temizle
                </button>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="py-12 bg-white border-t border-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">Şarj Tipleri</h2>
            <p className="text-secondary-600">Aracınıza uygun şarj tipini seçin</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { type: 'AC', title: 'AC Şarj (Tip 2)', desc: '3.7-22 kW • 4-8 saat', color: 'from-blue-400 to-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
              { type: 'DC', title: 'DC Hızlı Şarj', desc: '50-350 kW • 15-45 dk', color: 'from-orange-400 to-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
              { type: 'SC', title: 'Tesla Supercharger', desc: '250 kW • 15-20 dk', color: 'from-red-400 to-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  if (item.type === 'AC') setChargingType('ac');
                  else if (item.type === 'DC' || item.type === 'SC') setChargingType('dc');
                  if (item.type === 'SC') setConnectorFilter('tesla');
                  setShowFilters(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`${item.bgColor} rounded-2xl p-6 border ${item.borderColor} hover:shadow-lg hover:border-primary-300 transition-all text-left group`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-white font-bold text-sm">{item.type}</span>
                </div>
                <h3 className="text-secondary-900 font-semibold text-lg">{item.title}</h3>
                <p className="text-secondary-600 text-sm mt-1">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
