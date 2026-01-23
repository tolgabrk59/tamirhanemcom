import type { Service, CostEstimate } from '@/types';

export const servicesData: Service[] = [
  // Motor Bakım
  {
    id: 1,
    name: 'Yağ ve Filtre Değişimi',
    slug: 'yag-filtre-degisimi',
    description: 'Motor yağı ve yağ filtresi değişimi',
    priceMin: 1200,
    priceMax: 3500,
    duration: '30-45 dakika',
    category: 'Motor Bakım'
  },
  {
    id: 2,
    name: 'Triger Kayışı Değişimi',
    slug: 'triger-kayisi',
    description: 'Triger kayışı ve gergi rulmanı değişimi',
    priceMin: 4000,
    priceMax: 10000,
    duration: '2-4 saat',
    category: 'Motor Bakım'
  },
  {
    id: 3,
    name: 'Buji Değişimi',
    slug: 'buji-degisimi',
    description: 'Ateşleme bujileri değişimi (4 adet)',
    priceMin: 600,
    priceMax: 2500,
    duration: '30-60 dakika',
    category: 'Motor Bakım'
  },
  // Fren Sistemi
  {
    id: 4,
    name: 'Ön Fren Balata Değişimi',
    slug: 'on-balata',
    description: 'Ön aks fren balatası değişimi',
    priceMin: 1000,
    priceMax: 2500,
    duration: '45-60 dakika',
    category: 'Fren Sistemi'
  },
  {
    id: 5,
    name: 'Arka Fren Balata Değişimi',
    slug: 'arka-balata',
    description: 'Arka aks fren balatası değişimi',
    priceMin: 800,
    priceMax: 2200,
    duration: '45-60 dakika',
    category: 'Fren Sistemi'
  },
  {
    id: 6,
    name: 'Fren Disk Değişimi (Çift)',
    slug: 'fren-disk',
    description: 'Fren diski değişimi (ön veya arka çift)',
    priceMin: 2000,
    priceMax: 6000,
    duration: '1-2 saat',
    category: 'Fren Sistemi'
  },
  // Şanzıman
  {
    id: 7,
    name: 'Debriyaj Seti Değişimi',
    slug: 'debriyaj-seti',
    description: 'Debriyaj seti (baskı, balata, rulman) değişimi',
    priceMin: 5000,
    priceMax: 12000,
    duration: '4-6 saat',
    category: 'Şanzıman'
  },
  {
    id: 8,
    name: 'Şanzıman Yağı Değişimi',
    slug: 'sanziman-yagi',
    description: 'Manuel veya otomatik şanzıman yağı değişimi',
    priceMin: 1200,
    priceMax: 3500,
    duration: '30-60 dakika',
    category: 'Şanzıman'
  },
  // Süspansiyon
  {
    id: 9,
    name: 'Amortisör Değişimi (Çift)',
    slug: 'amortisor',
    description: 'Ön veya arka amortisör değişimi',
    priceMin: 2500,
    priceMax: 8000,
    duration: '2-3 saat',
    category: 'Süspansiyon'
  },
  {
    id: 10,
    name: 'Rot Başı Değişimi',
    slug: 'rot-basi',
    description: 'Rot başı değişimi ve rot ayarı',
    priceMin: 600,
    priceMax: 1800,
    duration: '1-2 saat',
    category: 'Süspansiyon'
  },
  // Elektrik
  {
    id: 11,
    name: 'Akü Değişimi',
    slug: 'aku-degisimi',
    description: 'Araç aküsü değişimi',
    priceMin: 2500,
    priceMax: 6000,
    duration: '15-30 dakika',
    category: 'Elektrik'
  },
  {
    id: 12,
    name: 'Alternatör Değişimi',
    slug: 'alternator',
    description: 'Şarj dinamosu değişimi',
    priceMin: 3000,
    priceMax: 8000,
    duration: '1-3 saat',
    category: 'Elektrik'
  },
  // Klima
  {
    id: 13,
    name: 'Klima Gazı Dolumu',
    slug: 'klima-gazi',
    description: 'Klima gazı kontrolü ve dolumu',
    priceMin: 800,
    priceMax: 1800,
    duration: '30-45 dakika',
    category: 'Klima'
  },
  // Egzoz
  {
    id: 14,
    name: 'Katalitik Konvertör Değişimi',
    slug: 'katalitik-konvertor',
    description: 'Katalizör değişimi',
    priceMin: 3000,
    priceMax: 15000,
    duration: '1-2 saat',
    category: 'Egzoz'
  },
  {
    id: 15,
    name: 'DPF Temizliği',
    slug: 'dpf-temizlik',
    description: 'Dizel partikül filtresi temizliği',
    priceMin: 2500,
    priceMax: 6000,
    duration: '2-4 saat',
    category: 'Egzoz'
  },
  // Periyodik Bakım
  {
    id: 16,
    name: 'Kapsamlı Bakım Paketi',
    slug: 'kapsamli-bakim',
    description: 'Yağ, tüm filtreler, fren kontrolü, sıvılar',
    priceMin: 3000,
    priceMax: 7000,
    duration: '2-3 saat',
    category: 'Periyodik Bakım'
  }
];

// Servis türlerine göre liste
export const serviceTypes = [
  'Yağ Değişimi',
  'Fren Bakımı',
  'Motor Arıza Teşhis',
  'Periyodik Bakım',
  'Şanzıman Bakımı',
  'Süspansiyon Kontrolü',
  'Klima Bakımı',
  'Akü Değişimi',
  'Lastik Değişimi',
  'Araç Muayene Hazırlık'
];

export function getServiceBySlug(slug: string): Service | undefined {
  return servicesData.find((s) => s.slug === slug);
}

export function getServicesByCategory(category: string): Service[] {
  return servicesData.filter((s) => s.category === category);
}

export function getServiceCategories(): string[] {
  return Array.from(new Set(servicesData.map((s) => s.category)));
}

// Maliyet tahmini hesaplama
export function estimateCost(
  brand: string,
  service: string
): CostEstimate | null {
  const serviceData = servicesData.find((s) => s.slug === service || s.name === service);
  if (!serviceData) return null;

  // Marka bazlı çarpan (premium markalar daha pahalı)
  const brandMultipliers: Record<string, number> = {
    'Mercedes': 1.4,
    'BMW': 1.35,
    'Audi': 1.3,
    'Volvo': 1.25,
    'Volkswagen': 1.1,
    'default': 1.0
  };

  const multiplier = brandMultipliers[brand] || brandMultipliers['default'];

  const laborMin = Math.round(serviceData.priceMin * 0.4 * multiplier);
  const laborMax = Math.round(serviceData.priceMax * 0.4 * multiplier);
  const partsMin = Math.round(serviceData.priceMin * 0.6 * multiplier);
  const partsMax = Math.round(serviceData.priceMax * 0.6 * multiplier);

  return {
    service: serviceData.name,
    laborCostMin: laborMin,
    laborCostMax: laborMax,
    partsCostMin: partsMin,
    partsCostMax: partsMax,
    totalMin: laborMin + partsMin,
    totalMax: laborMax + partsMax,
    duration: serviceData.duration,
    notes: `${brand} marka araçlar için tahmini fiyat. Gerçek fiyat aracın durumuna göre değişebilir.`
  };
}
