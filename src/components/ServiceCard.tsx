'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { isServiceOpen, formatDistance, isFavorite, toggleFavorite } from '@/lib/service-utils';

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
    supported_vehicles?: any[];
    supports_all_vehicles?: boolean;
    working_hours?: any;
}

interface ServiceCardProps {
    service: Service;
    index: number;
    onHover?: (serviceId: number | null) => void;
    isHovered?: boolean;
    onDetailClick?: (service: Service) => void;
    userLocation?: { lat: number; lng: number } | null;
    distance?: number | null;
}

export default function ServiceCard({ 
    service, 
    index, 
    onHover, 
    isHovered, 
    onDetailClick,
    distance 
}: ServiceCardProps) {
    const [imageError, setImageError] = useState(false);
    const [isFav, setIsFav] = useState(false);

    // Favorileri client-side'da kontrol et
    useEffect(() => {
        setIsFav(isFavorite(service.id));
    }, [service.id]);

    // Gerçek çalışma saatleri hesapla
    const { isOpen, nextTime, closingTime } = isServiceOpen(service.working_hours);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newState = toggleFavorite(service.id);
        setIsFav(newState);
    };

    return (
        <div
            className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer ${isHovered ? 'ring-2 ring-primary-500 shadow-lg' : ''
                }`}
            onMouseEnter={() => onHover?.(service.id)}
            onMouseLeave={() => onHover?.(null)}
        >
            {/* Service Image - Compact */}
            <div className="relative h-28 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {service.pic && !imageError ? (
                    <Image
                        src={service.pic.startsWith('http') ? service.pic : `https://api.tamirhanem.net${service.pic}`}
                        alt={service.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                        <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}

                {/* Index Badge - Smaller */}
                <div className="absolute top-2 left-2 w-7 h-7 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center shadow border border-white">
                    <span className="text-white font-bold text-xs">{index}</span>
                </div>

                {/* Favorite Button */}
                <button
                    onClick={handleFavoriteClick}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition-colors group"
                    title={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                >
                    <svg 
                        className={`w-4 h-4 transition-colors ${isFav ? 'text-red-500 fill-red-500' : 'text-gray-400 group-hover:text-red-400'}`}
                        fill={isFav ? 'currentColor' : 'none'}
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                {/* Official Service Badge - Smaller */}
                {service.is_official_service && (
                    <div className="absolute bottom-2 left-2 bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                        Yetkili
                    </div>
                )}

                {/* Distance Badge */}
                {distance !== null && distance !== undefined && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded backdrop-blur-sm">
                        {formatDistance(distance)}
                    </div>
                )}
            </div>

            {/* Service Info - Compact */}
            <div className="p-3">
                {/* Name */}
                <h3 className="text-sm font-bold text-gray-900 mb-1.5 line-clamp-1">
                    {service.name}
                </h3>

                {/* Rating - Compact */}
                <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex items-center">
                        <span className="text-sm font-bold text-gray-900 mr-0.5">
                            {service.rating?.toFixed(1) || 'N/A'}
                        </span>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    className={`w-3 h-3 ${service.rating && star <= service.rating
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                        }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                    <span className="text-xs text-gray-600">
                        ({service.rating_count || 0})
                    </span>
                </div>

                {/* Address - Compact */}
                <div className="flex items-start gap-1.5 mb-2">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-gray-600 line-clamp-1">{service.location}</p>
                </div>

                {/* Open/Closed Status - Dynamic */}
                <div className="mb-2">
                    {isOpen ? (
                        <p className="text-xs">
                            <span className="text-green-600 font-semibold">Açık</span>
                            {closingTime && <span className="text-gray-500"> · Kapanış: {closingTime}</span>}
                        </p>
                    ) : (
                        <p className="text-xs">
                            <span className="text-red-600 font-semibold">Kapalı</span>
                            {nextTime && <span className="text-gray-500"> · Açılış: {nextTime}</span>}
                        </p>
                    )}
                </div>

                {/* Detail Button - Compact */}
                <button 
                    onClick={() => onDetailClick?.(service)}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-2 text-sm rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    Detaylı Bilgi
                </button>
            </div>
        </div>
    );
}
