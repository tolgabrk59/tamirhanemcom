import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateToken, validateToken, hasAdminConfig } from '@/lib/admin-auth';
import { checkRouteRateLimit, getClientIdentifier } from '@/lib/route-rate-limit';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Rate limit: 5 attempts per 15 minutes per IP (brute force protection)
const AUTH_RATE_LIMIT = 5;
const AUTH_RATE_WINDOW = 15 * 60 * 1000; // 15 minutes

export async function POST(request: Request) {
    try {
        // Rate limiting check for login attempts
        const identifier = getClientIdentifier(request.headers as Headers, 'admin-auth');
        const rateLimit = await checkRouteRateLimit(identifier, AUTH_RATE_LIMIT, AUTH_RATE_WINDOW);
        
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.',
                    retryAfter: rateLimit.retryAfter 
                },
                { 
                    status: 429,
                    headers: {
                        'Retry-After': String(rateLimit.retryAfter || 900),
                    }
                }
            );
        }

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
            { 
                success: false, 
                error: 'Geçersiz şifre',
                attemptsRemaining: rateLimit.remaining - 1 
            },
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
