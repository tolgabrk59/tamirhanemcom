import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hakkımızda - TamirHanem Hikayesi',
  description:
    'TamirHanem, Türkiye\'nin önde gelen araç bakım ve onarım platformudur. Misyonumuz, şeffaf fiyatlandırma ve kaliteli hizmet sunmaktır.',
  keywords: [
    'TamirHanem',
    'hakkımızda',
    'araç bakım platformu',
    'oto servis',
    'güvenilir servis',
  ],
  openGraph: {
    title: 'Hakkımızda | TamirHanem',
    description: 'TamirHanem hikayesi ve misyonumuz.',
    url: 'https://tamirhanem.com/hakkimizda',
  },
};

export default function HakkimizdaPage() {
  return (
    <div className="bg-secondary-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-primary-200 mb-6">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-white">Hakkımızda</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl">
            Araç sahiplerini güvenilir servislerle buluşturuyoruz
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            TamirHanem, araç bakım ve onarım sürecini şeffaf, güvenilir ve
            kolay hale getirmek için kuruldu.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                Misyonumuz
              </h2>
              <p className="text-secondary-600 mb-4 leading-relaxed">
                Araç sahiplerinin servis deneyimini kökten değiştirmek için yola çıktık.
                Geleneksel oto tamir sektöründeki belirsizlik, güvensizlik ve fiyat
                şeffaflığı eksikliği sorunlarına çözüm üretiyoruz.
              </p>
              <p className="text-secondary-600 mb-4 leading-relaxed">
                Platformumuz sayesinde araç sahipleri, yapılacak işlemin ne olduğunu,
                ne kadara mal olacağını ve hangi servisin en uygun olduğunu kolayca
                öğrenebilir.
              </p>
              <p className="text-secondary-600 leading-relaxed">
                Amacımız, her araç sahibinin güvenle servis hizmeti alabileceği,
                şeffaf ve adil bir ekosistem oluşturmak.
              </p>
            </div>
            <div className="bg-primary-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary-600">500+</p>
                  <p className="text-secondary-600">Anlaşmalı Servis</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary-600">81</p>
                  <p className="text-secondary-600">İl</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary-600">50K+</p>
                  <p className="text-secondary-600">Mutlu Müşteri</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary-600">4.8</p>
                  <p className="text-secondary-600">Müşteri Puanı</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-12 text-center">
            Değerlerimiz
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Şeffaflık</h3>
              <p className="text-secondary-600">
                Fiyatlar, işlem detayları ve servis bilgileri tamamen açık.
                Gizli maliyet, sürpriz fatura yok.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Güven</h3>
              <p className="text-secondary-600">
                Tüm servisler değerlendirme sürecinden geçer.
                Müşteri yorumları ve puanları ile doğru seçim yapın.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Kolaylık</h3>
              <p className="text-secondary-600">
                Birkaç tıklama ile fiyat karşılaştırın, randevu alın.
                Tüm bakım geçmişiniz tek bir yerde.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-12 text-center">
            Nasıl Çalışır?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                1
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Aracınızı Seçin</h3>
              <p className="text-secondary-600 text-sm">
                Marka, model ve yıl bilgilerini girin
              </p>
            </div>

            <div className="relative">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                2
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Hizmeti Belirleyin</h3>
              <p className="text-secondary-600 text-sm">
                İhtiyacınız olan bakım veya onarımı seçin
              </p>
            </div>

            <div className="relative">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                3
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Fiyatları Karşılaştırın</h3>
              <p className="text-secondary-600 text-sm">
                Farklı servislerden teklifler alın
              </p>
            </div>

            <div className="relative">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                4
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Randevu Alın</h3>
              <p className="text-secondary-600 text-sm">
                Size uygun servisi ve zamanı seçin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team/Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">
            Bize Ulaşın
          </h2>
          <p className="text-secondary-600 mb-8 max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya iş birliği teklifleriniz için
            bizimle iletişime geçebilirsiniz.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-secondary-50 rounded-xl p-6">
              <svg className="w-8 h-8 text-primary-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="font-semibold text-secondary-900 mb-2">E-posta</h3>
              <a href="mailto:info@tamirhanem.com" className="text-primary-600 hover:text-primary-700">
                info@tamirhanem.com
              </a>
            </div>

            <div className="bg-secondary-50 rounded-xl p-6">
              <svg className="w-8 h-8 text-primary-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h3 className="font-semibold text-secondary-900 mb-2">Telefon</h3>
              <a href="tel:+908501234567" className="text-primary-600 hover:text-primary-700">
                0850 123 45 67
              </a>
            </div>

            <div className="bg-secondary-50 rounded-xl p-6">
              <svg className="w-8 h-8 text-primary-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="font-semibold text-secondary-900 mb-2">Adres</h3>
              <p className="text-secondary-600 text-sm">
                İstanbul, Türkiye
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-primary-100 mb-8">
            Aracınız için güvenilir hizmeti bulun
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/fiyat-hesapla"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Fiyat Hesapla
            </Link>
            <Link
              href="/servisler"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Servisleri İncele
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
