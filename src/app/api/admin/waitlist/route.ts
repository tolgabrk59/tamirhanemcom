import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateToken } from '@/lib/admin-auth';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_ADMIN_WAITLIST');

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.com/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Token doğrulama
async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    
    if (!token) return false;
    
    return validateToken(token);
}

export async function GET() {
    // Auth kontrolü
    if (!await isAuthenticated()) {
        return NextResponse.json(
            { success: false, error: 'Yetkisiz erişim' },
            { status: 401 }
        );
    }
    
    try {
        // Strapi'den waitlist verilerini çek
        const response = await fetch(
            `${STRAPI_API}/waitinglists?sort=createdAt:desc&pagination[limit]=100`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(STRAPI_TOKEN && { 'Authorization': `Bearer ${STRAPI_TOKEN}` })
                },
                cache: 'no-store'
            }
        );

        if (!response.ok) {
            logger.error({ status: response.status }, 'Strapi waitlist çekme hatası');
            return NextResponse.json({
                success: false,
                error: 'Veri çekme hatası',
                data: []
            });
        }

        const result = await response.json();
        
        // Strapi formatından düz listeye dönüştür
        const data = result.data?.map((item: { id: number; attributes?: Record<string, unknown> }) => ({
            id: item.id,
            ...item.attributes
        })) || [];

        return NextResponse.json({ 
            success: true, 
            data
        });
    } catch (error) {
        logger.error({ error }, 'Waitlist çekme hatası');
        return NextResponse.json(
            { success: false, error: 'Veri çekme hatası', data: [] },
            { status: 500 }
        );
    }
}
