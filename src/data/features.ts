export interface Feature {
    id: string;
    title: string;
    description: string;
    icon: string;
    href: string;
    color: string;
    gradient: string;
}

export const featuresData: Feature[] = [
    {
        id: 'recalls',
        title: 'Araç Geri Çağırmaları',
        description: 'Aracınız için güncel geri çağırma bildirimlerini kontrol edin ve güvenliğinizi sağlayın.',
        icon: 'bell',
        href: '/geri-cagrima',
        color: '#ef4444',
        gradient: 'from-red-500 to-red-600',
    },
    {
        id: 'common-problems',
        title: 'Yaygın Problemler',
        description: 'Araç markanız ve modelinize özgü en sık karşılaşılan sorunları keşfedin.',
        icon: 'wrench',
        href: '/#yaygin-problemler',
        color: '#f97316',
        gradient: 'from-orange-500 to-orange-600',
    },
    {
        id: 'tires',
        title: 'Lastikler',
        description: 'Aracınıza uygun lastik seçimi, bakım ipuçları ve mevsimsel öneriler.',
        icon: 'tire',
        href: '/lastikler',
        color: '#0ea5e9',
        gradient: 'from-sky-500 to-sky-600',
    },
    {
        id: 'reliability',
        title: 'Güvenilirlik Değerlendirmeleri',
        description: 'Farklı marka ve modellerin güvenilirlik puanlarını karşılaştırın.',
        icon: 'star',
        href: '/guvenilirlik',
        color: '#eab308',
        gradient: 'from-yellow-500 to-yellow-600',
    },
    {
        id: 'symptoms',
        title: 'Belirti Rehberi',
        description: 'Aracınızdaki belirtilerden yola çıkarak olası sorunları tespit edin.',
        icon: 'search',
        href: '/belirtiler',
        color: '#8b5cf6',
        gradient: 'from-violet-500 to-violet-600',
    },
    {
        id: 'maintenance',
        title: 'Bakım Takvimi',
        description: 'Kilometre ve yıl bazında periyodik bakım planınızı oluşturun.',
        icon: 'calendar',
        href: '/bakim-takvimi',
        color: '#22c55e',
        gradient: 'from-green-500 to-green-600',
    },
];
