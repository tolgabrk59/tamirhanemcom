import Link from 'next/link';

interface StrapiCampaign {
  id: number;
  title: string;
  description?: string;
  discount_percentage?: number;
  is_active: boolean;
  campaign_image?: {
    url: string;
    formats?: {
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  };
}

interface Campaign {
  id: number;
  title: string;
  description?: string;
  discountPercent?: number;
  gradient?: string;
}

const GRADIENTS = [
  'from-orange-500 to-red-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
];

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

async function getCampaigns(): Promise<Campaign[]> {
  try {
    const res = await fetch(
      `${STRAPI}/campaigns?filters[is_active][$eq]=true&populate=campaign_image&sort=display_order:asc`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const items: StrapiCampaign[] = json.data || [];
    return items.slice(0, 3).map((item: StrapiCampaign, idx: number) => ({
      id: item.id ?? idx,
      title: item.title ?? 'Kampanya',
      description: item.description ?? '',
      discountPercent: item.discount_percentage ?? undefined,
      gradient: GRADIENTS[idx % GRADIENTS.length],
    }));
  } catch {
    return [];
  }
}

export default async function CampaignsPreview() {
  const campaigns = await getCampaigns();
  if (!campaigns.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {campaigns.map((campaign) => (
        <Link
          key={campaign.id}
          href="/kampanyalar"
          className={`relative flex flex-col justify-between rounded-2xl bg-gradient-to-br ${campaign.gradient} p-6 text-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden group`}
        >
          {/* Decorative circle */}
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 group-hover:scale-110 transition-transform" />

          <div className="relative z-10">
            {campaign.discountPercent && (
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                %{campaign.discountPercent} İndirim
              </span>
            )}
            <h3 className="text-lg font-bold leading-tight mb-2">{campaign.title}</h3>
            {campaign.description ? (
              <p className="text-sm text-white/80 line-clamp-2">{campaign.description}</p>
            ) : null}
          </div>

          <div className="relative z-10 mt-4">
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
              Keşfet
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
