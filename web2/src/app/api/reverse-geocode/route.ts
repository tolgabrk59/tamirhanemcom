import { NextRequest, NextResponse } from 'next/server'
import { cityList, getDistrictsByCity } from '@/data/turkey-locations'
import { badRequest, serverError } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

// Türkçe karakter normalizasyonu
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
}

// Nominatim sonucunu turkey-locations.ts ile eşleştir
function matchCity(geoCity: string): string {
  if (!geoCity) return ''
  if (cityList.includes(geoCity)) return geoCity
  const norm = normalize(geoCity)
  return cityList.find((c) => normalize(c) === norm) || ''
}

function matchDistrict(city: string, geoDistrict: string): string {
  if (!city || !geoDistrict) return ''
  const districts = getDistrictsByCity(city)
  if (districts.includes(geoDistrict)) return geoDistrict
  const norm = normalize(geoDistrict)
  return districts.find((d) => normalize(d) === norm) || ''
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')

    if (!lat || !lon) {
      return badRequest('lat ve lon parametreleri gereklidir')
    }

    const latNum = parseFloat(lat)
    const lonNum = parseFloat(lon)

    if (isNaN(latNum) || isNaN(lonNum)) {
      return badRequest('Geçersiz koordinat değerleri')
    }

    // Nominatim reverse geocode
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latNum}&lon=${lonNum}&format=json&accept-language=tr&zoom=12`

    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'TamirHanem/1.0 (tamirhanem.com)',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Nominatim API hatası: ${response.status}`)
    }

    const data = await response.json()

    if (!data.address) {
      throw new Error('Adres bilgisi bulunamadı')
    }

    const address = data.address

    // Nominatim Türkiye adres yapısı:
    // state = il (Tekirdağ), county = ilçe (Süleymanpaşa), city/town = şehir
    const rawCity = address.state || address.province || address.city || ''
    const rawDistrict = address.county || address.town || address.suburb || address.district || ''

    // turkey-locations.ts ile eşleştir
    let matchedCity = matchCity(rawCity)

    // Eğer state ile bulamadıysak, city ile dene
    if (!matchedCity && address.city) {
      matchedCity = matchCity(address.city)
    }

    // Hala bulamadıysak province ile dene
    if (!matchedCity && address.province) {
      matchedCity = matchCity(address.province)
    }

    const matchedDistrict = matchedCity ? matchDistrict(matchedCity, rawDistrict) : ''

    if (!matchedCity) {
      return NextResponse.json({
        success: false,
        error: 'Konum Türkiye sınırları dışında veya eşleştirilemedi',
        raw: { city: rawCity, district: rawDistrict },
      })
    }

    return NextResponse.json({
      success: true,
      city: matchedCity,
      district: matchedDistrict,
      raw: {
        city: rawCity,
        district: rawDistrict,
        display_name: data.display_name || '',
      },
    })
  } catch (error: unknown) {
    console.error('[reverse-geocode] Hata:', error instanceof Error ? error.message : error)
    return serverError('Reverse geocode işlemi başarısız')
  }
}
