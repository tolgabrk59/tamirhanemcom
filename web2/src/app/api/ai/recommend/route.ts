import { NextResponse } from 'next/server'
import { buildPricingContext } from '@/lib/pricing-data'

export const dynamic = 'force-dynamic'

const ZAI_URL = 'https://api.z.ai/api/anthropic/v1/messages'
const ZAI_KEY = process.env.ZAI_API_KEY || '042213d5518349509f67b0dcabb054d2.CrALf2SAl4jKXBgw'

const SYSTEM_PROMPT = `Sen TamirHanem'in yapay zeka araç bakım asistanısın. Görevin kullanıcıların araç sorunlarını analiz edip doğru servise yönlendirmek.

KURALLAR:
- SADECE otomotiv/araç konularına yanıt ver
- Otomotiv dışı sorulara: {"off_topic": true, "message": "Bu konuda yardımcı olamıyorum. Araç sorunlarınız için bana danışabilirsiniz."}
- Her zaman Türkçe yanıt ver
- Yanıtı SADECE JSON formatında ver, başka metin ekleme

YANIT FORMATI (JSON):
{
  "analysis": "Sorunun kısa teknik açıklaması (1-2 cümle)",
  "possible_causes": ["Olası neden 1", "Olası neden 2", "Olası neden 3"],
  "urgency": "low" | "medium" | "high",
  "urgency_label": "Düşük" | "Orta" | "Yüksek",
  "recommended_category": "İlgili servis kategorisi adı",
  "recommended_action": "Kullanıcıya önerilen aksiyon (1 cümle)",
  "estimated_cost_range": "Tahmini maliyet aralığı (örn: 500-1.500 ₺)"
}

ACİLİYET KRİTERLERİ:
- high: Güvenlik riski (fren, direksiyon, lastik patlaması, motor aşırı ısınma)
- medium: Sürüş konforu/performans (titreşim, ses, klima, şanzıman)
- low: Kozmetik/bakım (boya, cam filmi, iç temizlik, periyodik bakım)`

const QUICK_ISSUE_PROMPT = `Kullanıcı aşağıdaki araç sorun tipini seçti. Bu sorun tipi hakkında genel bir analiz yap.

Sorun tipi: "{issue_type}"

Araç bilgisi verilmediyse genel araçlar için yanıt ver. JSON formatında yanıt ver.`

// Fiyat bağlamı cache (30 dk)
let pricingCache: { data: string; ts: number } | null = null
const PRICING_CACHE_TTL = 30 * 60 * 1000

async function getPricingContext(): Promise<string> {
  const now = Date.now()
  if (pricingCache && (now - pricingCache.ts) < PRICING_CACHE_TTL) {
    return pricingCache.data
  }
  const data = await buildPricingContext()
  pricingCache = { data, ts: now }
  return data
}

async function callZai(prompt: string, vehicleInfo?: string): Promise<string> {
  const pricingContext = await getPricingContext()

  let systemPrompt = `${SYSTEM_PROMPT}\n\n${pricingContext}\n\nestimated_cost_range alanını yukarıdaki fiyat referanslarına göre hesapla. Birden fazla işlem gerekiyorsa toplam aralığı ver.`

  if (vehicleInfo) {
    systemPrompt += `\n\nKULLANICININ ARACI:\n${vehicleInfo}\nBu araca özel bilinen kronik sorunları, yaygın arızaları, recall/servis kampanyalarını dikkate al. Premium/lüks markalarda fiyatları %30-50 yukarı ayarla.`
  }

  const res = await fetch(ZAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ZAI_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'glm-4.5-air',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`ZAI API hatası: ${res.status} - ${err}`)
  }
  const data = await res.json()
  const text = data.content?.[0]?.text?.trim()
  if (!text) throw new Error('ZAI boş yanıt döndü')
  return text
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, message, issue_type, vehicle } = body as {
      type: 'chat' | 'quick'
      message?: string
      issue_type?: string
      vehicle?: { brand?: string; model?: string; year?: string; fuel?: string }
    }

    if (!type) {
      return NextResponse.json({ success: false, error: 'type gerekli' }, { status: 400 })
    }

    // Araç bilgisi string'i oluştur
    let vehicleInfoStr: string | undefined
    if (vehicle) {
      const parts: string[] = []
      if (vehicle.brand) parts.push(`Marka: ${vehicle.brand}`)
      if (vehicle.model) parts.push(`Model: ${vehicle.model}`)
      if (vehicle.year) parts.push(`Yıl: ${vehicle.year}`)
      if (vehicle.fuel) parts.push(`Yakıt: ${vehicle.fuel}`)
      if (parts.length > 0) {
        vehicleInfoStr = parts.join(', ')
      }
    }

    let prompt: string

    if (type === 'quick' && issue_type) {
      prompt = QUICK_ISSUE_PROMPT.replace('{issue_type}', issue_type)
    } else if (type === 'chat' && message) {
      prompt = message
    } else {
      return NextResponse.json({ success: false, error: 'Geçersiz istek' }, { status: 400 })
    }

    // Araç bilgisi varsa user prompt'a da ekle
    if (vehicleInfoStr) {
      prompt += `\n\nAraç Bilgisi: ${vehicleInfoStr}`
    }

    const rawResponse = await callZai(prompt, vehicleInfoStr)

    // LLM bazen markdown code block veya ek metin ile sarıyor, temizle
    let jsonStr = rawResponse
    // ```json ... ``` veya ``` ... ``` bloklarını çıkar
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/)
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim()
    }
    // Hâlâ JSON değilse, ilk { ile son } arasını al
    if (!jsonStr.startsWith('{')) {
      const start = jsonStr.indexOf('{')
      const end = jsonStr.lastIndexOf('}')
      if (start !== -1 && end !== -1 && end > start) {
        jsonStr = jsonStr.slice(start, end + 1)
      }
    }

    let parsed
    try {
      parsed = JSON.parse(jsonStr)
    } catch {
      parsed = { analysis: rawResponse, possible_causes: [], urgency: 'medium', urgency_label: 'Orta', recommended_category: '', recommended_action: '', estimated_cost_range: '' }
    }

    return NextResponse.json({ success: true, data: parsed })
  } catch (error) {
    console.error('[AI] Recommend error:', error)
    return NextResponse.json(
      { success: false, error: 'AI yanıt veremedi, lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}
