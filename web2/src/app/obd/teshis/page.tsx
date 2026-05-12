import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import DiagnosticFlowSelector from '@/components/obd/DiagnosticFlow';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'İnteraktif Arıza Teşhisi | Adım Adım Tanı Rehberi',
  description: 'Araç arızalarını adım adım teşhis edin. Motor arızası, aşırı ısınma, fren sorunları için interaktif tanı rehberi.',
  keywords: [
    'arıza teşhisi',
    'araç tanı',
    'motor arızası teşhis',
    'check engine teşhis',
    'araç sorun bulma',
    'interaktif tanı'
  ],
  openGraph: {
    title: 'İnteraktif Arıza Teşhisi | TamirHanem',
    description: 'Araç arızalarını adım adım teşhis edin. Sorulara cevap vererek olası sorunu bulun.',
    url: 'https://tamirhanem.com/obd/teshis',
  },
  alternates: {
    canonical: 'https://tamirhanem.com/obd/teshis',
  },
};

export default function DiagnosticPage() {
  const breadcrumbs = [
    { name: 'Ana Sayfa', url: 'https://tamirhanem.com' },
    { name: 'OBD Kodları', url: 'https://tamirhanem.com/obd' },
    { name: 'Teşhis Rehberi', url: 'https://tamirhanem.com/obd/teshis' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-secondary-700 py-16 overflow-hidden">
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
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-orange-200 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/obd" className="hover:text-white">OBD Kodları</Link>
            <span>/</span>
            <span className="text-white font-medium">Teşhis Rehberi</span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                İnteraktif Teşhis Rehberi
              </h1>
              <p className="text-orange-200">
                Adım Adım Arıza Tespiti
              </p>
            </div>
          </div>

          <p className="text-orange-100 text-lg max-w-3xl">
            OBD cihazınız yok mu? Sorun değil! Sorulara cevap vererek aracınızdaki
            olası arızayı tespit edin. Her adımda güvenlik uyarıları ve çözüm önerileri alın.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <CheckCircle className="w-4 h-4" />
              Kolay Kullanım
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <Clock className="w-4 h-4" />
              2-5 Dakika
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <AlertTriangle className="w-4 h-4" />
              Güvenlik Uyarıları
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-secondary-100 p-6">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-secondary-800 text-sm">Sorun Seçin</h3>
              <p className="text-secondary-500 text-xs mt-1">Motor, Isınma, Fren</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-secondary-800 text-sm">Soruları Yanıtlayın</h3>
              <p className="text-secondary-500 text-xs mt-1">Basit evet/hayır</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-secondary-800 text-sm">Sonucu Görün</h3>
              <p className="text-secondary-500 text-xs mt-1">Olası arıza + OBD kodu</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-bold text-lg">4</span>
              </div>
              <h3 className="font-semibold text-secondary-800 text-sm">Aksiyon Alın</h3>
              <p className="text-secondary-500 text-xs mt-1">Randevu veya DIY</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Diagnostic Flows */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DiagnosticFlowSelector />
      </section>

      {/* Info Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Disclaimer */}
          <div className="bg-warning-50 border border-warning-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-warning-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-warning-800 mb-2">Önemli Uyarı</h3>
                <ul className="text-sm text-warning-700 space-y-1">
                  <li>• Bu araç profesyonel teşhisin yerine geçmez</li>
                  <li>• Güvenlik uyarılarını mutlaka dikkate alın</li>
                  <li>• Şüphe durumunda yetkili servise başvurun</li>
                  <li>• Motor çalışırken dikkatli olun</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-success-50 border border-success-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-success-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-success-800 mb-2">Bu Araç Size Yardımcı Olur</h3>
                <ul className="text-sm text-success-700 space-y-1">
                  <li>• Servise gitmeden önce ön fikir edinmenize</li>
                  <li>• Acil müdahale gereken durumları anlamanıza</li>
                  <li>• Tahmini maliyet hakkında bilgi sahibi olmanıza</li>
                  <li>• İlgili OBD kodlarını öğrenmenize</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Tools CTA */}
      <section className="bg-gradient-to-r from-secondary-800 to-secondary-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Diğer OBD Araçları
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/obd"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center transition-colors"
            >
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-white font-medium text-sm">Kod Arama</span>
            </Link>
            <Link
              href="/obd/semptom-ara"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center transition-colors"
            >
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white font-medium text-sm">Semptom Ara</span>
            </Link>
            <Link
              href="/obd/karsilastir"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center transition-colors"
            >
              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-white font-medium text-sm">Karşılaştır</span>
            </Link>
            <Link
              href="/obd/maliyet-hesapla"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center transition-colors"
            >
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-white font-medium text-sm">Maliyet Hesapla</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
