'use client';

import { useState, useEffect } from 'react';
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

export default function VehicleOverviewPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [packages, setPackages] = useState<Package[]>([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedPackage, setSelectedPackage] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

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

                                    <Link
                                        href={selectedBrand && selectedModel && selectedYear 
                                            ? `/arac/analiz?brand=${encodeURIComponent(selectedBrand)}&model=${encodeURIComponent(selectedPackage || selectedModel)}&year=${encodeURIComponent(selectedYear)}`
                                            : '#'}
                                        onClick={(e) => {
                                            if (!selectedBrand || !selectedModel || !selectedYear) {
                                                e.preventDefault();
                                            }
                                        }}
                                        className={`w-full py-4 rounded-xl font-bold text-center transition-all ${selectedBrand && selectedModel && selectedYear
                                            ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                                            : 'bg-secondary-200 text-secondary-400 cursor-not-allowed'
                                            }`}
                                    >
                                        Aracı İncele
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
