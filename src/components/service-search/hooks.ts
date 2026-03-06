import { useState, useEffect, useRef, useCallback } from 'react';
import { Service, ServiceSearchFilters, LocationCluster } from './types';
import { CITY_COORDINATES, DEFAULT_MAP_CENTER } from './data';

export function useServiceSearch(filters: ServiceSearchFilters, isOpen: boolean) {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchServices = useCallback(async () => {
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
                setError('Servisler yuklenemedi');
            }
        } catch (err) {
            setError('Bir hata olustu');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        if (isOpen) fetchServices();
    }, [isOpen, fetchServices]);

    return { services, loading, error };
}

export function useFilteredServices(
    services: Service[],
    sortBy: string,
    filterOfficial: boolean,
    filterRoadside: boolean
) {
    return services
        .filter(s => !filterOfficial || s.is_official_service)
        .filter(s => !filterRoadside || s.provides_roadside_assistance)
        .sort((a, b) => {
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            if (sortBy === 'reviews') return (b.rating_count || 0) - (a.rating_count || 0);
            return 0;
        });
}

export function useLocationClusters(services: Service[]): LocationCluster[] {
    const clusters: Record<string, Service[]> = {};

    services.forEach(service => {
        if (!service.latitude || !service.longitude) return;
        const locationKey = service.location || 'Diger';
        if (!clusters[locationKey]) clusters[locationKey] = [];
        clusters[locationKey].push(service);
    });

    return Object.entries(clusters).map(([location, locationServices]) => {
        const centerLat = locationServices.reduce((sum, s) => sum + (s.latitude || 0), 0) / locationServices.length;
        const centerLng = locationServices.reduce((sum, s) => sum + (s.longitude || 0), 0) / locationServices.length;
        return { location, lat: centerLat, lng: centerLng, count: locationServices.length, services: locationServices };
    });
}

export function useMapCenter(filters: ServiceSearchFilters, services: Service[]) {
    if (filters.district && CITY_COORDINATES[filters.district]) {
        return { longitude: CITY_COORDINATES[filters.district][0], latitude: CITY_COORDINATES[filters.district][1] };
    }
    if (filters.city && CITY_COORDINATES[filters.city]) {
        return { longitude: CITY_COORDINATES[filters.city][0], latitude: CITY_COORDINATES[filters.city][1] };
    }
    if (services.length > 0 && services[0].latitude && services[0].longitude) {
        return { longitude: services[0].longitude, latitude: services[0].latitude };
    }
    return DEFAULT_MAP_CENTER;
}

export function useMapFitBounds(mapRef: React.RefObject<any>, services: Service[], filters: ServiceSearchFilters) {
    useEffect(() => {
        if (!mapRef.current || services.length === 0) return;

        const lngs = services.filter(s => s.longitude).map(s => s.longitude);
        const lats = services.filter(s => s.latitude).map(s => s.latitude);

        if (services.length > 1 && lngs.length > 0 && lats.length > 0) {
            const bounds: [[number, number], [number, number]] = [
                [Math.min(...lngs), Math.min(...lats)],
                [Math.max(...lngs), Math.max(...lats)]
            ];
            try {
                mapRef.current.fitBounds(bounds, { padding: 80, duration: 1000, maxZoom: 14 });
            } catch {
                const center = { lng: lngs[0], lat: lats[0] };
                mapRef.current.flyTo({ center: [center.lng, center.lat], zoom: 13, duration: 1000 });
            }
        } else if (services.length === 1 && lngs.length > 0) {
            mapRef.current.flyTo({ center: [lngs[0], lats[0]], zoom: 15, duration: 1000 });
        }
    }, [services, filters.city, filters.district]);
}
