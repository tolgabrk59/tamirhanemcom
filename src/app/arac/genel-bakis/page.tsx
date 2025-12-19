'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { vehicleYears } from '@/data/vehicles';

interface Brand {
    brand: string;
}

interface Model {
    model: string;
}

interface Package {
    id: number;
    paket: string;
    full_model: string;
}

interface ValidationResult {
    valid: boolean;
    production_years: { start: number; end: number } | null;
    message: string | null;
}

export default function VehicleOverviewPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [packages, setPackages] = useState<Package[]>([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedPackage, setSelectedPackage] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    
    // Validation states
    const [isValidating, setIsValidating] = useState(false);
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

    // Fetch Brands (otomobil only)
    useEffect(() => {
        async function fetchBrands() {
            try {
                const res = await fetch('/api/brands?vehicleType=otomobil');
                if (res.ok) {
                    const result = await res.json();
                    // API returns { success: true, data: [...] }
                    setBrands(result.data || []);
                }
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        }
        fetchBrands();
    }, []);

    // Fetch Models when Brand changes (otomobil only)
    useEffect(() => {
        async function fetchModels() {
            if (!selectedBrand) {
                setModels([]);
                return;
            }
            try {
                const res = await fetch(`/api/models?brand=${encodeURIComponent(selectedBrand)}&vehicleType=otomobil`);
                if (res.ok) {
                    const result = await res.json();
                    // API returns { success: true, data: [...] }
                    setModels(result.data || []);
                }
            } catch (error) {
                console.error('Error fetching models:', error);
            }
        }
        fetchModels();
    }, [selectedBrand]);

    // Fetch Packages when Model changes
    useEffect(() => {
        async function fetchPackages() {
            if (!selectedBrand || !selectedModel) {
                setPackages([]);
                return;
            }
            try {
                const res = await fetch(`/api/packages?brand=${encodeURIComponent(selectedBrand)}&model=${encodeURIComponent(selectedModel)}`);
                if (res.ok) {
                    const result = await res.json();
                    // API returns { success: true, data: [...] }
                    setPackages(result.data || []);
                }
            } catch (error) {
                console.error('Error fetching packages:', error);
            }
        }
        fetchPackages();
    }, [selectedBrand, selectedModel]);

    // Validate year/model combination
    useEffect(() => {
        async function validateVehicle() {
            if (!selectedBrand || !selectedModel || !selectedYear) {
                setValidationResult(null);
                return;
            }

            setIsValidating(true);
            try {
                const modelToValidate = selectedPackage || selectedModel;
                const res = await fetch('/api/ai/validate-vehicle', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        brand: selectedBrand,
                        model: modelToValidate,
                        year: selectedYear
                    })
                });

                if (res.ok) {
                    const result = await res.json();
                    setValidationResult(result);
                }
            } catch (error) {
                console.error('Validation error:', error);
                setValidationResult(null);
            } finally {
                setIsValidating(false);
            }
        }

        // Debounce validation
        const timer = setTimeout(validateVehicle, 500);
        return () => clearTimeout(timer);
    }, [selectedBrand, selectedModel, selectedPackage, selectedYear]);

    const popularBrands = [
        { name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg' },
        { name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg' },
        { name: 'Ford', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg' },
        { name: 'Volkswagen', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg' },
        { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' },
        { name: 'Mercedes', logo: 'https://cdn.worldvectorlogo.com/logos/mercedes-benz-9.svg' },
        { name: 'Audi', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg' },
        { name: 'Hyundai', logo: 'https://cdn.worldvectorlogo.com/logos/hyundai-motor-company-2.svg' },
        { name: 'Renault', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Renault_2009_logo.svg' },
        { name: 'Fiat', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Fiat_Automobiles_logo.svg' },
    ];

    const infoCards = [
        {
            title: 'Kronik Sorunlar',
            desc: 'Her aracın kendine has problemleri vardır. Aracınızın sık karşılaşılan arızalarını öğrenin.',
            icon: '⚠️',
            link: '/kronik-sorunlar'
        },
        {
            title: 'Bakım Maliyetleri',
            desc: 'Yıllık ortalama bakım masrafları ve parça fiyatları hakkında bilgi edinin.',
            icon: '💰',
            link: '/fiyat-hesapla'
        },
        {
            title: 'Geri Çağırmalar',
            desc: 'Güvenliğiniz için üretici tarafından yayınlanan geri çağırma bildirimlerini kontrol edin.',
            icon: '🚨',
            link: '/geri-cagrima'
        },
        {
            title: 'Kullanıcı Yorumları',
            desc: 'Diğer araç sahiplerinin deneyimlerini ve tavsiyelerini okuyun.',
            icon: '💬',
            link: '/incelemeler'
        }
    ];

    return (
        <div className="bg-secondary-50 min-h-screen">
            {/* Hero Section */}
            <section className="bg-white border-b border-secondary-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center">

                        {/* Left Content */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
                                Aracınızı Tanıyın.
                                <span className="block text-primary-600">Her Detayını Öğrenin.</span>
                            </h1>
                            <p className="text-xl text-secondary-500 mb-8 leading-relaxed">
                                Sahip olduğunuz veya almayı düşündüğünüz araç hakkında bilmeniz gereken her şey burada. Güvenilirlik, sorunlar ve bakım ipuçları.
                            </p>

                            {/* Search Box Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-secondary-100">
                                <div className="grid grid-cols-1 gap-4">
                                    <select
                                        className="w-full p-4 bg-secondary-50 border border-secondary-200 rounded-xl text-secondary-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        value={selectedBrand}
                                        onChange={(e) => {
                                            setSelectedBrand(e.target.value);
                                            setSelectedModel('');
                                            setSelectedPackage('');
                                        }}
                                    >
                                        <option value="">Marka Seçin</option>
                                        {brands.map((brand) => (
                                            <option key={brand.brand} value={brand.brand}>{brand.brand}</option>
                                        ))}
                                    </select>

                                    <div className="grid grid-cols-2 gap-4">
                                        <select
                                            className="w-full p-4 bg-secondary-50 border border-secondary-200 rounded-xl text-secondary-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all disabled:opacity-50"
                                            value={selectedModel}
                                            onChange={(e) => {
                                                setSelectedModel(e.target.value);
                                                setSelectedPackage('');
                                            }}
                                            disabled={!selectedBrand}
                                        >
                                            <option value="">Model Seçin</option>
                                            {models.map((model) => (
                                                <option key={model.model} value={model.model}>{model.model}</option>
                                            ))}
                                        </select>

                                        <select
                                            className="w-full p-4 bg-secondary-50 border border-secondary-200 rounded-xl text-secondary-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all disabled:opacity-50"
                                            value={selectedPackage}
                                            onChange={(e) => setSelectedPackage(e.target.value)}
                                            disabled={!selectedModel || packages.length === 0}
                                        >
                                            <option value="">Paket Seçin</option>
                                            {packages.map((pkg) => (
                                                <option key={pkg.id} value={pkg.full_model}>{pkg.paket || pkg.full_model}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <select
                                        className="w-full p-4 bg-secondary-50 border border-secondary-200 rounded-xl text-secondary-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    >
                                        <option value="">Yıl Seçin</option>
                                        {vehicleYears.map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>

                                    {/* Validation Warning Banner */}
                                    {isValidating && (
                                        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-sm text-blue-700">Araç bilgisi doğrulanıyor...</span>
                                        </div>
                                    )}

                                    {validationResult && !validationResult.valid && !isValidating && (
                                        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-amber-800 mb-1">Geçersiz Yıl/Model Kombinasyonu</h4>
                                                    <p className="text-sm text-amber-700">
                                                        {validationResult.message || `${selectedBrand} ${selectedModel} modeli ${selectedYear} yılında üretilmemiştir.`}
                                                    </p>
                                                    {validationResult.production_years && (
                                                        <p className="text-sm text-amber-600 mt-1 font-medium">
                                                            Bu model {validationResult.production_years.start} - {validationResult.production_years.end} yılları arasında üretilmiştir.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {validationResult && validationResult.valid && !isValidating && (
                                        <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-sm text-green-700">
                                                    ✓ Geçerli araç kombinasyonu
                                                    {validationResult.production_years && (
                                                        <span className="text-green-600 ml-1">
                                                            ({validationResult.production_years.start} - {validationResult.production_years.end} üretim)
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <Link
                                        href={selectedBrand && selectedModel && selectedYear && (!validationResult || validationResult.valid)
                                            ? `/arac/analiz?brand=${encodeURIComponent(selectedBrand)}&model=${encodeURIComponent(selectedPackage || selectedModel)}&year=${encodeURIComponent(selectedYear)}`
                                            : '#'}
                                        onClick={(e) => {
                                            if (!selectedBrand || !selectedModel || !selectedYear || (validationResult && !validationResult.valid)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        className={`w-full py-4 rounded-xl font-bold text-center transition-all ${
                                            selectedBrand && selectedModel && selectedYear && (!validationResult || validationResult.valid) && !isValidating
                                                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                                                : 'bg-secondary-200 text-secondary-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {isValidating ? 'Doğrulanıyor...' : 'Aracı İncele'}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right Image/Illustration */}
                        <div className="hidden md:block relative">
                            <div className="absolute -inset-4 bg-primary-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                            <img
                                src="/images/car-analysis-hero.png"
                                alt="Car Analysis"
                                className="relative rounded-2xl shadow-2xl transform rotate-2 hover:-rotate-1 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Brands Grid */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-secondary-900 mb-10 text-center">Popüler Markalar</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {popularBrands.map((brand) => (
                            <Link
                                key={brand.name}
                                href={`/arac/${brand.name.toLowerCase()}`}
                                className="flex flex-col items-center justify-center p-6 bg-white border border-secondary-100 rounded-xl hover:shadow-lg hover:border-primary-300 transition-all group"
                            >
                                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <span className="font-semibold text-secondary-900 group-hover:text-primary-700">{brand.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Info Cards */}
            <section className="py-16 bg-secondary-50 border-t border-secondary-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-secondary-900 mb-4">Neden Araştırmalısınız?</h2>
                        <p className="text-secondary-600 max-w-2xl mx-auto">
                            Bilinçli bir araç sahibi olmak, sürpriz masraflardan kaçınmanın en iyi yoludur.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {infoCards.map((card, idx) => (
                            <Link
                                key={idx}
                                href={card.link}
                                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all group border-b-4 border-transparent hover:border-primary-500"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
                                <h3 className="text-xl font-bold text-secondary-900 mb-2">{card.title}</h3>
                                <p className="text-secondary-500 text-sm">{card.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
