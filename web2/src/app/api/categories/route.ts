import { NextResponse } from 'next/server'
import { cachedFetch } from '@/lib/cache/cache-manager'
import { CACHE_KEYS, buildKey } from '@/lib/cache/keys'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.com/api').trim()

interface StrapiCategory {
  id: number
  attributes?: Record<string, unknown>
  name?: string
  description?: string
  category_type?: string
}

interface FormattedCategory {
  id: number
  name: string
  title: string
  description: string
  slug: string
  category_type: string | null
  service_count: number
}

async function fetchCategoriesFromStrapi(): Promise<FormattedCategory[]> {
  const response = await fetch(
    `${STRAPI_API}/categories?pagination[limit]=100&populate[0]=services`,
    { cache: 'no-store' }
  )

  if (!response.ok) {
    throw new Error('Strapi API erişim hatası')
  }

  const json = await response.json()
  const categories = (json.data || []) as StrapiCategory[]

  return categories.map((cat) => {
    const attrs = cat.attributes || cat
    const name = (attrs.name as string) || ''
    const slug = name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Servis sayısını hesapla
    const services = (attrs as Record<string, unknown>).services as { data?: unknown[] } | unknown[] | undefined
    const serviceData = Array.isArray(services) ? services : (services?.data || [])
    const serviceCount = Array.isArray(serviceData) ? serviceData.length : 0

    return {
      id: cat.id,
      name,
      title: name,
      description: (attrs.description as string) || '',
      slug,
      category_type: (attrs.category_type as string) || null,
      service_count: serviceCount,
    }
  })
}

export async function GET() {
  try {
    const cacheKey = buildKey(CACHE_KEYS.categories)
    const formattedCategories = await cachedFetch(
      cacheKey,
      fetchCategoriesFromStrapi,
      CACHE_KEYS.categories
    )

    return NextResponse.json(
      { success: true, data: formattedCategories },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        },
      }
    )
  } catch (error) {
    console.error('Categories API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Kategoriler yüklenemedi' },
      { status: 500 }
    )
  }
}
