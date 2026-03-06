import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Soru Sor - Araç Uzmanına Sorun',
  description: 'Aracınızla ilgili sorularınızı uzmanlarımıza sorun. Motor, şanzıman, elektrik, fren ve daha fazlası hakkında yanıtlar alın.',
};

export default function SoruSorPage() {
  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Soru Sor
          </h1>
          <p className="text-lg text-secondary-600">
            Aracınızla ilgili sorularınızı AI asistanımıza sorun
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link href="//ai/sohbet" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
                AI Sohbet
              </h3>
              <p className="text-secondary-600 mt-2">
                Yapay zeka asistanımızla anında yanıtlar alın
              </p>
            </div>
          </Link>

          <Link href="/iletisim" className="group">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
                İletişim Formu
              </h3>
              <p className="text-secondary-600 mt-2">
                Bize e-posta ile ulaşın
              </p>
            </div>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Popüler Sorular</h2>
          <div className="space-y-3">
            <Link href="/ai/sohbet" className="block text-secondary-700 hover:text-primary-600 py-2 border-b border-secondary-100">
              Arabam çalışmıyor, ne yapmalıyım?
            </Link>
            <Link href="/ai/sohbet" className="block text-secondary-700 hover:text-primary-600 py-2 border-b border-secondary-100">
              Motor yağı ne sıklıkla değiştirilmeli?
            </Link>
            <Link href="/ai/sohbet" className="block text-secondary-700 hover:text-primary-600 py-2 border-b border-secondary-100">
              Frenlerim ses çıkarıyor, sorun ne olabilir?
            </Link>
            <Link href="/ai/sohbet" className="block text-secondary-700 hover:text-primary-600 py-2 border-b border-secondary-100">
              Check engine lambası yandı, ne yapmalıyım?
            </Link>
            <Link href="/ai/sohbet" className="block text-secondary-700 hover:text-primary-600 py-2">
              Klimam soğutmuyor, neden?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
