import { NextRequest, NextResponse } from 'next/server'

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api'

export async function POST(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!jwt) {
      return NextResponse.json({ success: false, error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const body = await request.json()
    const { serviceId, vehicleId, appointmentDate, appointmentTime, notes, campaignId } = body

    if (!serviceId || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { success: false, error: 'serviceId, appointmentDate ve appointmentTime zorunludur' },
        { status: 400 }
      )
    }

    const appointmentBody: Record<string, unknown> = {
      data: {
        service: serviceId,
        ...(vehicleId ? { vehicle: vehicleId } : {}),
        appointmentDate,
        appointmentTime,
        ...(notes ? { notes } : {}),
        ...(campaignId ? { campaign_id: campaignId } : {}),
      },
    }

    const response = await fetch(`${STRAPI}/appointments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentBody),
    })

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Randevu oluşturulamadı' },
        { status: response.status }
      )
    }

    const appointmentId = result?.data?.id ?? result?.id
    return NextResponse.json({ success: true, data: { id: appointmentId } }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
