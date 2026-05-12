import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Wrench, Clock, DollarSign, CheckCircle, Phone, ArrowRight, HelpCircle } from 'lucide-react';
import { cities, getCityBySlug, getServiceBySlug, getAllCityServiceCombinations, topServices } from '@/data/cities';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import ServiceSchema from '@/components/seo/ServiceSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

interface PageProps {
  params: Promise<{ city: string; service: string }>;
}

// FAQ generator based on city and service
function generateFAQs(cityName: string, serviceName: string, priceRange: string) {
  return [
    {
      question: `${cityName}'da ${serviceName.toLowerCase()} ne kadar?`,
      answer: `${cityName}'da ${serviceName.toLowerCase()} fiyatları ortalama ${priceRange} arasında değişmektedir. Fiyat araç modeli, parça kalitesi ve servis türüne göre farklılık gösterebilir.`,
    },
    {
      question: `${cityName}'da en iyi ${serviceName.toLowerCase()} servisi hangisi?`,
      answer: `TamirHanem üzerinden ${cityName}'daki onlarca servis arasından değerlendirme ve yorumlara göre en uygun servisi bulabilirsiniz. Tüm servisler kalite kontrol sürecinden geçmiştir.`,
    },
    {
      question: `${serviceName} ne kadar sürer?`,
      answer: `${serviceName} işlemi genellikle araç modeline ve işlemin kapsamına göre değişmekle birlikte, ortalama süre belirlenmiştir. Randevu alırken kesin süre bilgisi alabilirsiniz.`,
    },
    {
      question: `${serviceName} için randevu nasıl alınır?`,
      answer: `TamirHanem üzerinden ${cityName}'daki servislere online randevu alabilir, fiyat karşılaştırması yapabilir ve kullanıcı yorumlarını inceleyebilirsiniz.`,
    },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const city = getCityBySlug(resolvedParams.city);
  const service = getServiceBySlug(resolvedParams.service);

  if (!city || !service) {
    return {
      title: 'Sayfa Bulunamadı',
      description: 'Aradığınız sayfa bulunamadı.',
    };
  }

  const title = `${city.name} ${service.name} | Fiyat ve Servisler`;
  const description = `${city.name}'da ${service.name.toLowerCase()} hizmeti. ${service.description}. Fiyat: ${service.priceRange}. Güvenilir servislerden teklif alın.`;

  return {
    title,
    description,
    keywords: [
      `${city.name} ${service.name.toLowerCase()}`,
      `${city.name} ${service.name.toLowerCase()} fiyat`,
      `${city.name} ${service.name.toLowerCase()} servis`,
      `${city.name} oto servis`,
      service.name.toLowerCase(),
    ],
    openGraph: {
      title,
      description,
      url: `https://tamirhanem.com/${city.slug}/${service.slug}`,
    },
    alternates: {
      canonical: `https://tamirhanem.com/${city.slug}/${service.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return getAllCityServiceCombinations();
}

export default async function CityServicePage({ params }: PageProps) {
  const resolvedParams = await params;
  const city = getCityBySlug(resolvedParams.city);
  const service = getServiceBySlug(resolvedParams.service);

  if (!city || !service) {
    notFound();
  }

  const faqs = generateFAQs(city.name, service.name, service.priceRange);
  const pageUrl = `https://tamirhanem.com/${city.slug}/${service.slug}`;

  const breadcrumbs = [
    { name: 'Ana Sayfa', url: 'https://tamirhanem.com' },
    { name: city.name, url: `https://tamirhanem.com/${city.slug}` },
    { name: service.name, url: pageUrl },
  ];

  // Other services for cross-linking
  const otherServices = topServices.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      {/* Structured Data */}
      <LocalBusinessSchema
        name={`TamirHanem ${city.name}`}
        description={`${city.name}'da ${service.name.toLowerCase()} hizmeti`}
        city={city.name}
        lat={city.lat}
        lng={city.lng}
        serviceType={[service.name, 'Araç Bakımı']}
        url={pageUrl}
      />
      <ServiceSchema
        name={`${city.name} ${service.name}`}
        description={`${city.name}'da ${service.name.toLowerCase()} hizmeti. ${service.description}`}
        provider="TamirHanem"
        areaServed={city.name}
        priceRange={service.priceRange}
        url={pageUrl}
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-primary-200 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link href={`/${city.slug}`} className="hover:text-white">
              {city.name}
            </Link>
            <span>/</span>
            <span className="text-white font-medium">{service.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary-200" />
                <span className="text-primary-200">{city.name}</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {city.name} {service.name}
              </h1>

              <p className="text-primary-100 text-lg mb-6">
                {service.description}. {city.name} şehrinde güvenilir servislerden
                {' '}{service.name.toLowerCase()} hizmeti alın.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/servisler/sonuclar?city=${city.slug}&service=${service.slug}`}
                  className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
                >
                  Servis Bul
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="tel:08502122122"
                  className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Hemen Ara
                </a>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-secondary-500 text-sm">Tahmini Fiyat</p>
                  <p className="text-2xl font-bold text-secondary-800">{service.priceRange}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-secondary-600">
                  <Clock className="w-5 h-5 text-secondary-400" />
                  <span>Süre: {service.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-secondary-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Garanti dahil</span>
                </div>
                <div className="flex items-center gap-3 text-secondary-600">
                  <DollarSign className="w-5 h-5 text-secondary-400" />
                  <span>Parça + İşçilik dahil</span>
                </div>
              </div>

              <Link
                href={`/fiyat-hesapla?service=${service.slug}&city=${city.slug}`}
                className="w-full block text-center bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Detaylı Fiyat Hesapla
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Service */}
            <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">
                {city.name}&apos;da {service.name} Hakkında
              </h2>
              <div className="prose prose-secondary max-w-none">
                <p>
                  {city.name} şehrinde {service.name.toLowerCase()} hizmeti arıyorsanız doğru yerdesiniz.
                  TamirHanem olarak {city.name}&apos;daki en güvenilir oto servisleri bir araya getirdik.
                </p>
                <p>
                  {service.description}. {city.name}&apos;da bu hizmeti sunan onlarca servis arasından
                  size en uygun olanı seçebilir, fiyat karşılaştırması yapabilir ve online randevu alabilirsiniz.
                </p>
                <h3>Neden {city.name}&apos;da TamirHanem?</h3>
                <ul>
                  <li><strong>Güvenilir Servisler:</strong> Tüm servisler kalite kontrol sürecinden geçmiştir.</li>
                  <li><strong>Şeffaf Fiyatlandırma:</strong> Önceden fiyat bilgisi alın, sürpriz yok.</li>
                  <li><strong>Garanti:</strong> Yapılan işlemler için garanti verilmektedir.</li>
                  <li><strong>Kolay Randevu:</strong> Online randevu sistemi ile zaman kaybetmeyin.</li>
                </ul>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-secondary-800 mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary-500" />
                Sık Sorulan Sorular
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-secondary-100 pb-4 last:border-0">
                    <h3 className="font-semibold text-secondary-800 mb-2">{faq.question}</h3>
                    <p className="text-secondary-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Other Services */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="font-bold text-secondary-800 mb-4">
                {city.name}&apos;da Diğer Servisler
              </h3>
              <div className="space-y-3">
                {otherServices.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${city.slug}/${s.slug}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary-50 transition-colors group"
                  >
                    <span className="text-secondary-700 group-hover:text-primary-600">{s.name}</span>
                    <ArrowRight className="w-4 h-4 text-secondary-400 group-hover:text-primary-500" />
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-2">Hemen Başlayın</h3>
              <p className="text-primary-100 text-sm mb-4">
                {city.name}&apos;da {service.name.toLowerCase()} için hemen fiyat alın.
              </p>
              <Link
                href={`/servisler/sonuclar?city=${city.slug}&service=${service.slug}`}
                className="block w-full text-center bg-white text-primary-600 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Servis Bul
              </Link>
            </div>

            {/* Nearby Cities */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="font-bold text-secondary-800 mb-4">Yakın Şehirler</h3>
              <div className="flex flex-wrap gap-2">
                {cities
                  .filter((c) => c.slug !== city.slug)
                  .slice(0, 5)
                  .map((c) => (
                    <Link
                      key={c.slug}
                      href={`/${c.slug}/${service.slug}`}
                      className="text-sm px-3 py-1.5 bg-secondary-100 hover:bg-primary-100 text-secondary-600 hover:text-primary-600 rounded-lg transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
