import { NextResponse } from 'next/server'
import { cachedFetch } from '@/lib/cache/cache-manager'
import { CACHE_KEYS, buildKey } from '@/lib/cache/keys'

export const dynamic = 'force-dynamic'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.com/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

function normalizeTurkish(str: string): string {
  if (!str) return ''
  return str
    .replace(/İ/gi, 'i')
    .replace(/I/gi, 'i')
    .replace(/Ş/gi, 's')
    .replace(/ş/gi, 's')
    .replace(/Ğ/gi, 'g')
    .replace(/ğ/gi, 'g')
    .replace(/Ü/gi, 'u')
    .replace(/ü/gi, 'u')
    .replace(/Ö/gi, 'o')
    .replace(/ö/gi, 'o')
    .replace(/Ç/gi, 'c')
    .replace(/ç/gi, 'c')
    .replace(/ı/gi, 'i')
    .toLowerCase()
}

// ─── Strapi Service Interfaces ────────────────────
interface StrapiImageAttributes {
  url?: string
}

interface StrapiImageEntry {
  id?: number
  attributes?: StrapiImageAttributes
  url?: string
}

interface StrapiImageRelation {
  data?: StrapiImageEntry | StrapiImageEntry[] | null
  attributes?: StrapiImageAttributes
  url?: string
}

type StrapiImageField = StrapiImageRelation | string | null | undefined

interface StrapiCategoryAttributes {
  name?: string
}

interface StrapiCategoryEntry {
  id?: number
  attributes?: StrapiCategoryAttributes
  name?: string
  data?: { id?: number }
}

interface StrapiCampaignAttributes {
  title?: string
  description?: string
  discount_percentage?: number | null
  end_date?: string | null
  campaign_code?: string | null
  is_active?: boolean
}

interface StrapiCampaignEntry {
  id?: number
  attributes?: StrapiCampaignAttributes
  title?: string
  description?: string
  discount_percentage?: number | null
  end_date?: string | null
  campaign_code?: string | null
  is_active?: boolean
}

interface StrapiServiceAttributes {
  name?: string
  location?: string
  description?: string
  rating?: number | null
  rating_count?: number | null
  ratingCount?: number | null
  latitude?: string | null
  longitude?: string | null
  phone?: string | null
  ProfilePicture?: StrapiImageField
  pic?: StrapiImageField
  image?: StrapiImageField
  is_official_service?: boolean
  isOfficialService?: boolean
  provides_roadside_assistance?: boolean
  providesRoadsideAssistance?: boolean
  address?: string
  working_hours?: unknown
  workingHours?: unknown
  car_wash_pricing?: unknown
  carWashPricing?: unknown
  Car_wash_pricing?: unknown
  discount?: number | null
  discount_percentage?: number | null
  discountPercentage?: number | null
  has_discount?: boolean
  hasDiscount?: boolean
  discount_description?: string | null
  discountDescription?: string | null
  supports_all_vehicles?: boolean
  supported_vehicles?: unknown
  supportedVehicles?: unknown
  categories?: {
    data?: StrapiCategoryEntry[]
  } | StrapiCategoryEntry[]
  campaigns?: {
    data?: StrapiCampaignEntry[]
  } | StrapiCampaignEntry[]
}

interface StrapiServiceEntry {
  id: number
  attributes?: StrapiServiceAttributes
  name?: string
  location?: string
  description?: string
  rating?: number | null
  rating_count?: number | null
  ratingCount?: number | null
  latitude?: string | null
  longitude?: string | null
  phone?: string | null
  ProfilePicture?: StrapiImageField
  pic?: StrapiImageField
  image?: StrapiImageField
  is_official_service?: boolean
  isOfficialService?: boolean
  provides_roadside_assistance?: boolean
  providesRoadsideAssistance?: boolean
  address?: string
  working_hours?: unknown
  workingHours?: unknown
  car_wash_pricing?: unknown
  carWashPricing?: unknown
  Car_wash_pricing?: unknown
  discount?: number | null
  discount_percentage?: number | null
  discountPercentage?: number | null
  has_discount?: boolean
  hasDiscount?: boolean
  discount_description?: string | null
  discountDescription?: string | null
  supports_all_vehicles?: boolean
  supported_vehicles?: unknown
  supportedVehicles?: unknown
  categories?: {
    data?: StrapiCategoryEntry[]
  } | StrapiCategoryEntry[]
  campaigns?: {
    data?: StrapiCampaignEntry[]
  } | StrapiCampaignEntry[]
}

