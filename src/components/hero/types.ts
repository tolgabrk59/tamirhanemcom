export interface CarPart {
  id: string;
  name: string;
  description: string;
  href: string;
  color: string;
  icon: string;
  details: string[];
  priceRange: string;
}

export interface Stats {
  serviceCount: number;
  cityCount: number;
  customerCount: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  href: string;
  color: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  color: string;
}

export interface HeroService {
  id: string;
  name: string;
  category: string;
  color: string;
}

export interface TourStep {
  id: number;
  title: string;
  description: string;
  position: string;
}
