'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Phone, Lock, Wrench } from 'lucide-react';

export default function GirisPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password }),
            });
            const result = await response.json();

            if (result.success) {
                localStorage.setItem('tamirhanem_jwt', result.jwt);
                localStorage.setItem('tamirhanem_user', JSON.stringify(result.user));
                router.push('/profil');
            } else {
                setError(result.error || 'Giriş başarısız. Bilgilerinizi kontrol edin.');
            }
        } catch {
            setError('Bağlantı hatası. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Google OAuth akışı — henüz aktif değil
        setError('Google ile giriş yakında aktif olacak.');
    };

    return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo / Başlık */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-glow">
                        <Wrench className="w-8 h-8 text-secondary-900" />
                    </div>
                    <h1 className="text-3xl font-bold text-secondary-900">TamirHanem</h1>
                    <p className="text-secondary-500 mt-1">Hesabınıza giriş yapın</p>
                </div>

                {/* Kart */}
                <div className="bg-white rounded-2xl shadow-card p-8">
                    {/* Google ile Giriş */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 border border-secondary-200 rounded-xl py-3 px-4 text-secondary-700 font-medium hover:bg-secondary-50 transition-colors mb-6"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google ile Giriş Yap
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-secondary-200" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-3 bg-white text-secondary-400 text-sm">veya</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                                Telefon / E-posta / Kullanıcı Adı
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                                <input
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="05XX XXX XX XX veya e-posta"
                                    required
                                    autoComplete="username"
                                    className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                                Şifre
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Şifrenizi girin"
                                    required
                                    autoComplete="current-password"
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

                        <div className="flex justify-end">
                            <Link
                                href="/auth/sifremi-unuttum"
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                            >
                                Şifremi Unuttum
                            </Link>
                        </div>

                        {error && (
                            <div className="p-3 bg-error-50 border border-error-200 text-error-700 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !identifier || !password}
                            className="w-full bg-primary-500 text-secondary-900 py-3 rounded-xl font-semibold text-base hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-glow"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-secondary-900/30 border-t-secondary-900 rounded-full animate-spin" />
                                    Giriş yapılıyor...
                                </>
                            ) : (
                                'Giriş Yap'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-secondary-500 mt-6">
                        Hesabınız yok mu?{' '}
                        <Link href="/kayit" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                            Ücretsiz Kayıt Ol
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
