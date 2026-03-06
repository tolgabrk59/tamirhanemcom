import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const STRAPI_URL = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

interface AnalysisEntry {
  id: number
  brand: string
  model: string
  year: number
  summary: string
  image_url: string
  estimated_prices: {
    market_min: string
    market_max: string
    average: string
  } | null
  specs: {
    engine: string
    horsepower: string
    fuel_economy: string
    transmission: string
  } | null
  pros: string[]
  cons: string[]
  safety: {
    euro_ncap_stars: number
  } | null
  fuel_cost: {
    fuel_type: string
    average_consumption: number
  } | null
  updatedAt: string
}

interface StrapiAnalysisData {
  summary?: string
  image_url?: string
  estimated_prices?: {
    market_min: string
    market_max: string
    average: string
  }
  specs?: {
    engine?: string
    horsepower?: string
    fuel_economy?: string
    transmission?: string
  }
  pros?: string[]
  cons?: string[]
  safety?: {
    euro_ncap_stars?: number
  }
  fuel_cost?: {
    fuel_type?: string
    average_consumption?: number
  }
}

interface StrapiAnalysisAttributes {
  brand?: string
  model?: string
  year?: number
  data?: StrapiAnalysisData | null
  updatedAt?: string
  createdAt?: string
  attributes?: StrapiAnalysisAttributes
}

interface StrapiAnalysisEntry {
  id: number
  attributes?: StrapiAnalysisAttributes
  brand?: string
  model?: string
  year?: number
  data?: StrapiAnalysisData | null
  updatedAt?: string
  createdAt?: string
}

function getStrapiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}
  if (STRAPI_TOKEN) headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`
  return headers
}

function mapStrapiEntry(entry: StrapiAnalysisEntry): AnalysisEntry | null {
  const attrs: StrapiAnalysisAttributes = entry.attributes || entry
  const data: StrapiAnalysisData | null | undefined = attrs.data

  if (!data || !attrs.brand || !attrs.model) return null

  return {
    id: Number(entry.id),
    brand: String(attrs.brand),
    model: String(attrs.model),
    year: Number(attrs.year),
    summary: data.summary || '',
    image_url: data.image_url || '',
    estimated_prices: data.estimated_prices || null,
    specs: data.specs
      ? {
          engine: data.specs.engine || '',
          horsepower: data.specs.horsepower || '',
          fuel_economy: data.specs.fuel_economy || '',
          transmission: data.specs.transmission || '',
        }
      : null,
    pros: Array.isArray(data.pros) ? data.pros : [],
    cons: Array.isArray(data.cons) ? data.cons : [],
    safety: data.safety?.euro_ncap_stars != null
      ? { euro_ncap_stars: Number(data.safety.euro_ncap_stars) }
      : null,
    fuel_cost: data.fuel_cost
      ? {
          fuel_type: data.fuel_cost.fuel_type || '',
          average_consumption: Number(data.fuel_cost.average_consumption) || 0,
        }
      : null,
    updatedAt: String(attrs.updatedAt || attrs.createdAt || ''),
  }
}

export async function GET() {
  try {
    const res = await fetch(
      `${STRAPI_URL}/vehicle-analyses?pagination[pageSize]=100&sort=updatedAt:desc&populate=*`,
      { cache: 'no-store', headers: getStrapiHeaders() }
    )

    if (!res.ok) {
      const errText = await res.text()
      console.warn('[Analyses] Strapi hatası:', res.status, errText.substring(0, 200))
      return NextResponse.json({ data: [], total: 0 })
    }

    const result: { data?: StrapiAnalysisEntry[] } = await res.json()
    const raw: StrapiAnalysisEntry[] = result.data || []

    const analyses: AnalysisEntry[] = []
    for (const entry of raw) {
      const mapped = mapStrapiEntry(entry)
      if (mapped) analyses.push(mapped)
    }

    return NextResponse.json({ data: analyses, total: analyses.length })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Bilinmeyen hata'
    console.error('[Analyses] Hata:', msg)
    return NextResponse.json({ error: `Analizler yüklenemedi: ${msg}` }, { status: 500 })
  }
}
