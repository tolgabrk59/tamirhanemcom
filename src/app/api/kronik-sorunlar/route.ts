import { NextResponse } from 'next/server';
import { searchChronicProblems } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const brand = searchParams.get('brand') || undefined;
        const model = searchParams.get('model') || undefined;
        const yearStr = searchParams.get('year');
        const year = yearStr ? parseInt(yearStr) : undefined;
        const problem = searchParams.get('problem') || undefined;

        const results = await searchChronicProblems(brand, model, year, problem);

        return NextResponse.json({
            success: true,
            data: results,
            count: results.length
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Kronik sorunlar araması başarısız oldu' },
            { status: 500 }
        );
    }
}
