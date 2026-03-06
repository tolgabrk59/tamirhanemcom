const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`
  }
  return headers
}

export async function strapiGet<T>(
  endpoint: string,
  params?: Record<string, string>,
  revalidate = 3600
): Promise<T> {
  const url = new URL(`${STRAPI_API}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  const res = await fetch(url.toString(), {
    headers: getHeaders(),
    next: { revalidate },
  })

  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function getCategories() {
  return strapiGet('/categories', {
    'pagination[pageSize]': '50',
    'sort': 'name:asc',
  })
}

export async function getServices(params?: Record<string, string>) {
  return strapiGet('/services', {
    'populate[0]': 'ProfilePicture',
    'populate[1]': 'categories',
    'populate[2]': 'supported_vehicles',
    'populate[3]': 'working_hours',
    'pagination[pageSize]': '100',
    'sort': 'rating:desc',
    ...params,
  })
}

export async function getBrands(vehicleType = 'otomobil') {
  return strapiGet('/arac-dataveris', {
    'fields[0]': 'brand',
    'pagination[pageSize]': '100000',
    ...(vehicleType === 'motorsiklet' ? { 'filters[type][$eq]': 'motorsiklet' } : {}),
  })
}

export async function getVehicleAnalysis(brand: string, model: string, year: number) {
  return strapiGet('/vehicle-analyses', {
    'filters[brand][$eq]': brand,
    'filters[model][$eq]': model,
    'filters[year][$eq]': year.toString(),
  })
}
