import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Token doğrulama
async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    
    if (!token) return false;
    
    try {
        const decoded = Buffer.from(token, 'base64').toString();
        const [timestamp] = decoded.split(':');
        const tokenTime = parseInt(timestamp);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        return (now - tokenTime) < twentyFourHours;
    } catch {
        return false;
    }
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
        // Strapi'den randevu taleplerini çek
        const response = await fetch(
            `${STRAPI_API}/randevu-talepleri?sort=createdAt:desc&pagination[limit]=100`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(STRAPI_TOKEN && { 'Authorization': `Bearer ${STRAPI_TOKEN}` })
                },
                cache: 'no-store'
            }
        );

        if (!response.ok) {
            console.error('Strapi randevu talepleri çekme hatası:', response.status);
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
        console.error('Randevu talepleri çekme hatası:', error);
        return NextResponse.json(
            { success: false, error: 'Veri çekme hatası', data: [] },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    // Auth kontrolü
    if (!await isAuthenticated()) {
        return NextResponse.json(
            { success: false, error: 'Yetkisiz erişim' },
            { status: 401 }
        );
    }
    
    try {
        const { id, status } = await request.json();
        
        if (!id || !status) {
            return NextResponse.json(
                { success: false, error: 'ID ve status gerekli' },
                { status: 400 }
            );
        }
        
        // Strapi'de güncelle
        const response = await fetch(`${STRAPI_API}/randevu-talepleri/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(STRAPI_TOKEN && { 'Authorization': `Bearer ${STRAPI_TOKEN}` })
            },
            body: JSON.stringify({
                data: { status }
            })
        });

        if (!response.ok) {
            console.error('Strapi güncelleme hatası:', response.status);
            return NextResponse.json(
                { success: false, error: 'Güncelleme hatası' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: 'Durum güncellendi' });
    } catch (error) {
        console.error('Güncelleme hatası:', error);
        return NextResponse.json(
            { success: false, error: 'Güncelleme hatası' },
            { status: 500 }
        );
    }
}
