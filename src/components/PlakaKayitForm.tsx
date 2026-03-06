'use client';

import { useState, useEffect } from 'react';

interface PlakaKayitFormProps {
  onSuccess?: () => void;
}

export default function PlakaKayitForm({ onSuccess }: PlakaKayitFormProps) {
  const [formData, setFormData] = useState({
    plaka: '',
    ownerPhone: '',
    ownerEmail: '',
    brand: '',
    model: '',
    year: '',
    kvkkConsent: false,
  });
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const formatPlaka = (value: string) => {
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (clean.length <= 2) return clean;
    if (clean.length <= 5) return `${clean.slice(0, 2)} ${clean.slice(2)}`;
    return `${clean.slice(0, 2)} ${clean.slice(2, -4)} ${clean.slice(-4)}`;
  };

  const handlePlakaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPlaka(e.target.value);
    setFormData({ ...formData, plaka: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/plaka-kayit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          year: formData.year ? parseInt(formData.year) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kayıt oluşturulamadı');
      }

      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Plakanız Kaydedildi!</h3>
        <p className="text-gray-600 mb-4">
          Artık aracınız hatalı park ederse, diğer kullanıcılar size mesaj gönderebilir.
        </p>
        <p className="text-sm text-gray-500">
          Mesajlar {formData.ownerPhone} numarasına SMS olarak iletilecektir.
        </p>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Plakamı Kaydet</h2>
        <p className="text-gray-600 text-sm">
          Plakanızı kaydedin, hatalı park durumunda size mesaj gönderilebilsin.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Plaka *</label>
        <input
          type="text"
          required
          value={formData.plaka}
          onChange={handlePlakaChange}
          placeholder="34 ABC 123"
          className="w-full px-4 py-3 text-xl text-center font-mono border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 uppercase"
          maxLength={12}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon Numarası *</label>
        <input
          type="tel"
          required
          value={formData.ownerPhone}
          onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="05XX XXX XX XX"
        />
        <p className="text-xs text-gray-500 mt-1">Mesajlar bu numaraya iletilecektir</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">E-posta (Opsiyonel)</label>
        <input
          type="email"
          value={formData.ownerEmail}
          onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="ornek@email.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marka (Opsiyonel)</label>
          <select
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value, model: '' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Seçiniz</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model (Opsiyonel)</label>
          <select
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            disabled={!formData.brand}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
          >
            <option value="">Seçiniz</option>
            {models.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Model Yılı (Opsiyonel)</label>
        <select
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Seçiniz</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={formData.kvkkConsent}
            onChange={(e) => setFormData({ ...formData, kvkkConsent: e.target.checked })}
            className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">
            <a href="/kvkk" target="_blank" className="text-primary-600 hover:underline">KVKK Aydınlatma Metni</a>'ni
            okudum ve kişisel verilerimin işlenmesini kabul ediyorum. *
          </span>
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Kaydediliyor...' : 'Plakamı Kaydet'}
      </button>
    </form>
  );
}
