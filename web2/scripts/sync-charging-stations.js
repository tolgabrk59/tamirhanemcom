/**
 * Aylık Şarj İstasyonu Sync Script
 * 
 * Kullanım:
 * node scripts/sync-charging-stations.js
 * 
 * PM2 ile cron (her ayın 1'i saat 03:00):
 * pm2 start scripts/sync-charging-stations.js --name charging-sync --cron "0 3 1 * *"
 */

const https = require('https')

const STRAPI_API_URL = 'https://api.tamirhanem.net/api'
const STRAPI_API_TOKEN = '540f117558fc18755aaf9d668122b6155aa80cfd59377f718c4fbf5fcfc450f95e477d98b331148f36ab17453263859557eb4c1fa54a7fbe320a67849b9a35c4'
const SERPER_API_KEY = 'c54a2c0b18f493218783bd24abef63aceb9c1b18'

// Türkiye'nin tüm il ve ilçeleri
const TURKEY_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
  'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
  'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale',
  'Kırklareli', 'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye',
  'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak',
  'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat',
  'Zonguldak'
]

// HTTP POST helper
function postRequest(url, data, token = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }

    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(body))
        } catch (e) {
          resolve({ raw: body })
        }
      })
    })

    req.on('error', reject)
    req.write(JSON.stringify(data))
    req.end()
  })
}

// HTTP GET helper
function getRequest(url, token = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }

    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(body))
        } catch (e) {
          resolve({ raw: body })
        }
      })
    })

    req.on('error', reject)
    req.end()
  })
}

// Serper'den şarj istasyonu ara
async function searchFromSerper(city, district = '') {
  try {
    const query = district 
      ? `${district} ${city} elektrikli araç şarj istasyonu`
      : `${city} elektrikli araç şarj istasyonu`

    const result = await postRequest(
      'https://google.serper.dev/places',
      { q: query, num: 20 },
      SERPER_API_KEY
    )

    return (result.places || []).map((place, index) => ({
      externalId: place.id || `serper-${city}-${district}-${index}`,
      name: place.title || 'Şarj İstasyonu',
      address: place.address || '',
      city,
      district: district || '',
      latitude: place.latitude?.toString() || null,
      longitude: place.longitude?.toString() || null,
      rating: place.rating || null,
      reviewCount: place.reviewCount || 0,
      phone: place.phoneNumber || null,
      website: place.website || null,
    }))
  } catch (error) {
    console.error(`Serper hatası (${city}${district ? ' ' + district : ''}):`, error.message)
    return []
  }
}

// Strapi'de var mı kontrol et
async function existsInStrapi(externalId) {
  try {
    const result = await getRequest(
      `${STRAPI_API_URL}/sarj-istasyonlari?filters[externalId][$eq]=${encodeURIComponent(externalId)}`,
      STRAPI_API_TOKEN
    )
    return result.data?.length > 0
  } catch (e) {
    return false
  }
}

// Strapi'ye kaydet
async function saveToStrapi(station) {
  try {
    await postRequest(
      `${STRAPI_API_URL}/sarj-istasyonlari`,
      {
        data: {
          externalId: station.externalId,
          name: station.name,
          address: station.address,
          city: station.city,
          district: station.district,
          latitude: station.latitude,
          longitude: station.longitude,
          source: 'serper-sync',
        },
      },
      STRAPI_API_TOKEN
    )
    console.log(`  ✓ Kaydedildi: ${station.name}`)
    return true
  } catch (e) {
    console.error(`  ✗ Kaydetme hatası: ${station.name}`, e.message)
    return false
  }
}

// Ana sync fonksiyonu
async function syncChargingStations() {
  console.log('🔌 Şarj İstasyonu Sync Başlatıldı')
  console.log('=' .repeat(50))
  
  const startTime = Date.now()
  let totalFound = 0
  let totalSaved = 0

  // Her il için sync
  for (const city of TURKEY_CITIES) {
    console.log(`\n📍 ${city} aranıyor...`)
    
    // İl genelinde ara
    const stations = await searchFromSerper(city)
    totalFound += stations.length
    console.log(`  Bulunan: ${stations.length} istasyon`)

    // Yeni olanları Strapi'ye ekle
    for (const station of stations) {
      const exists = await existsInStrapi(station.externalId)
      if (!exists) {
        await saveToStrapi(station)
        totalSaved++
        // Rate limit için bekle
        await new Promise(r => setTimeout(r, 200))
      }
    }

    // Rate limit için bekle (Serper: 100 req/min)
    await new Promise(r => setTimeout(r, 1000))
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log('\n' + '='.repeat(50))
  console.log(`✅ Sync Tamamlandı!`)
  console.log(`   Süre: ${duration}s`)
  console.log(`   Toplam Bulunan: ${totalFound}`)
  console.log(`   Yeni Eklenen: ${totalSaved}`)
}

// Hata yakalama ile çalıştır
syncChargingStations().catch(err => {
  console.error('Sync hatası:', err)
  process.exit(1)
})
