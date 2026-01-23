// Araç referans fiyatları ve değer hesaplama verileri
// Not: Bu fiyatlar tahmini referans değerlerdir, gerçek piyasa fiyatları değişkenlik gösterebilir.

export interface VehiclePrice {
  brand: string;
  model: string;
  basePrice: number; // 2024 model tahmini sıfır fiyat (TL)
  segment: 'ekonomi' | 'orta' | 'ust' | 'luks' | 'suv' | 'ticari';
}

// Motor ve paket seçenekleri - marka/model bazlı
export interface EngineOption {
  slug: string;      // URL için: "1-6-tdi"
  label: string;     // Görüntüleme: "1.6 TDI"
}

export interface PackageOption {
  slug: string;      // URL için: "comfortline"
  label: string;     // Görüntüleme: "Comfortline"
}

// Yaygın motor seçenekleri
export const commonEngines: Record<string, EngineOption[]> = {
  'Volkswagen': [
    { slug: '1-0-tsi', label: '1.0 TSI' },
    { slug: '1-2-tsi', label: '1.2 TSI' },
    { slug: '1-4-tsi', label: '1.4 TSI' },
    { slug: '1-5-tsi', label: '1.5 TSI' },
    { slug: '1-5-etsi', label: '1.5 eTSI' },
    { slug: '1-6-tdi', label: '1.6 TDI' },
    { slug: '2-0-tdi', label: '2.0 TDI' },
  ],
  'BMW': [
    { slug: '116d', label: '116d' },
    { slug: '118i', label: '118i' },
    { slug: '120i', label: '120i' },
    { slug: '320i', label: '320i' },
    { slug: '320d', label: '320d' },
    { slug: '520i', label: '520i' },
    { slug: '520d', label: '520d' },
  ],
  'Mercedes': [
    { slug: 'a-180', label: 'A 180' },
    { slug: 'a-200', label: 'A 200' },
    { slug: 'c-180', label: 'C 180' },
    { slug: 'c-200', label: 'C 200' },
    { slug: 'e-200', label: 'E 200' },
    { slug: 'e-220-d', label: 'E 220 d' },
  ],
  'Audi': [
    { slug: '1-4-tfsi', label: '1.4 TFSI' },
    { slug: '1-5-tfsi', label: '1.5 TFSI' },
    { slug: '2-0-tfsi', label: '2.0 TFSI' },
    { slug: '2-0-tdi', label: '2.0 TDI' },
    { slug: '35-tfsi', label: '35 TFSI' },
    { slug: '40-tfsi', label: '40 TFSI' },
  ],
  'Renault': [
    { slug: '1-0-sce', label: '1.0 SCe' },
    { slug: '1-0-tce', label: '1.0 TCe' },
    { slug: '1-3-tce', label: '1.3 TCe' },
    { slug: '1-5-dci', label: '1.5 dCi' },
    { slug: '1-5-blue-dci', label: '1.5 Blue dCi' },
  ],
  'Ford': [
    { slug: '1-0-ecoboost', label: '1.0 EcoBoost' },
    { slug: '1-5-ecoboost', label: '1.5 EcoBoost' },
    { slug: '1-5-tdci', label: '1.5 TDCi' },
    { slug: '1-6-tdci', label: '1.6 TDCi' },
    { slug: '2-0-tdci', label: '2.0 TDCi' },
  ],
  'Hyundai': [
    { slug: '1-0-t-gdi', label: '1.0 T-GDI' },
    { slug: '1-4-mpi', label: '1.4 MPI' },
    { slug: '1-6-crdi', label: '1.6 CRDi' },
    { slug: '1-6-gdi', label: '1.6 GDI' },
  ],
  'Toyota': [
    { slug: '1-33', label: '1.33' },
    { slug: '1-5', label: '1.5' },
    { slug: '1-6', label: '1.6' },
    { slug: '1-8-hybrid', label: '1.8 Hybrid' },
    { slug: '2-0-hybrid', label: '2.0 Hybrid' },
  ],
  'Fiat': [
    { slug: '1-3-multijet', label: '1.3 MultiJet' },
    { slug: '1-4', label: '1.4' },
    { slug: '1-4-fire', label: '1.4 Fire' },
    { slug: '1-6-multijet', label: '1.6 MultiJet' },
  ],
};

