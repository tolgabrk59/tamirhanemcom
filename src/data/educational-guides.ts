import type { EducationalGuide, DecisionFlowStep } from '@/types';

// Decision flow for "Check Engine" light
const checkEngineFlow: DecisionFlowStep[] = [
  {
    id: 1,
    question: 'Check Engine (motor arıza) lambası nasıl yanıyor?',
    options: [
      { text: 'Sabit yanıyor', nextStepId: 2 },
      { text: 'Yanıp sönüyor', nextStepId: 3 },
      { text: 'Bazen yanıp bazen sönüyor', nextStepId: 4 },
    ],
  },
  {
    id: 2,
    question: 'Motor normal çalışıyor mu?',
    options: [
      {
        text: 'Evet, normal çalışıyor',
        nextStepId: 5,
        action: 'Acil değil ama yakın zamanda teşhis yapılmalı',
      },
      {
        text: 'Hayır, titreme/güç kaybı var',
        nextStepId: 6,
        warning: 'Mümkün olan en kısa sürede servise gidin',
      },
    ],
  },
  {
    id: 3,
    question: 'Yanıp sönme hızlı mı?',
    options: [
      {
        text: 'Evet, hızlı yanıp sönüyor',
        nextStepId: null,
        action: 'ACİL: Aracı hemen durdurun! Ateşleme hatası katalitik konvertöre zarar verebilir.',
        warning: 'Sürüşe devam etmeyin, çekici çağırın',
      },
      {
        text: 'Yavaş yanıp sönüyor',
        nextStepId: 7,
      },
    ],
  },
  {
    id: 4,
    question: 'Belirli durumlarda mı yanıyor?',
    options: [
      { text: 'Hızlanırken', nextStepId: 8 },
      { text: 'Soğuk motorla', nextStepId: 9 },
      { text: 'Yakıt doldurduktan sonra', nextStepId: 10 },
    ],
  },
  {
    id: 5,
    question: 'Yakıt tüketiminde artış var mı?',
    options: [
      {
        text: 'Evet, tüketim arttı',
        nextStepId: null,
        action: 'Muhtemel O2 sensörü veya yakıt sistemi sorunu. 1 hafta içinde teşhis yapın.',
      },
      {
        text: 'Hayır, normal',
        nextStepId: null,
        action: 'Muhtemelen emisyon sistemi sorunu. 2 hafta içinde teşhis yapılabilir.',
      },
    ],
  },
  {
    id: 6,
    question: 'Titreme hangi durumda?',
    options: [
      {
        text: 'Rölantide',
        nextStepId: null,
        action: 'Muhtemel ateşleme bobini veya buji sorunu. Bugün servise gidin.',
      },
      {
        text: 'Hızlanırken',
        nextStepId: null,
        action: 'Muhtemel yakıt pompası veya enjektör sorunu. Bugün servise gidin.',
      },
    ],
  },
  {
    id: 7,
    question: 'Motor sesi normal mi?',
    options: [
      {
        text: 'Evet',
        nextStepId: null,
        action: 'Sensör arızası olabilir. Birkaç gün içinde teşhis yapın.',
      },
      {
        text: 'Hayır, anormal ses var',
        nextStepId: null,
        action: 'Mekanik sorun olabilir. Yakın zamanda servise gidin.',
        warning: 'Uzun yolculuklardan kaçının',
      },
    ],
  },
  {
    id: 8,
    question: '',
    options: [
      {
        text: 'Devam',
        nextStepId: null,
        action: 'Muhtemel gaz kelebeği veya MAF sensörü sorunu. 1 hafta içinde teşhis yapın.',
      },
    ],
  },
  {
    id: 9,
    question: '',
    options: [
      {
        text: 'Devam',
        nextStepId: null,
        action: 'Muhtemel termostat veya soğutma sensörü sorunu. Motor ısındıktan sonra sönüyorsa 1 hafta içinde kontrol ettirin.',
      },
    ],
  },
  {
    id: 10,
    question: '',
    options: [
      {
        text: 'Devam',
        nextStepId: null,
        action: 'Muhtemel yakıt kapağı veya EVAP sistemi sorunu. Yakıt kapağını kontrol edin ve sıkıca kapatın. Devam ederse 1 hafta içinde kontrol ettirin.',
      },
    ],
  },
];

