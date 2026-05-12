#!/usr/bin/env node
/**
 * Strapi'den araç marka/model/paket verilerini çekip
 * src/data/vehicle-data.json dosyasına yazar.
 *
 * Kullanım: npm run update-vehicle-data
 * Veya:     node scripts/update-vehicle-data.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'vehicle-data.json')

const STRAPI_URL = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

const EXCLUDED_CAR_BRANDS = [
  'BUGATTI', 'CADILLAC', 'DAF', 'DFM', 'DODGE', 'GMC', 'INFINITI',
  'LANCIA', 'LINCOLN', 'LOTUS', 'MAYBACH', 'MCLAREN', 'OTOKAR/MAGIRUS',
  'OTOYOLIVECOFIAT', 'PIAGGIO', 'PROTON', 'RAM', 'ROLLS-ROYCE', 'SAAB',
  'SETRA', 'SMART', 'TEMSA', 'VOYAH', 'HARLEY-DAVIDSON', 'RAMZEY',
  'BMC', 'ISUZU', 'MAN', 'DFSK', 'MAXUS', 'TATA', 'TOFAS-FIAT',
]

async function main() {
  console.log('Strapi\'den araç verileri çekiliyor...')

  const headers = {}
  if (STRAPI_TOKEN) headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`

  const url = `${STRAPI_URL}/arac-dataveris?pagination[pageSize]=100000`
  const response = await fetch(url, { headers })
  if (!response.ok) throw new Error(`Strapi API error: ${response.status}`)

  const result = await response.json()
  const items = result.data || []
  console.log(`Toplam kayıt: ${items.length}`)

  // Marka > Model > Paket yapısına dönüştür
  const tree = {}

  for (const item of items) {
    const brand = (item.brand || '').toUpperCase()
    const model = item.model || ''
    const full_model = (item.full_model || '').replace(/\r/g, '')
    const paket = (item.paket || '').replace(/\r/g, '')
    const id = item.id

    if (!brand || !model || EXCLUDED_CAR_BRANDS.includes(brand)) continue
    if (brand === 'MOTORSIKLET') continue

    if (!tree[brand]) tree[brand] = {}
    if (!tree[brand][model]) tree[brand][model] = []

    // Aynı full_model'i tekrar ekleme
    if (full_model && !tree[brand][model].some(p => p.full_model === full_model)) {
      tree[brand][model].push({ id, paket, full_model })
    }
  }

  // Sırala
  const sorted = {}
  for (const brand of Object.keys(tree).sort()) {
    sorted[brand] = {}
    for (const model of Object.keys(tree[brand]).sort()) {
      sorted[brand][model] = tree[brand][model].sort((a, b) => a.paket.localeCompare(b.paket, 'tr'))
    }
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(sorted))

  const stats = { brands: 0, models: 0, packages: 0 }
  for (const b of Object.keys(sorted)) {
    stats.brands++
    for (const m of Object.keys(sorted[b])) {
      stats.models++
      stats.packages += sorted[b][m].length
    }
  }

  const size = (fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(2)
  console.log(`\nMarka: ${stats.brands} | Model: ${stats.models} | Paket: ${stats.packages}`)
  console.log(`Dosya: ${OUTPUT} (${size} MB)`)
  console.log('Tamamlandı!')
}

main().catch(err => {
  console.error('Hata:', err.message)
  process.exit(1)
})
