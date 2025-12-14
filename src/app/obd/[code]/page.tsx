import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ObdDetail from '@/components/ObdDetail';
import { getObdCodeByCode } from '@/lib/strapi';
import { getObdCodeByCodeLocal, obdCodesData } from '@/data/obd-codes';
import type { ObdCode } from '@/types';

interface PageProps {
  params: Promise<{ code: string }>;
}

async function getObdCodeData(code: string): Promise<ObdCode | null> {
  try {
    const strapiCode = await getObdCodeByCode(code);
    if (strapiCode) {
      return strapiCode;
    }
  } catch (error) {
    console.error('Failed to fetch OBD code from Strapi:', error);
  }
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
