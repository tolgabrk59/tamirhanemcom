import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { BookOpen, Clock, ArrowRight, AlertTriangle, Link2 } from 'lucide-react';
import { getGuideBySlug, getAllGuideSlugs, educationalGuides } from '@/data/educational-guides';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import PrintButton from '@/components/content/PrintButton';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Dynamic import for client-side flowchart
const DecisionFlowchart = dynamic(
  () => import('@/components/content/DecisionFlowchart'),
  { ssr: false }
);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const guide = getGuideBySlug(resolvedParams.slug);

  if (!guide) {
    return {
      title: 'Rehber Bulunamadı',
      description: 'Aradığınız rehber bulunamadı.',
    };
  }

  return {
    title: `${guide.title} | TamirHanem Rehber`,
    description: guide.metaDescription,
    keywords: [
      guide.title.toLowerCase(),
      'araç bakım',
      'arıza rehberi',
      ...(guide.relatedObdCodes || []),
    ],
    openGraph: {
      title: guide.title,
      description: guide.metaDescription,
      url: `https://tamirhanem.com/rehber/${guide.slug}`,
    },
    alternates: {
      canonical: `https://tamirhanem.com/rehber/${guide.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return getAllGuideSlugs();
}

export default async function GuidePage({ params }: PageProps) {
  const resolvedParams = await params;
  const guide = getGuideBySlug(resolvedParams.slug);

  if (!guide) {
    notFound();
  }

  const pageUrl = `https://tamirhanem.com/rehber/${guide.slug}`;

  const breadcrumbs = [
    { name: 'Ana Sayfa', url: 'https://tamirhanem.com' },
    { name: 'Rehberler', url: 'https://tamirhanem.com/rehber' },
    { name: guide.title, url: pageUrl },
  ];

  // Generate FAQ from guide content
  const faqs = [
    {
      question: guide.title,
      answer: guide.metaDescription,
    },
  ];

  // Get related guides
  const relatedGuides = educationalGuides
    .filter((g) => g.slug !== guide.slug && g.category === guide.category)
    .slice(0, 3);

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
            <Link href="/rehber" className="hover:text-white">Rehberler</Link>
            <span>/</span>
            <span className="text-white font-medium truncate max-w-[200px]">{guide.title}</span>
          </nav>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  guide.category === 'karar-rehberi'
                    ? 'bg-red-500/20 text-red-100'
                    : guide.category === 'bakim'
                    ? 'bg-blue-500/20 text-blue-100'
                    : 'bg-yellow-500/20 text-yellow-100'
                }`}>
                  {guide.category === 'karar-rehberi' ? 'Karar Rehberi' : guide.category === 'bakim' ? 'Bakım' : 'Arıza'}
                </span>
                <span className="flex items-center gap-1 text-primary-200 text-sm">
                  <Clock className="w-4 h-4" />
                  {guide.estimatedReadTime} dk okuma
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                {guide.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Decision Flowchart (if available) */}
            {guide.steps && guide.steps.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="text-xl font-bold text-secondary-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary-500" />
                  İnteraktif Teşhis Rehberi
                </h2>
                <p className="text-secondary-600 text-sm mb-4">
                  Aşağıdaki soruları cevaplayarak durumunuza uygun tavsiyeyi alın.
                </p>
                <DecisionFlowchart steps={guide.steps} />
              </div>
            )}

            {/* Article Content */}
            <article className="bg-white rounded-2xl shadow-card p-6 md:p-8">
              <div className="prose prose-secondary max-w-none">
                {guide.content.split('\n').map((paragraph, index) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;

                  if (trimmed.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-xl font-bold text-secondary-800 mt-6 mb-3">
                        {trimmed.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (trimmed.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-lg font-semibold text-secondary-700 mt-4 mb-2">
                        {trimmed.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (trimmed.startsWith('- ')) {
                    return (
                      <li key={index} className="text-secondary-600 ml-4">
                        {trimmed.replace('- ', '')}
                      </li>
                    );
                  }
                  if (/^\d+\./.test(trimmed)) {
                    return (
                      <li key={index} className="text-secondary-600 ml-4 list-decimal">
                        {trimmed.replace(/^\d+\.\s*/, '')}
                      </li>
                    );
                  }
                  return (
                    <p key={index} className="text-secondary-600 mb-3">
                      {trimmed}
                    </p>
                  );
                })}
              </div>

              {/* Print Button */}
              <div className="mt-8 pt-6 border-t border-secondary-100">
                <PrintButton />
              </div>
            </article>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="font-bold text-secondary-800 mb-4">Hızlı Bilgi</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-secondary-500">Kategori</dt>
                  <dd className="font-medium text-secondary-800">
                    {guide.category === 'karar-rehberi' ? 'Karar Rehberi' : guide.category === 'bakim' ? 'Bakım' : 'Arıza'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary-500">Zorluk</dt>
                  <dd className="font-medium text-secondary-800">
                    {guide.difficulty === 'kolay' ? 'Kolay' : guide.difficulty === 'orta' ? 'Orta' : 'İleri'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary-500">Okuma Süresi</dt>
                  <dd className="font-medium text-secondary-800">{guide.estimatedReadTime} dakika</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary-500">Güncelleme</dt>
                  <dd className="font-medium text-secondary-800">{guide.lastUpdated}</dd>
                </div>
              </dl>
            </div>

            {/* Related OBD Codes */}
            {guide.relatedObdCodes && guide.relatedObdCodes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-bold text-secondary-800 mb-4 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-primary-500" />
                  İlgili Arıza Kodları
                </h3>
                <div className="flex flex-wrap gap-2">
                  {guide.relatedObdCodes.map((code) => (
                    <Link
                      key={code}
                      href={`/obd/${code.toLowerCase()}`}
                      className="px-3 py-1.5 bg-secondary-100 hover:bg-primary-100 text-secondary-700 hover:text-primary-700 rounded-lg font-mono text-sm transition-colors"
                    >
                      {code}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Guides */}
            {relatedGuides.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-bold text-secondary-800 mb-4">Benzer Rehberler</h3>
                <div className="space-y-3">
                  {relatedGuides.map((relatedGuide) => (
                    <Link
                      key={relatedGuide.slug}
                      href={`/rehber/${relatedGuide.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary-50 transition-colors group"
                    >
                      <span className="text-secondary-700 text-sm group-hover:text-primary-600">
                        {relatedGuide.title}
                      </span>
                      <ArrowRight className="w-4 h-4 text-secondary-400 group-hover:text-primary-500" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-2">Profesyonel Yardım?</h3>
              <p className="text-primary-100 text-sm mb-4">
                Sorununuz devam ediyorsa size en yakın güvenilir servisi bulun.
              </p>
              <Link
                href="/servisler"
                className="block w-full text-center bg-white text-primary-600 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Servis Bul
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
