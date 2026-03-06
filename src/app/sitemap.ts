import { MetadataRoute } from 'next'

const STRAPI_API = 'https://api.tamirhanem.com/api'

// OBD kodlarını Strapi'den çek
async function getObdCodes(): Promise<string[]> {
  try {
    const response = await fetch(`${STRAPI_API}/obd-codes?pagination[pageSize]=500&fields[0]=code`, {
      next: { revalidate: 86400 } // 24 saat cache
    })
    if (!response.ok) return []
    const data = await response.json()
    return (data.data || []).map((item: any) => item.attributes?.code || item.code).filter(Boolean)
  } catch {
    return []
  }
}

// Karşılaştırma sayfalarını çek (eğer varsa)
async function getComparisonSlugs(): Promise<string[]> {
  try {
    const response = await fetch(`${STRAPI_API}/karsilastirmalar?pagination[pageSize]=100&fields[0]=slug`, {
      next: { revalidate: 86400 }
    })
    if (!response.ok) return []
    const data = await response.json()
    return (data.data || []).map((item: any) => item.attributes?.slug || item.slug).filter(Boolean)
  } catch {
    return []
  }
}

// İnceleme sayfalarını çek
async function getReviewIds(): Promise<number[]> {
  try {
    const response = await fetch(`${STRAPI_API}/incelemelers?pagination[pageSize]=100&fields[0]=id`, {
      next: { revalidate: 86400 }
    })
    if (!response.ok) return []
    const data = await response.json()
    return (data.data || []).map((item: any) => item.id).filter(Boolean)
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || 'https://tamirhanem.com'
  const currentDate = new Date()

  // Dinamik verileri paralel olarak çek
  const [obdCodes, comparisonSlugs, reviewIds] = await Promise.all([
    getObdCodes(),
    getComparisonSlugs(),
    getReviewIds()
  ])

  // ==================== ANA SAYFALAR ====================
  const mainPages: MetadataRoute.Sitemap = [
    // Ana sayfa
    { url: baseUrl, lastModified: currentDate, changeFrequency: 'daily', priority: 1 },

    // Yüksek öncelikli servis sayfaları
    { url: `${baseUrl}/servisler`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/servisler/sonuclar`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/fiyat-hesapla`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/randevu-al`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },

    // Araç araştırma sayfaları
    { url: `${baseUrl}/obd`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/kronik-sorunlar`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/geri-cagrima`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/ariza-rehberi`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/belirtiler`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/ariza-bul`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },

    // Araç değerleme ve karşılaştırma
    { url: `${baseUrl}/arac-degeri`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/karsilastirma`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/karsilastirma/olustur`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/guvenilirlik`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/incelemeler`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },

    // Elektrikli araç ve lastik
    { url: `${baseUrl}/sarj-istasyonlari`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/lastikler`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/bakim-takvimi`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },

    // AI araçları
    { url: `${baseUrl}/ai/ariza-tespit`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/ai/sohbet`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },

    // Blog ve içerik
    { url: `${baseUrl}/blog`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.6 },

    // Kurumsal sayfalar
    { url: `${baseUrl}/hakkimizda`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/iletisim`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/sss`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/yardim`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/gizlilik`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/sartlar`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.2 },
  ]

  // ==================== ARAÇ SAYFALARI ====================
  const aracPages: MetadataRoute.Sitemap = [
    'genel-bakis',
    'bakim-tavsiyeleri',
    'videolar',
    'analiz',
    'lastik-secimi',
    'ansiklopedi',
    'workshop-kilavuzlari',
    'yedek-parca',
    'ariza-lambalari',
  ].map((page) => ({
    url: `${baseUrl}/arac/${page}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // ==================== ANSİKLOPEDİ SİSTEMLERİ ====================
  const ansiklopediSystems = [
    'motor-sistemi',
    'fren-sistemi',
    'suspansiyon-sistemi',
    'elektrik-sistemi',
    'sogutma-sistemi',
    'yakit-sistemi',
    'egzoz-sistemi',
    'sanziman-sistemi',
  ]

  const ansiklopediPages: MetadataRoute.Sitemap = ansiklopediSystems.map((system) => ({
    url: `${baseUrl}/arac/ansiklopedi/${system}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // Ansiklopedi alt sistemleri (her sistem için popüler alt sistemler)
  const ansiklopediSubsystems: Record<string, string[]> = {
    'motor-sistemi': ['yaglama', 'atesleyici', 'supap', 'piston', 'krank-mili', 'eksantrik'],
    'fren-sistemi': ['disk-fren', 'kampana-fren', 'abs', 'el-freni', 'hidrolik'],
    'suspansiyon-sistemi': ['amortisör', 'helezon-yay', 'rotil', 'salincak', 'viraj-demiri'],
    'elektrik-sistemi': ['aku', 'alternator', 'marş-motoru', 'sigorta', 'kablo-tesisati'],
    'sogutma-sistemi': ['radyator', 'termostat', 'su-pompasi', 'fan', 'antifriz'],
    'yakit-sistemi': ['yakit-pompasi', 'enjektör', 'yakit-filtresi', 'yakit-deposu'],
    'egzoz-sistemi': ['katalitik-konvertör', 'susturucu', 'egzoz-manifoldu', 'lambda-sensoru'],
    'sanziman-sistemi': ['debriyaj', 'vites-kutusu', 'diferansiyel', 'aks', 'kavrama'],
  }

  const subsystemPages: MetadataRoute.Sitemap = []
  for (const [system, subsystems] of Object.entries(ansiklopediSubsystems)) {
    for (const subsystem of subsystems) {
      subsystemPages.push({
        url: `${baseUrl}/arac/ansiklopedi/${system}/${subsystem}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.4,
      })
    }
  }

  // ==================== YEDEK PARÇA KATEGORİLERİ ====================
  const yedekParcaPages: MetadataRoute.Sitemap = [
    'motor',
    'fren',
    'suspansiyon',
    'elektrik',
    'sogutma',
    'yakit',
    'egzoz',
    'sanziman',
  ].map((kategori) => ({
    url: `${baseUrl}/arac/yedek-parca/${kategori}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  }))

  // ==================== ARIZA REHBERİ SAYFALARI ====================
  const arizaRehberiPages: MetadataRoute.Sitemap = [
    'check-engine-lambasi',
    'abs-lambasi',
    'airbag-lambasi',
    'yag-lambasi',
    'aku-lambasi',
    'motor-sicakligi',
    'fren-lambasi',
    'direksiyon-lambasi',
  ].map((ariza) => ({
    url: `${baseUrl}/ariza-rehberi/${ariza}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // ==================== DİNAMİK OBD KODLARI ====================
  // Strapi'den çekilen + popüler statik kodlar
  const staticObdCodes = [
    'p0300', 'p0301', 'p0302', 'p0303', 'p0304', // Misfire kodları
    'p0420', 'p0430', // Katalitik konvertör
    'p0171', 'p0172', 'p0174', 'p0175', // Yakıt karışımı
    'p0442', 'p0455', 'p0440', 'p0446', // EVAP sistemi
    'p0128', 'p0125', // Termostat
    'p0401', 'p0402', // EGR
    'p0500', 'p0505', // Hız sensörü / Rölanti
    'p0700', 'p0715', 'p0720', // Şanzıman
    'p0335', 'p0340', // Krank/Kam sensörü
    'p0101', 'p0102', 'p0103', // MAF sensörü
    'p0110', 'p0115', 'p0120', // Sıcaklık/TPS sensörleri
    'p0130', 'p0131', 'p0132', 'p0133', 'p0134', // O2 sensörleri
    'p0200', 'p0201', 'p0202', // Enjektör
    'p0325', 'p0327', // Vuruntu sensörü
    'c0035', 'c0040', 'c0045', 'c0050', // ABS kodları
    'b0001', 'b0002', // Body kodları
    'u0100', 'u0101', // Network kodları
  ]

  // Strapi'den gelen kodları + statik kodları birleştir
  const allObdCodes = [...new Set([...staticObdCodes, ...obdCodes.map(c => c.toLowerCase())])]

  const obdPages: MetadataRoute.Sitemap = allObdCodes.map((code) => ({
    url: `${baseUrl}/obd/${code}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // ==================== DİNAMİK KARŞILAŞTIRMA SAYFALARI ====================
  const comparisonPages: MetadataRoute.Sitemap = comparisonSlugs.map((slug) => ({
    url: `${baseUrl}/karsilastirma/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  // Popüler statik karşılaştırmalar
  const popularComparisons: MetadataRoute.Sitemap = [
    'egea-corolla',
    'golf-focus',
    'passat-camry',
    'civic-corolla',
    'i20-polo',
    'clio-polo',
    'megane-focus',
    'tucson-sportage',
    'rav4-crv',
    'x3-q5',
  ].map((slug) => ({
    url: `${baseUrl}/karsilastirma/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  }))

  // ==================== DİNAMİK İNCELEME SAYFALARI ====================
  const reviewPages: MetadataRoute.Sitemap = reviewIds.map((id) => ({
    url: `${baseUrl}/incelemeler/${id}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  }))

  // ==================== TÜM SAYFALARI BİRLEŞTİR ====================
  return [
    ...mainPages,
    ...aracPages,
    ...ansiklopediPages,
    ...subsystemPages,
    ...yedekParcaPages,
    ...arizaRehberiPages,
    ...obdPages,
    ...comparisonPages,
    ...popularComparisons,
    ...reviewPages,
  ]
}
