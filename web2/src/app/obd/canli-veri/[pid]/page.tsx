import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Activity, ArrowRight, AlertTriangle, CheckCircle, Gauge, Wrench, BookOpen, Link2 } from 'lucide-react';
import { liveDataPIDs, getPIDByCode, getAllPIDSlugs, pidCategories } from '@/data/live-data-pids';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import FAQSchema from '@/components/seo/FAQSchema';

interface PageProps {
  params: Promise<{ pid: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const pid = getPIDByCode(resolvedParams.pid.toUpperCase());

  if (!pid) {
    return {
      title: 'PID Bulunamadı',
      description: 'Aradığınız PID kodu bulunamadı.',
    };
  }

  return {
    title: `${pid.nameTr} (PID ${pid.pidCode}) | Canlı Veri Rehberi`,
    description: `${pid.nameTr} - ${pid.description}. Normal aralık: ${pid.normalRangeMin}-${pid.normalRangeMax} ${pid.unit}. Teşhis ipuçları ve ilgili arıza kodları.`,
    keywords: [
      pid.nameTr,
      `PID ${pid.pidCode}`,
      pid.name,
      'OBD canlı veri',
      'motor teşhisi',
    ],
    openGraph: {
      title: `${pid.nameTr} | TamirHanem`,
      description: pid.description,
      url: `https://tamirhanem.com/obd/canli-veri/${pid.pidCode.toLowerCase()}`,
    },
    alternates: {
      canonical: `https://tamirhanem.com/obd/canli-veri/${pid.pidCode.toLowerCase()}`,
    },
  };
}

export async function generateStaticParams() {
  return getAllPIDSlugs();
}

export default async function PIDDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const pid = getPIDByCode(resolvedParams.pid.toUpperCase());

  if (!pid) {
    notFound();
  }

  const category = pidCategories[pid.category as keyof typeof pidCategories];
  const pageUrl = `https://tamirhanem.com/obd/canli-veri/${pid.pidCode.toLowerCase()}`;

  const breadcrumbs = [
    { name: 'Ana Sayfa', url: 'https://tamirhanem.com' },
    { name: 'OBD Kodları', url: 'https://tamirhanem.com/obd' },
    { name: 'Canlı Veri Rehberi', url: 'https://tamirhanem.com/obd/canli-veri' },
    { name: pid.nameTr, url: pageUrl },
  ];

  // Generate FAQ items
  const faqs = [
    {
      question: `${pid.nameTr} değeri ne olmalı?`,
      answer: `${pid.nameTr} için normal aralık ${pid.normalRangeMin} ile ${pid.normalRangeMax} ${pid.unit} arasındadır. Bu aralık dışındaki değerler sorun işareti olabilir.`,
    },
    {
      question: `PID ${pid.pidCode} nedir?`,
      answer: pid.description,
    },
    {
      question: `${pid.nameTr} anormal olursa ne yapmalıyım?`,
      answer: pid.troubleshootingTips?.[0] || 'Anormal değerler tespit edildiğinde profesyonel bir teşhis önerilir.',
    },
  ];

