'use client';

import { useState } from 'react';
import Link from 'next/link';

// Şarj istasyonu verileri (örnek)
const chargingStations = [
  { id: 1, name: 'ZES Şarj İstasyonu', location: 'İstanbul - Kadıköy', type: 'DC Fast', power: '150 kW', available: true },
  { id: 2, name: 'Eşarj Noktası', location: 'İstanbul - Beşiktaş', type: 'AC', power: '22 kW', available: true },
  { id: 3, name: 'Sharz.net', location: 'İstanbul - Ataşehir', type: 'DC Fast', power: '120 kW', available: false },
  { id: 4, name: 'Tesla Supercharger', location: 'İstanbul - Maslak', type: 'DC Fast', power: '250 kW', available: true },
  { id: 5, name: 'Voltrun', location: 'Ankara - Çankaya', type: 'DC Fast', power: '180 kW', available: true },
  { id: 6, name: 'TOGG Trugo', location: 'Ankara - Etimesgut', type: 'DC Ultra-Fast', power: '300 kW', available: true },
];

// Popüler EV modelleri
const evModels = [
  { brand: 'Tesla', model: 'Model 3', range: '510 km', battery: '60 kWh', price: '1.500.000 ₺', image: '/cars/tesla-model3.jpg' },
  { brand: 'Tesla', model: 'Model Y', range: '533 km', battery: '75 kWh', price: '1.800.000 ₺', image: '/cars/tesla-modely.jpg' },
  { brand: 'TOGG', model: 'T10X', range: '523 km', battery: '88.5 kWh', price: '1.350.000 ₺', image: '/cars/togg-t10x.jpg' },
  { brand: 'Hyundai', model: 'IONIQ 5', range: '481 km', battery: '77.4 kWh', price: '1.600.000 ₺', image: '/cars/ioniq5.jpg' },
  { brand: 'Kia', model: 'EV6', range: '528 km', battery: '77.4 kWh', price: '1.700.000 ₺', image: '/cars/kia-ev6.jpg' },
  { brand: 'BMW', model: 'iX3', range: '460 km', battery: '80 kWh', price: '2.200.000 ₺', image: '/cars/bmw-ix3.jpg' },
  { brand: 'Volkswagen', model: 'ID.4', range: '520 km', battery: '77 kWh', price: '1.400.000 ₺', image: '/cars/vw-id4.jpg' },
  { brand: 'Mercedes', model: 'EQC', range: '437 km', battery: '80 kWh', price: '2.500.000 ₺', image: '/cars/mercedes-eqc.jpg' },
];

// Bakım rehberi
const maintenanceGuide = [
  {
    title: 'Batarya Bakımı',
    icon: '🔋',
    tips: [
      '%20-80 arasında şarj tutun',
      'Aşırı sıcak/soğuktan koruyun',
      'Ayda en az 1 kez tam şarj yapın',
      'Uzun süre düşük şarjda bırakmayın',
    ],
    frequency: 'Sürekli',
  },
  {
    title: 'Fren Sistemi',
    icon: '🛑',
    tips: [
      'Rejeneratif fren sayesinde daha az aşınma',
      'Yılda 1 kez fren sıvısı kontrolü',
      'Balata ömrü içten yanmalıya göre 2 kat fazla',
      'Disk pas önleme için düzenli kullanım',
    ],
    frequency: 'Yıllık',
  },
  {
    title: 'Lastik Bakımı',
    icon: '🛞',
    tips: [
      'Yüksek tork nedeniyle daha hızlı aşınır',
      'Aylık basınç kontrolü şart',
      'EV özel lastik tercih edin',
      '10.000 km\'de rotasyon yapın',
    ],
    frequency: 'Aylık',
  },
  {
    title: 'Yazılım Güncellemeleri',
    icon: '📱',
    tips: [
      'OTA güncellemeleri düzenli yapın',
      'Yeni özellikler ve iyileştirmeler',
      'Güvenlik yamaları kritik',
      'WiFi bağlantısında güncelleme',
    ],
    frequency: 'Düzenli',
  },
  {
    title: 'Soğutma Sistemi',
    icon: '❄️',
    tips: [
      'Batarya soğutma sıvısı kontrolü',
      '4-5 yılda bir değişim',
      'Sızıntı kontrolü önemli',
      'Termal yönetim verimliliği',
    ],
    frequency: '4-5 Yıl',
  },
  {
    title: 'Klima & Kabin',
    icon: '🌬️',
    tips: [
      'Kabin filtresi yıllık değişim',
      'Isıtma/soğutma sistemi kontrolü',
      'Menzil için ön koşullandırma kullanın',
      'Cam buz çözücü kontrolü',
    ],
    frequency: 'Yıllık',
  },
];

