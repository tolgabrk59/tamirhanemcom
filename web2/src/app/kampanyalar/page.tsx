'use client';

import { useState, useEffect, useCallback } from 'react';
import { Gift, Car, Wrench, Tag, Clock, ChevronRight, Percent, TicketPercent } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Campaign {
  id: number;
  title: string;
  description?: string;
  discount_percentage?: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  campaign_category?: string;
  service_type_filter?: string;
  campaign_image?: {
    url: string;
    formats?: {
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  };
}

interface WashCampaign {
  id: number;
  title: string;
  description?: string;
  discountPercentage?: number;
  originalPrice?: number;
  discountedPrice?: number;
  validUntil?: string;
  image?: string;
  serviceId?: number;
}

interface ServiceDiscount {
  id: number;
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
  validUntil?: string;
  service?: { id: number; name: string };
}

type FilterKey = 'tumu' | 'oto-yikama' | 'servis' | 'indirimler';

const FILTER_TABS: { key: FilterKey; label: string; icon: React.ElementType }[] = [
  { key: 'tumu', label: 'Tümü', icon: Gift },
  { key: 'oto-yikama', label: 'Oto Yıkama', icon: Car },
  { key: 'servis', label: 'Servis', icon: Wrench },
  { key: 'indirimler', label: 'İndirimler', icon: Tag },
];

const STRAPI_BASE = 'https://api.tamirhanem.net';

const WASH_CATEGORY_GRADIENTS = [
  'from-blue-600 to-indigo-700',
  'from-cyan-500 to-blue-700',
  'from-teal-500 to-emerald-700',
];

const SERVIS_CATEGORY_GRADIENTS = [
  'from-orange-500 to-red-600',
  'from-purple-600 to-pink-700',
  'from-yellow-500 to-orange-600',
];

function getCountdown(endDate: string): string {
  const end = new Date(endDate);
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  if (diffMs <= 0) return 'Sona erdi';
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (diffDays > 7) return `${diffDays} gün kaldı`;
  if (diffDays > 0) return `Son ${diffDays} gün`;
  if (diffHours > 0) return `Son ${diffHours} saat ${diffMins} dk`;
  return 'Bugün bitiyor!';
}

function getImageUrl(campaign: Campaign): string | null {
  const raw = campaign.campaign_image?.formats?.medium?.url
    ?? campaign.campaign_image?.formats?.small?.url
    ?? campaign.campaign_image?.url;
  if (!raw) return null;
  return raw.startsWith('http') ? raw : STRAPI_BASE + raw;
}

function CampaignCard({ campaign, countdown }: { campaign: Campaign; countdown: Record<string, string> }) {
  const isWash = campaign.service_type_filter === 'car_wash' || campaign.campaign_category === 'Oto Yıkama';
  const bgGradient = isWash
    ? WASH_CATEGORY_GRADIENTS[campaign.id % WASH_CATEGORY_GRADIENTS.length]
    : SERVIS_CATEGORY_GRADIENTS[campaign.id % SERVIS_CATEGORY_GRADIENTS.length];
  const TypeIcon = isWash ? Car : Wrench;
  const categoryLabel = campaign.campaign_category || (isWash ? 'Oto Yıkama' : 'Kampanya');
  const imageUrl = getImageUrl(campaign);
  const endKey = `campaign-${campaign.id}`;
  const countdownText = campaign.end_date ? (countdown[endKey] ?? getCountdown(campaign.end_date)) : null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-black/30 flex flex-col">
      <div className="relative h-44 overflow-hidden">
        {imageUrl ? (
          <>
            <Image src={imageUrl} alt={campaign.title} fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${bgGradient} flex items-center justify-center`}>
            <TypeIcon className="w-14 h-14 text-white/30" />
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full border border-white/10">
            <TypeIcon className="w-3 h-3" />
            {categoryLabel}
          </span>
        </div>

        {campaign.discount_percentage && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              <Percent className="w-3 h-3" />
              {campaign.discount_percentage}% İNDİRİM
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">{campaign.title}</h3>

        {campaign.description && (
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{campaign.description}</p>
        )}

        {countdownText && countdownText !== 'Sona erdi' && (
          <div className="flex items-center gap-1 text-amber-400 text-xs font-medium mt-0.5">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{countdownText}</span>
          </div>
        )}

        <Link
          href={`/randevu-al?campaign=${campaign.id}`}
          className="mt-auto w-full flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2 px-4 text-sm font-medium transition-colors"
        >
          Kampanyayı Kullan
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function WashCampaignCard({ campaign, countdown }: { campaign: WashCampaign; countdown: Record<string, string> }) {
  const endKey = `wash-${campaign.id}`;
  const countdownText = campaign.validUntil ? (countdown[endKey] ?? getCountdown(campaign.validUntil)) : null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-black/30 flex flex-col">
      <div className="relative h-44 overflow-hidden">
        {campaign.image ? (
          <>
            <Image src={campaign.image} alt={campaign.title} fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${WASH_CATEGORY_GRADIENTS[campaign.id % WASH_CATEGORY_GRADIENTS.length]} flex items-center justify-center`}>
            <Car className="w-14 h-14 text-white/30" />
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full border border-white/10">
            <Car className="w-3 h-3" />
            Oto Yıkama
          </span>
        </div>

        {campaign.discountPercentage && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              <Percent className="w-3 h-3" />
              {campaign.discountPercentage}% İNDİRİM
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">{campaign.title}</h3>

        {campaign.description && (
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{campaign.description}</p>
        )}

        {(campaign.originalPrice || campaign.discountedPrice) && (
          <div className="flex items-center gap-2 mt-0.5">
            {campaign.originalPrice && (
              <span className="text-gray-500 text-xs line-through">{campaign.originalPrice} TL</span>
            )}
            {campaign.discountedPrice && (
              <span className="text-orange-400 text-sm font-bold">{campaign.discountedPrice} TL</span>
            )}
          </div>
        )}

        {countdownText && countdownText !== 'Sona erdi' && (
          <div className="flex items-center gap-1 text-amber-400 text-xs font-medium mt-0.5">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{countdownText}</span>
          </div>
        )}

        <Link
          href={campaign.serviceId ? `/randevu-al?service=${campaign.serviceId}` : '/randevu-al'}
          className="mt-auto w-full flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2 px-4 text-sm font-medium transition-colors"
        >
          Kampanyayı Kullan
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function DiscountCard({ discount, countdown }: { discount: ServiceDiscount; countdown: Record<string, string> }) {
  const endKey = `discount-${discount.id}`;
  const countdownText = discount.validUntil ? (countdown[endKey] ?? getCountdown(discount.validUntil)) : null;
  const serviceName = discount.service?.name;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-black/30 flex flex-col">
      <div className="relative h-44 overflow-hidden">
        <div className={`w-full h-full bg-gradient-to-br ${SERVIS_CATEGORY_GRADIENTS[discount.id % SERVIS_CATEGORY_GRADIENTS.length]} flex items-center justify-center`}>
          <TicketPercent className="w-14 h-14 text-white/30" />
        </div>

        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full border border-white/10">
            <Wrench className="w-3 h-3" />
            {serviceName || 'Servis İndirimi'}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            <Percent className="w-3 h-3" />
            {discount.discountPercentage}% İNDİRİM
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="text-white font-semibold text-sm leading-snug">
          {serviceName ? `${serviceName} İndirimi` : 'Servis İndirimi'}
        </h3>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-gray-500 text-xs line-through">{discount.originalPrice} TL</span>
          <span className="text-orange-400 text-sm font-bold">{discount.discountedPrice} TL</span>
        </div>

        {countdownText && countdownText !== 'Sona erdi' && (
          <div className="flex items-center gap-1 text-amber-400 text-xs font-medium mt-0.5">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{countdownText}</span>
          </div>
        )}

        <Link
          href={discount.service?.id ? `/randevu-al?service=${discount.service.id}` : '/randevu-al'}
          className="mt-auto w-full flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2 px-4 text-sm font-medium transition-colors"
        >
          Kampanyayı Kullan
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-full" />
        <div className="h-3 bg-gray-800 rounded w-2/3" />
        <div className="h-9 bg-gray-800 rounded-xl mt-3" />
      </div>
    </div>
  );
}

type CardUnion =
  | { type: 'campaign'; data: Campaign }
  | { type: 'wash'; data: WashCampaign }
  | { type: 'discount'; data: ServiceDiscount };

export default function KampanyalarPage() {
  const [activeTab, setActiveTab] = useState<FilterKey>('tumu');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [washCampaigns, setWashCampaigns] = useState<WashCampaign[]>([]);
  const [discounts, setDiscounts] = useState<ServiceDiscount[]>([]);
  const [countdown, setCountdown] = useState<Record<string, string>>({});

  const refreshCountdowns = useCallback(
    (camps: Campaign[], wash: WashCampaign[], discs: ServiceDiscount[]) => {
      const next: Record<string, string> = {};
      for (const c of camps) {
        if (c.end_date) next[`campaign-${c.id}`] = getCountdown(c.end_date);
      }
      for (const w of wash) {
        if (w.validUntil) next[`wash-${w.id}`] = getCountdown(w.validUntil);
      }
      for (const d of discs) {
        if (d.validUntil) next[`discount-${d.id}`] = getCountdown(d.validUntil);
      }
      setCountdown(next);
    },
    []
  );

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const jwt = typeof window !== 'undefined' ? localStorage.getItem('tamirhanem_jwt') : null;
        const headers: HeadersInit = jwt ? { Authorization: `Bearer ${jwt}` } : {};

        const [campRes, washRes, discRes] = await Promise.allSettled([
          fetch('/api/campaigns?filters[is_active][$eq]=true&populate=campaign_image', { headers }),
          fetch('/api/wash-home-campaigns/grouped'),
          fetch('/api/service-discounts/active?populate=service'),
        ]);

        const fetchedCamps: Campaign[] = [];
        const fetchedWash: WashCampaign[] = [];
        const fetchedDiscs: ServiceDiscount[] = [];

        if (campRes.status === 'fulfilled' && campRes.value.ok) {
          const json = await campRes.value.json();
          const list: Campaign[] = json.data || [];
          fetchedCamps.push(...list);
        }

        if (washRes.status === 'fulfilled' && washRes.value.ok) {
          const json = await washRes.value.json();
          const list: WashCampaign[] = json.data || json || [];
          if (Array.isArray(list)) fetchedWash.push(...list);
        }

        if (discRes.status === 'fulfilled' && discRes.value.ok) {
          const json = await discRes.value.json();
          const list: ServiceDiscount[] = json.data || [];
          fetchedDiscs.push(...list);
        }

        setCampaigns(fetchedCamps);
        setWashCampaigns(fetchedWash);
        setDiscounts(fetchedDiscs);
        refreshCountdowns(fetchedCamps, fetchedWash, fetchedDiscs);
      } catch {
        setError('Kampanyalar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [refreshCountdowns]);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      refreshCountdowns(campaigns, washCampaigns, discounts);
    }, 60000);
    return () => clearInterval(interval);
  }, [loading, campaigns, washCampaigns, discounts, refreshCountdowns]);

  function isOtoYikama(c: Campaign): boolean {
    return c.service_type_filter === 'car_wash' || c.campaign_category === 'Oto Yıkama';
  }

  function getFilteredCards(): CardUnion[] {
    const cards: CardUnion[] = [];

    if (activeTab === 'tumu' || activeTab === 'oto-yikama') {
      campaigns.filter(isOtoYikama).forEach(c => cards.push({ type: 'campaign', data: c }));
      washCampaigns.forEach(w => cards.push({ type: 'wash', data: w }));
    }

    if (activeTab === 'tumu' || activeTab === 'servis') {
      campaigns.filter(c => !isOtoYikama(c)).forEach(c => cards.push({ type: 'campaign', data: c }));
    }

    if (activeTab === 'tumu' || activeTab === 'indirimler') {
      discounts.forEach(d => cards.push({ type: 'discount', data: d }));
    }

    return cards;
  }

  const filtered = getFilteredCards();

  const tabCount = (key: FilterKey): number => {
    if (key === 'oto-yikama') {
      return campaigns.filter(isOtoYikama).length + washCampaigns.length;
    }
    if (key === 'servis') {
      return campaigns.filter(c => !isOtoYikama(c)).length;
    }
    if (key === 'indirimler') return discounts.length;
    return campaigns.length + washCampaigns.length + discounts.length;
  };

  return (
    <div className="bg-gray-950 min-h-screen">
      <section className="bg-gradient-to-br from-gray-900 via-gray-900 to-orange-950/30 border-b border-gray-800 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-orange-500/20">
            <Gift className="w-3.5 h-3.5" />
            Özel Fırsatlar
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Kampanyalar</h1>
          <p className="text-gray-400 text-base">Özel fırsatları kaçırmayın</p>
        </div>
      </section>

      <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1.5 py-3 overflow-x-auto scrollbar-none">
            {FILTER_TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              const count = loading ? null : tabCount(tab.key);
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all shrink-0 ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {!loading && count !== null && count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-900/20 border border-red-800/50 text-red-400 rounded-xl p-4 mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
              <Gift className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-400 mb-2">Aktif kampanya bulunamadı</h2>
            <p className="text-gray-600 text-sm max-w-xs">
              {activeTab !== 'tumu'
                ? 'Bu kategoride aktif kampanya bulunmuyor. Diğer kategorilere göz atın.'
                : 'Şu anda aktif kampanya bulunmamaktadır.'}
            </p>
            {activeTab !== 'tumu' && (
              <button
                onClick={() => setActiveTab('tumu')}
                className="mt-5 inline-flex items-center gap-1.5 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
              >
                Tüm kampanyaları gör
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-4">
              {filtered.length} kampanya bulundu
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(card => {
                if (card.type === 'campaign') {
                  return (
                    <CampaignCard
                      key={`campaign-${card.data.id}`}
                      campaign={card.data}
                      countdown={countdown}
                    />
                  );
                }
                if (card.type === 'wash') {
                  return (
                    <WashCampaignCard
                      key={`wash-${card.data.id}`}
                      campaign={card.data}
                      countdown={countdown}
                    />
                  );
                }
                return (
                  <DiscountCard
                    key={`discount-${card.data.id}`}
                    discount={card.data}
                    countdown={countdown}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
