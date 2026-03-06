'use client';

import { useState, useEffect } from 'react';

export default function ArizaTespitPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'verified'>('phone');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Check if already verified in this session
    const verifiedPhone = sessionStorage.getItem('verifiedPhone');
    if (verifiedPhone) {
      setPhoneNumber(verifiedPhone);
      setStep('verified');
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Lütfen geçerli bir telefon numarası giriniz (10 haneli)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'SMS gönderilemedi');
      }

      setStep('otp');
      setCountdown(60);
    } catch (err: any) {
      console.error('SMS gönderme hatası:', err);
      setError(err.message || 'SMS gönderilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otpCode.length !== 6) {
      setError('Lütfen 6 haneli kodu giriniz');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          otp: otpCode,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Doğrulama başarısız');
      }

      const cleanPhone = phoneNumber.replace(/\D/g, '');
      sessionStorage.setItem('verifiedPhone', cleanPhone);
      localStorage.setItem('userPhone', cleanPhone);
      setStep('verified');
    } catch (err: any) {
      console.error('OTP doğrulama hatası:', err);
      setError(err.message || 'Doğrulama başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setOtpCode('');
    await handleSendOtp({ preventDefault: () => {} } as React.FormEvent);
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);

    if (limited.length <= 3) return limited;
    if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError('');
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtpCode(value);
    setError('');
  };

  return (
    <div className="bg-secondary-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h1 className="text-3xl md:text-4xl font-bold">AI Arıza Tespiti</h1>
          </div>
          <p className="text-lg text-primary-100 max-w-3xl">
            Yapay zeka destekli asistanımız ile aracınızın belirtilerini anlatın, olası arızaları tespit edin ve çözüm önerileri alın.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-secondary-900 mb-2">Hızlı Tespit</h3>
            <p className="text-secondary-600 text-sm">Belirtilerinizi anlatın, anında olası arızaları öğrenin</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-secondary-900 mb-2">Uzman Önerileri</h3>
            <p className="text-secondary-600 text-sm">AI destekli çözüm önerileri ve tamir tavsiyeleri</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-secondary-900 mb-2">Maliyet Tahmini</h3>
            <p className="text-secondary-600 text-sm">Tamir maliyetleri hakkında ön bilgi edinin</p>
          </div>
        </div>
      </section>

      {/* Phone Verification or Chat Interface */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-2xl shadow-lg border border-secondary-200 overflow-hidden">
          {step === 'phone' && (
            // Phone Number Collection Form
            <div className="p-8 md:p-12">
              <div className="max-w-md mx-auto text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-4">
                  AI Asistanımıza Hoş Geldiniz
                </h2>
                <p className="text-secondary-600 mb-8">
                  Size daha iyi hizmet verebilmek için telefon numaranızı doğrulamamız gerekmektedir.
                </p>

                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div>
                    <label htmlFor="phone" className="block text-left text-sm font-bold text-secondary-900 mb-2">
                      Telefon Numaranız
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-secondary-500 font-medium">+90</span>
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="5XX XXX XX XX"
                        className={`w-full pl-16 pr-4 py-4 rounded-lg border-2 ${
                          error ? 'border-red-500' : 'border-secondary-200'
                        } focus:border-primary-500 focus:outline-none text-lg transition-colors`}
                        required
                        disabled={loading}
                      />
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm mt-2 text-left flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        SMS Gönderiliyor...
                      </>
                    ) : (
                      'Doğrulama Kodu Gönder'
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-secondary-200">
                  <div className="flex items-start gap-3 text-sm text-secondary-600 text-left">
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p>
                      <strong className="text-secondary-900">SMS ile Doğrulama:</strong> Telefonunuza 6 haneli bir doğrulama kodu göndereceğiz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'otp' && (
            // OTP Verification Form
            <div className="p-8 md:p-12">
              <div className="max-w-md mx-auto text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-4">
                  Doğrulama Kodunu Girin
                </h2>
                <p className="text-secondary-600 mb-2">
                  <strong className="text-secondary-900">+90 {phoneNumber}</strong> numarasına SMS gönderdik
                </p>
                <p className="text-secondary-500 text-sm mb-8">
                  6 haneli doğrulama kodunu aşağıya girin
                </p>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otpCode}
                      onChange={handleOtpChange}
                      placeholder="000000"
                      className={`w-full text-center text-3xl font-mono tracking-[0.5em] py-4 rounded-lg border-2 ${
                        error ? 'border-red-500' : 'border-secondary-200'
                      } focus:border-primary-500 focus:outline-none transition-colors`}
                      maxLength={6}
                      required
                      disabled={loading}
                      autoFocus
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-2 flex items-center justify-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length !== 6}
                    className="w-full bg-primary-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Doğrulanıyor...
                      </>
                    ) : (
                      'Doğrula ve Devam Et'
                    )}
                  </button>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('phone');
                        setOtpCode('');
                        setError('');
                      }}
                      className="text-secondary-600 hover:text-secondary-900"
                    >
                      ← Numarayı Değiştir
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={countdown > 0 || loading}
                      className={`${
                        countdown > 0 ? 'text-secondary-400' : 'text-primary-600 hover:text-primary-700'
                      }`}
                    >
                      {countdown > 0 ? `Tekrar gönder (${countdown}s)` : 'Tekrar Gönder'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {step === 'verified' && (
            // MCP Chat Interface - Full height within section
            <div className="relative" style={{ height: '800px' }}>
              <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Doğrulanmış
                </div>
                <button
                  onClick={() => {
                    sessionStorage.removeItem('verifiedPhone');
                    localStorage.removeItem('userPhone');
                    setPhoneNumber('');
                    setOtpCode('');
                    setStep('phone');
                  }}
                  className="bg-white text-secondary-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-secondary-100 transition-colors border border-secondary-200 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Çıkış Yap
                </button>
              </div>
              <iframe
                src={`https://mcp.tamirhanem.net/chat?phone=${phoneNumber.replace(/\s/g, '')}&embed=true&verified=true`}
                className="w-full h-full border-0"
                title="AI Arıza Tespiti Chat"
                allow="clipboard-write"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
          )}
        </div>
      </section>

      {/* Additional Help Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Profesyonel Yardıma mı İhtiyacınız Var?</h2>
          <p className="text-secondary-300 mb-6 max-w-2xl mx-auto">
            AI asistanımız size ön bilgi verdi mi? Şimdi güvenilir servislerimizden randevu alın ve aracınızı uzman ellere teslim edin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/servisler"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Servis Bul
            </a>
            <a
              href="/randevu-al"
              className="bg-white text-secondary-900 px-8 py-3 rounded-lg font-bold hover:bg-secondary-100 transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Randevu Al
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
