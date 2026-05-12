import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errors, logError } from '@/lib/api-response';
import { getUserContext, saveConversation } from '@/lib/supermemory';
import { createLogger } from '@/lib/logger';
import { validate, chatSchema } from '@/lib/validators';
import { checkRouteRateLimit, getClientIdentifier } from '@/lib/route-rate-limit';

const logger = createLogger('API_CHAT');

// Rate limit: 20 requests per hour per IP
const CHAT_RATE_LIMIT = 20;
const CHAT_RATE_WINDOW = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const identifier = getClientIdentifier(request.headers, 'chat');
    const rateLimit = await checkRouteRateLimit(identifier, CHAT_RATE_LIMIT, CHAT_RATE_WINDOW);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Çok fazla istek gönderdiniz', 
          retryAfter: rateLimit.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter || 3600),
            'X-RateLimit-Limit': String(CHAT_RATE_LIMIT),
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }

    const body = await request.json();
    const validation = validate(chatSchema, body);
    if (!validation.success) {
      return errors.badRequest(validation.error);
    }
    const { message, history, userId, vehicleInfo } = validation.data;

    if (!message || typeof message !== 'string') {
      return errors.badRequest('Mesaj gereklidir');
    }

    // Generate session ID if userId not provided
    const sessionId = userId || request.cookies.get('session_id')?.value ||
      `anon_${request.headers.get('x-forwarded-for') || 'unknown'}_${Date.now()}`;

    // Get relevant memories for context
    let memoryContext = '';
    try {
      memoryContext = await getUserContext(sessionId, message);
    } catch (e) {
      // Memory fetch failed, continue without it
      logger.debug({ error: e }, 'Memory context fetch skipped');
    }

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
      return successResponse({
        message: "Ben TamirHanem için özel tasarlanmış bir asistanım ve sadece araç bakımı, tamir ve arıza konularında yardımcı olabilirim. Aracınızla ilgili başka bir sorunuz var mı?"
      });
    }

    // Pre-filter: Check if question requires login (personal/account-specific)
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
      return successResponse({
        message: "Aracınıza özel öneriler için lütfen üye girişi yapınız. Giriş yaptıktan sonra aracınızın bilgilerini kaydedebilir ve size özel öneriler alabilirsiniz.\n\nAlternatif olarak, araç modelinizi belirterek genel öneriler alabilirsiniz. Örneğin: 'Opel Astra için lastik öner'"
      });
    }

    const isPersonalQuestion = personalKeywords.some(keyword =>
      lowerMessage.includes(keyword)
    );

    if (isPersonalQuestion) {
      return successResponse({
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

SEN YAPAY ZEKA OLDUĞUNU BELİRTME, TamirHanem asistanı olarak konuş.${memoryContext}`;

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
        maxOutputTokens: 1000,
      },
    };

    // Gemini API endpoint - Use rotating keys
    const apiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4,
      process.env.GEMINI_API_KEY_5,
      process.env.GEMINI_API_KEY_7,
    ].filter(Boolean) as string[];
    
    if (apiKeys.length === 0) {
      logError('Chat API', new Error('No GEMINI_API_KEY configured'));
      return errors.serviceUnavailable('Sohbet servisi geçici olarak kullanılamıyor');
    }
    
    // Rotate through keys based on current time (changes every minute)
    const keyIndex = Math.floor(Date.now() / 60000) % apiKeys.length;
    const apiKey = apiKeys[keyIndex];

    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      logError('Gemini API', new Error(JSON.stringify(data)));
      return errors.badGateway('Yanıt alınamadı. Lütfen tekrar deneyin.');
    }

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      logError('Gemini API', new Error('Invalid response structure'));
      return errors.badGateway('Yanıt alınamadı. Lütfen tekrar deneyin.');
    }

    const aiMessage = data.candidates[0].content.parts[0].text;

    // Save conversation to memory (don't await, fire and forget)
    saveConversation(sessionId, message, aiMessage, vehicleInfo).catch((e) => {
      logger.debug({ error: e }, 'Memory save skipped');
    });

    // Return response with rate limit headers
    const response_data = successResponse({ message: aiMessage });
    return NextResponse.json(response_data, {
      headers: {
        'X-RateLimit-Limit': String(CHAT_RATE_LIMIT),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      }
    });
  } catch (error) {
    logError('Chat API', error);
    return errors.internal('Bir hata oluştu. Lütfen tekrar deneyin.');
  }
}
