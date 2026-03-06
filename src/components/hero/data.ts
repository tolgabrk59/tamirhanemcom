import type { CarPart, QuickAction, MenuItem, HeroService, TourStep } from './types';

export const SITE_YELLOW = '#FBC91D';

export const carParts: CarPart[] = [
  {
    id: 'motor',
    name: 'Motor',
    description: 'Motor bakim & onarim',
    href: '/servisler?category=motor-bakim',
    color: SITE_YELLOW,
    icon: 'motor',
    details: ['Yag degisimi', 'Triger kayisi', 'Motor revizyonu', 'Conta degisimi'],
    priceRange: '',
  },
  {
    id: 'fren',
    name: 'Fren',
    description: 'Fren sistemi servisi',
    href: '/servisler?category=fren',
    color: SITE_YELLOW,
    icon: 'fren',
    details: ['Balata degisimi', 'Disk tornalama', 'Fren hidroligi', 'ABS tamiri'],
    priceRange: '',
  },
  {
    id: 'lastik',
    name: 'Lastik',
    description: 'Lastik degisim & balans',
    href: '/servisler?category=lastik',
    color: SITE_YELLOW,
    icon: 'lastik',
    details: ['Lastik degisimi', 'Balans ayari', 'Rot balans', 'Jant duzeltme'],
    priceRange: '',
  },
  {
    id: 'elektrik',
    name: 'Far & Elektrik',
    description: 'Elektrik & aydinlatma',
    href: '/servisler?category=elektrik',
    color: SITE_YELLOW,
    icon: 'elektrik',
    details: ['Aku degisimi', 'Far ayari', 'Kablo tamiri', 'Sensor degisimi'],
    priceRange: '',
  },
  {
    id: 'karoser',
    name: 'Kaporta & Boya',
    description: 'Boya & kaporta',
    href: '/servisler?category=kaporta',
    color: SITE_YELLOW,
    icon: 'karoser',
    details: ['Boya islemi', 'Gocuk duzeltme', 'Cizik giderme', 'Parca degisimi'],
    priceRange: '',
  },
  {
    id: 'egzoz',
    name: 'Egzoz',
    description: 'Egzoz sistemi',
    href: '/servisler?category=egzoz',
    color: SITE_YELLOW,
    icon: 'egzoz',
    details: ['Egzoz degisimi', 'Susturucu tamiri', 'Katalitik konvertor', 'Sizinti onarimi'],
    priceRange: '',
  },
  {
    id: 'cam',
    name: 'Cam',
    description: 'Oto cam servisi',
    href: '/servisler?category=cam',
    color: SITE_YELLOW,
    icon: 'cam',
    details: ['On cam degisimi', 'Cam filmi', 'Cam tamiri', 'Ayna degisimi'],
    priceRange: '',
  },
  {
    id: 'klima',
    name: 'Klima',
    description: 'Klima bakim & onarim',
    href: '/servisler?category=klima',
    color: SITE_YELLOW,
    icon: 'klima',
    details: ['Klima gazi dolumu', 'Klima temizligi', 'Kompresor tamiri', 'Kalorifer tamiri'],
    priceRange: '',
  },
  {
    id: 'suspansiyon',
    name: 'Suspansiyon',
    description: 'Amortisor & suspansiyon',
    href: '/servisler?category=suspansiyon',
    color: SITE_YELLOW,
    icon: 'suspansiyon',
    details: ['Amortisor degisimi', 'Helezon yay', 'Rotil degisimi', 'Salincak tamiri'],
    priceRange: '',
  },
  {
    id: 'sanziman',
    name: 'Sanziman',
    description: 'Vites & sanziman',
    href: '/servisler?category=sanziman',
    color: SITE_YELLOW,
    icon: 'sanziman',
    details: ['Debriyaj seti', 'Sanziman yagi', 'Vites tamiri', 'Diferansiyel'],
    priceRange: '',
  },
  {
    id: 'direksiyon',
    name: 'Direksiyon',
    description: 'Direksiyon sistemi',
    href: '/servisler?category=direksiyon',
    color: SITE_YELLOW,
    icon: 'direksiyon',
    details: ['Direksiyon kutusu', 'Hidrolik direksiyon', 'Rot kolu', 'Direksiyon pompasi'],
    priceRange: '',
  },
  {
    id: 'icmekan',
    name: 'Ic Mekan',
    description: 'Ic temizlik & doseme',
    href: '/servisler?category=ic-mekan',
    color: SITE_YELLOW,
    icon: 'icmekan',
    details: ['Detayli temizlik', 'Koltuk doseme', 'Tavan doseme', 'Torpido tamiri'],
    priceRange: '',
  },
];

export const quickActions: QuickAction[] = [
  { id: 'servis', label: 'Servis Bul', icon: 'search', href: '/servisler', color: SITE_YELLOW },
  { id: 'randevu', label: 'Randevu Al', icon: 'calendar', href: '/randevu-al', color: '#3B82F6' },
  { id: 'fiyat', label: 'Fiyat Hesapla', icon: 'money', href: '/fiyat-hesapla', color: '#10B981' },
  { id: 'arac-deger', label: 'Arac Degeri', icon: 'car', href: '/arac-degeri', color: '#F59E0B' },
  { id: 'asistan', label: 'AI Asistan', icon: 'robot', href: '/ai/ariza-tespit', color: '#8B5CF6' },
  { id: 'sohbet', label: 'AI Sohbet', icon: 'chat', href: '/ai/sohbet', color: '#EC4899' },
  { id: 'obd', label: 'OBD Kodlari', icon: 'chart', href: '/obd', color: '#06B6D4' },
  { id: 'karsilastir', label: 'Arac Karsilastir', icon: 'compare', href: '/karsilastirma/olustur', color: '#EF4444' },
  { id: 'ariza-rehber', label: 'Ariza Rehberi', icon: 'wrench', href: '/ariza-rehberi', color: '#F97316' },
  { id: 'bakim', label: 'Bakim Planlama', icon: 'clipboard', href: '/bakim-planlama', color: '#84CC16' },
];

