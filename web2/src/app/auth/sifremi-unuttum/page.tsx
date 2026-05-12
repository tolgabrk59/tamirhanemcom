'use client';

import { useState, useEffect } from 'react';
import { KeyRound, Phone, ShieldCheck, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

type Step = 'phone' | 'otp' | 'success';

export default function SifremiUnuttumPage() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);

  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  function cleanPhone(raw: string): string {
    return raw.replace(/[\s\-\+]/g, '').replace(/^90/, '');
  }

  async function handleSendOtp() {
    setError('');
    const p = cleanPhone(phone);
    if (!/^[5][0-9]{9}$/.test(p)) {
      setError('Geçerli bir telefon numarası girin (5XX XXX XX XX)');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/password-recovery/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: p }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('otp');
        setOtpCountdown(data.expiresIn || 180);
      } else {
        setError(data.error || 'SMS gönderilemedi. Lütfen tekrar deneyin.');
      }
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    setError('');
    if (otp.length !== 6) {
      setError('6 haneli doğrulama kodunu girin.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalı.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/password-recovery/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone(phone), code: otp, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('success');
      } else {
        setError(data.error || 'Şifre sıfırlanamadı. Lütfen tekrar deneyin.');
      }
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (otpCountdown > 0) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/password-recovery/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone(phone) }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpCountdown(data.expiresIn || 180);
      } else {
        setError(data.error || 'SMS gönderilemedi.');
      }
    } catch {
      setError('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  }

  function formatCountdown(s: number): string {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : `${sec}s`;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">

          {/* Back link */}
          {step !== 'success' && (
            <Link
              href="/giris"
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Girişe dön
            </Link>
          )}

          {/* Step: phone */}
          {step === 'phone' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-8 h-8 text-primary-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Şifremi Unuttum</h1>
                <p className="text-gray-400 text-sm">
                  Kayıtlı telefon numaranıza doğrulama kodu göndereceğiz.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5">
                    Telefon Numarası
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="tel"
                      inputMode="tel"
                      placeholder="5XX XXX XX XX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSendOtp(); }}
                      className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-800 text-red-400 rounded-xl px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSendOtp}
                  disabled={loading || !phone}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Gönderiliyor...</>
                  ) : (
                    <>Doğrulama Kodu Gönder<ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Step: otp + new password */}
          {step === 'otp' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-primary-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Kodu Girin</h1>
                <p className="text-gray-400 text-sm">
                  <span className="text-white font-medium">{phone}</span> numarasına gönderilen 6 haneli kodu ve yeni şifrenizi girin.
                </p>
              </div>

              <div className="space-y-4">
                {/* OTP */}
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5">Doğrulama Kodu</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600 text-xs">
                      {otpCountdown > 0 ? `Yeni kod için ${formatCountdown(otpCountdown)} bekleyin` : ''}
                    </span>
                    <button
                      onClick={handleResendOtp}
                      disabled={otpCountdown > 0 || loading}
                      className="text-primary-400 hover:text-primary-300 disabled:text-gray-600 disabled:cursor-not-allowed text-xs font-medium transition-colors"
                    >
                      Tekrar Gönder
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5">Yeni Şifre</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="En az 6 karakter"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5">Şifre Tekrar</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Şifrenizi tekrar girin"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">Şifreler eşleşmiyor</p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-800 text-red-400 rounded-xl px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleReset}
                  disabled={loading || otp.length !== 6 || !newPassword || !confirmPassword}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Güncelleniyor...</>
                  ) : (
                    'Şifremi Güncelle'
                  )}
                </button>

                <button
                  onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                  className="w-full text-gray-500 hover:text-gray-300 py-2 text-sm transition-colors"
                >
                  Telefon numarasını değiştir
                </button>
              </div>
            </>
          )}

          {/* Step: success */}
          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-3">Şifre Güncellendi!</h1>
              <p className="text-gray-400 text-sm mb-8">
                Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.
              </p>
              <Link
                href="/giris"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
              >
                Giriş Yap
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
