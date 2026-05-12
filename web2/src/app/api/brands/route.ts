import { NextResponse } from 'next/server'
import { getAllBrands } from '@/lib/cache/vehicle-data'

export const dynamic = 'force-dynamic'

const EXCLUDED_CAR_BRANDS = [
  'BUGATTI', 'CADILLAC', 'DAF', 'DFM', 'DODGE', 'GMC', 'INFINITI',
  'LANCIA', 'LINCOLN', 'LOTUS', 'MAYBACH', 'MCLAREN', 'OTOKAR/MAGIRUS',
  'OTOYOLIVECOFIAT', 'PIAGGIO', 'PROTON', 'RAM', 'ROLLS-ROYCE', 'SAAB',
  'SETRA', 'SMART', 'TEMSA', 'VOYAH', 'HARLEY-DAVIDSON', 'RAMZEY',
  'BMC', 'ISUZU', 'MAN', 'DFSK', 'MAXUS', 'TATA', 'TOFAS-FIAT',
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleType = searchParams.get('vehicleType') || 'otomobil'

    let brands = await getAllBrands()

    if (vehicleType === 'otomobil') {
      brands = brands.filter((b) =>
        b !== 'MOTORSIKLET' && !EXCLUDED_CAR_BRANDS.includes(b)
      )
    }

    const formattedBrands = brands.map((b) => ({ brand: b }))
    return NextResponse.json({ success: true, data: formattedBrands })
  } catch (error) {
    console.error('Brands API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Markalar yüklenemedi' },
      { status: 500 }
    )
  }
}
