'use client';

import Link from 'next/link';
import { reliabilityData } from '@/data/reliability-data';
import { useState } from 'react';

export default function ReliabilityPage() {
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

    const getScoreColor = (score: number) => {
        if (score >= 4.5) return 'text-green-600 bg-green-100 border-green-200';
        if (score >= 4.0) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
        if (score >= 3.5) return 'text-orange-600 bg-orange-100 border-orange-200';
        return 'text-red-600 bg-red-100 border-red-200';
    };

    const getProgressBarColor = (score: number) => {
        if (score >= 4.5) return 'bg-green-500';
        if (score >= 4.0) return 'bg-yellow-500';
        if (score >= 3.5) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-secondary-900 text-white pt-20 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/10 skew-x-12 transform translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-800/50 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-block px-4 py-1 bg-primary-900/50 border border-primary-500/30 rounded-full text-primary-300 text-sm font-medium mb-6 backdrop-blur-sm">
                            ⭐ Gerçek Piyasa Verileri
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            En Güvenilir <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">
                                Otomobil Markaları
                            </span>
                        </h1>
                        <p className="text-xl text-secondary-300 leading-relaxed mb-8">
                            Türkiye şartlarında en az arıza yapan, sanayi dostu ve uzun ömürlü otomobil markalarını analiz ettik.
                            Kullanıcı yorumları ve ustaların tavsiyeleriyle derlendi.
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-secondary-800/50 px-4 py-2 rounded-lg border border-secondary-700">
                                <span className="text-primary-400 text-xl font-bold">{reliabilityData.length}</span>
                                <span className="text-secondary-400 text-sm">Marka Analizi</span>
                            </div>
                            <div className="flex items-center gap-2 bg-secondary-800/50 px-4 py-2 rounded-lg border border-secondary-700">
                                <span className="text-green-400 text-xl font-bold">%100</span>
                                <span className="text-secondary-400 text-sm">Yerel Veri</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">
                
                {/* Ranking List */}
                <div className="space-y-6">
                    {reliabilityData.map((brand, index) => (
                        <div 
                            key={brand.brand}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                    
                                    {/* Brand Info */}
                                    <div className="flex items-start gap-6 flex-1">
                                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center p-2 border border-gray-100 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                            <img src={brand.logo} alt={brand.brand} className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary-900 text-white font-bold text-sm">
                                                    #{index + 1}
                                                </div>
                                                <h2 className="text-2xl font-bold text-gray-900">{brand.brand}</h2>
                                            </div>
                                            <p className="text-gray-600 mb-4 leading-relaxed">
                                                {brand.description}
                                            </p>
                                            
                                            {/* Local Consensus Box */}
                                            <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 flex items-start gap-3">
                                                <span className="text-xl">💬</span>
                                                <div>
                                                    <span className="block text-xs font-bold text-primary-700 uppercase mb-1">TR Piyasa Yorumu</span>
                                                    <p className="text-sm text-gray-800 italic">"{brand.turkishMarketConsensus}"</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Column */}
                                    <div className="md:w-72 flex-shrink-0 bg-gray-50 rounded-xl p-6 border border-gray-100">
                                        <div className="mb-6 text-center">
                                            <span className="block text-sm text-gray-500 mb-1">Güvenilirlik Puanı</span>
                                            <div className={`text-4xl font-bold inline-block px-4 py-1 rounded-xl mb-2 ${getScoreColor(brand.score)} border`}>
                                                {brand.score}
                                                <span className="text-sm text-gray-400 font-normal ml-1">/ 5</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                <div 
                                                    className={`h-2 rounded-full ${getProgressBarColor(brand.score)}`} 
                                                    style={{ width: `${(brand.score / 5) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-xs font-bold text-green-700 uppercase mb-2 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                    Artıları
                                                </h4>
                                                <ul className="text-sm space-y-1 text-gray-600">
                                                    {brand.pros.slice(0, 2).map((item, i) => (
                                                        <li key={i}>• {item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-red-700 uppercase mb-2 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                    Kronik Sorunlar
                                                </h4>
                                                <ul className="text-sm space-y-1 text-gray-600">
                                                    {brand.commonIssues.slice(0, 2).map((item, i) => (
                                                        <li key={i}>• {item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info / Methodology */}
                <div className="mt-16 grid md:grid-cols-2 gap-8">
                     <div className="bg-secondary-900 rounded-2xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">Bu Puanlar Neye Göre Verildi?</h3>
                            <p className="text-secondary-300 mb-6 leading-relaxed">
                                Puanlamalarımız global verilerin (JD Power, Consumer Reports) yanı sıra Türkiye'deki sanayi ustalarının görüşleri, yedek parça bulunabilirliği ve ikinci el piyasasındaki değer koruma oranları harmanlanarak oluşturulmuştur.
                            </p>
                            <Link href="/fiyat-hesapla" className="text-primary-400 font-semibold hover:text-primary-300 inline-flex items-center gap-2">
                                Bakım Maliyetlerini Hesapla
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-600 rounded-full blur-3xl opacity-20"></div>
                     </div>

                     <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Arıza Bildirimi Yapın</h3>
                        <p className="text-gray-600 mb-6">
                            Kendi aracınızda yaşadığınız sorunları paylaşarak bu veritabanının gelişmesine katkıda bulunun. Sizin deneyiminiz başkalarına yol gösterebilir.
                        </p>
                        <button className="w-full bg-secondary-900 text-white rounded-xl py-4 font-bold hover:bg-secondary-800 transition-colors">
                             Deneyim Paylaş (Yakında)
                        </button>
                     </div>
                </div>

            </main>
        </div>
    );
}

