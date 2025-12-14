import Link from 'next/link';

export default function RecallsPage() {
    return (
        <div className="min-h-screen bg-secondary-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-secondary-800 to-secondary-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Araç Geri Çağırmaları
                        </h1>
                        <p className="text-xl text-secondary-300">
                            Aracınızın güvenliğini sağlayın. Güncel geri çağırma bildirimlerini kontrol edin ve gerekli işlemleri zamanında yapın.
                        </p>
                    </div>
                </div>
            </section>

            {/* Search Section */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                            Aracınız İçin Geri Çağırma Kontrolü
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Marka
                                </label>
                                <select className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500">
                                    <option>Marka Seçin</option>
                                    <option>Toyota</option>
                                    <option>Volkswagen</option>
                                    <option>Ford</option>
                                    <option>Renault</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Model
                                </label>
                                <select className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500">
                                    <option>Model Seçin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Yıl
                                </label>
                                <select className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500">
                                    <option>Yıl Seçin</option>
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button className="w-full bg-primary-600 text-[#454545] px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-bold">
                                    Sorgula
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Bilgi:</strong> Geri çağırma bildirimleri düzenli olarak güncellenmektedir. Aracınızın şase numarasını da kontrol edebilirsiniz.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                                Geri Çağırma Nedir?
                            </h3>
                            <p className="text-secondary-600 mb-4">
                                Araç geri çağırmaları, üretici firmaların güvenlik veya emisyon standartlarına uymayan araçları düzeltmek için yaptığı kampanyalardır. Bu işlemler genellikle ücretsizdir.
                            </p>
                            <ul className="space-y-2 text-secondary-600">
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Güvenlik riski taşıyan parçaların değişimi
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Yazılım güncellemeleri
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Emisyon standartlarına uyum
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                                Ne Yapmalısınız?
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-secondary-900 mb-1">Kontrol Edin</h4>
                                        <p className="text-secondary-600 text-sm">
                                            Aracınız için aktif geri çağırma olup olmadığını düzenli olarak kontrol edin.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-secondary-900 mb-1">Randevu Alın</h4>
                                        <p className="text-secondary-600 text-sm">
                                            Geri çağırma varsa, yetkili servisten randevu alın. İşlem genellikle ücretsizdir.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-secondary-900 mb-1">İşlemi Yaptırın</h4>
                                        <p className="text-secondary-600 text-sm">
                                            Belirlenen tarihte servise giderek gerekli işlemleri yaptırın.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 bg-secondary-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                        Geri çağırma varsa ne yapmalıyım?
                    </h3>
                    <p className="text-secondary-600 mb-6">
                        Aracınız için geri çağırma kampanyası varsa, en yakın yetkili servisi bulun ve randevu alın.
                    </p>
                    <Link
                        href="/servisler"
                        className="inline-flex items-center bg-primary-600 text-[#454545] px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-bold"
                    >
                        Yetkili Servisleri Bul
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>
        </div>
    );
}
