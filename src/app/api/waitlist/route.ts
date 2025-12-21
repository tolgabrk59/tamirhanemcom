import { NextRequest, NextResponse } from 'next/server';

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, phone, name } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Server-side token ile email kontrolü (Strapi'de find public değil)
        const checkResponse = await fetch(
            `${STRAPI_API}/waitinglists?filters[email][$eq]=${encodeURIComponent(email)}`,
            { 
                headers: {
                    'Content-Type': 'application/json',
                    ...(STRAPI_TOKEN && { 'Authorization': `Bearer ${STRAPI_TOKEN}` })
                },
                cache: 'no-store' 
            }
        );

        if (checkResponse.ok) {
            const checkData = await checkResponse.json();
            if (checkData.data && checkData.data.length > 0) {
                return NextResponse.json(
                    { message: 'Already registered', success: true },
                    { status: 200 }
                );
            }
        }

        // Strapi'ye yeni kayıt ekle (token ile)
        const createResponse = await fetch(`${STRAPI_API}/waitinglists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(STRAPI_TOKEN && { 'Authorization': `Bearer ${STRAPI_TOKEN}` })
            },
            body: JSON.stringify({
                data: {
                    email,
                    phone: phone || null,
                    name: name || null,
                }
            })
        });

        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            console.error('Strapi waitlist create error:', errorText);
            
            // Kullanıcıya hata gösterme, log'a yaz
            console.log('Waitlist kayıt (fallback):', { email, phone, name });
            
            return NextResponse.json(
                { message: 'Successfully added to waitlist', success: true },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: 'Successfully added to waitlist', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Waitlist API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
