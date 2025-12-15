import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'İletişim - TamirHanem',
  description: 'TamirHanem ile iletişime geçin. Reklam, işbirliği ve destek talepleri için bize ulaşın.',
  keywords: ['iletişim', 'tamirhanem iletişim', 'reklam', 'işbirliği', 'destek'],
};

export default function IletisimPage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            İletişim
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya iş birliği teklifleriniz için bizimle iletişime geçin
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-secondary-100">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#454545' }}>
                Bize Ulaşın
              </h2>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Adınız Soyadınız *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="ornek@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Konu *
                  </label>
                  <select className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option value="">Konu Seçin</option>
                    <option value="reklam">🎯 Reklam ve İşbirlikleri</option>
                    <option value="servis">🔧 Servis Başvurusu</option>
                    <option value="destek">💬 Teknik Destek</option>
                    <option value="oneri">💡 Öneri ve Şikayet</option>
                    <option value="diger">📝 Diğer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Mesajınız *
                  </label>
                  <textarea
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Gönder
                </button>
              </form>
            </div>

            {/* Contact Info & Ad Partnership */}
            <div className="space-y-8">
              {/* Ad Partnership Card - Highlighted */}
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">Reklam ve İşbirlikleri</h3>
                </div>
                <p className="text-primary-100 mb-6 leading-relaxed">
                  Markanızı Türkiye'nin en büyük araç bakım platformunda tanıtın. 
                  Aylık 100.000+ araç sahibine ulaşın.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Banner Reklamları</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Sponsored İçerikler</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Marka Ortaklıkları</span>
                  </div>
                </div>
                <a
                  href="mailto:reklam@tamirhanem.com"
                  className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  reklam@tamirhanem.com
                </a>
              </div>

              {/* General Contact Info */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-secondary-100">
                <h3 className="text-xl font-bold mb-6" style={{ color: '#454545' }}>
                  İletişim Bilgileri
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary-900">E-posta</h4>
                      <a href="mailto:info@tamirhanem.com" className="text-primary-600 hover:text-primary-700">
                        info@tamirhanem.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary-900">Adres</h4>
                      <p className="text-secondary-600">
                        Tekirdağ, Türkiye
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary-900">Çalışma Saatleri</h4>
                      <p className="text-secondary-600">
                        Pazartesi - Cuma: 09:00 - 18:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-secondary-100 rounded-2xl p-6">
                <h4 className="font-semibold text-secondary-900 mb-4">Hızlı Bağlantılar</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/sss" className="text-secondary-700 hover:text-primary-600 transition-colors text-sm">
                    → Sık Sorulan Sorular
                  </Link>
                  <Link href="/hakkimizda" className="text-secondary-700 hover:text-primary-600 transition-colors text-sm">
                    → Hakkımızda
                  </Link>
                  <Link href="/gizlilik" className="text-secondary-700 hover:text-primary-600 transition-colors text-sm">
                    → Gizlilik Politikası
                  </Link>
                  <Link href="/sartlar" className="text-secondary-700 hover:text-primary-600 transition-colors text-sm">
                    → Kullanım Şartları
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
