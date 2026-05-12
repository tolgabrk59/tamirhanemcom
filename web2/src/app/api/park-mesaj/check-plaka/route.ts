import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const plakaRaw = searchParams.get('plaka')

    if (!plakaRaw) {
      return NextResponse.json(
        { success: false, error: 'Plaka gerekli' },
        { status: 400 }
      )
    }

    // Boşluksuz, büyük harf
    const plaka = plakaRaw.replace(/\s+/g, '').toUpperCase()
    console.log('[check-plaka] Sorgulanan plaka:', plaka)

    // 1) arac-plakalar koleksiyonu
    try {
      const res = await fetch(
        `${STRAPI_API}/arac-plakalar?filters[plaka][$eq]=${plaka}&filters[is_active][$eq]=true`,
        { headers: getHeaders(), cache: 'no-store' }
      )
      if (res.ok) {
        const json = await res.json()
        console.log('[check-plaka] arac-plakalar sonuç:', json.data?.length || 0)
        if ((json.data || []).length > 0) {
          const record = json.data[0]
          const phone = record.attributes?.owner_phone || record.owner_phone
          console.log('[check-plaka] arac-plakalar bulundu, telefon var mı:', !!phone)
          if (phone) {
            return NextResponse.json({
              success: true,
              registered: true,
              source: 'plaka-kayit',
              message: 'Bu plaka kayıtlı. Mesaj gönderebilirsiniz.',
            })
          }
        }
      }
    } catch (e) {
      console.error('[check-plaka] arac-plakalar hatası:', e)
    }

    // 2) vehicles koleksiyonu — hem boşluksuz hem boşluklu ara
    try {
      // $contains ile ara — veritabanında "34 ABC 123" şeklinde de olabilir
      const res = await fetch(
        `${STRAPI_API}/vehicles?filters[plate][$contains]=${plaka}&populate=user`,
        { headers: getHeaders(), cache: 'no-store' }
      )
      if (res.ok) {
        const json = await res.json()
        const vehicles = json.data || []
        console.log('[check-plaka] vehicles sonuç:', vehicles.length)

        for (const v of vehicles) {
          const attrs = v.attributes || v
          // Plaka eşleşmesini boşluksuz karşılaştır
          const vPlate = (attrs.plate || '').replace(/\s+/g, '').toUpperCase()
          if (vPlate !== plaka) continue

          // User'dan telefon al
          const userData = attrs.user?.data?.attributes || attrs.user
          const phone = userData?.phone
          console.log('[check-plaka] vehicle bulundu, user phone:', phone ? 'VAR' : 'YOK', 'userData keys:', userData ? Object.keys(userData) : 'null')

          if (phone) {
            return NextResponse.json({
              success: true,
              registered: true,
              source: 'member-vehicle',
              message: 'Bu plaka kayıtlı bir üyeye ait. Mesaj gönderebilirsiniz.',
            })
          }
        }
      }
    } catch (e) {
      console.error('[check-plaka] vehicles hatası:', e)
    }

    return NextResponse.json({
      success: true,
      registered: false,
      message: 'Bu plaka sistemde kayıtlı değil.',
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Bilinmeyen hata'
    console.error('Plaka kontrol hatası:', msg)
    return NextResponse.json(
      { success: false, error: 'Sorgulama başarısız' },
      { status: 500 }
    )
  }
}
