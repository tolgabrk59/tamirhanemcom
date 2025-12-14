import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Araç Bakım Tavsiyeleri | TamirHanem',
    description: 'Uzmanlardan araç bakımı, sorun giderme ve güvenli sürüş ipuçları. Aracınızı en iyi durumda tutmak için rehberiniz.',
};

const categories = [
    {
        title: 'Genel Bakım',
        description: 'Yağ değişimi, filtreler ve rutin kontroller hakkında her şey.',
        icon: (
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        href: '/arac/genel-bakim',
    },
    {
        title: 'Sorun Giderme',
        description: 'Motor ışığı, garip sesler ve sızıntılar ne anlama geliyor?',
        icon: (
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        href: '/ariza-rehberi',
    },
    {
        title: 'Mevsimsel Bakım',
        description: 'Aracınızı kışa ve yaza hazırlamak için yapılması gerekenler.',
        icon: (
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        href: '/arac/mevsimsel-bakim',
    },
    {
        title: 'Lastik Rehberi',
        description: 'Doğru lastik seçimi, basınç kontrolü ve rot balans.',
        icon: (
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        href: '/arac/lastik-secimi',
    },
    {
        title: 'Sürüş İpuçları',
        description: 'Yakıt tasarrufu ve güvenli sürüş teknikleri.',
        icon: (
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        href: '/arac/surus-ipuclari',
    },
    {
        title: 'Kendin Yap (DIY)',
        description: 'Basit tamirler ve bakımları kendiniz nasıl yapabilirsiniz?',
        icon: (
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
        href: '/arac/diy',
    },
];

const featuredArticles = [
    {
        id: 1,
        title: 'Motor Işığı Neden Yanar? En Sık Görülen 5 Sebep',
        excerpt: 'Gösterge panelindeki o korkutucu ışığın arkasındaki en yaygın nedenleri ve çözüm yollarını öğrenin.',
        category: 'Sorun Giderme',
        image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=800',
        date: '10 Ara 2025'
    },
    {
        id: 2,
        title: 'Kış Lastiği Ne Zaman Takılmalı?',
        excerpt: 'Hava sıcaklığı 7 derecenin altına düştüğünde neden kış lastiğine geçmelisiniz?',
        category: 'Mevsimsel Bakım',
        image: 'https://images.unsplash.com/photo-1543465305-1563260bde96?auto=format&fit=crop&q=80&w=800',
        date: '08 Ara 2025'
    },
    {
        id: 3,
        title: 'Yağ Değişimi: 10.000 km mi, 15.000 km mi?',
        excerpt: 'Modern motorlarda yağ değişim aralıkları ve doğru yağ seçiminin önemi.',
        category: 'Genel Bakım',
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800',
        date: '05 Ara 2025'
    },
];

export default function AdvicePage() {
    return (
        <div className="bg-secondary-50 min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Araç Bakım Tavsiyeleri</h1>
                    <p className="text-xl text-secondary-300 max-w-2xl mx-auto mb-10">
                        Uzmanlardan güvenilir bilgiler, bakım ipuçları ve sorun giderme rehberleri ile aracınızın dilinden anlayın.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Hangi konuda yardıma ihtiyacınız var? (Örn: Fren sesi, Akü değişimi)"
                            className="w-full px-6 py-4 rounded-full text-secondary-900 focus:outline-none focus:ring-4 focus:ring-primary-500/50 shadow-xl text-lg placeholder:text-secondary-400"
                        />
                        <button className="absolute right-2 top-2 bg-primary-600 text-white p-2.5 rounded-full hover:bg-primary-700 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-secondary-900 mb-10 text-center">Konu Başlıkları</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                href={category.href}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-card-hover transition-all duration-300 group border border-secondary-100 hover:border-primary-200"
                            >
                                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors">
                                    {category.icon}
                                </div>
                                <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors">
                                    {category.title}
                                </h3>
                                <p className="text-secondary-500 leading-relaxed">
                                    {category.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Articles */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-secondary-900 mb-2">Öne Çıkan Makaleler</h2>
                            <p className="text-secondary-500">Editörlerimizin seçtiği en popüler içerikler</p>
                        </div>
                        <Link href="/arac/blog" className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
                            Tümünü Gör
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredArticles.map((article) => (
                            <article key={article.id} className="group cursor-pointer">
                                <div className="relative h-56 rounded-xl overflow-hidden mb-4">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-700">
                                        {article.category}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-secondary-400 mb-3">
                                    <span>{article.date}</span>
                                    <span>•</span>
                                    <span>3 dk okuma</span>
                                </div>
                                <h3 className="text-xl font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-secondary-500 text-sm line-clamp-2">
                                    {article.excerpt}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-primary-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-secondary-900 mb-10">Sıkça Sorulan Sorular</h2>
                    <div className="space-y-4">
                        {[
                            { q: 'Hangi sıklıkla bakım yaptırmalıyım?', a: 'Genellikle her 10.000-15.000 km\'de veya yılda bir kez periyodik bakım önerilir.' },
                            { q: 'Garanti kapsamındaki aracımı yetkili servise mi götürmeliyim?', a: 'Evet, garantinizin bozulmaması için üreticinin belirlediği standartlarda hizmet veren servisleri tercih etmelisiniz.' },
                            { q: 'TamirHanem servisleri güvenilir mi?', a: 'Platformumuzdaki tüm servisler ön elemeden geçer ve kullanıcı yorumlarına göre sürekli denetlenir.' },
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl text-left shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-bold text-secondary-900 mb-2">{faq.q}</h3>
                                <p className="text-secondary-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
