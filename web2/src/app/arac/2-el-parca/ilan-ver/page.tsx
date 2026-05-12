'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { CikmaParcaCategory, CikmaParcaCondition } from '@/types';

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

const conditions: { value: CikmaParcaCondition; label: string; description: string }[] = [
  { value: 'cok-iyi', label: 'Çok İyi', description: 'Neredeyse yeni, hiç kullanılmamış görünümde' },
  { value: 'iyi', label: 'İyi', description: 'Normal kullanım izleri, işlevsel' },
  { value: 'orta', label: 'Orta', description: 'Belirgin kullanım izleri, hala işlevsel' },
  { value: 'onarima-ihtiyaci-var', label: 'Onarıma İhtiyacı Var', description: 'Tamir gerektirir' },
];

export default function IlanVerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as CikmaParcaCategory | '',
    brand: '',
    model: '',
    yearFrom: '',
    yearTo: '',
    price: '',
    condition: '' as CikmaParcaCondition | '',
    oemCode: '',
    location: '',
  });
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (formData.brand) {
      fetch(`/api/models?brand=${formData.brand}`)
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
  }, [formData.brand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Replace with real seller authentication
      const sellerId = 1;

      const response = await fetch('/api/2-el-parca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          yearFrom: formData.yearFrom ? parseInt(formData.yearFrom) : undefined,
          yearTo: formData.yearTo ? parseInt(formData.yearTo) : undefined,
          price: parseFloat(formData.price),
          sellerId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'İlan oluşturulamadı');
      }

      router.push(`/arac/2-el-parca/${data.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/arac/2-el-parca" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Geri Dön</span>
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">2.El Parça İlanı Ver</h1>
          <p className="text-gray-600">Elinizdeki 2.el parçayı satışa çıkarın</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">İlan Başlığı *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Örn: Volkswagen Golf 7 Far Seti Orijinal"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as CikmaParcaCategory })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Seçiniz</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Brand & Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Uyumlu Marka *</label>
              <select
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value, model: '' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Seçiniz</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Uyumlu Model *</label>
              <select
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                disabled={!formData.brand}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              >
                <option value="">Seçiniz</option>
                {models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Year Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Yıl (Başlangıç)</label>
              <select
                value={formData.yearFrom}
                onChange={(e) => setFormData({ ...formData, yearFrom: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Seçiniz</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Yıl (Bitiş)</label>
              <select
                value={formData.yearTo}
                onChange={(e) => setFormData({ ...formData, yearTo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Seçiniz</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat (TL) *</label>
            <div className="relative">
              <input
                type="number"
                required
                min="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">TL</span>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parça Durumu *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {conditions.map((cond) => (
                <button
                  key={cond.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, condition: cond.value })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.condition === cond.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900">{cond.label}</p>
                  <p className="text-sm text-gray-500">{cond.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* OEM Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">OEM Parça Kodu (Opsiyonel)</label>
            <input
              type="text"
              value={formData.oemCode}
              onChange={(e) => setFormData({ ...formData, oemCode: e.target.value })}
              placeholder="Örn: 1K0615301AB"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Konum *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Şehir adı"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama *</label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Parça hakkında detaylı bilgi verin. Durumu, kullanım süresi, hasarları varsa belirtin..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isSubmitting ? 'İlan Oluşturuluyor...' : 'İlanı Yayınla'}
          </button>
        </form>
      </div>
    </div>
  );
}