function getServiceImageUrl(image: StrapiImageField): string | null {
  if (!image) return null
  const baseUrl = STRAPI_API.replace(/\/api$/, '')

  if (typeof image === 'string') {
    if (image.startsWith('http')) return image
    if (image.startsWith('/')) return `${baseUrl}${image}`
    return image
  }

  if (image.data) {
    if (Array.isArray(image.data) && image.data.length > 0) {
      const url = image.data[0]?.attributes?.url
      if (url) return url.startsWith('http') ? url : `${baseUrl}${url}`
    }
    if (!Array.isArray(image.data) && image.data?.attributes?.url) {
      const url = image.data.attributes.url
      return url.startsWith('http') ? url : `${baseUrl}${url}`
    }
  }

  if (image.attributes?.url) {
    const url = image.attributes.url
    return url.startsWith('http') ? url : `${baseUrl}${url}`
  }

  if (image.url) {
    return image.url.startsWith('http') ? image.url : `${baseUrl}${image.url}`
  }

  return null
}

function getCategoryEntries(attr: StrapiServiceAttributes): StrapiCategoryEntry[] {
  const cats = attr.categories
  if (!cats) return []
  if (Array.isArray(cats)) return cats
  return cats.data || []
}

function getCampaignEntries(attr: StrapiServiceAttributes): StrapiCampaignEntry[] {
  const camps = attr.campaigns
  if (!camps) return []
  if (Array.isArray(camps)) return camps
  return camps.data || []
}

