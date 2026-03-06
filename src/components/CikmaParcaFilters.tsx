'use client';

import { useState, useEffect } from 'react';
import type { CikmaParcaCategory } from '@/types';

interface CikmaParcaFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

export interface FilterState {
  category?: CikmaParcaCategory;
  brand?: string;
  model?: string;
  year?: number;
  fuelType?: string;
  transmissionType?: string;
}

const categories: { value: CikmaParcaCategory; label: string }[] = [
  { value: 'motor', label: 'Motor' },
  { value: 'fren', label: 'Fren' },
  { value: 'suspansiyon', label: 'Süspansiyon' },
  { value: 'elektrik', label: 'Elektrik' },
  { value: 'sogutma', label: 'Soğutma' },
  { value: 'sanziman', label: 'Şanzıman' },
  { value: 'egzoz', label: 'Egzoz' },
  { value: 'yakit', label: 'Yakıt' },
  { value: 'kaporta', label: 'Kaporta' },
  { value: 'ic-aksesuar', label: 'İç Aksesuar' },
  { value: 'diger', label: 'Diğer' },
];

const fuelTypes = [
  { value: 'benzin', label: 'Benzin' },
  { value: 'dizel', label: 'Dizel' },
  { value: 'lpg', label: 'LPG' },
  { value: 'hibrit', label: 'Hibrit' },
  { value: 'elektrik', label: 'Elektrik' },
];

const transmissionTypes = [
  { value: 'manuel', label: 'Manuel' },
  { value: 'otomatik', label: 'Otomatik' },
  { value: 'yari-otomatik', label: 'Yarı Otomatik' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

export default function CikmaParcaFilters({ onFilterChange, initialFilters }: CikmaParcaFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters || {});
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch brands
  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBrands(data.data.map((b: { brand: string }) => b.brand));
        }
      })
      .catch(() => {});
  }, []);

  // Fetch models when brand changes
  useEffect(() => {
    if (filters.brand) {
      fetch(`/api/models?brand=${filters.brand}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setModels(data.data.map((m: { model: string }) => m.model));
          }
        })
        .catch(() => {});
    } else {
      setModels([]);
    }
  }, [filters.brand]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    if (key === 'brand') {
      newFilters.model = undefined;
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Mobile toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-2 text-gray-700"
        >
          <span className="font-medium">Filtreler</span>
          <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
          <select
            value={filters.category || ''}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Tümü</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marka</label>
          <select
            value={filters.brand || ''}
            onChange={(e) => updateFilter('brand', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Tümü</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Model - Always visible, disabled when no brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
          <select
            value={filters.model || ''}
            onChange={(e) => updateFilter('model', e.target.value)}
            disabled={!filters.brand}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Tümü</option>
            {models.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Yıl</label>
          <select
            value={filters.year || ''}
            onChange={(e) => updateFilter('year', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Tümü</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Yakıt Tipi</label>
          <select
            value={filters.fuelType || ''}
            onChange={(e) => updateFilter('fuelType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Tümü</option>
            {fuelTypes.map(fuel => (
              <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
            ))}
          </select>
        </div>

        {/* Transmission Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vites Türü</label>
          <select
            value={filters.transmissionType || ''}
            onChange={(e) => updateFilter('transmissionType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Tümü</option>
            {transmissionTypes.map(trans => (
              <option key={trans.value} value={trans.value}>{trans.label}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full py-2 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Filtreleri Temizle
          </button>
        )}
      </div>
    </div>
  );
}
