import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, MapPin, TrendingDown, ArrowRight } from 'lucide-react';
import CostEstimator from '@/components/obd/CostEstimator';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'OBD Maliyet Hesaplayıcı | Şehir Bazlı Tamir Maliyeti',
  description: 'Arıza kodunuz ve şehrinize göre tahmini tamir maliyetini hesaplayın. İşçilik ve parça maliyetlerini şehir bazında karşılaştırın.',
  keywords: [
    'obd maliyet hesaplama',
    'arıza tamir ücreti',
    'şehir bazlı maliyet',
    'P0420 tamir ücreti',
    'katalitik konvertör fiyatı',
    'servis maliyeti'
  ],
  openGraph: {
    title: 'OBD Maliyet Hesaplayıcı | TamirHanem',
    description: 'Arıza kodunuz ve şehrinize göre tahmini tamir maliyetini öğrenin.',
    url: 'https://tamirhanem.com/obd/maliyet-hesapla',
  },
  alternates: {
    canonical: 'https://tamirhanem.com/obd/maliyet-hesapla',
  },
};

export default function CostEstimatorPage() {
  const breadcrumbs = [
    { name: 'Ana Sayfa', url: 'https://tamirhanem.com' },
    { name: 'OBD Kodları', url: 'https://tamirhanem.com/obd' },
    { name: 'Maliyet Hesapla', url: 'https://tamirhanem.com/obd/maliyet-hesapla' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-500 via-green-600 to-secondary-700 py-16 overflow-hidden">
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
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-green-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-green-200 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/obd" className="hover:text-white">OBD Kodları</Link>
            <span>/</span>
            <span className="text-white font-medium">Maliyet Hesapla</span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Maliyet Hesaplayıcı
              </h1>
              <p className="text-green-200">
                Şehir Bazlı Tahmini Tamir Maliyeti
              </p>
            </div>
          </div>

          <p className="text-green-100 text-lg max-w-3xl">
            Arıza kodunuzu ve bulunduğunuz şehri seçin, tahmini tamir maliyetini görün.
            İşçilik ücreti ve parça maliyeti bölgeden bölgeye değişir - biz bunu
            sizin için hesaplıyoruz.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <Calculator className="w-4 h-4" />
              Anlık Hesaplama
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <MapPin className="w-4 h-4" />
              81 İl
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <TrendingDown className="w-4 h-4" />
              Karşılaştırma
            </span>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-secondary-100 p-6">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-800 text-sm">Kod Girin</h3>
              <p className="text-secondary-500 text-xs mt-1">P0420 gibi</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-800 text-sm">Şehir Seçin</h3>
              <p className="text-secondary-500 text-xs mt-1">Tüm 81 il</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-800 text-sm">Maliyet Görün</h3>
              <p className="text-secondary-500 text-xs mt-1">İşçilik + parça</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-800 text-sm">Karşılaştırın</h3>
              <p className="text-secondary-500 text-xs mt-1">Şehirler arası</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CostEstimator />
      </section>

      {/* Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-info-50 border border-info-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 text-info-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-info-800 mb-2">Maliyet Tahminleri Hakkında</h3>
              <ul className="text-sm text-info-700 space-y-1">
                <li>• Bu tahminler ortalama piyasa verilerine dayanmaktadır</li>
                <li>• Gerçek fiyatlar araç markası, modeli ve yılına göre değişir</li>
                <li>• OEM (orijinal) parçalar muadil parçalardan daha pahalıdır</li>
                <li>• Yetkili servis fiyatları bağımsız servislerden yüksek olabilir</li>
                <li>• Kesin fiyat için servisten teklif alınız</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Kodunuzu Bilmiyor musunuz?
          </h2>
          <p className="text-secondary-700 mb-6">
            Belirtilerden başlayarak olası arıza kodlarını bulun.
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
