'use client';

import { useState } from 'react';
import { ServiceCardSkeletonHorizontalList } from '../ServiceCardSkeleton';
import { ServiceSearchModalProps } from './types';
import { useServiceSearch, useFilteredServices, useLocationClusters } from './hooks';
import { ServiceCard } from './ServiceCard';
import { FilterButtons } from './FilterButtons';
import { ServiceMap } from './ServiceMap';

export default function ServiceSearchModal({ isOpen, onClose, filters }: ServiceSearchModalProps) {
    const [sortBy, setSortBy] = useState('recommended');
    const [filterOfficial, setFilterOfficial] = useState(false);
    const [filterRoadside, setFilterRoadside] = useState(false);
    const [hoveredService, setHoveredService] = useState<number | null>(null);
    const [selectedService, setSelectedService] = useState<number | null>(null);

    const { services, loading, error } = useServiceSearch(filters, isOpen);
    const filteredServices = useFilteredServices(services, sortBy, filterOfficial, filterRoadside);
    const locationClusters = useLocationClusters(filteredServices);

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
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {!loading && `${filteredServices.length} sonuc`}
                                </h2>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                    <option value="recommended">Tavsiye Edilen</option>
                                    <option value="rating">Puan</option>
                                    <option value="reviews">Yorum</option>
                                </select>
                            </div>

                            <FilterButtons
                                filterOfficial={filterOfficial}
                                filterRoadside={filterRoadside}
                                onToggleOfficial={() => setFilterOfficial(!filterOfficial)}
                                onToggleRoadside={() => setFilterRoadside(!filterRoadside)}
                            />

                            {loading && <ServiceCardSkeletonHorizontalList count={4} />}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}
                            {!loading && !error && filteredServices.length === 0 && (
                                <div className="bg-gray-50 rounded-lg p-8 text-center">
                                    <h3 className="text-sm font-semibold text-gray-900">Servis Bulunamadi</h3>
                                </div>
                            )}

                            {!loading && !error && filteredServices.map((service, index) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    index={index}
                                    isHovered={hoveredService === service.id}
                                    onHover={setHoveredService}
                                    onClick={() => setSelectedService(service.id)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="hidden lg:block lg:w-3/5 relative">
                        <ServiceMap
                            services={filteredServices}
                            clusters={locationClusters}
                            filters={filters}
                            hoveredService={hoveredService}
                            onServiceHover={setHoveredService}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