  // Get related PIDs (same category)
  const relatedPIDs = liveDataPIDs
    .filter((p) => p.category === pid.category && p.pidCode !== pid.pidCode)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={faqs} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-primary-200 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/obd" className="hover:text-white">OBD</Link>
            <span>/</span>
            <Link href="/obd/canli-veri" className="hover:text-white">Canlı Veri</Link>
            <span>/</span>
            <span className="text-white font-medium">PID {pid.pidCode}</span>
          </nav>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-white/20 text-white text-sm font-mono rounded-full">
                  PID {pid.pidCode}
                </span>
                <span className="px-3 py-1 bg-white/10 text-primary-100 text-sm rounded-full">
                  {category?.nameTr}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                {pid.nameTr}
              </h1>
              <p className="text-primary-100 text-sm">
                {pid.name}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-bold text-secondary-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-500" />
                Açıklama
              </h2>
              <p className="text-secondary-700 leading-relaxed">
                {pid.description}
              </p>
              {pid.diagnosticRelevance && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                  <p className="text-blue-800 text-sm">
                    <strong>Teşhis Önemi:</strong> {pid.diagnosticRelevance}
                  </p>
                </div>
              )}
            </div>

            {/* Normal Range */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-bold text-secondary-800 mb-4 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-primary-500" />
                Değer Aralıkları
              </h2>

              <div className="space-y-4">
                {/* Visual Range Indicator */}
                <div className="relative h-8 bg-secondary-100 rounded-full overflow-hidden">
                  {/* Warning Low */}
                  {pid.warningMin !== undefined && (
                    <div
                      className="absolute h-full bg-red-200"
                      style={{
                        left: '0%',
                        width: `${((pid.normalRangeMin - (pid.warningMin || 0)) / ((pid.warningMax || 100) - (pid.warningMin || 0))) * 100}%`,
                      }}
                    />
                  )}
                  {/* Normal Range */}
                  <div
                    className="absolute h-full bg-green-400"
                    style={{
                      left: `${((pid.normalRangeMin - (pid.warningMin || 0)) / ((pid.warningMax || 100) - (pid.warningMin || 0))) * 100}%`,
                      width: `${((pid.normalRangeMax - pid.normalRangeMin) / ((pid.warningMax || 100) - (pid.warningMin || 0))) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Normal Aralık</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      {pid.normalRangeMin} - {pid.normalRangeMax} {pid.unit}
                    </p>
                  </div>

                  {(pid.warningMin !== undefined || pid.warningMax !== undefined) && (
                    <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">Uyarı Aralığı</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-700">
                        {pid.warningMin} - {pid.warningMax} {pid.unit}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Troubleshooting Tips */}
            {pid.troubleshootingTips && pid.troubleshootingTips.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="text-xl font-bold text-secondary-800 mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-primary-500" />
                  Teşhis İpuçları
                </h2>
                <ul className="space-y-3">
                  {pid.troubleshootingTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-secondary-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related OBD Codes */}
            {pid.relatedCodes && pid.relatedCodes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="text-xl font-bold text-secondary-800 mb-4 flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-primary-500" />
                  İlgili Arıza Kodları
                </h2>
                <p className="text-secondary-600 text-sm mb-4">
                  Bu PID değerindeki anormallikler aşağıdaki arıza kodlarıyla ilişkili olabilir:
                </p>
                <div className="flex flex-wrap gap-2">
                  {pid.relatedCodes.map((code) => (
                    <Link
                      key={code}
                      href={`/obd/${code.toLowerCase()}`}
                      className="px-4 py-2 bg-secondary-100 hover:bg-primary-100 text-secondary-700 hover:text-primary-700 rounded-lg font-mono text-sm transition-colors"
                    >
                      {code}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-bold text-secondary-800 mb-4">
                Sık Sorulan Sorular
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-secondary-100 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-secondary-800 mb-2">{faq.question}</h3>
                    <p className="text-secondary-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="font-bold text-secondary-800 mb-4">Hızlı Bilgi</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-secondary-500">PID Kodu</dt>
                  <dd className="font-mono font-semibold text-secondary-800">{pid.pidCode}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary-500">Birim</dt>
                  <dd className="font-semibold text-secondary-800">{pid.unit}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary-500">Kategori</dt>
                  <dd className="font-semibold text-secondary-800">{category?.nameTr}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary-500">Grafik Tipi</dt>
                  <dd className="font-semibold text-secondary-800">
                    {pid.chartType === 'gauge' ? 'Gösterge' : pid.chartType === 'line' ? 'Çizgi' : 'Bar'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Related PIDs */}
            {relatedPIDs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-bold text-secondary-800 mb-4">
                  İlgili Parametreler
                </h3>
                <div className="space-y-3">
                  {relatedPIDs.map((relatedPID) => (
                    <Link
                      key={relatedPID.pidCode}
                      href={`/obd/canli-veri/${relatedPID.pidCode.toLowerCase()}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary-50 transition-colors group"
                    >
                      <div>
                        <span className="text-xs font-mono text-secondary-400">
                          PID {relatedPID.pidCode}
                        </span>
                        <p className="text-secondary-700 text-sm group-hover:text-primary-600">
                          {relatedPID.nameTr}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-secondary-400 group-hover:text-primary-500" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-2">OBD Cihazı Bağlayın</h3>
              <p className="text-primary-100 text-sm mb-4">
                Aracınızdan canlı veri okumak için OBD-II cihazınızı bağlayın.
              </p>
              <Link
                href="/obd-cihaz"
                className="block w-full text-center bg-white text-primary-600 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Cihaz Bağla
              </Link>
            </div>

            {/* All PIDs Link */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <Link
                href="/obd/canli-veri"
                className="flex items-center justify-between text-primary-600 hover:text-primary-700"
              >
                <span className="font-semibold">Tüm PID Parametreleri</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
