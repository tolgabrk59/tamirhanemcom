import { NextResponse } from 'next/server';

const STRAPI_API = 'https://api.tamirhanem.net/api/arac-dataveri';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const brand = searchParams.get('brand');
        const model = searchParams.get('model');

        if (!brand || !model) {
            return NextResponse.json(
                { success: false, error: 'Marka ve model gerekli' },
                { status: 400 }
            );
        }

        // Strapi'den paketleri çek
        const response = await fetch(
            `${STRAPI_API}/packets/${encodeURIComponent(brand)}/${encodeURIComponent(model)}`,
            { next: { revalidate: 3600 } } // 1 saat cache
        );
        
        if (!response.ok) {
            throw new Error('Strapi API erişim hatası');
        }
        
        const json = await response.json();
        const packages = json.data || [];
        
        // Strapi zaten { id, brand, model, paket, full_model } formatında döndürüyor
        return NextResponse.json({ success: true, data: packages });
    } catch (error) {
        console.error('Strapi API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Paketler yüklenemedi' },
            { status: 500 }
        );
    }
}
