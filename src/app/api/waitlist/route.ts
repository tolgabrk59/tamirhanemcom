import { NextRequest, NextResponse } from 'next/server';

const STRAPI_API = 'https://api.tamirhanem.net/api';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, phone } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Strapi'de email kontrolü
        const checkResponse = await fetch(
            `${STRAPI_API}/waitinglists?filters[email][$eq]=${encodeURIComponent(email)}`,
            { cache: 'no-store' }
        );

        if (checkResponse.ok) {
            const checkData = await checkResponse.json();
            if (checkData.data && checkData.data.length > 0) {
                return NextResponse.json(
                    { message: 'Already registered' },
                    { status: 200 }
                );
            }
        }

        // Strapi'ye yeni kayıt ekle
        const createResponse = await fetch(`${STRAPI_API}/waitinglists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    email,
                    phone: phone || null,
                }
            })
        });

        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            console.error('Strapi create error:', errorText);
            throw new Error('Waitlist kayıt hatası');
        }

        return NextResponse.json(
            { message: 'Successfully added to waitlist' },
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
