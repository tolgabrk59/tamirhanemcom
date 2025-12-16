import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Environment variables check (masking sensitive data)
        const dbConfig = {
            host: process.env.DB_HOST ? `${process.env.DB_HOST.substring(0, 8)}***` : 'NOT SET',
            user: process.env.DB_USER ? `${process.env.DB_USER.substring(0, 4)}***` : 'NOT SET',
            password: process.env.DB_PASSWORD ? '***SET***' : 'NOT SET',
            database: process.env.DB_NAME || 'NOT SET (using default: randevu_db)',
            connectionLimit: process.env.DB_CONNECTION_LIMIT || 'NOT SET (using default: 10)',
            ssl: process.env.DB_SSL || 'NOT SET (using default: false)'
        };

        // Try to verify actual database connection
        let connectionTest = 'NOT TESTED';
        let tableCheck = 'NOT TESTED';
        
        try {
            const pool = (await import('@/lib/db')).default;
            const [result] = await pool.execute('SELECT 1 as test') as [any[], any];
            connectionTest = result.length > 0 ? 'SUCCESS' : 'FAILED - No result';
            
            // Check tables
            const [tables] = await pool.execute('SHOW TABLES') as [any[], any];
            tableCheck = `Found ${tables.length} tables`;
            
            // Check arac_dataveri count
            const [countResult] = await pool.execute('SELECT COUNT(*) as cnt FROM arac_dataveri') as [any[], any];
            tableCheck += `, arac_dataveri has ${countResult[0].cnt} rows`;
        } catch (dbError: any) {
            connectionTest = `FAILED: ${dbError.message}`;
        }

        return NextResponse.json({
            success: true,
            config: dbConfig,
            connectionTest,
            tableCheck,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
