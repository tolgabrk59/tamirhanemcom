'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllCities, calculateCityAdjustedCost, type CityCostData } from '@/data/city-cost-multipliers';
import type { ObdCode } from '@/types';

export default function CostEstimator() {
  const [obdCode, setObdCode] = useState('');
  const [selectedCity, setSelectedCity] = useState('istanbul');
  const [codeData, setCodeData] = useState<ObdCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cities = useMemo(() => getAllCities(), []);
  const selectedCityData = useMemo(() => cities.find(c => c.citySlug === selectedCity), [cities, selectedCity]);

  const fetchCode = async (code: string) => {
    if (!code.trim()) {
      setCodeData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/obd/search?q=${encodeURIComponent(code.toUpperCase())}&limit=1`);
      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        const foundCode = result.data.find((c: ObdCode) =>
          c.code.toUpperCase() === code.toUpperCase()
        ) || result.data[0];
        setCodeData(foundCode);
      } else {
        setCodeData(null);
        setError('Kod bulunamadı');
      }
    } catch {
      setCodeData(null);
      setError('Arama hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (value: string) => {
    setObdCode(value.toUpperCase());
    const timer = setTimeout(() => fetchCode(value), 500);
    return () => clearTimeout(timer);
  };

  const adjustedCost = useMemo(() => {
    if (!codeData?.estimatedCostMin || !codeData?.estimatedCostMax) return null;
    return calculateCityAdjustedCost(codeData.estimatedCostMin, codeData.estimatedCostMax, selectedCity);
  }, [codeData, selectedCity]);

  const popularCodes = ['P0420', 'P0171', 'P0300', 'P0442', 'P0401'];

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-800 mb-4">Maliyet Hesaplama</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* OBD Code Input */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Arıza Kodu
            </label>
            <div className="relative">
              <input
                type="text"
                value={obdCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="örn: P0420"
                className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all font-mono text-lg uppercase"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="animate-spin h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
            {error && (
              <p className="mt-2 text-sm text-error-600">{error}</p>
            )}
            {codeData && (
              <p className="mt-2 text-sm text-success-600 font-medium">{codeData.title}</p>
            )}
          </div>

          {/* City Select */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Şehir
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white"
            >
              {cities.map((city) => (
                <option key={city.citySlug} value={city.citySlug}>
                  {city.city} {city.multiplier !== 1.0 && `(${city.multiplier > 1 ? '+' : ''}${Math.round((city.multiplier - 1) * 100)}%)`}
                </option>
              ))}
            </select>
            {selectedCityData && (
              <p className="mt-2 text-sm text-secondary-500">
                Ortalama işçilik: {selectedCityData.laborCostPerHour.toLocaleString('tr-TR')} ₺/saat
              </p>
            )}
          </div>
        </div>

        {/* Quick Code Buttons */}
        <div className="mt-4">
          <p className="text-sm text-secondary-500 mb-2">Popüler Kodlar:</p>
          <div className="flex flex-wrap gap-2">
            {popularCodes.map((code) => (
              <button
                key={code}
                onClick={() => handleCodeChange(code)}
                className={`px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-colors ${
                  obdCode === code
                    ? 'bg-primary-500 text-secondary-900'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {codeData && adjustedCost && (
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-primary-500 text-secondary-900 rounded-lg font-mono font-bold">
                  {codeData.code}
                </span>
                <span className="text-secondary-600">·</span>
                <span className="text-secondary-600">{selectedCityData?.city}</span>
              </div>
              <h3 className="text-xl font-bold text-secondary-800">{codeData.title}</h3>
            </div>
            {codeData.severity && (
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                codeData.severity === 'high' || codeData.severity === 'critical' ? 'bg-error-100 text-error-700' :
                codeData.severity === 'medium' ? 'bg-warning-100 text-warning-700' :
                'bg-success-100 text-success-700'
              }`}>
                {codeData.severity === 'high' || codeData.severity === 'critical' ? 'Yüksek Öncelik' :
                 codeData.severity === 'medium' ? 'Orta Öncelik' : 'Düşük Öncelik'}
              </span>
            )}
          </div>

          {/* Cost Display */}
          <div className="bg-white rounded-xl p-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-secondary-500 mb-2">Tahmini Toplam Maliyet ({selectedCityData?.city})</p>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {adjustedCost.min.toLocaleString('tr-TR')} - {adjustedCost.max.toLocaleString('tr-TR')} ₺
              </div>
              {selectedCityData && selectedCityData.multiplier !== 1.0 && (
                <p className="text-sm text-secondary-500">
                  İstanbul referans: {codeData.estimatedCostMin?.toLocaleString('tr-TR')} - {codeData.estimatedCostMax?.toLocaleString('tr-TR')} ₺
                  <span className={selectedCityData.multiplier < 1 ? 'text-success-600' : 'text-error-600'}>
                    {' '}({selectedCityData.multiplier < 1 ? '' : '+'}{Math.round((selectedCityData.multiplier - 1) * 100)}%)
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium text-secondary-700">İşçilik Ücreti</span>
              </div>
              <p className="text-lg font-bold text-secondary-800">
                {Math.round(adjustedCost.min * 0.4).toLocaleString('tr-TR')} - {Math.round(adjustedCost.max * 0.4).toLocaleString('tr-TR')} ₺
              </p>
              <p className="text-xs text-secondary-500">Yaklaşık %40</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-sm font-medium text-secondary-700">Parça Maliyeti</span>
              </div>
              <p className="text-lg font-bold text-secondary-800">
                {Math.round(adjustedCost.min * 0.6).toLocaleString('tr-TR')} - {Math.round(adjustedCost.max * 0.6).toLocaleString('tr-TR')} ₺
              </p>
              <p className="text-xs text-secondary-500">Yaklaşık %60</p>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-white/50 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-info-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-secondary-600">
              <p className="font-medium text-secondary-800 mb-1">Önemli Bilgi</p>
              <p>
                Bu tahminler ortalama değerlere dayanmaktadır. Gerçek maliyet; aracın markası, modeli,
                parça kalitesi (OEM/muadil), servis tipine göre değişiklik gösterebilir.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/obd/${codeData.code.toLowerCase()}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-secondary-900 rounded-xl font-semibold transition-colors"
            >
              Kod Detaylarını Gör
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/randevu-al"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-secondary-800 hover:bg-secondary-900 text-white rounded-xl font-semibold transition-colors"
            >
              Servis Randevusu Al
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!codeData && !loading && !error && (
        <div className="text-center py-16 bg-white rounded-2xl border border-secondary-100">
          <svg className="w-20 h-20 text-secondary-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-secondary-800 mb-2">Maliyet Hesapla</h3>
          <p className="text-secondary-600 max-w-md mx-auto">
            Bir OBD kodu ve şehir seçin, tahmini tamir maliyetini görün.
          </p>
        </div>
      )}

      {/* City Comparison Table */}
      {codeData && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-secondary-100">
          <div className="p-6 border-b border-secondary-100">
            <h3 className="text-lg font-semibold text-secondary-800">Şehir Karşılaştırması - {codeData.code}</h3>
            <p className="text-sm text-secondary-500">Aynı arızanın farklı şehirlerdeki tahmini maliyeti</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-700">Şehir</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-700">Maliyet Aralığı</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-secondary-700">Fark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {['istanbul', 'ankara', 'izmir', 'bursa', 'antalya', 'konya', 'gaziantep', 'adana'].map((citySlug) => {
                  const city = cities.find(c => c.citySlug === citySlug);
                  if (!city || !codeData.estimatedCostMin || !codeData.estimatedCostMax) return null;
                  const cost = calculateCityAdjustedCost(codeData.estimatedCostMin, codeData.estimatedCostMax, citySlug);
                  const diffPercent = Math.round((city.multiplier - 1) * 100);

                  return (
                    <tr key={citySlug} className={selectedCity === citySlug ? 'bg-primary-50' : ''}>
                      <td className="px-6 py-4 text-sm">
                        <span className={`font-medium ${selectedCity === citySlug ? 'text-primary-700' : 'text-secondary-800'}`}>
                          {city.city}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono font-medium text-secondary-800">
                        {cost.min.toLocaleString('tr-TR')} - {cost.max.toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {diffPercent === 0 ? (
                          <span className="text-secondary-500">Referans</span>
                        ) : (
                          <span className={diffPercent < 0 ? 'text-success-600' : 'text-error-600'}>
                            {diffPercent > 0 ? '+' : ''}{diffPercent}%
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
