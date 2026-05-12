import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { serverError } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const headersList = headers()
    const forwarded = headersList.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : null

    // Use ip-api.com (free, no key needed, supports Turkish city names)
    const apiUrl = ip && ip !== '127.0.0.1' && ip !== '::1'
      ? `http://ip-api.com/json/${ip}?fields=status,city,regionName,country,lat,lon&lang=tr`
      : `http://ip-api.com/json/?fields=status,city,regionName,country,lat,lon&lang=tr`

    const response = await fetch(apiUrl, { cache: 'no-store' })

    if (!response.ok) {
      throw new Error('Geolocation API error')
    }

    const data = await response.json()

    if (data.status !== 'success') {
      throw new Error('Geolocation lookup failed')
    }

    return NextResponse.json({
      success: true,
      city: data.regionName || '',
      district: data.city || '',
      lat: data.lat || null,
      lon: data.lon || null,
    })
  } catch (error: unknown) {
    console.error('[geolocation] Konum tespiti hatasi:', error instanceof Error ? error.message : error)
    return serverError('Konum bilgisi alinamadi')
  }
}
