'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { turkeyLocations, cityList } from '@/data/turkey-locations';
import ServiceSearchModal from './ServiceSearchModal';

// Interface tanımları
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

interface Package {
  full_model: string;
}

interface SearchBoxProps {
  vertical?: boolean;
}

export default function SearchBox({ vertical = false }: SearchBoxProps) {
  const router = useRouter();

  // Form states
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [packageName, setPackageName] = useState('');
  const [category, setCategory] = useState('');

  // Data states
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Loading states
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // İlçeleri şehre göre al
  const districts = city ? turkeyLocations[city] || [] : [];

  // Markaları MySQL'den çek
  useEffect(() => {
    fetch('/api/brands')
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
  }, []);

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
    if (brand) {
      setModelsLoading(true);
      setModel('');
      setPackageName('');
      setPackages([]);
      fetch(`/api/models?brand=${encodeURIComponent(brand)}`)
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
      setPackages([]);
    }
  }, [brand]);

  // Paketleri markaya ve modele göre MySQL'den çek
  useEffect(() => {
    if (brand && model) {
      setPackagesLoading(true);
      setPackageName('');
      fetch(`/api/packages?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setPackages(data.data);
          }
          setPackagesLoading(false);
        })
        .catch(err => {
          console.error('Paket yükleme hatası:', err);
          setPackagesLoading(false);
        });
    } else {
      setPackages([]);
    }
  }, [brand, model]);

  const handleSearch = () => {
    // Navigate to results page instead of opening modal
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (district) params.set('district', district);
    if (brand) params.set('brand', brand);
    if (model) params.set('model', model);
    if (category) params.set('category', category);

    router.push(`/servisler/sonuclar?${params.toString()}`);
  };

  return (
    <div className={vertical ? "w-full" : "w-full bg-white rounded-xl shadow-lg p-3 md:p-4"}>
      <div className={vertical ? "flex flex-col gap-3" : "flex flex-wrap xl:flex-nowrap items-center gap-2"}>
        {/* City Select */}
        <select
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setDistrict('');
          }}
          className={vertical
            ? "w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900"
            : "flex-1 min-w-[100px] px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 text-sm"
          }
        >
          <option value="">İl</option>
          {cityList.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* District Select */}
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          disabled={!city}
          className={vertical
            ? "w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 disabled:bg-secondary-50"
            : "flex-1 min-w-[100px] px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 text-sm disabled:bg-secondary-50"
          }
        >
          <option value="">İlçe</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Brand Select */}
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className={vertical
            ? "w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900"
            : "flex-1 min-w-[100px] px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 text-sm"
          }
        >
          <option value="">Marka</option>
          {brandsLoading ? (
            <option disabled>Yükleniyor...</option>
          ) : (
            brands.map((b) => (
              <option key={b.brand} value={b.brand}>{b.brand}</option>
            ))
          )}
        </select>

        {/* Model Select */}
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={!brand}
          className={vertical
            ? "w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 disabled:bg-secondary-50"
            : "flex-1 min-w-[100px] px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 text-sm disabled:bg-secondary-50"
          }
        >
          <option value="">Model</option>
          {modelsLoading ? (
            <option disabled>Yükleniyor...</option>
          ) : (
            models.map((m) => (
              <option key={m.model} value={m.model}>{m.model}</option>
            ))
          )}
        </select>

        {/* Package Select */}
        <select
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          disabled={!brand || !model}
          className={vertical
            ? "w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 disabled:bg-secondary-50"
            : "flex-1 min-w-[100px] px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 text-sm disabled:bg-secondary-50"
          }
        >
          <option value="">Paket</option>
          {packagesLoading ? (
            <option disabled>Yükleniyor...</option>
          ) : (
            packages.map((p) => (
              <option key={p.full_model} value={p.full_model}>{p.full_model}</option>
            ))
          )}
        </select>

        {/* Category Select */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={vertical
            ? "w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900"
            : "flex-1 min-w-[120px] px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 text-sm"
          }
        >
          <option value="">Kategori</option>
          {categoriesLoading ? (
            <option disabled>Yükleniyor...</option>
          ) : (
            categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))
          )}
        </select>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className={vertical
            ? "w-full bg-primary-600 text-[#454545] px-5 py-3 rounded-lg hover:bg-primary-700 transition-colors font-bold flex items-center justify-center gap-2"
            : "bg-primary-600 text-[#454545] px-5 py-2 rounded-lg hover:bg-primary-700 transition-colors font-bold flex items-center gap-2 whitespace-nowrap"
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Servis Bul</span>
        </button>
      </div>

      {/* Selected Vehicle Display */}
      {brand && model && (
        <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <p className="text-sm font-semibold text-secondary-900">
            Aracınızın Marka Modeli: <span className="text-primary-600">{brand} {model}{packageName ? ` ${packageName}` : ''}</span>
          </p>
        </div>
      )}

      {/* Service Search Modal */}
      <ServiceSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filters={{
          brand,
          model,
          packageName,
          category,
          city,
          district
        }}
      />
    </div>
  );
}
