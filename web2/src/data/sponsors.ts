import type { Sponsor } from '@/types/sponsor';

export const sponsors: Sponsor[] = [
  {
    id: 'michelin',
    name: 'Michelin',
    logo: '/images/sponsors/michelin.png',
    url: 'https://www.michelin.com.tr',
    description: 'Güvenli sürüş için premium lastikler',
    category: 'lastik',
    placement: ['band', 'native', 'partner', 'sidebar'],
    isActive: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  },
  {
    id: 'bridgestone',
    name: 'Bridgestone',
    logo: '/images/sponsors/bridgestone.png',
    url: 'https://www.bridgestone.com.tr',
    description: 'Aracınız için en iyi lastikler. %20 indirim fırsatı!',
    category: 'lastik',
    placement: ['band', 'native', 'partner', 'sidebar'],
    isActive: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  },
  {
    id: 'castrol',
    name: 'Castrol',
    logo: '/images/sponsors/castrol.png',
    url: 'https://www.castrol.com/tr',
    description: 'Motor yağında dünya lideri',
    category: 'yag',
    placement: ['band', 'partner', 'sidebar'],
    isActive: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  },
  {
    id: 'mobil',
    name: 'Mobil',
    logo: '/images/sponsors/mobil.png',
    url: 'https://www.mobil.com.tr',
    description: 'Motorunuzu koruyun, performansı artırın',
    category: 'yag',
    placement: ['band'],
    isActive: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  },
  {
    id: 'axa-sigorta',
    name: 'AXA Sigorta',
    logo: '/images/sponsors/axa.png',
    url: 'https://www.axasigorta.com.tr',
    description: 'Kasko & Trafik Sigortası - En uygun fiyatlarla aracını sigortalat',
    category: 'sigorta',
    placement: ['band', 'banner', 'partner'],
    isActive: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  },
  {
    id: 'dekra',
    name: 'DEKRA',
    logo: '/images/sponsors/dekra.png',
    url: 'https://www.dekra.com.tr',
    description: 'Aracını satmadan önce profesyonel ekspertiz yaptır!',
    category: 'ekspertiz',
    placement: ['sidebar', 'partner'],
    isActive: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  },
];

export function getSponsorsByPlacement(placement: Sponsor['placement'][number]): Sponsor[] {
  const now = new Date().toISOString().split('T')[0];
  return sponsors.filter(
    (s) => s.isActive && s.placement.includes(placement) && s.startDate <= now && s.endDate >= now
  );
}
