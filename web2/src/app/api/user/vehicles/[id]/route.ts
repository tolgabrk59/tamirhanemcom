import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

// PUT /api/user/vehicles/:id — araç güncelle
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { jwt, ...vehicleData } = await request.json()
    if (!jwt) return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })

    const res = await fetch(`${STRAPI_API}/vehicles/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ data: vehicleData }),
    })

    const data = await res.json().catch(() => ({}))
    return NextResponse.json({ success: res.ok, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

// DELETE /api/user/vehicles/:id — araç sil
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')
    if (!jwt) return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })

    const res = await fetch(`${STRAPI_API}/vehicles/${params.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwt}` },
    })

    return NextResponse.json({ success: res.ok })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
