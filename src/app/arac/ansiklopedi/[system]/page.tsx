import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getSystemBySlug, getAllSystems } from '@/data/encyclopedia-data';

interface PageProps {
    params: Promise<{ system: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const system = getSystemBySlug(resolvedParams.system);

    if (!system) {
        return {
            title: 'Sistem Bulunamadı',
        };
    }

    return {
        title: `${system.name} - Araç Ansiklopedisi`,
        description: system.description,
    };
}

export async function generateStaticParams() {
    const systems = getAllSystems();
    return systems.map((system) => ({
        system: system.slug,
    }));
}

const colorClasses: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', iconBg: 'bg-red-100' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', iconBg: 'bg-orange-100' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', iconBg: 'bg-blue-100' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', iconBg: 'bg-yellow-100' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', iconBg: 'bg-green-100' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600', iconBg: 'bg-cyan-100' },
    gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', iconBg: 'bg-gray-100' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', iconBg: 'bg-purple-100' },
};

export default async function SystemPage({ params }: PageProps) {
    const resolvedParams = await params;
    const system = getSystemBySlug(resolvedParams.system);

    if (!system) {
        notFound();
    }

    const colors = colorClasses[system.color];
    
    // Collect all components with their subsystem info
    let allComponents: any[] = [];
    
    if (system.subsystems && system.subsystems.length > 0) {
        system.subsystems.forEach(subsystem => {
            if (subsystem && subsystem.components) {
                const componentsWithSubsystem = subsystem.components.map(component => ({
                    ...component,
                    subsystemSlug: subsystem.slug
                }));
                allComponents.push(...componentsWithSubsystem);
            }
        });
    } else if (system.components) {
        allComponents = system.components;
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
                                href="/arac/ansiklopedi"
                                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span>Araç Ansiklopedisi</span>
                            </Link>
                            
                            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
                                {system.name}
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed mb-6">
                                {system.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2 text-white/80">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span>{allComponents.length} Bileşen</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* System Image */}
                        <div className="relative">
                            <div className="relative bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20">
                                <div className="relative h-80 w-full">
                                    <Image
                                        src={`/images/systems/${system.slug}.png`}
                                        alt={system.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Components or Subsystems Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: '#454545' }}>
                        Sistem Bileşenleri
                    </h2>

                    {/* Always show direct components */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allComponents.map((component) => (
                            <Link
                                key={component.id}
                                href={component.subsystemSlug 
                                    ? `/arac/ansiklopedi/${system.slug}/${component.subsystemSlug}/${component.slug}`
                                    : `/arac/ansiklopedi/${system.slug}/${component.slug}`
                                }
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-secondary-100 hover:border-primary-200 transform hover:scale-105 group"
                            >
                                <h3 className="font-bold text-xl mb-3 text-secondary-900 group-hover:text-primary-600 transition-colors">
                                    {component.name}
                                </h3>
                                <p className="text-sm text-secondary-600 leading-relaxed mb-4">
                                    {component.description}
                                </p>

                                {/* Cost Badge */}
                                {component.estimatedCost && (
                                    <div className="flex items-center gap-2 text-sm mb-4">
                                        <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-lg font-semibold">
                                            {component.estimatedCost.min.toLocaleString('tr-TR')} - {component.estimatedCost.max.toLocaleString('tr-TR')} ₺
                                        </div>
                                    </div>
                                )}

                                {/* Symptoms Count */}
                                <div className="flex items-center justify-between text-sm text-secondary-500">
                                    <span>{component.symptoms.length} Belirti</span>
                                    <svg className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tips Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-2" style={{ color: '#454545' }}>
                                    Bakım Önerisi
                                </h3>
                                <p className="text-secondary-700 leading-relaxed">
                                    {system.name} düzenli bakım gerektirir. Arıza belirtilerini erken fark etmek,
                                    büyük masrafların önüne geçer. Yukarıdaki bileşenlere tıklayarak detaylı bilgi
                                    ve bakım önerilerine ulaşabilirsiniz.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
