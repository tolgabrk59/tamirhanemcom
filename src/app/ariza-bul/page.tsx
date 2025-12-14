import type { Metadata } from 'next';
import Link from 'next/link';
import { commonProblemsData, getUniqueBrands } from '@/data/common-problems';
import { obdCodesData } from '@/data/obd-codes';

export const metadata: Metadata = {
  title: 'Arıza Bul - Belirtiye Göre Araç Arızası Teşhisi',
  description:
    'Aracınızdaki belirtilere göre olası arızaları tespit edin. Motor titremesi, yakıt tüketimi, güç kaybı ve daha fazlası için teşhis rehberi.',
  keywords: [
    'araç arıza teşhis',
    'motor arızası',
    'araç belirtileri',
    'arıza tespit',
    'oto problem',
    'araç sorunu',
  ],
  openGraph: {
    title: 'Arıza Bul - Araç Arızası Teşhisi | TamirHanem',
    description: 'Belirtilere göre araç arızası teşhisi yapın.',
    url: 'https://tamirhanem.com/ariza-bul',
  },
};

const symptoms = [
  {
    id: 1,
    title: 'Motor Titremesi / Sarsıntı',
    description: 'Rölantide veya seyir halinde motor titriyor',
    icon: '🔧',
    relatedCodes: ['P0300', 'P0301', 'P0302'],
    possibleCauses: ['Buji arızası', 'Ateşleme bobini', 'Vakum kaçağı'],
  },
  {
    id: 2,
    title: 'Güç Kaybı',
    description: 'Araç yeterli güç üretmiyor, hızlanmada zorluk',
    icon: '⚡',
    relatedCodes: ['P0171', 'P0101', 'P0300'],
    possibleCauses: ['Yakıt sistemi sorunu', 'Hava filtresi tıkalı', 'Turbo arızası'],
  },
  {
    id: 3,
    title: 'Check Engine Lambası',
    description: 'Motor arıza lambası yanıyor',
    icon: '🚨',
    relatedCodes: ['P0420', 'P0455', 'P0171'],
    possibleCauses: ['Çeşitli motor ve emisyon sorunları'],
  },
  {
    id: 4,
    title: 'Yakıt Tüketimi Artışı',
    description: 'Normalden fazla yakıt harcıyor',
    icon: '⛽',
    relatedCodes: ['P0171', 'P0172', 'P0128'],
    possibleCauses: ['Oksijen sensörü', 'MAF sensörü', 'Termostat'],
  },
  {
    id: 5,
    title: 'Egzozdan Duman',
    description: 'Siyah, beyaz veya mavi duman çıkıyor',
    icon: '💨',
    relatedCodes: ['P0420', 'P0300'],
    possibleCauses: ['Zengin yakıt karışımı', 'Yağ yakma', 'Soğutma suyu kaçağı'],
  },
  {
    id: 6,
    title: 'Çalıştırma Zorluğu',
    description: 'Araç zor çalışıyor veya hiç çalışmıyor',
    icon: '🔑',
    relatedCodes: ['P0340', 'P0335'],
    possibleCauses: ['Akü zayıf', 'Marş motoru', 'Yakıt pompası'],
  },
  {
    id: 7,
    title: 'Anormal Sesler',
    description: 'Motordan veya şasiden garip sesler geliyor',
    icon: '🔊',
    relatedCodes: ['P0300', 'P0340'],
    possibleCauses: ['Rulman aşınması', 'Kayış gevşemesi', 'Egzoz kaçağı'],
  },
  {
    id: 8,
    title: 'Yakıt Kokusu',
    description: 'Araçtan benzin veya dizel kokusu geliyor',
    icon: '👃',
    relatedCodes: ['P0455', 'P0442'],
    possibleCauses: ['EVAP sistemi kaçağı', 'Yakıt enjektör kaçağı'],
  },
];

export default function ArizaBulPage() {
  const brands = getUniqueBrands();

  return (
    <div className="bg-secondary-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-orange to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-orange-200 mb-6">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-white">Arıza Bul</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Arıza Teşhis Rehberi
          </h1>
          <p className="text-xl text-orange-100 max-w-3xl">
            Aracınızdaki belirtileri seçin, olası arızaları ve çözüm önerilerini görün.
            Servise gitmeden önce sorunun ne olabileceğini öğrenin.
          </p>
        </div>
      </section>

      {/* Symptoms Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-secondary-900 mb-8 text-center">
            Aracınızda Hangi Belirtiyi Görüyorsunuz?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {symptoms.map((symptom) => (
              <div
                key={symptom.id}
                className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
              >
                <div className="text-4xl mb-4">{symptom.icon}</div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {symptom.title}
                </h3>
                <p className="text-secondary-600 text-sm mb-4">
                  {symptom.description}
                </p>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-medium text-secondary-500 uppercase">
                      İlgili OBD Kodları
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {symptom.relatedCodes.map((code) => (
                        <Link
                          key={code}
                          href={`/obd/${code.toLowerCase()}`}
                          className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded hover:bg-primary-200 transition-colors font-mono"
                        >
                          {code}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-secondary-500 uppercase">
                      Olası Nedenler
                    </span>
                    <ul className="mt-1 space-y-1">
                      {symptom.possibleCauses.slice(0, 2).map((cause, idx) => (
                        <li key={idx} className="text-xs text-secondary-600 flex items-center gap-1">
                          <span className="w-1 h-1 bg-secondary-400 rounded-full"></span>
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand-based Problems */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-secondary-900 mb-8 text-center">
            Marka Bazında Sık Karşılaşılan Sorunlar
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brands.map((brand) => {
              const brandProblems = commonProblemsData.filter(
                (p) => p.brand === brand
              );
              return (
                <div key={brand} className="bg-secondary-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-secondary-900 mb-4">
                    {brand}
                  </h3>
                  <ul className="space-y-3">
                    {brandProblems.slice(0, 3).map((problem) => (
                      <li key={problem.id}>
                        <Link
                          href={`/ariza-bul?brand=${brand}&problem=${encodeURIComponent(problem.title)}`}
                          className="text-secondary-600 hover:text-primary-600 text-sm block"
                        >
                          • {problem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/ariza-bul?brand=${brand}`}
                    className="text-primary-600 text-sm font-medium mt-4 inline-block hover:text-primary-700"
                  >
                    Tümünü gör →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* OBD Search Section */}
      <section className="py-16 bg-secondary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            OBD Arıza Kodunuzu Biliyor musunuz?
          </h2>
          <p className="text-secondary-300 mb-8">
            Arıza kodunuzu girerek detaylı bilgi alın
          </p>

          <form action="/obd" method="GET" className="max-w-md mx-auto flex gap-2">
            <input
              type="text"
              name="q"
              placeholder="Örn: P0300"
              className="flex-1 px-4 py-3 rounded-lg text-secondary-900 placeholder-secondary-400"
            />
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Ara
            </button>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <span className="text-secondary-400 text-sm">Popüler kodlar:</span>
            {obdCodesData.slice(0, 4).map((obd) => (
              <Link
                key={obd.code}
                href={`/obd/${obd.code.toLowerCase()}`}
                className="text-primary-400 hover:text-primary-300 text-sm font-mono"
              >
                {obd.code}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Sorununuzu Tespit Ettiniz mi?
          </h2>
          <p className="text-primary-100 mb-8">
            Şimdi güvenilir servislerden fiyat teklifi alın
          </p>
          <Link
            href="/fiyat-hesapla"
            className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Fiyat Hesapla
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
