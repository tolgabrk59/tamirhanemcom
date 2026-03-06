'use client';

import { useState, useEffect, useRef } from 'react';
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

  // Visibility state (for mobile)
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // İlçeleri şehre göre al
  const districts = city ? turkeyLocations[city] || [] : [];

  // Scroll handler - hide when scrolling down, show when scrolling stops or up (mobile only)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 500);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [lastScrollY]);

  // Markaları araç türüne göre çek
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
        })
        .catch(err => {
          console.error('[FixedSearchBar] Brand loading error:', err);
        })
        .finally(() => {
          setBrandsLoading(false);
        });
    } else {
      setBrands([]);
      setModels([]);
    }
  }, [vehicleType]);

  // Kategorileri çek
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data);
        }
      })
      .catch(err => {
        console.error('[FixedSearchBar] Category loading error:', err);
      })
      .finally(() => {
        setCategoriesLoading(false);
      });
  }, []);

  // Modelleri markaya göre çek
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
        })
        .catch(err => {
          console.error('[FixedSearchBar] Model loading error:', err);
        })
        .finally(() => {
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

  const selectClass = "w-full px-3 py-2 bg-primary-500 border border-primary-400 rounded-lg text-[#454545] text-sm font-medium focus:ring-2 focus:ring-primary-300 focus:border-transparent";

  return (
    <>
      {/* DESKTOP: Collapsible Left Sidebar */}
      <div className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-16 hover:w-64 bg-primary-500 z-40 transition-all duration-300 ease-in-out group overflow-hidden">
        {/* Collapsed State - Search Icon at top, Logo at bottom (visible when not hovered) */}
        <div className="absolute inset-0 flex flex-col items-center justify-between py-4 group-hover:opacity-0 group-hover:pointer-events-none transition-opacity duration-200 pointer-events-auto">
          {/* Search Icon - Top */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[#454545] text-xs font-bold" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              Servis Ara
            </span>
            <div className="w-10 h-10 bg-[#454545] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Slogan + Logo - Bottom (Vertical, rotated 180deg) */}
          <div className="flex flex-col items-center justify-center mb-12 gap-16">
            <a href="/" className="flex flex-col items-center ml-2">
              <span className="text-[#454545] text-3xl text-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: 'var(--font-handwriting)' }}>
                "her araç kıymetlidir"
              </span>
            </a>
            <a href="/" className="flex flex-col items-center">
              <span className="font-extrabold text-6xl tracking-tight text-[#454545] text-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                tamirhanem
              </span>
            </a>
          </div>
        </div>

        {/* Expanded Content (visible on hover) */}
        <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 delay-100 flex flex-col h-full min-w-64">
          {/* Logo */}
          <div className="px-4 py-4 border-b border-primary-400">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-[#454545]">tamirhane</span>
                <span className="text-white">m</span>
              </span>
            </a>
          </div>

          {/* Header */}
          <div className="px-4 py-3">
            <h2 className="text-[#454545] font-bold text-lg flex items-center gap-2 whitespace-nowrap">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Servis Ara
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Location Section */}
            <div className="space-y-3">
              <label className="text-[#454545] text-xs font-bold uppercase tracking-wide whitespace-nowrap">Konum</label>
              <select
                value={city}
                onChange={(e) => { setCity(e.target.value); setDistrict(''); }}
                className={selectClass}
              >
                <option value="">İl Seçin</option>
                {cityList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={!city}
                className={`${selectClass} disabled:opacity-50`}
              >
                <option value="">İlçe Seçin</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Vehicle Section */}
            <div className="space-y-3">
              <label className="text-[#454545] text-xs font-bold uppercase tracking-wide whitespace-nowrap">Araç</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as 'otomobil' | 'motorsiklet' | '')}
                className={selectClass}
              >
                <option value="">Araç Türü</option>
                <option value="otomobil">Otomobil</option>
                <option value="motorsiklet">Motorsiklet</option>
              </select>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                disabled={!vehicleType || brandsLoading}
                className={`${selectClass} disabled:opacity-50`}
              >
                <option value="">{brandsLoading ? 'Yükleniyor...' : 'Marka Seçin'}</option>
                {brands.map((b) => (
                  <option key={b.brand} value={b.brand}>{b.brand}</option>
                ))}
              </select>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!brand || modelsLoading}
                className={`${selectClass} disabled:opacity-50`}
              >
                <option value="">{modelsLoading ? 'Yükleniyor...' : 'Model Seçin'}</option>
                {models.map((m) => (
                  <option key={m.model} value={m.model}>{m.model}</option>
                ))}
              </select>
            </div>

            {/* Category Section */}
            <div className="space-y-3">
              <label className="text-[#454545] text-xs font-bold uppercase tracking-wide whitespace-nowrap">Hizmet</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClass}
              >
                <option value="">Kategori Seçin</option>
                {categoriesLoading ? (
                  <option disabled>Yükleniyor...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))
                )}
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full bg-[#454545] text-primary-500 px-4 py-3 rounded-lg hover:bg-[#555555] transition-all font-bold flex items-center justify-center gap-2 shadow-lg mt-6 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Servis Bul
            </button>
          </form>
        </div>
      </div>

      {/* MOBILE: Bottom Bar (unchanged) */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-primary-600 px-4 py-3">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <select
                value={city}
                onChange={(e) => { setCity(e.target.value); setDistrict(''); }}
                className="w-full px-2 py-3 bg-primary-500 border border-primary-400 rounded-lg text-[#454545] text-sm focus:ring-2 focus:ring-primary-500 min-h-[44px]"
              >
                <option value="">İl</option>
                {cityList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                disabled={!vehicleType || brandsLoading}
                className="w-full px-2 py-3 bg-primary-500 border border-primary-400 rounded-lg text-[#454545] text-sm focus:ring-2 focus:ring-primary-500 disabled:opacity-50 min-h-[44px]"
              >
                <option value="">{brandsLoading ? '...' : 'Marka'}</option>
                {brands.map((b) => (
                  <option key={b.brand} value={b.brand}>{b.brand}</option>
                ))}
              </select>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2 py-3 bg-primary-500 border border-primary-400 rounded-lg text-[#454545] text-sm focus:ring-2 focus:ring-primary-500 min-h-[44px]"
              >
                <option value="">Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#454545] text-primary-500 px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Servis Bul
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
