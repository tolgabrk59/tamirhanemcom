import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSystemBySlug, getSubsystemBySlug } from '@/data/encyclopedia-data';

interface PageProps {
    params: Promise<{ system: string; subsystem: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const system = getSystemBySlug(resolvedParams.system);
    const subsystem = getSubsystemBySlug(resolvedParams.system, resolvedParams.subsystem);

    if (!system || !subsystem) {
        return {
            title: 'Sistem Bulunamadı',
        };
    }

    return {
        title: `${subsystem.name} - ${system.name} - Araç Ansiklopedisi`,
        description: subsystem.description,
    };
}

const colorClasses: Record<string, { bg: string; border: string; text: string; iconBg: string; hover: string }> = {
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', iconBg: 'bg-red-100', hover: 'hover:bg-red-100' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', iconBg: 'bg-orange-100', hover: 'hover:bg-orange-100' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', iconBg: 'bg-blue-100', hover: 'hover:bg-blue-100' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', iconBg: 'bg-yellow-100', hover: 'hover:bg-yellow-100' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', iconBg: 'bg-green-100', hover: 'hover:bg-green-100' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600', iconBg: 'bg-cyan-100', hover: 'hover:bg-cyan-100' },
    gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', iconBg: 'bg-gray-100', hover: 'hover:bg-gray-100' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', iconBg: 'bg-purple-100', hover: 'hover:bg-purple-100' },
};

export default async function SubsystemPage({ params }: PageProps) {
    const resolvedParams = await params;
    const system = getSystemBySlug(resolvedParams.system);
    const subsystem = getSubsystemBySlug(resolvedParams.system, resolvedParams.subsystem);

    if (!system || !subsystem) {
        notFound();
    }

    const colors = colorClasses[system.color];

    return (
        <div className="bg-secondary-50 min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-secondary-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-secondary-500 hover:text-primary-600">Ana Sayfa</Link>
                        <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href="/arac/ansiklopedi" className="text-secondary-500 hover:text-primary-600">Araç Ansiklopedisi</Link>
                        <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href={`/arac/ansiklopedi/${system.slug}`} className="text-secondary-500 hover:text-primary-600">{system.name}</Link>
                        <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-secondary-900 font-medium">{subsystem.name}</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section className={`${colors.bg} py-16 border-b ${colors.border}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-start gap-6">
                        <div className={`w-20 h-20 ${colors.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 ${colors.text}`}>
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#454545' }}>
                                {subsystem.name}
                            </h1>
                            <p className="text-lg text-secondary-700 leading-relaxed mb-6">
                                {subsystem.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span className="text-secondary-600">{subsystem.components.length} Bileşen</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Components Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: '#454545' }}>
                        Bileşenler
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subsystem.components.map((component) => (
                            <Link
                                key={component.id}
                                href={`/arac/ansiklopedi/${system.slug}/${subsystem.slug}/${component.slug}`}
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

            {/* Back to System Link */}
            <section className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href={`/arac/ansiklopedi/${system.slug}`}
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {system.name} Sistemine Dön
                    </Link>
                </div>
            </section>
        </div>
    );
}
