import { NextRequest, NextResponse } from 'next/server';
import { searchObdCodes } from '@/lib/db';
import { searchObdCodesLocal } from '@/data/obd-codes';
import type { ObdCode } from '@/types';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q') || '';
        const limit = parseInt(searchParams.get('limit') || '20');

        if (!query) {
            return NextResponse.json({
                results: [],
                total: 0,
                query: '',
                message: 'Arama terimi gerekli'
            }, { status: 400 });
        }

        // Try MySQL first
        let results: ObdCode[] = await searchObdCodes(query, limit);

        // Fallback to local data if MySQL returns no results
        if (results.length === 0) {
            console.log('MySQL returned no results, falling back to local data');
            const localResults = searchObdCodesLocal(query).slice(0, limit);
            // Add frequency field to match database schema
            results = localResults.map(r => ({ ...r, frequency: r.frequency || 0 })) as ObdCode[];
        }

        const total = results.length;

        return NextResponse.json({
            results,
            total,
            query,
            limit,
            source: results.length > 0 ? 'database' : 'local'
        });
    } catch (error) {
        console.error('OBD search error:', error);

        // Fallback to local data on error
        try {
            const query = request.nextUrl.searchParams.get('q') || '';
            const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
            const localResults = searchObdCodesLocal(query).slice(0, limit);
            // Add frequency field to match database schema
            const results = localResults.map(r => ({ ...r, frequency: r.frequency || 0 }));

            return NextResponse.json({
                results,
                total: results.length,
                query,
                limit,
                source: 'local',
                warning: 'Database error, using local data'
            });
        } catch (fallbackError) {
            return NextResponse.json({
                error: 'Arama sırasında bir hata oluştu',
                results: [],
                total: 0
            }, { status: 500 });
        }
    }
}