// Decision flow for vehicle vibration
const vibrationFlow: DecisionFlowStep[] = [
  {
    id: 1,
    question: 'Titreme ne zaman oluyor?',
    options: [
      { text: 'Rölantide (duruyorken)', nextStepId: 2 },
      { text: 'Hızlanırken', nextStepId: 3 },
      { text: 'Fren yaparken', nextStepId: 4 },
      { text: 'Belirli bir hızda', nextStepId: 5 },
    ],
  },
  {
    id: 2,
    question: 'Titreme motorda mı direksiyonda mı?',
    options: [
      {
        text: 'Motorda',
        nextStepId: null,
        action: 'Muhtemel motor takozları veya ateşleme sistemi sorunu. Bujiler ve bobinler kontrol edilmeli.',
      },
      {
        text: 'Direksiyonda',
        nextStepId: null,
        action: 'Muhtemel rot veya rotil sorunu. Direksiyon sistemi kontrol edilmeli.',
      },
    ],
  },
  {
    id: 3,
    question: 'Hangi devirde titriyor?',
    options: [
      {
        text: 'Düşük devirde',
        nextStepId: null,
        action: 'Muhtemel buji/ateşleme sorunu veya motor takozu. OBD taraması önerilir.',
      },
      {
        text: 'Yüksek devirde',
        nextStepId: null,
        action: 'Muhtemel şanzıman veya aktarma organları sorunu. Profesyonel teşhis gerekli.',
      },
    ],
  },
  {
    id: 4,
    question: 'Titreme nasıl?',
    options: [
      {
        text: 'Direksiyon titriyor',
        nextStepId: null,
        action: 'Ön fren diskleri ovalleşmiş olabilir. Fren diskleri ve balatalar kontrol edilmeli.',
      },
      {
        text: 'Tüm araç titriyor',
        nextStepId: null,
        action: 'Arka fren diskleri veya kampana sorunu olabilir. Fren sistemi tam kontrol edilmeli.',
      },
    ],
  },
  {
    id: 5,
    question: 'Hangi hız aralığında?',
    options: [
      {
        text: '60-80 km/h',
        nextStepId: null,
        action: 'Muhtemel tekerlek balans sorunu. Lastik balans ve rot ayarı kontrol edilmeli.',
      },
      {
        text: '100+ km/h',
        nextStepId: null,
        action: 'Muhtemel lastik veya jant sorunu. Lastikler ve jantlar hasar açısından kontrol edilmeli.',
      },
    ],
  },
];

