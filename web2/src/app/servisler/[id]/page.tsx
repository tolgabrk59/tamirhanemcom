'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Star,
  Heart,
  ChevronRight,
  Wrench,
  User,
  MessageSquare,
  Calendar,
} from 'lucide-react';

interface Service {
  id: number;
  name: string;
  address?: string;
  city?: string;
  district?: string;
  phone?: string;
  description?: string;
  workingHours?: string;
  rating?: number;
  reviewCount?: number;
  isOpen?: boolean;
  lat?: number;
  lng?: number;
  ProfilePicture?: { url?: string };
  categories?: Array<{ id: number; name: string }>;
}

interface Rating {
  id: number;
  score: number;
  comment?: string;
  createdAt: string;
  user?: { id: number; username?: string; firstName?: string; lastName?: string };
}

function getProfilePicUrl(service: Service): string | null {
  const url = service.ProfilePicture?.url;
  if (!url) return null;
  return url.startsWith('http') ? url : 'https://api.tamirhanem.net' + url;
}

function StarRating({ score, size = 'sm' }: { score: number; size?: 'sm' | 'lg' }) {
  const starClass = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${starClass} ${i <= Math.round(score) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
        />
      ))}
    </span>
  );
}

function UserAvatar({ name }: { name: string }) {
  const letter = name?.charAt(0)?.toUpperCase() || 'U';
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-teal-500',
  ];
  const colorIdx = letter.charCodeAt(0) % colors.length;
  return (
    <div
      className={`w-8 h-8 rounded-full ${colors[colorIdx]} flex items-center justify-center text-white text-sm font-bold shrink-0`}
    >
      {letter}
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getUserDisplayName(rating: Rating): string {
  const u = rating.user;
  if (!u) return 'Anonim';
  if (u.firstName && u.lastName) return `${u.firstName} ${u.lastName}`;
  return u.username || 'Anonim';
}

export default function ServisDetailPage({ params }: { params: { id: string } }) {
  const [service, setService] = useState<Service | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const fetchService = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/services/${params.id}?populate[ProfilePicture]=*&populate[categories]=*`,
        { cache: 'no-store' }
      );
      if (!res.ok) throw new Error('Servis bulunamadı');
      const json = await res.json();
      const raw = json.data ?? json;
      const svc: Service = {
        id: raw.id,
        name: raw.name,
        address: raw.address,
        city: raw.city,
        district: raw.district,
        phone: raw.phone,
        description: raw.description,
        workingHours: raw.workingHours,
        rating: raw.rating,
        reviewCount: raw.reviewCount,
        isOpen: raw.isOpen,
        lat: raw.lat,
        lng: raw.lng,
        ProfilePicture: raw.ProfilePicture,
        categories: Array.isArray(raw.categories) ? raw.categories : [],
      };
      setService(svc);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const fetchRatings = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/ratings?filters[service][id][$eq]=${params.id}&populate=user&sort=createdAt:desc&pagination[pageSize]=5`,
        { cache: 'no-store' }
      );
      if (!res.ok) return;
      const json = await res.json();
      const list: Rating[] = (json.data || []).map((r: any) => ({
        id: r.id,
        score: r.score,
        comment: r.comment,
        createdAt: r.createdAt,
        user: r.user,
      }));
      setRatings(list);
    } catch {
      // Ratings are non-critical, fail silently
    } finally {
      setRatingsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchService();
    fetchRatings();
  }, [fetchService, fetchRatings]);

  const handleFavorite = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
    if (!token) return;
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await fetch(`/api/favorites?serviceId=${params.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(false);
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ serviceId: Number(params.id) }),
        });
        setIsFavorite(true);
      }
    } catch {
      // fail silently
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 px-6">
        <Wrench className="w-16 h-16 text-gray-700" />
        <p className="text-gray-400 text-center">{error || 'Servis bulunamadı'}</p>
        <Link
          href="/servisler/sonuclar"
          className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Servislere dön
        </Link>
      </div>
    );
  }

  const profilePicUrl = getProfilePicUrl(service);
  const displayRating = service.rating ?? 0;
  const reviewCount = service.reviewCount ?? 0;
  const categories = service.categories ?? [];
  const locationStr = [service.district, service.city].filter(Boolean).join(', ');
  const isOpen = service.isOpen;

  return (
    <div className="min-h-screen bg-gray-950 pb-28">
      {/* Hero */}
      <div className="relative h-60 sm:h-72 overflow-hidden">
        {profilePicUrl ? (
          <>
            <Image
              src={profilePicUrl}
              alt={service.name}
              fill
              className="object-cover"
              unoptimized
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-black/40 to-black/20" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Wrench className="w-24 h-24 text-white/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
          </div>
        )}

        {/* Back */}
        <Link
          href="/servisler/sonuclar"
          className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full border border-white/10 hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Servisler
        </Link>

        {/* Open/Closed badge */}
        {isOpen !== undefined && (
          <div className="absolute top-4 right-4">
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full ${
                isOpen
                  ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                  : 'bg-red-500/20 border border-red-500/40 text-red-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-green-400' : 'bg-red-400'}`}
              />
              {isOpen ? 'Açık' : 'Kapalı'}
            </span>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="px-4 sm:px-6 max-w-2xl mx-auto -mt-4 relative z-10 flex flex-col gap-4">
        {/* Name + location + rating */}
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-2xl font-bold leading-tight">{service.name}</h1>
          {locationStr && (
            <p className="text-gray-400 text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              {locationStr}
            </p>
          )}
          {displayRating > 0 && (
            <div className="flex items-center gap-2">
              <StarRating score={displayRating} size="lg" />
              <span className="text-yellow-400 font-bold">{displayRating.toFixed(1)}</span>
              {reviewCount > 0 && (
                <span className="text-gray-500 text-sm">({reviewCount} yorum)</span>
              )}
            </div>
          )}
        </div>

        {/* Contact card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl divide-y divide-gray-800">
          {service.address && (
            <div className="flex items-start gap-3 p-4">
              <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Adres</p>
                <p className="text-gray-200 text-sm">{service.address}</p>
              </div>
            </div>
          )}
          {service.phone && (
            <div className="flex items-center gap-3 p-4">
              <Phone className="w-5 h-5 text-orange-500 shrink-0" />
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Telefon</p>
                <a
                  href={`tel:${service.phone}`}
                  className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
                >
                  {service.phone}
                </a>
              </div>
            </div>
          )}
          {service.workingHours && (
            <div className="flex items-start gap-3 p-4">
              <Clock className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Çalışma Saatleri</p>
                <p className="text-gray-200 text-sm whitespace-pre-line">{service.workingHours}</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {service.description && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h2 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-orange-500" />
              Servis Hakkında
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-white font-semibold text-sm">Hizmetler</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews */}
        <div className="flex flex-col gap-3">
          <h2 className="text-white font-semibold text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-orange-500" />
            Müşteri Yorumları
          </h2>

          {ratingsLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : ratings.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center gap-2">
              <User className="w-8 h-8 text-gray-700" />
              <p className="text-gray-500 text-sm text-center">Henüz yorum yapılmamış</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {ratings.map((r) => {
                const userName = getUserDisplayName(r);
                return (
                  <div
                    key={r.id}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar name={userName} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{userName}</p>
                        <div className="flex items-center gap-2">
                          <StarRating score={r.score} />
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(r.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {r.comment && (
                      <p className="text-gray-400 text-sm leading-relaxed">{r.comment}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-sm border-t border-gray-800 p-4 z-50">
        <div className="max-w-2xl mx-auto flex gap-3">
          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            disabled={favoriteLoading}
            className={`flex items-center justify-center w-14 h-14 rounded-2xl border transition-all ${
              isFavorite
                ? 'bg-red-500/20 border-red-500/40 text-red-400'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-red-400'
            }`}
            aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-400' : ''}`} />
          </button>

          {/* Randevu Al */}
          <Link
            href={`/randevu-al?service=${service.id}`}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-2xl py-4 font-semibold text-base transition-colors"
          >
            Randevu Al
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
