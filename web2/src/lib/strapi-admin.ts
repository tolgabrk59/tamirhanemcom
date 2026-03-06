/**
 * Strapi Admin Content-Manager API Client
 *
 * REST API token sadece okuma izni veriyor.
 * Yazma işlemleri (create/update/delete) için admin JWT kullanılır.
 */

const STRAPI_BASE =
  (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim().replace(/\/api$/, '')
const ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD

let cachedToken: string | null = null
let tokenExpiresAt = 0

async function getAdminToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('STRAPI_ADMIN_EMAIL ve STRAPI_ADMIN_PASSWORD env tanımlı değil')
  }

  const res = await fetch(`${STRAPI_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Admin login failed: ${res.status} ${text.substring(0, 200)}`)
  }

  const json = await res.json()
  const token = json.data?.token

  if (!token) {
    throw new Error('Admin login: token bulunamadı')
  }

  cachedToken = token
  // JWT'yi 25 dakika geçerli say (Strapi default: 30 dk)
  tokenExpiresAt = Date.now() + 25 * 60 * 1000

  return token
}

async function adminFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAdminToken()

  const res = await fetch(`${STRAPI_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })

  // Token expired — refresh once and retry
  if (res.status === 401) {
    cachedToken = null
    tokenExpiresAt = 0
    const newToken = await getAdminToken()
    return fetch(`${STRAPI_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
        ...(options.headers || {}),
      },
    })
  }

  return res
}

// ─── Public API ──────────────────────────────────────────────

interface CreateUserPayload {
  username: string
  email: string
  password: string
  phone: string
  confirmed?: boolean
  isWebGuest?: boolean
  role?: number
}

interface CreateVehiclePayload {
  plate: string
  brand?: string
  model?: string
  year?: number
  user?: number
}

export async function createUser(data: CreateUserPayload): Promise<{ id: number; phone: string }> {
  const res = await adminFetch(
    '/content-manager/collection-types/plugin::users-permissions.user',
    {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        confirmed: data.confirmed ?? true,
        blocked: false,
        isWebGuest: data.isWebGuest ?? true,
        role: data.role ?? 1,
      }),
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Kullanıcı oluşturulamadı: ${res.status} ${text.substring(0, 200)}`)
  }

  const user = await res.json()
  if (!user.id) {
    throw new Error('Kullanıcı oluşturulamadı: id yok')
  }

  return { id: user.id, phone: user.phone }
}

export async function createVehicle(
  data: CreateVehiclePayload
): Promise<{ id: number; plate: string }> {
  const res = await adminFetch(
    '/content-manager/collection-types/api::vehicle.vehicle',
    {
      method: 'POST',
      body: JSON.stringify({
        plate: data.plate,
        brand: data.brand || 'BELIRLENECEK',
        model: data.model || '-',
        year: data.year || new Date().getFullYear(),
        user: data.user,
      }),
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Araç oluşturulamadı: ${res.status} ${text.substring(0, 200)}`)
  }

  const vehicle = await res.json()
  if (!vehicle.id) {
    throw new Error('Araç oluşturulamadı: id yok')
  }

  return { id: vehicle.id, plate: vehicle.plate }
}
