import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_GERI_CAGIRMALAR_MARKALAR');

export async function GET() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.LOCAL_DB_HOST || 'localhost',
            user: process.env.LOCAL_DB_USER || 'dietpi',
            password: process.env.LOCAL_DB_PASSWORD || 'Aras2017@',
            database: process.env.LOCAL_DB_NAME || 'randevu_db',
        });

        const [rows] = await connection.execute<mysql.RowDataPacket[]>(
            'SELECT DISTINCT marka FROM geri_cagirmalar WHERE marka IS NOT NULL ORDER BY marka'
        );

        await connection.end();

        const markalar = rows.map(row => row.marka);

        return NextResponse.json({ markalar });
    } catch (error) {
        logger.error({ error }, 'Markalar API hatası');
        return NextResponse.json(
            { error: 'Markalar yüklenemedi', markalar: [] },
            { status: 500 }
        );
    }
}