// Yaygın paket seçenekleri
export const commonPackages: Record<string, PackageOption[]> = {
  'Volkswagen': [
    { slug: 'trendline', label: 'Trendline' },
    { slug: 'comfortline', label: 'Comfortline' },
    { slug: 'highline', label: 'Highline' },
    { slug: 'r-line', label: 'R-Line' },
    { slug: 'life', label: 'Life' },
    { slug: 'style', label: 'Style' },
  ],
  'BMW': [
    { slug: 'advantage', label: 'Advantage' },
    { slug: 'sport-line', label: 'Sport Line' },
    { slug: 'luxury-line', label: 'Luxury Line' },
    { slug: 'm-sport', label: 'M Sport' },
  ],
  'Mercedes': [
    { slug: 'style', label: 'Style' },
    { slug: 'progressive', label: 'Progressive' },
    { slug: 'amg', label: 'AMG' },
    { slug: 'avantgarde', label: 'Avantgarde' },
  ],
  'Audi': [
    { slug: 'design', label: 'Design' },
    { slug: 'sport', label: 'Sport' },
    { slug: 's-line', label: 'S Line' },
  ],
  'Renault': [
    { slug: 'joy', label: 'Joy' },
    { slug: 'touch', label: 'Touch' },
    { slug: 'icon', label: 'Icon' },
    { slug: 'rs-line', label: 'RS Line' },
  ],
  'Ford': [
    { slug: 'trend', label: 'Trend' },
    { slug: 'titanium', label: 'Titanium' },
    { slug: 'st-line', label: 'ST-Line' },
    { slug: 'vignale', label: 'Vignale' },
  ],
  'Hyundai': [
    { slug: 'jump', label: 'Jump' },
    { slug: 'style', label: 'Style' },
    { slug: 'elite', label: 'Elite' },
    { slug: 'prime', label: 'Prime' },
  ],
  'Toyota': [
    { slug: 'dream', label: 'Dream' },
    { slug: 'vision', label: 'Vision' },
    { slug: 'passion', label: 'Passion' },
    { slug: 'flame', label: 'Flame' },
  ],
  'Fiat': [
    { slug: 'easy', label: 'Easy' },
    { slug: 'urban', label: 'Urban' },
    { slug: 'lounge', label: 'Lounge' },
    { slug: 'cross', label: 'Cross' },
  ],
};

// Yardımcı fonksiyonlar
export function getEnginesByBrand(brand: string): EngineOption[] {
  return commonEngines[brand] || [];
}

export function getPackagesByBrand(brand: string): PackageOption[] {
  return commonPackages[brand] || [];
}

