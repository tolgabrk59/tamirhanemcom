'use client';

import { useState, useEffect } from 'react';
import { vehicleBrands, vehicleModels, vehicleYears } from '@/data/vehicles';
import { servicesData, estimateCost } from '@/data/services';
import type { CostEstimate } from '@/types';

interface CostEstimatorProps {
  initialBrand?: string;
  initialModel?: string;
  initialYear?: string;
  initialService?: string;
}

export default function CostEstimator({
  initialBrand = '',
  initialModel = '',
  initialYear = '',
  initialService = '',
}: CostEstimatorProps) {
  const [brand, setBrand] = useState(initialBrand);
  const [model, setModel] = useState(initialModel);
  const [year, setYear] = useState(initialYear);
  const [service, setService] = useState(initialService);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [estimate, setEstimate] = useState<CostEstimate | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (brand) {
      setAvailableModels(vehicleModels[brand] || []);
      if (!vehicleModels[brand]?.includes(model)) {
        setModel('');
      }
    } else {
      setAvailableModels([]);
    }
  }, [brand, model]);

  const handleCalculate = () => {
    if (!brand || !service) return;

    setIsCalculating(true);

    // Simulate API call
    setTimeout(() => {
      const result = estimateCost(brand, service);
      setEstimate(result);
      setIsCalculating(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Form Section */}
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-4">
          Tamir Maliyeti Hesapla
        </h2>

        {/* Warning Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-yellow-800 mb-1">Örnek Fiyatlar Gösterilmektedir</p>
              <p className="text-xs text-yellow-700 leading-relaxed">
                Hesaplanan fiyatlar örnek verilerdir. Canlı servis fiyat verilerimiz henüz mevcut değildir. Kesin fiyat için servislerden teklif almanızı öneririz.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Araç Markası *
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Marka Seçin</option>
              {vehicleBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!brand}
              className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-50"
            >
              <option value="">Model Seçin</option>
              {availableModels.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Model Yılı
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Yıl Seçin</option>
              {vehicleYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Service */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Servis Türü *
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Hizmet Seçin</option>
              {servicesData.map((s) => (
                <option key={s.id} value={s.slug}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!brand || !service || isCalculating}
          className="mt-6 w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:bg-secondary-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isCalculating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Hesaplanıyor...
            </>
          ) : (
            'Maliyet Hesapla'
          )}
        </button>
      </div>

      {/* Result Section */}
      {estimate && (
        <div className="bg-secondary-50 p-6 md:p-8 border-t border-secondary-200">
          {/* Sample Data Warning */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-bold text-orange-900 mb-1">⚠️ Bu Sonuçlar Örnek Verilerdir</p>
                <p className="text-xs text-orange-800 leading-relaxed">
                  Aşağıdaki fiyatlar tahmini ve örnek niteliktedir. Gerçek fiyatlar için lütfen servislerden doğrudan teklif alın.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Tahmini Maliyet: {estimate.service}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Labor Cost */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-secondary-500">İşçilik</span>
              </div>
              <p className="text-xl font-bold text-secondary-900">
                {estimate.laborCostMin.toLocaleString('tr-TR')} - {estimate.laborCostMax.toLocaleString('tr-TR')} TL
              </p>
            </div>

            {/* Parts Cost */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                <span className="text-sm text-secondary-500">Parça</span>
              </div>
              <p className="text-xl font-bold text-secondary-900">
                {estimate.partsCostMin.toLocaleString('tr-TR')} - {estimate.partsCostMax.toLocaleString('tr-TR')} TL
              </p>
            </div>

            {/* Total */}
            <div className="bg-primary-50 rounded-lg p-4 border-2 border-primary-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-primary-600 font-medium">Toplam</span>
              </div>
              <p className="text-2xl font-bold text-primary-700">
                {estimate.totalMin.toLocaleString('tr-TR')} - {estimate.totalMax.toLocaleString('tr-TR')} TL
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-secondary-600 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Tahmini süre: <strong>{estimate.duration}</strong></span>
          </div>

          {/* Note */}
          {estimate.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{estimate.notes}</p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
              Servislerden Teklif Al
            </button>
            <button className="flex-1 bg-white text-secondary-700 px-6 py-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors font-medium">
              Servisleri Karşılaştır
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
