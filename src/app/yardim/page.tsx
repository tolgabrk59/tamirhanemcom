import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Yardım Merkezi - TamirHanem',
  description: 'TamirHanem kullanım kılavuzu ve yardım merkezi. Platformu nasıl kullanacağınızı öğrenin.',
};

export default function YardimPage() {
  const helpCategories = [
    {
      title: 'Başlarken',
      icon: '🚀',
      items: [
        { title: 'TamirHanem\'e Hoş Geldiniz', link: '/sss' },
        { title: 'Nasıl Servis Bulurum?', link: '/servisler' },
        { title: 'Fiyat Nasıl Hesaplanır?', link: '/fiyat-hesapla' },
      ],
    },
    {
      title: 'Araç Sorunları',
      icon: '🔧',
      items: [
        { title: 'OBD Kodu Sorgulama', link: '/obd' },
        { title: 'Arıza Teşhis', link: '/ariza-bul' },
        { title: 'AI Arıza Tespiti', link: '/ai/ariza-tespit' },
        { title: 'Check Engine Lambası', link: '/ariza-rehberi/check-engine-lambasi' },
      ],
    },
    {
      title: 'Araç Bakımı',
      icon: '🛠️',
      items: [
        { title: 'Bakım Takvimi', link: '/bakim-takvimi' },
        { title: 'Bakım Tavsiyeleri', link: '/arac/bakim-tavsiyeleri' },
        { title: 'Lastik Rehberi', link: '/lastikler' },
      ],
    },
    {
      title: 'Araç Bilgisi',
      icon: '📚',
      items: [
        { title: 'Araç Ansiklopedisi', link: '/arac/ansiklopedi' },
        { title: 'Yedek Parça Bilgisi', link: '/arac/yedek-parca' },
        { title: 'Güvenilirlik Puanları', link: '/guvenilirlik' },
        { title: 'Kronik Sorunlar', link: '/kronik-sorunlar' },
      ],
    },
    {
      title: 'Servisler İçin',
      icon: '🏢',
      items: [
        { title: 'Servis Kaydı Nasıl Yapılır?', link: 'https://app.tamirhanem.com/register.html' },
        { title: 'İşletme Paneli', link: 'https://app.tamirhanem.com' },
      ],
    },
    {
      title: 'Hesap & Güvenlik',
      icon: '🔒',
      items: [
        { title: 'Gizlilik Politikası', link: '/gizlilik' },
        { title: 'Kullanım Şartları', link: '/sartlar' },
        { title: 'İletişim', link: '/iletisim' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: 'url(/hero_service_background.png)',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold">Destek Merkezi</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Yardım Merkezi
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
            TamirHanem'i nasıl kullanacağınızı öğrenin
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Ne aramak istiyorsunuz?"
                className="w-full px-6 py-4 pr-12 rounded-xl text-secondary-900 placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-xl text-lg"
              />
              <svg className="w-6 h-6 text-secondary-500 absolute right-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpCategories.map((category, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-secondary-100 hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{category.icon}</span>
                  <h2 className="text-xl font-bold" style={{ color: '#454545' }}>{category.title}</h2>
                </div>
                <ul className="space-y-3">
                  {category.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <Link
                        href={item.link}
                        className="flex items-center text-secondary-600 hover:text-primary-600 transition-colors group"
                      >
                        <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="group-hover:underline">{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#454545' }}>
            Hızlı Erişim
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Link href="/sss" className="flex flex-col items-center p-6 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors">
              <svg className="w-10 h-10 text-primary-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-secondary-700">SSS</span>
            </Link>
            <Link href="/iletisim" className="flex flex-col items-center p-6 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors">
              <svg className="w-10 h-10 text-primary-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-secondary-700">İletişim</span>
            </Link>
            <Link href="/servisler" className="flex flex-col items-center p-6 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors">
              <svg className="w-10 h-10 text-primary-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-secondary-700">Servis Bul</span>
            </Link>
            <Link href="/hakkimizda" className="flex flex-col items-center p-6 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors">
              <svg className="w-10 h-10 text-primary-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-secondary-700">Hakkımızda</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Yardıma mı ihtiyacınız var?</h2>
          <p className="text-primary-100 mb-6">
            Ekibimiz sorularınızı yanıtlamak için hazır
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors shadow-lg"
          >
            Bize Ulaşın
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
