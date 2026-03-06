import { NextResponse } from 'next/server'

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

async function callZai(prompt: string): Promise<string> {
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
      system: SYSTEM_PROMPT,
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

    // Araç bilgisi varsa prompt'a ekle
    let vehicleContext = ''
    if (vehicle) {
      const parts: string[] = []
      if (vehicle.brand) parts.push(`Marka: ${vehicle.brand}`)
      if (vehicle.model) parts.push(`Model: ${vehicle.model}`)
      if (vehicle.year) parts.push(`Yıl: ${vehicle.year}`)
      if (vehicle.fuel) parts.push(`Yakıt: ${vehicle.fuel}`)
      if (parts.length > 0) {
        vehicleContext = `\n\nAraç Bilgisi: ${parts.join(', ')}\nBu araca özel bilinen sorunları ve önerileri de dikkate al.`
      }
    }

    let prompt: string

    if (type === 'quick' && issue_type) {
      prompt = QUICK_ISSUE_PROMPT.replace('{issue_type}', issue_type) + vehicleContext
    } else if (type === 'chat' && message) {
      prompt = message + vehicleContext
    } else {
      return NextResponse.json({ success: false, error: 'Geçersiz istek' }, { status: 400 })
    }

    const rawResponse = await callZai(prompt)

    let parsed
    try {
      parsed = JSON.parse(rawResponse)
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
