import { NextResponse } from 'next/server';

const STRAPI_API = 'https://api.tamirhanem.net/api';

export async function GET() {
    try {
        // Strapi'den kategorileri çek
        const response = await fetch(`${STRAPI_API}/categories?pagination[limit]=100`, {
            next: { revalidate: 3600 } // 1 saat cache
        });
        
        if (!response.ok) {
            throw new Error('Strapi API erişim hatası');
        }
        
        const json = await response.json();
        const categories = json.data || [];
        
        // Strapi formatından frontend formatına çevir
        const formattedCategories = categories.map((cat: any) => {
            const attrs = cat.attributes || cat;
            const name = attrs.name || '';
            
            // Slug oluştur
            const slug = name
                .toLowerCase()
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            
            return {
                id: cat.id,
                name: name,
                title: name,
                description: attrs.description || '',
                slug: slug
            };
        });
        
        return NextResponse.json({ success: true, data: formattedCategories });
    } catch (error) {
        console.error('Strapi API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Kategoriler yüklenemedi' },
            { status: 500 }
        );
    }
}
