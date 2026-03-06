'use client';

import { Marker, Popup } from 'react-map-gl/maplibre';
import { Service, LocationCluster } from './types';

interface ClusterMarkerProps {
    cluster: LocationCluster;
    isExpanded: boolean;
    hoveredService: number | null;
    onExpand: () => void;
    onCollapse: () => void;
    onServiceClick: (service: Service) => void;
    onServiceHover: (id: number | null) => void;
}

export function ClusterMarker({
    cluster,
    isExpanded,
    hoveredService,
    onExpand,
    onCollapse,
    onServiceClick,
    onServiceHover
}: ClusterMarkerProps) {
    const clusterKey = `${cluster.location}-${cluster.lat}-${cluster.lng}`;

    return (
        <div key={clusterKey}>
            {!isExpanded && (
                <Marker longitude={cluster.lng} latitude={cluster.lat} onClick={(e: any) => { e.originalEvent.stopPropagation(); onExpand(); }}>
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

            {isExpanded && cluster.services.map((service, idx) => {
                const angle = (idx / cluster.services.length) * 2 * Math.PI;
                const radius = 0.008;
                const offsetLng = Math.cos(angle) * radius;
                const offsetLat = Math.sin(angle) * radius;

                return (
                    <Marker
                        key={service.id}
                        longitude={cluster.lng + offsetLng}
                        latitude={cluster.lat + offsetLat}
                        onClick={(e: any) => { e.originalEvent.stopPropagation(); onServiceClick(service); }}
                    >
                        <div
                            className={`relative transition-all duration-300 cursor-pointer ${hoveredService === service.id ? 'scale-105 z-50' : 'hover:scale-105'}`}
                            onMouseEnter={() => onServiceHover(service.id)}
                            onMouseLeave={() => onServiceHover(null)}
                        >
                            <div className={`px-3 py-2 rounded-lg shadow-xl border-2 transition-all whitespace-nowrap ${
                                hoveredService === service.id
                                    ? 'bg-gradient-to-br from-secondary-500 to-secondary-600 border-white scale-110'
                                    : 'bg-white border-gray-300 hover:border-primary-500'
                            }`}>
                                <span className={`font-bold text-sm ${hoveredService === service.id ? 'text-white' : 'text-gray-900'}`}>
                                    {service.name}
                                </span>
                            </div>
                            {hoveredService === service.id && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-400 rounded-full animate-ping" />
                            )}
                        </div>
                    </Marker>
                );
            })}

            {isExpanded && (
                <Marker longitude={cluster.lng} latitude={cluster.lat} onClick={(e: any) => { e.originalEvent.stopPropagation(); onCollapse(); }}>
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
}

interface ServicePopupProps {
    service: Service;
    onClose: () => void;
}

export function ServicePopup({ service, onClose }: ServicePopupProps) {
    return (
        <Popup longitude={service.longitude} latitude={service.latitude} onClose={onClose} closeButton closeOnClick={false}>
            <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-sm mb-1">{service.name}</h3>
                <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-semibold text-primary-600">{service.rating?.toFixed(1)}</span>
                    <svg className="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
                <p className="text-xs text-gray-600 mb-2">{service.location}</p>
                <a href={`tel:${service.phone}`} className="block bg-primary-600 text-white text-center py-1.5 rounded text-xs font-semibold hover:bg-primary-700">
                    Hemen Ara
                </a>
            </div>
        </Popup>
    );
}

interface ZoomControlsProps {
    mapRef: React.RefObject<any>;
}

export function ZoomControls({ mapRef }: ZoomControlsProps) {
    return (
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
            <button
                onClick={() => mapRef.current?.zoomIn()}
                className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                title="Yakinlastir"
            >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>
            <button
                onClick={() => mapRef.current?.zoomOut()}
                className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                title="Uzaklastir"
            >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
            </button>
        </div>
    );
}
