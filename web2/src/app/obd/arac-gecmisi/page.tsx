import type { Metadata } from 'next';
import Link from 'next/link';
import { Car, BarChart3, AlertCircle, ArrowRight } from 'lucide-react';
import VehicleCodeHistory from '@/components/obd/VehicleCodeHistory';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Araç Bazlı OBD Kod Geçmişi | Marka-Model Arıza Kodları',
  description: 'Aracınızın marka ve modeline göre en sık görülen OBD arıza kodlarını öğrenin. Fiat, VW, Renault, Ford, Toyota ve diğer markaların yaygın sorunları.',
  keywords: [
    'araç arıza kodu',
    'marka model obd',
    'fiat egea arıza',
    'volkswagen golf arıza',
    'renault clio arıza',
    'ford focus arıza',
    'en sık arıza kodları'
  ],
  openGraph: {
    title: 'Araç Bazlı OBD Kod Geçmişi | TamirHanem',
    description: 'Aracınızın marka ve modeline göre en sık görülen OBD arıza kodlarını görün.',
    url: 'https://tamirhanem.com/obd/arac-gecmisi',
  },
  alternates: {
    canonical: 'https://tamirhanem.com/obd/arac-gecmisi',
  },
};

export default function VehicleCodeHistoryPage() {
  const breadcrumbs = [
    { name: 'Ana Sayfa', url: 'https://tamirhanem.com' },
    { name: 'OBD Kodları', url: 'https://tamirhanem.com/obd' },
    { name: 'Araç Geçmişi', url: 'https://tamirhanem.com/obd/arac-gecmisi' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-500 via-purple-600 to-secondary-700 py-16 overflow-hidden">
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
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-purple-200 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/obd" className="hover:text-white">OBD Kodları</Link>
            <span>/</span>
            <span className="text-white font-medium">Araç Geçmişi</span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Araç Bazlı Kod Geçmişi
              </h1>
              <p className="text-purple-200">
                Marka ve Modele Göre Yaygın Arıza Kodları
              </p>
            </div>
          </div>

          <p className="text-purple-100 text-lg max-w-3xl">
            Her araç markası ve modelinin kendine özgü yaygın arızaları vardır.
            Aracınızı seçin ve o modelde en sık görülen OBD kodlarını, nedenlerini
            ve çözümlerini öğrenin.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <Car className="w-4 h-4" />
              30+ Marka
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <BarChart3 className="w-4 h-4" />
              Frekans Analizi
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <AlertCircle className="w-4 h-4" />
              Marka Notları
            </span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-secondary-100 p-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">30+</div>
              <div className="text-sm text-secondary-600">Marka</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">60+</div>
              <div className="text-sm text-secondary-600">Model</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">300+</div>
              <div className="text-sm text-secondary-600">Kod Eşleştirmesi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">Gerçek</div>
              <div className="text-sm text-secondary-600">Servis Verileri</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <VehicleCodeHistory />
      </section>

      {/* Info Section */}
      <section className="bg-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-secondary-800 mb-8 text-center">
            Bu Veriler Nereden Geliyor?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-800 mb-2">Gerçek Servis Kayıtları</h3>
              <p className="text-secondary-600 text-sm">
                Veriler binlerce gerçek servis kaydından derlenerek oluşturulmuştur.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-800 mb-2">İstatistiksel Analiz</h3>
              <p className="text-secondary-600 text-sm">
                Her kod frekansa göre sıralanmış ve detaylı notlar eklenmiştir.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-800 mb-2">Sürekli Güncelleme</h3>
              <p className="text-secondary-600 text-sm">
                Yeni verilerle düzenli olarak güncellenmektedir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Belirtilerden mi Başlamak İstiyorsunuz?
          </h2>
          <p className="text-secondary-700 mb-6">
            Aracınızda yaşadığınız belirtileri seçin, olası kodları bulun.
          </p>
          <Link
            href="/obd/semptom-ara"
            className="inline-flex items-center bg-secondary-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary-900 transition-colors shadow-lg"
          >
            Semptom Bazlı Ara
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
