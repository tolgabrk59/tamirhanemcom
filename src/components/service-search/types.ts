export interface Service {
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

export interface ServiceSearchFilters {
    brand?: string;
    model?: string;
    packageName?: string;
    category?: string;
    city?: string;
    district?: string;
}

export interface ServiceSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: ServiceSearchFilters;
}

export interface LocationCluster {
    location: string;
    lat: number;
    lng: number;
    count: number;
    services: Service[];
}
