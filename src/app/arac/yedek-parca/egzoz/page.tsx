import Link from 'next/link';
import { Metadata } from 'next';
import { PartIcon } from '@/components/PartIcon';

export const metadata: Metadata = {
    title: 'Egzoz Sistemi Parçaları | Yedek Parça Kütüphanesi | TamirHanem',
    description: 'Egzoz sistemi parçaları. Katalitik konvertör, egzoz susturucusu, lambda sensörü ve daha fazlası.',
};

const exhaustParts = [
    {
        name: 'Katalitik Konvertör',
        iconType: 'catalytic',
        description: 'Egzoz gazlarındaki zararlı maddeleri azaltan çevre dostu parçadır.',
        avgCost: '2.000-8.000 ₺',
        lifespan: '100.000-150.000 km',
        difficulty: 'Orta',
        symptoms: ['Motor gücü kaybı', 'Yakıt tüketimi artışı', 'Motor ışığı yanması', 'Egzoz kokusu'],
        whenToReplace: 'Tıkanma veya hasar durumunda değiştirilmelidir. Çok pahalı bir parçadır.',
    },
    {
        name: 'Egzoz Susturucusu (Arka/Orta)',
        iconType: 'exhaust',
        description: 'Egzoz sesini azaltan ve gazları dışarı atan parçadır.',
        avgCost: '400-1.500 ₺',
        lifespan: '50.000-80.000 km',
        difficulty: 'Orta',
        symptoms: ['Aşırı gürültü', 'Pas ve delik', 'Egzoz dumanı', 'Performans kaybı'],
        whenToReplace: 'Delinme, paslanma veya aşırı gürültü durumunda değiştirilmelidir.',
    },
    {
        name: 'Lambda Sensörü (Oksijen Sensörü)',
        iconType: 'sensor',
        description: 'Egzoz gazlarındaki oksijen miktarını ölçerek yakıt karışımını optimize eder.',
        avgCost: '300-1.200 ₺',
        lifespan: '80.000-120.000 km',
        difficulty: 'Orta',
        symptoms: ['Motor ışığı yanması', 'Yüksek yakıt tüketimi', 'Performans kaybı', 'Egzoz emisyon artışı'],
        whenToReplace: 'Arıza kodu verdiğinde veya emisyon testinde başarısız olduğunda değiştirilmelidir.',
    },
    {
        name: 'Egzoz Borusu',
        iconType: 'wrench',
        description: 'Motordan gelen egzoz gazlarını taşıyan boru sistemi.',
        avgCost: '300-1.000 ₺',
        lifespan: '60.000-100.000 km',
        difficulty: 'Orta',
        symptoms: ['Egzoz kaçağı', 'Gürültü', 'Pas ve delik', 'Performans kaybı'],
        whenToReplace: 'Delik, çatlak veya aşırı paslanma durumunda değiştirilmelidir.',
    },
    {
        name: 'Egzoz Manifoldu',
        iconType: 'gear',
        description: 'Motor silindirlerinden gelen gazları toplayan parçadır.',
        avgCost: '800-2.500 ₺',
        lifespan: '100.000+ km',
        difficulty: 'Zor',
        symptoms: ['Egzoz kaçağı', 'Tıslama sesi', 'Motor gücü kaybı', 'Yanık kokusu'],
        whenToReplace: 'Çatlak veya conta hasarı durumunda değiştirilmelidir.',
    },
    {
        name: 'Egzoz Askı Lastiği',
        iconType: 'wrench',
        description: 'Egzoz sistemini şasiye bağlayan kauçuk askı parçası.',
        avgCost: '30-100 ₺ (adet)',
        lifespan: '30.000-50.000 km',
        difficulty: 'Kolay',
        symptoms: ['Egzoz sarkması', 'Gürültü', 'Titreşim'],
        whenToReplace: 'Yırtılma veya kopma durumunda değiştirilmelidir.',
    },
];

export default function ExhaustPartsPage() {
    return (
        <div className="bg-secondary-50 min-h-screen">

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <PartIcon type="exhaust" className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold">Egzoz Sistemi Parçaları</h1>
                            <p className="text-xl text-gray-300 mt-2">
                                Egzoz gazlarının güvenli atılımı için gerekli parçalar
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Parts Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8">
                        {exhaustParts.map((part, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-secondary-100 overflow-hidden">
                                <div className="p-8">
                                    <div className="flex items-start gap-6">
                                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0">
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
                                                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                                                                {symptom}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                                    <h4 className="font-bold text-secondary-900 mb-2 flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Info Section */}
            <section className="py-12 bg-blue-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl p-8 border-2 border-blue-200">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-secondary-900 mb-2">Emisyon Testi ve Çevre</h3>
                                <p className="text-secondary-600 mb-4">
                                    Egzoz sistemi sadece performans için değil, çevre sağlığı ve yasal zorunluluklar için de kritik öneme sahiptir. 
                                    Düzenli bakım ve arızalı parçaların değiştirilmesi emisyon testlerinden geçmenizi sağlar.
                                </p>
                                <ul className="space-y-2 text-secondary-600">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                        Katalitik konvertör çalınma riski taşır, park yerlerine dikkat edin
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                        Lambda sensörü arızası yakıt tüketimini %20-30 artırabilir
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                        Egzoz kaçağı kapalı alanlarda tehlikeli olabilir
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Egzoz Sistemi Bakımı İçin Servis Bulun</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Güvenilir servislerden anında fiyat teklifi alın
                    </p>
                    <Link
                        href="/servisler"
                        className="inline-flex items-center gap-2 bg-white text-gray-800 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
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
