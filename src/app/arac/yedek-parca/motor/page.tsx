import Link from 'next/link';
import { Metadata } from 'next';
import { PartIcon } from '@/components/PartIcon';

export const metadata: Metadata = {
    title: 'Motor Parçaları | Yedek Parça Kütüphanesi | TamirHanem',
    description: 'Motor parçaları hakkında detaylı bilgi. Yağ filtresi, hava filtresi, buji, triger kayışı ve daha fazlası.',
};

const motorParts = [
    {
        name: 'Yağ Filtresi',
        iconType: 'filter',
        description: 'Motor yağındaki kirli partikülleri süzerek motorun temiz yağ ile çalışmasını sağlar.',
        avgCost: '50-150 ₺',
        lifespan: '10.000 km',
        difficulty: 'Kolay',
        symptoms: ['Motor gürültüsü', 'Yağ basıncı düşüklüğü', 'Motor ışığı yanması'],
        whenToReplace: 'Her yağ değişiminde mutlaka değiştirilmelidir. Genellikle 10.000 km veya 6 ayda bir.',
    },
    {
        name: 'Hava Filtresi',
        iconType: 'air',
        description: 'Motora giren havanın temizlenmesini sağlar, toz ve kiri filtreler.',
        avgCost: '80-200 ₺',
        lifespan: '15.000-20.000 km',
        difficulty: 'Kolay',
        symptoms: ['Güç kaybı', 'Yüksek yakıt tüketimi', 'Motor performans düşüklüğü'],
        whenToReplace: 'Yılda bir veya 15.000-20.000 km\'de bir kontrol edilip değiştirilmelidir.',
    },
    {
        name: 'Buji',
        iconType: 'spark',
        description: 'Yakıt-hava karışımını ateşleyerek motorun çalışmasını sağlar.',
        avgCost: '50-200 ₺ (adet)',
        lifespan: '30.000-60.000 km',
        difficulty: 'Kolay',
        symptoms: ['Çalışma zorluğu', 'Titreşim', 'Güç kaybı', 'Yüksek yakıt tüketimi'],
        whenToReplace: 'Araç tipine göre 30.000-60.000 km arasında değiştirilmelidir.',
    },
    {
        name: 'Triger Kayışı',
        iconType: 'belt',
        description: 'Motor supaplarının zamanlamasını sağlayan kritik bir parçadır.',
        avgCost: '1.500-4.000 ₺',
        lifespan: '60.000-100.000 km',
        difficulty: 'Zor',
        symptoms: ['Kayış çatlaması', 'Motor gürültüsü', 'Titreşim'],
        whenToReplace: 'Üretici önerisine göre 60.000-100.000 km\'de mutlaka değiştirilmelidir. Geç kalınması motor hasarına yol açabilir.',
    },
    {
        name: 'V Kayışı (Kanallı Kayış)',
        iconType: 'belt',
        description: 'Alternatör, klima kompresörü ve direksiyon pompası gibi yan üniteleri çalıştırır.',
        avgCost: '150-400 ₺',
        lifespan: '40.000-60.000 km',
        difficulty: 'Orta',
        symptoms: ['Ciyaklama sesi', 'Akü şarj olmaması', 'Klima çalışmaması'],
        whenToReplace: 'Çatlak, aşınma veya gevşeme görüldüğünde değiştirilmelidir.',
    },
    {
        name: 'Motor Yağı',
        iconType: 'oil',
        description: 'Motor parçalarını yağlayarak sürtünmeyi azaltır ve aşınmayı önler.',
        avgCost: '300-1.000 ₺',
        lifespan: '10.000-15.000 km',
        difficulty: 'Kolay',
        symptoms: ['Motor gürültüsü', 'Yağ seviyesi düşüklüğü', 'Motor ışığı'],
        whenToReplace: 'Üretici önerisine göre 10.000-15.000 km\'de veya yılda bir kez değiştirilmelidir.',
    },
    {
        name: 'Yakıt Filtresi',
        iconType: 'filter',
        description: 'Yakıttaki kirleri süzerek enjektörlerin temiz yakıt almasını sağlar.',
        avgCost: '100-300 ₺',
        lifespan: '20.000-40.000 km',
        difficulty: 'Orta',
        symptoms: ['Motor takılması', 'Güç kaybı', 'Çalışma zorluğu'],
        whenToReplace: 'Araç tipine göre 20.000-40.000 km\'de değiştirilmelidir.',
    },
    {
        name: 'Termostat',
        iconType: 'temperature',
        description: 'Motor sıcaklığını kontrol ederek optimum çalışma sıcaklığını sağlar.',
        avgCost: '150-400 ₺',
        lifespan: '80.000-100.000 km',
        difficulty: 'Orta',
        symptoms: ['Motor aşırı ısınması', 'Isınma süresi uzaması', 'Yakıt tüketimi artışı'],
        whenToReplace: 'Arıza belirtileri gösterdiğinde veya 80.000-100.000 km\'de değiştirilmelidir.',
    },
];

export default function MotorPartsPage() {
    return (
        <div className="bg-secondary-50 min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <PartIcon type="gear" className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold">Motor Parçaları</h1>
                            <p className="text-xl text-blue-100 mt-2">
                                Motorunuzun sağlıklı çalışması için gerekli tüm parçalar
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Parts Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8">
                        {motorParts.map((part, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-secondary-100 overflow-hidden">
                                <div className="p-8">
                                    <div className="flex items-start gap-6">
                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                                            <PartIcon type={part.iconType} className="w-10 h-10 text-blue-600" />
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
                                                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                                                {symptom}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                                    <h4 className="font-bold text-secondary-900 mb-2 flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Motor Parçası Değişimi İçin Servis Bulun</h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Güvenilir servislerden anında fiyat teklifi alın
                    </p>
                    <Link
                        href="/servisler"
                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
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
