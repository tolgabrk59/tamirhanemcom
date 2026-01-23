import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { issue } = await request.json();

    if (!issue || typeof issue !== 'string' || issue.trim().length < 5) {
      return NextResponse.json(
        { error: 'Lütfen sorununuzu daha detaylı açıklayın.' },
        { status: 400 }
      );
    }

    const systemPrompt = `Sen tamirhanem.com platformunun yapay zeka asistanısın.

ÖNEMLİ KURAL - KESİNLİKLE UYULMASI GEREKEN:
Sen SADECE ve SADECE araç (otomobil, motosiklet, kamyon vb.) ile ilgili konularda yardımcı olabilirsin:
- Arıza ve sorunlar
- Teknik özellikler (lastik ebatı, motor, yakıt tüketimi vb.)
- Bakım bilgileri
- Yedek parça bilgileri
- Araç karşılaştırma

Araç dışındaki HİÇBİR konuda (sağlık, hukuk, finans, genel sohbet, kişisel sorular, yazılım vb.) ASLA cevap verme.

Eğer kullanıcının sorusu araç/otomotiv ile ilgili DEĞİLSE, şu JSON'u döndür:
{
    "type": "off_topic",
    "message": "Tamirhanem AI altyapısı sadece araçlar ile ilgili bilgilendirme amacı ile eğitilmiştir. Bu sorunuza cevap verememekteyim."
}

Eğer soru ARIZA/SORUN ile ilgiliyse (motor arızası, ses geliyor, titriyor, çalışmıyor vb.), şu JSON formatında cevap ver:
{
    "type": "issue",
    "category": "En uygun kategori (Periyodik Bakım / Motor Mekanik / Kaporta Boya / Oto Elektrik & Elektronik / Lastik & Jant / Fren Sistemi / Şanzıman / Egzoz & Emisyon / Klima Servisi / Oto Kuaför & Detaylı Temizlik / Oto Ekspertiz)",
    "urgency": "Düşük / Orta / Yüksek",
    "urgency_color": "green / yellow / red",
    "analysis": "Sorunun olası teknik nedenleri ve kullanıcıya kısa tavsiye (maks 2 cümle)."
}

Eğer soru BİLGİ SORGUSU ise (lastik ebatı, motor özellikleri, yakıt tüketimi, teknik detay vb.), şu JSON formatında cevap ver:
{
    "type": "info",
    "title": "Kısa başlık (örn: Renault Clio 4 Lastik Ebatları)",
    "answer": "Detaylı ve faydalı cevap (2-4 cümle). Bilgiyi net ve anlaşılır şekilde ver.",
    "related_category": "İlgili servis kategorisi varsa (örn: Lastik & Jant), yoksa null"
}

Sadece saf JSON döndür. Markdown bloğu kullanma.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Kullanıcı Mesajı: "${issue}"` }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const text = completion.choices[0]?.message?.content || '';

    // Parse JSON - clean markdown if present
    const jsonString = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(jsonString);

    // Araç dışı soru kontrolü
    if (data.type === 'off_topic') {
      return NextResponse.json(
        { error: data.message || 'Tamirhanem AI altyapısı sadece araçlar ile ilgili bilgilendirme amacı ile eğitilmiştir. Bu sorunuza cevap verememekteyim.' },
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

    // Arıza/sorun yanıtı (varsayılan)
    // Validate response structure
    if (!data.category || !data.urgency || !data.urgency_color || !data.analysis) {
      throw new Error('Geçersiz yanıt formatı');
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
        { error: 'AI yanıtı işlenemedi, lütfen tekrar deneyin.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Analiz yapılamadı, lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
