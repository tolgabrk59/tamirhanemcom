export interface StrapiResponse<T> {
  data: StrapiEntity<T>[]
  meta: { pagination: StrapiPagination }
}

export interface StrapiSingleResponse<T> {
  data: StrapiEntity<T>
}

export interface StrapiEntity<T> {
  id: number
  attributes: T
}

export interface StrapiPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface Category {
  name: string
  title: string
  description: string
  slug: string
}

export interface Service {
  id: number
  name: string
  location: string
  rating: number | null
  rating_count: number | null
  latitude: string | null
  longitude: string | null
  phone: string | null
  pic: string | null
  is_official_service: boolean
  provides_roadside_assistance: boolean
  categories?: string[]
  supported_vehicles?: SupportedVehicle[]
  supports_all_vehicles?: boolean
  working_hours?: Record<string, DayHours>
  description?: string
  address?: string
  city?: string
  district?: string
}

export interface SupportedVehicle {
  brand: string
  model?: string
  fuel_type?: string
  year_from?: number
  year_to?: number
}

export interface DayHours {
  open: string
  close: string
  is_closed?: boolean
}

export interface VehicleAnalysis {
  brand: string
  model: string
  year: number
  data: {
    specs: {
      engine: string
      horsepower: string
      torque: string
      transmission: string
      drivetrain: string
      fuel_economy: string
    }
    chronic_problems: {
      problem: string
      description: string
      severity: 'Dusuk' | 'Orta' | 'Yuksek'
      significance_score: number
    }[]
    maintenance: {
      oil_type: string
      oil_capacity: string
      intervals: { km: string; action: string }[]
    }
    pros: string[]
    cons: string[]
    summary: string
    image_url?: string
  }
}

export interface Testimonial {
  name: string
  role: string
  avatar?: string
  content: string
  rating: number
  city: string
}

export interface ServiceCategory {
  id: string
  name: string
  icon: string
  description: string
  count: number
  color: string
}

export interface CommonProblem {
  id: number
  brand: string
  model?: string
  title: string
  description: string
  symptoms: string[]
  estimatedCost: string
  frequency: string
}
