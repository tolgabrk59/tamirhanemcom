#!/usr/bin/env node
/**
 * Araç marka/model kombinasyonlarına üretim yıllarını ekler.
 * Gemini API kullanarak her model için üretim yıl aralığını sorar.
 *
 * Kullanım: node scripts/enrich-vehicle-years.mjs
 *
 * Çıktı: src/data/vehicle-data.json güncellenir (her paket'e years[] eklenir)
 * Ara sonuçlar: scripts/.vehicle-years-progress.json (kaldığı yerden devam eder)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'vehicle-data.json')
const PROGRESS_PATH = path.join(__dirname, '.vehicle-years-progress.json')

// z.ai API config
const ZAI_URL = 'https://api.z.ai/api/anthropic/v1/messages'
const ZAI_KEY = '042213d5518349509f67b0dcabb054d2.CrALf2SAl4jKXBgw'
const MODEL = 'glm-4.5-air'

const BATCH_SIZE = 15 // Her batch'te kaç marka+model
const DELAY_MS = 1000 // API rate limit koruması
const MAX_RETRIES = 3

// ─── z.ai API çağrısı (Anthropic uyumlu) ───────────────────────────
async function askAI(prompt, retries = 0) {
  try {
    const res = await fetch(ZAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ZAI_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 8192,
        temperature: 0.1,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (res.status === 429 || res.status === 503) {
      if (retries < MAX_RETRIES) {
        const wait = (retries + 1) * 5000
        console.log(`  Rate limit, ${wait / 1000}s bekleniyor...`)
        await sleep(wait)
        return askAI(prompt, retries + 1)
      }
      throw new Error(`API rate limit aşıldı (${MAX_RETRIES} deneme)`)
    }

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`API ${res.status}: ${errText.slice(0, 300)}`)
    }

    const data = await res.json()
    const text = data?.content?.[0]?.text
    if (!text) throw new Error('Boş yanıt')

    // JSON bloğunu çıkar (```json ... ``` veya direkt JSON)
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\[[\s\S]*\])/)
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim()
    return JSON.parse(jsonStr)
  } catch (err) {
    if (retries < MAX_RETRIES) {
      console.log(`  Hata: ${err.message.slice(0, 100)}, tekrar deneniyor...`)
      await sleep(3000)
      return askAI(prompt, retries + 1)
    }
    throw err
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ─── Progress yönetimi ───────────────────────────
function loadProgress() {
  try {
    if (fs.existsSync(PROGRESS_PATH)) {
      return JSON.parse(fs.readFileSync(PROGRESS_PATH, 'utf-8'))
    }
  } catch {}
  return {}
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2))
}

// ─── Ana fonksiyon ───────────────────────────
async function main() {
  const vehicleData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
  const progress = loadProgress()

  // Tüm marka+model çiftlerini topla
  const pairs = []
  for (const [brand, models] of Object.entries(vehicleData)) {
    for (const model of Object.keys(models)) {
      pairs.push({ brand, model })
    }
  }

  // Zaten tamamlananları filtrele
  const pending = pairs.filter(p => !progress[`${p.brand}|${p.model}`])
  console.log(`Toplam: ${pairs.length} | Tamamlanan: ${pairs.length - pending.length} | Kalan: ${pending.length}`)

  if (pending.length === 0) {
    console.log('Tüm modeller zaten işlendi. Sonuçlar uygulanıyor...')
    applyResults(vehicleData, progress)
    return
  }

  // Batch'ler halinde işle
  const batches = []
  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    batches.push(pending.slice(i, i + BATCH_SIZE))
  }

  console.log(`${batches.length} batch işlenecek (her biri ${BATCH_SIZE} model)\n`)

  for (let bi = 0; bi < batches.length; bi++) {
    const batch = batches[bi]
    const batchDesc = batch.map(p => `${p.brand} ${p.model}`).join(', ')
    console.log(`[${bi + 1}/${batches.length}] ${batchDesc.slice(0, 100)}...`)

    const prompt = buildPrompt(batch)

    try {
      const result = await askAI(prompt)

      // Sonuçları kaydet
      if (Array.isArray(result)) {
        for (const item of result) {
          const key = `${(item.brand || '').toUpperCase()}|${item.model || ''}`
          if (item.years && Array.isArray(item.years)) {
            progress[key] = item.years.map(Number).filter(y => y >= 1960 && y <= 2026).sort()
          }
        }
      } else if (typeof result === 'object') {
        // Obje formatı: { "BRAND MODEL": [years] }
        for (const [k, years] of Object.entries(result)) {
          if (Array.isArray(years)) {
            // Key'i marka|model'e çevir
            const matchingPair = batch.find(p => k.toUpperCase().includes(p.brand) && k.includes(p.model))
            if (matchingPair) {
              progress[`${matchingPair.brand}|${matchingPair.model}`] = years.map(Number).filter(y => y >= 1960 && y <= 2026).sort()
            }
          }
        }
      }

      saveProgress(progress)
      const done = pairs.length - pairs.filter(p => !progress[`${p.brand}|${p.model}`]).length
      console.log(`  OK (${done}/${pairs.length} tamamlandı)`)
    } catch (err) {
      console.error(`  HATA: ${err.message}`)
      // Devam et, başarısız olanlar sonraki çalıştırmada tekrar denenir
    }

    if (bi < batches.length - 1) await sleep(DELAY_MS)
  }

  // Sonuçları uygula
  applyResults(vehicleData, progress)
}

function buildPrompt(batch) {
  const list = batch.map(p => `- ${p.brand} ${p.model}`).join('\n')

  return `Sen bir otomobil uzmanısın. Aşağıdaki araç marka ve modellerinin Türkiye'de hangi yıllar arasında üretildiğini/satıldığını belirt.

Her model için üretim yıllarını TAM LİSTE olarak ver. Örneğin 2017'den 2021'e kadar üretildiyse [2017,2018,2019,2020,2021] yaz.
Eğer hala üretiliyorsa 2025'e kadar ekle.
Eğer bilmiyorsan boş array [] ver.

ARAÇLAR:
${list}

JSON formatında yanıt ver. Array of objects:
[
  { "brand": "MARKA", "model": "MODEL", "years": [2017, 2018, 2019, 2020, 2021] }
]

Sadece JSON döndür, başka açıklama yazma.`
}

function applyResults(vehicleData, progress) {
  let updated = 0
  let noYears = 0

  for (const [brand, models] of Object.entries(vehicleData)) {
    for (const [model, packages] of Object.entries(models)) {
      const years = progress[`${brand}|${model}`]
      if (years && years.length > 0) {
        for (const pkg of packages) {
          pkg.years = years
          updated++
        }
      } else {
        noYears += packages.length
      }
    }
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(vehicleData))
  const size = (fs.statSync(DATA_PATH).size / 1024 / 1024).toFixed(2)

  console.log(`\nSonuç:`)
  console.log(`  Güncellenen paket: ${updated}`)
  console.log(`  Yıl bulunamayan: ${noYears}`)
  console.log(`  Dosya: ${DATA_PATH} (${size} MB)`)

  // Progress dosyasını sil
  // fs.unlinkSync(PROGRESS_PATH) — devam edebilmek için silmiyoruz
  console.log(`\nTamamlandı! Yıl bulunamayanlar için tekrar çalıştırabilirsin.`)
}

main().catch(err => {
  console.error('Kritik hata:', err)
  process.exit(1)
})
