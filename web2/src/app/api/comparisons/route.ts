import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const STRAPI_URL = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN
const STRAPI_BASE = STRAPI_URL.replace(/\/api$/, '')
const ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD

function getStrapiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  if (STRAPI_TOKEN) headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`
  return headers
}

// ─── Admin Token Cache ───────────────────────────
let cachedAdminToken: string | null = null
let tokenExpiresAt = 0

interface AdminLoginResponse {
  data?: {
    token?: string
  }
}

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
    const json: AdminLoginResponse = await res.json()
    cachedAdminToken = json.data?.token || null
    tokenExpiresAt = Date.now() + 25 * 60 * 1000
    return cachedAdminToken
  } catch {
    return null
  }
}

// ─── Strapi Comparison Interfaces ────────────────
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

interface StrapiComparisonAttributes {
  brand1?: string
  model1?: string
  year1?: number
  brand2?: string
  model2?: string
  year2?: number
  createdAt?: string
}

interface StrapiComparisonEntry {
  id: number
  attributes?: StrapiComparisonAttributes
  brand1?: string
  model1?: string
  year1?: number
  brand2?: string
  model2?: string
  year2?: number
  createdAt?: string
}

interface StrapiComparisonListResponse {
  data?: StrapiComparisonEntry[]
}

interface StrapiAdminComparisonListResponse {
  results?: StrapiComparisonEntry[]
  data?: StrapiComparisonEntry[]
}

// ─── Tüm kayıtları al (REST veya Admin API) ─────
async function fetchAllComparisons(): Promise<ComparisonEntry[]> {
  // Yöntem 1: REST API (token ile)
  try {
    const res = await fetch(
      `${STRAPI_URL}/vehicle-comparisons?sort=createdAt:desc&pagination[pageSize]=100&fields[0]=brand1&fields[1]=model1&fields[2]=year1&fields[3]=brand2&fields[4]=model2&fields[5]=year2&fields[6]=createdAt`,
      { cache: 'no-store', headers: getStrapiHeaders() }
    )

    if (res.ok) {
      const json: StrapiComparisonListResponse = await res.json()
      const raw: StrapiComparisonEntry[] = json.data || []
      if (Array.isArray(raw) && raw.length >= 0) {
        return raw.map((e: StrapiComparisonEntry) => {
          const attrs: StrapiComparisonAttributes = e.attributes || e
          return {
            id: Number(e.id),
            brand1: String(attrs.brand1 || ''),
            model1: String(attrs.model1 || ''),
            year1: Number(attrs.year1 || 0),
            brand2: String(attrs.brand2 || ''),
            model2: String(attrs.model2 || ''),
            year2: Number(attrs.year2 || 0),
            createdAt: String(attrs.createdAt || ''),
          }
        })
      }
    }
  } catch {
    // REST API başarısız
  }

  // Yöntem 2: Admin Content-Manager API
  try {
    const token = await getAdminToken()
    if (!token) return []

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
      const json: StrapiAdminComparisonListResponse = await res.json()
      const results: StrapiComparisonEntry[] = json.results || json.data || []
      return results.map((e: StrapiComparisonEntry) => ({
        id: Number(e.id),
        brand1: String(e.brand1 || ''),
        model1: String(e.model1 || ''),
        year1: Number(e.year1 || 0),
        brand2: String(e.brand2 || ''),
        model2: String(e.model2 || ''),
        year2: Number(e.year2 || 0),
        createdAt: String(e.createdAt || ''),
      }))
    }
  } catch {
    // Admin API de başarısız
  }

  return []
}

// ─── Duplikasyon kontrolü (in-memory) ────────────
function findDuplicate(
  entries: ComparisonEntry[],
  b1: string, m1: string, y1: number,
  b2: string, m2: string, y2: number,
): ComparisonEntry | null {
  return entries.find((e) => {
    const matchForward =
      e.brand1 === b1 && e.model1 === m1 && e.year1 === y1 &&
      e.brand2 === b2 && e.model2 === m2 && e.year2 === y2
    const matchReverse =
      e.brand1 === b2 && e.model1 === m2 && e.year1 === y2 &&
      e.brand2 === b1 && e.model2 === m1 && e.year2 === y1
    return matchForward || matchReverse
  }) ?? null
}

// ─── GET: Kıyaslama Listesi ─────────────────────
export async function GET() {
  const entries = await fetchAllComparisons()
  return NextResponse.json({ data: entries })
}

// ─── POST: Kıyaslama Kaydet ─────────────────────
// NOT: Strapi REST API bu koleksiyon için create yerine find döndürüyor (permission
//      sorunu), yazma işlemleri sadece Admin Content-Manager API ile yapılıyor.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { brand1, model1, year1, brand2, model2, year2 } = body

    if (!brand1 || !model1 || !year1 || !brand2 || !model2 || !year2) {
      return NextResponse.json({ error: 'Eksik parametreler' }, { status: 400 })
    }

    const b1 = String(brand1).toUpperCase()
    const m1 = String(model1).toUpperCase()
    const y1 = Number(year1)
    const b2 = String(brand2).toUpperCase()
    const m2 = String(model2).toUpperCase()
    const y2 = Number(year2)

    // Duplikasyon kontrolü: tüm kayıtları çek, JS'te karşılaştır
    const existing = await fetchAllComparisons()
    const dup = findDuplicate(existing, b1, m1, y1, b2, m2, y2)
    if (dup) {
      return NextResponse.json({ data: dup, duplicate: true })
    }

    // Admin Content-Manager API ile kaydet
    const token = await getAdminToken()
    if (!token) {
      console.warn('[Comparisons] Admin token alınamadı')
      return NextResponse.json({ data: null, warning: 'Kayıt yapılamadı' })
    }

    const res = await fetch(
      `${STRAPI_BASE}/content-manager/collection-types/api::vehicle-comparison.vehicle-comparison`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brand1: b1, model1: m1, year1: y1, brand2: b2, model2: m2, year2: y2 }),
      }
    )

    if (res.ok) {
      const json: StrapiComparisonEntry = await res.json()
      console.log('[Comparisons] ✓ Kaydedildi, id:', json.id)
      return NextResponse.json({
        data: {
          id: json.id,
          brand1: json.brand1,
          model1: json.model1,
          year1: json.year1,
          brand2: json.brand2,
          model2: json.model2,
          year2: json.year2,
          createdAt: json.createdAt,
        },
      })
    }

    const errText = await res.text()
    console.warn('[Comparisons] Admin API hatası:', res.status, errText.substring(0, 200))
    return NextResponse.json({ data: null, warning: 'Kayıt yapılamadı' })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
