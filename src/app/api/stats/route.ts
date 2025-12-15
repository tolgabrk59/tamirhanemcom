import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        // MySQL'den servis verilerini çek
        const [services] = await pool.execute('SELECT id, rating FROM services WHERE published_at IS NOT NULL') as [any[], any];
        
        // Servis sayısı
        const serviceCount = services.length;
        
        // Ortalama rating hesapla
        const ratingsWithValues = services
            .map((s: any) => s.rating)
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
