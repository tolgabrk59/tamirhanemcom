import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateToken, validateToken, hasAdminConfig } from '@/lib/admin-auth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: Request) {
    try {
        if (!hasAdminConfig()) {
            return NextResponse.json(
                { success: false, error: 'Sunucu yapılandırması eksik' },
                { status: 500 }
            );
        }

        const { password } = await request.json();
        
        if (password === ADMIN_PASSWORD) {
            const token = generateToken();
            
            // Cookie ayarla
            const response = NextResponse.json({ 
                success: true, 
                message: 'Giriş başarılı' 
            });
            
            response.cookies.set('admin_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60, // 24 saat
                path: '/'
            });
            
            return response;
        }
        
        return NextResponse.json(
            { success: false, error: 'Geçersiz şifre' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Giriş hatası' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        if (!hasAdminConfig()) {
            return NextResponse.json(
                { success: false, authenticated: false },
                { status: 500 }
            );
        }

        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        
        if (!token || !validateToken(token)) {
            return NextResponse.json(
                { success: false, authenticated: false },
                { status: 401 }
            );
        }
        
        return NextResponse.json({ 
            success: true, 
            authenticated: true 
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, authenticated: false },
            { status: 401 }
        );
    }
}

export async function DELETE() {
    const response = NextResponse.json({ 
        success: true, 
        message: 'Çıkış yapıldı' 
    });
    
    response.cookies.delete('admin_token');
    
    return response;
}