export const menuItemsArac: MenuItem[] = [
  { id: 'genel-bakis', label: 'Araciniza Genel Bakis', icon: 'car', href: '/arac/genel-bakis', color: '#3B82F6' },
  { id: 'bakim-tavsiyeleri', label: 'Arac Bakimi Tavsiyeleri', icon: 'elektrik', href: '/arac/bakim-tavsiyeleri', color: '#10B981' },
  { id: 'ansiklopedi', label: 'Arac Ansiklopedisi', icon: 'book', href: '/arac/ansiklopedi', color: '#8B5CF6' },
  { id: 'yedek-parca', label: 'Parca Kutuphanesi', icon: 'bolt', href: '/arac/yedek-parca', color: '#F59E0B' },
  { id: 'lastik-secimi', label: 'Lastik Secimi', icon: 'lastik', href: '/arac/lastik-secimi', color: '#6366F1' },
  { id: 'ariza-lambalari', label: 'Arac Ariza Lambalari', icon: 'alert', href: '/arac/ariza-lambalari', color: '#EF4444' },
  { id: 'kronik-sorunlar', label: 'Kronik Sorunlar', icon: 'warning', href: '/kronik-sorunlar', color: '#F97316' },
  { id: 'forum', label: 'Forum', icon: 'forum', href: '/forum', color: '#06B6D4' },
];

export const menuItemsRehber: MenuItem[] = [
  { id: 'incelemeler', label: 'Araba Incelemeleri', icon: 'review', href: '/incelemeler', color: '#EC4899' },
  { id: 'karsilastirmalar', label: 'Onceki Karsilastirmalar', icon: 'chart', href: '/karsilastirma', color: '#8B5CF6' },
  { id: 'guvenilirlik', label: 'Guvenilirlik Derecelendirmeleri', icon: 'star', href: '/guvenilirlik', color: '#F59E0B' },
  { id: 'workshop', label: 'Workshop Kilavuzlari', icon: 'book', href: '/arac/workshop-kilavuzlari', color: '#3B82F6' },
  { id: 'videolar', label: 'Video Icerik Merkezi', icon: 'video', href: '/arac/videolar', color: '#EF4444' },
];

export const heroServices: HeroService[] = [
  { id: 'periyodik-bakim', name: 'Bakim', category: 'Periyodik Bakim', color: SITE_YELLOW },
  { id: 'yag-degisimi', name: 'Yag', category: 'Yag Degisimi', color: SITE_YELLOW },
  { id: 'fren-sistemi', name: 'Fren', category: 'Fren Sistemi Onarimi', color: SITE_YELLOW },
  { id: 'lastik-servisi', name: 'Lastik', category: 'Lastik Servisi', color: SITE_YELLOW },
  { id: 'elektrik', name: 'Elektrik', category: 'Elektrik Sistemi Onarimi', color: SITE_YELLOW },
  { id: 'klima', name: 'Klima', category: 'Klima Bakimi ve Onarimi', color: SITE_YELLOW },
  { id: 'motor', name: 'Motor', category: 'Motor Onarimi', color: SITE_YELLOW },
  { id: 'sanziman', name: 'Sanziman', category: 'Sanziman Onarimi', color: SITE_YELLOW },
  { id: 'kaporta', name: 'Kaporta', category: 'Kaporta ve Boya', color: SITE_YELLOW },
  { id: 'diagnostik', name: 'Ariza', category: 'Diagnostik ve Ariza Tespiti', color: SITE_YELLOW },
  { id: 'oto-yikama', name: 'Yikama', category: 'Oto Yikama, Ic Temizlik ve Detaylandirma', color: SITE_YELLOW },
  { id: 'cekici', name: 'Cekici', category: 'Cekici ve Yol Yardim', color: SITE_YELLOW },
];

export const hotspotPositions: { [key: string]: [number, number, number] } = {
  lastik: [0.74, -0.34, 1.25],
  motor: [0.04, 0.03, 1.78],
  fren: [0.81, -0.31, -0.71],
  elektrik: [0.70, 0.02, 1.69],
  karoser: [0.80, -0.05, 0.32],
  egzoz: [0.80, -0.07, -1.53],
  cam: [0.06, 0.40, 0.53],
  suspansiyon: [0.74, -0.12, 0.90],
  icmekan: [0.61, 0.35, -0.24],
};

export const tourSteps: TourStep[] = [
  {
    id: 1,
    title: '3D Arac Modeli',
    description: 'Aracinizdaki parcalara tiklayarak ilgili servisleri kesfedin.',
    position: 'right',
  },
  {
    id: 2,
    title: 'Hizmet Noktalari',
    description: 'Renkli noktalar farkli servis kategorilerini gosterir.',
    position: 'right',
  },
  {
    id: 3,
    title: 'Hizli Arama',
    description: 'Ctrl+K ile hizlica arama yapabilirsiniz.',
    position: 'left',
  },
];

export const heroWords = [
  'Dijital Servisi',
  'Guvenilir Ortagi',
  'Akilli Rehberi',
  'Tek Adresi',
];

export const placeholderTexts = [
  'Servis Bul', 'Yag Degisimi', 'Fren Bakimi', 'Lastik Degisimi',
  'Motor Bakimi', 'Klima Bakimi', 'Aku Degisimi', 'Balata Degisimi',
  'OBD Kodu Sorgula', 'Arac Degeri Hesapla', 'Randevu Al', 'Fiyat Hesapla',
  'Sarj Istasyonu Bul',
];
