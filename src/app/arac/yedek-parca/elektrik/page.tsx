import Link from 'next/link';
import { Metadata } from 'next';
import { PartIcon } from '@/components/PartIcon';

export const metadata: Metadata = {
    title: 'Elektrik & Aydınlatma Parçaları | Yedek Parça Kütüphanesi | TamirHanem',
    description: 'Elektrik ve aydınlatma sistemi parçaları. Akü, alternatör, marş motoru, far ampulü ve daha fazlası.',
};

const electricalParts = [
    {
        name: 'Akü (Batarya)',
        iconType: 'battery',
        description: 'Aracın elektrik sistemini besleyen ve enerji depolayan parçadır.',
        avgCost: '1.200-3.500 ₺',
        lifespan: '3-5 yıl',
        difficulty: 'Kolay',
        symptoms: ['Çalışma zorluğu', 'Elektrik sisteminde zayıflama', 'Şarj ışığı yanması'],
        whenToReplace: '3-5 yıl sonunda veya şarj tutmadığında değiştirilmelidir. Kış aylarında daha sık kontrol edilmelidir.',
    },
    {
        name: 'Alternatör',
        iconType: 'alternator',
        description: 'Motor çalışırken elektrik üreterek aküyü şarj eder ve elektrik sistemini besler.',
        avgCost: '1.500-4.000 ₺',
        lifespan: '100.000-150.000 km',
        difficulty: 'Orta',
        symptoms: ['Şarj ışığı yanması', 'Akü boşalması', 'Elektrik sisteminde sorunlar', 'Gürültü'],
        whenToReplace: 'Şarj etmediğinde veya rulman hasarı durumunda tamir veya değişim yapılmalıdır.',
    },
    {
        name: 'Marş Motoru',
        iconType: 'starter',
        description: 'Motoru ilk çalıştırmak için gereken dönme hareketini sağlar.',
        avgCost: '800-2.500 ₺',
        lifespan: '100.000+ km',
        difficulty: 'Orta',
        symptoms: ['Çalışmama', 'Tık sesi', 'Yavaş dönme', 'Gürültü'],
        whenToReplace: 'Arıza belirtileri gösterdiğinde tamir veya değişim yapılmalıdır.',
    },
    {
        name: 'Far Ampulü (H4/H7)',
        iconType: 'bulb',
        description: 'Aracın ön aydınlatmasını sağlayan ampuldür.',
        avgCost: '30-200 ₺ (adet)',
        lifespan: '500-1.000 saat',
        difficulty: 'Kolay',
        symptoms: ['Işık yanmaması', 'Sönük ışık', 'Titreşim'],
        whenToReplace: 'Yanmadığında veya ışık şiddeti düştüğünde değiştirilmelidir. Her zaman çift değiştirilmesi önerilir.',
    },
    {
        name: 'Stop Lambası',
        iconType: 'bulb',
        description: 'Fren yapıldığında arkadan gelen araçları uyaran lambadır.',
        avgCost: '10-50 ₺ (adet)',
        lifespan: '1.000+ saat',
        difficulty: 'Kolay',
        symptoms: ['Işık yanmaması', 'Gösterge panelinde uyarı'],
        whenToReplace: 'Yanmadığında derhal değiştirilmelidir. Trafik güvenliği açısından kritiktir.',
    },
    {
        name: 'Ön Sinyal Lambası',
        iconType: 'bulb',
        description: 'Dönüş yönünü belirten ön sinyal lambalarıdır.',
        avgCost: '15-80 ₺ (adet)',
        lifespan: '1.000+ saat',
        difficulty: 'Kolay',
        symptoms: ['Hızlı yanıp sönme', 'Işık yanmaması'],
        whenToReplace: 'Yanmadığında veya hızlı yanıp söndüğünde değiştirilmelidir.',
    },
];

export default function ElectricalPartsPage() {
    return (
        <div className="bg-secondary-50 min-h-screen">

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <PartIcon type="bulb" className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold">Elektrik & Aydınlatma</h1>
                            <p className="text-xl text-yellow-100 mt-2">
                                Aracınızın elektrik ve aydınlatma sistemi bileşenleri
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Parts Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8">
                        {electricalParts.map((part, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-secondary-100 overflow-hidden">
                                <div className="p-8">
                                    <div className="flex items-start gap-6">
                                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                                            <PartIcon type={part.iconType} className="w-10 h-10 text-current" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-secondary-900 mb-2">{part.name}</h3>
                                                    <p className="text-secondary-600">{part.description}</p>
                                                </div>
                                                <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                                                    part.difficulty === 'Kolay' ? 'bg-green-100 text-green-700' :
                                                    part.difficulty === 'Orta' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {part.difficulty}
                                                </span>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-secondary-100">
                                                    <div className="text-sm text-secondary-500 mb-1">Ortalama Maliyet</div>
                                                    <div className="text-2xl font-bold text-primary-600">{part.avgCost}</div>
                                                </div>
                                                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-secondary-100">
                                                    <div className="text-sm text-secondary-500 mb-1">Ortalama Ömür</div>
                                                    <div className="text-2xl font-bold text-secondary-900">{part.lifespan}</div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-bold text-secondary-900 mb-2 flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        Arıza Belirtileri
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {part.symptoms.map((symptom, idx) => (
                                                            <li key={idx} className="flex items-center gap-2 text-secondary-600">
                                                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                                                {symptom}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                                                    <h4 className="font-bold text-secondary-900 mb-2 flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Ne Zaman Değiştirilmeli?
                                                    </h4>
                                                    <p className="text-secondary-700">{part.whenToReplace}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Elektrik Sistemi Bakımı İçin Servis Bulun</h2>
                    <p className="text-xl text-yellow-100 mb-8">
                        Güvenilir servislerden anında fiyat teklifi alın
                    </p>
                    <Link
                        href="/servisler"
                        className="inline-flex items-center gap-2 bg-white text-yellow-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Servis Bul
                    </Link>
                </div>
            </section>
        </div>
    );
}
