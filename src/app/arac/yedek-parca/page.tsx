import Link from 'next/link';
import { Metadata } from 'next';
import { PartIcon } from '@/components/PartIcon';

export const metadata: Metadata = {
    title: 'Yedek Parça Kütüphanesi | TamirHanem',
    description: 'Araç parçaları hakkında kapsamlı bilgi. Her parçanın ne işe yaradığını, ne zaman değişmesi gerektiğini ve maliyetlerini öğrenin.',
};

const categories = [
    {
        name: 'Motor Parçaları',
        iconType: 'gear',
        parts: ['Yağ Filtresi', 'Hava Filtresi', 'Buji', 'Triger Kayışı', 'V Kayışı', 'Motor Yağı'],
        href: '/arac/yedek-parca/motor',
        color: 'from-blue-500 to-blue-600'
    },
    {
        name: 'Fren Sistemi',
        iconType: 'brake',
        parts: ['Balata', 'Disk', 'Kampana', 'Fren Hidroliği', 'ABS Sensörü'],
        href: '/arac/yedek-parca/fren',
        color: 'from-red-500 to-red-600'
    },
    {
        name: 'Süspansiyon',
        iconType: 'shock',
        parts: ['Amortisör', 'Helezon Yay', 'Rotil', 'Rot Kolu', 'Viraj Denge Çubuğu'],
        href: '/arac/yedek-parca/suspansiyon',
        color: 'from-purple-500 to-purple-600'
    },
    {
        name: 'Elektrik & Aydınlatma',
        iconType: 'bulb',
        parts: ['Akü', 'Alternatör', 'Marş Motoru', 'Far Ampulü', 'Stop Lambası'],
        href: '/arac/yedek-parca/elektrik',
        color: 'from-yellow-500 to-yellow-600'
    },
    {
        name: 'Soğutma Sistemi',
        iconType: 'radiator',
        parts: ['Radyatör', 'Termostat', 'Su Pompası', 'Antifriz', 'Fan Kayışı'],
        href: '/arac/yedek-parca/sogutma',
        color: 'from-cyan-500 to-cyan-600'
    },
    {
        name: 'Şanzıman & Debriyaj',
        iconType: 'transmission',
        parts: ['Debriyaj Seti', 'Şanzıman Yağı', 'Kardan Mili', 'Diferansiyel'],
        href: '/arac/yedek-parca/sanziman',
        color: 'from-indigo-500 to-indigo-600'
    },
    {
        name: 'Egzoz Sistemi',
        iconType: 'exhaust',
        parts: ['Katalitik Konvertör', 'Egzoz Susturucusu', 'Lambda Sensörü', 'Egzoz Borusu'],
        href: '/arac/yedek-parca/egzoz',
        color: 'from-gray-500 to-gray-600'
    },
    {
        name: 'Yakıt Sistemi',
        iconType: 'fuel',
        parts: ['Yakıt Pompası', 'Yakıt Filtresi', 'Enjektör', 'Yakıt Deposu'],
        href: '/arac/yedek-parca/yakit',
        color: 'from-green-500 to-green-600'
    },
];

const popularParts = [
    { name: 'Yağ Filtresi', avgCost: '50-150 ₺', lifespan: '10.000 km', difficulty: 'Kolay', iconType: 'filter' },
    { name: 'Fren Balatası', avgCost: '200-600 ₺', lifespan: '40.000 km', difficulty: 'Orta', iconType: 'brake' },
    { name: 'Akü', avgCost: '800-2.000 ₺', lifespan: '3-5 yıl', difficulty: 'Kolay', iconType: 'battery' },
    { name: 'Triger Kayışı', avgCost: '500-1.500 ₺', lifespan: '60.000 km', difficulty: 'Zor', iconType: 'belt' },
    { name: 'Amortisör', avgCost: '400-1.200 ₺', lifespan: '80.000 km', difficulty: 'Orta', iconType: 'shock' },
    { name: 'Buji', avgCost: '50-200 ₺', lifespan: '30.000 km', difficulty: 'Kolay', iconType: 'spark' },
];

