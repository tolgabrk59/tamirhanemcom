'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TireSelectionPage() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

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
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: 'winter',
      title: 'Kış Lastikleri',
      temp: '+7°C altı',
      description: 'Kar, buz ve soğuk koşullarda maksimum güvenlik',
      pros: ['Kar ve buzda kavrama', 'Esnek karışım', 'M+S işareti', 'Güvenli'],
      cons: ['Yazın hızlı aşınır', 'Yüksek yuvarlanma direnci'],
      color: 'from-blue-500 to-cyan-500',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07M12 6l-1.5 1.5M12 6l1.5 1.5M6 12l1.5-1.5M6 12l1.5 1.5M12 18l-1.5-1.5M12 18l1.5-1.5M18 12l-1.5-1.5M18 12l-1.5 1.5" />
        </svg>
      ),
    },
    {
      id: 'all-season',
      title: '4 Mevsim Lastikleri',
      temp: 'Her koşul',
      description: 'Yıl boyu kullanım için pratik ve ekonomik çözüm',
      pros: ['Tüm mevsimlerde kullanım', 'Tasarruf sağlar', 'Pratik', 'Değiştirme gerektirmez'],
      cons: ['Uzman performansı yok', 'Aşırı koşullarda yetersiz'],
      color: 'from-green-500 to-emerald-500',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
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
              <span className="text-sm font-semibold">Uzman Lastik Rehberi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Lastik Seçimi Rehberi
            </h1>
            <p className="text-xl text-primary-100 mb-6">
              Aracınız için en uygun lastiği bulun. Marka karşılaştırması, fiyat bilgileri ve uzman tavsiyeleri.
            </p>
          </div>
        </div>
      </section>

      {/* Vehicle Selector */}
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
                <p className="text-sm text-gray-600">Doğru lastik boyutunu öğrenin</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marka</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  <option value="">Marka Seçin</option>
                  <option value="opel">Opel</option>
                  <option value="ford">Ford</option>
                  <option value="renault">Renault</option>
                  <option value="fiat">Fiat</option>
                  <option value="volkswagen">Volkswagen</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white disabled:bg-gray-100"
                  disabled={!selectedBrand}
                >
                  <option value="">Model Seçin</option>
                  <option value="astra">Astra</option>
                  <option value="focus">Focus</option>
                  <option value="megane">Megane</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yıl</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white disabled:bg-gray-100"
                  disabled={!selectedModel}
                >
                  <option value="">Yıl Seçin</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>
            </div>
            {selectedBrand && selectedModel && selectedYear && (
              <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 border-l-4 border-primary-500 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Önerilen Lastik Boyutu</p>
                    <p className="text-2xl font-bold text-primary-600">205/55 R16 91V</p>
                  </div>
                </div>
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
                  <div className="flex justify-center mb-4">{tire.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{tire.title}</h3>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-sm font-medium">{tire.temp}</span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">{tire.description}</p>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-900">Avantajlar</h4>
                    </div>
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
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-900">Dezavantajlar</h4>
                    </div>
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

      {/* Maintenance Tips */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lastik Bakım İpuçları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lastiklerinizin ömrünü uzatın ve güvenli sürüş yapın
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-gray-200">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Hava Basıncı</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ayda bir kez kontrol edin. Doğru basınç yakıt tasarrufu sağlar ve lastik ömrünü uzatır.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-gray-200">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Rotasyon</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Her 10.000 km'de bir lastik rotasyonu yapın. Düzenli aşınma sağlar.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-gray-200">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Diş Derinliği</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Minimum 1.6mm olmalı. Güvenlik için düzenli kontrol edin.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-gray-200">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Hasar Kontrolü</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Çatlak, kabarcık veya kesik olup olmadığını kontrol edin.
              </p>
            </div>
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
