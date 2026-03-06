import type { Metadata } from 'next';
import Link from 'next/link';
import { GitCompare, Layers, ArrowRight, Sparkles } from 'lucide-react';
import CodeComparison from '@/components/obd/CodeComparison';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'OBD Kod Karşılaştırma | Arıza Kodlarını Yan Yana İncele',
  description: 'İki veya üç OBD arıza kodunu yan yana karşılaştırın. Ortak nedenler, farklı belirtiler ve tahmini maliyetleri görün.',
  keywords: [
    'obd kod karşılaştırma',
    'arıza kodu farkı',
    'P0171 P0174 farkı',
    'P0300 P0301 farkı',
    'kod analizi'
  ],
  openGraph: {
    title: 'OBD Kod Karşılaştırma | TamirHanem',
    description: 'İki veya üç OBD arıza kodunu yan yana karşılaştırın.',
    url: 'https://tamirhanem.com/obd/karsilastir',
  },
  alternates: {
    canonical: 'https://tamirhanem.com/obd/karsilastir',
  },
};

export default function CodeComparisonPage() {
  const breadcrumbs = [
    { name: 'Ana Sayfa', url: 'https://tamirhanem.com' },
    { name: 'OBD Kodları', url: 'https://tamirhanem.com/obd' },
    { name: 'Kod Karşılaştır', url: 'https://tamirhanem.com/obd/karsilastir' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-secondary-700 py-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: 'url(/hero_service_background.png)',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-indigo-200 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/obd" className="hover:text-white">OBD Kodları</Link>
            <span>/</span>
            <span className="text-white font-medium">Kod Karşılaştır</span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <GitCompare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Kod Karşılaştırma
              </h1>
              <p className="text-indigo-200">
                Arıza Kodlarını Yan Yana İnceleyin
              </p>
            </div>
          </div>

          <p className="text-indigo-100 text-lg max-w-3xl">
            "P0171 mi P0174 mü bilemedim" mi dediniz? İki veya üç kodu yan yana
            karşılaştırın, ortak nedenlerini, farklı belirtilerini ve maliyet
            farklarını görün.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <GitCompare className="w-4 h-4" />
              2-3 Kod Karşılaştır
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <Layers className="w-4 h-4" />
              Ortak Noktalar
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <Sparkles className="w-4 h-4" />
              Detaylı Tablo
            </span>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-secondary-100 p-6">
          <h2 className="text-lg font-semibold text-secondary-800 mb-4 text-center">Ne Zaman Kullanmalı?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-800 text-sm">Benzer Kodlar</h3>
                <p className="text-secondary-600 text-sm">P0171 vs P0174 gibi benzer kodların farkını anlamak için</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-800 text-sm">Birden Fazla Kod</h3>
                <p className="text-secondary-600 text-sm">Aracınızda çıkan birden fazla kodu aynı anda incelemek için</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-800 text-sm">Maliyet Farkı</h3>
                <p className="text-secondary-600 text-sm">Hangi arızanın daha pahalı olduğunu anlamak için</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CodeComparison />
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Aracınızda Hangi Kodların Yaygın Olduğunu Öğrenin
          </h2>
          <p className="text-secondary-700 mb-6">
            Marka ve modele göre en sık görülen arıza kodlarını görün.
          </p>
          <Link
            href="/obd/arac-gecmisi"
            className="inline-flex items-center bg-secondary-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary-900 transition-colors shadow-lg"
          >
            Araç Geçmişi
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