export const educationalGuides: EducationalGuide[] = [
  {
    id: 1,
    slug: 'check-engine-ne-yapmaliyim',
    title: 'Check Engine Lambası Yanıyorsa Ne Yapmalıyım?',
    metaDescription: 'Check Engine (motor arıza) lambası yandığında ne yapmanız gerektiğini adım adım öğrenin. Acil durumları ve ertelenebilir sorunları ayırt edin.',
    content: `
Check Engine lambası, aracınızın motor yönetim sisteminin bir sorun tespit ettiğini gösterir. Panik yapmayın - her zaman acil bir durum değildir.

## Ne Anlama Gelir?

Check Engine lambası, motorunuzda veya emisyon sisteminde bir sorun olduğunu belirtir. Bu sorun basit bir sensör arızası olabileceği gibi, ciddi bir motor problemi de olabilir.

## Hemen Yapmanız Gerekenler

1. **Lambanın davranışını gözlemleyin**: Sabit mi yanıyor, yanıp mı sönüyor?
2. **Motor performansını kontrol edin**: Titreme, güç kaybı, anormal ses var mı?
3. **Diğer uyarı lambalarını kontrol edin**: Yağ, sıcaklık, akü lambaları da yanıyor mu?

## Ne Zaman Acil?

- Lamba **hızlı yanıp sönüyorsa**: ACİL! Aracı durdurun.
- Motor titriyor veya **güç kaybı** varsa: Bugün servise gidin.
- Aşırı duman veya yanık kokusu varsa: ACİL! Aracı durdurun.

## Ne Zaman Ertelenebilir?

- Lamba sabit yanıyor ve motor normal çalışıyor: 1-2 hafta içinde teşhis
- Sadece lambada sorun görünüyor: Bir sonraki bakımda kontrol

## Önemli İpuçları

- Yakıt kapağını kontrol edin - gevşek kapak lambayı yakabilir
- OBD-II tarayıcı ile kodu okuyun ve nedenini öğrenin
- Profesyonel teşhis için servise gidin
    `,
    category: 'karar-rehberi',
    difficulty: 'kolay',
    estimatedReadTime: 5,
    relatedObdCodes: ['P0420', 'P0171', 'P0300', 'P0442'],
    steps: checkEngineFlow,
    lastUpdated: '2024-12-01',
  },
  {
    id: 2,
    slug: 'arac-titriyorsa-kontrol-listesi',
    title: 'Araç Titriyorsa Ne Yapmalıyım?',
    metaDescription: 'Aracınız titriyorsa nedenleri ve çözümleri öğrenin. Rölanti, hızlanma ve frenleme sırasında titreme sorunlarını teşhis edin.',
    content: `
Araç titresi farklı nedenlere bağlı olabilir. Titreme zamanı ve şekli, sorunu teşhis etmede kritik ipuçları verir.

## Titreme Türleri

### Rölantide Titreme
Motor takozları, bujiler veya ateşleme sistemi sorunlarını işaret edebilir.

### Hızlanırken Titreme
Aktarma organları, enjektörler veya yakıt sistemi sorunları olabilir.

### Frenleme Sırasında Titreme
Fren diskleri veya balatalar kontrol edilmelidir.

### Belirli Hızda Titreme
Lastik balans veya rot ayarı sorunu olabilir.

## Kontrol Listesi

1. **Lastik basınçlarını kontrol edin** - Eşit olmalı
2. **Lastiklerin durumunu inceleyin** - Eşit aşınma olmalı
3. **Motor sesi dinleyin** - Anormal sesler not edin
4. **Direksiyon tepkisini kontrol edin** - Kayma veya sertlik var mı?

## Ne Zaman Servise Gitmeli?

- Titreme giderek artıyorsa
- Güç kaybı eşlik ediyorsa
- Anormal sesler duyuluyorsa
- Check Engine lambası yanıyorsa
    `,
    category: 'karar-rehberi',
    difficulty: 'kolay',
    estimatedReadTime: 4,
    relatedObdCodes: ['P0300', 'P0301', 'P0302', 'P0303'],
    steps: vibrationFlow,
    lastUpdated: '2024-12-01',
  },
  {
    id: 3,
    slug: 'yag-isigi-yandiginda',
    title: 'Yağ Işığı Yandığında Ne Yapmalıyım?',
    metaDescription: 'Yağ uyarı lambası yandığında hemen yapmanız gerekenleri öğrenin. Motor hasarını önlemek için kritik adımlar.',
    content: `
Yağ uyarı lambası, motorunuzun en kritik uyarı sistemlerinden biridir. Bu lamba yandığında **hemen harekete geçmelisiniz**.

## UYARI: Bu ACİL Bir Durumdur!

Yağ lambası yandığında motor yağı basıncı düşmüş demektir. Sürüşe devam etmek **kalıcı motor hasarına** neden olabilir.

## Hemen Yapın

1. **Güvenli bir şekilde kenara çekin**
2. **Motoru kapatın**
3. **5 dakika bekleyin** (yağın karta inmesi için)
4. **Yağ seviyesini kontrol edin**

## Yağ Seviyesini Kontrol Etme

1. Aracı düz bir zemine park edin
2. Motor kapağını açın
3. Yağ çubuğunu çıkarın ve silin
4. Tekrar takıp çıkarın ve seviyeye bakın
5. Seviye MIN işaretinin altındaysa yağ ekleyin

## Yağ Seviyesi Normalse

Yağ seviyesi normal olmasına rağmen lamba yanıyorsa:
- Yağ basınç sensörü arızalı olabilir
- Yağ pompası sorunu olabilir
- **Aracı çalıştırmadan çekici çağırın**

## Önemli

- Yağ lambasıyla asla uzun mesafe sürmeyin
- Uygun yağ tipini kullanın (araç el kitabına bakın)
- Düzenli yağ değişimi yaptırın
    `,
    category: 'karar-rehberi',
    difficulty: 'kolay',
    estimatedReadTime: 3,
    relatedObdCodes: ['P0520', 'P0521', 'P0522', 'P0523'],
    lastUpdated: '2024-12-01',
  },
  {
    id: 4,
    slug: 'arac-bakim-takvimi',
    title: 'Araç Bakım Takvimi Rehberi',
    metaDescription: 'Aracınızın düzenli bakım takvimini öğrenin. Yağ değişimi, filtre değişimi, fren kontrolü ve diğer periyodik bakımlar.',
    content: `
Düzenli bakım, aracınızın ömrünü uzatır ve büyük arızaları önler. İşte temel bakım takvimi:

## Her 10.000 km veya 1 Yılda Bir

- **Motor yağı değişimi**
- **Yağ filtresi değişimi**
- **Genel kontrol** (lastikler, silecekler, lambalar)

## Her 20.000 km veya 2 Yılda Bir

- **Hava filtresi değişimi**
- **Polen filtresi değişimi**
- **Fren sistemi kontrolü**
- **Akü kontrolü**

## Her 40.000 km

- **Buji değişimi** (benzinli motorlar)
- **Fren hidroliği değişimi**
- **Triger kayışı kontrolü**

## Her 60.000 km

- **Debriyaj kontrolü** (manuel vites)
- **Şanzıman yağı değişimi**
- **Triger seti değişimi** (gerekirse)

## Her 100.000 km

- **Soğutma suyu değişimi**
- **Süspansiyon kontrolü**
- **Direksiyon sistemi kontrolü**

## Mevsimsel Bakımlar

### Kış Öncesi
- Antifriz kontrolü
- Akü kontrolü
- Kış lastikleri
- Silecek suyu (antifrizli)

### Yaz Öncesi
- Klima kontrolü
- Soğutma sistemi
- Yaz lastikleri
    `,
    category: 'bakim',
    difficulty: 'kolay',
    estimatedReadTime: 5,
    lastUpdated: '2024-12-01',
  },
];

// Get guide by slug
export function getGuideBySlug(slug: string): EducationalGuide | undefined {
  return educationalGuides.find((guide) => guide.slug === slug);
}

// Get all guide slugs for static generation
export function getAllGuideSlugs(): { slug: string }[] {
  return educationalGuides.map((guide) => ({
    slug: guide.slug,
  }));
}

// Get guides by category
export function getGuidesByCategory(category: string): EducationalGuide[] {
  return educationalGuides.filter((guide) => guide.category === category);
}
