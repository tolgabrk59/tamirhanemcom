import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, AlertTriangle, ArrowRight, Stethoscope } from 'lucide-react';
import SymptomSearch from '@/components/obd/SymptomSearch';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Semptom Bazlı OBD Arama | Arıza Belirtilerinden Kod Bul',
  description: 'Aracınızın belirtilerini girin, olası arıza kodlarını bulun. Motor titriyor, güç kaybı, yüksek yakıt tüketimi gibi semptomlardan OBD-II kodlarına ulaşın.',
  keywords: [
    'semptom arama',
    'arıza belirti',
    'motor titriyor',
    'güç kaybı',
    'yakıt tüketimi',
    'OBD kod bulma',
    'araç arıza teşhis'
  ],
  openGraph: {
    title: 'Semptom Bazlı OBD Arama | TamirHanem',
    description: 'Belirtilerden arıza kodlarını bulun. Aracınız ne yapıyorsa seçin, olası OBD kodlarını görün.',
    url: 'https://tamirhanem.com/obd/semptom-ara',
  },
  alternates: {
    canonical: 'https://tamirhanem.com/obd/semptom-ara',
  },
};

export default function SymptomSearchPage() {
  const breadcrumbs = [
    { name: 'Ana Sayfa', url: 'https://tamirhanem.com' },
    { name: 'OBD Kodları', url: 'https://tamirhanem.com/obd' },
    { name: 'Semptom Ara', url: 'https://tamirhanem.com/obd/semptom-ara' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-500 via-red-600 to-secondary-700 py-16 overflow-hidden">
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
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-red-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-red-200 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/obd" className="hover:text-white">OBD Kodları</Link>
            <span>/</span>
            <span className="text-white font-medium">Semptom Ara</span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Semptom Bazlı Arama
              </h1>
              <p className="text-red-200">
                Belirtilerden Arıza Kodlarını Bulun
              </p>
            </div>
          </div>

          <p className="text-red-100 text-lg max-w-3xl">
            Aracınızda bir sorun mu var? Kodu bilmiyorsanız endişelenmeyin.
            Yaşadığınız belirtiyi seçin veya yazın, olası arıza kodlarını ve
            çözüm önerilerini görelim.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <Search className="w-4 h-4" />
              Semptom Arama
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <AlertTriangle className="w-4 h-4" />
              30+ Belirti
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <ArrowRight className="w-4 h-4" />
              Direkt OBD Kodu
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-secondary-100 p-6">
          <h2 className="text-lg font-semibold text-secondary-800 mb-4 text-center">Nasıl Çalışır?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-800 text-sm">Belirtiyi Seçin</h3>
                <p className="text-secondary-600 text-sm">Motor titriyor, güç kaybı, yakıt tüketimi gibi belirtileri arayın</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-800 text-sm">Kodları Görün</h3>
                <p className="text-secondary-600 text-sm">Bu belirtiyle ilişkili olası OBD-II kodlarını inceleyin</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-800 text-sm">Detayları Öğrenin</h3>
                <p className="text-secondary-600 text-sm">Her kodun nedenlerini, çözümlerini ve tahmini maliyetini görün</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SymptomSearch />
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Kodu Zaten Biliyor musunuz?
          </h2>
          <p className="text-secondary-700 mb-6">
            Doğrudan OBD kodunuzu arayın ve detaylı bilgiye ulaşın.
          </p>
          <Link
            href="/obd"
            className="inline-flex items-center bg-secondary-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary-900 transition-colors shadow-lg"
          >
            OBD Kod Ara
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
