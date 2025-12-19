'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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
    description?: string;
    address?: string;
    working_hours?: any;
    supported_vehicles?: any[];
    supports_all_vehicles?: boolean;
}

interface ServiceDetailPanelProps {
    service: Service | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ServiceDetailPanel({ service, isOpen, onClose }: ServiceDetailPanelProps) {
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [showAllBrands, setShowAllBrands] = useState(false);

    // Reset expand states when service changes
    useEffect(() => {
        setShowAllCategories(false);
        setShowAllBrands(false);
    }, [service?.id]);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Prevent body scroll when panel is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!service) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Slide Panel */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-gray-900">Servis Detayları</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto h-[calc(100%-160px)]">
                    {/* Service Image */}
                    <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200">
                        {service.pic ? (
                            <Image
                                src={service.pic.startsWith('http') ? service.pic : `https://api.tamirhanem.net${service.pic}`}
                                alt={service.name}
                                fill
                                unoptimized
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                        {service.is_official_service && (
                            <div className="absolute top-4 right-4 bg-primary-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow">
                                ✓ Yetkili Servis
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="p-6 space-y-6">
                        {/* Name & Rating */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                                    <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="font-bold text-gray-900">{service.rating?.toFixed(1) || 'N/A'}</span>
                                    <span className="text-gray-500 ml-1">({service.rating_count || 0} değerlendirme)</span>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-primary-100 p-2 rounded-lg">
                                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Konum</h4>
                                    <p className="text-gray-600">{service.address || service.location}</p>
                                    {service.latitude && service.longitude && (
                                        <a 
                                            href={`https://www.google.com/maps?q=${service.latitude},${service.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-600 text-sm hover:underline mt-2 inline-block"
                                        >
                                            → Haritada Göster
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        {service.categories && service.categories.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Hizmetler</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(showAllCategories ? service.categories : service.categories.slice(0, 8)).map((cat, idx) => (
                                        <span key={idx} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                                            {cat}
                                        </span>
                                    ))}
                                    {service.categories.length > 8 && (
                                        <button
                                            onClick={() => setShowAllCategories(!showAllCategories)}
                                            className="bg-primary-100 text-primary-700 text-sm px-3 py-1 rounded-full hover:bg-primary-200 transition-colors cursor-pointer font-medium"
                                        >
                                            {showAllCategories ? 'Daha az göster' : `+${service.categories.length - 8} daha`}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Supported Brands */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Hizmet Verilen Markalar</h4>
                            {service.supports_all_vehicles ? (
                                <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary-500 p-2 rounded-lg">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-primary-700">Tüm Markalara Hizmet Verilmektedir</span>
                                            <p className="text-sm text-gray-600 mt-1">Bu servis tüm araç marka ve modellerine bakım ve onarım hizmeti sunmaktadır.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : service.supported_vehicles && service.supported_vehicles.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {(showAllBrands ? service.supported_vehicles : service.supported_vehicles.slice(0, 12)).map((vehicle: any, idx: number) => {
                                        const brandName = typeof vehicle === 'string' ? vehicle : (vehicle.brand || vehicle.name || vehicle);
                                        return (
                                            <span key={idx} className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full border border-gray-200 flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                                                </svg>
                                                {brandName}
                                            </span>
                                        );
                                    })}
                                    {service.supported_vehicles.length > 12 && (
                                        <button
                                            onClick={() => setShowAllBrands(!showAllBrands)}
                                            className="bg-primary-100 text-primary-700 text-sm px-3 py-1.5 rounded-full hover:bg-primary-200 transition-colors cursor-pointer font-medium"
                                        >
                                            {showAllBrands ? 'Daha az göster' : `+${service.supported_vehicles.length - 12} daha`}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm italic">Marka bilgisi bulunmuyor</p>
                            )}
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3">
                            {service.provides_roadside_assistance && (
                                <div className="bg-blue-50 rounded-xl p-3 text-center">
                                    <svg className="w-6 h-6 text-blue-600 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                                    </svg>
                                    <span className="text-sm font-medium text-blue-700">Yol Yardımı</span>
                                </div>
                            )}
                            {service.is_official_service && (
                                <div className="bg-green-50 rounded-xl p-3 text-center">
                                    <svg className="w-6 h-6 text-green-600 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium text-green-700">Yetkili Servis</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fixed Bottom Button */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
                    <a
                        href={`/randevu-al?servis=${encodeURIComponent(service.name)}&servis_id=${service.id}`}
                        className="block w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-xl text-center transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Randevu Al
                        </span>
                    </a>
                </div>
            </div>
        </>
    );
}