export default function EncyclopediaPage() {
    return (
        <div className="bg-secondary-50 min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Yedek Parça Kütüphanesi</h1>
                    <p className="text-xl text-secondary-300 max-w-2xl mx-auto mb-10">
                        Aracınızdaki her parçayı tanıyın. Ömrü, maliyeti ve değişim zamanı hakkında bilgi edinin.
                    </p>

                    {/* Search */}
                    <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Hangi parçayı arıyorsunuz? (Örn: Balata, Akü, Filtre)"
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
                    <h2 className="text-3xl font-bold text-secondary-900 mb-10 text-center">Kategoriye Göre Keşfet</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                href={category.href}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-card-hover transition-all duration-300 group border border-secondary-100 hover:border-primary-200"
                            >
                                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors">
                                    <PartIcon type={category.iconType} className="w-8 h-8 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors">
                                    {category.name}
                                </h3>
                                <ul className="space-y-2">
                                    {category.parts.slice(0, 4).map((part) => (
                                        <li key={part} className="text-sm text-secondary-500 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                            {part}
                                        </li>
                                    ))}
                                    {category.parts.length > 4 && (
                                        <li className="text-sm text-primary-600 font-medium mt-2">+{category.parts.length - 4} daha fazla</li>
                                    )}
                                </ul>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Parts Cards */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-secondary-900 mb-3">En Çok Aranan Parçalar</h2>
                        <p className="text-secondary-600 max-w-2xl mx-auto">
                            Araç sahiplerinin en sık değiştirdiği parçalar ve ortalama maliyetleri
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popularParts.map((part, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-secondary-100 hover:border-primary-200 group cursor-pointer">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                                        <PartIcon type={part.iconType} className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        part.difficulty === 'Kolay' ? 'bg-green-100 text-green-700' :
                                        part.difficulty === 'Orta' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {part.difficulty}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors">
                                    {part.name}
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-secondary-500">Ortalama Maliyet</span>
                                        <span className="text-lg font-bold text-primary-600">{part.avgCost}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-secondary-500">Ortalama Ömür</span>
                                        <span className="text-sm font-semibold text-secondary-900">{part.lifespan}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="group">
                            <div className="text-5xl font-bold text-primary-500 mb-2 group-hover:scale-110 transition-transform">500+</div>
                            <p className="text-gray-300 text-lg">Parça Bilgisi</p>
                            <p className="text-gray-500 text-sm mt-1">Detaylı açıklamalar</p>
                        </div>
                        <div className="group">
                            <div className="text-5xl font-bold text-primary-500 mb-2 group-hover:scale-110 transition-transform">50+</div>
                            <p className="text-gray-300 text-lg">Marka Kapsamı</p>
                            <p className="text-gray-500 text-sm mt-1">Tüm popüler markalar</p>
                        </div>
                        <div className="group">
                            <div className="text-5xl font-bold text-primary-500 mb-2 group-hover:scale-110 transition-transform">Güncel</div>
                            <p className="text-gray-300 text-lg">Fiyat Bilgileri</p>
                            <p className="text-gray-500 text-sm mt-1">2025 piyasa fiyatları</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-secondary-900 mb-3">Neden TamirHanem Yedek Parça Kütüphanesi?</h2>
                        <p className="text-secondary-600 max-w-2xl mx-auto">
                            Aracınız için doğru parçayı bulmak artık çok daha kolay
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-secondary-100 group">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-secondary-900 mb-2">Doğrulanmış Bilgiler</h3>
                            <p className="text-secondary-600">
                                Tüm parça bilgileri uzman mekanikler tarafından doğrulanmıştır
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-secondary-100 group">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-secondary-900 mb-2">Güncel Fiyatlar</h3>
                            <p className="text-secondary-600">
                                Piyasa fiyatları düzenli olarak güncellenir
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-secondary-100 group">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-secondary-900 mb-2">Detaylı Açıklamalar</h3>
                            <p className="text-secondary-600">
                                Her parçanın işlevi ve değişim zamanı hakkında bilgi
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Aradığınız Parçayı Bulamadınız mı?</h2>
                    <p className="text-xl text-primary-100 mb-8">
                        Uzman ekibimize sorun, size yardımcı olalım. 7/24 destek hattımız hizmetinizde.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/iletisim"
                            className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Bize Ulaşın
                        </Link>
                        <Link
                            href="/servisler"
                            className="inline-flex items-center justify-center gap-2 bg-secondary-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-secondary-800 transition-colors shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Servis Bul
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
