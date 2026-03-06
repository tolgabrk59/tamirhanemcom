import Link from 'next/link';

export default function TiresPage() {
    const tireTypes = [
        {
            id: 'summer',
            title: 'Yaz Lastikleri',
            description: 'Sıcak havalarda optimum performans',
            temp: '+7°C üzeri',
            features: ['Düşük yuvarlanma direnci', 'Yüksek kavrama', 'Uzun ömür'],
            color: 'orange',
        },
        {
            id: 'winter',
            title: 'Kış Lastikleri',
            description: 'Soğuk ve karlı koşullarda güvenlik',
            temp: '+7°C altı',
            features: ['Kar ve buzda kavrama', 'Esnek lastik karışımı', 'M+S işareti'],
            color: 'blue',
        },
        {
            id: 'all-season',
            title: '4 Mevsim Lastikleri',
            description: 'Yıl boyu kullanım için pratik',
            temp: 'Her koşul',
            features: ['Tüm mevsimlerde kullanım', 'Tasarruf sağlar', 'Orta performans'],
            color: 'green',
        },
    ];

    return (
        <div className="min-h-screen bg-secondary-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Lastik Rehberi
                        </h1>
                        <p className="text-xl text-primary-100">
                            Aracınız için doğru lastiği seçin. Mevsimsel öneriler, bakım ipuçları ve güvenlik bilgileri.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tire Types Section */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
                        Lastik Tipleri
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {tireTypes.map((tire) => (
                            <div key={tire.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-${tire.color}-500 to-${tire.color}-600 flex items-center justify-center text-white mb-4`}>
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>

                                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                                    {tire.title}
                                </h3>
                                <p className="text-secondary-600 mb-3">
                                    {tire.description}
                                </p>

                                <div className="bg-secondary-50 rounded-lg p-3 mb-4">
                                    <p className="text-sm font-medium text-secondary-700">
                                        Kullanım Sıcaklığı: <span className="text-primary-600">{tire.temp}</span>
                                    </p>
                                </div>

                                <ul className="space-y-2">
                                    {tire.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-secondary-600">
                                            <svg className="w-4 h-4 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Maintenance Tips */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
                        Lastik Bakım İpuçları
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-secondary-900 mb-2">Hava Basıncı</h3>
                            <p className="text-sm text-secondary-600">
                                Ayda bir kez kontrol edin. Doğru basınç yakıt tasarrufu sağlar.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-secondary-900 mb-2">Rotasyon</h3>
                            <p className="text-sm text-secondary-600">
                                Her 10.000 km'de bir lastik rotasyonu yapın.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-secondary-900 mb-2">Diş Derinliği</h3>
                            <p className="text-sm text-secondary-600">
                                Minimum 1.6mm olmalı. Güvenlik için düzenli kontrol edin.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-secondary-900 mb-2">Hasar Kontrolü</h3>
                            <p className="text-sm text-secondary-600">
                                Çatlak, kabarcık veya kesik olup olmadığını kontrol edin.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* When to Replace */}
            <section className="py-12 bg-secondary-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-secondary-900 mb-6 text-center">
                        Ne Zaman Değiştirmeli?
                    </h2>

                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    !
                                </div>
                                <div>
                                    <h3 className="font-semibold text-secondary-900 mb-1">Diş Derinliği 1.6mm'nin Altında</h3>
                                    <p className="text-secondary-600 text-sm">
                                        Yasal minimum değerin altına düştüğünde hemen değiştirin.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    !
                                </div>
                                <div>
                                    <h3 className="font-semibold text-secondary-900 mb-1">Yaş 6 Yıldan Fazla</h3>
                                    <p className="text-secondary-600 text-sm">
                                        Üretim tarihinden 6 yıl geçmişse, diş derinliği yeterli olsa bile değiştirmeyi düşünün.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    !
                                </div>
                                <div>
                                    <h3 className="font-semibold text-secondary-900 mb-1">Görünür Hasar</h3>
                                    <p className="text-secondary-600 text-sm">
                                        Yan yüzeyde çatlak, kabarcık veya büyük kesikler varsa acilen değiştirin.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    !
                                </div>
                                <div>
                                    <h3 className="font-semibold text-secondary-900 mb-1">Düzensiz Aşınma</h3>
                                    <p className="text-secondary-600 text-sm">
                                        Tek taraflı veya yamuk aşınma gözlemleniyorsa rotbalans ve lastik değişimi gerekebilir.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                        Lastik değişimi için teklif alın
                    </h3>
                    <p className="text-secondary-600 mb-6">
                        Yakınınızdaki servisleri bulun ve lastik fiyatlarını karşılaştırın.
                    </p>
                    <Link
                        href="/fiyat-hesapla?service=Lastik%20Değişimi"
                        className="inline-flex items-center bg-primary-600 text-[#454545] px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-bold"
                    >
                        Fiyat Teklifi Al
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>
        </div>
    );
}
