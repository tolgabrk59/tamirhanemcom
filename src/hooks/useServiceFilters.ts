'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Brand, Model, FilterCategory, SearchFilters } from '@/types';

interface UseServiceFiltersOptions {
  initialCity?: string;
  initialDistrict?: string;
  initialVehicleType?: 'otomobil' | 'motorsiklet' | '';
}

interface UseServiceFiltersReturn {
  // States
  filters: SearchFilters;
  brands: Brand[];
  models: Model[];
  categories: FilterCategory[];

  // Loading states
  isLoadingBrands: boolean;
  isLoadingModels: boolean;
  isLoadingCategories: boolean;

  // Setters
  setCity: (city: string) => void;
  setDistrict: (district: string) => void;
  setVehicleType: (type: 'otomobil' | 'motorsiklet' | '') => void;
  setBrand: (brand: string) => void;
  setModel: (model: string) => void;
  setCategory: (category: string) => void;

  // Utilities
  resetFilters: () => void;
  getSearchParams: () => URLSearchParams;
}

export function useServiceFilters(options: UseServiceFiltersOptions = {}): UseServiceFiltersReturn {
  const {
    initialCity = '',
    initialDistrict = '',
    initialVehicleType = 'otomobil',
  } = options;

  // Filter states
  const [city, setCity] = useState(initialCity);
  const [district, setDistrict] = useState(initialDistrict);
  const [vehicleType, setVehicleType] = useState<'otomobil' | 'motorsiklet' | ''>(initialVehicleType);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');

  // Data states
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [categories, setCategories] = useState<FilterCategory[]>([]);

  // Loading states
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch brands when vehicle type changes
  useEffect(() => {
    if (vehicleType) {
      setIsLoadingBrands(true);
      setBrand('');
      setModel('');
      setModels([]);

      fetch(`/api/brands?vehicleType=${vehicleType}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setBrands(data.data);
          }
        })
        .catch((err) => {
          console.error('Marka yükleme hatası:', err);
        })
        .finally(() => {
          setIsLoadingBrands(false);
        });
    } else {
      setBrands([]);
      setModels([]);
    }
  }, [vehicleType]);

  // Fetch categories on mount
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data);
        }
      })
      .catch((err) => {
        console.error('Kategori yükleme hatası:', err);
      })
      .finally(() => {
        setIsLoadingCategories(false);
      });
  }, []);

  // Fetch models when brand changes
  useEffect(() => {
    if (brand && vehicleType) {
      setIsLoadingModels(true);
      setModel('');

      fetch(`/api/models?brand=${encodeURIComponent(brand)}&vehicleType=${vehicleType}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setModels(data.data);
          }
        })
        .catch((err) => {
          console.error('Model yükleme hatası:', err);
        })
        .finally(() => {
          setIsLoadingModels(false);
        });
    } else {
      setModels([]);
    }
  }, [brand, vehicleType]);

  // Reset city-related state when city changes
  const handleSetCity = useCallback((newCity: string) => {
    setCity(newCity);
    setDistrict('');
  }, []);

  // Reset brand-related state when vehicle type changes
  const handleSetVehicleType = useCallback((type: 'otomobil' | 'motorsiklet' | '') => {
    setVehicleType(type);
    setBrand('');
    setModel('');
  }, []);

  // Reset model when brand changes
  const handleSetBrand = useCallback((newBrand: string) => {
    setBrand(newBrand);
    setModel('');
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setCity(initialCity);
    setDistrict(initialDistrict);
    setVehicleType(initialVehicleType);
    setBrand('');
    setModel('');
    setCategory('');
  }, [initialCity, initialDistrict, initialVehicleType]);

  // Get URL search params
  const getSearchParams = useCallback(() => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (district) params.set('district', district);
    if (brand) params.set('brand', brand);
    if (model) params.set('model', model);
    if (category) params.set('category', category);
    return params;
  }, [city, district, brand, model, category]);

  return {
    filters: {
      city,
      district,
      vehicleType,
      brand,
      model,
      category,
    },
    brands,
    models,
    categories,
    isLoadingBrands,
    isLoadingModels,
    isLoadingCategories,
    setCity: handleSetCity,
    setDistrict,
    setVehicleType: handleSetVehicleType,
    setBrand: handleSetBrand,
    setModel,
    setCategory,
    resetFilters,
    getSearchParams,
  };
}

export default useServiceFilters;
