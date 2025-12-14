'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { vehicleYears } from '@/data/vehicles';
import { turkeyLocations, cityList } from '@/data/turkey-locations';

// Yakıt tipleri
const fuelTypes = ['Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik', 'Benzin + LPG'];

// Interface tanımları
interface Category {
    id: number;
    name: string;
}

interface Brand {
    brand: string;
}

interface Model {
    model: string;
}

export default function RandevuAlPage() {
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [category, setCategory] = useState('');

    // Data states
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);

    // Loading states
    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [brandsLoading, setBrandsLoading] = useState(true);
    const [modelsLoading, setModelsLoading] = useState(false);

    // Kategorileri MySQL'den çek
    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCategories(data.data);
                }
                setCategoriesLoading(false);
            })
            .catch(err => {
                console.error('Kategori yükleme hatası:', err);
                setCategoriesLoading(false);
            });
    }, []);

    // Markaları MySQL'den çek
    useEffect(() => {
        fetch('/api/brands')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setBrands(data.data);
                }
                setBrandsLoading(false);
            })
            .catch(err => {
                console.error('Marka yükleme hatası:', err);
                setBrandsLoading(false);
            });
    }, []);

    // Modelleri markaya göre MySQL'den çek
    useEffect(() => {
        if (brand) {
            setModelsLoading(true);
            setModel(''); // Reset model when brand changes
            fetch(`/api/models?brand=${encodeURIComponent(brand)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setModels(data.data);
                    }
                    setModelsLoading(false);
                })
                .catch(err => {
                    console.error('Model yükleme hatası:', err);
                    setModelsLoading(false);
                });
        } else {
            setModels([]);
        }
    }, [brand]);

    const districts = city ? turkeyLocations[city] || [] : [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // TODO: Form gönderim işlemi
        console.log({ city, district, brand, model, year, fuelType, category });
        setTimeout(() => {
            setLoading(false);
            alert('Randevu talebiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.');
        }, 1500);
    };

    const isFormValid = city && district && brand && model && year && fuelType && category;

    return (
        <div className="min-h-screen">
            {/* Hero Section - Full Screen with Form */}
            <section className="min-h-[calc(100vh-64px)] bg-white relative overflow-hidden flex items-center">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
                    style={{ backgroundImage: 'url(/hero-bg.png)' }}
                />

                <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Sol - Başlık ve Bilgi */}
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
                                Servis Randevusu
                                <br />
                                <span className="text-primary-600">Hemen Al</span>
                            </h1>
                            <p className="text-xl text-secondary-600 mb-8 max-w-xl">
                                Aracınız için en uygun servisi bulun ve hemen randevu alın.
                                Şeffaf fiyatlandırma, kaliteli hizmet garantisi.
                            </p>

                            {/* Trust Badges */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
                                <div className="flex items-center gap-2 text-secondary-700">
                                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Şeffaf Fiyatlandırma</span>
                                </div>
                                <div className="flex items-center gap-2 text-secondary-700">
                                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Onaylı Servisler</span>
                                </div>
                                <div className="flex items-center gap-2 text-secondary-700">
                                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Garanti Güvencesi</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                                <div className="text-center lg:text-left">
                                    <p className="text-2xl md:text-3xl font-bold text-primary-600">500+</p>
                                    <p className="text-secondary-500 text-sm">Servis</p>
                                </div>
                                <div className="text-center lg:text-left">
                                    <p className="text-2xl md:text-3xl font-bold text-primary-600">50K+</p>
                                    <p className="text-secondary-500 text-sm">Müşteri</p>
                                </div>
                                <div className="text-center lg:text-left">
                                    <p className="text-2xl md:text-3xl font-bold text-primary-600">4.8</p>
                                    <p className="text-secondary-500 text-sm">Puan</p>
                                </div>
                            </div>
                        </div>

                        {/* Sağ - Form */}
                        <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl shadow-2xl p-8 md:p-10">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Araç Bilgilerinizi Girin
                                </h2>
                                <p className="text-primary-100">
                                    Size en yakın servisleri bulalım
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Konum Seçimi */}
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={city}
                                        onChange={(e) => {
                                            setCity(e.target.value);
                                            setDistrict('');
                                        }}
                                        className="w-full px-4 py-3 border-0 rounded-xl bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white"
                                    >
                                        <option value="">Şehir</option>
                                        {cityList.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                        disabled={!city}
                                        className="w-full px-4 py-3 border-0 rounded-xl bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white disabled:bg-white/50"
                                    >
                                        <option value="">İlçe</option>
                                        {districts.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Marka & Model */}
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="w-full px-4 py-3 border-0 rounded-xl bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white"
                                    >
                                        <option value="">Marka</option>
                                        {brandsLoading ? (
                                            <option disabled>Yükleniyor...</option>
                                        ) : (
                                            brands.map((b) => (
                                                <option key={b.brand} value={b.brand}>{b.brand}</option>
                                            ))
                                        )}
                                    </select>

                                    <select
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        disabled={!brand}
                                        className="w-full px-4 py-3 border-0 rounded-xl bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white disabled:bg-white/50"
                                    >
                                        <option value="">Model</option>
                                        {modelsLoading ? (
                                            <option disabled>Yükleniyor...</option>
                                        ) : (
                                            models.map((m) => (
                                                <option key={m.model} value={m.model}>{m.model}</option>
                                            ))
                                        )}
                                    </select>
                                </div>

                                {/* Yıl & Yakıt */}
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full px-4 py-3 border-0 rounded-xl bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white"
                                    >
                                        <option value="">Model Yılı</option>
                                        {vehicleYears.map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={fuelType}
                                        onChange={(e) => setFuelType(e.target.value)}
                                        className="w-full px-4 py-3 border-0 rounded-xl bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white"
                                    >
                                        <option value="">Yakıt Tipi</option>
                                        {fuelTypes.map((f) => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Kategori */}
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-3 border-0 rounded-xl bg-white/90 text-secondary-900 focus:ring-2 focus:ring-white"
                                >
                                    <option value="">Hizmet Kategorisi</option>
                                    {categoriesLoading ? (
                                        <option disabled>Yükleniyor...</option>
                                    ) : (
                                        categories.map((cat) => (
                                            <option key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))
                                    )}
                                </select>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={!isFormValid || loading}
                                    className="w-full bg-secondary-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-secondary-800 transition-colors disabled:bg-secondary-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Servisler Aranıyor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <span>Uygun Servisleri Bul</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-secondary-900 text-center mb-12">
                        Neden TamirHanem?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                                Şeffaf Fiyatlandırma
                            </h3>
                            <p className="text-secondary-600">
                                Tüm fiyatları önceden görün, sürpriz masraflarla karşılaşmayın.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                                Onaylı Servisler
                            </h3>
                            <p className="text-secondary-600">
                                Tüm servislerimiz kontrol edilmiş ve onaylanmıştır.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                                Hızlı Randevu
                            </h3>
                            <p className="text-secondary-600">
                                Dakikalar içinde randevu alın, zaman kaybetmeyin.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-secondary-900 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Hemen Başlayın
                    </h2>
                    <p className="text-secondary-300 text-lg mb-8">
                        Aracınız için en uygun servisi bulun ve randevunuzu alın.
                    </p>
                    <Link
                        href="#"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        Yukarıdan Başla
                    </Link>
                </div>
            </section>
        </div>
    );
}
