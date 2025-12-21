# Chatbot Prompt Güncelle

AI chatbot (Gemini) system prompt'unu güncelle veya yeni konu alanı ekle.

## Kullanım
```
/chatbot-prompt-guncelle
```

## Dosya Konumu
`/src/app/api/chat/route.ts`

## Yapılacaklar

1. Mevcut system prompt'u oku ve analiz et

2. Kullanıcıdan ne eklemek/değiştirmek istediğini sor:
   - Yeni konu alanı ekleme
   - Mevcut cevapları iyileştirme
   - Filtreleme kuralları güncelleme
   - Ton/üslup değişikliği

3. System prompt'u güncelle

## Mevcut Prompt Yapısı

```
Sen TamirHanem'in AI asistanısın...

Kurallar:
- Sadece araç bakım/onarım konularında cevap ver
- Fiyat tahmini verirken dikkatli ol
- Kullanıcıyı servise yönlendir
- Türkçe cevap ver
```

## Eklenebilecek Konular

- Yeni araç markası/modeli bilgisi
- Spesifik arıza kodları (OBD)
- Periyodik bakım takvimi
- Parça fiyat aralıkları
- Servis önerileri

## Prompt Optimizasyon İpuçları

- Kısa ve net talimatlar ver
- Örnekler ekle (few-shot)
- Yapmaması gerekenleri belirt
- Cevap formatını tanımla
- Edge case'leri ele al

## Test

Güncellemeden sonra şu sorularla test et:
1. "Yağ değişimi ne kadar sürer?"
2. "Fren balataları ne zaman değişmeli?"
3. "Motor uyarı lambası yandı ne yapmalıyım?"
