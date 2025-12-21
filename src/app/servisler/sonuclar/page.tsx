
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ServiceCard from '@/components/ServiceCard';
import { ServiceCardSkeletonGrid } from '@/components/ServiceCardSkeleton';
import ResultsMap from '@/components/ResultsMap';
import ServiceSearchModal from '@/components/ServiceSearchModal';
import ServiceDetailPanel from '@/components/ServiceDetailPanel';
import { turkeyLocations, cityList } from '@/data/turkey-locations';
import { getCityCoordinates, defaultLocation } from '@/data/city-coordinates';
import { calculateDistance, isServiceOpen } from '@/lib/service-utils';

interface Service {
    id: number;
    name: string;
    location: string;
    rating: number | null;
    rating_count: number | null;
    latitude: number | null;
    longitude: number | null;
    phone: string | null;
    pic: string | null;
    is_official_service: boolean;
    provides_roadside_assistance: boolean;
    categories?: string[];
    address?: string;
    description?: string;
    working_hours?: any;
    supported_vehicles?: any[];
    supports_all_vehicles?: boolean;
}

function ServiceResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredService, setHoveredService] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState('recommended');
    const [showMap, setShowMap] = useState(true);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<Service | null>(null);

    // Edit modal states
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    // Filter states (initialized from URL, default: Çorlu, Tekirdağ)
    const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'Tekirdağ');
    const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || 'Çorlu');
    const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
    const [selectedModel, setSelectedModel] = useState(searchParams.get('model') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    
    // Hidden fuel type filter as requested - Default empty (All)
    const [selectedFuelType, setSelectedFuelType] = useState(searchParams.get('fuel_type') || '');

    // Extra UI toggles
    const [showOpenOnly, setShowOpenOnly] = useState(false);
    const [showOfficialOnly, setShowOfficialOnly] = useState(false);
    const [showRoadsideOnly, setShowRoadsideOnly] = useState(false);
    const [displayLimit, setDisplayLimit] = useState(20);

    // Data from API
    const [brands, setBrands] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    
    // User location for distance calculation
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    // Fetch services
    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (selectedCity) params.set('city', selectedCity);
                if (selectedDistrict) params.set('district', selectedDistrict);
                if (selectedBrand) params.set('brand', selectedBrand);
                if (selectedModel) params.set('model', selectedModel);
                if (selectedCategory) params.set('category', selectedCategory);
                
                // Add hidden fuel type filter to API request
                if (selectedFuelType) params.set('fuel_type', selectedFuelType);

                const response = await fetch(`/api/services/search?${params.toString()}`);
                const data = await response.json();
                if (data.success) {
                    setServices(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [selectedCity, selectedDistrict, selectedBrand, selectedModel, selectedCategory, selectedFuelType]);

    // Fetch brands (otomobil only)
    useEffect(() => {
        fetch('/api/brands?vehicleType=otomobil')
            .then(res => res.json())
            .then(data => setBrands(data.data || []))
            .catch(err => console.error('Error fetching brands:', err));
    }, []);

    // Fetch models when brand changes (otomobil only)
    useEffect(() => {
        if (selectedBrand) {
            fetch(`/api/models?brand=${encodeURIComponent(selectedBrand)}&vehicleType=otomobil`)
                .then(res => res.json())
                .then(data => setModels(data.data || []))
                .catch(err => console.error('Error fetching models:', err));
        } else {
            setModels([]);
        }
    }, [selectedBrand]);

    // Fetch categories
    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data.data || []))
            .catch(err => console.error('Error fetching categories:', err));
    }, []);
    
    // Get user location for distance calculation
    // Önce şehir koordinatlarını hemen set et, sonra arka planda geolocation dene
    useEffect(() => {
        // Hemen şehir koordinatlarını kullan (beklemeden)
        const cityCoords = getCityCoordinates(selectedCity);
        setUserLocation(cityCoords || defaultLocation);
        
        // Arka planda gerçek konumu almayı dene
        if (typeof window !== 'undefined' && 'geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Gerçek konum alındıysa güncelle
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    // Hata olursa sessizce devam et, şehir koordinatları zaten set edildi
                    console.log('Geolocation not available:', error.message);
                },
                { enableHighAccuracy: false, timeout: 3000, maximumAge: 300000 }
            );
        }
    }, [selectedCity]);

    // Sort services
    const sortedServices = [...services].sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'reviews') return (b.rating_count || 0) - (a.rating_count || 0);
        // recommended: Önce puana göre, eşit puanda yorum sayısına göre sırala
        if (sortBy === 'recommended') {
            const ratingDiff = (b.rating || 0) - (a.rating || 0);
            if (ratingDiff !== 0) return ratingDiff;
            return (b.rating_count || 0) - (a.rating_count || 0);
        }
        return 0;
    });

    // Filter services (Client side extra filters)
    const filteredServices = sortedServices.filter(service => {
        // Use real working hours data
        if (showOpenOnly) {
            const { isOpen } = isServiceOpen(service.working_hours);
            if (!isOpen) return false;
        }
        if (showOfficialOnly && !service.is_official_service) return false;
        if (showRoadsideOnly && !service.provides_roadside_assistance) return false;
        return true;
    });
    
    // Calculate distances for services
    const servicesWithDistance = filteredServices.map(service => {
        let distance: number | null = null;
        if (userLocation && service.latitude && service.longitude) {
            distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                service.latitude,
                service.longitude
            );
        }
        return { ...service, distance };
    });
    
    // Sort by distance if user location available and sort is recommended
    // For other sort options, keep the already sorted order
    let finalServices = servicesWithDistance;
    
    if (sortBy === 'recommended' && userLocation) {
        // Önerilen: Mesafeye göre sırala (en yakın önce)
        finalServices = [...servicesWithDistance].sort((a, b) => {
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
        });
    } else if (sortBy === 'rating') {
        // En Çok Puan Alan: Puana göre sırala
        finalServices = [...servicesWithDistance].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'reviews') {
        // En Çok Yorum Alan: Yorum sayısına göre sırala
        finalServices = [...servicesWithDistance].sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0));
    }

    // Pagination
    const displayedServices = finalServices.slice(0, displayLimit);
    const hasMore = finalServices.length > displayLimit;
    const activeFilterCount = [showOpenOnly, showOfficialOnly, showRoadsideOnly].filter(Boolean).length;

    // Helper to apply filters to URL
    const applyFilters = () => {
        const params = new URLSearchParams();
        if (selectedCity) params.set('city', selectedCity);
        if (selectedDistrict) params.set('district', selectedDistrict);
        if (selectedBrand) params.set('brand', selectedBrand);
        if (selectedModel) params.set('model', selectedModel);
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedFuelType) params.set('fuel_type', selectedFuelType);

        router.push(`/servisler/sonuclar?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section - Compact */}
            <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-6 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={{
                        backgroundImage: 'url(/hero_service_background.png)',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}
                ></div>

                <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">
                            Güvenilir Servisler Burada
                        </h1>
                        <p className="text-sm text-primary-100 max-w-2xl mx-auto">
                            Aracınız için en iyi servisleri bulun, fiyatları karşılaştırın ve randevu alın
                        </p>
                    </div>
                </div>
            </div>

            {/* Header / Filter Bar - Compact */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 mb-2 sm:mb-3">
                        {/* Location */}
                        <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1 min-w-0">
                                <div className="hidden sm:block text-xs text-gray-500 mb-1">Lokasyon</div>
                                <div className="font-semibold text-gray-900 truncate text-xs sm:text-base">
                                    {selectedCity ? `${selectedCity}${selectedDistrict ? `, ${selectedDistrict}` : ''}` : 'Tüm Türkiye'}
                                </div>
                            </div>
                            <button
                                onClick={() => setShowLocationModal(true)}
                                className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium"
                            >
                                Değiştir
                            </button>
                        </div>

                        {/* Vehicle */}
                        <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                                <div className="hidden sm:block text-xs text-gray-500 mb-1">Aracınız</div>
                                <div className="font-semibold text-gray-900 truncate text-xs sm:text-base">
                                    {selectedBrand ? `${selectedBrand} ${selectedModel}` : 'Tüm Araçlar'}
                                </div>
                            </div>
                            <button
                                onClick={() => setShowVehicleModal(true)}
                                className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium"
                            >
                                Değiştir
                            </button>
                        </div>

                        {/* Category */}
                        <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                                <div className="hidden sm:block text-xs text-gray-500 mb-1">Hizmet</div>
                                <div className="font-semibold text-gray-900 truncate text-xs sm:text-base">
                                    {selectedCategory || 'Genel Tanı'}
                                </div>
                            </div>
                            <button
                                onClick={() => setShowCategoryModal(true)}
                                className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium"
                            >
                                Değiştir
                            </button>
                        </div>
                    </div>

                    {/* Results Count and Sort */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <p className="text-gray-700 text-sm sm:text-base">
                            <span className="font-bold">{filteredServices.length}</span> sonuç bulundu
                            {activeFilterCount > 0 && (
                                <span className="ml-2 text-xs sm:text-sm text-primary-600">
                                    ({activeFilterCount} filtre aktif)
                                </span>
                            )}
                        </p>

                        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0">
                            {/* View Mode Toggle */}
                            <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-2 rounded-md transition-all ${
                                        viewMode === 'list'
                                            ? 'bg-white shadow-sm text-primary-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                    title="Liste Görünümü"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 py-2 rounded-md transition-all ${
                                        viewMode === 'grid'
                                            ? 'bg-white shadow-sm text-primary-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                    title="Grid Görünümü"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Map Toggle (Mobile) */}
                            <button
                                onClick={() => setShowMap(!showMap)}
                                className="lg:hidden flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm whitespace-nowrap"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                <span className="hidden xs:inline">{showMap ? 'Haritayı Gizle' : 'Harita'}</span>
                            </button>

                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-2 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="recommended">Mesafeye Göre</option>
                                <option value="rating">En Çok Puan Alan</option>
                                <option value="reviews">En Çok Yorum Alan</option>
                            </select>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap items-center gap-2 mt-2 overflow-x-auto pb-1">
                        <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Filtreler:</span>

                        <button
                            onClick={() => setShowOpenOnly(!showOpenOnly)}
                            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 transition-all whitespace-nowrap ${showOpenOnly
                                ? 'bg-green-50 border-green-500 text-green-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                }`}
                        >
                            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded border-2 flex items-center justify-center ${showOpenOnly ? 'bg-green-500 border-green-500' : 'border-gray-400'
                                }`}>
                                {showOpenOnly && (
                                    <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-xs sm:text-sm font-medium">Açık</span>
                        </button>

                        <button
                            onClick={() => setShowOfficialOnly(!showOfficialOnly)}
                            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 transition-all whitespace-nowrap ${showOfficialOnly
                                ? 'bg-primary-50 border-primary-500 text-primary-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                }`}
                        >
                            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded border-2 flex items-center justify-center ${showOfficialOnly ? 'bg-primary-500 border-primary-500' : 'border-gray-400'
                                }`}>
                                {showOfficialOnly && (
                                    <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-xs sm:text-sm font-medium">Yetkili</span>
                        </button>

                        <button
                            onClick={() => setShowRoadsideOnly(!showRoadsideOnly)}
                            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 transition-all whitespace-nowrap ${showRoadsideOnly
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                }`}
                        >
                            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded border-2 flex items-center justify-center ${showRoadsideOnly ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
                                }`}>
                                {showRoadsideOnly && (
                                    <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-xs sm:text-sm font-medium">Yol Yardımı</span>
                        </button>

                        {activeFilterCount > 0 && (
                            <button
                                onClick={() => {
                                    setShowOpenOnly(false);
                                    setShowOfficialOnly(false);
                                    setShowRoadsideOnly(false);
                                }}
                                className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 underline whitespace-nowrap"
                            >
                                Temizle
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content - Compact */}
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className={`flex gap-6 ${viewMode === 'grid' ? 'justify-center' : ''}`}>
                    {/* Service List */}
                    <div className={viewMode === 'grid' ? 'w-full' : 'flex-1'}>
                        {loading ? (
                            <div className={`grid gap-3 sm:gap-4 ${
                                viewMode === 'grid' 
                                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6' 
                                    : 'grid-cols-1 md:grid-cols-2 lg:w-[800px]'
                            }`}>
                                <ServiceCardSkeletonGrid count={viewMode === 'grid' ? 12 : 6} />
                            </div>
                        ) : services.length === 0 ? (
                            <div className="text-center py-20">
                                <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
                                <p className="text-gray-600">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
                            </div>
                        ) : (
                            <>
                                <div className={`grid gap-3 sm:gap-4 ${
                                    viewMode === 'grid' 
                                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6' 
                                        : 'grid-cols-1 md:grid-cols-2 lg:w-[800px]'
                                }`}>
                                    {displayedServices.map((service, index) => (
                                        <ServiceCard
                                            key={service.id}
                                            service={service}
                                            index={index + 1}
                                            onHover={setHoveredService}
                                            isHovered={hoveredService === service.id}
                                            onDetailClick={(s) => setSelectedServiceForDetail(s)}
                                            distance={service.distance}
                                        />
                                    ))}
                                </div>

                                {hasMore && (
                                    <div className={`mt-4 text-center ${viewMode === 'list' ? 'lg:w-[800px]' : ''}`}>
                                        <button
                                            onClick={() => setDisplayLimit(prev => prev + 20)}
                                            className="px-6 py-2.5 bg-primary-600 text-white text-sm rounded-lg font-bold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
                                        >
                                            Daha Fazla Yükle ({finalServices.length - displayLimit} servis kaldı)
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Map (Desktop) - Only show in list view */}
                    {viewMode === 'list' && (
                        <div className="hidden lg:block lg:w-[600px] xl:flex-1">
                            <div className="sticky top-24 h-[calc(100vh-7rem)] rounded-xl overflow-hidden shadow-xl">
                                <ResultsMap
                                    services={services}
                                    hoveredService={hoveredService}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Map Modal */}
            {
                showMap && (
                    <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setShowMap(false)}>
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-white rounded-t-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="font-bold text-lg">Harita</h3>
                                <button onClick={() => setShowMap(false)} className="p-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="h-[calc(100%-4rem)]">
                                <ResultsMap
                                    services={services}
                                    hoveredService={hoveredService}
                                />
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Location Modal */}
            {showLocationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowLocationModal(false)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Lokasyon Seç</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">İl</label>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => {
                                        setSelectedCity(e.target.value);
                                        setSelectedDistrict('');
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">Tüm İller</option>
                                    {cityList.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            {selectedCity && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">İlçe</label>
                                    <select
                                        value={selectedDistrict}
                                        onChange={(e) => setSelectedDistrict(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="">Tüm İlçeler</option>
                                        {turkeyLocations[selectedCity]?.map(district => (
                                            <option key={district} value={district}>{district}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLocationModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={() => {
                                        applyFilters();
                                        setShowLocationModal(false);
                                    }}
                                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                >
                                    Uygula
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Vehicle Modal */}
            {showVehicleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowVehicleModal(false)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Araç Seç</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Marka</label>
                                <select
                                    value={selectedBrand}
                                    onChange={(e) => {
                                        setSelectedBrand(e.target.value);
                                        setSelectedModel('');
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">Tüm Markalar</option>
                                    {brands.map((b: any) => (
                                        <option key={b.brand} value={b.brand}>{b.brand}</option>
                                    ))}
                                </select>
                            </div>
                            {selectedBrand && models.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                                    <select
                                        value={selectedModel}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                    <option value="">Tüm Modeller</option>
                                    {models.map((m: any) => (
                                        <option key={m.model} value={m.model}>{m.model}</option>
                                    ))}
                                    </select>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowVehicleModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={() => {
                                        applyFilters();
                                        setShowVehicleModal(false);
                                    }}
                                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                >
                                    Uygula
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowCategoryModal(false)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Hizmet Seç</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">Tüm Hizmetler</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCategoryModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={() => {
                                        applyFilters();
                                        setShowCategoryModal(false);
                                    }}
                                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                >
                                    Uygula
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Service Search Modal */}
            <ServiceSearchModal
                isOpen={showSearchModal}
                onClose={() => setShowSearchModal(false)}
                filters={{
                    brand: selectedBrand,
                    model: selectedModel,
                    packageName: '',
                    category: selectedCategory,
                    city: selectedCity,
                    district: selectedDistrict
                }}
            />

            {/* Service Detail Panel */}
            <ServiceDetailPanel
                service={selectedServiceForDetail}
                isOpen={!!selectedServiceForDetail}
                onClose={() => setSelectedServiceForDetail(null)}
            />
        </div >
    );
}

export default function ServiceResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Yükleniyor...</p>
            </div>
        </div>}>
            <ServiceResultsContent />
        </Suspense>
    );
}
