'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { turkeyLocations, cityList } from '@/data/turkey-locations';

interface Category {
  id: number;
  name: string;
}

interface Brand {
  brand: string;
}

interface Model {
  model: string;
}

export default function FixedSearchBar() {
  const router = useRouter();

  // Form states
  const [city, setCity] = useState('Tekirdağ');
  const [district, setDistrict] = useState('Çorlu');
  const [vehicleType, setVehicleType] = useState<'otomobil' | 'motorsiklet' | ''>('otomobil');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');

  // Data states
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Loading states
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Visibility state
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // İlçeleri şehre göre al
  const districts = city ? turkeyLocations[city] || [] : [];

  // Scroll handler - hide when scrolling down, show when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Markaları araç türüne göre MySQL'den çek
  useEffect(() => {
    if (vehicleType) {
      setBrandsLoading(true);
      setBrand('');
      setModel('');
      setModels([]);
      fetch(`/api/brands?vehicleType=${vehicleType}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setBrands(data.data);
          }
          setBrandsLoading(false);
        })
        .catch(err => {
          console.error('Marka yükleme hatası:', err);
          setBrandsLoading(false);
        });
    } else {
      setBrands([]);
      setModels([]);
    }
  }, [vehicleType]);

  // Kategorileri MySQL'den çek
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data);
        }
        setCategoriesLoading(false);
      })
      .catch(err => {
        console.error('Kategori yükleme hatası:', err);
        setCategoriesLoading(false);
      });
  }, []);

  // Modelleri markaya göre MySQL'den çek
  useEffect(() => {
    if (brand && vehicleType) {
      setModelsLoading(true);
      setModel('');
      fetch(`/api/models?brand=${encodeURIComponent(brand)}&vehicleType=${vehicleType}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setModels(data.data);
          }
          setModelsLoading(false);
        })
        .catch(err => {
          console.error('Model yükleme hatası:', err);
          setModelsLoading(false);
        });
    } else {
      setModels([]);
    }
  }, [brand, vehicleType]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (district) params.set('district', district);
    if (brand) params.set('brand', brand);
    if (model) params.set('model', model);
    if (category) params.set('category', category);

    router.push(`/servisler/sonuclar?${params.toString()}`);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Gradient fade effect */}
      <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-primary-600/80 to-transparent pointer-events-none"></div>

      {/* Main bar */}
      <div className="bg-primary-600 backdrop-blur-xl border-t border-primary-400/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Desktop Layout */}
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="hidden md:flex items-center gap-2" role="search" aria-label="Servis Arama Formu">
            {/* City Select */}
            <div className="flex-1 min-w-[120px]">
              <label htmlFor="fixed-city" className="sr-only">İl Seçin</label>
              <select
                id="fixed-city"
                name="city"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setDistrict('');
                }}
                className="w-full px-3 py-2.5 bg-[#454545] border border-[#5a5a5a] rounded-lg text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="" className="bg-[#454545] text-white">İl Seçin</option>
                {cityList.map((c) => (
                  <option key={c} value={c} className="bg-[#454545] text-white">{c}</option>
                ))}
              </select>
            </div>

            {/* District Select */}
            <div className="flex-1 min-w-[120px]">
              <label htmlFor="fixed-district" className="sr-only">İlçe Seçin</label>
              <select
                id="fixed-district"
                name="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={!city}
                className="w-full px-3 py-2.5 bg-[#454545] border border-[#5a5a5a] rounded-lg text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="" className="bg-[#454545] text-white">İlçe</option>
                {districts.map((d) => (
                  <option key={d} value={d} className="bg-[#454545] text-white">{d}</option>
                ))}
              </select>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-white/20" aria-hidden="true"></div>

            {/* Vehicle Type Select */}
            <div className="flex-1 min-w-[120px]">
              <label htmlFor="fixed-vehicleType" className="sr-only">Araç Türü Seçin</label>
              <select
                id="fixed-vehicleType"
                name="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as 'otomobil' | 'motorsiklet' | '')}
                className="w-full px-3 py-2.5 bg-[#454545] border border-[#5a5a5a] rounded-lg text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="" className="bg-[#454545] text-white">Araç Türü</option>
                <option value="otomobil" className="bg-[#454545] text-white">Otomobil</option>
                <option value="motorsiklet" className="bg-[#454545] text-white">Motorsiklet</option>
              </select>
            </div>

            {/* Brand Select */}
            <div className="flex-1 min-w-[120px]">
              <label htmlFor="fixed-brand" className="sr-only">Marka Seçin</label>
              <select
                id="fixed-brand"
                name="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                disabled={!vehicleType}
                className="w-full px-3 py-2.5 bg-[#454545] border border-[#5a5a5a] rounded-lg text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="" className="bg-[#454545] text-white">Marka</option>
                {brandsLoading ? (
                  <option disabled className="bg-[#454545] text-white">Yükleniyor...</option>
                ) : (
                  brands.map((b) => (
                    <option key={b.brand} value={b.brand} className="bg-[#454545] text-white">{b.brand}</option>
                  ))
                )}
              </select>
            </div>

            {/* Model Select */}
            <div className="flex-1 min-w-[120px]">
              <label htmlFor="fixed-model" className="sr-only">Model Seçin</label>
              <select
                id="fixed-model"
                name="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!brand}
                className="w-full px-3 py-2.5 bg-[#454545] border border-[#5a5a5a] rounded-lg text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="" className="bg-[#454545] text-white">Model</option>
                {modelsLoading ? (
                  <option disabled className="bg-[#454545] text-white">Yükleniyor...</option>
                ) : (
                  models.map((m) => (
                    <option key={m.model} value={m.model} className="bg-[#454545] text-white">{m.model}</option>
                  ))
                )}
              </select>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-white/20" aria-hidden="true"></div>

            {/* Category Select */}
            <div className="flex-1 min-w-[140px]">
              <label htmlFor="fixed-category" className="sr-only">Hizmet Kategorisi Seçin</label>
              <select
                id="fixed-category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#454545] border border-[#5a5a5a] rounded-lg text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="" className="bg-[#454545] text-white">Hizmet Kategorisi</option>
                {categoriesLoading ? (
                  <option disabled className="bg-[#454545] text-white">Yükleniyor...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.name} className="bg-[#454545] text-white">{cat.name}</option>
                  ))
                )}
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-white text-[#454545] px-8 py-2.5 rounded-lg hover:bg-gray-100 transition-all font-bold flex items-center gap-2 shadow-lg hover:shadow-xl btn-interactive"
              aria-label="Servis Ara"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Servis Bul</span>
            </button>
          </form>

          {/* Mobile Layout */}
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="md:hidden" role="search" aria-label="Mobil Servis Arama">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <label htmlFor="mobile-city" className="sr-only">İl Seçin</label>
                <select
                  id="mobile-city"
                  name="city"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setDistrict('');
                  }}
                  className="w-full px-2 py-2 bg-[#454545] border border-[#5a5a5a] rounded-lg text-[#454545] text-xs focus:ring-2 focus:ring-primary-500"
                >
                  <option value="" className="bg-[#454545] text-white">İl</option>
                  {cityList.map((c) => (
                    <option key={c} value={c} className="bg-[#454545] text-white">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="mobile-brand" className="sr-only">Marka Seçin</label>
                <select
                  id="mobile-brand"
                  name="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  disabled={!vehicleType}
                  className="w-full px-2 py-2 bg-[#454545] border border-[#5a5a5a] rounded-lg text-[#454545] text-xs focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <option value="" className="bg-[#454545] text-white">Marka</option>
                  {brands.map((b) => (
                    <option key={b.brand} value={b.brand} className="bg-[#454545] text-white">{b.brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="mobile-category" className="sr-only">Kategori Seçin</label>
                <select
                  id="mobile-category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2 py-2 bg-[#454545] border border-[#5a5a5a] rounded-lg text-[#454545] text-xs focus:ring-2 focus:ring-primary-500"
                >
                  <option value="" className="bg-[#454545] text-white">Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name} className="bg-[#454545] text-white">{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-[#454545] px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg btn-interactive hover:bg-gray-100 transition-all"
              aria-label="Servis Ara"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Servis Bul</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
