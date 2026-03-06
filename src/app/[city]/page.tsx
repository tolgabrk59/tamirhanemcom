import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Wrench, ArrowRight, Clock, Star } from 'lucide-react';
import { cities, getCityBySlug, topServices } from '@/data/cities';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const city = getCityBySlug(resolvedParams.city);

  if (!city) {
    return {
      title: 'Şehir Bulunamadı',
      description: 'Aradığınız şehir bulunamadı.',
    };
  }

  return {
    title: `${city.name} Oto Servis ve Araç Bakım Hizmetleri`,
    description: `${city.name} şehrinde güvenilir oto servis, araç bakım ve onarım hizmetleri. ${city.name}'da en iyi yağ değişimi, fren bakımı, debriyaj değişimi servisleri.`,
    keywords: [
      `${city.name} oto servis`,
      `${city.name} araç bakım`,
      `${city.name} motor tamir`,
      `${city.name} yağ değişimi`,
      `${city.name} fren servisi`,
    ],
    openGraph: {
      title: `${city.name} Oto Servis ve Araç Bakım | TamirHanem`,
      description: `${city.name}'da güvenilir araç servisi bulun. Şeffaf fiyatlandırma, kaliteli hizmet.`,
      url: `https://tamirhanem.com/${city.slug}`,
    },
    alternates: {
      canonical: `https://tamirhanem.com/${city.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return cities.map((city) => ({
    city: city.slug,
  }));
}

export default async function CityPage({ params }: PageProps) {
  const resolvedParams = await params;
  const city = getCityBySlug(resolvedParams.city);

  if (!city) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Ana Sayfa', url: 'https://tamirhanem.com' },
    { name: city.name, url: `https://tamirhanem.com/${city.slug}` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      {/* Structured Data */}
      <LocalBusinessSchema
        name={`TamirHanem ${city.name}`}
        description={`${city.name} şehrinde araç bakım ve onarım hizmetleri`}
        city={city.name}
        lat={city.lat}
        lng={city.lng}
        url={`https://tamirhanem.com/${city.slug}`}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-primary-200 mb-6">
            <Link href="/" className="hover:text-white">
              Ana Sayfa
            </Link>
            <span>/</span>
            <span className="text-white font-medium">{city.name}</span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-primary-200 text-sm">
                {city.plateCode} Plaka
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {city.name} Oto Servisleri
              </h1>
            </div>
          </div>

          <p className="text-primary-100 text-lg max-w-2xl">
            {city.name} şehrinde güvenilir oto servis, araç bakım ve onarım hizmetleri.
            Aşağıdan ihtiyacınız olan servisi seçin ve hemen fiyat alın.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-secondary-800 mb-8">
          {city.name} Popüler Servisler
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topServices.map((service) => (
            <Link
              key={service.slug}
              href={`/${city.slug}/${service.slug}`}
              className="group bg-white rounded-2xl shadow-card hover:shadow-lg transition-all p-6 border-2 border-transparent hover:border-primary-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <Wrench className="w-6 h-6 text-primary-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-secondary-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </div>

              <h3 className="text-xl font-bold text-secondary-800 mb-2 group-hover:text-primary-600 transition-colors">
                {city.name} {service.name}
              </h3>
              <p className="text-secondary-600 text-sm mb-4">
                {service.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-secondary-500">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration}</span>
                </div>
                <div className="font-semibold text-primary-600">
                  {service.priceRange}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-secondary-800 mb-8 text-center">
            Neden {city.name}&apos;da TamirHanem?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-secondary-800 mb-2">Güvenilir Servisler</h3>
              <p className="text-secondary-600 text-sm">
                {city.name}&apos;daki tüm servisleri değerlendirdik ve en iyilerini seçtik.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-secondary-800 mb-2">Şeffaf Fiyatlandırma</h3>
              <p className="text-secondary-600 text-sm">
                Tüm işlemler için önceden fiyat bilgisi alın, sürpriz yok.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-secondary-800 mb-2">Kolay Erişim</h3>
              <p className="text-secondary-600 text-sm">
                {city.name}&apos;ın her bölgesinde erişilebilir servisler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {city.name}&apos;da Araç Servisine mi İhtiyacınız Var?
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Yukarıdan ihtiyacınız olan servisi seçin veya doğrudan servis arayın.
            Güvenilir servislerden hemen fiyat teklifi alın.
          </p>
          <Link
            href="/servisler"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
          >
            Tüm Servisleri Gör
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
