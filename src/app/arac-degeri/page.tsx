'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getArabamBrands,
  getArabamModels,
  getBrandSlug,
} from '@/data/arabam-brands';
import {
  getModelEngines,
  getEnginePackages,
  hasPackageData,
} from '@/data/arabam-packages';

interface PriceData {
  count: number;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  medianPrice: number;
  priceRange: {
    low: number;
    high: number;
  };
  source: string;
  fetchedAt: string;
  searchUrl: string;
}

interface ApiResponse {
  success: boolean;
  data?: PriceData;
  error?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AracDegeriPage() {
  const [brand, setBrand] = useState('');
  const [modelSlug, setModelSlug] = useState('');
  const [engineSlug, setEngineSlug] = useState('');
  const [packageSlug, setPackageSlug] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear() - 3);
  const [mileage, setMileage] = useState<number>(50000);

  const [result, setResult] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const brands = getArabamBrands();
  const models = brand ? getArabamModels(brand) : [];
  const brandSlug = brand ? getBrandSlug(brand) : null;
  const selectedModel = models.find(m => m.slug === modelSlug);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i);

  // Motor ve paket verileri
  const modelName = selectedModel?.name || '';
  const hasPackages = brand && modelName && hasPackageData(brand, modelName);
  const engines = hasPackages ? getModelEngines(brand, modelName) : [];
  const packages = hasPackages && engineSlug ? getEnginePackages(brand, modelName, engineSlug) : [];
  const selectedEngine = engines.find(e => e.slug === engineSlug);

  // Marka degisince model, motor, paket sifirla
  useEffect(() => {
    setModelSlug('');
    setEngineSlug('');
    setPackageSlug('');
  }, [brand]);

  // Model degisince motor, paket sifirla
  useEffect(() => {
    setEngineSlug('');
    setPackageSlug('');
  }, [modelSlug]);

  // Motor degisince paket sifirla
  useEffect(() => {
    setPackageSlug('');
  }, [engineSlug]);

  const handleCalculate = async () => {
    if (!brandSlug || !modelSlug) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let url = `/api/arac-degeri?brandSlug=${encodeURIComponent(brandSlug)}&modelSlug=${encodeURIComponent(modelSlug)}&year=${year}`;

      if (engineSlug) {
        url += `&engine=${encodeURIComponent(engineSlug)}`;
      }
      if (packageSlug) {
        url += `&package=${encodeURIComponent(packageSlug)}`;
      }

      const response = await fetch(url);
      const data: ApiResponse = await response.json();

      if (data.success && data.data) {
        const kmFactor = getKmFactor(mileage, year);
        const adjustedData = {
          ...data.data,
          avgPrice: Math.round(data.data.avgPrice * kmFactor),
          medianPrice: Math.round(data.data.medianPrice * kmFactor),
          priceRange: {
            low: Math.round(data.data.priceRange.low * kmFactor),
            high: Math.round(data.data.priceRange.high * kmFactor),
          },
        };
        setResult(adjustedData);
      } else {
        setError(data.error || 'Fiyat bilgisi alınamadı');
      }
    } catch {
      setError('Bağlantı hatası oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  function getKmFactor(km: number, carYear: number): number {
    const expectedKm = (currentYear - carYear) * 15000;
    const kmRatio = km / expectedKm;

    if (kmRatio < 0.5) return 1.05;
    if (kmRatio < 0.8) return 1.02;
    if (kmRatio < 1.2) return 1.0;
    if (kmRatio < 1.5) return 0.97;
    if (kmRatio < 2.0) return 0.93;
    return 0.88;
  }

  return (
    <div className="bg-secondary-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80')`
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/95" />
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-400/30 rounded-full px-4 py-2 mb-4">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-primary-300 font-semibold text-sm">Güncel Piyasa Verisi</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Aracınız <span className="text-primary-400">Ne Kadar?</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Güncel ilan verilerine dayalı gerçek piyasa değerini öğrenin.
              İkinci el araç fiyatlarını karşılaştırın.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-3xl mx-auto shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2 text-lg">Nasıl Hesaplanıyor?</h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  arabam.com&apos;daki güncel ilanlar analiz edilerek, benzer araçların ortalama fiyatı hesaplanmaktadır.
                  Aşırı yüksek ve düşük fiyatlar filtrelenerek gerçekçi bir değer aralığı sunulmaktadır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-gradient-to-b from-secondary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-secondary-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: '#454545' }}>
                    Araç Bilgilerini Girin
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Marka */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">
                      Marka <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-secondary-800 bg-white"
                    >
                      <option value="">Marka Seçin</option>
                      {brands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={modelSlug}
                      onChange={(e) => setModelSlug(e.target.value)}
                      disabled={!brand}
                      className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-secondary-800 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Model Seçin</option>
                      {models.map((m) => (
                        <option key={m.slug} value={m.slug}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Motor - sadece veri varsa goster */}
                  {engines.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">
                        Motor <span className="text-secondary-500 font-normal text-xs">(Opsiyonel)</span>
                      </label>
                      <select
                        value={engineSlug}
                        onChange={(e) => setEngineSlug(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-secondary-800"
                      >
                        <option value="">Tüm Motorlar</option>
                        {engines.map((e) => (
                          <option key={e.slug} value={e.slug}>{e.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Paket - sadece veri varsa goster */}
                  {packages.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">
                        Paket <span className="text-secondary-500 font-normal text-xs">(Opsiyonel)</span>
                      </label>
                      <select
                        value={packageSlug}
                        onChange={(e) => setPackageSlug(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-secondary-800"
                      >
                        <option value="">Tüm Paketler</option>
                        {packages.map((p) => (
                          <option key={p.slug} value={p.slug}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Yil */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">
                      Model Yılı <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-secondary-800"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  {/* Kilometre */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">
                      Kilometre
                    </label>
                    <input
                      type="number"
                      value={mileage}
                      onChange={(e) => setMileage(Number(e.target.value))}
                      min={0}
                      max={500000}
                      step={5000}
                      className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-secondary-800"
                      placeholder="Örnek: 75000"
                    />
                  </div>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={handleCalculate}
                  disabled={!brand || !modelSlug || isLoading}
                  className="w-full mt-6 bg-gradient-to-r from-primary-500 to-primary-600 text-gray-900 py-4 px-6 rounded-xl font-bold text-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Piyasa Verileri Alınıyor...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Değeri Hesapla
                    </>
                  )}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-red-700 font-medium">{error}</p>
                        <p className="text-red-600 text-sm mt-1">
                          Farklı motor/paket seçeneği deneyin veya boş bırakın.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Result Section */}
                {result && (
                  <div className="mt-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: '#454545' }}>
                        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Piyasa Değeri
                      </h3>
                      <span className="px-4 py-2 rounded-full text-sm font-semibold bg-primary-100 text-primary-800 border border-primary-200 w-fit">
                        {result.count} ilan analiz edildi
                      </span>
                    </div>

                    {/* Main Value */}
                    <div className="bg-gradient-to-br from-primary-50 via-primary-100 to-primary-50 rounded-2xl p-6 md:p-8 mb-6 border-2 border-primary-200">
                      <div className="text-center">
                        <p className="text-primary-700 font-semibold mb-2">Tahmini Piyasa Değeri</p>
                        <p className="text-4xl md:text-5xl font-bold text-primary-700 mb-3">
                          {formatCurrency(result.avgPrice)}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-primary-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          <span className="text-lg font-medium">
                            {formatCurrency(result.priceRange.low)} - {formatCurrency(result.priceRange.high)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
                        <p className="text-xs text-green-600 font-medium mb-1">En Düşük</p>
                        <p className="text-base font-bold text-green-700">{formatCurrency(result.minPrice)}</p>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center border border-red-200">
                        <p className="text-xs text-red-600 font-medium mb-1">En Yüksek</p>
                        <p className="text-base font-bold text-red-700">{formatCurrency(result.maxPrice)}</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
                        <p className="text-xs text-blue-600 font-medium mb-1">Medyan</p>
                        <p className="text-base font-bold text-blue-700">{formatCurrency(result.medianPrice)}</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200">
                        <p className="text-xs text-purple-600 font-medium mb-1">İlan Sayısı</p>
                        <p className="text-base font-bold text-purple-700">{result.count}</p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm text-secondary-700">
                            <strong>{brand} {selectedModel?.name || modelSlug}</strong>
                            {selectedEngine && ` ${selectedEngine.name}`}
                            {packageSlug && packages.find(p => p.slug === packageSlug) && ` ${packages.find(p => p.slug === packageSlug)?.name}`}
                            {` (${year-1}-${year+1})`} modellerinin güncel ilan fiyatlarından hesaplandı.
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-xs text-secondary-500">
                              Kaynak: {result.source}
                            </span>
                            <span className="text-secondary-300">|</span>
                            <a
                              href={result.searchUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                            >
                              İlanları Gör
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* CTA Card */}
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-gray-900 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-bold text-xl mb-2">Profesyonel Ekspertiz</h4>
                <p className="text-gray-800 text-sm mb-5 leading-relaxed">
                  Aracınızın gerçek değerini öğrenmek için profesyonel ekspertiz hizmeti alın.
                </p>
                <Link
                  href="/servisler"
                  className="block w-full bg-white text-primary-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all font-bold text-center shadow-lg"
                >
                  Ekspertiz Bul
                </Link>
              </div>

              {/* Tips Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-secondary-100">
                <h3 className="font-bold text-lg mb-4" style={{ color: '#454545' }}>
                  Fiyatı Etkileyen Faktörler
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-secondary-800 text-sm">Kilometre</p>
                      <p className="text-xs text-secondary-500">Düşük km daha yüksek değer</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-secondary-800 text-sm">Bakım Geçmişi</p>
                      <p className="text-xs text-secondary-500">Düzenli bakım değeri artırır</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-secondary-800 text-sm">Renk & Donanım</p>
                      <p className="text-xs text-secondary-500">Popüler renkler tercih edilir</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-secondary-800 text-sm">Kaza Geçmişi</p>
                      <p className="text-xs text-secondary-500">Hasarsız araçlar daha değerli</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* External Link */}
              <a
                href="https://www.arabam.com/arabam-kac-para"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-2xl p-6 shadow-lg border border-secondary-100 hover:border-primary-200 hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-secondary-800">arabam.com</p>
                    <p className="text-sm text-secondary-500">Resmi değerleme aracı</p>
                  </div>
                  <svg className="w-5 h-5 text-secondary-500 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Aracınızı Satmak mı İstiyorsunuz?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Güvenilir servislerden ücretsiz ekspertiz teklifi alın ve aracınızı en iyi fiyata satın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/servisler"
              className="bg-primary-500 text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-primary-400 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Servis Bul
            </Link>
            <Link
              href="/randevu-al"
              className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20"
            >
              Randevu Al
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
