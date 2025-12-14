'use client';

import { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Service {
    id: number;
    name: string;
    location: string;
    rating: number;
    rating_count: number;
    latitude: number;
    longitude: number;
    phone: number;
    pic: string | null;
    supported_vehicles: string;
    supports_all_vehicles: boolean;
    is_official_service: boolean;
    provides_roadside_assistance: boolean;
}

interface ServiceSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        brand?: string;
        model?: string;
        packageName?: string;
        category?: string;
        city?: string;
        district?: string;
    };
}

// Turkey city coordinates for geocoding
const CITY_COORDINATES: Record<string, [number, number]> = {
    'İstanbul': [28.9784, 41.0082],
    'Ankara': [32.8597, 39.9334],
    'İzmir': [27.1428, 38.4237],
    'Bursa': [29.0611, 40.1826],
    'Antalya': [30.7133, 36.8969],
    'Tekirdağ': [27.5117, 40.9833],
    'Çorlu': [27.8000, 41.1597],
};

export default function ServiceSearchModal({ isOpen, onClose, filters }: ServiceSearchModalProps) {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState('recommended');
    const [filterOfficial, setFilterOfficial] = useState(false);
    const [filterRoadside, setFilterRoadside] = useState(false);
    const [popupInfo, setPopupInfo] = useState<Service | null>(null);
    const [hoveredService, setHoveredService] = useState<number | null>(null);
    const [mapZoom, setMapZoom] = useState(14);
    const [expandedCluster, setExpandedCluster] = useState<string | null>(null);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (isOpen) {
            fetchServices();
        }
    }, [isOpen, filters]);

    const fetchServices = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (filters.brand) params.set('brand', filters.brand);
            if (filters.model) params.set('model', filters.model);
            if (filters.category) params.set('category', filters.category);
            if (filters.city) params.set('city', filters.city);
            if (filters.district) params.set('district', filters.district);

            const response = await fetch(`/api/services/search?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                setServices(data.data);
            } else {
                setError('Servisler yüklenemedi');
            }
        } catch (err) {
            setError('Bir hata oluştu');
            console.error('Service fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = services
        .filter(s => !filterOfficial || s.is_official_service)
        .filter(s => !filterRoadside || s.provides_roadside_assistance)
        .sort((a, b) => {
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            if (sortBy === 'reviews') return (b.rating_count || 0) - (a.rating_count || 0);
            return 0;
        });

    // Group services by location (district/area) - always show counts
    const getLocationClusters = () => {
        const clusters: { [key: string]: Service[] } = {};

        filteredServices.forEach(service => {
            if (!service.latitude || !service.longitude) return;

            // Group by location name (district)
            const locationKey = service.location || 'Diğer';
            if (!clusters[locationKey]) {
                clusters[locationKey] = [];
            }
            clusters[locationKey].push(service);
        });

        const result = Object.entries(clusters).map(([location, services]) => {
            // Calculate center of all services in this location
            const centerLat = services.reduce((sum, s) => sum + (s.latitude || 0), 0) / services.length;
            const centerLng = services.reduce((sum, s) => sum + (s.longitude || 0), 0) / services.length;
            return {
                location,
                lat: centerLat,
                lng: centerLng,
                count: services.length,
                services
            };
        });

        return result;
    };

    const locationClusters = getLocationClusters();

    // Geocode city/district for map center
    const getMapCenter = () => {
        if (filters.district && CITY_COORDINATES[filters.district]) {
            return { longitude: CITY_COORDINATES[filters.district][0], latitude: CITY_COORDINATES[filters.district][1] };
        }
        if (filters.city && CITY_COORDINATES[filters.city]) {
            return { longitude: CITY_COORDINATES[filters.city][0], latitude: CITY_COORDINATES[filters.city][1] };
        }
        if (filteredServices.length > 0 && filteredServices[0].latitude && filteredServices[0].longitude) {
            return { longitude: filteredServices[0].longitude, latitude: filteredServices[0].latitude };
        }
        return { longitude: 28.9784, latitude: 41.0082 };
    };

    // Dynamically update map center when filters or services change
    useEffect(() => {
        if (mapRef.current && filteredServices.length > 0) {
            const center = getMapCenter();

            // Calculate bounds to fit all services
            if (filteredServices.length > 1) {
                const lngs = filteredServices.filter(s => s.longitude).map(s => s.longitude);
                const lats = filteredServices.filter(s => s.latitude).map(s => s.latitude);

                if (lngs.length > 0 && lats.length > 0) {
                    const bounds = [
                        [Math.min(...lngs), Math.min(...lats)],
                        [Math.max(...lngs), Math.max(...lats)]
                    ];

                    try {
                        mapRef.current.fitBounds(bounds, {
                            padding: 80,
                            duration: 1000,
                            maxZoom: 14
                        });
                    } catch (e) {
                        // Fallback to flyTo if fitBounds fails
                        mapRef.current.flyTo({
                            center: [center.longitude, center.latitude],
                            zoom: 13,
                            duration: 1000
                        });
                    }
                }
            } else if (filteredServices.length === 1) {
                // Single service - fly to it
                mapRef.current.flyTo({
                    center: [center.longitude, center.latitude],
                    zoom: 15,
                    duration: 1000
                });
            }
        }
    }, [filteredServices, filters.city, filters.district]);

    const mapCenter = getMapCenter();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-white">
            <div className="h-full w-full flex">
                <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex-1 flex overflow-hidden">
                    <div className="w-full lg:w-2/5 overflow-y-auto bg-white">
                        <div className="p-6">
                            {/* Result Count and Sort */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {!loading && `${filteredServices.length} sonuç`}
                                </h2>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                    <option value="recommended">Tavsiye Edilen</option>
                                    <option value="rating">Puan</option>
                                    <option value="reviews">Yorum</option>
                                </select>
                            </div>

                            {/* Filter Buttons - RepairPal Style */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <span className="text-sm">Müsaitlik</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                    <span className="text-sm">Aktif Teklifler</span>
                                </button>
                                <button
                                    onClick={() => setFilterOfficial(!filterOfficial)}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-colors ${filterOfficial ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:bg-gray-50'}`}
                                >
                                    <span className="text-sm">Yetkili Servis</span>
                                </button>
                                <button
                                    onClick={() => setFilterRoadside(!filterRoadside)}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-colors ${filterRoadside ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:bg-gray-50'}`}
                                >
                                    <span className="text-sm">Yol Yardım</span>
                                </button>
                            </div>

                            {loading && <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse"><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>)}</div>}
                            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center"><p className="text-red-600 text-sm">{error}</p></div>}
                            {!loading && !error && filteredServices.length === 0 && <div className="bg-gray-50 rounded-lg p-8 text-center"><h3 className="text-sm font-semibold text-gray-900">Servis Bulunamadı</h3></div>}

                            {/* Compact Horizontal Cards - RepairPal Style */}
                            {!loading && !error && filteredServices.map((service, index) => (
                                <div
                                    key={service.id}
                                    className={`bg-white border-2 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer group mb-3 ${hoveredService === service.id
                                        ? 'border-primary-500 shadow-2xl scale-[1.02] -translate-y-1'
                                        : 'border-gray-200 hover:border-primary-300 hover:shadow-xl'
                                        }`}
                                    onClick={() => setPopupInfo(service)}
                                    onMouseEnter={() => setHoveredService(service.id)}
                                    onMouseLeave={() => setHoveredService(null)}
                                >
                                    <div className="flex">
                                        {/* Service Image - Left Side */}
                                        {service.pic ? (
                                            <img
                                                src={`https://api.tamirhanem.net${service.pic}`}
                                                alt={service.name}
                                                className="w-36 h-36 object-cover flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3C/svg%3E';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-36 h-36 bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -skew-x-12"></div>
                                                <svg className="w-16 h-16 text-primary-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Service Info - Right Side */}
                                        <div className="flex-1 p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-start gap-2">
                                                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                                                        {index + 1}
                                                    </span>
                                                    <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight">
                                                        {service.name}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 mb-2">
                                                <span className="text-sm font-bold text-gray-900">{service.rating?.toFixed(1)}</span>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg key={star} className={`w-4 h-4 transition-colors ${(service.rating || 0) >= star ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                                {service.rating_count && <span className="text-xs text-gray-500 ml-1">({service.rating_count})</span>}
                                            </div>

                                            <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
                                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {service.location}
                                            </p>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${service.phone}`; }}
                                                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-center py-2.5 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                                            >
                                                Müsaitlik Kontrolü
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}                      </div>
                    </div>

                    <div className="hidden lg:block lg:w-3/5 relative">
                        {services.length > 0 && (
                            <>
                                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl px-6 py-4 border-2 border-primary-100 backdrop-blur-sm">
                                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-3">
                                        <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">{filteredServices.length}</span>
                                        <span className="text-gray-700 font-medium">servis bulundu</span>
                                        <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </p>
                                </div>

                                <Map
                                    key={`${filters.city}-${filters.district}-${filteredServices.length}`}
                                    ref={mapRef}
                                    initialViewState={{ ...mapCenter, zoom: 14 }}
                                    onZoom={(e) => setMapZoom(e.viewState.zoom)}
                                    style={{ width: '100%', height: '100%' }}
                                    mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                                >
                                    {/* Location-based cluster markers */}
                                    {locationClusters.length > 0 && locationClusters.map((cluster, idx) => {
                                        const clusterKey = `${cluster.location}-${cluster.lat}-${cluster.lng}`;
                                        const isExpanded = expandedCluster === clusterKey;

                                        return (
                                            <div key={clusterKey}>
                                                {/* Main cluster marker */}
                                                {!isExpanded && (
                                                    <Marker
                                                        longitude={cluster.lng}
                                                        latitude={cluster.lat}
                                                        onClick={(e: any) => {
                                                            e.originalEvent.stopPropagation();
                                                            setExpandedCluster(clusterKey);
                                                        }}
                                                    >
                                                        <div className="relative cursor-pointer group">
                                                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-xl border-3 border-white transition-all hover:scale-110 hover:bg-gray-900">
                                                                <span className="text-white font-bold text-base">{cluster.count}</span>
                                                            </div>
                                                            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-50">
                                                                <div className="font-semibold">{cluster.location}</div>
                                                                <div className="text-gray-300">{cluster.count} servis</div>
                                                            </div>
                                                        </div>
                                                    </Marker>
                                                )}

                                                {/* Expanded individual service markers in circular pattern */}
                                                {isExpanded && cluster.services.map((service, serviceIdx) => {
                                                    // Calculate circular position around cluster center
                                                    const angle = (serviceIdx / cluster.services.length) * 2 * Math.PI;
                                                    const radius = 0.008; // ~800m radius in degrees - increased for firm name labels
                                                    const offsetLng = Math.cos(angle) * radius;
                                                    const offsetLat = Math.sin(angle) * radius;

                                                    return (
                                                        <Marker
                                                            key={service.id}
                                                            longitude={cluster.lng + offsetLng}
                                                            latitude={cluster.lat + offsetLat}
                                                            onClick={(e: any) => {
                                                                e.originalEvent.stopPropagation();
                                                                setPopupInfo(service);
                                                            }}
                                                        >
                                                            <div
                                                                className={`relative transition-all duration-300 cursor-pointer ${hoveredService === service.id ? 'scale-105 z-50' : 'hover:scale-105'
                                                                    }`}
                                                                onMouseEnter={() => setHoveredService(service.id)}
                                                                onMouseLeave={() => setHoveredService(null)}
                                                            >
                                                                {/* Firm name label */}
                                                                <div className={`px-3 py-2 rounded-lg shadow-xl border-2 transition-all whitespace-nowrap ${hoveredService === service.id
                                                                    ? 'bg-gradient-to-br from-secondary-500 to-secondary-600 border-white scale-110'
                                                                    : 'bg-white border-gray-300 hover:border-primary-500'
                                                                    }`}>
                                                                    <span className={`font-bold text-sm ${hoveredService === service.id ? 'text-white' : 'text-gray-900'
                                                                        }`}>
                                                                        {service.name}
                                                                    </span>
                                                                </div>
                                                                {hoveredService === service.id && (
                                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-400 rounded-full animate-ping"></div>
                                                                )}
                                                            </div>
                                                        </Marker>
                                                    );
                                                })}

                                                {/* Close button when expanded */}
                                                {isExpanded && (
                                                    <Marker
                                                        longitude={cluster.lng}
                                                        latitude={cluster.lat}
                                                        onClick={(e: any) => {
                                                            e.originalEvent.stopPropagation();
                                                            setExpandedCluster(null);
                                                        }}
                                                    >
                                                        <div className="relative cursor-pointer">
                                                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-xl border-3 border-white hover:bg-red-700 transition-all hover:scale-110">
                                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </Marker>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Zoom Controls */}
                                    <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
                                        <button
                                            onClick={() => {
                                                if (mapRef.current) {
                                                    mapRef.current.zoomIn();
                                                }
                                            }}
                                            className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                            title="Yakınlaştır"
                                        >
                                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (mapRef.current) {
                                                    mapRef.current.zoomOut();
                                                }
                                            }}
                                            className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                            title="Uzaklaştır"
                                        >
                                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                    </div>
                                    {/* Popup for selected service */}
                                    {popupInfo && (
                                        <Popup longitude={popupInfo.longitude} latitude={popupInfo.latitude} onClose={() => setPopupInfo(null)} closeButton={true} closeOnClick={false}>
                                            <div className="p-2 min-w-[200px]">
                                                <h3 className="font-bold text-sm mb-1">{popupInfo.name}</h3>
                                                <div className="flex items-center gap-1 mb-1">
                                                    <span className="text-xs font-semibold text-primary-600">{popupInfo.rating?.toFixed(1)}</span>
                                                    <svg className="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                </div>
                                                <p className="text-xs text-gray-600 mb-2">{popupInfo.location}</p>
                                                <a href={`tel:${popupInfo.phone}`} className="block bg-primary-600 text-white text-center py-1.5 rounded text-xs font-semibold hover:bg-primary-700">Hemen Ara</a>
                                            </div>
                                        </Popup>
                                    )}
                                </Map>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
