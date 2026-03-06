import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_GERI_CAGIRMALAR_MODELLER');

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const marka = searchParams.get('marka');

        if (!marka) {
            return NextResponse.json({ modeller: [] });
        }

        const connection = await mysql.createConnection({
            host: process.env.LOCAL_DB_HOST || 'localhost',
            user: process.env.LOCAL_DB_USER || 'dietpi',
            password: process.env.LOCAL_DB_PASSWORD || 'Aras2017@',
            database: process.env.LOCAL_DB_NAME || 'randevu_db',
        });

        const [rows] = await connection.execute<mysql.RowDataPacket[]>(
            'SELECT DISTINCT model FROM geri_cagirmalar WHERE marka = ? AND model IS NOT NULL ORDER BY model',
            [marka]
        );

        await connection.end();

        const modeller = rows.map(row => row.model);

        return NextResponse.json({ modeller });
    } catch (error) {
        logger.error({ error }, 'Modeller API hatası');
        return NextResponse.json(
            { error: 'Modeller yüklenemedi', modeller: [] },
            { status: 500 }
        );
    }
}
