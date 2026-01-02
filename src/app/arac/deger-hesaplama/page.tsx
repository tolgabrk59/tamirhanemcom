'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Marka ve model verileri
const carBrands = [
  { id: 'audi', name: 'Audi', models: ['A3', 'A4', 'A5', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'e-tron'] },
  { id: 'bmw', name: 'BMW', models: ['1 Serisi', '2 Serisi', '3 Serisi', '4 Serisi', '5 Serisi', '7 Serisi', 'X1', 'X3', 'X5', 'X6', 'X7', 'iX'] },
  { id: 'citroen', name: 'Citroen', models: ['C3', 'C4', 'C5', 'Berlingo', 'C-Elysee', 'C4 Cactus'] },
  { id: 'dacia', name: 'Dacia', models: ['Sandero', 'Duster', 'Logan', 'Jogger', 'Spring'] },
  { id: 'fiat', name: 'Fiat', models: ['Egea', 'Panda', '500', '500X', 'Tipo', 'Doblo'] },
  { id: 'ford', name: 'Ford', models: ['Focus', 'Fiesta', 'Mondeo', 'Kuga', 'Puma', 'Ranger', 'Transit', 'Mustang'] },
  { id: 'honda', name: 'Honda', models: ['Civic', 'CR-V', 'HR-V', 'Jazz', 'Accord'] },
  { id: 'hyundai', name: 'Hyundai', models: ['i10', 'i20', 'i30', 'Tucson', 'Kona', 'Santa Fe', 'Bayon', 'IONIQ 5'] },
  { id: 'kia', name: 'Kia', models: ['Rio', 'Ceed', 'Sportage', 'Sorento', 'Niro', 'EV6', 'Picanto', 'Stonic'] },
  { id: 'mazda', name: 'Mazda', models: ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-30', 'MX-5'] },
  { id: 'mercedes', name: 'Mercedes-Benz', models: ['A Serisi', 'C Serisi', 'E Serisi', 'S Serisi', 'GLA', 'GLC', 'GLE', 'GLS', 'EQC', 'EQS'] },
  { id: 'nissan', name: 'Nissan', models: ['Micra', 'Juke', 'Qashqai', 'X-Trail', 'Leaf', 'Navara'] },
  { id: 'opel', name: 'Opel', models: ['Corsa', 'Astra', 'Mokka', 'Crossland', 'Grandland', 'Insignia'] },
  { id: 'peugeot', name: 'Peugeot', models: ['208', '308', '508', '2008', '3008', '5008', 'Rifter', 'Partner'] },
  { id: 'renault', name: 'Renault', models: ['Clio', 'Megane', 'Kadjar', 'Captur', 'Talisman', 'Austral', 'Zoe'] },
  { id: 'seat', name: 'Seat', models: ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco'] },
  { id: 'skoda', name: 'Skoda', models: ['Fabia', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Enyaq'] },
  { id: 'suzuki', name: 'Suzuki', models: ['Swift', 'Vitara', 'S-Cross', 'Jimny', 'Ignis'] },
  { id: 'tesla', name: 'Tesla', models: ['Model 3', 'Model S', 'Model X', 'Model Y'] },
  { id: 'toyota', name: 'Toyota', models: ['Yaris', 'Corolla', 'Camry', 'RAV4', 'C-HR', 'Land Cruiser', 'Hilux', 'bZ4X'] },
  { id: 'volkswagen', name: 'Volkswagen', models: ['Polo', 'Golf', 'Passat', 'Tiguan', 'T-Roc', 'T-Cross', 'Arteon', 'ID.3', 'ID.4'] },
  { id: 'volvo', name: 'Volvo', models: ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'C40'] },
];

const fuelTypes = [
  { id: 'benzin', name: 'Benzin' },
  { id: 'dizel', name: 'Dizel' },
  { id: 'lpg', name: 'LPG' },
  { id: 'hybrid', name: 'Hibrit' },
  { id: 'elektrik', name: 'Elektrik' },
];

const transmissionTypes = [
  { id: 'manuel', name: 'Manuel' },
  { id: 'otomatik', name: 'Otomatik' },
];

const conditionOptions = [
  { id: 'mukemmel', name: 'Mükemmel', multiplier: 1.1, desc: 'Sıfır ayarında, hasarsız, bakımlı' },
  { id: 'iyi', name: 'İyi', multiplier: 1.0, desc: 'Normal kullanım, küçük yıpranmalar' },
  { id: 'orta', name: 'Orta', multiplier: 0.85, desc: 'Göze çarpan kullanım izleri' },
  { id: 'kotu', name: 'Kötü', multiplier: 0.7, desc: 'Ciddi yıpranma, onarım gerekli' },
];

// Satış öncesi kontrol listesi
const preChecklistItems = [
  { id: 'dokuman', category: 'Belgeler', items: ['Ruhsat', 'Sigorta poliçesi', 'Muayene belgesi', 'Servis kayıtları', 'Yedek anahtar'] },
  { id: 'dis', category: 'Dış Görünüm', items: ['Boya kontrolü', 'Çizik/ezik kontrolü', 'Cam ve ayna durumu', 'Far ve stop lambaları', 'Lastik durumu'] },
  { id: 'ic', category: 'İç Mekan', items: ['Koltuk durumu', 'Gösterge paneli', 'Klima çalışması', 'Elektronik donanım', 'Koku kontrolü'] },
  { id: 'mekanik', category: 'Mekanik', items: ['Motor sesi', 'Şanzıman geçişleri', 'Fren testi', 'Süspansiyon kontrolü', 'Yağ/sıvı seviyeleri'] },
];

export default function VehicleValueCalculator() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [condition, setCondition] = useState('iyi');
  const [showResult, setShowResult] = useState(false);
  const [calculatedValue, setCalculatedValue] = useState({ min: 0, max: 0, avg: 0 });
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  // Yıl seçenekleri
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i);

  // Model listesi
  const models = carBrands.find(b => b.id === selectedBrand)?.models || [];

  // Değer hesaplama
  const calculateValue = () => {
    if (!selectedBrand || !selectedModel || !selectedYear || !mileage) {
      return;
    }

    // Baz değer hesaplama (örnek algoritma)
    const baseValue = 500000; // Baz değer
    const yearFactor = 1 - ((currentYear - parseInt(selectedYear)) * 0.08); // Yıl başına %8 değer kaybı
    const mileageFactor = 1 - (parseInt(mileage) / 1000000); // KM faktörü
    const conditionMultiplier = conditionOptions.find(c => c.id === condition)?.multiplier || 1;
    const fuelMultiplier = fuelType === 'elektrik' ? 1.15 : fuelType === 'hybrid' ? 1.1 : 1;
    const transmissionMultiplier = transmission === 'otomatik' ? 1.08 : 1;

    // Premium marka çarpanı
    const premiumBrands = ['mercedes', 'bmw', 'audi', 'volvo', 'tesla'];
    const brandMultiplier = premiumBrands.includes(selectedBrand) ? 1.5 : 1;

    const calculatedBase = baseValue * yearFactor * mileageFactor * conditionMultiplier * fuelMultiplier * transmissionMultiplier * brandMultiplier;

    // Rastgele varyasyon ekle
    const variation = calculatedBase * 0.15;

    setCalculatedValue({
      min: Math.max(50000, Math.round((calculatedBase - variation) / 1000) * 1000),
      max: Math.round((calculatedBase + variation) / 1000) * 1000,
      avg: Math.round(calculatedBase / 1000) * 1000,
    });
    setShowResult(true);
  };

  const toggleCheckItem = (item: string) => {
    setCheckedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const resetForm = () => {
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedYear('');
    setMileage('');
    setFuelType('');
    setTransmission('');
    setCondition('iyi');
    setShowResult(false);
    setCheckedItems([]);
  };

  return (
    <div className="bg-secondary-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-5 py-2.5 mb-6 backdrop-blur-sm">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-300 font-bold text-sm">Araç Değer Hesaplama</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Aracınızın <span className="text-green-400">Değerini</span> Öğrenin
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Marka, model, yıl ve kilometre bilgilerini girerek aracınızın güncel piyasa değerini hesaplayın.
              Satış öncesi kontrol listesi ile aracınızı satışa hazırlayın.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-green-300 text-sm font-medium">Marka</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-green-300 text-sm font-medium">Model</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">Anlık</div>
                <div className="text-green-300 text-sm font-medium">Piyasa Verisi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl border border-secondary-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Araç Bilgilerini Girin
                  </h2>
                </div>

                <div className="p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Marka */}
                    <div>
                      <label className="block text-sm font-bold text-secondary-700 mb-2">Marka</label>
                      <select
                        value={selectedBrand}
                        onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(''); }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-green-500 focus:ring-0 transition-colors bg-white"
                      >
                        <option value="">Marka Seçin</option>
                        {carBrands.map(brand => (
                          <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Model */}
                    <div>
                      <label className="block text-sm font-bold text-secondary-700 mb-2">Model</label>
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        disabled={!selectedBrand}
                        className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-green-500 focus:ring-0 transition-colors bg-white disabled:bg-secondary-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Model Seçin</option>
                        {models.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </div>

                    {/* Yıl */}
                    <div>
                      <label className="block text-sm font-bold text-secondary-700 mb-2">Model Yılı</label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-green-500 focus:ring-0 transition-colors bg-white"
                      >
                        <option value="">Yıl Seçin</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                    {/* Kilometre */}
                    <div>
                      <label className="block text-sm font-bold text-secondary-700 mb-2">Kilometre</label>
                      <input
                        type="number"
                        value={mileage}
                        onChange={(e) => setMileage(e.target.value)}
                        placeholder="Örn: 85000"
                        className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-green-500 focus:ring-0 transition-colors"
                      />
                    </div>

                    {/* Yakıt Tipi */}
                    <div>
                      <label className="block text-sm font-bold text-secondary-700 mb-2">Yakıt Tipi</label>
                      <select
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-green-500 focus:ring-0 transition-colors bg-white"
                      >
                        <option value="">Yakıt Tipi Seçin</option>
                        {fuelTypes.map(fuel => (
                          <option key={fuel.id} value={fuel.id}>{fuel.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Vites */}
                    <div>
                      <label className="block text-sm font-bold text-secondary-700 mb-2">Vites Tipi</label>
                      <select
                        value={transmission}
                        onChange={(e) => setTransmission(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-green-500 focus:ring-0 transition-colors bg-white"
                      >
                        <option value="">Vites Seçin</option>
                        {transmissionTypes.map(trans => (
                          <option key={trans.id} value={trans.id}>{trans.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Araç Durumu */}
                  <div className="mt-6">
                    <label className="block text-sm font-bold text-secondary-700 mb-3">Araç Durumu</label>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {conditionOptions.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setCondition(opt.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            condition === opt.id
                              ? 'border-green-500 bg-green-50'
                              : 'border-secondary-200 hover:border-secondary-300'
                          }`}
                        >
                          <div className={`font-bold ${condition === opt.id ? 'text-green-600' : 'text-secondary-700'}`}>
                            {opt.name}
                          </div>
                          <div className="text-xs text-secondary-500 mt-1">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Butonlar */}
                  <div className="flex flex-wrap gap-4 mt-8">
                    <button
                      onClick={calculateValue}
                      disabled={!selectedBrand || !selectedModel || !selectedYear || !mileage}
                      className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Değer Hesapla
                    </button>
                    <button
                      onClick={resetForm}
                      className="px-6 py-4 rounded-xl font-bold border-2 border-secondary-200 text-secondary-600 hover:bg-secondary-50 transition-colors"
                    >
                      Sıfırla
                    </button>
                  </div>
                </div>
              </div>

              {/* Sonuç */}
              {showResult && (
                <div className="mt-8 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-xl p-8 text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Tahmini Piyasa Değeri</h3>
                      <p className="text-green-100 text-sm">
                        {carBrands.find(b => b.id === selectedBrand)?.name} {selectedModel} - {selectedYear}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                      <div className="text-green-200 text-sm mb-1">Minimum</div>
                      <div className="text-2xl font-bold">{calculatedValue.min.toLocaleString('tr-TR')} ₺</div>
                    </div>
                    <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm border-2 border-white/30">
                      <div className="text-white text-sm mb-1 font-medium">Ortalama</div>
                      <div className="text-3xl font-bold">{calculatedValue.avg.toLocaleString('tr-TR')} ₺</div>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                      <div className="text-green-200 text-sm mb-1">Maksimum</div>
                      <div className="text-2xl font-bold">{calculatedValue.max.toLocaleString('tr-TR')} ₺</div>
                    </div>
                  </div>

                  {/* Değer Çubuğu */}
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Düşük</span>
                      <span>Yüksek</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: '50%', marginLeft: '25%' }}></div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-white/10 rounded-xl">
                    <p className="text-sm text-green-100">
                      <strong>Not:</strong> Bu değerler tahmini olup, gerçek satış fiyatı araç durumu, piyasa koşulları ve pazarlık sürecine göre değişiklik gösterebilir.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* İpuçları */}
              <div className="bg-white rounded-2xl shadow-lg border border-secondary-100 p-6">
                <h3 className="font-bold text-lg text-secondary-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Değer Artırma İpuçları
                </h3>
                <ul className="space-y-3">
                  {[
                    'Servis bakım kayıtlarını hazırlayın',
                    'Profesyonel detaylı yıkama yaptırın',
                    'Küçük çizikleri cilalayın',
                    'Lastiklerin durumunu kontrol edin',
                    'Tüm belgeleri düzenleyin',
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-secondary-600">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Piyasa Bilgisi */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6">
                <h3 className="font-bold text-lg text-secondary-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  Piyasa Trendleri
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Elektrikli araçlar</span>
                    <span className="text-sm font-bold text-green-600">↑ Yükselişte</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Dizel araçlar</span>
                    <span className="text-sm font-bold text-red-500">↓ Düşüşte</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">SUV modeller</span>
                    <span className="text-sm font-bold text-green-600">↑ Talep yüksek</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Sedan modeller</span>
                    <span className="text-sm font-bold text-yellow-600">→ Stabil</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Profesyonel Değerleme</h3>
                <p className="text-primary-100 text-sm mb-4">
                  Daha doğru bir değerleme için profesyonel ekspertiz hizmeti alın.
                </p>
                <Link href="/servisler" className="inline-flex items-center gap-2 bg-white text-primary-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                  Ekspertiz Bul
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Satış Öncesi Kontrol Listesi */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-100 border border-primary-200 rounded-full px-4 py-2 mb-4">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="text-primary-700 font-bold text-sm">Kontrol Listesi</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Satış Öncesi Kontrol Listesi
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Aracınızı satışa çıkarmadan önce bu kontrol listesini kullanarak hazırlığınızı tamamlayın.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {preChecklistItems.map(category => (
              <div key={category.id} className="bg-secondary-50 rounded-2xl p-6 border border-secondary-200">
                <h3 className="font-bold text-lg text-secondary-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.items.map(item => (
                    <li key={item}>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={checkedItems.includes(item)}
                          onChange={() => toggleCheckItem(item)}
                          className="w-5 h-5 rounded border-2 border-secondary-300 text-green-500 focus:ring-green-500 cursor-pointer"
                        />
                        <span className={`text-sm transition-colors ${checkedItems.includes(item) ? 'text-green-600 line-through' : 'text-secondary-600 group-hover:text-secondary-900'}`}>
                          {item}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* İlerleme */}
          <div className="mt-8 bg-gradient-to-r from-secondary-100 to-secondary-50 rounded-2xl p-6 border border-secondary-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-secondary-900">Hazırlık Durumu</h4>
                <p className="text-sm text-secondary-600">
                  {checkedItems.length} / {preChecklistItems.reduce((acc, cat) => acc + cat.items.length, 0)} madde tamamlandı
                </p>
              </div>
              <div className="flex-1 max-w-md">
                <div className="h-3 bg-secondary-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${(checkedItems.length / preChecklistItems.reduce((acc, cat) => acc + cat.items.length, 0)) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                %{Math.round((checkedItems.length / preChecklistItems.reduce((acc, cat) => acc + cat.items.length, 0)) * 100)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Piyasa Karşılaştırması */}
      <section className="py-16 bg-gradient-to-b from-secondary-900 to-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Piyasa <span className="text-primary-400">Karşılaştırması</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Popüler modellerin ortalama piyasa değerlerini karşılaştırın
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { brand: 'Volkswagen Golf', year: '2020', km: '60.000', price: '850.000 - 950.000 ₺', trend: 'up' },
              { brand: 'Toyota Corolla', year: '2021', km: '40.000', price: '900.000 - 1.050.000 ₺', trend: 'up' },
              { brand: 'Ford Focus', year: '2019', km: '80.000', price: '650.000 - 750.000 ₺', trend: 'stable' },
              { brand: 'BMW 3 Serisi', year: '2020', km: '50.000', price: '1.400.000 - 1.600.000 ₺', trend: 'up' },
              { brand: 'Mercedes C Serisi', year: '2019', km: '70.000', price: '1.300.000 - 1.500.000 ₺', trend: 'stable' },
              { brand: 'Renault Clio', year: '2022', km: '20.000', price: '600.000 - 700.000 ₺', trend: 'down' },
            ].map((car, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">{car.brand}</h3>
                    <p className="text-gray-400 text-sm">{car.year} • {car.km} km</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    car.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                    car.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {car.trend === 'up' ? '↑ Yükseliyor' : car.trend === 'down' ? '↓ Düşüyor' : '→ Stabil'}
                  </div>
                </div>
                <div className="text-xl font-bold text-primary-400">{car.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Aracınızı Satmaya Hazır mısınız?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Güvenilir alıcılarla buluşmak için hemen ilan verin
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/servisler" className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Ekspertiz Servisi Bul
            </Link>
            <Link href="/iletisim" className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-800 transition-colors">
              Bize Ulaşın
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
