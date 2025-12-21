import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Admin şifresi - production'da env variable olarak saklanmalı
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'TamirHanem2024!';
const SESSION_SECRET = process.env.SESSION_SECRET || 'tamirhanem-admin-secret-key-2024';

// Basit token oluşturma
function generateToken(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return Buffer.from(`${timestamp}:${random}:${SESSION_SECRET}`).toString('base64');
}

// Token doğrulama - 24 saat geçerli
function validateToken(token: string): boolean {
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

export async function POST(request: Request) {
    try {
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
