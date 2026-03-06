import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_GERI_CAGIRMALAR_YILLAR');

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const marka = searchParams.get('marka');
        const model = searchParams.get('model');

        if (!marka || !model) {
            return NextResponse.json({ yillar: [] });
        }

        const connection = await mysql.createConnection({
            host: process.env.LOCAL_DB_HOST || 'localhost',
            user: process.env.LOCAL_DB_USER || 'dietpi',
            password: process.env.LOCAL_DB_PASSWORD || 'Aras2017@',
            database: process.env.LOCAL_DB_NAME || 'randevu_db',
        });

        const [rows] = await connection.execute<mysql.RowDataPacket[]>(
            'SELECT DISTINCT yil FROM geri_cagirmalar WHERE marka = ? AND model = ? AND yil IS NOT NULL ORDER BY yil DESC',
            [marka, model]
        );

        await connection.end();

        const yillar = rows.map(row => row.yil);

        return NextResponse.json({ yillar });
    } catch (error) {
        logger.error({ error }, 'Yıllar API hatası');
        return NextResponse.json(
            { error: 'Yıllar yüklenemedi', yillar: [] },
            { status: 500 }
        );
    }
}
