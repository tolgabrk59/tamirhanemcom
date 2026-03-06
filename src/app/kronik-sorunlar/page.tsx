'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Brand {
    brand: string;
}

interface Model {
    model: string;
}

interface ChronicProblem {
    id: number;
    brand: string;
    model: string;
    year_start?: number;
    year_end?: number;
    title: string;
    component?: string;
    risk_level?: string;
    estimated_cost_band?: string;
    complaint_count?: number;
    crash_count?: number;
    injury_count?: number;
    death_count?: number;
    fire_count?: number;
    recall_count?: number;
    sample_complaints?: string;
}

export default function ChronicProblemsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [brands, setBrands] = useState<Brand[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [searchResults, setSearchResults] = useState<ChronicProblem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Fetch Brands
    useEffect(() => {
        async function fetchBrands() {
            try {
                const res = await fetch('/api/brands?vehicleType=otomobil');
                if (res.ok) {
                    const result = await res.json();
                    setBrands(result.data || []);
                }
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        }
        fetchBrands();
    }, []);

    // Fetch Models when Brand changes
    useEffect(() => {
        async function fetchModels() {
            if (!selectedBrand) {
                setModels([]);
                return;
            }
            try {
                const res = await fetch(`/api/models?brand=${encodeURIComponent(selectedBrand)}`);
                if (res.ok) {
                    const result = await res.json();
                    setModels(result.data || []);
                }
            } catch (error) {
                console.error('Error fetching models:', error);
            }
        }
        fetchModels();
    }, [selectedBrand]);

    // Handle search
    const handleSearch = async () => {
        setIsSearching(true);
        setHasSearched(true);
        try {
            const params = new URLSearchParams();
            if (selectedBrand) params.append('brand', selectedBrand);
            if (selectedModel) params.append('model', selectedModel);
            if (selectedYear) params.append('year', selectedYear);
            if (searchQuery.trim()) params.append('problem', searchQuery);

            const res = await fetch(`/api/kronik-sorunlar?${params.toString()}`);
            if (res.ok) {
                const result = await res.json();
                setSearchResults(result.data || []);
            }
        } catch (error) {
            console.error('Error searching problems:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const popularBrands = [
        { name: 'Toyota', problems: 145, logo: 'https://cdn.worldvectorlogo.com/logos/toyota-1.svg' },
        { name: 'Honda', problems: 132, logo: 'https://cdn.worldvectorlogo.com/logos/honda-2.svg' },
        { name: 'Ford', problems: 128, logo: 'https://cdn.worldvectorlogo.com/logos/ford-6.svg' },
        { name: 'Volkswagen', problems: 119, logo: 'https://cdn.worldvectorlogo.com/logos/volkswagen-1.svg' },
        { name: 'BMW', problems: 98, logo: 'https://cdn.worldvectorlogo.com/logos/bmw-2.svg' },
        { name: 'Mercedes', problems: 87, logo: 'https://cdn.worldvectorlogo.com/logos/mercedes-benz-9.svg' },
        { name: 'Renault', problems: 156, logo: 'https://cdn.worldvectorlogo.com/logos/renault-2.svg' },
        { name: 'Fiat', problems: 143, logo: 'https://cdn.worldvectorlogo.com/logos/fiat-2.svg' }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <Image
                        src="/images/chronic-problems-hero.png"
                        alt="Kronik Sorunlar"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Araç Sorunları ve Şikayetleri
                        </h1>
                        <p className="text-xl text-primary-100 mb-6">
                            Araç sahiplerinin şikayetlerine dayalı en yaygın sorunları bulun. Binlerce kullanıcı deneyiminden faydalanın, bilinçli kararlar alın.
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>15,000+ Şikayet</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Gerçek Kullanıcı Verileri</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Tahmini Maliyet</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2">
                        {/* Page Title */}
                        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#454545' }}>
                            Araç Sorunları ve Şikayetleri
                        </h1>

                        <p className="text-lg text-secondary-600 mb-6">
                            Araç sahiplerinin şikayetlerine dayalı en yaygın sorunları bulun
                        </p>

                        {/* Find common problems affecting your car */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-3" style={{ color: '#454545' }}>
                                Aracınızı etkileyen yaygın sorunları bulun
                            </h2>
                            <p className="text-secondary-600 mb-4">
                                Aracınızı etkileyen sorunları kontrol etmek için aşağıdan marka ve modelinizi seçin:
                            </p>

                            {/* Search Form */}
                            <div className="bg-white border border-secondary-200 rounded-lg p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <select
                                        className="w-full px-4 py-3 bg-white border border-secondary-300 rounded text-secondary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                        value={selectedBrand}
                                        onChange={(e) => {
                                            setSelectedBrand(e.target.value);
                                            setSelectedModel('');
                                        }}
                                    >
                                        <option value="">Marka</option>
                                        {brands.map((brand) => (
                                            <option key={brand.brand} value={brand.brand}>{brand.brand}</option>
                                        ))}
                                    </select>

                                    <select
                                        className="w-full px-4 py-3 bg-white border border-secondary-300 rounded text-secondary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none disabled:opacity-50"
                                        value={selectedModel}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                        disabled={!selectedBrand}
                                    >
                                        <option value="">Model</option>
                                        {models.map((model) => (
                                            <option key={model.model} value={model.model}>{model.model}</option>
                                        ))}
                                    </select>

                                    <select
                                        className="w-full px-4 py-3 bg-white border border-secondary-300 rounded text-secondary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    >
                                        <option value="">Yıl</option>
                                        {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                    className="w-full px-6 py-3 bg-primary-600 text-white font-bold rounded hover:bg-primary-700 transition-colors disabled:opacity-50"
                                >
                                    {isSearching ? 'Aranıyor...' : 'Gönder'}
                                </button>
                            </div>
                        </div>

                        {/* Looking for a particular problem */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-3" style={{ color: '#454545' }}>
                                Belirli bir sorun mu arıyorsunuz?
                            </h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Araç sorununuz nedir?"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="flex-1 px-4 py-3 bg-white border border-secondary-300 rounded text-secondary-900 placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="px-8 py-3 bg-primary-600 text-white font-bold rounded hover:bg-primary-700 transition-colors"
                                >
                                    Ara
                                </button>
                            </div>
                        </div>

                        {/* Search Results */}
                        {hasSearched && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-4" style={{ color: '#454545' }}>Arama Sonuçları</h2>
                                {searchResults.length === 0 ? (
                                    <div className="text-center py-12 bg-secondary-50 rounded-lg">
                                        <p className="text-secondary-600">Sonuç bulunamadı. Lütfen farklı bir arama deneyin.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {searchResults.map((problem) => {
                                            // Parse complaints - handle both JSON array and plain text
                                            let complaints: string[] = [];
                                            if (problem.sample_complaints) {
                                                try {
                                                    // Try parsing as JSON first
                                                    const parsed = JSON.parse(problem.sample_complaints);
                                                    if (Array.isArray(parsed)) {
                                                        complaints = parsed.filter(c => c && c.trim());
                                                    } else if (typeof parsed === 'string') {
                                                        complaints = [parsed];
                                                    }
                                                } catch {
                                                    // If not JSON, treat as plain text
                                                    // Split by newlines or semicolons
                                                    const text = problem.sample_complaints.trim();
                                                    if (text) {
                                                        complaints = text
                                                            .split(/[\n;]/)
                                                            .map(c => c.trim())
                                                            .filter(c => c.length > 0);
                                                    }
                                                }
                                            }

                                            // Risk level renk belirleme
                                            const getRiskColor = (risk?: string) => {
                                                if (!risk) return 'bg-secondary-100 text-secondary-700';
                                                const riskLower = risk.toLowerCase();
                                                if (riskLower.includes('high') || riskLower.includes('yüksek')) return 'bg-red-100 text-red-700';
                                                if (riskLower.includes('medium') || riskLower.includes('orta')) return 'bg-yellow-100 text-yellow-700';
                                                if (riskLower.includes('low') || riskLower.includes('düşük')) return 'bg-green-100 text-green-700';
                                                return 'bg-secondary-100 text-secondary-700';
                                            };

                                            // Araç görseli path oluştur - Akıllı model eşleştirme
                                            const brandFolder = problem.brand.toUpperCase().replace(/\s+/g, '_').replace(/-/g, '');

                                            // Model isminden base model kodunu çıkar
                                            // Örnekler:
                                            // "116D 1.5 (116) PREMIUM LINE" -> "116D"
                                            // "320i xDrive" -> "320i"
                                            // "M 3" -> "M3"
                                            // "X5 3.0iA" -> "X5"

                                            let baseModel = problem.model.trim();

                                            // İlk sayı+harf kombinasyonunu veya M+sayı kombinasyonunu bul
                                            const modelMatch = baseModel.match(/^([MX]?\s*\d+[a-zA-Z]*)/i);
                                            if (modelMatch) {
                                                baseModel = modelMatch[1].replace(/\s+/g, ''); // Boşlukları kaldır
                                            } else {
                                                // Eğer sayı yoksa, ilk kelimeyi al
                                                baseModel = baseModel.split(/[\s\(\.]/)[0];
                                            }

                                            const modelFile = baseModel.toUpperCase();

                                            // Dosya isimleri küçük harf olduğu için lowercase'e çevir
                                            const imagePathJpg = `/aracresimleri/${brandFolder}/${modelFile.toLowerCase()}.jpg`;
                                            const imagePathPng = `/aracresimleri/${brandFolder}/${modelFile.toLowerCase()}.png`;
                                            const fallbackPath = `/aracresimleri/${brandFolder}/default.jpg`;


                                            return (
                                                <div key={problem.id} className="bg-white border-2 border-secondary-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-primary-300 transition-all">
                                                    {/* Header */}
                                                    <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 p-5 border-b-2 border-primary-200">
                                                        <div className="flex items-start gap-4">
                                                            {/* Vehicle Image */}
                                                            <div className="flex-shrink-0 w-32 h-24 bg-white rounded-lg overflow-hidden shadow-md">
                                                                <img
                                                                    src={imagePathJpg}
                                                                    alt={`${problem.brand} ${problem.model}`}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        // Try PNG, then fallback to default
                                                                        if (target.src.endsWith('.jpg')) {
                                                                            target.src = imagePathPng;
                                                                        } else {
                                                                            target.src = fallbackPath;
                                                                        }
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="flex-1">
                                                                <h3 className="text-xl font-bold mb-2" style={{ color: '#454545' }}>
                                                                    {problem.brand} {problem.model}
                                                                </h3>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {/* Kategori Badge */}
                                                                    {(() => {
                                                                        let category = 'Kronik Sorun';
                                                                        let categoryColor = 'bg-primary-100 text-primary-700';

                                                                        if (Number(problem.recall_count) > 0) {
                                                                            category = 'Geri Çağırma';
                                                                            categoryColor = 'bg-purple-100 text-purple-700';
                                                                        } else if (Number(problem.complaint_count) > 0) {
                                                                            category = 'Şikayet';
                                                                            categoryColor = 'bg-orange-100 text-orange-700';
                                                                        }

                                                                        return (
                                                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold shadow-sm ${categoryColor}`}>
                                                                                {category}
                                                                            </span>
                                                                        );
                                                                    })()}

                                                                    {problem.year_start && problem.year_end && (
                                                                        <span className="inline-flex items-center px-3 py-1 bg-white rounded-lg text-sm font-medium text-secondary-700 shadow-sm">
                                                                            {problem.year_start}-{problem.year_end}
                                                                        </span>
                                                                    )}
                                                                    {problem.component && (
                                                                        <span className="inline-flex items-center px-3 py-1 bg-white rounded-lg text-sm font-medium text-secondary-700 shadow-sm">
                                                                            {problem.component}
                                                                        </span>
                                                                    )}
                                                                    {problem.risk_level && (
                                                                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold shadow-sm ${getRiskColor(problem.risk_level)}`}>
                                                                            {problem.risk_level}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-5 space-y-4">
                                                        {/* Problem Title */}
                                                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                                                            <div className="flex items-start gap-2">
                                                                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                </svg>
                                                                <div>
                                                                    <h4 className="font-bold text-red-900 mb-1">Sorun Açıklaması</h4>
                                                                    <p className="text-red-800">{problem.title}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Symptoms/Complaints */}
                                                        {complaints.length > 0 && (
                                                            <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
                                                                <div className="flex items-start gap-2">
                                                                    <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                                                    </svg>
                                                                    <div className="flex-1">
                                                                        <h4 className="font-bold text-blue-900 mb-2">Belirtiler / Şikayetler</h4>
                                                                        <ul className="space-y-1">
                                                                            {complaints.slice(0, 5).map((complaint, idx) => (
                                                                                <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                                                                                    <span className="text-blue-600 mt-1">•</span>
                                                                                    <span>{complaint}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                        {complaints.length > 5 && (
                                                                            <p className="text-xs text-blue-600 mt-2">+{complaints.length - 5} daha fazla şikayet</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Statistics */}
                                                        {((Number(problem.complaint_count) > 0) ||
                                                            (Number(problem.crash_count) > 0) ||
                                                            (Number(problem.injury_count) > 0) ||
                                                            (Number(problem.death_count) > 0) ||
                                                            (Number(problem.fire_count) > 0) ||
                                                            (Number(problem.recall_count) > 0)) && (
                                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                                                    {Number(problem.complaint_count) > 0 && (
                                                                        <div className="bg-white rounded-xl p-4 text-center border border-secondary-200 shadow-sm">
                                                                            <div className="text-2xl font-bold text-primary-600">{problem.complaint_count}</div>
                                                                            <div className="text-xs text-secondary-600 mt-1">Şikayet</div>
                                                                        </div>
                                                                    )}
                                                                    {Number(problem.crash_count) > 0 && (
                                                                        <div className="bg-white rounded-xl p-4 text-center border border-secondary-200 shadow-sm">
                                                                            <div className="text-2xl font-bold text-red-600">{problem.crash_count}</div>
                                                                            <div className="text-xs text-secondary-600 mt-1">Kaza</div>
                                                                        </div>
                                                                    )}
                                                                    {Number(problem.injury_count) > 0 && (
                                                                        <div className="bg-white rounded-xl p-4 text-center border border-secondary-200 shadow-sm">
                                                                            <div className="text-2xl font-bold text-orange-600">{problem.injury_count}</div>
                                                                            <div className="text-xs text-secondary-600 mt-1">Yaralanma</div>
                                                                        </div>
                                                                    )}
                                                                    {Number(problem.death_count) > 0 && (
                                                                        <div className="bg-white rounded-xl p-4 text-center border border-secondary-200 shadow-sm">
                                                                            <div className="text-2xl font-bold text-red-800">{problem.death_count}</div>
                                                                            <div className="text-xs text-secondary-600 mt-1">Ölüm</div>
                                                                        </div>
                                                                    )}
                                                                    {Number(problem.fire_count) > 0 && (
                                                                        <div className="bg-white rounded-xl p-4 text-center border border-secondary-200 shadow-sm">
                                                                            <div className="text-2xl font-bold text-orange-700">{problem.fire_count}</div>
                                                                            <div className="text-xs text-secondary-600 mt-1">Yangın</div>
                                                                        </div>
                                                                    )}
                                                                    {Number(problem.recall_count) > 0 && (
                                                                        <div className="bg-white rounded-xl p-4 text-center border border-secondary-200 shadow-sm">
                                                                            <div className="text-2xl font-bold text-purple-600">{problem.recall_count}</div>
                                                                            <div className="text-xs text-secondary-600 mt-1">Geri Çağırma</div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                        {/* Cost Estimate */}
                                                        {problem.estimated_cost_band && (
                                                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                                                                <div className="flex items-center gap-2">
                                                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                                                    </svg>
                                                                    <div>
                                                                        <span className="font-bold text-green-900">Tahmini Maliyet: </span>
                                                                        <span className="text-green-800">{problem.estimated_cost_band}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Problems by Make */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6" style={{ color: '#454545' }}>
                                Markaya Göre Sorunlar
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {popularBrands.map((brand) => (
                                    <Link
                                        key={brand.name}
                                        href={`/kronik-sorunlar/marka/${brand.name.toLowerCase()}`}
                                        className="group bg-white border border-secondary-200 rounded-lg p-6 hover:shadow-lg transition-all text-center"
                                    >
                                        <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                                            <Image
                                                src={brand.logo}
                                                alt={`${brand.name} Logo`}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <h3 className="font-bold mb-1 group-hover:text-primary-600 transition-colors" style={{ color: '#454545' }}>
                                            {brand.name}
                                        </h3>
                                        <p className="text-sm text-secondary-600">{brand.problems} sorun</p>
                                        <div className="mt-2 text-primary-600 text-sm font-semibold">Tümünü gör →</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-secondary-50 rounded-lg p-6 sticky top-4">
                            {/* Get back on the road */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-4 pb-3 border-b border-secondary-300" style={{ color: '#454545' }}>
                                    Yola Geri Dön
                                </h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href="/servisler" className="text-secondary-700 hover:text-primary-600 transition-colors">
                                            Yakınımda oto tamiri bul
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/ariza-bul" className="text-secondary-700 hover:text-primary-600 transition-colors">
                                            Araç sorununu teşhis et
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/fiyat-hesapla" className="text-secondary-700 hover:text-primary-600 transition-colors">
                                            Ücretsiz tamir tahmini
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/hakkimizda" className="text-secondary-700 hover:text-primary-600 transition-colors">
                                            Araç bakım tavsiyeleri
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Research a car */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-4 pb-3 border-b border-secondary-300" style={{ color: '#454545' }}>
                                    Araç Araştır
                                </h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href="/arac/genel-bakis" className="text-secondary-700 hover:text-primary-600 transition-colors">
                                            Araç genel bakış
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/guvenilirlik" className="text-secondary-700 hover:text-primary-600 transition-colors">
                                            Araç güvenilirlik puanları
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/arac/bakim-tavsiyeleri" className="text-secondary-700 hover:text-primary-600 transition-colors">
                                            Araç bakım programı
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/geri-cagrima" className="text-secondary-700 hover:text-primary-600 transition-colors">
                                            Geri çağırmaları bul
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* More from TamirHanem */}
                            <div>
                                <h3 className="text-lg font-bold mb-4 pb-3 border-b border-secondary-300" style={{ color: '#454545' }}>
                                    TamirHanem'den Daha Fazlası
                                </h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href="/obd" className="text-secondary-700 hover:text-primary-600 transition-colors">
                                            Teşhis OBD-II kodları
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/ariza-rehberi" className="text-secondary-700 hover:text-primary-600 transition-colors">
                                            Gösterge paneli uyarı ışıkları
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