// categoryType → anahtar kelime eşleştirme (Strapi'de category_type boş olduğunda fallback)
const CATEGORY_TYPE_KEYWORDS: Record<string, string[]> = {
  car_wash: ['yikama', 'yıkama', 'cila', 'kaplama', 'detay', 'temizlik', 'pasta', 'seramik', 'boya koruma', 'wash'],
  roadside: ['yol yardim', 'yol yardım', 'cekici', 'çekici', 'kurtarma', 'oto kurtarma'],
  car_rental: ['kiralama', 'rent', 'rental'],
  insurance: ['sigorta', 'kasko', 'trafik sigortasi'],
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')
    const category = searchParams.get('category')
    const categoriesParam = searchParams.get('categories')
    const categoryType = searchParams.get('categoryType')
    const city = searchParams.get('city')
    const district = searchParams.get('district')
    const q = searchParams.get('q')

    // Tüm servisleri Redis'ten veya Strapi'den çek (filtreleme sonra yapılır)
    const cacheKey = buildKey(CACHE_KEYS.services, 'all')
    const allServices = await cachedFetch(cacheKey, async () => {
      const url = `${STRAPI_API}/services?populate[0]=ProfilePicture&populate[1]=categories&populate[2]=supported_vehicles&populate[3]=working_hours.monday&populate[4]=working_hours.tuesday&populate[5]=working_hours.wednesday&populate[6]=working_hours.thursday&populate[7]=working_hours.friday&populate[8]=working_hours.saturday&populate[9]=working_hours.sunday&populate[10]=campaigns&populate[11]=campaigns.campaign_image&pagination[pageSize]=100&sort=rating:desc`

      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (STRAPI_TOKEN) {
        headers['Authorization'] = 'Bearer ' + STRAPI_TOKEN
      }

      const response = await fetch(url, { cache: 'no-store', headers })
      if (!response.ok) {
        throw new Error('Strapi API erişim hatası')
      }

      const json: { data?: StrapiServiceEntry[] } = await response.json()
      return (json.data || []) as StrapiServiceEntry[]
    }, CACHE_KEYS.services)

    let services: StrapiServiceEntry[] = [...allServices]

    services = services.filter((service: StrapiServiceEntry) => {
      const attr: StrapiServiceAttributes = service.attributes || service

      // Text search (q parameter)
      if (q) {
        const normalizedQ = normalizeTurkish(q)
        const nameMatch = normalizeTurkish(attr.name || '').includes(normalizedQ)
        const locationMatch = normalizeTurkish(attr.location || '').includes(normalizedQ)
        const descMatch = normalizeTurkish(attr.description || '').includes(normalizedQ)
        const catMatch = getCategoryEntries(attr).some((c: StrapiCategoryEntry) =>
          normalizeTurkish(c.attributes?.name || c.name || '').includes(normalizedQ)
        )
        if (!nameMatch && !locationMatch && !descMatch && !catMatch) return false
      }

      // Location filter
      if (city && attr.location !== city) {
        if (!normalizeTurkish(attr.location || '').includes(normalizeTurkish(city))) {
          return false
        }
      }

      if (district && !normalizeTurkish(attr.location || '').includes(normalizeTurkish(district))) {
        return false
      }

      // Category filter - tek kategori adı
      if (category) {
        const cats = getCategoryEntries(attr)
        const hasCat = cats.some((c: StrapiCategoryEntry) =>
          String(c.id || c.data?.id) === String(category) ||
          normalizeTurkish(c.attributes?.name || c.name || '').includes(normalizeTurkish(category))
        )
        if (!hasCat) return false
      }

      // Categories filter - birden fazla kategori adı (virgülle ayrılmış, herhangi biri eşleşmeli)
      if (categoriesParam) {
        const categoryList = categoriesParam.split(',').map((c) => normalizeTurkish(c.trim()))
        const cats = getCategoryEntries(attr)
        const hasAnyCat = cats.some((c: StrapiCategoryEntry) => {
          const catName = normalizeTurkish(c.attributes?.name || c.name || '')
          return categoryList.some((filterCat) => catName.includes(filterCat))
        })
        if (!hasAnyCat) return false
      }

      // categoryType filter - client tarafında kategori adları bulunamadığında fallback
      if (categoryType && !category && !categoriesParam) {
        const keywords = CATEGORY_TYPE_KEYWORDS[categoryType]
        if (keywords) {
          const cats = getCategoryEntries(attr)
          const hasMatchingCat = cats.some((c: StrapiCategoryEntry) => {
            const catName = normalizeTurkish(c.attributes?.name || c.name || '')
            return keywords.some((kw) => catName.includes(normalizeTurkish(kw)))
          })
          if (!hasMatchingCat) return false
        }
      }

      // Brand/Model filter
      if (brand) {
        if (attr.supports_all_vehicles === true) {
          // Accept
        } else {
          const supportedData = attr.supported_vehicles || attr.supportedVehicles
          const strData = JSON.stringify(supportedData || '')
          if (!strData.includes(brand)) return false
          if (model && !strData.includes(model)) return false
        }
      }

      return true
    })

    const formattedServices = services.map((service: StrapiServiceEntry) => {
      const attrs: StrapiServiceAttributes = service.attributes || service
      const categoryNames = getCategoryEntries(attrs)
        .map((c: StrapiCategoryEntry) => c.attributes?.name || c.name || '')
        .filter(Boolean)

      return {
        id: service.id,
        name: attrs.name || '',
        location: attrs.location || '',
        rating: attrs.rating || null,
        rating_count: attrs.rating_count || attrs.ratingCount || null,
        latitude: attrs.latitude ? parseFloat(attrs.latitude) : null,
        longitude: attrs.longitude ? parseFloat(attrs.longitude) : null,
        phone: attrs.phone || null,
        pic: getServiceImageUrl(attrs.ProfilePicture || attrs.pic || attrs.image),
        is_official_service: attrs.is_official_service || attrs.isOfficialService || false,
        provides_roadside_assistance: attrs.provides_roadside_assistance || attrs.providesRoadsideAssistance || false,
        categories: categoryNames,
        description: attrs.description || '',
        address: attrs.address || attrs.location || '',
        working_hours: attrs.working_hours || attrs.workingHours || null,
        car_wash_pricing: attrs.car_wash_pricing || attrs.carWashPricing || attrs.Car_wash_pricing || null,
        discount: typeof attrs.discount === 'number' ? attrs.discount : (typeof attrs.discount_percentage === 'number' ? attrs.discount_percentage : (typeof attrs.discountPercentage === 'number' ? attrs.discountPercentage : null)),
        has_discount: attrs.has_discount || attrs.hasDiscount || false,
        discount_description: attrs.discount_description || attrs.discountDescription || null,
        campaigns: getCampaignEntries(attrs).filter((c: StrapiCampaignEntry) => {
          const ca: StrapiCampaignAttributes = c.attributes || c
          return ca.is_active !== false
        }).map((c: StrapiCampaignEntry) => {
          const ca: StrapiCampaignAttributes = c.attributes || c
          return {
            id: c.id,
            title: ca.title || '',
            description: ca.description || '',
            discount_percentage: ca.discount_percentage || null,
            end_date: ca.end_date || null,
            campaign_code: ca.campaign_code || null,
          }
        }),
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedServices,
      count: formattedServices.length,
    })
  } catch (error: unknown) {
    console.error('Strapi API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Servisler yüklenemedi' },
      { status: 500 }
    )
  }
}
