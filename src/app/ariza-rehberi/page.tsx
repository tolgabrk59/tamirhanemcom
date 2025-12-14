import Link from 'next/link';
import Image from 'next/image';
import SearchBox from '@/components/SearchBox';

export default function ArizaRehberiPage() {
    // RepairPal benzeri yaygın belirtiler
    const commonSymptoms = [
        {
            name: 'Kalorifer Çalışmıyor',
            slug: 'kalorifer-calismıyor',
            image: '/images/symptoms/heater.png'
        },
        {
            name: 'Klima Çalışmıyor',
            slug: 'klima-calismıyor',
            image: '/images/symptoms/ac.png'
        },
        {
            name: 'Araç Yağ Sızdırıyor',
            slug: 'arac-yag-sizdiriyor',
            image: '/images/symptoms/oil-leak.png'
        },
        {
            name: 'Anahtar Dönmüyor',
            slug: 'anahtar-donmuyor',
            image: '/images/symptoms/key.png'
        },
        {
            name: 'Motor Aşırı Isınıyor',
            slug: 'motor-asiri-isiniyor',
            image: '/images/symptoms/overheating.png'
        },
        {
            name: 'Rölanti Düzensiz',
            slug: 'rolanti-duzensiz',
            image: '/images/symptoms/rough-idle.png'
        },
    ];

    const warningLights = [
        { name: 'Fren Uyarı Lambası', slug: 'fren-uyari-lambasi', image: '/images/lights/brake.png' },
        { name: 'Soğutma Suyu Seviye Lambası', slug: 'sogutma-suyu-lambasi', image: '/images/lights/coolant.png' },
        { name: 'Motor Sıcaklık Lambası', slug: 'motor-sicaklik-lambasi', image: '/images/lights/temp.png' },
        { name: 'ABS Lambası', slug: 'abs-lambasi', image: '/images/lights/abs.png' },
        { name: 'Çekiş Kontrolü Lambası', slug: 'cekis-kontrol-lambasi', image: '/images/lights/traction.png' },
        { name: 'Gaz Kelebeği Lambası', slug: 'gaz-kelebegi-lambasi', image: '/images/lights/throttle.png' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <Image
                        src="/images/symptoms/hero.png"
                        alt="Arıza Teşhis"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Arıza Belirti Rehberi
                        </h1>
                        <p className="text-xl text-primary-100 mb-6">
                            Aracınızdaki belirtilerden yola çıkarak olası sorunları tespit edin. Erken teşhis, büyük tamiratları önler ve cebinizi korur.
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>40+ Belirti</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Tahmini Maliyet</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Aciliyet Seviyesi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2">
                        {/* Title */}
                        <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                            Aracınızın Sorununu Teşhis Edin
                        </h2>
                        <p className="text-lg text-secondary-700 mb-6">
                            Aracınızın belirtisini seçin, neyin yanlış olabileceğini ve nasıl düzeltileceğini öğrenin.
                        </p>

                        {/* Intro Text */}
                        <div className="text-secondary-700 mb-8 leading-relaxed">
                            <p className="mb-4">
                                İster rahatsız edici bir tıkırtı, benzin kokusu veya gösterge panelinizdeki bir uyarı lambası ile başlasın, tanımlanamayan araç sorunu midenizi bulandırabilir.
                            </p>
                            <p>
                                TamirHanem, sizin için kaputun altına bakması için güvenilir bir tamirci bulmanızı kolaylaştırır. Ancak önce aracınızı teşhis etmek yararlıdır çünkü bir tamirin ne kadar acil olduğunu, tamircinizden ne bekleyeceğinizi ve sorunu net bir şekilde nasıl ileteceğinizi bileceksiniz.
                            </p>
                        </div>

                        {/* Troubleshooting Quizzes */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Arıza Teşhis Testleri</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <Link href="/ariza-rehberi/check-engine-lambasi" className="group">
                                    <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all">
                                        <div className="aspect-[16/9] relative">
                                            <Image
                                                src="/images/symptoms/check-engine.png"
                                                alt="Motor Kontrol Lambası"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <h3 className="text-white font-bold text-xl mb-2">Motor Kontrol Lambası Yanıyor</h3>
                                                <p className="text-white/90 text-sm">
                                                    Aracınızın check engine lambasının ne işaret ediyor olabileceğini öğrenin.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <Link href="/ariza-rehberi/arac-calismıyor" className="group">
                                    <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all">
                                        <div className="aspect-[16/9] relative">
                                            <Image
                                                src="/images/symptoms/wont-start.png"
                                                alt="Araç Çalışmıyor"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <h3 className="text-white font-bold text-xl mb-2">Araç Çalışmıyor</h3>
                                                <p className="text-white/90 text-sm">
                                                    Birkaç kısa soruyu yanıtlayarak çalışmayan aracın nedenini daraltın.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Common Symptoms */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-secondary-900 mb-4">Yaygın Belirtiler</h2>
                            <p className="text-secondary-700 mb-6">
                                Aracınızın sağlığını takip etmek için teknisyen olmanıza gerek yok - sadece olağandışı değişiklikler konusunda dikkatli olmanız gerekir. Bir şey fark ettiğinizde, yapabildiğiniz tüm ipuçlarını kullanın: nerede oluyor, ne zaman oluyor ve dahil olan tüm belirtiler.
                            </p>

                            <div className="grid md:grid-cols-3 gap-4">
                                {commonSymptoms.map((symptom, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/ariza-rehberi/${symptom.slug}`}
                                        className="group bg-white border border-secondary-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                                    >
                                        <div className="aspect-[4/3] bg-secondary-100 relative overflow-hidden">
                                            <Image
                                                src={symptom.image}
                                                alt={symptom.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-secondary-900 group-hover:text-violet-600 transition-colors">
                                                {symptom.name}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* More Symptoms List */}
                        <div className="mb-12">
                            <div className="grid md:grid-cols-2 gap-3">
                                {[
                                    'Egzoz Muayenesi Başarısız',
                                    'Araçtan Sıvı Sızıntısı',
                                    'Buğu Açıcı Çalışmıyor',
                                    'Frenlerim Ses Çıkarıyor',
                                    'Cam Suyu Çalışmıyor',
                                    'Fren Yaparken Araç Titriyor',
                                    'Akü Değişimi Sonrası Elektrik Sorunları',
                                    'Yeni Akü Sonrası Motor Duruyor',
                                    'Egzozdan Duman Çıkıyor',
                                    'Vakum Kaçağı Belirtileri',
                                    'Araç Titriyor',
                                    'Araçtan Garip Ses Geliyor',
                                ].map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/ariza-rehberi/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="text-secondary-700 hover:text-violet-600 transition-colors py-2 border-b border-secondary-100"
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Warning Lights */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-secondary-900 mb-4">Araç Uyarı Lambaları</h2>
                            <p className="text-secondary-700 mb-6">
                                Gösterge paneli uyarı lambaları, aracınızın iç sistemlerinin sorun büyümeden önce potansiyel bir sorunu işaret etmesinin bir yoludur. Bunlar göründüğünde, ne olduğunu ve ne zaman meydana geldiğini (veya sürekli olup olmadığını) fark edin. Sorunu kendi başınıza teşhis edebilirsiniz, ancak bazen sertifikalı bir teknisyen gerekli olacaktır.
                            </p>

                            <div className="grid md:grid-cols-3 gap-4">
                                {warningLights.map((light, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/ariza-rehberi/${light.slug}`}
                                        className="group bg-white border border-secondary-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                                    >
                                        <div className="aspect-[4/3] bg-[#1a1a1a] relative overflow-hidden">
                                            <Image
                                                src={light.image}
                                                alt={light.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors text-sm">
                                                {light.name}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-6 text-right">
                                <Link href="/uyari-lambalari" className="text-violet-600 hover:text-violet-700 font-medium">
                                    Tüm gösterge paneli uyarı lambalarını görün
                                </Link>
                            </div>
                        </div>

                        {/* Auto Parts Troubleshooting */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                                Arızalı veya Bozuk Oto Parçaları Sorun Giderme
                            </h2>
                            <div className="grid md:grid-cols-2 gap-3">
                                {[
                                    'Alternatör',
                                    'Katalitik Konvertör',
                                    'Yakıt Pompası',
                                    'PCV Valfi',
                                    'Buji',
                                    'Marş Motoru',
                                    'Rot Başı',
                                    'Teker Rulmanı',
                                    'EGR Valfi',
                                    'Distribütör',
                                    'Gaz Kelebeği Sensörü',
                                    'Yakıt Basınç Regülatörü',
                                ].map((part, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/parca/${part.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="text-secondary-700 hover:text-violet-600 transition-colors py-2"
                                    >
                                        {part}
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-6">
                                <Link href="/oto-parca-belirtileri" className="text-violet-600 hover:text-violet-700 font-medium">
                                    Daha fazla oto parça belirtisi görün
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Find a Shop Card */}
                        <div className="bg-white border border-secondary-200 rounded-lg overflow-hidden mb-6 shadow-sm">
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

                        {/* Quick Links */}
                        <div className="bg-secondary-50 rounded-lg p-6">
                            <h3 className="font-bold text-secondary-900 mb-4">Yola Geri Dön</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/servisler" className="text-secondary-700 hover:text-violet-600 text-sm">
                                        Yakınımda oto tamir bul
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/soru-sor" className="text-secondary-700 hover:text-violet-600 text-sm">
                                        Soru sor
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/fiyat-hesapla" className="text-secondary-700 hover:text-violet-600 text-sm">
                                        Ücretsiz tamir tahminleri
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/arac/bakim-tavsiyeleri" className="text-secondary-700 hover:text-violet-600 text-sm">
                                        Araç bakım tavsiyeleri
                                    </Link>
                                </li>
                            </ul>

                            <h3 className="font-bold text-secondary-900 mb-4 mt-6">Bir Araç Araştır</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/arac/genel-bakis" className="text-secondary-700 hover:text-violet-600 text-sm">
                                        Araç genel bakış
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/guvenilirlik" className="text-secondary-700 hover:text-violet-600 text-sm">
                                        Araç güvenilirlik derecelendirmeleri
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/kronik-sorunlar" className="text-secondary-700 hover:text-violet-600 text-sm">
                                        Yaygın sorunlar
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/bakim-takvimi" className="text-secondary-700 hover:text-violet-600 text-sm">
                                        Araç Bakım Takvimi
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/geri-cagrima" className="text-secondary-700 hover:text-violet-600 text-sm">
                                        Geri çağırmaları bul
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/yorumlar" className="text-secondary-700 hover:text-violet-600 text-sm">
                                        Araç sahibi yorumları
                                    </Link>
                                </li>
                            </ul>

                            <h3 className="font-bold text-secondary-900 mb-4 mt-6">TamirHanem'den Daha Fazlası</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/obd" className="text-secondary-700 hover:text-violet-600 text-sm">
                                        Teşhis OBD-II kodları
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/uyari-lambalari" className="text-secondary-700 hover:text-violet-600 text-sm">
                                        Gösterge paneli uyarı lambaları
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
