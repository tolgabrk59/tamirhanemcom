import Link from 'next/link';

export default function MaintenancePage() {
    const maintenanceSchedule = [
        {
            km: '5,000',
            months: 6,
            services: ['Motor yağı değişimi', 'Yağ filtresi değişimi', 'Genel kontrol'],
            cost: '600-1,200',
            priority: 'high',
        },
        {
            km: '10,000',
            months: 12,
            services: ['Motor yağı + filtre', 'Hava filtresi', 'Kabin filtresi', 'Fren kontrolü'],
            cost: '800-1,500',
            priority: 'high',
        },
        {
            km: '20,000',
            months: 24,
            services: ['Motor yağı + filtre', 'Tüm filtreler', 'Buji kontrolü', 'Fren balata kontrolü'],
            cost: '1,200-2,000',
            priority: 'high',
        },
        {
            km: '30,000',
            months: 36,
            services: ['Uzun bakım paketi', 'Şanzıman yağı', 'Fren hidroliği', 'Diferansiyel yağı'],
            cost: '2,000-3,500',
            priority: 'medium',
        },
        {
            km: '60,000',
            months: 60,
            services: ['Triger kayışı', 'Su pompası', 'Tüm sıvılar', 'Kapsamlı kontrol'],
            cost: '3,500-6,000',
            priority: 'high',
        },
    ];

    const seasonalMaintenance = [
        {
            season: 'İlkbahar',
            icon: '🌸',
            tasks: ['Klima kontrolü', 'Polen filtresi', 'Yağmur suyu kanalları', 'Lastik kontrolü'],
        },
        {
            season: 'Yaz',
            icon: '☀️',
            tasks: ['Klima gazı', 'Motor soğutma', 'Akü kontrolü', 'Yaz lastikleri'],
        },
        {
            season: 'Sonbahar',
            icon: '🍂',
            tasks: ['Silecek kontrolü', 'Sis farları', 'Fren kontrolü', 'Antifiriz seviyesi'],
        },
        {
            season: 'Kış',
            icon: '❄️',
            tasks: ['Kış lastikleri', 'Akü kapasitesi', 'Isıtma sistemi', 'Antifiriz yenileme'],
        },
    ];

    return (
        <div className="min-h-screen bg-secondary-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Bakım Takvimi
                        </h1>
                        <p className="text-xl text-green-100">
                            Aracınızın ömrünü uzatın. Kilometre ve yıl bazlı periyodik bakım planınızı oluşturun ve yaklaşan bakımları takip edin.
                        </p>
                    </div>
                </div>
            </section>

            {/* Vehicle Input Section */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                            Aracınızın Bakım Planı
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Mevcut Kilometre
                                </label>
                                <input
                                    type="number"
                                    placeholder="Örn: 45000"
                                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Yıllık Ortalama KM
                                </label>
                                <input
                                    type="number"
                                    placeholder="Örn: 15000"
                                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Son Bakım Tarihi
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            <div className="flex items-end">
                                <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                                    Plan Oluştur
                                </button>
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-800">
                                <strong>İpucu:</strong> Bakım planınızı PDF olarak indirebilir ve serviste kullanabilirsiniz.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Maintenance Schedule */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
                        Standart Bakım Takvimi
                    </h2>

                    <div className="space-y-4">
                        {maintenanceSchedule.map((item, idx) => (
                            <div key={idx} className="bg-white border border-secondary-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className={`px-4 py-2 rounded-lg font-bold ${item.priority === 'high'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {item.km} KM
                                            </div>
                                            <div className="text-secondary-600">
                                                veya {item.months} ay
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="font-semibold text-secondary-900 mb-2">Yapılacak İşlemler:</h3>
                                                <ul className="space-y-1">
                                                    {item.services.map((service, sidx) => (
                                                        <li key={sidx} className="flex items-start gap-2 text-sm text-secondary-600">
                                                            <svg className="w-4 h-4 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            {service}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-secondary-900 mb-2">Tahmini Maliyet:</h3>
                                                <p className="text-2xl font-bold text-green-600">{item.cost} ₺</p>
                                                <p className="text-xs text-secondary-500 mt-1">* Araç modeline göre değişebilir</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Link
                                            href={`/fiyat-hesapla?km=${item.km}`}
                                            className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                        >
                                            Fiyat Al
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Seasonal Maintenance */}
            <section className="py-12 bg-secondary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
                        Mevsimsel Bakım Kontrolleri
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {seasonalMaintenance.map((season, idx) => (
                            <div key={idx} className="bg-white rounded-xl shadow-lg p-6">
                                <div className="text-center mb-4">
                                    <div className="text-5xl mb-2">{season.icon}</div>
                                    <h3 className="text-xl font-bold text-secondary-900">{season.season}</h3>
                                </div>

                                <ul className="space-y-2">
                                    {season.tasks.map((task, tidx) => (
                                        <li key={tidx} className="flex items-start gap-2 text-sm text-secondary-600">
                                            <svg className="w-4 h-4 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {task}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
                        Düzenli Bakımın Faydaları
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-secondary-900 mb-2">Maliyet Tasarrufu</h3>
                            <p className="text-secondary-600">
                                Küçük sorunları erken tespit ederek büyük tamiratları önleyin
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-secondary-900 mb-2">Güvenlik</h3>
                            <p className="text-secondary-600">
                                Fren, süspansiyon ve diğer kritik sistemleri güvende tutun
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-secondary-900 mb-2">Değer Korunumu</h3>
                            <p className="text-secondary-600">
                                Bakımlı araçlar daha yüksek ikinci el değerine sahiptir
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reminder Section */}
            <section className="py-12 bg-green-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">
                        Bakım hatırlatıcısı almak ister misiniz?
                    </h3>
                    <p className="text-green-100 mb-6">
                        Kilometre ve tarih bazlı hatırlatıcılar ile bakımlarınızı asla kaçırmayın.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <input
                            type="email"
                            placeholder="E-posta adresiniz"
                            className="px-6 py-3 rounded-lg text-secondary-900 focus:ring-2 focus:ring-white"
                        />
                        <button className="bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium">
                            Kayıt Ol
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                        Bakım zamanı geldi mi?
                    </h3>
                    <p className="text-secondary-600 mb-6">
                        En yakın servisi bulun ve bakım için randevu alın.
                    </p>
                    <Link
                        href="/servisler"
                        className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        Servisleri İncele
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>
        </div>
    );
}
