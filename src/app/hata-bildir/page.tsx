'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Send, CheckCircle, ArrowLeft, User, FileText, Mail, Phone, Bug } from 'lucide-react';

type FeedbackPreference = 'none' | 'email' | 'phone';

export default function BugReportPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    feedbackPreference: 'none' as FeedbackPreference,
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Lütfen adınızı ve soyadınızı girin.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Lütfen hata açıklamasını girin.');
      return;
    }
    if (formData.feedbackPreference === 'email' && !formData.email.trim()) {
      setError('Lütfen e-posta adresinizi girin.');
      return;
    }
    if (formData.feedbackPreference === 'phone' && !formData.phone.trim()) {
      setError('Lütfen telefon numaranızı girin.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Strapi'ye gönder
      const response = await fetch('https://api.tamirhanem.net/api/bug-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            name: formData.name,
            description: formData.description,
            feedbackPreference: formData.feedbackPreference,
            email: formData.email || null,
            phone: formData.phone || null,
            createdAt: new Date().toISOString(),
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Gönderim başarısız');
      }

      setIsSubmitted(true);
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 mb-3">
            Bildiriminiz Alındı!
          </h1>
          <p className="text-secondary-600 mb-6">
            Hata bildiriminiz için teşekkür ederiz. Ekibimiz en kısa sürede inceleyecektir.
            {formData.feedbackPreference !== 'none' && (
              <span className="block mt-2">
                Size {formData.feedbackPreference === 'email' ? 'e-posta' : 'telefon'} ile geri dönüş yapacağız.
              </span>
            )}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-100 to-secondary-200 py-8 px-4 sm:py-12 lg:py-16">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Ana Sayfaya Dön</span>
        </Link>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-secondary-800 to-secondary-900 px-6 py-8 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-500 rounded-xl flex items-center justify-center">
                <Bug className="w-7 h-7 text-secondary-900" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Hata Bildir</h1>
                <p className="text-white/70 text-sm sm:text-base mt-1">
                  Karşılaştığınız sorunu bize iletin
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-secondary-700 mb-2">
                <User className="w-4 h-4 text-secondary-400" />
                Adınız Soyadınız
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-secondary-900 placeholder:text-secondary-400"
              />
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-secondary-700 mb-2">
                <FileText className="w-4 h-4 text-secondary-400" />
                Hata Açıklaması
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Lütfen karşılaştığınız hatayı detaylı bir şekilde açıklayın. Hangi sayfada, ne yaparken, nasıl bir hata ile karşılaştınız?"
                rows={5}
                className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-secondary-900 placeholder:text-secondary-400 resize-none"
              />
              <p className="text-xs text-secondary-400 mt-1.5">
                Ne kadar detaylı açıklarsanız, sorunu o kadar hızlı çözebiliriz.
              </p>
            </div>

            {/* Feedback Preference */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-secondary-700 mb-3">
                Geri Bildirim İster misiniz?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, feedbackPreference: 'none', email: '', phone: '' })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.feedbackPreference === 'none'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                >
                  <span className={`text-sm font-semibold ${
                    formData.feedbackPreference === 'none' ? 'text-primary-700' : 'text-secondary-700'
                  }`}>
                    Hayır
                  </span>
                  <p className="text-xs text-secondary-500 mt-1">
                    Geri dönüş beklemeiyorum
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, feedbackPreference: 'email', phone: '' })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.feedbackPreference === 'email'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Mail className={`w-4 h-4 ${
                      formData.feedbackPreference === 'email' ? 'text-primary-600' : 'text-secondary-400'
                    }`} />
                    <span className={`text-sm font-semibold ${
                      formData.feedbackPreference === 'email' ? 'text-primary-700' : 'text-secondary-700'
                    }`}>
                      E-posta
                    </span>
                  </div>
                  <p className="text-xs text-secondary-500 mt-1">
                    E-posta ile bilgilendir
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, feedbackPreference: 'phone', email: '' })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.feedbackPreference === 'phone'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Phone className={`w-4 h-4 ${
                      formData.feedbackPreference === 'phone' ? 'text-primary-600' : 'text-secondary-400'
                    }`} />
                    <span className={`text-sm font-semibold ${
                      formData.feedbackPreference === 'phone' ? 'text-primary-700' : 'text-secondary-700'
                    }`}>
                      Telefon
                    </span>
                  </div>
                  <p className="text-xs text-secondary-500 mt-1">
                    Telefonla ara
                  </p>
                </button>
              </div>
            </div>

            {/* Email Field - Conditional */}
            {formData.feedbackPreference === 'email' && (
              <div className="animate-fadeInUp">
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-secondary-700 mb-2">
                  <Mail className="w-4 h-4 text-secondary-400" />
                  E-posta Adresiniz
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ornek@email.com"
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-secondary-900 placeholder:text-secondary-400"
                />
              </div>
            )}

            {/* Phone Field - Conditional */}
            {formData.feedbackPreference === 'phone' && (
              <div className="animate-fadeInUp">
                <label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold text-secondary-700 mb-2">
                  <Phone className="w-4 h-4 text-secondary-400" />
                  Telefon Numaranız
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0532 123 45 67"
                  className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-secondary-900 placeholder:text-secondary-400"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-500 hover:bg-primary-600 text-secondary-900 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Hata Bildir
                </>
              )}
            </button>

            {/* Privacy Note */}
            <p className="text-xs text-secondary-400 text-center">
              Bilgileriniz gizlilik politikamız kapsamında korunmaktadır ve yalnızca hata çözümü için kullanılacaktır.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
