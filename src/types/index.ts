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

// ============================================
// Enhanced OBD Types (Teknik Teşhis Derinliği)
// ============================================
export interface ObdSymptomDetailed {
  symptom: string;
  severity: 'mild' | 'moderate' | 'severe';
  frequency: 'common' | 'occasional' | 'rare';
}

export interface ObdCauseDetailed {
  cause: string;
  probability: number; // 0-100
  diagnosticTest?: string;
}

export interface DiagnosticTreeStep {
  id: number;
  question?: string | null;
  yesNext: number | null;
  noNext: number | null;
  action?: string;
  conclusion?: string;
  toolRequired?: string;
}

export interface DiagnosticTree {
  codeId: string;
  steps: DiagnosticTreeStep[];
  estimatedTime?: string; // örn: "15-30 dakika"
}

export interface TSBReference {
  tsbNumber: string;
  brand: string;
  models?: string[];
  description: string;
  date: string;
  url?: string;
  isRecall?: boolean;
}

export interface PartItem {
  name: string;
  partNumber?: string;
  costMin: number;
  costMax: number;
  isRequired: boolean;
  brand?: string; // OEM veya aftermarket
}

export interface BrandVariation {
  brand: string;
  modelPattern?: string; // regex veya wildcard
  specificCauses?: string[];
  specificSymptoms?: string[];
  specificNotes?: string;
  costMultiplier?: number; // 1.0 = standart, 1.5 = %50 daha pahalı
  commonYears?: string; // örn: "2010-2018"
}

export interface ObdCodeEnhanced extends ObdCode {
  symptomsDetailed?: ObdSymptomDetailed[];
  causesDetailed?: ObdCauseDetailed[];
  diagnosticTree?: DiagnosticTree;
  brandVariations?: BrandVariation[];
  tsbReferences?: TSBReference[];
  laborHours?: number;
  partsList?: PartItem[];
  relatedCodes?: string[];
  faqItems?: FAQ[];
}

// ============================================
// Live Data PID Types (Canlı Veri Rehberi)
// ============================================
export interface LiveDataPID {
  pidCode: string; // örn: "0106"
  name: string; // İngilizce
  nameTr: string; // Türkçe
  description: string;
  unit: string; // örn: "%", "°C", "rpm"
  normalRangeMin: number;
  normalRangeMax: number;
  warningMin?: number;
  warningMax?: number;
  relatedCodes?: string[];
  troubleshootingTips?: string[];
  diagnosticRelevance?: string;
  category: 'fuel' | 'ignition' | 'emissions' | 'sensors' | 'engine' | 'transmission';
  chartType: 'gauge' | 'line' | 'bar';
}

export interface FreezeFrameData {
  timestamp: string;
  obdCode: string;
  data: Record<string, number | string>;
  vehicleInfo?: {
    brand?: string;
    model?: string;
    year?: number;
    vin?: string;
  };
}

// ============================================
// OBD Device Integration Types
// ============================================
export interface OBDDevice {
  connected: boolean;
  deviceName?: string;
  protocol?: string; // örn: "ISO 9141-2", "CAN 11bit 500kbaud"
  vin?: string;
  voltage?: number;
  lastConnected?: string;
}

