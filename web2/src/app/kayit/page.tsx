'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, User, Mail, Lock, Eye, EyeOff, AtSign, CheckCircle, Wrench } from 'lucide-react';

type Step = 'phone' | 'otp' | 'details';

export default function KayitPage() {
    const router = useRouter();

    // Adım kontrolü
    const [step, setStep] = useState<Step>('phone');

    // Telefon adımı
    const [phone, setPhone] = useState('');
    const [sendingOtp, setSendingOtp] = useState(false);
    const [otpSendError, setOtpSendError] = useState('');

    // OTP adımı
    const [otpCode, setOtpCode] = useState('');
    const [otpCountdown, setOtpCountdown] = useState(0);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [otpError, setOtpError] = useState('');

    // Detay adımı
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [registerError, setRegisterError] = useState('');

    // Countdown timer
    useEffect(() => {
        if (otpCountdown > 0) {
            const timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpCountdown]);

    const cleanPhone = phone.replace(/[\s\-\+]/g, '').replace(/^90/, '');

    const handleSendOtp = async () => {
        setOtpSendError('');
        setSendingOtp(true);
        try {
            const response = await fetch('/api/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: cleanPhone }),
            });
            const result = await response.json();
            if (result.success) {
                setOtpCountdown(120);
                setStep('otp');
            } else {
                setOtpSendError(result.error || 'SMS gönderilemedi. Lütfen tekrar deneyin.');
            }
        } catch {
            setOtpSendError('Bağlantı hatası. Lütfen tekrar deneyin.');
        } finally {
            setSendingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        setOtpError('');
        setVerifyingOtp(true);
        try {
            const response = await fetch('/api/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: cleanPhone, code: otpCode }),
            });
            const result = await response.json();
            if (result.success) {
                setStep('details');
            } else {
                const remaining = result.remainingAttempts !== undefined
                    ? ` (${result.remainingAttempts} deneme hakkınız kaldı)`
                    : '';
                setOtpError((result.error || 'Doğrulama kodu hatalı.') + remaining);
            }
        } catch {
            setOtpError('Doğrulama başarısız. Lütfen tekrar deneyin.');
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterError('');

        if (password !== confirmPassword) {
            setRegisterError('Şifreler eşleşmiyor.');
            return;
        }
        if (password.length < 6) {
            setRegisterError('Şifre en az 6 karakter olmalı.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setRegisterError('Geçersiz e-posta adresi.');
            return;
        }

        setRegistering(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: cleanPhone,
                    username: username.toLowerCase(),
                    email: email.toLowerCase(),
                    password,
                    name: name || undefined,
                }),
            });
            const result = await response.json();
            if (result.success) {
                localStorage.setItem('tamirhanem_jwt', result.jwt);
                localStorage.setItem('tamirhanem_user', JSON.stringify(result.user));
                router.push('/profil');
            } else {
                setRegisterError(result.error || 'Kayıt başarısız. Lütfen tekrar deneyin.');
            }
        } catch {
            setRegisterError('Bağlantı hatası. Lütfen tekrar deneyin.');
        } finally {
            setRegistering(false);
        }
    };

    const stepLabels: Record<Step, string> = {
        phone: 'Telefon',
        otp: 'Doğrulama',
        details: 'Bilgiler',
    };
    const stepOrder: Step[] = ['phone', 'otp', 'details'];
    const currentStepIndex = stepOrder.indexOf(step);

    return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo / Başlık */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-glow">
                        <Wrench className="w-8 h-8 text-secondary-900" />
                    </div>
                    <h1 className="text-3xl font-bold text-secondary-900">TamirHanem</h1>
                    <p className="text-secondary-500 mt-1">Ücretsiz hesap oluşturun</p>
                </div>

                {/* Adım göstergesi */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {stepOrder.map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                                i < currentStepIndex
                                    ? 'bg-success-500 text-white'
                                    : i === currentStepIndex
                                    ? 'bg-primary-500 text-secondary-900'
                                    : 'bg-secondary-200 text-secondary-500'
                            }`}>
                                {i < currentStepIndex ? <CheckCircle className="w-4 h-4" /> : i + 1}
                            </div>
                            <span className={`text-xs font-medium ${
                                i === currentStepIndex ? 'text-secondary-900' : 'text-secondary-400'
                            }`}>{stepLabels[s]}</span>
                            {i < stepOrder.length - 1 && (
                                <div className={`w-8 h-0.5 ${i < currentStepIndex ? 'bg-success-500' : 'bg-secondary-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Kart */}
                <div className="bg-white rounded-2xl shadow-card p-8">

                    {/* ADIM 1: Telefon */}
                    {step === 'phone' && (
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-bold text-secondary-900 mb-1">Telefon Numaranız</h2>
                                <p className="text-secondary-500 text-sm">Doğrulama kodu SMS ile gönderilecek</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                                    Telefon Numarası
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                                    <input
                                        type="tel"
                                        inputMode="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="05XX XXX XX XX"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {otpSendError && (
                                <div className="p-3 bg-error-50 border border-error-200 text-error-700 rounded-xl text-sm">
                                    {otpSendError}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={sendingOtp || cleanPhone.length < 10}
                                className="w-full bg-primary-500 text-secondary-900 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-glow"
                            >
                                {sendingOtp ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-secondary-900/30 border-t-secondary-900 rounded-full animate-spin" />
                                        SMS Gönderiliyor...
                                    </>
                                ) : (
                                    'Doğrulama Kodu Gönder'
                                )}
                            </button>
                        </div>
                    )}

                    {/* ADIM 2: OTP */}
                    {step === 'otp' && (
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-bold text-secondary-900 mb-1">SMS Doğrulama</h2>
                                <p className="text-secondary-500 text-sm">
                                    <span className="font-medium text-secondary-700">+90{cleanPhone}</span> numarasına gönderilen 6 haneli kodu girin
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                                    Doğrulama Kodu
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                    placeholder="000000"
                                    className="w-full px-4 py-4 border border-secondary-200 rounded-xl text-secondary-900 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {otpCountdown > 0 && (
                                <p className="text-secondary-500 text-sm text-center">
                                    Yeni kod için{' '}
                                    <span className="font-semibold text-secondary-700">{otpCountdown}</span> saniye bekleyin
                                </p>
                            )}

                            {otpError && (
                                <div className="p-3 bg-error-50 border border-error-200 text-error-700 rounded-xl text-sm">
                                    {otpError}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleVerifyOtp}
                                disabled={verifyingOtp || otpCode.length !== 6}
                                className="w-full bg-primary-500 text-secondary-900 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-glow"
                            >
                                {verifyingOtp ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-secondary-900/30 border-t-secondary-900 rounded-full animate-spin" />
                                        Doğrulanıyor...
                                    </>
                                ) : (
                                    'Kodu Doğrula'
                                )}
                            </button>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setStep('phone'); setOtpCode(''); setOtpError(''); }}
                                    className="flex-1 border border-secondary-200 text-secondary-700 py-2.5 rounded-xl font-medium hover:bg-secondary-50 transition-colors text-sm"
                                >
                                    Geri Dön
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={otpCountdown > 0 || sendingOtp}
                                    className="flex-1 border border-secondary-200 text-secondary-700 py-2.5 rounded-xl font-medium hover:bg-secondary-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                                >
                                    Tekrar Gönder
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ADIM 3: Kullanıcı Bilgileri */}
                    {step === 'details' && (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <h2 className="text-xl font-bold text-secondary-900 mb-1">Hesap Bilgileri</h2>
                                <p className="text-secondary-500 text-sm">Profilinizi tamamlayın</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                                    Ad Soyad <span className="text-secondary-400">(opsiyonel)</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Adınız Soyadınız"
                                        autoComplete="name"
                                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                                    E-posta <span className="text-error-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ornek@mail.com"
                                        required
                                        autoComplete="email"
                                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                                    Kullanıcı Adı <span className="text-error-500">*</span>
                                </label>
                                <div className="relative">
                                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                                        placeholder="kullanici_adi"
                                        required
                                        autoComplete="username"
                                        className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                                    Şifre <span className="text-error-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="En az 6 karakter"
                                        required
                                        autoComplete="new-password"
                                        className="w-full pl-10 pr-12 py-3 border border-secondary-200 rounded-xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                                    Şifre Tekrar <span className="text-error-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Şifrenizi tekrar girin"
                                        required
                                        autoComplete="new-password"
                                        className="w-full pl-10 pr-12 py-3 border border-secondary-200 rounded-xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-error-500 text-xs mt-1">Şifreler eşleşmiyor</p>
                                )}
                            </div>

                            {registerError && (
                                <div className="p-3 bg-error-50 border border-error-200 text-error-700 rounded-xl text-sm">
                                    {registerError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={registering || !email || !username || !password || !confirmPassword}
                                className="w-full bg-primary-500 text-secondary-900 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-glow"
                            >
                                {registering ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-secondary-900/30 border-t-secondary-900 rounded-full animate-spin" />
                                        Hesap Oluşturuluyor...
                                    </>
                                ) : (
                                    'Hesap Oluştur'
                                )}
                            </button>
                        </form>
                    )}

                    <p className="text-center text-sm text-secondary-500 mt-6">
                        Zaten hesabınız var mı?{' '}
                        <Link href="/giris" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                            Giriş Yap
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
