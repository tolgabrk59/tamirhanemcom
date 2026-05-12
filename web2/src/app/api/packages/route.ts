import { NextResponse } from 'next/server'
import { getPackagesByBrandModel } from '@/lib/cache/vehicle-data'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')

    if (!brand || !model) {
      return NextResponse.json(
        { success: false, error: 'Marka ve model parametreleri gerekli' },
        { status: 400 }
      )
    }

    const packages = await getPackagesByBrandModel(brand, model)
    return NextResponse.json({ success: true, data: packages })
  } catch (error) {
    console.error('Packages API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Paketler yüklenemedi' },
      { status: 500 }
    )
  }
}
