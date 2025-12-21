import { NextResponse } from 'next/server';

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';
// Full access token for creating entries
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface RandevuTalebi {
    phone: string;
    name?: string;
    city: string;
    district?: string;
    brand: string;
    model: string;
    year?: string;
    fuel_type?: string;
    category: string;
    notes?: string;
}

export async function POST(request: Request) {
    try {
        const body: RandevuTalebi = await request.json();

        // Validate required fields
        if (!body.phone || !body.city || !body.brand || !body.model || !body.category) {
            return NextResponse.json(
                { success: false, error: 'Zorunlu alanlar eksik' },
                { status: 400 }
            );
        }

        // Phone number validation (Turkish format)
        const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
        const cleanPhone = body.phone.replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            return NextResponse.json(
                { success: false, error: 'Geçersiz telefon numarası formatı' },
                { status: 400 }
            );
        }

        // Normalize phone to +90 format
        let normalizedPhone = cleanPhone;
        if (normalizedPhone.startsWith('0')) {
            normalizedPhone = '+90' + normalizedPhone.slice(1);
        } else if (!normalizedPhone.startsWith('+90')) {
            normalizedPhone = '+90' + normalizedPhone;
        }

        // Prepare data for Strapi
        const strapiData = {
            data: {
                phone: normalizedPhone,
                name: body.name || null,
                city: body.city,
                district: body.district || null,
                brand: body.brand,
                model: body.model,
                year: body.year || null,
                fuel_type: body.fuel_type || null,
                category: body.category,
                notes: body.notes || null,
                status: 'pending'
            }
        };

        // Send to Strapi with admin token
        const response = await fetch(`${STRAPI_API}/randevu-talepleri`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(STRAPI_TOKEN && { 'Authorization': `Bearer ${STRAPI_TOKEN}` })
            },
            body: JSON.stringify(strapiData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Strapi error:', response.status, errorText);
            
            // Return success anyway to not frustrate user
            // Log the data for manual processing
            console.log('Randevu talebi (Strapi unavailable):', JSON.stringify(strapiData));
            
            return NextResponse.json({
                success: true,
                message: 'Randevu talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.',
                data: { id: Date.now() }
            });
        }

        const result = await response.json();

        return NextResponse.json({
            success: true,
            message: 'Randevu talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.',
            data: result.data
        });

    } catch (error) {
        console.error('Randevu talebi hatası:', error);
        return NextResponse.json(
            { success: false, error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
            { status: 500 }
        );
    }
}
