import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { successResponse, errors, logError } from '@/lib/api-response';

interface Vehicle {
  brand: string;
  model: string;
  min_year: number;
  max_year: number;
}

export async function GET(request: NextRequest) {
  try {
    const pool = getPool();

    const [rows] = await pool.execute(`
      SELECT DISTINCT brand, model, MIN(year_start) as min_year, MAX(year_end) as max_year
      FROM kronik_sorunlar
      WHERE brand IS NOT NULL AND model IS NOT NULL
      GROUP BY brand, model
      ORDER BY brand, model
    `);

    return successResponse({ vehicles: rows as Vehicle[] });
  } catch (error) {
    logError('Vehicles API', error);
    return errors.internal('Araç listesi yüklenemedi');
  }
}
