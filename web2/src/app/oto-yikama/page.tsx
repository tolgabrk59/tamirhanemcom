'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Droplets,
  Search,
  Star,
  MapPin,
  Clock,
  Heart,
  ChevronRight,
  Percent,
  LogIn,
  Lock,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ServiceProfilePicture {
  url: string;
}

interface Service {
  id: number;
  name: string;
  rating?: number;
  ratingCount?: number;
  address?: string;
  city?: string;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
  isOpen?: boolean;
  workingHours?: string;
  ProfilePicture?: ServiceProfilePicture | null;
}

interface CampaignService {
  id: number;
  name: string;
  ProfilePicture?: ServiceProfilePicture | null;
}

interface CampaignImage {
  url: string;
}

interface Campaign {
  id: number;
  title: string;
  description?: string;
  discount_rate?: number;
  campaign_image?: CampaignImage | null;
  service?: CampaignService | null;
  services?: CampaignService[];
  is_active: boolean;
}

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  plate: string;
  year?: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STRAPI_BASE = 'https://api.tamirhanem.net';

function resolveImageUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  return raw.startsWith('http') ? raw : STRAPI_BASE + raw;
}

const CAMPAIGN_GRADIENTS = [
  'from-amber-500 to-yellow-600',
  'from-yellow-500 to-orange-600',
  'from-orange-500 to-amber-600',
  'from-yellow-600 to-amber-700',
];

// ---------------------------------------------------------------------------
// Skeleton components
// ---------------------------------------------------------------------------

function ServiceCardSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
        <div className="h-3 bg-gray-800 rounded w-2/3" />
        <div className="h-9 bg-gray-800 rounded-xl mt-3" />
      </div>
    </div>
  );
}

function CampaignCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-64 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-36 bg-gray-800" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Campaign card (horizontal carousel item)
// ---------------------------------------------------------------------------

function CampaignCard({ campaign, index, eligible }: { campaign: Campaign; index: number; eligible?: boolean }) {
  const imageUrl = resolveImageUrl(campaign.campaign_image?.url ?? null);
  const gradient = CAMPAIGN_GRADIENTS[index % CAMPAIGN_GRADIENTS.length];
  const serviceName = campaign.service?.name ?? campaign.services?.[0]?.name;

  return (
    <div className="flex-shrink-0 w-64 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-black/30 flex flex-col relative">
      {eligible === false && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 z-10">
          <div className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-300 text-xs font-medium text-center px-4">Uygunluk kriteri sağlanamadı</p>
        </div>
      )}
      <div className="relative h-36 overflow-hidden">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={campaign.title}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <Droplets className="w-12 h-12 text-white/30" />
          </div>
        )}

        {campaign.discount_rate ? (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              <Percent className="w-2.5 h-2.5" />
              {campaign.discount_rate}%
            </span>
          </div>
        ) : null}
      </div>

      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">
          {campaign.title}
        </h3>
        {serviceName && (
          <p className="text-gray-400 text-xs line-clamp-1">{serviceName}</p>
        )}
        <Link
          href={`/oto-yikama/randevu?serviceId=${campaign.service?.id ?? ''}`}
          className="mt-auto inline-flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-xl py-1.5 px-3 transition-colors"
        >
          İncele
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Service card
// ---------------------------------------------------------------------------

