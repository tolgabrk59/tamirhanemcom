// Araç değer hesaplama algoritması
import {
  vehicleBasePrices,
  depreciationRates,
  mileageFactors,
  transmissionFactors,
  fuelFactors,
  damageFactors,
  colorFactors,
  getBasePrice,
  getSegment,
} from '@/data/vehicle-prices';

export interface VehicleDetails {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  transmission: 'manuel' | 'otomatik' | 'yarimotomatik';
  fuel: 'benzin' | 'dizel' | 'lpg' | 'hibrit' | 'elektrik';
  damage: 'hasarsiz' | 'boyali' | 'degisen' | 'agirhasar';
  color: 'beyaz' | 'siyah' | 'gri' | 'gumus' | 'mavi' | 'kirmizi' | 'diger';
}

export interface ValuationResult {
  estimatedValue: number;
  minValue: number;
  maxValue: number;
  basePrice: number;
  depreciationLoss: number;
  factors: {
    age: number;
    mileage: number;
    transmission: number;
    fuel: number;
    damage: number;
    color: number;
    total: number;
  };
  segment: string;
  confidence: 'yuksek' | 'orta' | 'dusuk';
  warnings: string[];
}

export function calculateVehicleValue(details: VehicleDetails): ValuationResult | null {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - details.year;

  // Temel fiyatı al
  const basePrice = getBasePrice(details.brand, details.model);
  const segment = getSegment(details.brand, details.model);

  if (!basePrice || !segment) {
    return null;
  }

  const warnings: string[] = [];

  // Yaş kontrolü
  if (vehicleAge < 0) {
    warnings.push('Geçersiz model yılı');
    return null;
  }

  if (vehicleAge > 20) {
    warnings.push('20 yaşından büyük araçlar için tahmin güvenilirliği düşüktür');
  }

  // 1. Yaşa göre değer kaybı hesapla
  let depreciatedValue = basePrice;
  const rates = depreciationRates[segment] || depreciationRates['orta'];

  for (let i = 0; i < vehicleAge; i++) {
    const rate = i < rates.length ? rates[i] : rates[rates.length - 1];
    depreciatedValue *= (1 - rate / 100);
  }

  const depreciationLoss = basePrice - depreciatedValue;

  // 2. Faktörleri uygula

  // KM faktörü
  const expectedKm = vehicleAge * 15000; // Yıllık ortalama 15.000 km
  const mileageFactor = mileageFactors.find(m => details.mileage <= m.maxKm)?.factor || 0.60;

  // KM'ye göre ek düzeltme (beklenen km'den fazla/az ise)
  let kmAdjustment = 1;
  if (details.mileage < expectedKm * 0.5) {
    kmAdjustment = 1.05; // Az kullanılmış
    warnings.push('Yaşına göre düşük kilometreli araç');
  } else if (details.mileage > expectedKm * 1.5) {
    kmAdjustment = 0.92; // Çok kullanılmış
    warnings.push('Yaşına göre yüksek kilometreli araç');
  }

  const finalMileageFactor = mileageFactor * kmAdjustment;

  // Diğer faktörler
  const transFactor = transmissionFactors[details.transmission] || 1;
  const fuelFactor = fuelFactors[details.fuel] || 1;
  const damageFactor = damageFactors[details.damage] || 1;
  const colorFactor = colorFactors[details.color] || 1;

  // Hasar uyarıları
  if (details.damage === 'degisen') {
    warnings.push('Değişen parça araç değerini önemli ölçüde düşürür');
  } else if (details.damage === 'agirhasar') {
    warnings.push('Ağır hasarlı araç kaydı değeri ciddi şekilde etkiler');
  }

  // LPG uyarısı
  if (details.fuel === 'lpg') {
    warnings.push('LPG dönüşümlü araçlar genellikle daha düşük değerlenir');
  }

  // Toplam faktör
  const totalFactor = finalMileageFactor * transFactor * fuelFactor * damageFactor * colorFactor;

  // Son değeri hesapla
  const estimatedValue = Math.round(depreciatedValue * totalFactor);

  // Min-Max aralığı (%10 tolerans)
  const minValue = Math.round(estimatedValue * 0.90);
  const maxValue = Math.round(estimatedValue * 1.10);

  // Güven seviyesi belirle
  let confidence: 'yuksek' | 'orta' | 'dusuk' = 'yuksek';
  if (vehicleAge > 15 || details.damage === 'agirhasar') {
    confidence = 'dusuk';
  } else if (vehicleAge > 10 || details.damage === 'degisen' || warnings.length > 2) {
    confidence = 'orta';
  }

  return {
    estimatedValue,
    minValue,
    maxValue,
    basePrice,
    depreciationLoss,
    factors: {
      age: vehicleAge,
      mileage: finalMileageFactor,
      transmission: transFactor,
      fuel: fuelFactor,
      damage: damageFactor,
      color: colorFactor,
      total: totalFactor,
    },
    segment,
    confidence,
    warnings,
  };
}

// Para formatı
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Kısa para formatı (1.5M TL gibi)
export function formatCurrencyShort(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M TL`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K TL`;
  }
  return `${value} TL`;
}
