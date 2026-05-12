export type SponsorCategory = 'lastik' | 'sigorta' | 'yedek-parca' | 'ekspertiz' | 'yag' | 'diger';

export type SponsorPlacement = 'band' | 'native' | 'sidebar' | 'banner' | 'partner';

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  url: string;
  description: string;
  category: SponsorCategory;
  placement: SponsorPlacement[];
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  emoji: string;
  url: string;
  ctaText: string;
  bgGradient?: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}
