import type { Category } from '@/types';

// Fallback kategoriler - Strapi'den veri gelmezse kullanılır
export const categoriesData: Category[] = [
  {
    id: 1,
    title: 'Motor Bakım & Onarım',
    slug: 'motor-bakim',
    description: 'Yağ değişimi, triger kayışı, motor revizyonu ve tüm motor bakım işlemleri',
    icon: { url: '/icons/engine.svg' }
  },
  {
    id: 2,
    title: 'Fren Sistemi',
    slug: 'fren-sistemi',
    description: 'Balata, disk, fren hidroliği ve ABS sistem bakımları',
    icon: { url: '/icons/brake.svg' }
  },
  {
    id: 3,
    title: 'Şanzıman & Debriyaj',
    slug: 'sanziman',
    description: 'Manuel ve otomatik şanzıman bakımı, debriyaj değişimi',
    icon: { url: '/icons/transmission.svg' }
  },
  {
    id: 4,
    title: 'Elektrik & Elektronik',
    slug: 'elektrik',
    description: 'Akü, alternatör, marş motoru ve elektronik sistem arızaları',
    icon: { url: '/icons/electrical.svg' }
  },
  {
    id: 5,
    title: 'Süspansiyon & Direksiyon',
    slug: 'suspansiyon',
    description: 'Amortisör, rot, rotil, salıncak ve direksiyon sistemi',
    icon: { url: '/icons/suspension.svg' }
  },
  {
    id: 6,
    title: 'Klima & Kalorifer',
    slug: 'klima',
    description: 'Klima gazı dolumu, kompresör tamiri ve kalorifer sistemi',
    icon: { url: '/icons/ac.svg' }
  },
  {
    id: 7,
    title: 'Egzoz & Emisyon',
    slug: 'egzoz',
    description: 'Katalitik konvertör, egzoz borusu, EGR ve DPF temizliği',
    icon: { url: '/icons/exhaust.svg' }
  },
  {
    id: 8,
    title: 'Lastik & Jant',
    slug: 'lastik',
    description: 'Lastik değişimi, balans, rot ayarı ve jant tamiri',
    icon: { url: '/icons/tire.svg' }
  },
  {
    id: 9,
    title: 'Periyodik Bakım',
    slug: 'periyodik-bakim',
    description: 'Yağ, filtre değişimi ve genel kontrol paketleri',
    icon: { url: '/icons/maintenance.svg' }
  },
  {
    id: 10,
    title: 'Kaporta & Boya',
    slug: 'kaporta',
    description: 'Çizik giderme, boyama, göçük düzeltme ve kaporta işleri',
    icon: { url: '/icons/body.svg' }
  },
  {
    id: 11,
    title: 'Cam & Ayna',
    slug: 'cam',
    description: 'Ön cam değişimi, cam tamiri ve ayna değişimi',
    icon: { url: '/icons/glass.svg' }
  },
  {
    id: 12,
    title: 'Araç Muayene',
    slug: 'muayene',
    description: 'TÜVTÜRK muayene öncesi kontrol ve hazırlık',
    icon: { url: '/icons/inspection.svg' }
  }
];

export function getCategoryBySlugLocal(slug: string): Category | undefined {
  return categoriesData.find((c) => c.slug === slug);
}
