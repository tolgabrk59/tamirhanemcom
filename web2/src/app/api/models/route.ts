import { NextResponse } from 'next/server'
import { getModelsByBrand } from '@/lib/cache/vehicle-data'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get('brand')

    if (!brand) {
      return NextResponse.json(
        { success: false, error: 'Marka parametresi gerekli' },
        { status: 400 }
      )
    }

    const models = await getModelsByBrand(brand)
    const formattedModels = models.map((m) => ({ model: m }))
    return NextResponse.json({ success: true, data: formattedModels })
  } catch (error) {
    console.error('Models API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Modeller yüklenemedi' },
      { status: 500 }
    )
  }
}
