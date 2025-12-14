import Link from 'next/link';
import { Metadata } from 'next';
import { PartIcon } from '@/components/PartIcon';

export const metadata: Metadata = {
    title: 'Şanzıman & Debriyaj Parçaları | Yedek Parça Kütüphanesi | TamirHanem',
    description: 'Şanzıman ve debriyaj sistemi parçaları. Debriyaj seti, şanzıman yağı, kardan mili ve daha fazlası.',
};

const transmissionParts = [
    {
        name: 'Debriyaj Seti (Balata, Baskı, Bilya)',
        iconType: 'clutch',
        description: 'Motor gücünü şanzımana ileten ve vites değiştirmeyi sağlayan sistem.',
        avgCost: '2.500-6.000 ₺',
        lifespan: '80.000-150.000 km',
        difficulty: 'Zor',
        symptoms: ['Pedal sertliği', 'Vites geçiş zorluğu', 'Kayma hissi', 'Yanık kokusu', 'Titreşim'],
        whenToReplace: 'Kayma, titreşim veya vites geçiş zorluğu yaşandığında set olarak değiştirilmelidir.',
    },
    {
        name: 'Şanzıman Yağı (Manuel/Otomatik)',
        iconType: 'oil',
        description: 'Şanzıman dişlilerini yağlayarak aşınmayı önler ve soğutma sağlar.',
        avgCost: '400-1.500 ₺',
        lifespan: '40.000-60.000 km (Manuel), 60.000-80.000 km (Otomatik)',
        difficulty: 'Orta',
        symptoms: ['Vites geçiş zorluğu', 'Gürültü', 'Titreşim', 'Yağ kaçağı'],
        whenToReplace: 'Manuel şanzımanda 40.000-60.000 km, otomatik şanzımanda 60.000-80.000 km\'de değiştirilmelidir.',
    },
    {
        name: 'Kardan Mili',
        iconType: 'transmission',
        description: 'Şanzımandan gelen gücü arka aksa ileten mil.',
        avgCost: '1.500-4.000 ₺',
        lifespan: '150.000+ km',
        difficulty: 'Zor',
        symptoms: ['Titreşim', 'Gürültü', 'Kalkışta ses', 'Aşınma'],
        whenToReplace: 'Rulman veya aks hasarı durumunda tamir veya değişim yapılmalıdır.',
    },
    {
        name: 'Diferansiyel (Aks)',
        iconType: 'clutch',
        description: 'Virajlarda tekerleklerin farklı hızlarda dönmesini sağlar.',
        avgCost: '3.000-8.000 ₺',
        lifespan: '150.000+ km',
        difficulty: 'Zor',
        symptoms: ['Gürültü', 'Titreşim', 'Yağ kaçağı', 'Virajda ses'],
        whenToReplace: 'Dişli hasarı veya rulman arızası durumunda tamir veya değişim yapılmalıdır.',
    },
    {
        name: 'Debriyaj Merkezi (Pompa)',
        iconType: 'fluid',
        description: 'Hidrolik debriyaj sisteminde basıncı ileten pompa.',
        avgCost: '400-1.000 ₺',
        lifespan: '100.000+ km',
        difficulty: 'Orta',
        symptoms: ['Pedal yumuşaması', 'Vites geçiş zorluğu', 'Hidrolik sızıntısı'],
        whenToReplace: 'Sızıntı veya basınç kaybı durumunda değiştirilmelidir.',
    },
    {
        name: 'Vites Kolu Körüğü',
        iconType: 'wrench',
        description: 'Vites kolu etrafındaki koruyucu kauçuk parça.',
        avgCost: '50-200 ₺',
        lifespan: '50.000+ km',
        difficulty: 'Kolay',
        symptoms: ['Yırtılma', 'Çatlama', 'Toz girişi'],
        whenToReplace: 'Yırtılma veya çatlama görüldüğünde değiştirilmelidir.',
    },
];

export default function TransmissionPartsPage() {
    return (
        <div className="bg-secondary-50 min-h-screen">

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <PartIcon type="transmission" className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold">Şanzıman & Debriyaj</h1>
                            <p className="text-xl text-indigo-100 mt-2">
                                Güç aktarım sistemi parçaları ve bakım bilgileri
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Parts Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8">
                        {transmissionParts.map((part, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-secondary-100 overflow-hidden">
                                <div className="p-8">
                                    <div className="flex items-start gap-6">
                                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center flex-shrink-0">
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
                                                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                                                {symptom}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                                    <h4 className="font-bold text-secondary-900 mb-2 flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Şanzıman & Debriyaj Bakımı İçin Servis Bulun</h2>
                    <p className="text-xl text-indigo-100 mb-8">
                        Güvenilir servislerden anında fiyat teklifi alın
                    </p>
                    <Link
                        href="/servisler"
                        className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
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
