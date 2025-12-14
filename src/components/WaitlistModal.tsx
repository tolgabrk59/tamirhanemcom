'use client';

import { useState, useEffect } from 'react';

export default function WaitlistModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        const hasSeenWaitlist = localStorage.getItem('hasSeenWaitlist');

        if (!hasSeenWaitlist) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('hasSeenWaitlist', 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    phone: formData.phone
                }),
            });

            if (response.ok) {
                setSubmitStatus('success');
                localStorage.setItem('hasSeenWaitlist', 'true');
                setTimeout(() => {
                    setIsOpen(false);
                }, 3000);
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Waitlist error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
                {/* Blurred Background - Shows website behind */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>

                {/* Modal Container */}
                <div className="relative max-w-5xl w-full animate-scaleIn">
                    <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Left Side - Branding - Hidden on mobile */}
                            <div className="hidden md:block relative p-12 flex-col justify-center bg-gradient-to-br from-primary-600/90 to-primary-700/90 backdrop-blur-xl">
                                {/* Decorative Elements */}
                                <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>

                                <div className="relative z-10 flex flex-col justify-center h-full">
                                    {/* Logo/Icon */}
                                    <div className="mb-8">
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-6 animate-bounce-slow">
                                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                            Erken Erişim<br />
                                            <span className="text-primary-200">Listesine Katılın</span>
                                        </h2>
                                        <p className="text-lg text-white/90 leading-relaxed">
                                            TamirHanem platformu yakında yayında! İlk kullananlardan olun ve özel avantajlardan yararlanın.
                                        </p>
                                    </div>

                                    {/* Benefits */}
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 group">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-white font-semibold mb-1">Beta Kullanıcı Avantajı</h4>
                                                <p className="text-white/70 text-sm">İlk servis deneyimine ek %30'a varan indirim</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 group">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-white font-semibold mb-1">Puan Topla, Kazan</h4>
                                                <p className="text-white/70 text-sm">İç-dış yıkama puan topla, yıkama hakkı kazan</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 group">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-white font-semibold mb-1">Ücretsiz Danışma</h4>
                                                <p className="text-white/70 text-sm">Uzman mekaniklerden ücretsiz tavsiye</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* App Store Badges */}
                                    <div className="mt-8 pt-8 border-t border-white/20">
                                        <h4 className="text-white font-semibold mb-4 text-center text-sm">Yakında</h4>
                                        <div className="flex items-center justify-center gap-3">
                                            {/* Google Play */}
                                            <a href="#" className="transition-all transform hover:scale-105">
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                                    alt="Google Play'den İndir"
                                                    className="h-10 w-auto"
                                                />
                                            </a>

                                            {/* App Store */}
                                            <a href="#" className="transition-all transform hover:scale-105">
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                                    alt="App Store'dan İndir"
                                                    className="h-10 w-auto"
                                                />
                                            </a>

                                            {/* AppGallery */}
                                            <a href="#" className="transition-all transform hover:scale-105">
                                                <img
                                                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTM1IiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTM1IDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTM1IiBoZWlnaHQ9IjQwIiByeD0iNSIgZmlsbD0iYmxhY2siLz4KPHRleHQgeD0iNDUiIHk9IjE1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNyI+RVhQTE9SRSBJVCBPTjwvdGV4dD4KPHRleHQgeD0iNDUiIHk9IjI4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSI+QXBwR2FsbGVyeTwvdGV4dD4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTIiIGZpbGw9IiNFRTBBMjQiLz4KPHBhdGggZD0iTTIwIDEyTDIzIDIwTDIwIDI4TDE3IDIwTDIwIDEyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+"
                                                    alt="AppGallery'den İndir"
                                                    className="h-10 w-auto"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div className="relative p-6 md:p-12 bg-white/95 backdrop-blur-xl">
                                {/* Close Button */}
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-secondary-100 hover:bg-secondary-200 text-secondary-600 hover:text-secondary-900 transition-all hover:rotate-90 duration-300 shadow-sm hover:shadow-md"
                                    aria-label="Kapat"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {submitStatus === 'success' ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-scaleIn">
                                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-3xl font-bold text-secondary-900 mb-3">Harika!</h3>
                                        <p className="text-lg text-secondary-600 mb-2">Kaydınız başarıyla alındı</p>
                                        <p className="text-sm text-secondary-500">Yakında sizinle iletişime geçeceğiz</p>

                                        {/* Confetti Effect */}
                                        <div className="mt-8 flex gap-2">
                                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-ping"></div>
                                            <div className="w-2 h-2 bg-secondary-500 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="mb-6 md:mb-8">
                                            <h3 className="text-xl md:text-2xl font-bold text-secondary-900 mb-2">Hemen Kaydolun</h3>
                                            <p className="text-sm md:text-base text-secondary-600">Birkaç saniyede tamamlayın, avantajlardan yararlanın</p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                                            {/* Name Field */}
                                            <div className="group">
                                                <label htmlFor="name" className="block text-sm font-semibold text-secondary-700 mb-2">
                                                    Ad Soyad
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <svg className="w-5 h-5 text-secondary-400 group-focus-within:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-3.5 bg-secondary-50 border-2 border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all text-secondary-900 placeholder-secondary-400"
                                                        placeholder="Adınız ve soyadınız"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Email Field */}
                                            <div className="group">
                                                <label htmlFor="email" className="block text-sm font-semibold text-secondary-700 mb-2">
                                                    E-posta Adresi
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <svg className="w-5 h-5 text-secondary-400 group-focus-within:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-3.5 bg-secondary-50 border-2 border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all text-secondary-900 placeholder-secondary-400"
                                                        placeholder="ornek@email.com"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Phone Field */}
                                            <div className="group">
                                                <label htmlFor="phone" className="block text-sm font-semibold text-secondary-700 mb-2">
                                                    Telefon <span className="text-secondary-400 font-normal">(Opsiyonel)</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <svg className="w-5 h-5 text-secondary-400 group-focus-within:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        id="phone"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-3.5 bg-secondary-50 border-2 border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all text-secondary-900 placeholder-secondary-400"
                                                        placeholder="5XX XXX XX XX"
                                                    />
                                                </div>
                                            </div>

                                            {/* Error Message */}
                                            {submitStatus === 'error' && (
                                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake">
                                                    <div className="flex items-center gap-3">
                                                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                        </svg>
                                                        <p className="text-sm text-red-700 font-medium">Bir hata oluştu. Lütfen tekrar deneyin.</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold py-4 px-6 rounded-xl transition-all duration-500 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                {isSubmitting ? (
                                                    <span className="flex items-center justify-center gap-3">
                                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        Kaydediliyor...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center justify-center gap-2">
                                                        Erken Erişim Listesine Katıl
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </button>

                                            {/* Privacy Note */}
                                            <p className="text-xs text-center text-secondary-500">
                                                Kaydolarak <a href="#" className="text-primary-600 hover:underline">Gizlilik Politikası</a> ve <a href="#" className="text-primary-600 hover:underline">Kullanım Koşulları</a>'nı kabul etmiş olursunuz
                                            </p>

                                            {/* Skip Link */}
                                            <button
                                                type="button"
                                                onClick={handleClose}
                                                className="w-full text-secondary-500 hover:text-secondary-700 text-sm font-medium transition-colors py-2"
                                            >
                                                Şimdi değil, daha sonra hatırlat
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(30px, -30px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-30px, 30px); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .animate-float {
                    animation: float 20s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 25s ease-in-out infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                .bg-size-200 {
                    background-size: 200% 100%;
                }
                .bg-pos-0 {
                    background-position: 0% 0%;
                }
                .bg-pos-100 {
                    background-position: 100% 0%;
                }
            `}</style>
        </>
    );
}
