import type { Metadata } from 'next';
import Link from 'next/link';
import CostEstimator from '@/components/CostEstimator';
import { servicesData, getServiceCategories } from '@/data/services';

export const metadata: Metadata = {
  title: 'Fiyat Hesapla - Araç Tamir ve Bakım Maliyeti',
  description:
    'Araç tamir ve bakım maliyetini önceden hesaplayın. Yağ değişimi, fren bakımı, motor tamiri ve daha fazlası için tahmini fiyatları öğrenin.',
  keywords: [
    'araç tamir fiyat',
    'bakım maliyeti',
    'yağ değişimi fiyat',
    'fren bakımı fiyat',
    'oto servis fiyat',
    'araç tamir hesapla',
  ],
  openGraph: {
    title: 'Fiyat Hesapla - Araç Tamir Maliyeti | TamirHanem',
    description: 'Araç tamir ve bakım maliyetini önceden hesaplayın.',
    url: 'https://tamirhanem.com/fiyat-hesapla',
  },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FiyatHesaplaPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const brand = typeof resolvedParams.brand === 'string' ? resolvedParams.brand : '';
  const model = typeof resolvedParams.model === 'string' ? resolvedParams.model : '';
  const year = typeof resolvedParams.year === 'string' ? resolvedParams.year : '';
  const service = typeof resolvedParams.service === 'string' ? resolvedParams.service : '';

  const categories = getServiceCategories();

  return (
    <div className="bg-secondary-50 min-h-screen">
      {/* Hero Section - Modern Gradient Theme */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            {/* Warning Badge */}
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/30 rounded-full px-4 py-2 mb-4">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-yellow-300 font-semibold text-sm">Örnek Fiyatlar - Bilgilendirme Amaçlıdır</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Tamir Maliyetini <span className="text-primary-400">Hesaplayın</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Aracınızın markası, modeli ve yapılacak işleme göre tahmini maliyeti öğrenin.
              Servis fiyatlarını karşılaştırın ve bütçenizi planlayın.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-3xl mx-auto shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2 text-lg">
                  ⚠️ Önemli Bilgilendirme
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                  <strong className="text-yellow-300">Bu sayfada gösterilen fiyatlar örnek verilerdir.</strong> Elimizde henüz canlı, güncel servis fiyat verileri bulunmamaktadır.
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Gösterilen fiyatlar, genel piyasa araştırmalarına dayalı tahmini değerlerdir ve sadece fikir vermek amacıyla sunulmaktadır. Gerçek fiyatlar; araç markası, model yılı, kullanılan parça kalitesi ve bölgesel farklılıklara göre değişiklik gösterebilir. <strong className="text-white">Kesin fiyat için mutlaka servislerden teklif alınız.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gradient-to-b from-secondary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cost Estimator */}
            <div className="lg:col-span-2">
              <CostEstimator
                initialBrand={brand}
                initialModel={model}
                initialYear={year}
                initialService={service}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Popular Services */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-secondary-100">
                <h3 className="font-bold text-xl mb-5" style={{ color: '#454545' }}>
                  Popüler Hizmetler
                </h3>
                <ul className="space-y-2">
                  {servicesData.slice(0, 6).map((service) => (
                    <li key={service.id}>
                      <Link
                        href={`/fiyat-hesapla?service=${service.slug}`}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all group"
                      >
                        <span className="text-secondary-700 group-hover:text-primary-700 font-medium transition-colors">{service.name}</span>
                        <span className="text-sm text-primary-600 font-bold">
                          {service.priceMin.toLocaleString('tr-TR')} - {service.priceMax.toLocaleString('tr-TR')} ₺
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <h4 className="font-bold text-xl mb-2">
                  Kesin Fiyat İçin Teklif Alın
                </h4>
                <p className="text-primary-100 text-sm mb-5 leading-relaxed">
                  Güvenilir servislerden ücretsiz fiyat teklifi alın ve en uygun seçeneği bulun
                </p>
                <Link
                  href="/randevu-al"
                  className="block w-full bg-white text-primary-600 px-4 py-3 rounded-xl hover:bg-primary-50 transition-all font-bold text-center shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Randevu Al
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-primary-100 rounded-full px-6 py-2 mb-4">
              <span className="text-primary-700 font-bold text-sm">TÜM HİZMETLER</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: '#454545' }}>
              Kategoriye Göre Servis Fiyatları
            </h2>
            <p className="text-secondary-600 text-lg max-w-2xl mx-auto">
              Tüm servis kategorilerinde güncel fiyat aralıklarını inceleyin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const categoryServices = servicesData.filter(
                (s) => s.category === category
              );
              return (
                <div key={category} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-secondary-100 hover:border-primary-200 transform hover:scale-105">
                  <h3 className="font-bold text-xl mb-5 text-primary-600">
                    {category}
                  </h3>
                  <ul className="space-y-3">
                    {categoryServices.map((service) => (
                      <li
                        key={service.id}
                        className="flex items-start justify-between text-sm pb-3 border-b border-secondary-100 last:border-0 last:pb-0"
                      >
                        <span className="text-secondary-700 flex-1 pr-2 font-medium">{service.name}</span>
                        <span className="text-primary-600 font-bold whitespace-nowrap">
                          {service.priceMin.toLocaleString('tr-TR')} - {service.priceMax.toLocaleString('tr-TR')} ₺
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-green-100 rounded-full px-6 py-2 mb-4">
              <span className="text-green-700 font-bold text-sm">TASARRUF İPUÇLARI</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: '#454545' }}>
              Akıllıca Tasarruf Edin
            </h2>
            <p className="text-secondary-600 text-lg max-w-2xl mx-auto">
              Akıllıca kararlar alarak araç bakım maliyetlerinizi düşürün
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 via-green-100 to-green-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-green-200 hover:border-green-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mb-5 shadow-xl transform hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3 text-green-900">
                Fiyatları Karşılaştırın
              </h3>
              <p className="text-green-800 text-sm leading-relaxed">
                Farklı servislerden teklif alarak en uygun fiyatı bulun.
                Aynı işlem için fiyatlar servisler arasında ciddi farklılık gösterebilir.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-5 shadow-xl transform hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3 text-blue-900">
                Parça Seçeneklerini Değerlendirin
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                OES (orijinal ekipman tedarikçisi) parçalar, orijinal kalitede
                ancak daha uygun fiyatlı olabilir. Servisinizden seçenekleri sorun.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-2xl flex items-center justify-center mb-5 shadow-xl transform hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3 text-yellow-900">
                Periyodik Bakımı İhmal Etmeyin
              </h3>
              <p className="text-yellow-800 text-sm leading-relaxed">
                Düzenli bakım, büyük arızaların önüne geçer. Küçük harcamalar
                yaparak ileride çok daha büyük masraflardan kaçınabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
