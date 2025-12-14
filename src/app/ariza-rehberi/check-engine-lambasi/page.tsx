import Link from 'next/link';
import Image from 'next/image';
import SearchBox from '@/components/SearchBox';

export default function CheckEngineLightPage() {
    const commonCauses = [
        {
            title: 'Oksijen Sensörü Arızası',
            description: 'Egzoz gazındaki oksijen seviyesini ölçer. Arızalı sensör yakıt ekonomisini düşürür.',
            severity: 'Orta',
            cost: '₺800 - ₺2,500'
        },
        {
            title: 'Gevşek veya Arızalı Yakıt Kapağı',
            description: 'En yaygın ve en ucuz sebeplerden biri. Yakıt buharının kaçmasına neden olur.',
            severity: 'Düşük',
            cost: '₺50 - ₺300'
        },
        {
            title: 'Katalitik Konvertör Arızası',
            description: 'Egzoz emisyonlarını azaltır. Arızası ciddi performans kaybına yol açar.',
            severity: 'Yüksek',
            cost: '₺3,000 - ₺15,000'
        },
        {
            title: 'Hava Akış Sensörü (MAF) Arızası',
            description: 'Motora giren hava miktarını ölçer. Arızası rölanti ve performans sorunlarına neden olur.',
            severity: 'Orta',
            cost: '₺1,200 - ₺3,500'
        },
        {
            title: 'Buji veya Ateşleme Bobini Arızası',
            description: 'Yakıt karışımını ateşler. Arızası motor titreşimi ve güç kaybına yol açar.',
            severity: 'Orta',
            cost: '₺400 - ₺2,000'
        }
    ];

    const steps = [
        {
            number: '1',
            title: 'OBD-II Kod Okuyucu Kullanın',
            description: 'Arıza kodunu okumak için bir OBD-II tarayıcı kullanın. Bu, sorunu daraltmanıza yardımcı olur.'
        },
        {
            number: '2',
            title: 'Yakıt Kapağını Kontrol Edin',
            description: 'Yakıt kapağının sıkı kapalı olduğundan emin olun. Gevşek kapak en yaygın nedendir.'
        },
        {
            number: '3',
            title: 'Profesyonel Teşhis',
            description: 'Sorunu tam olarak tespit etmek için sertifikalı bir teknisyene başvurun.'
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-orange-600 to-red-600 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <Image
                        src="/images/symptoms/check-engine.png"
                        alt="Check Engine Light"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center gap-2 text-sm mb-4">
                        <Link href="/" className="hover:underline">Ana Sayfa</Link>
                        <span>/</span>
                        <Link href="/ariza-rehberi" className="hover:underline">Arıza Rehberi</Link>
                        <span>/</span>
                        <span>Motor Kontrol Lambası</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Motor Kontrol Lambası (Check Engine Light) Yanıyor
                    </h1>
                    <p className="text-xl text-orange-100 max-w-3xl">
                        Motor kontrol lambası yandığında paniğe kapılmayın. Sorun basit bir gevşek yakıt kapağından ciddi bir motor arızasına kadar değişebilir.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2">
                        {/* What It Means */}
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                                Motor Kontrol Lambası Ne Anlama Gelir?
                            </h2>
                            <div className="prose prose-lg max-w-none text-secondary-700">
                                <p className="mb-4">
                                    Motor kontrol lambası (check engine light), aracınızın bilgisayar sisteminin emisyon kontrol sisteminde bir sorun tespit ettiğini gösterir. Bu, motor performansını etkileyen çok çeşitli sorunları işaret edebilir.
                                </p>
                                <p className="mb-4">
                                    Lambanın yanma şekli de önemlidir:
                                </p>
                                <ul className="list-disc pl-6 mb-4 space-y-2">
                                    <li><strong>Sürekli yanıyor:</strong> Bir sorun var ama acil değil. En kısa sürede kontrol ettirin.</li>
                                    <li><strong>Yanıp sönüyor:</strong> Ciddi bir sorun var. Hemen durdurun ve çekici çağırın.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Common Causes */}
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                                Yaygın Nedenler
                            </h2>
                            <div className="space-y-4">
                                {commonCauses.map((cause, idx) => (
                                    <div key={idx} className="bg-white border border-secondary-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-xl font-bold text-secondary-900">
                                                {cause.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cause.severity === 'Yüksek' ? 'bg-red-100 text-red-700' :
                                                    cause.severity === 'Orta' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                {cause.severity}
                                            </span>
                                        </div>
                                        <p className="text-secondary-700 mb-3">
                                            {cause.description}
                                        </p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-secondary-600">Tahmini Maliyet:</span>
                                            <span className="font-bold text-primary-600">{cause.cost}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* What To Do */}
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                                Ne Yapmalısınız?
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {steps.map((step, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                                            {step.number}
                                        </div>
                                        <h3 className="text-lg font-bold text-secondary-900 mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-secondary-700 text-sm">
                                            {step.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Warning Box */}
                        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-12">
                            <div className="flex items-start">
                                <svg className="w-6 h-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-bold text-red-900 mb-2">Önemli Uyarı</h3>
                                    <p className="text-red-800">
                                        Motor kontrol lambası yanıp sönüyorsa, bu ciddi bir motor arızasını gösterir. Aracı hemen durdurun ve profesyonel yardım alın. Sürmeye devam etmek motora kalıcı hasar verebilir.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white text-center">
                            <h2 className="text-2xl font-bold mb-4">
                                Motor Kontrol Lambanız mı Yanıyor?
                            </h2>
                            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                                Yakınınızdaki onaylı servisleri bulun ve ücretsiz fiyat teklifi alın.
                            </p>
                            <Link
                                href="/servisler"
                                className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors"
                            >
                                Servis Bul
                            </Link>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Find a Shop Card */}
                        <div className="bg-white border border-secondary-200 rounded-lg overflow-hidden mb-6 shadow-sm sticky top-4">
                            <div className="h-32 relative overflow-hidden">
                                <Image
                                    src="/images/service-finder-header.png"
                                    alt="Servis Bul"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/80 to-primary-600/80"></div>
                            </div>
                            <div className="p-6 -mt-8">
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-secondary-900 mb-4 text-center">
                                        Onaylı Servis Bul
                                    </h3>
                                    <p className="text-sm text-secondary-600 mb-4 text-center">
                                        Yakınınızda yüksek kaliteli bir oto tamir servisi bulun
                                    </p>
                                    <SearchBox vertical={true} />
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-secondary-50 rounded-lg p-6 mb-6">
                            <h3 className="font-bold text-secondary-900 mb-4">Hızlı Bilgiler</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-secondary-600 mb-1">Aciliyet Seviyesi</div>
                                    <div className="font-bold text-secondary-900">Orta - Yüksek</div>
                                </div>
                                <div>
                                    <div className="text-sm text-secondary-600 mb-1">Ortalama Tamir Maliyeti</div>
                                    <div className="font-bold text-primary-600">₺500 - ₺15,000</div>
                                </div>
                                <div>
                                    <div className="text-sm text-secondary-600 mb-1">Tahmini Süre</div>
                                    <div className="font-bold text-secondary-900">1 - 4 saat</div>
                                </div>
                            </div>
                        </div>

                        {/* Related Links */}
                        <div className="bg-white border border-secondary-200 rounded-lg p-6">
                            <h3 className="font-bold text-secondary-900 mb-4">İlgili Konular</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/obd" className="text-primary-600 hover:text-primary-700 text-sm">
                                        OBD-II Kodları Nedir?
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/ariza-rehberi/motor-asiri-isiniyor" className="text-primary-600 hover:text-primary-700 text-sm">
                                        Motor Aşırı Isınıyor
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/ariza-rehberi/rolanti-duzensiz" className="text-primary-600 hover:text-primary-700 text-sm">
                                        Rölanti Düzensiz
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/ariza-rehberi" className="text-primary-600 hover:text-primary-700 text-sm">
                                        Tüm Belirtiler
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