function ServiceCard({
  service,
  isFav,
  onToggleFav,
  firstVehiclePlate,
  isLoggedIn,
}: {
  service: Service;
  isFav: boolean;
  onToggleFav: (id: number) => void;
  firstVehiclePlate: string | null;
  isLoggedIn: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = resolveImageUrl(service.ProfilePicture?.url ?? null);

  const bookingHref = `/oto-yikama/randevu?serviceId=${service.id}${firstVehiclePlate ? `&plate=${encodeURIComponent(firstVehiclePlate)}` : ''}`;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-black/30 flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-800">
        {imageUrl && !imgError ? (
          <Image
            src={imageUrl}
            alt={service.name}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Droplets className="w-12 h-12 text-gray-600" />
          </div>
        )}

        {/* Open/closed badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm border ${
              service.isOpen
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                : 'bg-gray-800/80 border-gray-700 text-gray-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${service.isOpen ? 'bg-emerald-400' : 'bg-gray-500'}`}
            />
            {service.isOpen ? 'Açık' : 'Kapalı'}
          </span>
        </div>

        {/* Favorite button */}
        <button
          onClick={() => onToggleFav(service.id)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 transition-colors hover:border-white/30"
          aria-label={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="text-white font-semibold text-sm leading-snug">{service.name}</h3>

        {/* Rating */}
        {(service.rating ?? 0) > 0 && (
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-amber-400 text-sm font-semibold">
              {(service.rating ?? 0).toFixed(1)}
            </span>
            {(service.ratingCount ?? 0) > 0 && (
              <span className="text-gray-500 text-xs">({service.ratingCount} değerlendirme)</span>
            )}
          </div>
        )}

        {/* Location */}
        {(service.city || service.neighborhood) && (
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-500" />
            <span className="line-clamp-1">
              {[service.neighborhood, service.city].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        {/* Working hours */}
        {service.workingHours && (
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <Clock className="w-3.5 h-3.5 shrink-0 text-gray-500" />
            <span className="line-clamp-1">{service.workingHours}</span>
          </div>
        )}

        {/* CTA */}
        <Link
          href={isLoggedIn ? bookingHref : '/giris'}
          className="mt-auto w-full flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2 px-4 text-sm font-medium transition-colors"
        >
          Randevu Al
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Guest banner
// ---------------------------------------------------------------------------

function GuestBanner() {
  return (
    <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-6">
      <LogIn className="w-5 h-5 text-amber-400 shrink-0" />
      <p className="text-sm text-amber-300 flex-1">
        Favorilerinize eklemek ve randevu oluşturmak için{' '}
        <Link href="/giris" className="font-semibold underline underline-offset-2 hover:text-white transition-colors">
          giriş yapın
        </Link>
        .
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function OtoYikamaPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jwtChecked, setJwtChecked] = useState(false);

  const [services, setServices] = useState<Service[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [eligibility, setEligibility] = useState<Record<number, { eligible: boolean }>>({});

  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  // ---------------------------------------------------------------------------
  // JWT check
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('tamirhanem_jwt') : null;
    setIsLoggedIn(!!token);
    setJwtChecked(true);
  }, []);

  // ---------------------------------------------------------------------------
  // Fetch public data
  // ---------------------------------------------------------------------------

  const fetchServices = useCallback(async () => {
    setLoadingServices(true);
    try {
      const res = await fetch(
        '/api/services?filters[service_type][$eq]=car_wash&populate[ProfilePicture]=*&populate[categories]=*&pagination[pageSize]=50'
      );
      if (res.ok) {
        const json = await res.json();
        setServices(Array.isArray(json.data) ? json.data : []);
      }
    } catch {
      // non-blocking
    } finally {
      setLoadingServices(false);
    }
  }, []);

  const fetchCampaigns = useCallback(async () => {
    setLoadingCampaigns(true);
    try {
      const res = await fetch(
        '/api/campaigns?filters[is_active][$eq]=true&populate[campaign_image]=*&populate[service][populate][0]=ProfilePicture&populate[services][populate][0]=ProfilePicture&sort=display_order:asc'
      );
      if (res.ok) {
        const json = await res.json();
        setCampaigns(Array.isArray(json.data) ? json.data : []);
      }
    } catch {
      // non-blocking
    } finally {
      setLoadingCampaigns(false);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Fetch auth-gated data
  // ---------------------------------------------------------------------------

  const fetchAuthData = useCallback(async (token: string) => {
    try {
      const [vehiclesRes, favsRes] = await Promise.allSettled([
        fetch('/api/vehicles?populate=*', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(
          '/api/favorites?populate[service][populate][0]=ProfilePicture&populate[service][populate][1]=categories',
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      if (vehiclesRes.status === 'fulfilled' && vehiclesRes.value.ok) {
        const json = await vehiclesRes.value.json();
        setVehicles(Array.isArray(json.data) ? json.data : []);
      }

      if (favsRes.status === 'fulfilled' && favsRes.value.ok) {
        const json = await favsRes.value.json();
        const favList: { service?: { id: number } }[] = Array.isArray(json.data) ? json.data : [];
        const ids = new Set<number>();
        for (const fav of favList) {
          if (fav.service?.id) ids.add(fav.service.id);
        }
        setFavoriteIds(ids);
      }
    } catch {
      // non-blocking
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  useEffect(() => {
    fetchServices();
    fetchCampaigns();
  }, [fetchServices, fetchCampaigns]);

  useEffect(() => {
    if (!jwtChecked) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('tamirhanem_jwt') : null;
    if (token) fetchAuthData(token);
  }, [jwtChecked, fetchAuthData]);

  useEffect(() => {
    if (!jwtChecked || campaigns.length === 0) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('tamirhanem_jwt') : null;
    if (!token) return;
    fetch('/api/eligibility/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ campaignIds: campaigns.map(c => c.id) }),
    })
      .then(r => r.json())
      .then(json => {
        if (json?.success && json?.data) setEligibility(json.data);
      })
      .catch(() => {});
  }, [jwtChecked, campaigns]);

  // ---------------------------------------------------------------------------
  // Favorite toggle (optimistic)
  // ---------------------------------------------------------------------------

  const handleToggleFav = useCallback(
    async (serviceId: number) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('tamirhanem_jwt') : null;
      if (!token) return;

      const isCurrent = favoriteIds.has(serviceId);

      // Optimistic update
      setFavoriteIds(prev => {
        const next = new Set(prev);
        if (isCurrent) next.delete(serviceId);
        else next.add(serviceId);
        return next;
      });

      try {
        if (isCurrent) {
          await fetch(`/api/favorites?filters[service][id][$eq]=${serviceId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          await fetch('/api/favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data: { service: serviceId } }),
          });
        }
      } catch {
        // Revert on error
        setFavoriteIds(prev => {
          const next = new Set(prev);
          if (isCurrent) next.add(serviceId);
          else next.delete(serviceId);
          return next;
        });
      }
    },
    [favoriteIds]
  );

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  const firstVehiclePlate = vehicles[0]?.plate ?? null;

  const filteredServices = services.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      (s.city ?? '').toLowerCase().includes(q) ||
      (s.neighborhood ?? '').toLowerCase().includes(q);
    const matchesCity = !city || (s.city ?? '').toLowerCase().includes(city.toLowerCase());
    return matchesSearch && matchesCity;
  });

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-900 to-amber-950/20 border-b border-gray-800 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 text-xs font-medium px-3 py-1.5 rounded-full mb-3 border border-amber-500/20">
                <Droplets className="w-3.5 h-3.5" />
                Oto Yıkama
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Oto Yıkama Hizmetleri
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Size en yakın profesyonel oto yıkama servislerini keşfedin
              </p>
            </div>
            {isLoggedIn && (
              <Link
                href="/oto-yikama/randevularim"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap"
              >
                Randevularım
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Search bar */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Servis adı veya semt ara..."
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:border-amber-500 placeholder-gray-500 transition-colors"
              />
            </div>
            <div className="relative sm:w-48">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Şehir filtrele..."
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:border-amber-500 placeholder-gray-500 transition-colors"
              />
            </div>
            <Link
              href={`/servis-ara?tip=car_wash${search ? `&q=${encodeURIComponent(search)}` : ''}${city ? `&konum=${encodeURIComponent(city)}` : ''}`}
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-5 py-3 rounded-xl transition-colors whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              Yıkama Bul
            </Link>
          </div>

          {/* Mobile randevularım link */}
          {isLoggedIn && (
            <Link
              href="/oto-yikama/randevularim"
              className="sm:hidden inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors mt-4"
            >
              Randevularım
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* Guest banner */}
        {jwtChecked && !isLoggedIn && <GuestBanner />}

        {/* Campaigns carousel */}
        {(loadingCampaigns || campaigns.length > 0) && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1 h-5 bg-amber-500 rounded-full" />
                Kampanyalar
              </h2>
              <Link
                href="/kampanyalar"
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
              >
                Tümü
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
              {loadingCampaigns
                ? Array.from({ length: 3 }).map((_, i) => <CampaignCardSkeleton key={i} />)
                : campaigns.map((campaign, index) => (
                    <CampaignCard key={campaign.id} campaign={campaign} index={index} eligible={eligibility[campaign.id]?.eligible} />
                  ))}
            </div>
          </section>
        )}

        {/* Services grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-500 rounded-full" />
              Oto Yıkama Servisleri
            </h2>
            {!loadingServices && filteredServices.length > 0 && (
              <span className="text-xs text-gray-500">{filteredServices.length} servis</span>
            )}
          </div>

          {loadingServices ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
                <Droplets className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-white font-semibold mb-1">
                {search || city
                  ? 'Arama kriterlerine uygun servis bulunamadı'
                  : 'Bu bölgede oto yıkama servisi bulunamadı'}
              </h3>
              <p className="text-gray-500 text-sm max-w-xs">
                {search || city
                  ? 'Farklı bir arama terimi veya şehir deneyin.'
                  : 'Yakında yeni servisler eklenecektir.'}
              </p>
              {(search || city) && (
                <button
                  onClick={() => { setSearch(''); setCity(''); }}
                  className="mt-5 text-sm text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Filtreleri temizle
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isFav={favoriteIds.has(service.id)}
                  onToggleFav={handleToggleFav}
                  firstVehiclePlate={firstVehiclePlate}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
