'use client';

import { useState } from 'react';
import type { CikmaParca } from '@/types';

interface CikmaParcaTeklifFormProps {
  parca: CikmaParca;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CikmaParcaTeklifForm({ parca, onSuccess, onClose }: CikmaParcaTeklifFormProps) {
  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    message: '',
    offeredPrice: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/2-el-parca/teklif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parcaId: parca.id,
          senderName: formData.senderName,
          senderPhone: formData.senderPhone,
          message: formData.message,
          offeredPrice: formData.offeredPrice ? parseFloat(formData.offeredPrice) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Teklif gönderilemedi');
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Teklifiniz Gönderildi!</h3>
        <p className="text-gray-600 mb-4">Satıcı en kısa sürede sizinle iletişime geçecektir.</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Tamam
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600">Teklif gönderdiğiniz parça:</p>
        <p className="font-semibold text-gray-900">{parca.title}</p>
        <p className="text-primary-600 font-bold">
          {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(parca.price)}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Adınız *</label>
        <input
          type="text"
          required
          value={formData.senderName}
          onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Ad Soyad"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
        <input
          type="tel"
          required
          value={formData.senderPhone}
          onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="05XX XXX XX XX"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Teklif Fiyatınız (Opsiyonel)</label>
        <div className="relative">
          <input
            type="number"
            value={formData.offeredPrice}
            onChange={(e) => setFormData({ ...formData, offeredPrice: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-12"
            placeholder="0"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">TL</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mesajınız *</label>
        <textarea
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Satıcıya iletmek istediğiniz mesaj..."
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Gönderiliyor...' : 'Teklif Gönder'}
        </button>
      </div>
    </form>
  );
}
