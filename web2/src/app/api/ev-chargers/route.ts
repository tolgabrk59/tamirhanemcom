import { NextResponse } from 'next/server'

const STRAPI_API_URL = 'https://api.tamirhanem.net/api'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN
const SERPER_API_KEY = 'c54a2c0b18f493218783bd24abef63aceb9c1b18'

// İl/İlçe sorgu loglama - veri birikmesi için
async function logSearchQuery(city: string, district: string, stationCount: number) {
  try {
    await fetch(`${STRAPI_API_URL}/sarj-istasyonu-arama`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: { city, district: district || null, stationCount, searchedAt: new Date().toISOString() },
      }),
    }).catch(() => {})
  } catch (e) {
    console.log('Arama loglama hatası:', e)
  }
}

// Serper.dev'den şarj istasyonu ara
async function searchFromSerper(city: string, district: string) {
  try {
    // İlçe varsa önce ilçe, sonra il geneli ara
    const queries = []
    if (district) {
      queries.push(`${district} ${city} elektrikli araç şarj istasyonu`)
      queries.push(`${city} ${district} şarj istasyonu`)
    }
    queries.push(`${city} elektrikli araç şarj istasyonu`)
    queries.push(`${city} şarj istasyonları`)

    const allStations: any[] = []
    const seenIds = new Set()

    // Her query için Serper'den ara
    for (const query of queries) {
      const response = await fetch('https://google.serper.dev/places', {
        method: 'POST',
        headers: {
          'X-API-KEY': SERPER_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: query, num: 50 }), // 50 sonuç iste
      })

      if (!response.ok) continue

      const data = await response.json()
      
      const stations = (data.places || []).map((place: any, index: number) => ({
        id: `serper-${place.id || index}-${query.slice(0, 10)}`,
        name: place.title || 'Şarj İstasyonu',
        address: place.address || '',
        city,
        district: district || '',
        latitude: place.latitude || null,
        longitude: place.longitude || null,
        rating: place.rating || null,
        reviewCount: place.reviewCount || 0,
        phone: place.phoneNumber || null,
        website: place.website || null,
        operatorName: null,
        maxPowerKw: null,
        is24Hours: null,
        usageCost: null,
        connectors: [],
        category: 'charging_station',
        externalId: place.id || null,
        source: 'serper',
      }))

      // Duplicate'ları filtrele
      for (const station of stations) {
        const key = `${station.latitude}-${station.longitude}`
        if (!seenIds.has(key) && station.latitude) {
          seenIds.add(key)
          allStations.push(station)
        }
      }
    }

    return allStations
  } catch (error) {
    console.error('Serper arama hatası:', error)
    return []
  }
}

// Strapi'ye yeni istasyon ekle
async function saveToStrapi(station: any) {
  try {
    const response = await fetch(`${STRAPI_API_URL}/sarj-istasyonlari`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          externalId: station.externalId,
          name: station.name,
          operatorName: station.operatorName,
          address: station.address,
          city: station.city,
          district: station.district,
          latitude: station.latitude?.toString() || null,
          longitude: station.longitude?.toString() || null,
          maxPowerKw: station.maxPowerKw,
          is24Hours: station.is24Hours,
          source: station.source || 'strapi',
        },
      }),
    })

    if (response.ok) {
      const result = await response.json()
      console.log(`Strapi'ye kaydedildi: ${station.name}`)
      return result.data?.id
    }
    return null
  } catch (e) {
    console.log('Strapi kaydetme hatası:', e)
    return null
  }
}

