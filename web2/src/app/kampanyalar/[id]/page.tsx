'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Car,
  Wrench,
  Percent,
  Clock,
  Copy,
  Check,
  ChevronRight,
  Tag,
  Gift,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Campaign {
  id: number;
  title: string;
  description?: string;
  campaign_category?: string;
  start_date?: string;
  end_date?: string;
  discount_percentage?: number;
  is_active: boolean;
  service_type_filter?: string;
  terms_conditions?: string;
  campaign_code?: string;
  campaign_image?: {
    url: string;
    formats?: {
      medium?: { url: string };
      large?: { url: string };
    };
  };
}

const STRAPI_BASE = 'https://api.tamirhanem.net';
const STRAPI_API = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://api.tamirhanem.net/api';

const WASH_GRADIENTS = 'from-blue-600 to-indigo-700';
const SERVIS_GRADIENTS = 'from-orange-500 to-red-600';

function getImageUrl(campaign: Campaign): string | null {
  const raw =
    campaign.campaign_image?.formats?.large?.url ??
    campaign.campaign_image?.formats?.medium?.url ??
    campaign.campaign_image?.url;
  if (!raw) return null;
  return raw.startsWith('http') ? raw : STRAPI_BASE + raw;
}

function getCountdownDetailed(endDate: string): {
  text: string;
  days: number;
  hours: number;
  mins: number;
  secs: number;
  expired: boolean;
} {
  const end = new Date(endDate);
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  if (diffMs <= 0) {
    return { text: 'Sona erdi', days: 0, hours: 0, mins: 0, secs: 0, expired: true };
  }
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
  let text = '';
  if (days > 7) text = `${days} gün kaldı`;
  else if (days > 0) text = `Son ${days} gün ${hours} saat`;
  else if (hours > 0) text = `Son ${hours} saat ${mins} dk`;
  else text = 'Bugün bitiyor!';
  return { text, days, hours, mins, secs, expired: false };
}