// Batarya sağlığı bilgileri
const batteryHealthInfo = [
  { label: 'Ortalama Batarya Ömrü', value: '8-10 yıl', icon: '⏱️' },
  { label: 'Garanti Kapsamı', value: '8 yıl / 160.000 km', icon: '🛡️' },
  { label: 'Kapasite Kaybı (8 yıl)', value: '%10-20', icon: '📉' },
  { label: 'Şarj Döngüsü', value: '1500-2000', icon: '🔄' },
];

// SSS
const faqItems = [
  {
    question: 'Elektrikli araç bataryası ne kadar süre dayanır?',
    answer: 'Modern elektrikli araç bataryaları ortalama 8-10 yıl veya 150.000-200.000 km dayanır. Çoğu üretici 8 yıl veya 160.000 km garanti sunmaktadır. Düzgün bakımla batarya ömrü uzatılabilir.',
  },
  {
    question: 'Elektrikli araç şarj maliyeti ne kadar?',
    answer: 'Evde şarj maliyeti yaklaşık 100-150 km için 20-30 ₺ civarındadır. Hızlı şarj istasyonlarında bu maliyet 2-3 kat daha fazla olabilir. Benzinli araçlara göre %60-70 tasarruf sağlar.',
  },
  {
    question: 'Kışın menzil ne kadar düşer?',
    answer: 'Soğuk havalarda menzil %20-30 düşebilir. Bunun nedeni batarya verimliliğinin düşmesi ve kabin ısıtma için enerji harcanmasıdır. Ön koşullandırma ile bu kayıp azaltılabilir.',
  },
  {
    question: 'Elektrikli araç bakımı pahalı mı?',
    answer: 'Hayır, elektrikli araçlar içten yanmalı araçlara göre %30-50 daha az bakım gerektirir. Motor yağı, egzoz, şanzıman bakımı yoktur. Ana bakım kalemleri lastik, fren ve batarya soğutma sıvısıdır.',
  },
  {
    question: 'Apartmanda şarj nasıl yapılır?',
    answer: 'Apartman otoparkına şarj ünitesi kurulabilir. Bunun için yönetim kurulu onayı ve elektrik aboneliği gerekir. Alternatif olarak yakındaki halka açık şarj istasyonları kullanılabilir.',
  },
];

