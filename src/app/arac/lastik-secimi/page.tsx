'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TireData {
  standard_size: string;
  alternative_sizes: string[];
  recommended_pressure: {
    front: string;
    rear: string;
  };
  recommended_brands: {
    name: string;
    model: string;
    price_range: string;
    rating: number;
    features: string[];
  }[];
  seasonal_recommendations: {
    summer: string;
    winter: string;
    all_season: string;
  };
  maintenance_tips: string[];
}

export default function TireSelectionPage() {
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [packages, setPackages] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [tireData, setTireData] = useState<TireData | null>(null);
  const [error, setError] = useState('');

  // Fetch brands on mount
  useEffect(() => {
    fetch('/api/brands?vehicleType=otomobil')
      .then(res => res.json())
      .then(data => setBrands(data.brands || []))
      .catch(err => console.error('Error fetching brands:', err));
  }, []);

  // Fetch models when brand changes
  useEffect(() => {
    if (selectedBrand) {
      setModels([]);
      setPackages([]);
      setSelectedModel('');
      setSelectedPackage('');
      setSelectedYear('');
      setTireData(null);
      
      fetch(`/api/models?brand=${encodeURIComponent(selectedBrand)}&vehicleType=otomobil`)
        .then(res => res.json())
        .then(data => setModels(data.models || []))
        .catch(err => console.error('Error fetching models:', err));
    }
  }, [selectedBrand]);

  // Fetch packages when model changes
  useEffect(() => {
    if (selectedBrand && selectedModel) {
      setPackages([]);
      setSelectedPackage('');
      setSelectedYear('');
      setTireData(null);
      
      fetch(`/api/packages?brand=${encodeURIComponent(selectedBrand)}&model=${encodeURIComponent(selectedModel)}`)
        .then(res => res.json())
        .then(data => setPackages(data.packages || []))
        .catch(err => console.error('Error fetching packages:', err));
    }
  }, [selectedBrand, selectedModel]);

  // Set years when package is selected
  useEffect(() => {
    if (selectedPackage) {
      setSelectedYear('');
      setTireData(null);
      const currentYear = new Date().getFullYear();
      const yearList = [];
      for (let y = currentYear; y >= 2000; y--) {
        yearList.push(y.toString());
      }
      setYears(yearList);
    }
  }, [selectedPackage]);

  // Search for tire info with AI
  const searchTireInfo = async () => {
    if (!selectedBrand || !selectedModel || !selectedYear) return;
    
    setLoading(true);
    setError('');
    setTireData(null);
    
    try {
      const response = await fetch('/api/ai/tire-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: selectedBrand,
          model: selectedModel,
          package: selectedPackage,
          year: selectedYear,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Veri alınamadı');
      }
      
      const data = await response.json();
      setTireData(data);
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const tireBrands = [
    { name: 'Michelin', rating: 4.8, price: '₺₺₺', features: ['Uzun ömür', 'Sessiz sürüş', 'Premium kalite'] },
    { name: 'Continental', rating: 4.7, price: '₺₺₺', features: ['Yüksek performans', 'Güvenlik', 'Teknoloji'] },
    { name: 'Goodyear', rating: 4.6, price: '₺₺₺', features: ['Dayanıklılık', 'Konfor', 'Güvenilir'] },
    { name: 'Pirelli', rating: 4.7, price: '₺₺₺', features: ['Spor performans', 'Tutuş', 'İtalyan'] },
    { name: 'Bridgestone', rating: 4.6, price: '₺₺₺', features: ['Japon kalitesi', 'Uzun ömür', 'Güvenlik'] },
    { name: 'Lassa', rating: 4.3, price: '₺₺', features: ['Uygun fiyat', 'Yerli üretim', 'Güvenilir'] },
    { name: 'Petlas', rating: 4.2, price: '₺₺', features: ['Ekonomik', 'Türk markası', 'Dayanıklı'] },
    { name: 'Hankook', rating: 4.4, price: '₺₺', features: ['Fiyat/performans', 'Kaliteli', 'Kore'] },
  ];

  const tireTypes = [
    {
      id: 'summer',
      title: 'Yaz Lastikleri',
      temp: '+7°C üzeri',
      description: 'Sıcak havalarda optimum performans ve yakıt tasarrufu',
      pros: ['Düşük yuvarlanma direnci', 'Yüksek kavrama', 'Uzun ömür', 'Sessiz sürüş'],
      cons: ['Soğukta sertleşir', 'Karda tehlikeli'],
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'winter',
      title: 'Kış Lastikleri',
      temp: '+7°C altı',
      description: 'Kar, buz ve soğuk koşullarda maksimum güvenlik',
      pros: ['Kar ve buzda kavrama', 'Esnek karışım', 'M+S işareti', 'Güvenli'],
      cons: ['Yazın hızlı aşınır', 'Yüksek yuvarlanma direnci'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'all-season',
      title: '4 Mevsim Lastikleri',
      temp: 'Her koşul',
      description: 'Yıl boyu kullanım için pratik ve ekonomik çözüm',
      pros: ['Tüm mevsimlerde kullanım', 'Tasarruf sağlar', 'Pratik', 'Değiştirme gerektirmez'],
      cons: ['Uzman performansı yok', 'Aşırı koşullarda yetersiz'],
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: 'url(/hero_service_background.png)',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 11a1 1 0 112 0 1 1 0 01-2 0zm2-5a1 1 0 00-1 1v2a1 1 0 102 0V7a1 1 0 00-1-1z" />
              </svg>
              <span className="text-sm font-semibold">AI Destekli Lastik Rehberi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Lastik Seçimi Rehberi
            </h1>
            <p className="text-xl text-primary-100 mb-6">
              Aracınız için en uygun lastiği yapay zeka ile bulun. Marka, model ve yıla göre öneriler alın.
            </p>
          </div>
        </div>
      </section>

      {/* Vehicle Selector with AI */}
      <section className="py-8 bg-white border-b border-gray-200 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Aracınızı Seçin</h2>
                <p className="text-sm text-gray-600">AI ile lastik önerisi alın</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marka</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  <option value="">Marka Seçin</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white disabled:bg-gray-100"
                  disabled={!selectedBrand || models.length === 0}
                >
                  <option value="">Model Seçin</option>
                  {models.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paket</label>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white disabled:bg-gray-100"
                  disabled={!selectedModel || packages.length === 0}
                >
                  <option value="">Paket Seçin</option>
                  {packages.map((pkg) => (
                    <option key={pkg} value={pkg}>{pkg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yıl</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white disabled:bg-gray-100"
                  disabled={!selectedPackage}
                >
                  <option value="">Yıl Seçin</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {selectedBrand && selectedModel && selectedYear && (
              <div className="mt-6">
                <button
                  onClick={searchTireInfo}
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Araştırılıyor...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>AI ile Lastik Önerisi Al</span>
                    </>
                  )}
                </button>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {/* AI Results */}
            {tireData && (
              <div className="mt-6 space-y-6">
                {/* Standard Size */}
                <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-l-4 border-primary-500 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Önerilen Lastik Boyutu</p>
                      <p className="text-3xl font-bold text-primary-600">{tireData.standard_size}</p>
                      {tireData.alternative_sizes && tireData.alternative_sizes.length > 0 && (
                        <p className="text-sm text-gray-600 mt-2">
                          Alternatif: {tireData.alternative_sizes.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Pressure */}
                {tireData.recommended_pressure && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-800">Ön Lastik Basıncı</p>
                      <p className="text-2xl font-bold text-blue-600">{tireData.recommended_pressure.front}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-800">Arka Lastik Basıncı</p>
                      <p className="text-2xl font-bold text-blue-600">{tireData.recommended_pressure.rear}</p>
                    </div>
                  </div>
                )}
                
                {/* Recommended Brands */}
                {tireData.recommended_brands && tireData.recommended_brands.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">AI Tarafından Önerilen Lastikler</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {tireData.recommended_brands.map((brand, idx) => (
                        <div key={idx} className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-gray-900">{brand.name}</h4>
                            <span className="text-primary-600 font-semibold">{brand.price_range}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{brand.model}</p>
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(brand.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-sm text-gray-600 ml-1">{brand.rating}</span>
                          </div>
                          <ul className="space-y-1">
                            {brand.features?.map((feature, fidx) => (
                              <li key={fidx} className="text-xs text-gray-600 flex items-center gap-1">
                                <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Seasonal Recommendations */}
                {tireData.seasonal_recommendations && (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-bold text-yellow-800 mb-2">🌞 Yaz İçin</h4>
                      <p className="text-sm text-yellow-700">{tireData.seasonal_recommendations.summer}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-bold text-blue-800 mb-2">❄️ Kış İçin</h4>
                      <p className="text-sm text-blue-700">{tireData.seasonal_recommendations.winter}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-bold text-green-800 mb-2">🌍 4 Mevsim</h4>
                      <p className="text-sm text-green-700">{tireData.seasonal_recommendations.all_season}</p>
                    </div>
                  </div>
                )}
                
                {/* Maintenance Tips */}
                {tireData.maintenance_tips && tireData.maintenance_tips.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3">💡 Bakım Tavsiyeleri</h4>
                    <ul className="space-y-2">
                      {tireData.maintenance_tips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tire Types Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lastik Tiplerini Karşılaştırın
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              İhtiyacınıza en uygun lastik tipini seçmek için detaylı karşılaştırma
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {tireTypes.map((tire) => (
              <div key={tire.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className={`bg-gradient-to-r ${tire.color} p-8 text-white text-center`}>
                  <h3 className="text-2xl font-bold mb-2">{tire.title}</h3>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-medium">{tire.temp}</span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">{tire.description}</p>

                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">✓</span>
                      Avantajlar
                    </h4>
                    <ul className="space-y-2">
                      {tire.pros.map((pro, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">✗</span>
                      Dezavantajlar
                    </h4>
                    <ul className="space-y-2">
                      {tire.cons.map((con, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popüler Lastik Markaları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Güvenilir markalar arasından seçim yapın
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tireBrands.map((brand) => (
              <div key={brand.name} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{brand.name}</h3>
                  <span className="text-2xl font-bold text-primary-600">{brand.price}</span>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(brand.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm font-semibold text-gray-700 ml-2">{brand.rating}</span>
                </div>

                <ul className="space-y-2">
                  {brand.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Lastik Değişimi İçin Teklif Alın
          </h3>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Yakınınızdaki servisleri bulun ve lastik fiyatlarını karşılaştırın.
          </p>
          <Link
            href="/fiyat-hesapla?service=Lastik%20Değişimi"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Ücretsiz Fiyat Teklifi Al
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