// Popüler araçların tahmini 2024 sıfır fiyatları
export const vehicleBasePrices: VehiclePrice[] = [
  // Audi
  { brand: 'Audi', model: 'A1', basePrice: 1850000, segment: 'orta' },
  { brand: 'Audi', model: 'A3', basePrice: 2400000, segment: 'orta' },
  { brand: 'Audi', model: 'A4', basePrice: 3200000, segment: 'ust' },
  { brand: 'Audi', model: 'A5', basePrice: 3800000, segment: 'ust' },
  { brand: 'Audi', model: 'A6', basePrice: 4500000, segment: 'luks' },
  { brand: 'Audi', model: 'Q3', basePrice: 2800000, segment: 'suv' },
  { brand: 'Audi', model: 'Q5', basePrice: 3600000, segment: 'suv' },
  { brand: 'Audi', model: 'Q7', basePrice: 5500000, segment: 'suv' },

  // BMW
  { brand: 'BMW', model: '1 Serisi', basePrice: 2200000, segment: 'orta' },
  { brand: 'BMW', model: '3 Serisi', basePrice: 3000000, segment: 'ust' },
  { brand: 'BMW', model: '5 Serisi', basePrice: 4200000, segment: 'luks' },
  { brand: 'BMW', model: 'X1', basePrice: 2600000, segment: 'suv' },
  { brand: 'BMW', model: 'X3', basePrice: 3400000, segment: 'suv' },
  { brand: 'BMW', model: 'X5', basePrice: 5000000, segment: 'suv' },

  // Citroen
  { brand: 'Citroen', model: 'C3', basePrice: 850000, segment: 'ekonomi' },
  { brand: 'Citroen', model: 'C4', basePrice: 1100000, segment: 'orta' },
  { brand: 'Citroen', model: 'C-Elysee', basePrice: 750000, segment: 'ekonomi' },
  { brand: 'Citroen', model: 'Berlingo', basePrice: 950000, segment: 'ticari' },

  // Dacia
  { brand: 'Dacia', model: 'Sandero', basePrice: 650000, segment: 'ekonomi' },
  { brand: 'Dacia', model: 'Duster', basePrice: 950000, segment: 'suv' },
  { brand: 'Dacia', model: 'Logan', basePrice: 600000, segment: 'ekonomi' },
  { brand: 'Dacia', model: 'Jogger', basePrice: 850000, segment: 'orta' },

  // Fiat
  { brand: 'Fiat', model: 'Egea', basePrice: 850000, segment: 'ekonomi' },
  { brand: 'Fiat', model: '500', basePrice: 1100000, segment: 'ekonomi' },
  { brand: 'Fiat', model: '500X', basePrice: 1400000, segment: 'suv' },
  { brand: 'Fiat', model: 'Tipo', basePrice: 950000, segment: 'orta' },
  { brand: 'Fiat', model: 'Doblo', basePrice: 800000, segment: 'ticari' },
  { brand: 'Fiat', model: 'Fiorino', basePrice: 650000, segment: 'ticari' },

  // Ford
  { brand: 'Ford', model: 'Fiesta', basePrice: 900000, segment: 'ekonomi' },
  { brand: 'Ford', model: 'Focus', basePrice: 1200000, segment: 'orta' },
  { brand: 'Ford', model: 'Puma', basePrice: 1400000, segment: 'suv' },
  { brand: 'Ford', model: 'Kuga', basePrice: 1800000, segment: 'suv' },
  { brand: 'Ford', model: 'Tourneo Courier', basePrice: 950000, segment: 'ticari' },
  { brand: 'Ford', model: 'Transit', basePrice: 1100000, segment: 'ticari' },

  // Honda
  { brand: 'Honda', model: 'Civic', basePrice: 1600000, segment: 'orta' },
  { brand: 'Honda', model: 'HR-V', basePrice: 1800000, segment: 'suv' },
  { brand: 'Honda', model: 'CR-V', basePrice: 2200000, segment: 'suv' },
  { brand: 'Honda', model: 'Jazz', basePrice: 1200000, segment: 'ekonomi' },

  // Hyundai
  { brand: 'Hyundai', model: 'i10', basePrice: 650000, segment: 'ekonomi' },
  { brand: 'Hyundai', model: 'i20', basePrice: 850000, segment: 'ekonomi' },
  { brand: 'Hyundai', model: 'i30', basePrice: 1100000, segment: 'orta' },
  { brand: 'Hyundai', model: 'Elantra', basePrice: 1300000, segment: 'orta' },
  { brand: 'Hyundai', model: 'Tucson', basePrice: 1700000, segment: 'suv' },
  { brand: 'Hyundai', model: 'Kona', basePrice: 1400000, segment: 'suv' },
  { brand: 'Hyundai', model: 'Bayon', basePrice: 1000000, segment: 'suv' },

  // Kia
  { brand: 'Kia', model: 'Picanto', basePrice: 650000, segment: 'ekonomi' },
  { brand: 'Kia', model: 'Rio', basePrice: 850000, segment: 'ekonomi' },
  { brand: 'Kia', model: 'Ceed', basePrice: 1200000, segment: 'orta' },
  { brand: 'Kia', model: 'Sportage', basePrice: 1800000, segment: 'suv' },
  { brand: 'Kia', model: 'Stonic', basePrice: 1100000, segment: 'suv' },

  // Mercedes
  { brand: 'Mercedes', model: 'A Serisi', basePrice: 2400000, segment: 'orta' },
  { brand: 'Mercedes', model: 'C Serisi', basePrice: 3200000, segment: 'ust' },
  { brand: 'Mercedes', model: 'E Serisi', basePrice: 4500000, segment: 'luks' },
  { brand: 'Mercedes', model: 'S Serisi', basePrice: 8000000, segment: 'luks' },
  { brand: 'Mercedes', model: 'GLA', basePrice: 2800000, segment: 'suv' },
  { brand: 'Mercedes', model: 'GLC', basePrice: 3600000, segment: 'suv' },
  { brand: 'Mercedes', model: 'GLE', basePrice: 5500000, segment: 'suv' },
  { brand: 'Mercedes', model: 'Vito', basePrice: 2200000, segment: 'ticari' },

  // Nissan
  { brand: 'Nissan', model: 'Micra', basePrice: 850000, segment: 'ekonomi' },
  { brand: 'Nissan', model: 'Juke', basePrice: 1200000, segment: 'suv' },
  { brand: 'Nissan', model: 'Qashqai', basePrice: 1600000, segment: 'suv' },
  { brand: 'Nissan', model: 'X-Trail', basePrice: 2000000, segment: 'suv' },

  // Opel
  { brand: 'Opel', model: 'Corsa', basePrice: 850000, segment: 'ekonomi' },
  { brand: 'Opel', model: 'Astra', basePrice: 1200000, segment: 'orta' },
  { brand: 'Opel', model: 'Mokka', basePrice: 1400000, segment: 'suv' },
  { brand: 'Opel', model: 'Crossland', basePrice: 1100000, segment: 'suv' },
  { brand: 'Opel', model: 'Grandland', basePrice: 1600000, segment: 'suv' },

  // Peugeot
  { brand: 'Peugeot', model: '208', basePrice: 900000, segment: 'ekonomi' },
  { brand: 'Peugeot', model: '308', basePrice: 1300000, segment: 'orta' },
  { brand: 'Peugeot', model: '508', basePrice: 1800000, segment: 'ust' },
  { brand: 'Peugeot', model: '2008', basePrice: 1200000, segment: 'suv' },
  { brand: 'Peugeot', model: '3008', basePrice: 1600000, segment: 'suv' },
  { brand: 'Peugeot', model: '5008', basePrice: 1900000, segment: 'suv' },
  { brand: 'Peugeot', model: 'Rifter', basePrice: 1100000, segment: 'ticari' },

  // Renault
  { brand: 'Renault', model: 'Clio', basePrice: 850000, segment: 'ekonomi' },
  { brand: 'Renault', model: 'Megane', basePrice: 1100000, segment: 'orta' },
  { brand: 'Renault', model: 'Taliant', basePrice: 750000, segment: 'ekonomi' },
  { brand: 'Renault', model: 'Captur', basePrice: 1200000, segment: 'suv' },
  { brand: 'Renault', model: 'Kadjar', basePrice: 1400000, segment: 'suv' },
  { brand: 'Renault', model: 'Austral', basePrice: 1700000, segment: 'suv' },
  { brand: 'Renault', model: 'Kangoo', basePrice: 900000, segment: 'ticari' },

  // Seat
  { brand: 'Seat', model: 'Ibiza', basePrice: 900000, segment: 'ekonomi' },
  { brand: 'Seat', model: 'Leon', basePrice: 1300000, segment: 'orta' },
  { brand: 'Seat', model: 'Arona', basePrice: 1100000, segment: 'suv' },
  { brand: 'Seat', model: 'Ateca', basePrice: 1500000, segment: 'suv' },

  // Skoda
  { brand: 'Skoda', model: 'Fabia', basePrice: 900000, segment: 'ekonomi' },
  { brand: 'Skoda', model: 'Scala', basePrice: 1100000, segment: 'orta' },
  { brand: 'Skoda', model: 'Octavia', basePrice: 1400000, segment: 'orta' },
  { brand: 'Skoda', model: 'Superb', basePrice: 1800000, segment: 'ust' },
  { brand: 'Skoda', model: 'Kamiq', basePrice: 1200000, segment: 'suv' },
  { brand: 'Skoda', model: 'Karoq', basePrice: 1500000, segment: 'suv' },
  { brand: 'Skoda', model: 'Kodiaq', basePrice: 1900000, segment: 'suv' },

  // Suzuki
  { brand: 'Suzuki', model: 'Swift', basePrice: 850000, segment: 'ekonomi' },
  { brand: 'Suzuki', model: 'Vitara', basePrice: 1200000, segment: 'suv' },
  { brand: 'Suzuki', model: 'S-Cross', basePrice: 1400000, segment: 'suv' },
  { brand: 'Suzuki', model: 'Jimny', basePrice: 1100000, segment: 'suv' },

  // Toyota
  { brand: 'Toyota', model: 'Yaris', basePrice: 1100000, segment: 'ekonomi' },
  { brand: 'Toyota', model: 'Corolla', basePrice: 1400000, segment: 'orta' },
  { brand: 'Toyota', model: 'Camry', basePrice: 2000000, segment: 'ust' },
  { brand: 'Toyota', model: 'C-HR', basePrice: 1600000, segment: 'suv' },
  { brand: 'Toyota', model: 'RAV4', basePrice: 2200000, segment: 'suv' },
  { brand: 'Toyota', model: 'Land Cruiser', basePrice: 5000000, segment: 'suv' },

  // Volkswagen
  { brand: 'Volkswagen', model: 'Polo', basePrice: 1100000, segment: 'ekonomi' },
  { brand: 'Volkswagen', model: 'Golf', basePrice: 1500000, segment: 'orta' },
  { brand: 'Volkswagen', model: 'Passat', basePrice: 2000000, segment: 'ust' },
  { brand: 'Volkswagen', model: 'T-Roc', basePrice: 1600000, segment: 'suv' },
  { brand: 'Volkswagen', model: 'Tiguan', basePrice: 1900000, segment: 'suv' },
  { brand: 'Volkswagen', model: 'Touareg', basePrice: 4500000, segment: 'suv' },
  { brand: 'Volkswagen', model: 'Caddy', basePrice: 1200000, segment: 'ticari' },
  { brand: 'Volkswagen', model: 'Transporter', basePrice: 1800000, segment: 'ticari' },

  // Volvo
  { brand: 'Volvo', model: 'S60', basePrice: 2400000, segment: 'ust' },
  { brand: 'Volvo', model: 'S90', basePrice: 3500000, segment: 'luks' },
  { brand: 'Volvo', model: 'XC40', basePrice: 2200000, segment: 'suv' },
  { brand: 'Volvo', model: 'XC60', basePrice: 3000000, segment: 'suv' },
  { brand: 'Volvo', model: 'XC90', basePrice: 4500000, segment: 'suv' },
];