export default function KampanyaDetailPage({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<ReturnType<typeof getCountdownDetailed> | null>(null);
  const [copied, setCopied] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(
          `${STRAPI_API}/campaigns/${params.id}?populate=campaign_image`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error('Kampanya bulunamadı');
        const json = await res.json();
        // Strapi v4 flat response (data at root or data.attributes)
        const raw = json.data ?? json;
        // Handle both flat and attributes-wrapped
        const c: Campaign = raw.attributes
          ? { id: raw.id, ...raw.attributes }
          : { ...raw };
        setCampaign(c);
        if (c.end_date) {
          setCountdown(getCountdownDetailed(c.end_date));
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [params.id]);

  // Live countdown ticker
  useEffect(() => {
    if (!campaign?.end_date) return;
    const timer = setInterval(() => {
      setCountdown(getCountdownDetailed(campaign.end_date!));
    }, 1000);
    return () => clearInterval(timer);
  }, [campaign?.end_date]);

  const handleCopyCode = () => {
    if (!campaign?.campaign_code) return;
    navigator.clipboard.writeText(campaign.campaign_code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 px-6">
        <Gift className="w-16 h-16 text-gray-700" />
        <p className="text-gray-400 text-center">{error || 'Kampanya bulunamadı'}</p>
        <Link
          href="/kampanyalar"
          className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kampanyalara dön
        </Link>
      </div>
    );
  }

  const isWash =
    campaign.service_type_filter === 'car_wash' ||
    campaign.campaign_category === 'Oto Yıkama';
  const bgGradient = isWash ? WASH_GRADIENTS : SERVIS_GRADIENTS;
  const TypeIcon = isWash ? Car : Wrench;
  const categoryLabel = campaign.campaign_category || (isWash ? 'Oto Yıkama' : 'Kampanya');
  const imageUrl = getImageUrl(campaign);

  return (
    <div className="min-h-screen bg-gray-950 pb-24">
      {/* Hero */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={campaign.title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-black/40 to-black/20" />
          </>
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${bgGradient} flex items-center justify-center`}
          >
            <TypeIcon className="w-24 h-24 text-white/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
          </div>
        )}

        {/* Back button */}
        <Link
          href="/kampanyalar"
          className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full border border-white/10 hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kampanyalar
        </Link>

        {/* Discount badge */}
        {campaign.discount_percentage && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
              <Percent className="w-4 h-4" />
              {campaign.discount_percentage}% İNDİRİM
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 max-w-2xl mx-auto -mt-6 relative z-10 flex flex-col gap-4">
        {/* Category + Title */}
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 bg-gray-800 text-gray-300 text-xs font-medium px-3 py-1 rounded-full border border-gray-700 self-start">
            <TypeIcon className="w-3.5 h-3.5" />
            {categoryLabel}
          </span>
          <h1 className="text-white text-2xl font-bold leading-tight">{campaign.title}</h1>
        </div>

        {/* Discount display */}
        {campaign.discount_percentage && (
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-5 flex flex-col items-center gap-1">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">İndirim Oranı</p>
            <p className="text-orange-400 text-5xl font-black">%{campaign.discount_percentage}</p>
            <p className="text-gray-300 text-sm">İndirim</p>
          </div>
        )}

        {/* Countdown */}
        {campaign.end_date && countdown && !countdown.expired && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-400" />
              <p className="text-amber-400 text-sm font-medium">{countdown.text}</p>
            </div>
            {countdown.days <= 7 && (
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Gün', value: countdown.days },
                  { label: 'Saat', value: countdown.hours },
                  { label: 'Dakika', value: countdown.mins },
                  { label: 'Saniye', value: countdown.secs },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-gray-800 rounded-xl p-2 flex flex-col items-center gap-0.5"
                  >
                    <span className="text-white text-xl font-bold tabular-nums">
                      {String(value).padStart(2, '0')}
                    </span>
                    <span className="text-gray-500 text-xs">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {countdown?.expired && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <p className="text-gray-500 text-sm">Bu kampanya sona erdi</p>
          </div>
        )}

        {/* Description */}
        {campaign.description && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h2 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-500" />
              Kampanya Hakkında
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">{campaign.description}</p>
          </div>
        )}

        {/* Campaign code */}
        {campaign.campaign_code && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4 text-orange-500" />
              Kampanya Kodu
            </h2>
            <button
              onClick={handleCopyCode}
              className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 border border-dashed border-orange-500/50 hover:border-orange-500 rounded-xl px-4 py-3 transition-all group"
            >
              <span className="text-orange-400 font-mono text-lg font-bold tracking-widest">
                {campaign.campaign_code}
              </span>
              <span className="flex items-center gap-1.5 text-gray-400 group-hover:text-orange-400 transition-colors text-xs">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Kopyala
                  </>
                )}
              </span>
            </button>
          </div>
        )}

        {/* Terms & Conditions */}
        {campaign.terms_conditions && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setTermsOpen((o) => !o)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors"
            >
              <span className="flex items-center gap-2 text-white font-semibold text-sm">
                <FileText className="w-4 h-4 text-orange-500" />
                Kampanya Koşulları
              </span>
              {termsOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {termsOpen && (
              <div className="px-4 pb-4 border-t border-gray-800">
                <p className="text-gray-400 text-sm leading-relaxed pt-3 whitespace-pre-line">
                  {campaign.terms_conditions}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Start / end dates */}
        {(campaign.start_date || campaign.end_date) && (
          <div className="flex gap-3">
            {campaign.start_date && (
              <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-0.5">Başlangıç</p>
                <p className="text-gray-300 text-sm font-medium">
                  {new Date(campaign.start_date).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}
            {campaign.end_date && (
              <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-0.5">Bitiş</p>
                <p className="text-gray-300 text-sm font-medium">
                  {new Date(campaign.end_date).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-sm border-t border-gray-800 p-4 z-50">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/randevu-al?campaign=${campaign.id}`}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-2xl py-4 font-semibold text-base transition-colors"
          >
            Hemen Randevu Al
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
