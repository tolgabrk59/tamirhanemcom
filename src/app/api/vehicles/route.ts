import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(`
      SELECT DISTINCT brand, model, MIN(year_start) as min_year, MAX(year_end) as max_year
      FROM kronik_sorunlar
      WHERE brand IS NOT NULL AND model IS NOT NULL
      GROUP BY brand, model
      ORDER BY brand, model
    `);

    await connection.end();

    return NextResponse.json({ vehicles: rows });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}
