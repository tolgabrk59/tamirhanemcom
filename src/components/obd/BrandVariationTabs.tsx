'use client';

import { useState } from 'react';
import { Car, AlertTriangle, DollarSign, Wrench, Calendar } from 'lucide-react';
import { BrandVariation } from '@/types';

interface BrandVariationTabsProps {
  obdCode: string;
  brandVariations?: BrandVariation[];
}

// Varsayılan marka varyasyonları (örnek veri)
const getDefaultVariations = (obdCode: string): BrandVariation[] => {
  // P0420 için örnek varyasyonlar
  if (obdCode.toUpperCase() === 'P0420') {
    return [
      {
        brand: 'Toyota',
        modelPattern: 'Corolla, Yaris, Auris',
        specificCauses: ['Arka O2 sensörü arızası', 'Katalitik konvertör yaşlanması'],
        specificSymptoms: ['Yakıt tüketiminde artış'],
        specificNotes: 'Toyota araçlarda katalitik konvertör genellikle uzun ömürlüdür, ancak 150.000 km sonrası görülebilir.',
        costMultiplier: 1.0,
        commonYears: '2010-2020',
      },
      {
        brand: 'Volkswagen',
        modelPattern: 'Golf, Passat, Polo',
        specificCauses: ['Turbo kaçağı', 'EGR valf kirliliği', 'Arka O2 sensörü'],
        specificSymptoms: ['Motor performans kaybı', 'Turbo ıslık sesi'],
        specificNotes: 'VW TSI motorlarda turbo sorunlarıyla birlikte görülebilir.',
        costMultiplier: 1.3,
        commonYears: '2012-2022',
      },
      {
        brand: 'Ford',
        modelPattern: 'Focus, Fiesta, Kuga',
        specificCauses: ['Katalitik konvertör iç yapısı bozulması', 'Ön O2 sensörü'],
        specificSymptoms: ['Egzoz sesi değişimi'],
        specificNotes: 'EcoBoost motorlarda erken aşınma görülebilir.',
        costMultiplier: 1.1,
        commonYears: '2013-2021',
      },
      {
        brand: 'BMW',
        modelPattern: '3 Serisi, 5 Serisi, X3',
        specificCauses: ['Çift katalitik konvertör sistemi', 'Oksijen sensörü kablo arızası'],
        specificSymptoms: ['Check engine sürekli yanık'],
        specificNotes: 'BMW araçlarda orijinal parça kullanımı önerilir, maliyet yüksek olabilir.',
        costMultiplier: 1.8,
        commonYears: '2008-2020',
      },
      {
        brand: 'Mercedes',
        modelPattern: 'C Serisi, E Serisi, GLC',
        specificCauses: ['SCR sistemi ile etkileşim', 'AdBlue kalitesi'],
        specificSymptoms: ['Dizel araçlarda AdBlue uyarısı'],
        specificNotes: 'Dizel Mercedes araçlarda AdBlue sistemiyle birlikte incelenmelidir.',
        costMultiplier: 2.0,
        commonYears: '2015-2023',
      },
    ];
  }

  // Varsayılan genel varyasyonlar
  return [
    {
      brand: 'Genel',
      specificNotes: 'Bu kod için henüz marka bazlı detaylı bilgi bulunmamaktadır.',
      costMultiplier: 1.0,
    },
  ];
};

export default function BrandVariationTabs({ obdCode, brandVariations }: BrandVariationTabsProps) {
  const variations = brandVariations && brandVariations.length > 0
    ? brandVariations
    : getDefaultVariations(obdCode);

  const [selectedBrand, setSelectedBrand] = useState(variations[0]?.brand || 'Genel');

  const selectedVariation = variations.find((v) => v.brand === selectedBrand) || variations[0];

  if (!selectedVariation || variations.length === 1 && variations[0].brand === 'Genel') {
    return null;
  }

  const formatCostMultiplier = (multiplier?: number) => {
    if (!multiplier || multiplier === 1.0) return 'Standart';
    if (multiplier > 1.5) return 'Yüksek';
    if (multiplier > 1.2) return 'Ortanın Üstü';
    if (multiplier < 0.9) return 'Düşük';
    return 'Normal';
  };

  const getCostMultiplierColor = (multiplier?: number) => {
    if (!multiplier || multiplier === 1.0) return 'text-green-600 bg-green-50';
    if (multiplier > 1.5) return 'text-red-600 bg-red-50';
    if (multiplier > 1.2) return 'text-amber-600 bg-amber-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
      <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
        <Car className="w-6 h-6 text-blue-500" />
        Marka Bazlı Bilgiler
      </h2>
      <p className="text-secondary-500 mb-6">
        {obdCode} kodu farklı markalarda farklı şekillerde ortaya çıkabilir:
      </p>

      {/* Brand Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-secondary-100">
        {variations.map((variation) => (
          <button
            key={variation.brand}
            onClick={() => setSelectedBrand(variation.brand)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              selectedBrand === variation.brand
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }`}
          >
            {variation.brand}
          </button>
        ))}
      </div>

      {/* Selected Variation Details */}
      {selectedVariation && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-secondary-800 text-lg">{selectedVariation.brand}</h3>
                {selectedVariation.modelPattern && (
                  <p className="text-sm text-secondary-500">{selectedVariation.modelPattern}</p>
                )}
              </div>
            </div>

            {/* Cost Indicator */}
            {selectedVariation.costMultiplier && (
              <div className={`px-3 py-1.5 rounded-lg ${getCostMultiplierColor(selectedVariation.costMultiplier)}`}>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Maliyet: {formatCostMultiplier(selectedVariation.costMultiplier)}
                    {selectedVariation.costMultiplier !== 1.0 && (
                      <span className="text-xs ml-1">
                        (x{selectedVariation.costMultiplier?.toFixed(1)})
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Common Years */}
          {selectedVariation.commonYears && (
            <div className="flex items-center gap-2 p-3 bg-secondary-50 rounded-lg">
              <Calendar className="w-4 h-4 text-secondary-500" />
              <span className="text-sm text-secondary-600">
                Sık görülen yıllar: <strong>{selectedVariation.commonYears}</strong>
              </span>
            </div>
          )}

          {/* Specific Causes */}
          {selectedVariation.specificCauses && selectedVariation.specificCauses.length > 0 && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {selectedVariation.brand} İçin Sık Görülen Nedenler
              </h4>
              <ul className="space-y-1">
                {selectedVariation.specificCauses.map((cause, index) => (
                  <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                    {cause}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specific Symptoms */}
          {selectedVariation.specificSymptoms && selectedVariation.specificSymptoms.length > 0 && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <h4 className="font-semibold text-amber-800 mb-2">
                {selectedVariation.brand} İçin Özel Belirtiler
              </h4>
              <ul className="space-y-1">
                {selectedVariation.specificSymptoms.map((symptom, index) => (
                  <li key={index} className="text-sm text-amber-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          {selectedVariation.specificNotes && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-start gap-3">
                <Wrench className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  <strong className="text-blue-800">Not:</strong> {selectedVariation.specificNotes}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
