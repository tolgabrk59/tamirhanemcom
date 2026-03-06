'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const carReviews = [
  {
    id: '1',
    brand: 'Fiat',
    model: 'Egea',
    year: 2024,
    rating: 4.5,
    reviewCount: 1247,
    image: '/cars/fiat-egea.jpg',
    summary: 'Türkiye\'nin en çok satan sedanı. Geniş iç hacim, ekonomik motor seçenekleri ve uygun fiyatıyla öne çıkıyor.',
    pros: ['Geniş bagaj hacmi (510 litre)', 'Ekonomik yakıt tüketimi', 'Uygun fiyat', 'Konforlu sürüş', 'Geniş iç mekan'],
    cons: ['Plastik iç mekan kalitesi', 'Zayıf ses yalıtımı', 'Temel donanım seviyesi', 'Orta seviye güvenlik'],
    categories: { performance: 3.5, comfort: 4, fuel: 4.5, reliability: 4, value: 5 },
    price: '850.000 - 1.200.000 TL',
    specs: {
      engine: '1.3 MultiJet / 1.6 MultiJet',
      power: '95 HP / 120 HP',
      transmission: '6 İleri Manuel / DCT',
      fuelType: 'Dizel',
      consumption: '4.2 - 4.8 L/100km',
      acceleration: '11.2 - 9.8 sn',
      topSpeed: '180 - 195 km/h',
      dimensions: '4.5m x 1.8m x 1.5m',
      weight: '1.250 kg',
      trunk: '510 litre'
    },
    detailedReview: 'Fiat Egea, Türkiye otomobil pazarının en çok satan sedanı konumunda. Tofaş tarafından üretilen bu model, geniş iç hacmi ve ekonomik motor seçenekleriyle ailelerin gözdesi. 1.3 ve 1.6 litre dizel motor seçenekleri oldukça verimli çalışıyor. Özellikle şehir içi kullanımda yakıt tüketimi oldukça düşük. Bagaj hacmi 510 litre ile segmentinin en genişleri arasında. İç mekan kalitesi orta seviyede olsa da, kullanım kolaylığı ve pratiklik ön planda. Sürüş konforu iyi seviyede, süspansiyon ayarları Türkiye yollarına uygun şekilde yapılmış.',
    userReviews: [
      { name: 'Mehmet K.', rating: 5, comment: 'Ailem için aldım, çok memnunuz. Yakıt tüketimi gerçekten çok iyi.', date: '2024-01-15' },
      { name: 'Ayşe D.', rating: 4, comment: 'Geniş ve konforlu ama iç mekan kalitesi biraz daha iyi olabilirdi.', date: '2024-01-10' },
      { name: 'Can Y.', rating: 5, comment: 'Fiyat/performans açısından harika bir araç. Tavsiye ederim.', date: '2024-01-05' }
    ]
  },
  // Diğer arabalar için benzer detaylı veri yapısı...
];

export default function CarReviewDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  const car = carReviews.find(c => c.id === params.id);

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">İnceleme Bulunamadı</h1>
          <Link href="/incelemeler" className="text-primary-600 hover:underline">
            İncelemelere Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/incelemeler" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              İncelemelere Dön
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full mb-4">
                <span className="text-sm font-semibold">{car.year} Model</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {car.brand} {car.model}
              </h1>
              <p className="text-xl text-gray-300 mb-6">{car.summary}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-6 h-6 ${i < Math.floor(car.rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-2xl font-bold">{car.rating}</span>
                </div>
                <span className="text-gray-400">({car.reviewCount} kullanıcı yorumu)</span>
              </div>

              <div className="inline-flex items-center gap-2 bg-primary-600 px-6 py-3 rounded-xl font-bold text-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {car.price}
              </div>
            </div>

            <div className="relative h-80 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-48 h-48 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Genel Bakış
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeTab === 'specs'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Teknik Özellikler
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Kullanıcı Yorumları
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Rating Categories */}
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Değerlendirme</h2>
                    <div className="space-y-4">
                      {Object.entries(car.categories).map(([key, value]) => {
                        const labels: Record<string, string> = {
                          performance: 'Performans',
                          comfort: 'Konfor',
                          fuel: 'Yakıt Ekonomisi',
                          reliability: 'Güvenilirlik',
                          value: 'Fiyat/Performans'
                        };
                        return (
                          <div key={key}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-gray-900">{labels[key]}</span>
                              <span className="text-primary-600 font-bold">{value}/5</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all"
                                style={{ width: `${(value / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detailed Review */}
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Detaylı İnceleme</h2>
                    <p className="text-gray-700 leading-relaxed text-lg">{car.detailedReview}</p>
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Artıları</h3>
                      </div>
                      <ul className="space-y-3">
                        {car.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Eksileri</h3>
                      </div>
                      <ul className="space-y-3">
                        {car.cons.map((con, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Teknik Özellikler</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(car.specs).map(([key, value]) => {
                      const labels: Record<string, string> = {
                        engine: 'Motor',
                        power: 'Güç',
                        transmission: 'Şanzıman',
                        fuelType: 'Yakıt Tipi',
                        consumption: 'Yakıt Tüketimi',
                        acceleration: '0-100 km/h',
                        topSpeed: 'Maksimum Hız',
                        dimensions: 'Boyutlar',
                        weight: 'Ağırlık',
                        trunk: 'Bagaj Hacmi'
                      };
                      return (
                        <div key={key} className="border-b border-gray-200 pb-4">
                          <div className="text-sm text-gray-500 mb-1">{labels[key]}</div>
                          <div className="text-lg font-semibold text-gray-900">{value}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {car.userReviews?.map((review, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{review.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Servis Bul</h3>
                <p className="text-gray-600 mb-6">
                  {car.brand} {car.model} için yakınınızdaki servisleri bulun ve fiyat teklifi alın.
                </p>
                <Link
                  href="/servisler"
                  className="block w-full text-center bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors font-bold"
                >
                  Servis Ara
                </Link>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 border border-primary-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Fiyat Teklifi Al</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Bakım ve onarım için ücretsiz fiyat teklifi alın.
                </p>
                <Link
                  href="/fiyat-hesapla"
                  className="block w-full text-center bg-white text-primary-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors font-bold border-2 border-primary-600"
                >
                  Teklif Al
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