export interface DiagnosticReport {
  id: string;
  vehicleVin?: string;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  scanDate: string;
  codes: ObdCode[];
  freezeFrame?: FreezeFrameData;
  liveData?: Record<string, number>;
  recommendations?: string[];
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

// ============================================
// City-Service SEO Page Types
// ============================================
export interface CityServicePage {
  id: number;
  city: string;
  citySlug: string;
  service: Service;
  serviceSlug: string;
  title: string;
  metaDescription: string;
  h1Title: string;
  content: string;
  localTips?: string;
  averagePriceLocal?: number;
  geoLat: number;
  geoLng: number;
  faqItems?: FAQ[];
  relatedObdCodes?: string[];
  nearbyServices?: ServiceProvider[];
  lastUpdated?: string;
}

export interface CityInfo {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  population?: number;
  plateCode?: number; // 34, 06, 35 vb.
}

// ============================================
// KVKK / Consent Types
// ============================================
export interface ConsentPreferences {
  essential: boolean; // Her zaman true
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  consentDate: string;
  consentVersion: string;
  ipAddress?: string;
}

export interface ConsentCategory {
  id: 'essential' | 'analytics' | 'marketing' | 'personalization';
  name: string;
  description: string;
  required: boolean;
  cookies: string[]; // Bu kategorideki çerezler
  retentionPeriod: string; // örn: "1 yıl", "oturum sonu"
}

// ============================================
// Educational Content Types
// ============================================
export interface EducationalGuide {
  id: number;
  slug: string;
  title: string;
  metaDescription: string;
  content: string;
  category: 'karar-rehberi' | 'bakim' | 'ariza' | 'guvenlik';
  difficulty: 'kolay' | 'orta' | 'zor';
  estimatedReadTime: number; // dakika
  relatedObdCodes?: string[];
  relatedGuides?: string[];
  videoUrl?: string;
  steps?: DecisionFlowStep[];
  lastUpdated: string;
}

export interface DecisionFlowStep {
  id: number;
  question: string;
  options: {
    text: string;
    nextStepId: number | null;
    action?: string;
    warning?: string;
  }[];
}

// ============================================
// Payment Flow Types (Yakında)
// ============================================
export interface PaymentFlowStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: 'pending' | 'active' | 'completed';
}

export interface EscrowInfo {
  steps: PaymentFlowStep[];
  disputeResolutionDays: number;
  guarantees: string[];
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

// ============================================
// Çıkma Parça Pazaryeri Types
// ============================================
export type CikmaParcaCategory =
  | 'motor'
  | 'fren'
  | 'suspansiyon'
  | 'elektrik'
  | 'sogutma'
  | 'sanziman'
  | 'egzoz'
  | 'yakit'
  | 'kaporta'
  | 'ic-aksesuar'
  | 'diger';

export type CikmaParcaCondition =
  | 'cok-iyi'
  | 'iyi'
  | 'orta'
  | 'onarima-ihtiyaci-var';

export type CikmaParcaStatus = 'active' | 'sold' | 'reserved' | 'inactive';

export interface CikmaParca {
  id: number;
  title: string;
  description: string;
  category: CikmaParcaCategory;
  brand: string;
  model: string;
  yearFrom?: number;
  yearTo?: number;
  price: number;
  condition: CikmaParcaCondition;
  images: { url: string }[];
  seller: {
    id: number;
    name: string;
    location: string;
    phone?: string;
    rating?: number;
  };
  status: CikmaParcaStatus;
  oemCode?: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export type TeklifStatus = 'pending' | 'read' | 'replied' | 'accepted' | 'rejected';

export interface CikmaParcaTeklif {
  id: number;
  parca: { id: number; title: string };
  senderName: string;
  senderPhone: string;
  message: string;
  offeredPrice?: number;
  status: TeklifStatus;
  sellerReply?: string;
  createdAt: string;
}

// ============================================
// Park Mesaj (Hatalı Park Bildirimi) Types
// ============================================
export type ParkMesajType = 'cift-park' | 'engel' | 'is-yeri-onunde' | 'diger';
export type ParkMesajStatus = 'sent' | 'delivered' | 'read' | 'responded';

export interface AracPlaka {
  id: number;
  plaka: string;
  ownerPhone: string;
  ownerEmail?: string;
  brand?: string;
  model?: string;
  year?: number;
  isActive: boolean;
  createdAt: string;
}

export interface ParkMesaj {
  id: number;
  targetPlaka: string;
  senderPhone: string;
  messageType: ParkMesajType;
  message: string;
  locationDescription?: string;
  status: ParkMesajStatus;
  createdAt: string;
}
