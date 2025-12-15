'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { VehicleData } from '@/types';

export const dynamic = 'force-dynamic';

// Copied from API or types
interface ComparisonResult {
    data1: VehicleData | null;
    data2: VehicleData | null;
    loading: boolean;
    error: string | null;
}

// Reusable Image Component (Same as detail page)
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
    }, [brand, model, year]);

    if (loading) {
        return <div className={`${className} bg-gray-800 animate-pulse`}></div>;
    }

    if (!imageUrl) {
        return (
            <div className={`${className} bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center`}>
                <span className="text-gray-400 text-sm">{brand}</span>
            </div>
        );
    }

    return <img src={imageUrl} alt={alt} className={className} />;
}

export default function ComparisonResultPage() {
    const searchParams = useSearchParams();
    
    // Car 1 Params
    const brand1 = searchParams.get('brand1');
    const model1 = searchParams.get('model1');
    const year1 = searchParams.get('year1');

    // Car 2 Params
    const brand2 = searchParams.get('brand2');
    const model2 = searchParams.get('model2');
    const year2 = searchParams.get('year2');

    const [result, setResult] = useState<ComparisonResult>({
        data1: null,
        data2: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        if (!brand1 || !model1 || !year1 || !brand2 || !model2 || !year2) {
            setResult(prev => ({ ...prev, loading: false, error: 'Eksik parametre. Lütfen iki araç seçin.' }));
            return;
        }

        async function fetchData() {
            try {
                // Fetch both in parallel
                const [res1, res2] = await Promise.all([
                    fetch('/api/ai/research', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ brand: brand1, model: model1, year: year1 })
                    }),
                    fetch('/api/ai/research', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ brand: brand2, model: model2, year: year2 })
                    })
                ]);

                if (!res1.ok || !res2.ok) {
                    throw new Error('Analiz tamamlanamadı. Lütfen tekrar deneyin.');
                }

                const data1 = await res1.json();
                const data2 = await res2.json();

                if (!data1 || !data2) { // Removed .success check as API returns data directly or error object
                     throw new Error('Araç verileri alınamadı.');
                }

                setResult({
                    data1: data1, // API returns the data object directly
                    data2: data2,
                    loading: false,
                    error: null
                });

            } catch (err: any) {
                setResult(prev => ({
                    ...prev,
                    loading: false,
                    error: err.message || 'Bilinmeyen bir hata oluştu.'
                }));
            }
        }

        fetchData();
    }, [brand1, model1, year1, brand2, model2, year2]);


    if (result.loading) {
        return (
            <div className="min-h-screen bg-secondary-900 flex flex-col items-center justify-center text-white px-4">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <h2 className="text-2xl font-bold mb-2">Araçlar Karşılaştırılıyor...</h2>
                <p className="text-secondary-400 text-center max-w-md">
                    Yapay zeka her iki aracın teknik verilerini, kronik sorunlarını ve kullanıcı yorumlarını analiz ediyor.
                    Bu işlem 1-2 dakika sürebilir.
                </p>
            </div>
        );
    }

    if (result.error) {
         return (
            <div className="min-h-screen bg-secondary-50 flex flex-col items-center justify-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                    <div className="text-5xl mb-4">😕</div>
                    <h2 className="text-xl font-bold text-secondary-900 mb-2">Hata Oluştu</h2>
                    <p className="text-secondary-600 mb-6">{result.error}</p>
                    <Link href="/karsilastirma/olustur" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors">
                        Tekrar Dene
                    </Link>
                </div>
            </div>
        );
    }

    const { data1, data2 } = result;

    if (!data1 || !data2) return null;

    // Helper to extract numeric price for rough comparison/highlight
    // Assuming price is string like "1.200.000 TL"
    // Usually simple comparison logic or just show both.
    // We will simple display side-by-side.

    // Comparison Rows definition
    const specs = [
        { label: 'Motor', key: 'engine' },
        { label: 'Güç', key: 'horsepower' },
        { label: 'Tork', key: 'torque' },
        { label: 'Şanzıman', key: 'transmission' },
        { label: 'Yakıt Tüketimi', key: 'fuel_economy' },
        { label: 'Bagaj Hacmi', key: 'trunk' }, // Adjust Key if needed. API returns 'trunk' or 'luggage'? Need check types.
        // Checking VehicleData interface: engine, power, transmission, fuel_consumption is standard.
        // Let's use generic keys and access safely.
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                {/* Background Image with 10% opacity */}
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={{ backgroundImage: `url('/images/comparison-hero.jpg')` }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
                
                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-400/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Link href="/karsilastirma/olustur" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Yeni Karşılaştırma
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        {brand1} {model1} <span className="text-red-500 mx-2">VS</span> {brand2} {model2}
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        İki aracın teknik özellikleri, artıları, eksileri ve fiyatlarını karşılaştırın
                    </p>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
                
                {/* Images Face-off */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                     <div className="bg-white p-4 rounded-2xl shadow-lg relative overflow-hidden group">
                        <CarImage 
                            brand={brand1!} 
                            model={model1!} 
                            year={parseInt(year1!)} 
                            alt={`${brand1} ${model1}`} 
                            className="w-full h-64 object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-500" 
                        />
                         <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4 rounded-b-2xl">
                             <h2 className="text-xl font-bold text-white">{brand1} {model1}</h2>
                             <p className="text-white/80">{year1}</p>
                         </div>
                     </div>
                     <div className="bg-white p-4 rounded-2xl shadow-lg relative overflow-hidden group">
                        <CarImage 
                            brand={brand2!} 
                            model={model2!} 
                            year={parseInt(year2!)} 
                            alt={`${brand2} ${model2}`} 
                            className="w-full h-64 object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4 rounded-b-2xl">
                             <h2 className="text-xl font-bold text-white">{brand2} {model2}</h2>
                             <p className="text-white/80">{year2}</p>
                         </div>
                     </div>
                </div>

                {/* Specs Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="bg-secondary-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="font-bold text-lg text-secondary-900 text-center">Teknik Özellikler</h3>
                    </div>
                    {/* Header Row */}
                    <div className="grid grid-cols-3 bg-secondary-100 p-4 border-b border-gray-200">
                        <div className="text-center font-bold text-secondary-900">{brand1} {model1}</div>
                        <div className="text-center font-medium text-secondary-500">Özellik</div>
                        <div className="text-center font-bold text-secondary-900">{brand2} {model2}</div>
                    </div>
                    <div className="divide-y divide-gray-100">
                         {/* Engine */}
                         <div className="grid grid-cols-3 hover:bg-gray-50 p-4">
                            <div className="text-center font-semibold text-secondary-900">{data1.specs?.engine || '-'}</div>
                            <div className="text-center text-sm text-primary-600 font-medium">Motor & Performans</div>
                            <div className="text-center font-semibold text-secondary-900">{data2.specs?.engine || '-'}</div>
                         </div>
                         <div className="grid grid-cols-3 hover:bg-gray-50 p-4">
                            <div className="text-center font-semibold text-secondary-900">{data1.specs?.horsepower || '-'}</div>
                            <div className="text-center text-sm text-primary-600 font-medium">Güç (HP)</div>
                            <div className="text-center font-semibold text-secondary-900">{data2.specs?.horsepower || '-'}</div>
                         </div>
                         <div className="grid grid-cols-3 hover:bg-gray-50 p-4">
                            <div className="text-center font-semibold text-secondary-900">{data1.specs?.transmission || '-'}</div>
                            <div className="text-center text-sm text-primary-600 font-medium">Şanzıman</div>
                            <div className="text-center font-semibold text-secondary-900">{data2.specs?.transmission || '-'}</div>
                         </div>
                         <div className="grid grid-cols-3 hover:bg-gray-50 p-4">
                            <div className="text-center font-semibold text-secondary-900">{data1.specs?.fuel_economy || '-'}</div>
                            <div className="text-center text-sm text-primary-600 font-medium">Yakıt Tüketimi</div>
                            <div className="text-center font-semibold text-secondary-900">{data2.specs?.fuel_economy || '-'}</div>
                         </div>
                         <div className="grid grid-cols-3 hover:bg-gray-50 p-4">
                            <div className="text-center font-bold text-primary-600">{data1.estimated_prices?.average || '-'}</div>
                            <div className="text-center text-sm text-primary-600 font-medium">Tahmini Fiyat</div>
                            <div className="text-center font-bold text-primary-600">{data2.estimated_prices?.average || '-'}</div>
                         </div>
                    </div>
                </div>

                {/* Grid for Pros/Cons */}
                <div className="grid md:grid-cols-2 gap-8">
                     {/* Car 1 */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <h3 className="font-bold text-lg mb-4 text-green-600">
                                {brand1} {model1} Artıları
                            </h3>
                            <ul className="space-y-2">
                                {data1.pros?.map((pro: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-secondary-700">
                                        <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        {pro}
                                    </li>
                                )) || <p className="text-gray-400 text-sm">Veri bulunamadı.</p>}
                            </ul>
                        </div>
                         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <h3 className="font-bold text-lg mb-4 text-red-600">
                                {brand1} {model1} Eksileri
                            </h3>
                            <ul className="space-y-2">
                                {data1.cons?.map((con: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-secondary-700">
                                        <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        {con}
                                    </li>
                                )) || <p className="text-gray-400 text-sm">Veri bulunamadı.</p>}
                            </ul>
                        </div>
                    </div>

                    {/* Car 2 */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <h3 className="font-bold text-lg mb-4 text-green-600">
                                {brand2} {model2} Artıları
                            </h3>
                            <ul className="space-y-2">
                                {data2.pros?.map((pro: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-secondary-700">
                                        <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        {pro}
                                    </li>
                                )) || <p className="text-gray-400 text-sm">Veri bulunamadı.</p>}
                            </ul>
                        </div>
                         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <h3 className="font-bold text-lg mb-4 text-red-600">
                                {brand2} {model2} Eksileri
                            </h3>
                            <ul className="space-y-2">
                                {data2.cons?.map((con: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-secondary-700">
                                        <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        {con}
                                    </li>
                                )) || <p className="text-gray-400 text-sm">Veri bulunamadı.</p>}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    * Veriler yapay zeka tarafından derlenmiştir ve piyasa koşullarına göre değişiklik gösterebilir.
                </div>
            </main>
        </div>
    );
}