// Segment bazlı yıllık değer kaybı oranları (%)
export const depreciationRates: Record<string, number[]> = {
  // İlk 10 yıl için yıllık değer kaybı yüzdeleri
  ekonomi: [15, 12, 10, 9, 8, 7, 6, 5, 4, 4],
  orta: [18, 14, 11, 10, 9, 8, 7, 6, 5, 5],
  ust: [22, 16, 13, 11, 10, 9, 8, 7, 6, 5],
  luks: [25, 18, 15, 12, 11, 10, 9, 8, 7, 6],
  suv: [17, 13, 11, 10, 9, 8, 7, 6, 5, 5],
  ticari: [12, 10, 9, 8, 7, 6, 5, 5, 4, 4],
};

// KM bazlı değer düzeltme faktörleri
export const mileageFactors = [
  { maxKm: 10000, factor: 1.05 },
  { maxKm: 30000, factor: 1.02 },
  { maxKm: 50000, factor: 1.00 },
  { maxKm: 75000, factor: 0.97 },
  { maxKm: 100000, factor: 0.93 },
  { maxKm: 150000, factor: 0.88 },
  { maxKm: 200000, factor: 0.82 },
  { maxKm: 250000, factor: 0.75 },
  { maxKm: 300000, factor: 0.68 },
  { maxKm: Infinity, factor: 0.60 },
];

