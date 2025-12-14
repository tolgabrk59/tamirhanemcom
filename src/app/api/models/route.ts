import { NextResponse } from 'next/server';
import { getModelsByBrand } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const brand = searchParams.get('brand');

        if (!brand) {
            return NextResponse.json(
                { success: false, error: 'Marka parametresi gerekli' },
                { status: 400 }
            );
        }

        const models = await getModelsByBrand(brand);
        return NextResponse.json({ success: true, data: models });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Modeller yüklenemedi' },
            { status: 500 }
        );
    }
}
