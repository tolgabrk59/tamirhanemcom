'use client';

import { comparisons } from '@/data/comparisons';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';

// Component for lazy loading car images
function CarImage({ brand, model, year, alt, className, overlay }: { brand: string; model: string; year: number; alt: string; className: string; overlay?: React.ReactNode }) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchImage() {
            try {
                const res = await fetch(`/api/car-image?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}&year=${year}`);
                const data = await res.json();
                setImageUrl(data.imageUrl);
            } catch (error) {
                console.error('Error fetching image:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchImage();
    }, [brand, model]);

    if (loading) {
        return (
            <div className={`${className} bg-gray-800 animate-pulse flex items-center justify-center`}>
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-600 border-t-primary-500 rounded-full animate-spin mx-auto mb-3"></div>
                    <span className="text-gray-400 text-sm">Görsel yükleniyor...</span>
                </div>
                {overlay}
            </div>
        );
    }

    if (!imageUrl) {
        return (
            <div className={`${className} bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center`}>
                <div className="text-center">
                    <svg className="w-16 h-16 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    <span className="text-gray-400 text-lg font-medium">{brand} {model}</span>
                </div>
                {overlay}
            </div>
        );
    }

    return (
        <div className={className}>
            <img src={imageUrl} alt={alt} className="w-full h-full object-cover" />
            {overlay}
        </div>
    );
}

export default function ComparisonDetailPage({ params }: { params: { slug: string } }) {
    const comparison = comparisons.find(c => c.slug === params.slug);

    if (!comparison) {
        notFound();
    }

    const { car1, car2, winner } = comparison;

    const isWinner1 = winner === 'car1';
    const isWinner2 = winner === 'car2';

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-secondary-900 text-white pt-24 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <Link href="/karsilastirma" className="inline-flex items-center text-secondary-300 hover:text-white mb-6 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Tüm Karşılaştırmalar
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold text-center mb-8">{comparison.title}</h1>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
                {/* Visual Face-off */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12">
                    <div className="grid md:grid-cols-2 relative">
                        {/* Car 1 */}
                        <CarImage 
                            brand={car1.brand} 
                            model={car1.model} 
                            year={car1.year}
                            alt={`${car1.brand} ${car1.model}`}
                            className={`relative h-64 md:h-96 ${isWinner1 ? 'ring-4 ring-inset ring-green-500' : ''}`}
                            overlay={
                                <>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                        <h2 className="text-2xl font-bold text-white">{car1.brand} {car1.model}</h2>
                                        <p className="text-white/80">{car1.year} • {car1.price}</p>
                                    </div>
                                    {isWinner1 && (
                                        <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-1 rounded-full font-bold shadow-lg">
                                            KAZANAN
                                        </div>
                                    )}
                                </>
                            }
                        />
                        
                        {/* Car 2 */}
                        <CarImage 
                            brand={car2.brand} 
                            model={car2.model} 
                            year={car2.year}
                            alt={`${car2.brand} ${car2.model}`}
                            className={`relative h-64 md:h-96 ${isWinner2 ? 'ring-4 ring-inset ring-green-500' : ''}`}
                            overlay={
                                <>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-right">
                                        <h2 className="text-2xl font-bold text-white">{car2.brand} {car2.model}</h2>
                                        <p className="text-white/80">{car2.year} • {car2.price}</p>
                                    </div>
                                    {isWinner2 && (
                                        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-1 rounded-full font-bold shadow-lg">
                                            KAZANAN
                                        </div>
                                    )}
                                </>
                            }
                        />
                        
                        {/* VS Badge Centered */}
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                            <div className="bg-red-600 text-white font-black text-2xl rounded-full w-16 h-16 flex items-center justify-center border-4 border-white shadow-2xl">
                                VS
                            </div>
                        </div>
                    </div>

                    {/* Verdict */}
                    <div className="p-8 md:p-12 bg-white border-t border-gray-100">
                        <div className="flex items-start gap-4 max-w-4xl mx-auto">
                            <span className="text-4xl">🏆</span>
                            <div>
                                <h3 className="text-xl font-bold text-secondary-900 mb-2">Editörün Kararı</h3>
                                <p className="text-lg text-secondary-600 leading-relaxed">
                                    {comparison.verdict}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specs Comparison Table */}
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-secondary-50 px-6 py-4 border-b border-gray-200">
                                <h3 className="font-bold text-lg text-secondary-900">Teknik Karşılaştırma</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[
                                    { label: 'Motor', key1: car1.engine, key2: car2.engine },
                                    { label: 'Güç', key1: car1.power, key2: car2.power },
                                    { label: 'Tork', key1: car1.torque, key2: car2.torque },
                                    { label: 'Şanzıman', key1: car1.transmission, key2: car2.transmission },
                                    { label: 'Yakıt', key1: car1.fuel, key2: car2.fuel },
                                    { label: 'Tüketim', key1: car1.fuel_consumption, key2: car2.fuel_consumption },
                                    { label: 'Bagaj', key1: car1.luggage, key2: car2.luggage },
                                    { label: 'Fiyat', key1: car1.price, key2: car2.price, highlight: true },
                                ].map((row, idx) => (
                                    <div key={idx} className="grid grid-cols-3 hover:bg-gray-50 transition-colors">
                                        <div className="p-4 text-sm text-secondary-500 font-medium border-r border-gray-100 flex items-center">
                                            {row.label}
                                        </div>
                                        <div className={`p-4 text-sm font-semibold text-center border-r border-gray-100 ${row.highlight ? 'text-primary-600' : 'text-secondary-900'}`}>
                                            {row.key1}
                                        </div>
                                        <div className={`p-4 text-sm font-semibold text-center ${row.highlight ? 'text-primary-600' : 'text-secondary-900'}`}>
                                            {row.key2}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Pros & Cons */}
                    <div className="space-y-6">
                        {/* Car 1 Pros */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h4 className="font-bold text-secondary-900 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                                {car1.brand} {car1.model} Avantajları
                            </h4>
                            <ul className="space-y-3">
                                {comparison.pros1.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-secondary-600">
                                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Car 2 Pros */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                             <h4 className="font-bold text-secondary-900 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-secondary-500"></span>
                                {car2.brand} {car2.model} Avantajları
                            </h4>
                            <ul className="space-y-3">
                                {comparison.pros2.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-secondary-600">
                                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
