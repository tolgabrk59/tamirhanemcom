import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { checkRouteRateLimit, getClientIdentifier } from '@/lib/route-rate-limit';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rate limit: 30 requests per hour per IP
const AI_RATE_LIMIT = 30;
const AI_RATE_WINDOW = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  // Rate limiting check
  const identifier = getClientIdentifier(request.headers, 'ai-issue-analyzer');
  const rateLimit = await checkRouteRateLimit(identifier, AI_RATE_LIMIT, AI_RATE_WINDOW);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { 
        error: 'Cok fazla istek gonderdiniz. Lutfen 1 saat sonra tekrar deneyin.',
        retryAfter: rateLimit.retryAfter 
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfter || 3600),
        }
      }
    );
  }

  try {
    const { issue } = await request.json();

    if (!issue || typeof issue !== 'string' || issue.trim().length < 5) {
      return NextResponse.json(
        { error: 'Lutfen sorununuzu daha detayli aciklayin.' },
        { status: 400 }
      );
    }

    const systemPrompt = `Sen tamirhanem.com platformunun yapay zeka asistanisin.

ONEMLI KURAL - KESINLIKLE UYULMASI GEREKEN:
Sen SADECE ve SADECE arac (otomobil, motosiklet, kamyon vb.) ile ilgili konularda yardimci olabilirsin:
- Ariza ve sorunlar
- Teknik ozellikler (lastik ebatlari, motor, yakit tuketimi vb.)
- Bakim bilgileri
- Yedek parca bilgileri
- Arac karsilastirma

Arac disindaki HICBIR konuda (saglik, hukuk, finans, genel sohbet, kisisel sorular, yazilim vb.) ASLA cevap verme.

Eger kullanicinin sorusu arac/otomotiv ile ilgili DEGILSE, su JSON'u dondur:
{
    "type": "off_topic",
    "message": "Tamirhanem AI altyapisi sadece araclar ile ilgili bilgilendirme amaci ile egitilmistir. Bu sorunuza cevap verememekteyim."
}

Eger soru ARIZA/SORUN ile ilgiliyse (motor arizasi, ses geliyor, titriyor, calismiyor vb.), su JSON formatinda cevap ver:
{
    "type": "issue",
    "category": "En uygun kategori (Periyodik Bakim / Motor Mekanik / Kaporta Boya / Oto Elektrik & Elektronik / Lastik & Jant / Fren Sistemi / Sanziman / Egzoz & Emisyon / Klima Servisi / Oto Kuafor & Detayli Temizlik / Oto Ekspertiz)",
    "urgency": "Dusuk / Orta / Yuksek",
    "urgency_color": "green / yellow / red",
    "analysis": "Sorunun olasi teknik nedenleri ve kullaniciya kisa tavsiye (maks 2 cumle)."
}

Eger soru BILGI SORGUSU ise (lastik ebatlari, motor ozellikleri, yakit tuketimi, teknik detay vb.), su JSON formatinda cevap ver:
{
    "type": "info",
    "title": "Kisa baslik (orn: Renault Clio 4 Lastik Ebatlari)",
    "answer": "Detayli ve faydali cevap (2-4 cumle). Bilgiyi net ve anlasilir sekilde ver.",
    "related_category": "Ilgili servis kategorisi varsa (orn: Lastik & Jant), yoksa null"
}

Sadece saf JSON dondur. Markdown blogu kullanma.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Kullanici Mesaji: "${issue}"` }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const text = completion.choices[0]?.message?.content || '';

    // Parse JSON - clean markdown if present
    const jsonString = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(jsonString);

    // Arac disi soru kontrolu
    if (data.type === 'off_topic') {
      return NextResponse.json(
        { error: data.message || 'Tamirhanem AI altyapisi sadece araclar ile ilgili bilgilendirme amaci ile egitilmistir. Bu sorunuza cevap verememekteyim.' },
        { status: 400 }
      );
    }

    // Bilgi sorgusu
    if (data.type === 'info') {
      return NextResponse.json({
        type: 'info',
        title: data.title,
        answer: data.answer,
        related_category: data.related_category || null
      });
    }

    // Ariza/sorun yaniti (varsayilan)
    // Validate response structure
    if (!data.category || !data.urgency || !data.urgency_color || !data.analysis) {
      throw new Error('Gecersiz yanit formati');
    }

    return NextResponse.json({
      type: 'issue',
      category: data.category,
      urgency: data.urgency,
      urgency_color: data.urgency_color,
      analysis: data.analysis
    });
  } catch (error) {
    console.error('AI Issue Analyzer Error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'AI yaniti islenemedi, lutfen tekrar deneyin.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Analiz yapilamadi, lutfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
