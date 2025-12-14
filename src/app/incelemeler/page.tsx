'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CarReview {
  id: string;
  brand: string;
  model: string;
  year: number;
  rating: number;
  reviewCount: number;
  image: string;
  summary: string;
  pros: string[];
  cons: string[];
  categories: {
    performance: number;
    comfort: number;
    fuel: number;
    reliability: number;
    value: number;
  };
  price: string;
}

export default function CarReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const carReviews: CarReview[] = [
    {
      id: '1',
      brand: 'Fiat',
      model: 'Egea',
      year: 2024,
      rating: 4.5,
      reviewCount: 1247,
      image: '/cars/fiat-egea.jpg',
      summary: 'Türkiye\'nin en çok satan sedanı. Geniş iç hacim, ekonomik motor seçenekleri ve uygun fiyatıyla öne çıkıyor.',
      pros: ['Geniş bagaj hacmi', 'Ekonomik yakıt tüketimi', 'Uygun fiyat', 'Konforlu sürüş'],
      cons: ['Plastik iç mekan kalitesi', 'Zayıf ses yalıtımı', 'Temel donanım seviyesi'],
      categories: { performance: 3.5, comfort: 4, fuel: 4.5, reliability: 4, value: 5 },
      price: '850.000 - 1.200.000 TL'
    },
    {
      id: '2',
      brand: 'Renault',
      model: 'Clio',
      year: 2024,
      rating: 4.3,
      reviewCount: 892,
      image: '/cars/renault-clio.jpg',
      summary: 'Şık tasarımı ve teknolojik donanımıyla B segmentinin gözdesi. Şehir içi kullanımda oldukça pratik.',
      pros: ['Modern tasarım', 'Zengin teknoloji', 'Çevik yol tutuşu', 'Ekonomik motor'],
      cons: ['Dar bagaj', 'Sert süspansiyon', 'Yüksek fiyat'],
      categories: { performance: 4, comfort: 4, fuel: 4.5, reliability: 4, value: 3.5 },
      price: '950.000 - 1.350.000 TL'
    },
    {
      id: '3',
      brand: 'Volkswagen',
      model: 'Polo',
      year: 2024,
      rating: 4.6,
      reviewCount: 756,
      image: '/cars/vw-polo.jpg',
      summary: 'Alman mühendisliğinin B segmentteki temsilcisi. Kaliteli yapısı ve sağlam yol tutuşuyla dikkat çekiyor.',
      pros: ['Kaliteli yapı', 'Güvenlik donanımı', 'Sağlam şasi', 'İyi yol tutuşu'],
      cons: ['Pahalı yedek parça', 'Dar iç hacim', 'Yüksek fiyat'],
      categories: { performance: 4, comfort: 4.5, fuel: 4, reliability: 4.5, value: 3.5 },
      price: '1.100.000 - 1.500.000 TL'
    },
    {
      id: '4',
      brand: 'Ford',
      model: 'Focus',
      year: 2024,
      rating: 4.4,
      reviewCount: 634,
      image: '/cars/ford-focus.jpg',
      summary: 'C segmentinin deneyimli oyuncusu. Sportif sürüş dinamikleri ve geniş iç hacmiyle ailelerin tercihi.',
      pros: ['Sportif sürüş', 'Geniş iç hacim', 'Güçlü motor seçenekleri', 'Teknolojik donanım'],
      cons: ['Yüksek yakıt tüketimi', 'Sert süspansiyon', 'Pahalı bakım'],
      categories: { performance: 4.5, comfort: 4, fuel: 3.5, reliability: 4, value: 4 },
      price: '1.250.000 - 1.650.000 TL'
    },
    {
      id: '5',
      brand: 'Opel',
      model: 'Corsa',
      year: 2024,
      rating: 4.2,
      reviewCount: 523,
      image: '/cars/opel-corsa.jpg',
      summary: 'Yeni nesil tasarımıyla dikkat çeken şehir otomobili. Kompakt boyutları ve ekonomik motoruyla ideal.',
      pros: ['Kompakt boyut', 'Ekonomik', 'Modern tasarım', 'Kolay park'],
      cons: ['Dar bagaj', 'Basit iç mekan', 'Zayıf performans'],
      categories: { performance: 3.5, comfort: 4, fuel: 4.5, reliability: 4, value: 4.5 },
      price: '900.000 - 1.250.000 TL'
    },
    {
      id: '6',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2024,
      rating: 4.7,
      reviewCount: 1089,
      image: '/cars/toyota-corolla.jpg',
      summary: 'Güvenilirliğin sembolü. Hybrid teknolojisi ve düşük işletme maliyetiyle uzun vadede kazandırıyor.',
      pros: ['Yüksek güvenilirlik', 'Hybrid teknoloji', 'Düşük yakıt', 'Yüksek ikinci el değeri'],
      cons: ['Yüksek fiyat', 'Sıradan tasarım', 'Zayıf performans'],
      categories: { performance: 3.5, comfort: 4.5, fuel: 5, reliability: 5, value: 4 },
      price: '1.400.000 - 1.800.000 TL'
    },
    {
      id: '7',
      brand: 'Hyundai',
      model: 'i20',
      year: 2024,
      rating: 4.3,
      reviewCount: 678,
      image: '/cars/hyundai-i20.jpg',
      summary: 'Kore kalitesiyle öne çıkan B segment hatchback. Zengin donanım ve uzun garantisiyle cazip.',
      pros: ['Zengin donanım', '5 yıl garanti', 'Modern tasarım', 'İyi yakıt ekonomisi'],
      cons: ['Ortalama performans', 'Sert süspansiyon', 'Yüksek fiyat'],
      categories: { performance: 3.5, comfort: 4, fuel: 4.5, reliability: 4.5, value: 4 },
      price: '950.000 - 1.300.000 TL'
    },
    {
      id: '8',
      brand: 'Peugeot',
      model: '208',
      year: 2024,
      rating: 4.4,
      reviewCount: 445,
      image: '/cars/peugeot-208.jpg',
      summary: 'Fransız şıklığının küçük temsilcisi. İkonik tasarımı ve konforlu sürüşüyle dikkat çekiyor.',
      pros: ['Şık tasarım', 'Konforlu süspansiyon', 'Kaliteli iç mekan', 'Teknolojik kokpit'],
      cons: ['Dar iç hacim', 'Pahalı yedek parça', 'Karmaşık elektronik'],
      categories: { performance: 4, comfort: 4.5, fuel: 4, reliability: 3.5, value: 3.5 },
      price: '1.050.000 - 1.400.000 TL'
    },
    {
      id: '9',
      brand: 'Dacia',
      model: 'Duster',
      year: 2024,
      rating: 4.5,
      reviewCount: 892,
      image: '/cars/dacia-duster.jpg',
      summary: 'Uygun fiyatlı SUV segmentinin lideri. 4x4 seçeneği ve geniş iç hacmiyle macera tutkunlarının tercihi.',
      pros: ['Uygun fiyat', '4x4 seçeneği', 'Geniş iç hacim', 'Yüksek yerden yükseklik'],
      cons: ['Basit iç mekan', 'Zayıf ses yalıtımı', 'Ortalama yakıt tüketimi'],
      categories: { performance: 3.5, comfort: 3.5, fuel: 3.5, reliability: 4, value: 5 },
      price: '950.000 - 1.350.000 TL'
    },
    {
      id: '10',
      brand: 'Renault',
      model: 'Megane',
      year: 2024,
      rating: 4.3,
      reviewCount: 567,
      image: '/cars/renault-megane.jpg',
      summary: 'C segmentinin konforlu temsilcisi. Geniş iç hacmi ve yumuşak süspansiyonuyla uzun yollarda ideal.',
      pros: ['Geniş iç hacim', 'Konforlu süspansiyon', 'Sessiz kabin', 'Teknolojik donanım'],
      cons: ['Yüksek fiyat', 'Ortalama performans', 'Karmaşık elektronik'],
      categories: { performance: 3.5, comfort: 4.5, fuel: 4, reliability: 4, value: 3.5 },
      price: '1.200.000 - 1.600.000 TL'
    },
    {
      id: '11',
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2024,
      rating: 4.6,
      reviewCount: 823,
      image: '/cars/vw-golf.jpg',
      summary: 'C segmentinin efsanesi. 8. nesliyle teknoloji ve kaliteyi bir araya getiriyor.',
      pros: ['Kaliteli yapı', 'Teknolojik donanım', 'Dengeli sürüş', 'Yüksek ikinci el değeri'],
      cons: ['Pahalı', 'Karmaşık elektronik', 'Yüksek bakım maliyeti'],
      categories: { performance: 4.5, comfort: 4.5, fuel: 4, reliability: 4.5, value: 3.5 },
      price: '1.400.000 - 1.900.000 TL'
    },
    {
      id: '12',
      brand: 'Honda',
      model: 'Civic',
      year: 2024,
      rating: 4.7,
      reviewCount: 734,
      image: '/cars/honda-civic.jpg',
      summary: 'Japon mühendisliğinin başyapıtı. Güvenilirliği ve sportif karakteriyle genç sürücülerin favorisi.',
      pros: ['Yüksek güvenilirlik', 'Sportif tasarım', 'Güçlü motor', 'Teknolojik donanım'],
      cons: ['Pahalı', 'Sert süspansiyon', 'Dar arka koltuk'],
      categories: { performance: 4.5, comfort: 4, fuel: 4, reliability: 5, value: 4 },
      price: '1.500.000 - 2.000.000 TL'
    },
    {
      id: '13',
      brand: 'Skoda',
      model: 'Octavia',
      year: 2024,
      rating: 4.6,
      reviewCount: 645,
      image: '/cars/skoda-octavia.jpg',
      summary: 'Pratikliğin ve konforun buluştuğu nokta. Devasa bagaj hacmi ve geniş iç mekanıyla ailelerin tercihi.',
      pros: ['Çok geniş bagaj', 'Geniş iç hacim', 'Konforlu', 'Uygun fiyat'],
      cons: ['Sıradan tasarım', 'Ortalama performans', 'Basit iç mekan'],
      categories: { performance: 4, comfort: 4.5, fuel: 4, reliability: 4.5, value: 4.5 },
      price: '1.300.000 - 1.700.000 TL'
    },
    {
      id: '14',
      brand: 'Seat',
      model: 'Leon',
      year: 2024,
      rating: 4.4,
      reviewCount: 456,
      image: '/cars/seat-leon.jpg',
      summary: 'İspanyol markasının sportif karakterli C segment temsilcisi. Dinamik sürüş ve şık tasarımıyla genç ruhlu.',
      pros: ['Sportif tasarım', 'Dinamik sürüş', 'Kaliteli yapı', 'Teknolojik'],
      cons: ['Sert süspansiyon', 'Pahalı', 'Dar bagaj'],
      categories: { performance: 4.5, comfort: 4, fuel: 4, reliability: 4, value: 4 },
      price: '1.350.000 - 1.750.000 TL'
    },
    {
      id: '15',
      brand: 'Kia',
      model: 'Sportage',
      year: 2024,
      rating: 4.5,
      reviewCount: 789,
      image: '/cars/kia-sportage.jpg',
      summary: 'SUV segmentinin yükselen yıldızı. Modern tasarımı, zengin donanımı ve 7 yıl garantisiyle öne çıkıyor.',
      pros: ['7 yıl garanti', 'Zengin donanım', 'Modern tasarım', 'Geniş iç hacim'],
      cons: ['Yüksek fiyat', 'Yüksek yakıt tüketimi', 'Sert süspansiyon'],
      categories: { performance: 4, comfort: 4.5, fuel: 3.5, reliability: 4.5, value: 4 },
      price: '1.600.000 - 2.200.000 TL'
    },
  ];

  const brands = Array.from(new Set(carReviews.map(car => car.brand))).sort();

  const filteredReviews = carReviews.filter(car => {
    const matchesSearch = car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = !selectedBrand || car.brand === selectedBrand;
    const matchesRating = !selectedRating || car.rating >= parseFloat(selectedRating);
    return matchesSearch && matchesBrand && matchesRating;
  });

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
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">Uzman İncelemeler</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Araba İncelemeleri
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Türkiye pazarındaki popüler araçların detaylı incelemeleri, kullanıcı yorumları ve uzman değerlendirmeleri
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Marka veya model ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white shadow-xl"
                />
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 py-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="font-semibold text-gray-900">Filtrele:</span>
            </div>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="">Tüm Markalar</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="">Tüm Puanlar</option>
              <option value="4.5">4.5+ Yıldız</option>
              <option value="4.0">4.0+ Yıldız</option>
              <option value="3.5">3.5+ Yıldız</option>
            </select>

            <div className="ml-auto text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filteredReviews.length}</span> inceleme bulundu
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((car) => (
              <Link
                key={car.id}
                href={`/incelemeler/${car.id}`}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-200"
              >
                {/* Car Image */}
                <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                    <span className="text-xs font-bold text-gray-900">{car.year}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3.5 h-3.5 ${i < Math.floor(car.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs font-bold text-gray-900 ml-1">{car.rating}</span>
                    </div>
                    <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <span className="text-xs text-gray-600">{car.reviewCount} yorum</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {car.summary}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-100">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-0.5">Performans</div>
                      <div className="flex items-center justify-center gap-0.5">
                        <svg className="w-3.5 h-3.5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-bold text-gray-900">{car.categories.performance}</span>
                      </div>
                    </div>
                    <div className="text-center border-x border-gray-100">
                      <div className="text-xs text-gray-500 mb-0.5">Yakıt</div>
                      <div className="flex items-center justify-center gap-0.5">
                        <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-bold text-gray-900">{car.categories.fuel}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-0.5">Değer</div>
                      <div className="flex items-center justify-center gap-0.5">
                        <svg className="w-3.5 h-3.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-bold text-gray-900">{car.categories.value}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Fiyat Aralığı</div>
                      <div className="text-sm font-bold text-primary-600">{car.price.split(' - ')[0]}</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                      <span>İncele</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-20">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
              <p className="text-gray-600">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Aracınız İçin Servis Bulun
          </h3>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Güvenilir servislerden fiyat teklifi alın ve aracınızın bakımını profesyonellere bırakın.
          </p>
          <Link
            href="/servisler"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Servis Bul
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