// Vites tipi faktörleri
export const transmissionFactors: Record<string, number> = {
  manuel: 0.97,
  otomatik: 1.03,
  yarimotomatik: 1.00,
};

// Yakıt tipi faktörleri
export const fuelFactors: Record<string, number> = {
  benzin: 1.00,
  dizel: 0.98,
  lpg: 0.92,
  hibrit: 1.08,
  elektrik: 1.12,
};

// Hasar durumu faktörleri
export const damageFactors: Record<string, number> = {
  hasarsiz: 1.00,
  boyali: 0.92,
  degisen: 0.82,
  agirhasar: 0.60,
};

// Renk faktörleri (popüler renkler daha değerli)
export const colorFactors: Record<string, number> = {
  beyaz: 1.02,
  siyah: 1.02,
  gri: 1.01,
  gumus: 1.00,
  mavi: 0.99,
  kirmizi: 0.98,
  diger: 0.97,
};

// Yardımcı fonksiyonlar
export function getBasePrice(brand: string, model: string): number | null {
  const vehicle = vehicleBasePrices.find(
    (v) => v.brand === brand && v.model === model
  );
  return vehicle?.basePrice ?? null;
}

export function getSegment(brand: string, model: string): string | null {
  const vehicle = vehicleBasePrices.find(
    (v) => v.brand === brand && v.model === model
  );
  return vehicle?.segment ?? null;
}

export function getAvailableModels(brand: string): string[] {
  return vehicleBasePrices
    .filter((v) => v.brand === brand)
    .map((v) => v.model);
}

export function getAvailableBrands(): string[] {
  return [...new Set(vehicleBasePrices.map((v) => v.brand))];
}
