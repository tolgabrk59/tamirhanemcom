import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// EV Charging PostgreSQL bağlantısı
const pool = new Pool({
  connectionString: process.env.EV_CHARGING_DB_URL || 'postgresql://tamirhanem:tamirhanem@localhost:5435/ev_charging',
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

// Konnektör tipi okunabilir isim eşleme
const CONNECTOR_TYPE_NAMES: Record<string, string> = {
  CCS2: 'CCS (Type 2)',
  CCS1: 'CCS (Type 1)',
  TYPE2: 'Type 2 (Mennekes)',
  TYPE1: 'Type 1 (J1772)',
  CHADEMO: 'CHAdeMO',
  TESLA: 'Tesla Supercharger',
  GB_T: 'GB/T',
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city') || ''
    const district = searchParams.get('district') || ''
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '500')

    if (!city && !lat && !lng) {
      return NextResponse.json({
        success: true,
        data: { stations: [], count: 0, dataSource: 'ev_charging_db' },
      })
    }

    let query: string
    let params: (string | number)[]

    if (lat && lng) {
      // Koordinat bazlı arama - en yakın istasyonlar (PostGIS mesafe hesabı)
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)
      query = `
        SELECT s.*,
          ST_Distance(s.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) / 1000.0 as distance_km
        FROM stations s
        WHERE s.is_operational = true
          AND s.latitude != 0 AND s.longitude != 0
        ORDER BY s.location <-> ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        LIMIT $3
      `
      params = [userLng, userLat, limit]
    } else if (city) {
      // Şehir bazlı arama - ILIKE ile Türkçe uyumlu
      if (district) {
        query = `
          SELECT s.*, NULL as distance_km
          FROM stations s
          WHERE s.is_operational = true
            AND s.latitude != 0 AND s.longitude != 0
            AND s.city ILIKE $1
            AND s.address ILIKE '%' || $2 || '%'
          ORDER BY s.max_power_kw DESC NULLS LAST, s.station_name
          LIMIT $3
        `
        params = [city, district, limit]
      } else {
        query = `
          SELECT s.*, NULL as distance_km
          FROM stations s
          WHERE s.is_operational = true
            AND s.latitude != 0 AND s.longitude != 0
            AND s.city ILIKE $1
          ORDER BY s.max_power_kw DESC NULLS LAST, s.station_name
          LIMIT $2
        `
        params = [city, limit]
      }
    } else {
      return NextResponse.json({
        success: true,
        data: { stations: [], count: 0, dataSource: 'ev_charging_db' },
      })
    }

    const client = await pool.connect()
    try {
      // İstasyonları çek
      const stationResult = await client.query(query, params)
      const stationRows = stationResult.rows

      if (stationRows.length === 0) {
        return NextResponse.json({
          success: true,
          data: { stations: [], count: 0, dataSource: 'ev_charging_db' },
        })
      }

      // İlgili konnektörleri tek sorguda çek
      const stationIds = stationRows.map((r: any) => r.id)
      const connectorResult = await client.query(
        `SELECT * FROM connectors WHERE station_id = ANY($1) ORDER BY station_id, power_kw DESC NULLS LAST`,
        [stationIds]
      )

      // Konnektörleri station_id bazlı grupla
      const connectorMap: Record<number, any[]> = {}
      for (const conn of connectorResult.rows) {
        if (!connectorMap[conn.station_id]) {
          connectorMap[conn.station_id] = []
        }
        connectorMap[conn.station_id].push({
          type: conn.connector_type || 'UNKNOWN',
          typeName: CONNECTOR_TYPE_NAMES[conn.connector_type] || conn.connector_type || 'Bilinmiyor',
          powerKw: conn.power_kw ? parseFloat(conn.power_kw) : null,
          quantity: conn.socket_count || 1,
          currentType: conn.current_type || null,
        })
      }

      // Frontend formatına dönüştür
      const stations = stationRows.map((row: any) => {
        const connectors = connectorMap[row.id] || []
        const hasDC = row.has_dc ?? connectors.some((c: any) => c.currentType === 'DC')
        const hasAC = row.has_ac ?? connectors.some((c: any) => c.currentType === 'AC')

        return {
          id: row.id,
          name: row.station_name || 'Şarj İstasyonu',
          address: row.address || '',
          city: row.city || '',
          district: '',
          latitude: row.latitude ? parseFloat(row.latitude) : null,
          longitude: row.longitude ? parseFloat(row.longitude) : null,
          phone: row.phone || null,
          website: row.website || null,
          email: null,
          operatorName: row.operator_name || null,
          maxPowerKw: row.max_power_kw ? parseFloat(row.max_power_kw) : null,
          connectors,
          numberOfPoints: row.total_points || connectors.length,
          is24Hours: null,
          isPublic: row.is_public ?? true,
          usageCost: null,
          usageType: row.is_public ? 'Halka Açık' : 'Özel',
          statusType: row.is_operational ? 'Aktif' : 'Kapalı',
          isOperational: row.is_operational ?? true,
          hasDC,
          hasAC,
          rating: null,
          reviewCount: 0,
          category: 'charging_station',
          source: row.source || 'epdk',
          distance: row.distance_km ? parseFloat(row.distance_km) : null,
          lastVerified: row.updated_at || null,
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          stations,
          count: stations.length,
          dataSource: 'ev_charging_db',
        },
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('EV chargers API hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Şarj istasyonları yüklenemedi' },
      { status: 500 }
    )
  }
}
