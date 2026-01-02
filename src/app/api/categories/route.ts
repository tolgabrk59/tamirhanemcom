import { NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';
import { getCached } from '@/lib/cache';

const logger = createLogger('API_CATEGORIES');

const STRAPI_API = 'https://api.tamirhanem.com/api';

export async function GET() {
    try {
        // Redis cache ile optimize edilmiş veri çekme
        const formattedCategories = await getCached(
            'categories:all',
            async () => {
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
                return categories.map((cat: any) => {
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
            },
            {
                ttl: 3600, // 1 hour
                tags: ['categories']
            }
        );

        return NextResponse.json(
            { success: true, data: formattedCategories },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
                }
            }
        );
    } catch (error) {
        logger.error({ error }, 'Strapi API Error');
        return NextResponse.json(
            { success: false, error: 'Kategoriler yüklenemedi' },
            { status: 500 }
        );
    }
}
