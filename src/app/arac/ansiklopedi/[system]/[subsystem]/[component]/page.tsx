import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getComponentBySlug, getSystemBySlug, getSubsystemBySlug } from '@/data/encyclopedia-data';

interface PageProps {
    params: Promise<{ system: string; subsystem: string; component: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const component = getComponentBySlug(resolvedParams.system, resolvedParams.component, resolvedParams.subsystem);

    if (!component) {
        return {
            title: 'Bileşen Bulunamadı',
        };
    }

    return {
        title: `${component.name} - Araç Ansiklopedisi`,
        description: component.description,
    };
}

export default async function ComponentPage({ params }: PageProps) {
    const resolvedParams = await params;
    const system = getSystemBySlug(resolvedParams.system);
    const subsystem = getSubsystemBySlug(resolvedParams.system, resolvedParams.subsystem);
    const component = getComponentBySlug(resolvedParams.system, resolvedParams.component, resolvedParams.subsystem);

    if (!system || !subsystem || !component) {
        notFound();
    }

    return (
        <div className="bg-secondary-50 min-h-screen">
            {/* Hero Section with Image */}
            <section className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 bg-black/40 z-0"></div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div>
                            {/* Back Button */}
                            <Link 
                                href={`/arac/ansiklopedi/${system.slug}`}
                                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span>{system.name}</span>
                            </Link>
                            
                            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
                                {component.name}
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                {component.description}
                            </p>
                        </div>
                        
                        {/* Component Image */}
                        <div className="relative">
                            <div className="relative bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20">
                                <div className="relative h-80 w-full">
                                    {/* Check if component image exists */}
                                    {[
                                        'fren-balata', 'yag-filtresi', 'hava-filtresi', 'triger-kayisi', 'buji',
                                        'fren-diski', 'abs-kontrol-modulu', 'amortisor', 'aks', 'radyator',
                                        'termostat', 'su-pompasi', 'egzoz-manifoldu'
                                    ].includes(component.slug) ? (
                                        <Image
                                            src={`/images/components/${component.slug}.png`}
                                            alt={component.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-32 h-32 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Function */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold" style={{ color: '#454545' }}>İşlevi</h2>
                                </div>
                                <p className="text-secondary-700 leading-relaxed text-lg">
                                    {component.function}
                                </p>
                            </div>

                            {/* Symptoms */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold" style={{ color: '#454545' }}>Arıza Belirtileri</h2>
                                </div>
                                <p className="text-secondary-600 mb-6">
                                    Aşağıdaki belirtilerden birini veya birkaçını fark ederseniz, {component.name.toLowerCase()} arızalı olabilir:
                                </p>
                                <ul className="space-y-3">
                                    {component.symptoms.map((symptom, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-secondary-700">{symptom}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Repair Advice */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold" style={{ color: '#454545' }}>Uzman Tavsiyeleri</h2>
                                </div>
                                <ul className="space-y-4">
                                    {component.repairAdvice.map((advice, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-secondary-700 leading-relaxed">{advice}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Cost Estimate */}
                            {component.estimatedCost && (
                                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary-200">
                                    <h3 className="font-bold text-lg mb-4" style={{ color: '#454545' }}>
                                        Tahmini Maliyet
                                    </h3>
                                    <div className="bg-primary-50 rounded-xl p-4 mb-4">
                                        <p className="text-3xl font-bold text-primary-700 mb-1">
                                            {component.estimatedCost.min.toLocaleString('tr-TR')} - {component.estimatedCost.max.toLocaleString('tr-TR')} ₺
                                        </p>
                                        {component.laborTime && (
                                            <p className="text-sm text-secondary-600">
                                                İşçilik süresi: {component.laborTime}
                                            </p>
                                        )}
                                    </div>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                        <p className="text-xs text-yellow-800 leading-relaxed">
                                            ⚠️ Bu fiyatlar örnek verilerdir. Kesin fiyat için servislerden teklif alınız.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl p-6 shadow-xl">
                                <h4 className="font-bold text-xl mb-2">
                                    Servis Gerekiyor mu?
                                </h4>
                                <p className="text-primary-100 text-sm mb-5 leading-relaxed">
                                    Güvenilir servislerden ücretsiz fiyat teklifi alın
                                </p>
                                <Link
                                    href="/servisler"
                                    className="block w-full bg-white text-primary-600 px-4 py-3 rounded-xl hover:bg-primary-50 transition-all font-bold text-center shadow-lg"
                                >
                                    Servis Bul
                                </Link>
                            </div>

                            {/* Related Components */}
                            {component.relatedComponents && component.relatedComponents.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 shadow-lg">
                                    <h3 className="font-bold text-lg mb-4" style={{ color: '#454545' }}>
                                        İlgili Bileşenler
                                    </h3>
                                    <div className="space-y-2">
                                        {component.relatedComponents.map((relatedSlug) => {
                                            const relatedComponent = system.components.find(c => c.slug === relatedSlug);
                                            if (!relatedComponent) return null;
                                            return (
                                                <Link
                                                    key={relatedSlug}
                                                    href={`/arac/ansiklopedi/${system.slug}/${relatedSlug}`}
                                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 transition-all group"
                                                >
                                                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                    <span className="text-secondary-700 group-hover:text-primary-600 transition-colors">
                                                        {relatedComponent.name}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Back to Subsystem */}
                            <Link
                                href={`/arac/ansiklopedi/${system.slug}/${subsystem.slug}`}
                                className="block bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-center group"
                            >
                                <svg className="w-6 h-6 text-secondary-400 mx-auto mb-2 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span className="text-secondary-700 group-hover:text-primary-600 transition-colors font-medium">
                                    {subsystem.name} Sayfasına Dön
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
