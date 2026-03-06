import { Metadata } from 'next';
import ParkMesajForm from '@/components/ParkMesajForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hatalı Park Bildirimi | TamirHanem',
  description: 'Hatalı park eden araç sahiplerine uygulama üzerinden bildirim gönderin. Sadece kayıtlı üyeler için.',
  keywords: 'hatalı park, park bildirimi, araç mesaj, plaka sorgula',
};

export default function ParkMesajPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-gray-900 py-12">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Hatalı Park Bildirimi</h1>
          <p className="text-gray-800 opacity-90">
            Kayıtlı üyelere uygulama içi bildirim gönderin
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-4 py-8 -mt-4">
        {/* Member Info Banner */}
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-blue-300 font-medium">Üyelik Gerekli</p>
              <p className="text-blue-200/80 text-sm mt-1">
                Bildirim gönderebilmek ve alabilmek için TamirHanem uygulamasına üye olmanız gerekmektedir.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <ParkMesajForm />
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Uygulama İçi Bildirim</h3>
                <p className="text-gray-400 text-sm">
                  Bildirimler doğrudan TamirHanem uygulaması üzerinden iletilir. Anında ulaşır.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Güvenli İletişim</h3>
                <p className="text-gray-400 text-sm">
                  Kişisel bilgiler paylaşılmaz. Sadece kayıtlı üyeler arasında güvenli iletişim.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-3">Henüz üye değil misiniz?</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-gray-900 rounded-xl font-semibold hover:bg-primary-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Üye Ol
          </Link>
        </div>
      </div>
    </div>
  );
}
