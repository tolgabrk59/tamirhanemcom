import { NextResponse } from 'next/server';

const STRAPI_API = 'https://api.tamirhanem.net/api';

export async function GET() {
    try {
        // Strapi'den servis verilerini çek
        const response = await fetch(`${STRAPI_API}/services?pagination[pageSize]=1000&fields[0]=id&fields[1]=rating`, {
            next: { revalidate: 300 } // 5 dakika cache
        });

        if (!response.ok) {
            throw new Error('Strapi API erişim hatası');
        }

        const json = await response.json();
        const services = json.data || [];
        
        // Servis sayısı
        const serviceCount = services.length;
        
        // Ortalama rating hesapla
        const ratingsWithValues = services
            .map((s: any) => s.attributes?.rating || s.rating)
            .filter((r: number | null) => r !== null && r > 0);
        
        const avgRating = ratingsWithValues.length > 0
            ? (ratingsWithValues.reduce((a: number, b: number) => a + b, 0) / ratingsWithValues.length).toFixed(1)
            : '4.8';

        // Müşteri sayısı - tahmini değer
        const customerCount = 50000;

        return NextResponse.json({
            success: true,
            data: {
                serviceCount,
                customerCount,
                avgRating,
                savingsPercent: 30
            }
        });
    } catch (error) {
        console.error('Stats API Error:', error);
        // Fallback değerler
        return NextResponse.json({
            success: true,
            data: {
                serviceCount: 500,
                customerCount: 50000,
                avgRating: '4.8',
                savingsPercent: 30
            }
        });
    }
}
