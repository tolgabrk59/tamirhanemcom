import type { Campaign } from '@/types/sponsor'

export const campaigns: Campaign[] = [
  {
    id: 'kis-bakim-2026',
    title: 'Kış Bakım Kampanyası',
    description: 'Tüm bakımlarda %30 indirim! Kış aylarına hazırlıklı girin.',
    emoji: '🔥',
    url: '/kampanyalar/kis-bakim',
    ctaText: 'Detaylar',
    isActive: true,
    startDate: '2026-01-01',
    endDate: '2026-04-30',
  },
  {
    id: 'lastik-degisim-2026',
    title: 'Lastik Değişim Fırsatı',
    description: '4 al 3 öde! Anlaşmalı servislerimizde geçerli.',
    emoji: '🛞',
    url: '/kampanyalar/lastik-degisim',
    ctaText: 'Fırsatı Yakala',
    isActive: true,
    startDate: '2026-02-01',
    endDate: '2026-05-31',
  },
  {
    id: 'ucretsiz-ekspertiz-2026',
    title: 'Ücretsiz Araç Ekspertizi',
    description: 'İkinci el araç alacaklara özel, tamamen ücretsiz ekspertiz hizmeti.',
    emoji: '🔍',
    url: '/kampanyalar/ucretsiz-ekspertiz',
    ctaText: 'Randevu Al',
    isActive: true,
    startDate: '2026-03-01',
    endDate: '2026-06-30',
  },
]

export function getActiveCampaigns(): Campaign[] {
  const now = new Date()
  return campaigns.filter((campaign) => {
    if (!campaign.isActive) return false
    const start = new Date(campaign.startDate)
    const end = new Date(campaign.endDate)
    return now >= start && now <= end
  })
}
