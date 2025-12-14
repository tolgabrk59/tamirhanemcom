import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/db';

export async function GET() {
    try {
        const categories = await getCategories();
        return NextResponse.json({ success: true, data: categories });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Kategoriler yüklenemedi' },
            { status: 500 }
        );
    }
}
