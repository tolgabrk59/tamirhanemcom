import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ObdDetail from '@/components/ObdDetail';
import { getObdCodeByCodeLocal, obdCodesData } from '@/data/obd-codes';
import type { ObdCode } from '@/types';

const STRAPI_API = 'https://api.tamirhanem.net/api';

interface PageProps {
  params: Promise<{ code: string }>;
}

async function getObdCodeData(code: string): Promise<ObdCode | null> {
  try {
    // Strapi'den OBD kodunu çek
    const response = await fetch(
      `${STRAPI_API}/obd-codes?filters[code][$eq]=${code.toUpperCase()}&pagination[limit]=1`,
      { next: { revalidate: 3600 } } // 1 saat cache
    );

    if (response.ok) {
      const json = await response.json();
      const items = json.data || [];
      
      if (items.length > 0) {
        const item = items[0];
        const attrs = item.attributes || item;
        
        const severityMap: { [key: string]: ObdCode['severity'] } = {
          'YÜKSEK': 'high',
          'high': 'high',
          'ORTA': 'medium',
          'medium': 'medium',
          'DÜŞÜK': 'low',
          'low': 'low'
        };

        let causes: string[] = [];
        let solutions: string[] = [];

        // causes parsing
        if (attrs.causes) {
          if (Array.isArray(attrs.causes)) {
            causes = attrs.causes;
          } else if (typeof attrs.causes === 'string') {
            try {
              causes = JSON.parse(attrs.causes);
            } catch {
              causes = attrs.causes.split('\n').filter((c: string) => c.trim());
            }
          }
        }

        // solutions parsing
        if (attrs.solutions) {
          if (Array.isArray(attrs.solutions)) {
            solutions = attrs.solutions;
          } else if (typeof attrs.solutions === 'string') {
            try {
              solutions = JSON.parse(attrs.solutions);
            } catch {
              solutions = attrs.solutions.split('\n').filter((s: string) => s.trim());
            }
          }
        }

        return {
          id: item.id,
          code: attrs.code,
          title: attrs.title,
          description: attrs.description || '',
          causes: causes,
          fixes: solutions,
          symptoms: [],
          severity: severityMap[attrs.severity] || 'medium',
          category: attrs.category || '',
          estimatedCostMin: attrs.estimated_cost_min || null,
          estimatedCostMax: attrs.estimated_cost_max || null,
          frequency: attrs.frequency || 0
        };
      }
    }
  } catch (error) {
    console.error('Failed to fetch OBD code from Strapi:', error);
  }
  
  // Fallback to local data
  return getObdCodeByCodeLocal(code) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const code = resolvedParams.code.toUpperCase();
  const obdCode = await getObdCodeData(code);

  if (!obdCode) {
    return {
      title: 'OBD Kodu Bulunamadı',
      description: 'Aradığınız OBD arıza kodu bulunamadı.',
    };
  }

  return {
    title: `${obdCode.code} - ${obdCode.title}`,
    description: `${obdCode.code} OBD arıza kodu: ${obdCode.title}. Belirtiler, olası nedenler, çözüm önerileri ve tahmini tamir maliyeti. ${obdCode.estimatedCostMin}-${obdCode.estimatedCostMax} TL`,
    keywords: [
      obdCode.code,
      obdCode.title,
      'OBD kodu',
      'arıza kodu',
      obdCode.category,
      ...obdCode.symptoms.slice(0, 3),
    ],
    openGraph: {
      title: `${obdCode.code} - ${obdCode.title} | TamirHanem`,
      description: `${obdCode.code} arıza kodu hakkında detaylı bilgi. Belirtiler, nedenler ve çözümler.`,
      url: `https://tamirhanem.com/obd/${obdCode.code.toLowerCase()}`,
    },
    alternates: {
      canonical: `https://tamirhanem.com/obd/${obdCode.code.toLowerCase()}`,
    },
  };
}

export async function generateStaticParams() {
  // Pre-generate pages for all known OBD codes
  return obdCodesData.map((obd) => ({
    code: obd.code.toLowerCase(),
  }));
}

export default async function ObdCodePage({ params }: PageProps) {
  const resolvedParams = await params;
  const code = resolvedParams.code.toUpperCase();
  const obdCode = await getObdCodeData(code);

  if (!obdCode) {
    notFound();
  }

  return (
    <div className="bg-secondary-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ObdDetail obd={obdCode} />
      </div>
    </div>
  );
}
