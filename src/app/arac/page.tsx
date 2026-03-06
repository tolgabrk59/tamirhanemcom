import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aracim - TamirHanem',
  description: 'Araciniz hakkinda her sey: analiz, bakim, lastik, yedek parca ve daha fazlasi.',
};

const categories = [
  {
    title: 'Genel Bakis',
    description: 'Aracinizin marka, model ve yilini secerek detayli teknik ozellikler, kronik sorunlar ve bakim bilgilerine ulasin.',
    href: '/arac/genel-bakis',
    icon: '🔍',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
  },
  {
    title: 'Arac Analizi',
    description: 'AI destekli arac analizi ile motor, sanziman, fren ve diger sistemlerin durumu hakkinda bilgi alin.',
    href: '/arac/analiz',
    icon: '📊',
    color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
  },
  {
    title: 'Ansiklopedi',
    description: 'Araclar hakkinda kapsamli bilgi bankasi. Marka ve model detaylari, teknik ozellikler ve daha fazlasi.',
    href: '/arac/ansiklopedi',
    icon: '📚',
    color: 'bg-amber-50 border-amber-200 hover:border-amber-400',
  },
  {
    title: 'Ariza Lambalari',
    description: 'Aracinizdaki ariza lambalarinin anlamlarini ogrenin ve ne yapmaniz gerektigini bilin.',
    href: '/arac/ariza-lambalari',
    icon: '💡',
    color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
  },
  {
    title: 'Bakim Tavsiyeleri',
    description: 'Araciniz icin periyodik bakim takvimi ve uzman tavsiyeleri ile aracinizi koruyun.',
    href: '/arac/bakim-tavsiyeleri',
    icon: '🔧',
    color: 'bg-green-50 border-green-200 hover:border-green-400',
  },
  {
    title: 'Lastik Secimi',
    description: 'Araciniz icin dogru lastik secimi yapin. Mevsimlik oneriler, ebat bilgileri ve marka karsilastirmalari.',
    href: '/arac/lastik-secimi',
    icon: '🛞',
    color: 'bg-gray-50 border-gray-200 hover:border-gray-400',
  },
  {
    title: '2. El Parca',
    description: 'Cikma parca ilanlari ve teklif sistemi ile ihtiyaciniz olan parcalari bulun.',
    href: '/arac/2-el-parca',
    icon: '♻️',
    color: 'bg-teal-50 border-teal-200 hover:border-teal-400',
  },
  {
    title: 'Yedek Parca',
    description: 'Orijinal ve yan sanayi yedek parca arama, fiyat karsilastirma ve siparis.',
    href: '/arac/yedek-parca',
    icon: '🔩',
    color: 'bg-orange-50 border-orange-200 hover:border-orange-400',
  },
  {
    title: 'Park Mesaj',
    description: 'Araciniza park mesaji birakmak veya mesaj almak icin plaka kayit sistemi.',
    href: '/arac/park-mesaj',
    icon: '💬',
    color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
  },
  {
    title: 'Plaka Kayit',
    description: 'Plakanizi kaydedin ve diger kullanilarin size mesaj gondermesini saglayin.',
    href: '/arac/plaka-kayit',
    icon: '📋',
    color: 'bg-cyan-50 border-cyan-200 hover:border-cyan-400',
  },
  {
    title: 'Videolar',
    description: 'Arac bakimi, tamir ve kullanim ile ilgili faydali video icerikleri.',
    href: '/arac/videolar',
    icon: '🎬',
    color: 'bg-red-50 border-red-200 hover:border-red-400',
  },
  {
    title: 'Workshop Kilavuzlari',
    description: 'Profesyonel ve DIY tamir kilavuzlari, adim adim uygulamali anlatimlar.',
    href: '/arac/workshop-kilavuzlari',
    icon: '📖',
    color: 'bg-slate-50 border-slate-200 hover:border-slate-400',
  },
];

export default function AracPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Aracim
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Araciniz hakkinda her sey: teknik ozellikler, bakim, lastik, yedek parca ve daha fazlasi.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className={`block p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg ${category.color}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{category.icon}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-gray-900 mb-2">
                    {category.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <section className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Hizli Erisim</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/arac/genel-bakis"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              <span>🔍</span>
              Aracimi Ara
            </Link>
            <Link
              href="/arac/2-el-parca"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <span>♻️</span>
              Parca Bul
            </Link>
            <Link
              href="/arac/park-mesaj"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <span>💬</span>
              Park Mesaj
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
