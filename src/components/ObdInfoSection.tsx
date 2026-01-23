import Link from 'next/link';

export default function ObdInfoSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
              OBD-II Arıza Kodları
            </span>
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Aracınızdaki Arıza Kodlarını Anlayın
            </h2>
            <p className="text-secondary-600 mb-6 leading-relaxed">
              OBD-II (On-Board Diagnostics) sistemi, aracınızın motor ve emisyon sistemlerini
              sürekli izler. Check Engine lambası yandığında, sistem bir arıza kodu kaydeder.
              Bu kodları anlayarak sorunun ne olduğunu ve ne kadar acil olduğunu öğrenebilirsiniz.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">OBD-II Nedir?</h4>
                  <p className="text-sm text-secondary-600">
                    1996&apos;dan itibaren tüm araçlarda bulunan standart teşhis sistemidir.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">Kodlar Nasıl Okunur?</h4>
                  <p className="text-sm text-secondary-600">
                    OBD tarayıcı cihazı veya oto servislerdeki teşhis cihazları ile okunur.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">Ne Zaman Servise Gitmeliyim?</h4>
                  <p className="text-sm text-secondary-600">
                    Check Engine lambası yanıp sönüyorsa acil, sabit yanıyorsa yakın zamanda gidin.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/obd"
              className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Tüm OBD Kodlarını İncele
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Right Content - OBD Code Examples */}
          <div className="bg-secondary-50 rounded-2xl p-6">
            <h3 className="font-semibold text-secondary-900 mb-4">Örnek OBD Kodları</h3>
            <div className="space-y-3">
              <Link
                href="/obd/p0300"
                className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-primary-600">P0300</span>
                    <p className="text-sm text-secondary-600">Rastgele Ateşleme Hatası</p>
                  </div>
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Yüksek</span>
                </div>
              </Link>

              <Link
                href="/obd/p0420"
                className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-primary-600">P0420</span>
                    <p className="text-sm text-secondary-600">Katalitik Konvertör Verimliliği</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Orta</span>
                </div>
              </Link>

              <Link
                href="/obd/p0171"
                className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-primary-600">P0171</span>
                    <p className="text-sm text-secondary-600">Sistem Çok Fakir (Bank 1)</p>
                  </div>
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Yüksek</span>
                </div>
              </Link>

              <Link
                href="/obd/p0455"
                className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-primary-600">P0455</span>
                    <p className="text-sm text-secondary-600">EVAP Büyük Kaçak</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Düşük</span>
                </div>
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-secondary-200">
              <p className="text-sm text-secondary-500 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                500+ OBD kodu açıklaması veritabanımızda mevcut
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
