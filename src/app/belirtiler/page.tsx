'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BelirtilerPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 'motor', name: 'Motor Sorunları', icon: '🔧', color: 'red' },
        { id: 'fren', name: 'Fren Sistemi', icon: '🛑', color: 'orange' },
        { id: 'elektrik', name: 'Elektrik & Aydınlatma', icon: '💡', color: 'yellow' },
        { id: 'sanziman', name: 'Şanzıman', icon: '⚙️', color: 'blue' },
        { id: 'suspansiyon', name: 'Süspansiyon', icon: '🚗', color: 'green' },
        { id: 'klima', name: 'Klima & Isıtma', icon: '❄️', color: 'cyan' },
        { id: 'egzoz', name: 'Egzoz Sistemi', icon: '💨', color: 'gray' },
        { id: 'diger', name: 'Diğer Belirtiler', icon: '🔍', color: 'purple' },
    ];

    const commonSymptoms = [
        { symptom: 'Motor Check Lambası Yanıyor', category: 'motor', severity: 'high', link: '/ariza-rehberi/check-engine-lambasi' },
        { symptom: 'Araç Sarsılıyor', category: 'motor', severity: 'medium', link: '/ariza-bul' },
        { symptom: 'Fren Sesi Geliyor', category: 'fren', severity: 'high', link: '/ariza-bul' },
        { symptom: 'Direksiyon Titriyor', category: 'suspansiyon', severity: 'medium', link: '/ariza-bul' },
        { symptom: 'Klima Soğutmuyor', category: 'klima', severity: 'low', link: '/ariza-bul' },
        { symptom: 'Vites Geçmiyor', category: 'sanziman', severity: 'high', link: '/ariza-bul' },
        { symptom: 'Farlar Yanmıyor', category: 'elektrik', severity: 'medium', link: '/ariza-bul' },
        { symptom: 'Egzozdan Duman Çıkıyor', category: 'egzoz', severity: 'high', link: '/ariza-bul' },
    ];

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-secondary-100 text-secondary-700';
        }
    };

    const getSeverityLabel = (severity: string) => {
        switch (severity) {
            case 'high': return 'Acil';
            case 'medium': return 'Orta';
            case 'low': return 'Düşük';
            default: return '';
        }
    };

    const filteredSymptoms = searchQuery
        ? commonSymptoms.filter(s => s.symptom.toLowerCase().includes(searchQuery.toLowerCase()))
        : selectedCategory
            ? commonSymptoms.filter(s => s.category === selectedCategory)
            : commonSymptoms;

    return (
        <div className="min-h-screen bg-secondary-50">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Araç Belirtileri Rehberi
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                        Aracınızda gözlemlediğiniz belirtileri seçin, olası arızaları ve çözüm önerilerini öğrenin
                    </p>

                    {/* Search Box */}
                    <div className="max-w-xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Belirti ara... (örn: motor sesi, titreme, duman)"
                                className="w-full px-6 py-4 pr-12 rounded-xl text-secondary-900 placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-xl text-lg"
                            />
                            <svg className="w-6 h-6 text-secondary-400 absolute right-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-12 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#454545' }}>
                        Kategoriye Göre Ara
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                                    setSearchQuery('');
                                }}
                                className={`p-4 rounded-xl text-center transition-all hover:shadow-lg ${
                                    selectedCategory === cat.id
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'bg-secondary-50 hover:bg-secondary-100'
                                }`}
                            >
                                <div className="text-3xl mb-2">{cat.icon}</div>
                                <div className="text-sm font-medium">{cat.name}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Symptoms List */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: '#454545' }}>
                        {searchQuery
                            ? `"${searchQuery}" için sonuçlar`
                            : selectedCategory
                                ? categories.find(c => c.id === selectedCategory)?.name + ' Belirtileri'
                                : 'Yaygın Belirtiler'
                        }
                    </h2>

                    {filteredSymptoms.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl">
                            <svg className="w-16 h-16 text-secondary-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-secondary-600">Bu kriterlere uygun belirti bulunamadı.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSymptoms.map((symptom, idx) => (
                                <Link
                                    key={idx}
                                    href={symptom.link}
                                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-secondary-100 hover:border-primary-200 group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="text-2xl">
                                            {categories.find(c => c.id === symptom.category)?.icon}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(symptom.severity)}`}>
                                            {getSeverityLabel(symptom.severity)}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary-600 transition-colors" style={{ color: '#454545' }}>
                                        {symptom.symptom}
                                    </h3>
                                    <p className="text-secondary-600 text-sm mb-4">
                                        {categories.find(c => c.id === symptom.category)?.name}
                                    </p>
                                    <div className="flex items-center text-primary-600 font-medium text-sm">
                                        Detayları Gör
                                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 bg-primary-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Belirtinizi Bulamadınız mı?
                    </h2>
                    <p className="text-primary-100 mb-6">
                        AI destekli arıza tespit sistemimizi kullanarak aracınızın sorununu teşhis edin
                    </p>
                    <Link
                        href="/ai/ariza-tespit"
                        className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors shadow-lg"
                    >
                        AI Arıza Tespiti
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>
        </div>
    );
}
