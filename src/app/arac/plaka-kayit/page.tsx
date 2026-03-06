import { Metadata } from 'next';
import PlakaKayitForm from '@/components/PlakaKayitForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Plaka Kaydı | TamirHanem',
  description: 'Plakanızı kaydedin, hatalı park durumunda size mesaj gönderilebilsin. Güvenli ve anonim iletişim.',
  keywords: 'plaka kayıt, araç kayıt, park bildirimi, araç mesaj',
};

export default function PlakaKayitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-12">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Plakamı Kaydet</h1>
          <p className="text-white/90">
            Hatalı park durumlarında size ulaşılabilsin
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-4 py-8 -mt-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <PlakaKayitForm />
        </div>

        {/* Benefits */}
        <div className="mt-8 space-y-4">
          <h2 className="text-white text-lg font-semibold text-center mb-4">Neden Kayıt Olmalıyım?</h2>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🚗</span>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Anında Bildirim</h3>
                <p className="text-gray-400 text-sm">
                  Aracınız birine engel olduğunda SMS ile anında haberdar olun ve sorunu hızlıca çözün.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🔒</span>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Gizlilik Koruması</h3>
                <p className="text-gray-400 text-sm">
                  Telefon numaranız ve kişisel bilgileriniz kimseyle paylaşılmaz. Sadece mesaj iletilir.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🤝</span>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Toplumsal Fayda</h3>
                <p className="text-gray-400 text-sm">
                  Ceza yerine nazik iletişim. Kavga yerine çözüm. Daha yaşanabilir şehirler için.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/arac/park-mesaj"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Hatalı Park Bildirimine Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
