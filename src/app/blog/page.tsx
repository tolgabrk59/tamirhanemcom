import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - TamirHanem',
  description: 'Araç bakımı, tamir ipuçları ve otomotiv dünyasından haberler. TamirHanem Blog.',
};

const blogPosts = [
  {
    id: 1,
    title: 'Kış Aylarında Araç Bakımı: 10 Altın Kural',
    excerpt: 'Soğuk havalarda aracınızı korumak için yapmanız gereken bakımlar ve kontroller.',
    category: 'Bakım İpuçları',
    date: '15 Aralık 2025',
    readTime: '5 dk',
    image: '/images/blog/winter-care.jpg',
    slug: 'kis-aylarinda-arac-bakimi',
  },
  {
    id: 2,
    title: 'Check Engine Lambası Yandı: Ne Yapmalı?',
    excerpt: 'Motor arıza lambası yandığında panik yapmayın. Adım adım yapmanız gerekenleri açıklıyoruz.',
    category: 'Arıza Rehberi',
    date: '12 Aralık 2025',
    readTime: '4 dk',
    image: '/images/blog/check-engine.jpg',
    slug: 'check-engine-lambasi-yandi',
  },
  {
    id: 3,
    title: 'Lastik Seçimi Rehberi: Yaz, Kış ve 4 Mevsim',
    excerpt: 'Doğru lastik seçimi güvenliğiniz için kritik. Lastik türleri arasındaki farkları öğrenin.',
    category: 'Lastik',
    date: '10 Aralık 2025',
    readTime: '6 dk',
    image: '/images/blog/tires.jpg',
    slug: 'lastik-secimi-rehberi',
  },
  {
    id: 4,
    title: 'Motor Yağı Ne Zaman Değişmeli?',
    excerpt: 'Motor yağı değişim aralıkları ve doğru yağ seçimi hakkında bilmeniz gerekenler.',
    category: 'Bakım İpuçları',
    date: '8 Aralık 2025',
    readTime: '4 dk',
    image: '/images/blog/oil-change.jpg',
    slug: 'motor-yagi-degisim-zamani',
  },
  {
    id: 5,
    title: 'OBD-II Kodları: Temel Rehber',
    excerpt: 'OBD kodlarını anlamak ve yorumlamak için ihtiyacınız olan tüm bilgiler.',
    category: 'Teknik',
    date: '5 Aralık 2025',
    readTime: '7 dk',
    image: '/images/blog/obd-codes.jpg',
    slug: 'obd-kodlari-temel-rehber',
  },
  {
    id: 6,
    title: 'Fren Sistemi Bakımı ve Uyarı İşaretleri',
    excerpt: 'Fren sisteminizdeki sorunların erken belirtilerini tanıyın ve güvende kalın.',
    category: 'Güvenlik',
    date: '1 Aralık 2025',
    readTime: '5 dk',
    image: '/images/blog/brakes.jpg',
    slug: 'fren-sistemi-bakimi',
  },
];

const categories = ['Tümü', 'Bakım İpuçları', 'Arıza Rehberi', 'Lastik', 'Teknik', 'Güvenlik'];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            TamirHanem Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Araç bakımı, tamir ipuçları ve otomotiv dünyasından güncel bilgiler
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  cat === 'Tümü'
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-secondary-100 group">
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-secondary-400 text-xs">{post.readTime} okuma</span>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors" style={{ color: '#454545' }}>
                    {post.title}
                  </h2>
                  
                  <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-secondary-400">{post.date}</span>
                    <span className="text-primary-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center">
                      Devamını Oku
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-6 py-3 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Daha fazla içerik yakında eklenecek!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Yeni Yazılardan Haberdar Olun</h2>
          <p className="text-primary-100 mb-6">
            Araç bakımı hakkında ipuçları ve güncellemeler için bültenimize abone olun
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 rounded-lg text-secondary-900 focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors">
              Abone Ol
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
