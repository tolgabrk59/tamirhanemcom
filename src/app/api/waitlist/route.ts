import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

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

        const connection = await pool.getConnection();

        try {
            // Check if email already exists
            const [existing] = await connection.execute(
                'SELECT id FROM waitinglists WHERE email = ?',
                [email]
            );

            if (Array.isArray(existing) && existing.length > 0) {
                return NextResponse.json(
                    { message: 'Already registered' },
                    { status: 200 }
                );
            }

            // Insert new waitlist entry
            const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await connection.execute(
                'INSERT INTO waitinglists (email, phone, created_at, updated_at, published_at) VALUES (?, ?, ?, ?, ?)',
                [email, phone || null, now, now, now]
            );

            return NextResponse.json(
                { message: 'Successfully added to waitlist' },
                { status: 200 }
            );
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Waitlist API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