export default function ElectricVehicleGuide() {
  const [activeTab, setActiveTab] = useState('rehber');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState('istanbul');

  return (
    <div className="bg-secondary-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-400/10 rounded-full blur-3xl"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-5 py-2.5 mb-6 backdrop-blur-sm">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-blue-300 font-bold text-sm">Elektrikli Araç Rehberi</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Elektrikli Araç <span className="text-blue-400">Dünyası</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Şarj istasyonları, batarya bakımı, menzil hesaplama ve EV servis rehberi.
              Elektrikli aracınız için ihtiyacınız olan her şey.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">5000+</div>
                <div className="text-blue-300 text-sm font-medium">Şarj Noktası</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-blue-300 text-sm font-medium">EV Model</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">%70</div>
                <div className="text-blue-300 text-sm font-medium">Yakıt Tasarrufu</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-4 bg-white border-b border-secondary-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { id: 'rehber', label: 'Bakım Rehberi', icon: '🔧' },
              { id: 'sarj', label: 'Şarj İstasyonları', icon: '⚡' },
              { id: 'batarya', label: 'Batarya Sağlığı', icon: '🔋' },
              { id: 'modeller', label: 'EV Modelleri', icon: '🚗' },
              { id: 'sss', label: 'SSS', icon: '❓' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bakım Rehberi */}
      {activeTab === 'rehber' && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                EV Bakım <span className="text-blue-500">Rehberi</span>
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Elektrikli aracınızın uzun ömürlü olması için bilmeniz gereken bakım ipuçları
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {maintenanceGuide.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-secondary-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-secondary-900">{item.title}</h3>
                      <span className="text-sm text-blue-500 font-medium">{item.frequency}</span>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {item.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="flex items-start gap-2 text-sm text-secondary-600">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Karşılaştırma */}
            <div className="mt-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 md:p-12 border border-blue-200">
              <h3 className="text-2xl font-bold text-secondary-900 mb-6 text-center">
                EV vs Benzinli Araç Bakım Karşılaştırması
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-lg text-secondary-900">Elektrikli Araç</h4>
                  </div>
                  <ul className="space-y-3">
                    {[
                      { item: 'Motor yağı değişimi', status: 'Yok', color: 'green' },
                      { item: 'Egzoz bakımı', status: 'Yok', color: 'green' },
                      { item: 'Şanzıman bakımı', status: 'Yok', color: 'green' },
                      { item: 'Fren bakımı', status: 'Daha az', color: 'green' },
                      { item: 'Lastik değişimi', status: 'Aynı', color: 'yellow' },
                      { item: 'Soğutma sıvısı', status: '4-5 yılda', color: 'blue' },
                    ].map((row, idx) => (
                      <li key={idx} className="flex items-center justify-between">
                        <span className="text-secondary-600">{row.item}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          row.color === 'green' ? 'bg-green-100 text-green-700' :
                          row.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {row.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-lg text-secondary-900">Benzinli Araç</h4>
                  </div>
                  <ul className="space-y-3">
                    {[
                      { item: 'Motor yağı değişimi', status: '10.000 km', color: 'red' },
                      { item: 'Egzoz bakımı', status: 'Yıllık', color: 'red' },
                      { item: 'Şanzıman bakımı', status: '60.000 km', color: 'red' },
                      { item: 'Fren bakımı', status: '30.000 km', color: 'yellow' },
                      { item: 'Lastik değişimi', status: 'Aynı', color: 'yellow' },
                      { item: 'Soğutma sıvısı', status: '2-3 yılda', color: 'red' },
                    ].map((row, idx) => (
                      <li key={idx} className="flex items-center justify-between">
                        <span className="text-secondary-600">{row.item}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          row.color === 'red' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {row.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-secondary-600">
                  <strong className="text-green-600">Sonuç:</strong> Elektrikli araçlar yıllık ortalama <strong>%30-50 daha az</strong> bakım maliyeti gerektirir.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Şarj İstasyonları */}
      {activeTab === 'sarj' && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                Şarj <span className="text-blue-500">İstasyonları</span>
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Türkiye genelinde binlerce şarj noktasına erişin
              </p>
            </div>

            {/* Harita Placeholder */}
            <div className="bg-white rounded-3xl shadow-xl border border-secondary-100 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Şarj İstasyonu Haritası
                </h3>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-white/20 text-white px-4 py-2 rounded-lg border border-white/30 focus:outline-none"
                >
                  <option value="istanbul" className="text-secondary-900">İstanbul</option>
                  <option value="ankara" className="text-secondary-900">Ankara</option>
                  <option value="izmir" className="text-secondary-900">İzmir</option>
                  <option value="antalya" className="text-secondary-900">Antalya</option>
                </select>
              </div>
              <div className="aspect-[16/9] bg-secondary-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-lg text-secondary-700">Harita Görünümü</h4>
                    <p className="text-secondary-500 text-sm">İnteraktif harita yakında eklenecek</p>
                  </div>
                </div>
              </div>
            </div>

            {/* İstasyon Listesi */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chargingStations.map(station => (
                <div key={station.id} className="bg-white rounded-xl p-5 shadow border border-secondary-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-secondary-900">{station.name}</h4>
                      <p className="text-sm text-secondary-500">{station.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      station.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {station.available ? 'Müsait' : 'Dolu'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-secondary-600">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {station.type}
                    </span>
                    <span className="flex items-center gap-1 text-secondary-600">
                      <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      {station.power}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Şarj Tipleri */}
            <div className="mt-12 bg-gradient-to-br from-secondary-900 to-secondary-800 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Şarj Tipleri</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { type: 'AC Yavaş Şarj', power: '3.7 - 7.4 kW', time: '8-12 saat', best: 'Ev şarjı', icon: '🏠' },
                  { type: 'AC Hızlı Şarj', power: '11 - 22 kW', time: '3-6 saat', best: 'İş yeri', icon: '🏢' },
                  { type: 'DC Süper Hızlı', power: '50 - 350 kW', time: '20-60 dk', best: 'Yolculuk', icon: '🛣️' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h4 className="font-bold text-lg mb-2">{item.type}</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p><strong className="text-white">Güç:</strong> {item.power}</p>
                      <p><strong className="text-white">Süre:</strong> {item.time}</p>
                      <p><strong className="text-white">İdeal:</strong> {item.best}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Batarya Sağlığı */}
      {activeTab === 'batarya' && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                Batarya <span className="text-blue-500">Sağlığı</span>
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Bataryanızın ömrünü uzatmak ve sağlığını korumak için bilmeniz gerekenler
              </p>
            </div>

            {/* Ana İstatistikler */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {batteryHealthInfo.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-secondary-100 text-center">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="text-2xl font-bold text-blue-500 mb-1">{item.value}</div>
                  <div className="text-sm text-secondary-600">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Batarya Sağlığı Göstergesi */}
            <div className="bg-white rounded-3xl shadow-xl border border-secondary-100 p-8 mb-12">
              <h3 className="text-xl font-bold text-secondary-900 mb-6 text-center">Batarya Sağlık Göstergesi</h3>
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-red-500 font-medium">Kritik (&lt;70%)</span>
                  <span className="text-yellow-500 font-medium">Orta (70-85%)</span>
                  <span className="text-green-500 font-medium">İyi (&gt;85%)</span>
                </div>
                <div className="h-8 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full relative">
                  <div className="absolute top-1/2 left-[85%] -translate-y-1/2 -translate-x-1/2">
                    <div className="w-6 h-6 bg-white rounded-full border-4 border-green-500 shadow-lg"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-secondary-500 mt-2">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
                <div className="text-center mt-4">
                  <span className="text-3xl font-bold text-green-500">92%</span>
                  <span className="text-secondary-500 ml-2">Örnek Batarya Sağlığı</span>
                </div>
              </div>
            </div>

            {/* İpuçları */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
                <h3 className="font-bold text-xl text-secondary-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Yapılması Gerekenler
                </h3>
                <ul className="space-y-3">
                  {[
                    '%20-80 arası şarj seviyesi tutun',
                    'Yavaş şarjı tercih edin (mümkünse)',
                    'Aracı gölgede park edin',
                    'Düzenli yazılım güncellemesi yapın',
                    'Batarya sıcaklığını takip edin',
                    'Ön koşullandırma özelliğini kullanın',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-secondary-700">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200">
                <h3 className="font-bold text-xl text-secondary-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Kaçınılması Gerekenler
                </h3>
                <ul className="space-y-3">
                  {[
                    'Sürekli %100 şarjda tutmak',
                    '%0\'a kadar boşaltmak',
                    'Aşırı sıcakta şarj etmek',
                    'Sürekli DC hızlı şarj kullanmak',
                    'Uzun süre düşük şarjda bırakmak',
                    'Güncellemeleri atlamak',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-secondary-700">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* EV Modelleri */}
      {activeTab === 'modeller' && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                Popüler <span className="text-blue-500">EV Modelleri</span>
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Türkiye'de satılan elektrikli araç modelleri ve özellikleri
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {evModels.map((car, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-secondary-100 hover:shadow-xl transition-shadow group">
                  <div className="aspect-[4/3] bg-secondary-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">
                      🚗
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-sm text-blue-500 font-medium mb-1">{car.brand}</div>
                    <h3 className="font-bold text-lg text-secondary-900 mb-3">{car.model}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-secondary-500">Menzil</span>
                        <span className="font-medium text-secondary-900">{car.range}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-500">Batarya</span>
                        <span className="font-medium text-secondary-900">{car.battery}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-500">Fiyat</span>
                        <span className="font-bold text-blue-500">{car.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SSS */}
      {activeTab === 'sss' && (
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                Sık Sorulan <span className="text-blue-500">Sorular</span>
              </h2>
              <p className="text-lg text-secondary-600">
                Elektrikli araçlar hakkında merak edilenler
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow border border-secondary-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <span className="font-bold text-secondary-900 pr-4">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-blue-500 flex-shrink-0 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-6 pb-5">
                      <p className="text-secondary-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EV Servis CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Elektrikli Araç Servisi mi Arıyorsunuz?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            EV konusunda uzman sertifikalı servislerimizi keşfedin
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/servisler?tip=elektrikli" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              EV Servisi Bul
            </Link>
            <Link href="/arac/ansiklopedi" className="inline-flex items-center gap-2 bg-blue-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors">
              Ansiklopediye Git
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
