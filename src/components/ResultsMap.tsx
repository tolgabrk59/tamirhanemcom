'use client';

import { useState, useRef, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

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
}

interface ResultsMapProps {
    services: Service[];
    hoveredService: number | null;
    onServiceClick?: (service: Service) => void;
}

export default function ResultsMap({ services, hoveredService, onServiceClick }: ResultsMapProps) {
    const [popupInfo, setPopupInfo] = useState<Service | null>(null);
    const [expandedCluster, setExpandedCluster] = useState<string | null>(null);
    const mapRef = useRef<any>(null);

    // Group services by location
    const getLocationClusters = () => {
        const clusters: { [key: string]: Service[] } = {};

        services.forEach(service => {
            // Validate coordinates: latitude must be between -90 and 90, longitude between -180 and 180
            if (!service.latitude || !service.longitude || 
                service.latitude < -90 || service.latitude > 90 ||
                service.longitude < -180 || service.longitude > 180) {
                return;
            }

            const locationKey = service.location || 'Diğer';
            if (!clusters[locationKey]) {
                clusters[locationKey] = [];
            }
            clusters[locationKey].push(service);
        });

        return Object.entries(clusters).map(([location, services]) => {
            // Filter out services with null or invalid coordinates
            const validServices = services.filter(s => 
                s.latitude !== null && s.longitude !== null &&
                s.latitude >= -90 && s.latitude <= 90 &&
                s.longitude >= -180 && s.longitude <= 180
            );
            
            if (validServices.length === 0) return null;
            
            const centerLat = validServices.reduce((sum, s) => sum + s.latitude!, 0) / validServices.length;
            const centerLng = validServices.reduce((sum, s) => sum + s.longitude!, 0) / validServices.length;
            
            return {
                location,
                lat: centerLat,
                lng: centerLng,
                count: validServices.length,
                services: validServices
            };
        }).filter(cluster => cluster !== null) as Array<{
            location: string;
            lat: number;
            lng: number;
            count: number;
            services: Service[];
        }>;
    };

    const locationClusters = getLocationClusters();

    // Calculate map center
    const getMapCenter = () => {
        // Find first service with valid coordinates
        const validService = services.find(s => 
            s.latitude && s.longitude &&
            s.latitude >= -90 && s.latitude <= 90 &&
            s.longitude >= -180 && s.longitude <= 180
        );
        
        if (validService) {
            return { longitude: validService.longitude!, latitude: validService.latitude! };
        }
        return { longitude: 27.8069, latitude: 41.1592 }; // Default: Çorlu, Tekirdağ
    };

    const mapCenter = getMapCenter();

    // Auto-fit bounds when services change
    useEffect(() => {
        if (mapRef.current && services.length > 0) {
            // Filter valid coordinates
            const validServices = services.filter(s => 
                s.latitude && s.longitude &&
                s.latitude >= -90 && s.latitude <= 90 &&
                s.longitude >= -180 && s.longitude <= 180
            );
            
            const lngs = validServices.map(s => s.longitude!);
            const lats = validServices.map(s => s.latitude!);

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
                    console.error('Error fitting bounds:', e);
                }
            }
        }
    }, [services]);

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
            <Map
                ref={mapRef}
                initialViewState={{ ...mapCenter, zoom: 12 }}
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

                            {/* Expanded individual service markers */}
                            {isExpanded && cluster.services.map((service, serviceIdx) => {
                                const angle = (serviceIdx / cluster.services.length) * 2 * Math.PI;
                                const radius = 0.008;
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
                                            onServiceClick?.(service);
                                        }}
                                    >
                                        <div className={`relative transition-all duration-300 cursor-pointer ${hoveredService === service.id ? 'scale-105 z-50' : 'hover:scale-105'
                                            }`}>
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
                        onClick={() => mapRef.current?.zoomIn()}
                        className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        title="Yakınlaştır"
                    >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    <button
                        onClick={() => mapRef.current?.zoomOut()}
                        className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        title="Uzaklaştır"
                    >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </button>
                </div>

                {/* Popup for selected service */}
                {popupInfo && 
                 popupInfo.latitude && popupInfo.longitude &&
                 popupInfo.latitude >= -90 && popupInfo.latitude <= 90 &&
                 popupInfo.longitude >= -180 && popupInfo.longitude <= 180 && (
                    <Popup
                        longitude={popupInfo.longitude}
                        latitude={popupInfo.latitude}
                        onClose={() => setPopupInfo(null)}
                        closeButton={true}
                        closeOnClick={false}
                    >
                        <div className="p-2 min-w-[200px]">
                            <h3 className="font-bold text-gray-900 mb-1">{popupInfo.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{popupInfo.location}</p>
                            {popupInfo.rating && (
                                <div className="flex items-center gap-1 mb-2">
                                    <span className="text-sm font-semibold">{popupInfo.rating.toFixed(1)}</span>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-xs text-gray-500">({popupInfo.rating_count})</span>
                                </div>
                            )}
                            {popupInfo.phone && (
                                <a href={`tel:${popupInfo.phone}`} className="text-sm text-primary-600 hover:underline">
                                    {popupInfo.phone}
                                </a>
                            )}
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
}
