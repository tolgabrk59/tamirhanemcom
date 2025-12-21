import { NextResponse } from 'next/server';

const STRAPI_API = 'https://api.tamirhanem.net/api/arac-dataveri';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const brand = searchParams.get('brand');
        const vehicleType = searchParams.get('vehicleType') || undefined;

        if (!brand) {
            return NextResponse.json(
                { success: false, error: 'Marka parametresi gerekli' },
                { status: 400 }
            );
        }

        let models: string[] = [];

        if (vehicleType === 'motorsiklet') {
            // Motorsiklet için: brand aslında MOTORSIKLET'in bir modeli (örn: YAMAHA)
            // Bu durumda packets endpoint'inden full_model'leri al
            const response = await fetch(
                `${STRAPI_API}/packets/MOTORSIKLET/${encodeURIComponent(brand)}`,
                { next: { revalidate: 3600 } }
            );
            
            if (!response.ok) throw new Error('Strapi API erişim hatası');
            
            const json = await response.json();
            const packets = json.data || [];
            
            // full_model alanlarını unique olarak model listesi olarak dön
            const uniqueModels = [...new Set(packets.map((p: any) => p.full_model))];
            models = uniqueModels.filter((m: any) => m) as string[];
        } else {
            // Otomobil için: Normal marka-model sorgusu
            const response = await fetch(
                `${STRAPI_API}/models/${encodeURIComponent(brand)}`,
                { next: { revalidate: 3600 } }
            );
            
            if (!response.ok) throw new Error('Strapi API erişim hatası');
            
            const json = await response.json();
            models = json.data || [];
            
            // FIAT için TOFAS-FIAT modellerini de dahil et
            if (brand.toUpperCase() === 'FIAT') {
                try {
                    const tofasResponse = await fetch(
                        `${STRAPI_API}/models/TOFAS-FIAT`,
                        { next: { revalidate: 3600 } }
                    );
                    if (tofasResponse.ok) {
                        const tofasJson = await tofasResponse.json();
                        const tofasModels = tofasJson.data || [];
                        // Birleştir ve unique yap
                        models = [...new Set([...models, ...tofasModels])];
                    }
                } catch (e) {
                    // TOFAS-FIAT modelleri alınamazsa sessizce devam et
                    console.log('TOFAS-FIAT modelleri alınamadı');
                }
            }
        }
        
        // Strapi string array döndürüyor, frontend { model: string } bekliyor
        const formattedModels = models.map((m: string) => ({ model: m }));
        
        return NextResponse.json({ success: true, data: formattedModels });
    } catch (error) {
        console.error('Strapi API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Modeller yüklenemedi' },
            { status: 500 }
        );
    }
}
