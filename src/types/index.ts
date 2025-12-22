// ============================================
// Working Hours Types
// ============================================
export interface DayHours {
  open: string;
  close: string;
  is_closed?: boolean;
}

export interface WorkingHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
  pazartesi?: DayHours;
  sali?: DayHours;
  carsamba?: DayHours;
  persembe?: DayHours;
  cuma?: DayHours;
  cumartesi?: DayHours;
  pazar?: DayHours;
}

// ============================================
// Supported Vehicle Types
// ============================================
export interface SupportedVehicle {
  brand: string;
  model?: string;
  fuel_type?: string;
  year_from?: number;
  year_to?: number;
}

// ============================================
// Service Provider Types (from ServiceCard)
// ============================================
export interface ServiceProvider {
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
  supported_vehicles?: SupportedVehicle[];
  supports_all_vehicles?: boolean;
  working_hours?: WorkingHours;
  description?: string;
  address?: string;
  city?: string;
  district?: string;
  website?: string;
  email?: string;
}

// ============================================
// Search/Filter Types
// ============================================
export interface SearchFilters {
  city?: string;
  district?: string;
  brand?: string;
  model?: string;
  category?: string;
  vehicleType?: 'otomobil' | 'motorsiklet' | '';
  packageName?: string;
}

export interface Brand {
  brand: string;
}

export interface Model {
  model: string;
}

export interface FilterCategory {
  id: number;
  name: string;
  slug?: string;
  icon?: string;
}

// ============================================
// Location Types
// ============================================
export interface UserLocation {
  lat: number;
  lng: number;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

// ============================================
// Strapi Response Types
// ============================================
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiData<T> {
  id: number;
  attributes: T;
}

// Category Types
export interface Category {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon?: {
    url: string;
  };
}

export interface CategoryAttributes {
  title: string;
  slug: string;
  description: string;
  icon?: {
    data?: {
      attributes: {
        url: string;
      };
    };
  };
}

// Vehicle Types
export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  engineType?: string;
}

export interface VehicleAttributes {
  brand: string;
  model: string;
  year: number;
  engineType?: string;
}

// OBD Code Types
export interface ObdCode {
  id: number;
  code: string;
  title: string;
  description: string;
  symptoms: string[];
  causes: string[];
  fixes: string[];
  estimatedCostMin: number | null;
  estimatedCostMax: number | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  frequency?: number;
}

export interface ObdCodeAttributes {
  code: string;
  title: string;
  description: string;
  symptoms: string[];
  causes: string[];
  fixes: string[];
  estimatedCostMin: number;
  estimatedCostMax: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
}

// Service Types
export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  priceMin: number;
  priceMax: number;
  duration: string;
  category: string;
}

// Review Types
export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  service?: string;
}

// Common Problem Types
export interface CommonProblem {
  id: number;
  brand: string;
  model?: string;
  title: string;
  description: string;
  symptoms: string[];
  estimatedCost: string;
  frequency: string;
}

// FAQ Types
export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

// Search/Filter Types
export interface VehicleSearch {
  brand: string;
  model: string;
  year: number;
  serviceType?: string;
}

// Cost Estimation Types
export interface CostEstimate {
  service: string;
  laborCostMin: number;
  laborCostMax: number;
  partsCostMin: number;
  partsCostMax: number;
  totalMin: number;
  totalMax: number;
  duration: string;
  notes?: string;
}
export interface VehicleData {
  specs: {
    engine: string;
    horsepower: string;
    torque: string;
    transmission: string;
    drivetrain?: string;
    fuel_economy?: string;
    fuelConsumption?: string;
  };
  tires?: {
    standard: string;
    alternative: string[];
    pressure: string;
  };
  chronic_problems?: {
    problem: string;
    description: string;
    severity: string;
    significance_score: number;
  }[];
  maintenance?: {
     oil_type: string;
     oil_capacity: string;
     intervals: { km: string; action: string }[];
  };
  pros?: string[];
  cons?: string[];
  summary?: string;
  image_url?: string | null;
  estimated_prices?: {
      market_min: string;
      market_max: string;
      average: string;
  };
  price?: { average: string }; // Fallback/alias if needed
}
