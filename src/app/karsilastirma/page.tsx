'use client';

import Link from 'next/link';
import { comparisons } from '@/data/comparisons';
import { useState, useEffect } from 'react';

// Component for lazy loading car images
function CarImage({ brand, model, year, alt, className }: { brand: string; model: string; year: number; alt: string; className: string }) {
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
            <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        );
    }

    if (!imageUrl) {
        return (
            <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
                <div className="text-center">
                    <svg className="w-10 h-10 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    <span className="text-xs text-gray-400">{brand}</span>
                </div>
            </div>
        );
    }

    return <img src={imageUrl} alt={alt} className={className} />;
}

export default function ComparisonPage() {
    return (
        <div className="bg-secondary-50 min-h-screen pb-20">
            {/* Hero Section */}
            <section className="bg-secondary-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Önceki Karşılaştırmalar
                    </h1>
                    <p className="text-xl text-secondary-300 max-w-2xl mx-auto">
                        Türkiye pazarındaki en popüler araçları teknik özellikler, fiyat ve performans açısından detaylı olarak kıyasladık.
                    </p>
                </div>
            </section>

            {/* Comparisons Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {comparisons.map((comp) => (
                        <Link 
                            key={comp.id} 
                            href={`/karsilastirma/${comp.slug}`}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 block group"
                        >
                            {/* VS Image Split */}
                            <div className="h-48 relative flex">
                                <div className="w-1/2 relative overflow-hidden">
                                    <CarImage 
                                        brand={comp.car1.brand} 
                                        model={comp.car1.model} 
                                        year={comp.car1.year}
                                        alt={comp.car1.brand}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
                                </div>
                                <div className="w-1/2 relative overflow-hidden">
                                    <CarImage 
                                        brand={comp.car2.brand} 
                                        model={comp.car2.model} 
                                        year={comp.car2.year}
                                        alt={comp.car2.brand}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10"></div>
                                </div>
                                
                                {/* VS Badge */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center border-4 border-white z-10 shadow-lg">
                                    VS
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold bg-secondary-100 text-secondary-600 px-2 py-1 rounded uppercase tracking-wider">
                                        {comp.segment}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
                                    {comp.title}
                                </h3>
                                <div className="mt-4 flex justify-between items-center text-sm text-secondary-500">
                                    <span>{comp.car1.brand}</span>
                                    <span className="w-1 h-1 bg-secondary-300 rounded-full"></span>
                                    <span>{comp.car2.brand}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
