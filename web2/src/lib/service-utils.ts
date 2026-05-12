'use client'

// =====================
// WORKING HOURS
// =====================

interface DayHours {
  open: string
  close: string
  closed?: boolean
}

interface WorkingHours {
  monday?: DayHours
  tuesday?: DayHours
  wednesday?: DayHours
  thursday?: DayHours
  friday?: DayHours
  saturday?: DayHours
  sunday?: DayHours
  [key: string]: DayHours | undefined
}

const DAY_NAMES: { [key: number]: string } = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
}

const DAY_NAMES_TR_SHORT: { [key: string]: string } = {
  sunday: 'Paz',
  monday: 'Pzt',
  tuesday: 'Sal',
  wednesday: 'Çar',
  thursday: 'Per',
  friday: 'Cum',
  saturday: 'Cmt',
}

function normalizeTimeFormat(time: string | null | undefined): string {
  if (!time) return '09:00'
  if (/^\d{2}:\d{2}$/.test(time)) return time
  const match = time.match(/^(\d{2}):(\d{2})/)
  if (match) return `${match[1]}:${match[2]}`
  return '09:00'
}

export function parseWorkingHours(workingHours: any): WorkingHours | null {
  if (!workingHours) return null

  let parsed: any = workingHours
  if (typeof workingHours === 'string') {
    try {
      parsed = JSON.parse(workingHours)
    } catch {
      return null
    }
  }

  const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const hasValidDays = validDays.some((day) => day in parsed && parsed[day])
  if (!hasValidDays) return null

  const normalizedHours: WorkingHours = {}
  for (const day of validDays) {
    if (parsed[day]) {
      const dayData = parsed[day]
      normalizedHours[day] = {
        open: normalizeTimeFormat(dayData.open),
        close: normalizeTimeFormat(dayData.close),
        closed: dayData.closed ?? false,
      }
    }
  }

  return normalizedHours
}

function findNextOpenDay(hours: WorkingHours, currentDayIndex: number): string {
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDayIndex + i) % 7
    const dayName = DAY_NAMES[nextDayIndex]
    const dayHours = hours[dayName]
    if (dayHours && !dayHours.closed && dayHours.open) {
      const dayShort = DAY_NAMES_TR_SHORT[dayName]
      return `${dayHours.open} ${dayShort}`
    }
  }
  return '09:00 Pzt'
}

export function isServiceOpen(workingHours: any): {
  isOpen: boolean
  nextTime: string | null
  closingTime: string | null
} {
  const hours = parseWorkingHours(workingHours)

  if (!hours) {
    const now = new Date()
    const currentHour = now.getHours()
    const dayOfWeek = now.getDay()

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { isOpen: false, nextTime: '08:30 Pzt', closingTime: null }
    }
    if (currentHour >= 8 && currentHour < 18) {
      return { isOpen: true, nextTime: null, closingTime: '18:00' }
    }
    return { isOpen: false, nextTime: '08:30', closingTime: null }
  }

  const now = new Date()
  const currentDay = DAY_NAMES[now.getDay()]
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const todayHours = hours[currentDay]

  if (!todayHours || todayHours.closed) {
    const nextOpen = findNextOpenDay(hours, now.getDay())
    return { isOpen: false, nextTime: nextOpen, closingTime: null }
  }

  const { open, close } = todayHours
  if (currentTime >= open && currentTime < close) {
    return { isOpen: true, nextTime: null, closingTime: close }
  } else if (currentTime < open) {
    return { isOpen: false, nextTime: open, closingTime: null }
  }

  const nextOpen = findNextOpenDay(hours, now.getDay())
  return { isOpen: false, nextTime: nextOpen, closingTime: null }
}

// =====================
// DISTANCE
// =====================

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

// =====================
// FAVORITES
// =====================

const FAVORITES_KEY = 'tamirhanem_favorite_services'

export function getFavorites(): number[] {
  if (typeof window === 'undefined') return []
  try {
    const saved = localStorage.getItem(FAVORITES_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function isFavorite(serviceId: number): boolean {
  return getFavorites().includes(serviceId)
}

export function toggleFavorite(serviceId: number): boolean {
  const favorites = getFavorites()
  const index = favorites.indexOf(serviceId)
  if (index > -1) {
    favorites.splice(index, 1)
  } else {
    favorites.push(serviceId)
  }
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  } catch {
    // Silent fail
  }
  return index === -1
}
