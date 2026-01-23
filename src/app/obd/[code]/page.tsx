import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import ObdDetail from '@/components/ObdDetail';
import { getObdCodeByCodeLocal, obdCodesData } from '@/data/obd-codes';
import type { ObdCode, ObdCodeEnhanced } from '@/types';
import { createLogger } from '@/lib/logger';

const logger = createLogger('ObdCodePage');

// Dynamic imports for enhanced OBD components
const DiagnosticDecisionTree = dynamic(() => import('@/components/obd/DiagnosticDecisionTree'), { ssr: false });
const BrandVariationTabs = dynamic(() => import('@/components/obd/BrandVariationTabs'), { ssr: false });
const RelatedCodesSection = dynamic(() => import('@/components/obd/RelatedCodesSection'), { ssr: false });
const CodeHistoryTracker = dynamic(() => import('@/components/obd/CodeHistoryTracker'), { ssr: false });

const STRAPI_API = 'https://api.tamirhanem.com/api';

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
    logger.error({ error }, 'Failed to fetch OBD code from Strapi');
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

  // FAQPage JSON-LD for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `${obdCode.code} arıza kodu ne anlama gelir?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: obdCode.description || obdCode.title,
        },
      },
      {
        '@type': 'Question',
        name: `${obdCode.code} kodu nasıl düzeltilir?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: obdCode.fixes?.join('. ') || 'Profesyonel bir servis tarafından teşhis edilmelidir.',
        },
      },
      {
        '@type': 'Question',
        name: `${obdCode.code} arızasının tamir maliyeti ne kadar?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: obdCode.estimatedCostMin && obdCode.estimatedCostMax
            ? `Tahmini maliyet ${obdCode.estimatedCostMin.toLocaleString('tr-TR')} - ${obdCode.estimatedCostMax.toLocaleString('tr-TR')} TL arasındadır.`
            : 'Maliyet araca ve arızanın kaynağına göre değişir.',
        },
      },
    ],
  };

  // HowTo JSON-LD for SEO
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `${obdCode.code} Arıza Kodu Teşhis Rehberi`,
    description: `${obdCode.title} arızası için adım adım teşhis rehberi`,
    totalTime: 'PT30M',
    step: obdCode.fixes?.map((fix, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: `Adım ${index + 1}`,
      text: fix,
    })) || [],
  };

  return (
    <div className="bg-secondary-50 min-h-screen py-8">
      {/* Code History Tracker - adds viewed code to localStorage */}
      <CodeHistoryTracker
        code={obdCode.code}
        title={obdCode.title}
        severity={obdCode.severity}
      />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main OBD Detail */}
        <ObdDetail obd={obdCode} />

        {/* Enhanced Sections */}
        <div className="mt-8 space-y-8">
          {/* Interactive Diagnostic Tree */}
          <DiagnosticDecisionTree obdCode={obdCode.code} />

          {/* Brand-Specific Variations */}
          <BrandVariationTabs obdCode={obdCode.code} />

          {/* Related Codes */}
          <RelatedCodesSection
            currentCode={obdCode.code}
            category={obdCode.category}
          />
        </div>
      </div>
    </div>
  );
}
