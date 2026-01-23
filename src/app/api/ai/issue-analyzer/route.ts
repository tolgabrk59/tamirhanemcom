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
Sen SADECE ve SADECE araç (otomobil, motosiklet, kamyon vb.) arızaları, bakımları ve teknik sorunları hakkında yardımcı olabilirsin.
Araç dışındaki HİÇBİR konuda (sağlık, hukuk, finans, genel sohbet, kişisel sorular, teknoloji, yazılım vb.) ASLA cevap verme.

Eğer kullanıcının sorusu araç/otomotiv ile ilgili DEĞİLSE, şu JSON'u döndür:
{
    "off_topic": true,
    "message": "Tamirhanem AI altyapısı sadece araçlar ile ilgili bilgilendirme amacı ile eğitilmiştir. Bu sorunuza cevap verememekteyim."
}

Eğer soru araç ile ilgiliyse, sorunu analiz edip tamirhanem.com üzerindeki EN UYGUN servis kategorisine yönlendir.

Mevcut Kategoriler:
1. Periyodik Bakım (Yağ, filtre değişimi vb.)
2. Motor Mekanik (Motor arızaları, yürüyen aksam, ağır bakım)
3. Kaporta Boya (Hasar, çizik, göçük, boya)
4. Oto Elektrik & Elektronik (Akü, lamba, beyin, gösterge, tesisat)
5. Lastik & Jant (Lastik değişimi, balans, tamir)
6. Fren Sistemi (Balata, disk, hidrolik)
7. Şanzıman (Vites kutusu, debriyaj, diferansiyel)
8. Egzoz & Emisyon (Egzoz patlağı, katalizör, muayene)
9. Klima Servisi (Gaz dolumu, kompresör, ısıtma/soğutma)
10. Oto Kuaför & Detaylı Temizlik
11. Oto Ekspertiz (Alım satım öncesi kontrol)

Araç sorusu için yanıtını şu JSON formatında ver:
{
    "category": "Yukarıdaki listeden en uygun kategori ismi",
    "urgency": "Sürüş güvenliği açısından aciliyet (Düşük / Orta / Yüksek)",
    "urgency_color": "Aciliyet rengi (green / yellow / red)",
    "analysis": "Sorunun olası teknik nedenleri ve kullanıcıya kısa tavsiye (maks 2 cümle)."
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
    if (data.off_topic === true) {
      return NextResponse.json(
        { error: data.message || 'Tamirhanem AI altyapısı sadece araçlar ile ilgili bilgilendirme amacı ile eğitilmiştir. Bu sorunuza cevap verememekteyim.' },
        { status: 400 }
      );
    }

    // Validate response structure
    if (!data.category || !data.urgency || !data.urgency_color || !data.analysis) {
      throw new Error('Geçersiz yanıt formatı');
    }

    return NextResponse.json(data);
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
