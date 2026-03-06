import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, Info, ArrowRight, Gauge } from 'lucide-react';
import { liveDataPIDs, pidCategories } from '@/data/live-data-pids';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import PIDSearchList from '@/components/live-data/PIDSearchList';

export const metadata: Metadata = {
  title: 'Canlı Veri Rehberi (PID) | OBD-II Sensör Parametreleri',
  description: 'OBD-II canlı veri parametreleri rehberi. STFT, LTFT yakıt düzeltme, O2 sensörleri, MAP, MAF, motor sıcaklığı ve diğer PID değerlerini anlayın.',
  keywords: [
    'OBD canlı veri',
    'PID parametreleri',
    'yakıt düzeltme STFT LTFT',
    'O2 sensörü',
    'MAP sensörü',
    'MAF sensörü',
    'motor teşhisi',
  ],
  openGraph: {
    title: 'Canlı Veri Rehberi (PID) | TamirHanem',
    description: 'OBD-II canlı veri parametreleri ve anlamları. Motor teşhisi için kapsamlı PID rehberi.',
    url: 'https://tamirhanem.com/obd/canli-veri',
  },
  alternates: {
    canonical: 'https://tamirhanem.com/obd/canli-veri',
  },
};

export default function LiveDataGuidePage() {
  const breadcrumbs = [
    { name: 'Ana Sayfa', url: 'https://tamirhanem.com' },
    { name: 'OBD Kodları', url: 'https://tamirhanem.com/obd' },
    { name: 'Canlı Veri Rehberi', url: 'https://tamirhanem.com/obd/canli-veri' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-primary-200 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/obd" className="hover:text-white">OBD Kodları</Link>
            <span>/</span>
            <span className="text-white font-medium">Canlı Veri Rehberi</span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Canlı Veri Rehberi (PID)
              </h1>
              <p className="text-primary-200">
                OBD-II Sensör Parametreleri ve Anlamları
              </p>
            </div>
          </div>

          <p className="text-primary-100 text-lg max-w-3xl">
            OBD-II canlı veri parametreleri, motorunuzun anlık durumunu gösteren değerlerdir.
            Bu rehberde yaygın PID değerlerini, normal aralıklarını ve anormal değerlerin
            ne anlama geldiğini öğrenebilirsiniz.
          </p>
        </div>
      </section>

      {/* Info Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <strong>PID Nedir?</strong> Parameter Identification (Parametre Tanımlama) kodları,
            OBD-II tarayıcıların motor kontrol ünitesinden (ECU) talep ettiği veri noktalarıdır.
            Her PID belirli bir sensör veya hesaplama değerini temsil eder.
          </div>
        </div>
      </section>

      {/* Search and Category Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PIDSearchList pids={liveDataPIDs} categories={pidCategories} />
      </section>

      {/* Understanding Live Data Section */}
      <section className="bg-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-secondary-800 mb-8 text-center">
            Canlı Veriyi Anlamak
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Gauge className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-secondary-800 mb-2">Normal Aralıklar</h3>
              <p className="text-secondary-600 text-sm">
                Her PID değeri için belirli normal aralıklar vardır. Bu aralıklar motor tipine
                ve çalışma koşullarına göre değişebilir.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-secondary-800 mb-2">Dinamik Değerler</h3>
              <p className="text-secondary-600 text-sm">
                O2 sensörleri ve yakıt düzeltme değerleri sürekli değişir. Önemli olan
                değerlerin mantıklı aralıklarda kalması ve anormal sabitlenme olmamasıdır.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Info className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-secondary-800 mb-2">İlişkili Kodlar</h3>
              <p className="text-secondary-600 text-sm">
                Canlı veri anormallikleri genellikle belirli arıza kodlarıyla ilişkilidir.
                Her PID detayında ilgili OBD kodlarını bulabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Arıza Kodu mu Arıyorsunuz?
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            OBD-II arıza kodları veritabanımızda P, B, C ve U kodlarının detaylı
            açıklamalarını, nedenlerini ve çözümlerini bulabilirsiniz.
          </p>
          <Link
            href="/obd"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
          >
            Arıza Kodlarını İncele
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
