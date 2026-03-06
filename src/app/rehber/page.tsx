import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, AlertTriangle, Wrench, Clock, ArrowRight, Shield } from 'lucide-react';
import { educationalGuides } from '@/data/educational-guides';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Araç Bakım ve Arıza Rehberi | TamirHanem',
  description: 'Araç bakımı, arıza teşhisi ve acil durumlar için kapsamlı rehberler. Check Engine, titreme, yağ ışığı ve daha fazlası hakkında uzman tavsiyeleri.',
  keywords: [
    'araç bakım rehberi',
    'check engine ne yapmalı',
    'araç titremesi',
    'yağ ışığı',
    'araba arıza',
    'araç teşhis',
  ],
  openGraph: {
    title: 'Araç Bakım ve Arıza Rehberi | TamirHanem',
    description: 'Araç sorunlarını anlayın ve çözün. Uzman tavsiyeleri ve adım adım rehberler.',
    url: 'https://tamirhanem.com/rehber',
  },
  alternates: {
    canonical: 'https://tamirhanem.com/rehber',
  },
};

const categoryInfo = {
  'karar-rehberi': {
    name: 'Karar Rehberleri',
    description: 'Acil durumlarda ne yapacağınızı adım adım öğrenin',
    icon: AlertTriangle,
    color: 'bg-red-100 text-red-600',
  },
  bakim: {
    name: 'Bakım Rehberleri',
    description: 'Düzenli bakım ve önleyici tedbirler',
    icon: Wrench,
    color: 'bg-blue-100 text-blue-600',
  },
  ariza: {
    name: 'Arıza Rehberleri',
    description: 'Yaygın arızaları tanıyın ve çözün',
    icon: Shield,
    color: 'bg-yellow-100 text-yellow-600',
  },
  guvenlik: {
    name: 'Güvenlik Rehberleri',
    description: 'Güvenli sürüş için ipuçları',
    icon: Shield,
    color: 'bg-green-100 text-green-600',
  },
};

export default function GuidesHubPage() {
  const breadcrumbs = [
    { name: 'Ana Sayfa', url: 'https://tamirhanem.com' },
    { name: 'Rehberler', url: 'https://tamirhanem.com/rehber' },
  ];

  // Group guides by category
  const groupedGuides = educationalGuides.reduce((acc, guide) => {
    if (!acc[guide.category]) {
      acc[guide.category] = [];
    }
    acc[guide.category].push(guide);
    return acc;
  }, {} as Record<string, typeof educationalGuides>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-primary-200 mb-6">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-white font-medium">Rehberler</span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Araç Bakım ve Arıza Rehberi
              </h1>
              <p className="text-primary-200">
                Uzman Tavsiyeleri ve Adım Adım Kılavuzlar
              </p>
            </div>
          </div>

          <p className="text-primary-100 text-lg max-w-3xl">
            Aracınızda bir sorun mu var? Bakım zamanı mı geldi? Uzman rehberlerimizle
            sorunları teşhis edin, doğru kararları verin ve aracınızın bakımını en iyi şekilde yapın.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/rehber/check-engine-ne-yapmaliyim"
            className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-3 hover:shadow-xl transition-shadow border-l-4 border-red-500"
          >
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <p className="font-semibold text-secondary-800">Check Engine Yanıyor</p>
              <p className="text-sm text-secondary-500">Ne yapmalısınız?</p>
            </div>
          </Link>
          <Link
            href="/rehber/arac-titriyorsa-kontrol-listesi"
            className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-3 hover:shadow-xl transition-shadow border-l-4 border-yellow-500"
          >
            <Shield className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="font-semibold text-secondary-800">Araç Titriyor</p>
              <p className="text-sm text-secondary-500">Nedenleri ve çözümleri</p>
            </div>
          </Link>
          <Link
            href="/rehber/yag-isigi-yandiginda"
            className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-3 hover:shadow-xl transition-shadow border-l-4 border-orange-500"
          >
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            <div>
              <p className="font-semibold text-secondary-800">Yağ Işığı Yandı</p>
              <p className="text-sm text-secondary-500">Acil durumda ne yapmalı?</p>
            </div>
          </Link>
        </div>
      </section>

      {/* All Guides by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {Object.entries(groupedGuides).map(([category, guides]) => {
            const info = categoryInfo[category as keyof typeof categoryInfo];
            if (!info) return null;
            const IconComponent = info.icon;

            return (
              <div key={category}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${info.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-800">{info.name}</h2>
                    <p className="text-secondary-500 text-sm">{info.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guides.map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/rehber/${guide.slug}`}
                      className="group bg-white rounded-xl shadow-card hover:shadow-lg transition-all p-6 border-2 border-transparent hover:border-primary-200"
                    >
                      <h3 className="font-semibold text-lg text-secondary-800 mb-2 group-hover:text-primary-600 transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-secondary-500 text-sm mb-4 line-clamp-2">
                        {guide.metaDescription}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-secondary-400">
                          <Clock className="w-4 h-4" />
                          <span>{guide.estimatedReadTime} dk okuma</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          guide.difficulty === 'kolay'
                            ? 'bg-green-100 text-green-700'
                            : guide.difficulty === 'orta'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {guide.difficulty === 'kolay' ? 'Kolay' : guide.difficulty === 'orta' ? 'Orta' : 'İleri'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Arıza Kodunu Biliyorsanız
            </h2>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              OBD-II arıza kodunuz varsa, veritabanımızda detaylı açıklama,
              nedenler ve çözümleri bulabilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/obd"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
              >
                Arıza Kodu Ara
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/obd-cihaz"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                OBD Cihazı Bağla
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
