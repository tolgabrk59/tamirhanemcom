'use client';

import { useRef, useState } from 'react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Service, LocationCluster, ServiceSearchFilters } from './types';
import { ClusterMarker, ServicePopup, ZoomControls } from './MapMarkers';
import { useMapCenter, useMapFitBounds } from './hooks';

interface ServiceMapProps {
    services: Service[];
    clusters: LocationCluster[];
    filters: ServiceSearchFilters;
    hoveredService: number | null;
    onServiceHover: (id: number | null) => void;
}

export function ServiceMap({ services, clusters, filters, hoveredService, onServiceHover }: ServiceMapProps) {
    const mapRef = useRef<any>(null);
    const [popupInfo, setPopupInfo] = useState<Service | null>(null);
    const [expandedCluster, setExpandedCluster] = useState<string | null>(null);

    const mapCenter = useMapCenter(filters, services);
    useMapFitBounds(mapRef, services, filters);

    if (services.length === 0) return null;

    return (
        <>
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl px-6 py-4 border-2 border-primary-100 backdrop-blur-sm">
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-3">
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                        {services.length}
                    </span>
                    <span className="text-gray-700 font-medium">servis bulundu</span>
                    <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                </p>
            </div>

            <Map
                key={`${filters.city}-${filters.district}-${services.length}`}
                ref={mapRef}
                initialViewState={{ ...mapCenter, zoom: 14 }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
            >
                {clusters.map((cluster) => {
                    const clusterKey = `${cluster.location}-${cluster.lat}-${cluster.lng}`;
                    return (
                        <ClusterMarker
                            key={clusterKey}
                            cluster={cluster}
                            isExpanded={expandedCluster === clusterKey}
                            hoveredService={hoveredService}
                            onExpand={() => setExpandedCluster(clusterKey)}
                            onCollapse={() => setExpandedCluster(null)}
                            onServiceClick={setPopupInfo}
                            onServiceHover={onServiceHover}
                        />
                    );
                })}

                <ZoomControls mapRef={mapRef} />

                {popupInfo && <ServicePopup service={popupInfo} onClose={() => setPopupInfo(null)} />}
            </Map>
        </>
    );
}
