import { NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_OBD_SEARCH');

const STRAPI_API = 'https://api.tamirhanem.com/api';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.length < 2) {
        return NextResponse.json({ success: true, data: [], count: 0 });
    }

    try {
        // Strapi'de arama yap
        const filters = [
            `filters[$or][0][code][$containsi]=${encodeURIComponent(query)}`,
            `filters[$or][1][title][$containsi]=${encodeURIComponent(query)}`,
            `filters[$or][2][description][$containsi]=${encodeURIComponent(query)}`
        ].join('&');

        const response = await fetch(
            `${STRAPI_API}/obd-codes?${filters}&sort=frequency:desc&pagination[limit]=${limit}`,
            { next: { revalidate: 3600 } }
        );

        if (!response.ok) {
            throw new Error('Strapi API erişim hatası');
        }

        const json = await response.json();
        const obdCodes = json.data || [];

        // Strapi formatından frontend formatına çevir
        const formattedCodes = obdCodes.map((item: any) => {
            const attrs = item.attributes || item;

            const severityMap: Record<string, string> = {
                'high': 'high', 'yuksek': 'high', 'critical': 'high',
                'medium': 'medium', 'orta': 'medium',
                'low': 'low', 'dusuk': 'low'
            };

            return {
                id: item.id,
                code: attrs.code,
                title: attrs.title || '',
                description: attrs.description || '',
                causes: attrs.causes || [],
                fixes: attrs.solutions || [],
                symptoms: attrs.symptoms || [],
                severity: severityMap[attrs.severity?.toLowerCase()] || 'medium',
                category: attrs.category || '',
                estimatedCostMin: attrs.estimated_cost_min || null,
                estimatedCostMax: attrs.estimated_cost_max || null,
                frequency: attrs.frequency || 0
            };
        });

        return NextResponse.json({
            success: true,
            data: formattedCodes,
            count: formattedCodes.length
        });
    } catch (error) {
        logger.error({ error }, 'Strapi API Error');
        return NextResponse.json(
            { success: false, error: 'OBD kodları araması başarısız oldu' },
            { status: 500 }
        );
    }
}
