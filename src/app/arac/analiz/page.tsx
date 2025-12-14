'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface VehicleData {
    specs: {
        engine: string;
        horsepower: string;
        torque: string;
        transmission: string;
        drivetrain: string;
        fuel_economy: string;
    };
    tires: {
        standard: string;
        alternative: string[];
        pressure: string;
    };
    chronic_problems: Array<{
        problem: string;
        description: string;
        severity: string;
        significance_score: number;
    }>;
    maintenance: {
        oil_type: string;
        oil_capacity: string;
        intervals: Array<{ km: string; action: string }>;
    };
    pros: string[];
    cons: string[];
    summary: string;
    image_url?: string;
}

export default function VehicleAnalysisPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // ... existing state and effect code ...
    // Note: I'm preserving the existing logic, just showing the layout update below

    const brand = searchParams?.get('brand');
    const model = searchParams?.get('model');
    const year = searchParams?.get('year');

    const [data, setData] = useState<VehicleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!brand || !model || !year) {
            setError('Eksik araç bilgisi. Lütfen tekrar seçim yapın.');
            setLoading(false);
            return;
        }

        async function fetchData() {
            try {
                const res = await fetch('/api/ai/research', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ brand, model, year })
                });

                if (!res.ok) throw new Error('Analiz başarısız oldu.');

                const result = await res.json();
                setData(result);
            } catch (err) {
                console.error(err);
                setError('Veri alınırken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [brand, model, year]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Araç Verileri Analiz Ediliyor...</h2>
                <p className="text-gray-600 text-center max-w-md">
                    {year} {brand} {model} için teknik veriler derleniyor ve kronik sorunlar analiz ediliyor.
                </p>
                <div className="mt-8 flex gap-2">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Bir Sorun Oluştu</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link
                        href="/arac/genel-bakis"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors w-full"
                    >
                        Geri Dön
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/arac/genel-bakis" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-medium">Geri Dön</span>
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900 truncate">
                        {year} {brand} {model} Analizi
                    </h1>
                    <div className="w-20"></div> 
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* Hero / Summary Section */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-0">
                        {/* Image Column */}
                        <div className="lg:col-span-2 bg-gray-100 flex items-center justify-center min-h-[300px] relative">
                             {data.image_url ? (
                                <img 
                                    src={data.image_url} 
                                    alt={`${brand} ${model}`} 
                                    className="w-full h-full object-cover absolute inset-0"
                                />
                             ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Görsel Yok</span>
                                </div>
                             )}
                             {/* Gradient Overlay for text readability on mobile if needed, or style consistency */}
                             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                        </div>

                        {/* Content Column */}
                        <div className="lg:col-span-3 p-8 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl">📋</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Araç Özeti</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {data.summary}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Specs & Tires */}
                    <div className="space-y-8 lg:col-span-2">
                        
                        {/* Specs Grid */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Teknik Özellikler
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <span className="text-sm text-gray-500 block">Motor</span>
                                    <span className="font-semibold text-gray-900">{data.specs.engine}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-gray-500 block">Güç</span>
                                    <span className="font-semibold text-gray-900">{data.specs.horsepower}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-gray-500 block">Tork</span>
                                    <span className="font-semibold text-gray-900">{data.specs.torque}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-gray-500 block">Şanzıman</span>
                                    <span className="font-semibold text-gray-900">{data.specs.transmission}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-gray-500 block">Çekiş</span>
                                    <span className="font-semibold text-gray-900">{data.specs.drivetrain}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-gray-500 block">Yakıt Tüketimi</span>
                                    <span className="font-semibold text-gray-900">{data.specs.fuel_economy}</span>
                                </div>
                            </div>
                        </section>

                        {/* Chronic Problems */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Kronik Sorunlar ve Riskler
                            </h3>
                            <div className="space-y-4">
                                {data.chronic_problems.map((item, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-red-200 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-gray-900">{item.problem}</h4>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                item.severity === 'Yüksek' ? 'bg-red-100 text-red-700' :
                                                item.severity === 'Orta' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {item.severity} Risk
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${
                                                        item.significance_score > 7 ? 'bg-red-500' :
                                                        item.significance_score > 4 ? 'bg-yellow-500' : 'bg-green-500'
                                                    }`}
                                                    style={{ width: `${item.significance_score * 10}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium">Önem: {item.significance_score}/10</span>
                                        </div>
                                    </div>
                                ))}
                                {data.chronic_problems.length === 0 && (
                                    <p className="text-gray-500 italic">Bu araç için bilinen önemli bir kronik sorun raporlanmamıştır.</p>
                                )}
                            </div>
                        </section>

                        {/* Maintenance */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Bakım Bilgileri
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-8 mb-8">
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <span className="text-sm text-blue-600 block mb-1 font-semibold">Önerilen Yağ</span>
                                    <span className="text-lg font-bold text-blue-900">{data.maintenance.oil_type}</span>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <span className="text-sm text-blue-600 block mb-1 font-semibold">Yağ Kapasitesi</span>
                                    <span className="text-lg font-bold text-blue-900">{data.maintenance.oil_capacity}</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3">Kilometre</th>
                                            <th className="px-4 py-3">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.maintenance.intervals.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-900">{item.km}</td>
                                                <td className="px-4 py-3 text-gray-600">{item.action}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Tires, Pros/Cons */}
                    <div className="space-y-8">
                        
                        {/* Tires */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                             <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Lastik & Basınç
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <span className="text-sm text-gray-500 block mb-1">Standart Boyut</span>
                                    <span className="text-xl font-bold text-gray-900">{data.tires.standard}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 block mb-1">Basınç (Ön/Arka)</span>
                                    <span className="text-lg font-semibold text-gray-900">{data.tires.pressure}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 block mb-2">Alternatifler</span>
                                    <div className="flex flex-wrap gap-2">
                                        {data.tires.alternative.map((size, idx) => (
                                            <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium">
                                                {size}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <Link 
                                    href="/arac/lastik-secimi"
                                    className="block w-full text-center bg-gray-900 text-white px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm"
                                >
                                    Lastik Rehberine Git
                                </Link>
                            </div>
                        </section>

                        {/* Pros & Cons */}
                        <section className="grid gap-4">
                            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                                <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Artıları
                                </h4>
                                <ul className="space-y-2">
                                    {data.pros.map((item, idx) => (
                                        <li key={idx} className="text-green-700 text-sm flex items-start gap-2">
                                            <span className="mt-1.5 w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                                <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Eksileri
                                </h4>
                                <ul className="space-y-2">
                                    {data.cons.map((item, idx) => (
                                        <li key={idx} className="text-red-700 text-sm flex items-start gap-2">
                                            <span className="mt-1.5 w-1 h-1 bg-red-500 rounded-full flex-shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
}
