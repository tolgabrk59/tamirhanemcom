import { NextResponse } from 'next/server'

const STRAPI_API_URL = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

export const dynamic = 'force-dynamic'

const ACTIVE_STATUSES = [
  'Tarih Belirlendi', 'Ön Onaylı', 'Beklemede', 'Onaylandı',
  'İşlem Başladı', 'Araç Hazır', 'Ödeme Bekliyor',
]

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!STRAPI_TOKEN) {
      return NextResponse.json({ success: false, error: 'API token yok' }, { status: 500 })
    }

    const url = `${STRAPI_API_URL}/appointments?filters[service][id][$eq]=${params.id}`

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ success: false, error: 'Randevular alınamadı' }, { status: 500 })
    }

    const strapiData = await response.json()
    const items: any[] = strapiData.data || []

    // Aktif randevulardan dolu slotları çıkar
    const busyMap: Record<string, string[]> = {}

    for (const appt of items) {
      if (!ACTIVE_STATUSES.includes(appt.status)) continue

      const slots: { date: string; timeSlot: string }[] = []

      if (Array.isArray(appt.matchedDate)) {
        slots.push(...appt.matchedDate)
      } else if (appt.offerDate?.date) {
        slots.push(appt.offerDate)
      }

      for (const slot of slots) {
        if (!slot?.date) continue
        if (!busyMap[slot.date]) busyMap[slot.date] = []
        if (slot.timeSlot && !busyMap[slot.date].includes(slot.timeSlot)) {
          busyMap[slot.date].push(slot.timeSlot)
        }
      }
    }

    return NextResponse.json({ success: true, data: busyMap })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Randevular yüklenemedi' }, { status: 500 })
  }
}
