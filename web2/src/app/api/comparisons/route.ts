import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const STRAPI_URL = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN
const STRAPI_BASE = STRAPI_URL.replace(/\/api$/, '')
const ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD

function getStrapiHeaders(contentType = false): Record<string, string> {
  const headers: Record<string, string> = {}
  if (STRAPI_TOKEN) headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`
  if (contentType) headers['Content-Type'] = 'application/json'
  return headers
}

// ─── Admin Token Cache ───────────────────────────
let cachedAdminToken: string | null = null
let tokenExpiresAt = 0

async function getAdminToken(): Promise<string | null> {
  if (cachedAdminToken && Date.now() < tokenExpiresAt) return cachedAdminToken
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return null

  try {
    const res = await fetch(`${STRAPI_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    })
    if (!res.ok) return null
    const json = await res.json()
    cachedAdminToken = json.data?.token || null
    tokenExpiresAt = Date.now() + 25 * 60 * 1000
    return cachedAdminToken
  } catch {
    return null
  }
}

// ─── Strapi Comparison Interface ─────────────────
interface ComparisonEntry {
  id: number
  brand1: string
  model1: string
  year1: number
  brand2: string
  model2: string
  year2: number
  createdAt: string
}

// ─── GET: Kıyaslama Listesi ─────────────────────
export async function GET() {
  // Yöntem 1: Public REST API
  try {
    const res = await fetch(
      `${STRAPI_URL}/vehicle-comparisons?sort=createdAt:desc&pagination[pageSize]=100`,
      { cache: 'no-store', headers: getStrapiHeaders() }
    )

    if (res.ok) {
      const json = await res.json()
      const entries = (json.data || []).map((e: Record<string, unknown>) => {
        const attrs = (e.attributes || e) as Record<string, unknown>
        return {
          id: e.id,
          brand1: attrs.brand1,
          model1: attrs.model1,
          year1: attrs.year1,
          brand2: attrs.brand2,
          model2: attrs.model2,
          year2: attrs.year2,
          createdAt: attrs.createdAt,
        }
      })
      return NextResponse.json({ data: entries })
    }
  } catch {
    // REST API henüz aktif değil, admin API dene
  }

  // Yöntem 2: Admin Content-Manager API
  try {
    const token = await getAdminToken()
    if (!token) return NextResponse.json({ data: [] })

    const res = await fetch(
      `${STRAPI_BASE}/content-manager/collection-types/api::vehicle-comparison.vehicle-comparison?sort=createdAt:desc&pageSize=100`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (res.ok) {
      const json = await res.json()
      const results = json.results || json.data || []
      const entries: ComparisonEntry[] = results.map((e: Record<string, unknown>) => ({
        id: e.id,
        brand1: e.brand1,
        model1: e.model1,
        year1: e.year1,
        brand2: e.brand2,
        model2: e.model2,
        year2: e.year2,
        createdAt: e.createdAt,
      }))
      return NextResponse.json({ data: entries })
    }
  } catch {
    // Admin API de başarısız
  }

  return NextResponse.json({ data: [] })
}

// ─── POST: Kıyaslama Kaydet ─────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { brand1, model1, year1, brand2, model2, year2 } = body

    if (!brand1 || !model1 || !year1 || !brand2 || !model2 || !year2) {
      return NextResponse.json({ error: 'Eksik parametreler' }, { status: 400 })
    }

    const payload = {
      brand1: String(brand1).toUpperCase(),
      model1: String(model1).toUpperCase(),
      year1: Number(year1),
      brand2: String(brand2).toUpperCase(),
      model2: String(model2).toUpperCase(),
      year2: Number(year2),
    }

    // Duplikasyon kontrolü: aynı çift zaten var mı?
    const existingCheck = await checkDuplicate(payload)
    if (existingCheck) {
      return NextResponse.json({ data: existingCheck, duplicate: true })
    }

    // Yöntem 1: Public REST API
    try {
      const res = await fetch(`${STRAPI_URL}/vehicle-comparisons`, {
        method: 'POST',
        headers: getStrapiHeaders(true),
        body: JSON.stringify({ data: payload }),
      })

      if (res.ok) {
        const json = await res.json()
        console.log('[Comparisons] ✓ REST API ile kaydedildi')
        return NextResponse.json({ data: json.data })
      }
    } catch {
      // REST API başarısız, admin API dene
    }

    // Yöntem 2: Admin Content-Manager API
    try {
      const token = await getAdminToken()
      if (!token) throw new Error('Admin token alınamadı')

      const res = await fetch(
        `${STRAPI_BASE}/content-manager/collection-types/api::vehicle-comparison.vehicle-comparison`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (res.ok) {
        const json = await res.json()
        console.log('[Comparisons] ✓ Admin API ile kaydedildi')
        return NextResponse.json({ data: json })
      }

      const errText = await res.text()
      console.warn('[Comparisons] Admin API hatası:', res.status, errText.substring(0, 200))
    } catch (err) {
      console.warn('[Comparisons] Kayıt hatası:', err instanceof Error ? err.message : err)
    }

    // Her iki yöntem de başarısız — yine de 200 dön (kayıt opsiyonel)
    console.warn('[Comparisons] ✗ Kayıt yapılamadı, Strapi restart gerekebilir')
    return NextResponse.json({ data: null, warning: 'Kayıt yapılamadı' })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// ─── Duplikasyon Kontrolü ────────────────────────
async function checkDuplicate(payload: {
  brand1: string; model1: string; year1: number
  brand2: string; model2: string; year2: number
}): Promise<ComparisonEntry | null> {
  // Public REST API ile kontrol et
  try {
    const filters = [
      `filters[$or][0][brand1][$eq]=${encodeURIComponent(payload.brand1)}`,
      `filters[$or][0][model1][$eq]=${encodeURIComponent(payload.model1)}`,
      `filters[$or][0][year1][$eq]=${payload.year1}`,
      `filters[$or][0][brand2][$eq]=${encodeURIComponent(payload.brand2)}`,
      `filters[$or][0][model2][$eq]=${encodeURIComponent(payload.model2)}`,
      `filters[$or][0][year2][$eq]=${payload.year2}`,
      // Ters sıra da olabilir
      `filters[$or][1][brand1][$eq]=${encodeURIComponent(payload.brand2)}`,
      `filters[$or][1][model1][$eq]=${encodeURIComponent(payload.model2)}`,
      `filters[$or][1][year1][$eq]=${payload.year2}`,
      `filters[$or][1][brand2][$eq]=${encodeURIComponent(payload.brand1)}`,
      `filters[$or][1][model2][$eq]=${encodeURIComponent(payload.model1)}`,
      `filters[$or][1][year2][$eq]=${payload.year1}`,
    ].join('&')

    const res = await fetch(`${STRAPI_URL}/vehicle-comparisons?${filters}`, {
      cache: 'no-store',
      headers: getStrapiHeaders(),
    })

    if (res.ok) {
      const json = await res.json()
      const entries = json.data || []
      if (entries.length > 0) {
        const e = entries[0]
        const attrs = (e.attributes || e) as Record<string, unknown>
        return {
          id: Number(e.id),
          brand1: String(attrs.brand1),
          model1: String(attrs.model1),
          year1: Number(attrs.year1),
          brand2: String(attrs.brand2),
          model2: String(attrs.model2),
          year2: Number(attrs.year2),
          createdAt: String(attrs.createdAt),
        }
      }
    }
  } catch {
    // Duplikasyon kontrolü başarısız — kayda devam et
  }

  return null
}
