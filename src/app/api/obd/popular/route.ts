import { NextResponse } from 'next/server';
import { getPopularObdCodes } from '@/lib/db';
import { getPopularObdCodesLocal } from '@/data/obd-codes';

export async function GET() {
    try {
        // Try MySQL first
        let results = await getPopularObdCodes(2);

        // Fallback to local data if MySQL returns no results
        if (results.length === 0) {
            console.log('MySQL returned no results, falling back to local data');
            results = getPopularObdCodesLocal(2);
        }

        return NextResponse.json({
            results,
            total: results.length,
            source: results.length > 0 ? 'database' : 'local'
        });
    } catch (error) {
        console.error('Popular OBD codes error:', error);

        // Fallback to local data on error
        try {
            const results = getPopularObdCodesLocal(2);
            return NextResponse.json({
                results,
                total: results.length,
                source: 'local',
                warning: 'Database error, using local data'
            });
        } catch (fallbackError) {
            return NextResponse.json({
                error: 'Veri alınırken bir hata oluştu',
                results: [],
                total: 0
            }, { status: 500 });
        }
    }
}
