'use client';

import { useState } from 'react';
import type { ParkMesajType } from '@/types';

interface ParkMesajFormProps {
  onSuccess?: () => void;
}

const messageTypes: { value: ParkMesajType; label: string; description: string; emoji: string }[] = [
  { value: 'cift-park', label: 'Çift Park', description: 'Araç çift park yapmış', emoji: '🚗🚗' },
  { value: 'engel', label: 'Yol Engeli', description: 'Araç yolu engelliyor', emoji: '🚧' },
  { value: 'is-yeri-onunde', label: 'İş Yeri Önü', description: 'İş yerimizin önünde park', emoji: '🏪' },
  { value: 'diger', label: 'Diğer', description: 'Diğer hatalı park durumları', emoji: '⚠️' },
];

export default function ParkMesajForm({ onSuccess }: ParkMesajFormProps) {
  const [step, setStep] = useState<'plaka' | 'form' | 'login'>('plaka');
  const [formData, setFormData] = useState({
    targetPlaka: '',
    messageType: '' as ParkMesajType | '',
    message: '',
    locationDescription: '',
  });
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // TODO: Get from auth context
  const isLoggedIn = false;
  const currentUserId = null;

  const formatPlaka = (value: string) => {
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (clean.length <= 2) return clean;
    if (clean.length <= 5) return `${clean.slice(0, 2)} ${clean.slice(2)}`;
    return `${clean.slice(0, 2)} ${clean.slice(2, -4)} ${clean.slice(-4)}`;
  };

  const handlePlakaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPlaka(e.target.value);
    setFormData({ ...formData, targetPlaka: formatted });
    setError(null);
  };

  const checkPlaka = async () => {
    if (!formData.targetPlaka) return;

    // First check if user is logged in
    if (!isLoggedIn) {
      setStep('login');
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch(`/api/park-mesaj/check-plaka?plaka=${encodeURIComponent(formData.targetPlaka)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sorgulama başarısız');
      }

      if (data.registered) {
        setStep('form');
      } else {
        setError('Bu plaka uygulamamızda kayıtlı değil. Sadece kayıtlı üyelere bildirim gönderilebilir.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/park-mesaj/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          senderId: currentUserId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bildirim gönderilemedi');
      }

      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Bildiriminiz Gönderildi!</h3>
        <p className="text-gray-600 mb-4">
          Araç sahibine uygulama üzerinden bildirim gönderildi.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setStep('plaka');
            setFormData({
              targetPlaka: '',
              messageType: '',
              message: '',
              locationDescription: '',
            });
          }}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Yeni Bildirim Gönder
        </button>
      </div>
    );
  }

  // Login required step
  if (step === 'login') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Giriş Yapmanız Gerekiyor</h3>
        <p className="text-gray-600 mb-6">
          Hatalı park bildirimi göndermek için uygulamaya giriş yapmalısınız.
        </p>
        <div className="space-y-3">
          <a
            href="/login"
            className="block w-full py-3 px-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors text-center"
          >
            Giriş Yap
          </a>
          <a
            href="/register"
            className="block w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-center"
          >
            Üye Ol
          </a>
          <button
            onClick={() => setStep('plaka')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {step === 'plaka' && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Plaka Sorgula</h2>
            <p className="text-gray-600">Hatalı park eden aracın plakasını girin</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Araç Plakası</label>
            <input
              type="text"
              value={formData.targetPlaka}
              onChange={handlePlakaChange}
              placeholder="34 ABC 123"
              className="w-full px-4 py-4 text-2xl text-center font-bold tracking-wider border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 uppercase"
              maxLength={12}
            />
          </div>

          {error && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={checkPlaka}
            disabled={!formData.targetPlaka || formData.targetPlaka.length < 7 || isChecking}
            className="w-full py-4 px-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChecking ? 'Kontrol Ediliyor...' : 'Plakayı Sorgula'}
          </button>
        </div>
      )}

      {step === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center text-xl font-bold text-gray-700">
              {formData.targetPlaka.slice(0, 2)}
            </div>
            <div>
              <p className="text-sm text-gray-600">Bildirim gönderilecek plaka:</p>
              <p className="font-mono font-bold text-gray-900">{formData.targetPlaka}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep('plaka')}
              className="ml-auto text-sm text-primary-600 hover:underline"
            >
              Değiştir
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bildirim Türü *</label>
            <div className="grid grid-cols-2 gap-3">
              {messageTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, messageType: type.value })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.messageType === type.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{type.emoji}</span>
                  <p className="font-medium text-gray-900 mt-1">{type.label}</p>
                  <p className="text-xs text-gray-500">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konum Açıklaması (Opsiyonel)</label>
            <input
              type="text"
              value={formData.locationDescription}
              onChange={(e) => setFormData({ ...formData, locationDescription: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Örn: X Mahallesi, Y Sokak karşısı"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mesajınız *</label>
            <textarea
              required
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Nazik bir şekilde durumu açıklayın..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{formData.message.length}/500</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !formData.messageType || !formData.message}
            className="w-full py-4 px-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Bildirim Gönder'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Bildiriminiz uygulama üzerinden araç sahibine iletilecektir.
          </p>
        </form>
      )}
    </div>
  );
}
