import { NextResponse } from 'next/server';

const STRAPI_API = 'https://api.tamirhanem.net/api';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '6');

        // Strapi'den popüler kodları çek (frequency'ye göre sıralı)
        const response = await fetch(
            `${STRAPI_API}/obd-codes?sort=frequency:desc&pagination[limit]=${limit}`,
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
        console.error('Strapi API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Popüler OBD kodları yüklenemedi' },
            { status: 500 }
        );
    }
}