// Mock data - fallback olarak
const MOCK_STATIONS = [
  {
    id: 1,
    name: 'Zorlu Center Şarj İstasyonu',
    address: 'Levazım, Koru Sokağı No:2, 34340 Beşiktaş/İstanbul',
    rating: 4.5,
    reviewCount: 128,
    phone: '+90 212 555 0001',
    latitude: 41.0642,
    longitude: 29.0078,
    category: 'charging_station',
    connectors: [
      { type: 'TYPE2', typeName: 'Type 2', powerKw: 22, quantity: 2 },
      { type: 'CCS2', typeName: 'CCS2', powerKw: 50, quantity: 1 },
    ],
    maxPowerKw: 50,
    operatorName: 'Eşarj',
    is24Hours: true,
    isPublic: true,
    usageCost: '₺2.5/kWh',
  },
  {
    id: 2,
    name: 'Kanyon AVM Şarj Noktası',
    address: 'Büyükdere Cad. No:185, 34394 Şişli/İstanbul',
    rating: 4.3,
    reviewCount: 95,
    phone: '+90 212 555 0002',
    latitude: 41.0706,
    longitude: 29.0092,
    category: 'charging_station',
    connectors: [
      { type: 'TYPE2', typeName: 'Type 2', powerKw: 11, quantity: 4 },
    ],
    maxPowerKw: 11,
    operatorName: 'Shell Recharge',
    is24Hours: false,
    isPublic: true,
    usageCost: '₺2.2/kWh',
  },
  {
    id: 3,
    name: 'Tesla Supercharger - Kadıköy',
    address: 'Caferağa, Moda Cad. No:85, 34710 Kadıköy/İstanbul',
    rating: 4.8,
    reviewCount: 210,
    phone: '+90 850 555 0003',
    latitude: 40.9876,
    longitude: 29.0267,
    category: 'charging_station',
    connectors: [
      { type: 'TESLA_SUPERCHARGER', typeName: 'Tesla Supercharger', powerKw: 250, quantity: 8 },
    ],
    maxPowerKw: 250,
    operatorName: 'Tesla',
    is24Hours: true,
    isPublic: true,
    usageCost: '₺3.0/kWh',
  },
  {
    id: 4,
    name: 'İstinyePark Şarj İstasyonu',
    address: 'İstinye, İstinye Bayırı Cad. No:73, 34460 Sarıyer/İstanbul',
    rating: 4.6,
    reviewCount: 156,
    phone: '+90 212 555 0004',
    latitude: 41.0978,
    longitude: 29.0353,
    category: 'charging_station',
    connectors: [
      { type: 'TYPE2', typeName: 'Type 2', powerKw: 22, quantity: 3 },
      { type: 'CCS2', typeName: 'CCS2', powerKw: 150, quantity: 2 },
      { type: 'CHADEMO', typeName: 'CHAdeMO', powerKw: 50, quantity: 1 },
    ],
    maxPowerKw: 150,
    operatorName: 'Trugo',
    is24Hours: true,
    isPublic: true,
    usageCost: '₺2.8/kWh',
  },
  {
    id: 5,
    name: 'Akmerkez Otopark Şarj',
    address: 'Etiler, Nispetiye Cad. No:54, 34337 Beşiktaş/İstanbul',
    rating: 4.2,
    reviewCount: 87,
    phone: '+90 212 555 0005',
    latitude: 41.0803,
    longitude: 29.0289,
    category: 'charging_station',
    connectors: [
      { type: 'TYPE2', typeName: 'Type 2', powerKw: 7, quantity: 6 },
    ],
    maxPowerKw: 7,
    operatorName: 'Voltrun',
    is24Hours: false,
    isPublic: true,
    usageCost: '₺2.0/kWh',
  },
  {
    id: 6,
    name: 'Vodafone Park Şarj İstasyonu',
    address: 'Vişnezade, Dolmabahçe Cad., 34357 Beşiktaş/İstanbul',
    rating: 4.4,
    reviewCount: 112,
    phone: '+90 212 555 0006',
    latitude: 41.0435,
    longitude: 29.0007,
    category: 'charging_station',
    connectors: [
      { type: 'TYPE2', typeName: 'Type 2', powerKw: 22, quantity: 4 },
      { type: 'CCS2', typeName: 'CCS2', powerKw: 100, quantity: 2 },
    ],
    maxPowerKw: 100,
    operatorName: 'Eşarj',
    is24Hours: true,
    isPublic: true,
    usageCost: '₺2.6/kWh',
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city') || ''
    const district = searchParams.get('district') || ''
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const forceRefresh = searchParams.get('refresh') === 'true'

    let stations: any[] = []
    let fromStrapi = true

    // Strapi'den veri çek
    if (!forceRefresh && STRAPI_API_TOKEN) {
      try {
        const strapiResponse = await fetch(
          `${STRAPI_API_URL}/sarj-istasyonlari?populate=*&pagination[limit]=100`,
          {
            headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
            next: { revalidate: 300 },
          }
        )

        if (strapiResponse.ok) {
          const strapiData = await strapiResponse.json()
          let allStations = strapiData.data?.map((item: any) => ({
            id: item.id,
            name: item.name || 'Şarj İstasyonu',
            address: item.address || '',
            city: item.city || '',
            district: item.district || '',
            latitude: item.latitude || null,
            longitude: item.longitude || null,
            maxPowerKw: item.maxPowerKw || null,
            operatorName: item.operatorName || null,
            is24Hours: item.gunluk24 || item.is24Hours || false,
            connectors: item.konektorler || item.connectors || [],
            category: 'charging_station',
            source: 'strapi',
          })) || []
          
          // Client-side filtreleme (Strapi filtresi düzgün çalışmıyor olabilir)
          if (city) {
            stations = allStations.filter((s: any) =>
              s.city?.toLowerCase().includes(city.toLowerCase())
            )
          } else {
            stations = allStations
          }
          
          if (district && stations.length > 0) {
            stations = stations.filter((s: any) =>
              s.district?.toLowerCase().includes(district.toLowerCase())
            )
          }
          
          console.log(`Strapi'den ${allStations.length} veri, filtrelenince ${stations.length} kaldı`)
        }
      } catch (e) {
        console.warn('Strapi fetch hatası:', e)
      }
    }

    // Strapi'de yoksa Serper'den ara
    if (stations.length === 0) {
      console.log('Strapi boş, Serper\'den aranıyor...')
      fromStrapi = false
      const serperStations = await searchFromSerper(city, district)
      
      if (serperStations.length > 0) {
        stations = serperStations
        // Hepsini Strapi'ye kaydet
        for (const station of serperStations) {
          await saveToStrapi(station)
        }
      }
    }

    // Hala yoksa mock data
    if (stations.length === 0) {
      console.log('Mock data kullanılıyor')
      stations = [...MOCK_STATIONS]
    }

    // Arama loglama
    await logSearchQuery(city, district, stations.length)

    // Konuma göre mesafe hesaplama
    if (lat && lng && stations.length > 0) {
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)
      stations = stations.map((station) => {
        if (station.latitude && station.longitude) {
          const distance = calculateDistance(userLat, userLng, parseFloat(station.latitude), parseFloat(station.longitude))
          return { ...station, distance }
        }
        return station
      })
      stations.sort((a, b) => {
        if (a.distance == null && b.distance == null) return 0
        if (a.distance == null) return 1
        if (b.distance == null) return -1
        return a.distance - b.distance
      })
    }

    return NextResponse.json({
      success: true,
      data: { stations, count: stations.length, fromStrapi },
    })
  } catch (error) {
    console.error('EV chargers API hatası:', error)
    return NextResponse.json({ success: false, error: 'Şarj istasyonları yüklenemedi' }, { status: 500 })
  }
}

// Haversine formülü ile mesafe hesaplama (km)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Dünya yarıçapı (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
