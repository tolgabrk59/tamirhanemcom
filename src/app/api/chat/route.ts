import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    // Pre-filter: Check if question is clearly non-automotive
    const lowerMessage = message.toLowerCase();
    const nonAutomotiveKeywords = [
      'hava durumu', 'hava nasıl', 'yağmur', 'kar yağ', 'sıcaklık',
      'yemek', 'tarif', 'siyaset', 'futbol', 'maç', 'film', 'dizi',
      'müzik', 'şarkı', 'oyun', 'programlama', 'kod', 'matematik',
      'sağlık', 'doktor', 'ilaç', 'hastalık', 'grip', 'ateş'
    ];

    const isNonAutomotive = nonAutomotiveKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    if (isNonAutomotive) {
      return NextResponse.json({ 
        message: "Ben TamirHanem için özel tasarlanmış bir asistanım ve sadece araç bakımı, tamir ve arıza konularında yardımcı olabilirim. Aracınızla ilgili başka bir sorunuz var mı?" 
      });
    }

    // Pre-filter: Check if question requires login (personal/account-specific)
    // But allow if user specified their car model (e.g., "Opel Astra için lastik öner")
    const personalKeywords = [
      'randevum', 'randevu al', 'randevu oluştur', 'randevu ver', 'randevu ayarla',
      'servis öner', 'yakın servis', 'servis bul', 'servis ara',
      'fiyat teklif', 'teklif al', 'maliyet hesapla', 'ne kadar tutar',
      'bakım geçmişi', 'geçmiş kayıt', 'önceki servis', 'servis kayıt',
      'hesabım', 'profilim', 'bilgilerim'
    ];

    // Keywords that need model specification
    const needsModelKeywords = [
      'için lastik öner', 'için yağ öner', 'hangi lastik almalı', 'hangi yağ kullanmalı',
      'aracım için', 'arabam için'
    ];

    // Common car brands/models to detect if user specified their car
    const carBrands = [
      'opel', 'ford', 'renault', 'fiat', 'volkswagen', 'vw', 'bmw', 'mercedes', 
      'audi', 'toyota', 'honda', 'hyundai', 'kia', 'nissan', 'peugeot', 'citroen',
      'skoda', 'seat', 'mazda', 'suzuki', 'mitsubishi', 'volvo', 'dacia', 'jeep',
      'astra', 'focus', 'megane', 'clio', 'golf', 'passat', 'corolla', 'civic'
    ];

    const hasCarModel = carBrands.some(brand => lowerMessage.includes(brand));
    const needsModel = needsModelKeywords.some(keyword => lowerMessage.includes(keyword));

    // If question needs model but user didn't specify, ask for login
    if (needsModel && !hasCarModel) {
      return NextResponse.json({ 
        message: "Aracınıza özel öneriler için lütfen üye girişi yapınız. Giriş yaptıktan sonra aracınızın bilgilerini kaydedebilir ve size özel öneriler alabilirsiniz.\n\nAlternatif olarak, araç modelinizi belirterek genel öneriler alabilirsiniz. Örneğin: 'Opel Astra için lastik öner'" 
      });
    }

    const isPersonalQuestion = personalKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    if (isPersonalQuestion) {
      return NextResponse.json({ 
        message: "Bu tür kişiselleştirilmiş hizmetler için lütfen üye girişi yapınız. Giriş yaptıktan sonra:\n\n• Randevu alabilir\n• Aracınıza özel öneriler alabilir\n• Yakınınızdaki servisleri görebilir\n• Fiyat teklifleri alabilir\n• Bakım geçmişinizi takip edebilirsiniz\n\nGenel araç bakımı ve arıza konularında size yardımcı olmaya devam edebilirim!" 
      });
    }

    const systemPrompt = `Sen TamirHanem'in özel araç bakım ve tamir asistanısın. SADECE ve SADECE otomotiv, araç bakımı, arızalar, tamir, yedek parça ve araçlarla ilgili konularda yardımcı olabilirsin.

KESİN KURALLAR:
1. SADECE şu konularda cevap ver:
   - Araç arızaları ve sorunları
   - Motor, fren, süspansiyon, elektrik sistemleri
   - Yedek parça ve bakım
   - Araç kullanımı ve güvenlik
   - Lastik, akü, yağ değişimi
   - OBD kodları ve teşhis

2. ASLA şu konularda cevap verme:
   - Hava durumu
   - Yemek tarifleri
   - Siyaset, din, spor
   - Genel bilgiler
   - Programlama, matematik
   - Sağlık (araç dışı)
   - Eğlence, film, müzik
   - Diğer tüm araç dışı konular

3. Araç dışı HERHANGI bir soru geldiğinde MUTLAKA şu cevabı ver:
   "Ben TamirHanem için özel tasarlanmış bir asistanım ve sadece araç bakımı, tamir ve arıza konularında yardımcı olabilirim. Aracınızla ilgili başka bir sorunuz var mı?"

4. Türkçe konuş, samimi ve yardımsever ol
5. Teknik terimleri açıkla
6. Güvenlik uyarıları yap
7. Maliyet tahminleri verirken "yaklaşık" ifadesini kullan
8. Ciddi sorunlarda mutlaka profesyonel servise gitmelerini öner
9. Cevapları kısa ve öz tut (maksimum 3-4 paragraf)

ÖNEMLİ: Soru araç ile ilgili değilse, ASLA genel bilgi verme. Sadece yukarıdaki reddetme cevabını ver.

SEN YAPAY ZEKA OLDUĞUNU BELİRTME, TamirHanem asistanı olarak konuş.`;

    // Convert chat history to Gemini format
    const contents = [];
    
    // If this is the first message, add system prompt as context
    if (!history || history.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: systemPrompt + '\n\nKullanıcı sorusu: ' + message }]
      });
    } else {
      // Add history messages (skip the initial assistant greeting)
      for (const msg of history) {
        // Skip the initial greeting message
        if (msg.role === 'assistant' && msg.content.includes('TamirHanem asistanıyım')) {
          continue;
        }
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }
      
      // Add current user message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });
    }

    const requestBody = {
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000, // Increased from 500 to 1000
      },
    };

    // Gemini API endpoint
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', JSON.stringify(data, null, 2));
      throw new Error(`Gemini API error: ${data.error?.message || 'Unknown error'}`);
    }

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini response:', JSON.stringify(data, null, 2));
      throw new Error('Invalid response from Gemini API');
    }

    const aiMessage = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ message: aiMessage });
  } catch (error: any) {
    console.error('Chat API error:', error.message);
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
