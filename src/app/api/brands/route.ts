import { NextResponse } from 'next/server';
import { getBrands } from '@/lib/db';

export async function GET() {
    try {
        const brands = await getBrands();
        return NextResponse.json({ success: true, data: brands });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Markalar yüklenemedi' },
            { status: 500 }
        );
    }
}
