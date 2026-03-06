'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { vehicleObdHistory, getAllBrands, getModelsByBrand, type VehicleObdHistory } from '@/data/vehicle-obd-history';

const frequencyConfig = {
  'çok yaygın': { color: 'bg-error-100 text-error-700 border-error-200', icon: '●●●' },
  'yaygın': { color: 'bg-warning-100 text-warning-700 border-warning-200', icon: '●●' },
  'orta': { color: 'bg-info-100 text-info-700 border-info-200', icon: '●' }
};

export default function VehicleCodeHistory() {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');

  const brands = useMemo(() => getAllBrands(), []);
  const models = useMemo(() => selectedBrand ? getModelsByBrand(selectedBrand) : [], [selectedBrand]);

  const filteredVehicles = useMemo(() => {
    let results = vehicleObdHistory;

    if (selectedBrand) {
      results = results.filter(v => v.brand === selectedBrand);
    }

    if (selectedModel) {
      results = results.filter(v => v.model === selectedModel);
    }

    return results;
  }, [selectedBrand, selectedModel]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel('');
  };

  return (
    <div className="space-y-8">
      {/* Filter Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-800 mb-4">Aracınızı Seçin</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Brand Select */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Marka</label>
            <select
              value={selectedBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white"
            >
              <option value="">Tüm Markalar</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Model Select */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
              className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white disabled:bg-secondary-50 disabled:text-secondary-400"
            >
              <option value="">Tüm Modeller</option>
              {models.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Brand Buttons */}
        <div className="mt-4">
          <p className="text-sm text-secondary-500 mb-2">Popüler Markalar:</p>
          <div className="flex flex-wrap gap-2">
            {['Fiat', 'Volkswagen', 'Renault', 'Ford', 'Toyota', 'Hyundai', 'BMW'].map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandChange(brand)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedBrand === brand
                    ? 'bg-primary-500 text-secondary-900'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-secondary-600">
          <span className="font-semibold text-secondary-800">{filteredVehicles.length}</span> araç bulundu
        </p>
        {(selectedBrand || selectedModel) && (
          <button
            onClick={() => { setSelectedBrand(''); setSelectedModel(''); }}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Filtreleri Temizle
          </button>
        )}
      </div>

      {/* Vehicle Cards */}
      <div className="grid gap-6">
        {filteredVehicles.map((vehicle, index) => (
          <VehicleCard key={`${vehicle.brand}-${vehicle.model}-${index}`} vehicle={vehicle} />
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl">
          <svg className="w-16 h-16 text-secondary-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">Araç Bulunamadı</h3>
          <p className="text-secondary-600">Lütfen farklı bir marka veya model seçin</p>
        </div>
      )}
    </div>
  );
}

function VehicleCard({ vehicle }: { vehicle: VehicleObdHistory }) {
  return (
    <div className="bg-white rounded-xl border border-secondary-100 hover:border-primary-300 hover:shadow-lg transition-all overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-secondary-800">
                {vehicle.brand} {vehicle.model}
              </h3>
              {vehicle.yearRange && (
                <span className="px-2 py-0.5 bg-secondary-100 text-secondary-600 rounded text-sm">
                  {vehicle.yearRange}
                </span>
              )}
            </div>
            {vehicle.brandNotes && (
              <p className="text-sm text-secondary-500 italic">{vehicle.brandNotes}</p>
            )}
          </div>
          <div className="flex items-center gap-2 bg-primary-50 px-3 py-1.5 rounded-lg">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-primary-700">{vehicle.commonCodes.length} Sık Görülen Kod</span>
          </div>
        </div>

        {/* Common Codes Table */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-secondary-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            En Sık Görülen Arıza Kodları
          </h4>

          <div className="space-y-3">
            {vehicle.commonCodes.map((code, index) => {
              const freq = frequencyConfig[code.frequency];
              return (
                <div key={code.code} className="flex items-start gap-4 p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center text-sm font-bold text-secondary-600">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/obd/${code.code.toLowerCase()}`}
                        className="font-mono font-bold text-primary-600 hover:text-primary-700"
                      >
                        {code.code}
                      </Link>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${freq.color}`}>
                        {freq.icon} {code.frequency}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-700">{code.title}</p>
                    {code.notes && (
                      <p className="text-xs text-secondary-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {code.notes}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/obd/${code.code.toLowerCase()}`}
                    className="flex-shrink-0 px-3 py-1.5 bg-white border border-secondary-200 rounded-lg text-sm text-secondary-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors"
                  >
                    Detay
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
