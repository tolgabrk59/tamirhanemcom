'use client';

import Image from 'next/image';
import { useState } from 'react';

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

interface ServiceCardProps {
    service: Service;
    index: number;
    onHover?: (serviceId: number | null) => void;
    isHovered?: boolean;
}

export default function ServiceCard({ service, index, onHover, isHovered }: ServiceCardProps) {
    const [imageError, setImageError] = useState(false);

    // Mock open/closed status - you can replace with real data
    const isOpen = Math.random() > 0.3;
    const opensAt = "7:30 AM Mon";

    return (
        <div
            className={`bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer ${isHovered ? 'ring-2 ring-primary-500 shadow-2xl transform -translate-y-1' : 'hover:-translate-y-1'
                }`}
            onMouseEnter={() => onHover?.(service.id)}
            onMouseLeave={() => onHover?.(null)}
        >
            {/* Service Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {service.pic && !imageError ? (
                    <Image
                        src={`https://api.tamirhanem.net${service.pic}`}
                        alt={service.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 hover:scale-110"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                        <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}

                {/* Index Badge */}
                <div className="absolute top-3 left-3 w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <span className="text-white font-bold text-sm">{index}</span>
                </div>

                {/* Official Service Badge */}
                {service.is_official_service && (
                    <div className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                        Yetkili Servis
                    </div>
                )}
            </div>

            {/* Service Info */}
            <div className="p-4">
                {/* Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {service.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                        <span className="text-lg font-bold text-gray-900 mr-1">
                            {service.rating?.toFixed(1) || 'N/A'}
                        </span>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    className={`w-4 h-4 ${service.rating && star <= service.rating
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
                    <span className="text-sm text-gray-600">
                        ({service.rating_count || 0})
                    </span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 mb-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-gray-600 line-clamp-2">{service.location}</p>
                </div>

                {/* Open/Closed Status */}
                <div className="mb-4">
                    {isOpen ? (
                        <p className="text-sm">
                            <span className="text-green-600 font-semibold">Açık</span>
                            <span className="text-gray-500"> · Kapanış: 18:00</span>
                        </p>
                    ) : (
                        <p className="text-sm">
                            <span className="text-red-600 font-semibold">Kapalı</span>
                            <span className="text-gray-500"> · Açılış: 07:30 Pazartesi</span>
                        </p>
                    )}
                </div>

                {/* Check Availability Button */}
                <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                    Müsaitlik Kontrolü
                </button>
            </div>
        </div>
    );
}
