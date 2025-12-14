import type { ObdCode } from '@/types';

// Türkçeleştirilmiş OBD Kod Verileri (RepairPal seviyesinde detaylı)
export const obdCodesData: ObdCode[] = [
  {
    id: 1,
    code: 'P0300',
    title: 'Rastgele/Çoklu Silindir Ateşleme Hatası Algılandı',
    description: `P0300 arıza kodu, motorun birden fazla silindirinde veya rastgele ateşleme hatası (misfire) algılandığını gösterir. Bu durum, motor kontrol ünitesi (ECU) tarafından krank mili pozisyon sensörü aracılığıyla tespit edilir.

Ateşleme hatası, silindir içindeki yakıt-hava karışımının düzgün yanmaması durumunda meydana gelir. Bu sorun motor performansını ciddi şekilde etkiler ve uzun vadede katalitik konvertöre zarar verebilir.

UYARI: Bu arıza koduyla aracınızı uzun süre kullanmak, egzoz sistemine kalıcı hasar verebilir ve tamir maliyetlerini önemli ölçüde artırabilir.`,
    symptoms: [
      'Motor titremesi ve sarsıntı (özellikle rölantide)',
      'Hızlanma sırasında güç kaybı',
      'Artan yakıt tüketimi',
      'Check Engine (motor arıza) lambası yanıyor',
      'Egzozdan düzensiz ses veya koku',
      'Motor sarsarak çalışıyor',
      'Aracın silkelenme hissi'
    ],
    causes: [
      'Aşınmış veya arızalı buji/bujiler',
      'Buji kabloları hasarlı veya bağlantıları gevşek',
      'Ateşleme bobini (ignition coil) arızası',
      'Yakıt enjektörü tıkalı veya arızalı',
      'Yakıt pompası yetersiz basınç sağlıyor',
      'Vakum kaçağı (emme manifoldu)',
      'Düşük yakıt basıncı',
      'EGR valfi arızası',
      'Silindir kapağı contası hasarlı',
      'Düşük silindir kompresyonu',
      'Kirli veya arızalı hava akış sensörü (MAF)'
    ],
    fixes: [
      'Buji kontrolü ve gerekirse değişimi (4 silindir araçlar için set: 400-800 TL)',
      'Buji kabloları kontrolü ve değişimi',
      'Ateşleme bobini testi ve değişimi (parça başı: 500-1500 TL)',
      'Yakıt enjektörü temizliği veya değişimi',
      'Yakıt filtresi değişimi',
      'Vakum hortumları kontrolü ve değişimi',
      'MAF sensörü temizliği (MAF temizleyici ile) veya değişimi',
      'Kompresyon testi yaptırılması',
      'EGR valfi temizliği veya değişimi'
    ],
    estimatedCostMin: 500,
    estimatedCostMax: 4000,
    severity: 'high',
    category: 'Ateşleme Sistemi'
  },
  {
    id: 2,
    code: 'P0420',
    title: 'Katalitik Konvertör Sistem Verimliliği Eşik Altında (Bank 1)',
    description: `P0420 arıza kodu, katalitik konvertörün (katalizör) beklenen verimlilik seviyesinin altında çalıştığını gösterir. Motor kontrol ünitesi, katalitik konvertör öncesi ve sonrasındaki oksijen sensörlerinin sinyallerini karşılaştırarak bu durumu tespit eder.

Normal çalışma koşullarında, katalitik konvertör sonrasındaki oksijen sensörü (downstream O2 sensor) neredeyse sabit bir sinyal üretmelidir. Eğer bu sensörün sinyali, konvertör öncesindeki sensörle benzer dalgalanmalar gösteriyorsa, katalitik konvertörün verimli çalışmadığı anlaşılır.

ÖNEMLİ: Katalitik konvertör değişimi pahalı bir işlemdir. Öncelikle oksijen sensörlerinin ve diğer olası nedenlerin kontrol edilmesi önerilir.`,
    symptoms: [
      'Check Engine (motor arıza) lambası yanıyor',
      'Hafif güç kaybı hissedilebilir',
      'Egzozdan kükürt (çürük yumurta) kokusu',
      'Yakıt tüketiminde hafif artış',
      'Egzoz emisyon testinden kalma',
      'Motor performansında genel düşüş'
    ],
    causes: [
      'Katalitik konvertör aşınmış veya hasarlı',
      'Oksijen sensörü (O2 sensor) arızalı',
      'Egzoz kaçağı (katalitik konvertör öncesinde)',
      'Motor ateşleme hatası (bujiler, bobinler)',
      'Zengin yakıt karışımı sorunu',
      'Fakir yakıt karışımı sorunu',
      'Motor yağı veya antifriz sızıntısı (içten)',
      'Katalitik konvertör ısı kalkanı hasarı',
      'Egzoz manifoldu çatlağı'
    ],
    fixes: [
      'Oksijen sensörü (O2) kontrolü ve gerekirse değişimi (sensör başı: 300-800 TL)',
      'Katalitik konvertör değişimi (1500-8000 TL arası - araca göre değişir)',
      'Egzoz sistemi kaçak kontrolü ve tamiri',
      'Motor ateşleme sistemi kontrolü',
      'Yakıt sistemi kontrolü (enjektörler, basınç)',
      'Egzoz manifoldu conta kontrolü ve değişimi',
      'ECU yazılım güncellemesi (bazı modellerde)'
    ],
    estimatedCostMin: 300,
    estimatedCostMax: 8000,
    severity: 'medium',
    category: 'Egzoz Sistemi'
  },
  {
    id: 3,
    code: 'P0171',
    title: 'Sistem Çok Fakir (Bank 1) - Yakıt Karışımı Sorunu',
    description: `P0171 arıza kodu, motor kontrol ünitesinin (ECU) yakıt karışımını normalden daha fazla zenginleştirmek zorunda kaldığını gösterir. Bu durum "fakir karışım" olarak adlandırılır ve silindirlere giren hava miktarının yakıta oranla fazla olduğu anlamına gelir.

ECU, oksijen sensörü verilerine göre yakıt enjeksiyonunu sürekli ayarlar. Uzun süreli yakıt düzeltme değerleri (Long Term Fuel Trim) +%25'in üzerine çıktığında bu kod tetiklenir.

DİKKAT: Fakir karışımla uzun süre sürüş yapmak motor hasarına (piston yanması, supap hasarı) yol açabilir.`,
    symptoms: [
      'Motor rölantide zor çalışıyor veya stop ediyor',
      'Hızlanırken takılma veya boğulma',
      'Motor titremesi',
      'Check Engine lambası yanıyor',
      'Yakıt tüketiminde anormallik',
      'Soğuk havada çalıştırma zorluğu',
      'Motor yüksek devirde güç kaybı',
      'Ara sıra geri tepme (backfire)'
    ],
    causes: [
      'Vakum kaçağı (emme manifoldu, hortumlar)',
      'Hava akış sensörü (MAF) kirli veya arızalı',
      'Yakıt enjektörü tıkalı veya kirli',
      'Yakıt filtresi tıkalı',
      'Yakıt pompası zayıf',
      'PCV valfi arızalı',
      'Oksijen sensörü yanlış sinyal veriyor',
      'Emme manifoldu contası kaçırıyor',
      'Düşük yakıt basıncı',
      'Egzoz kaçağı (O2 sensörü öncesinde)'
    ],
    fixes: [
      'Vakum hortumları ve bağlantı noktaları kontrolü - kaçak tespiti',
      'MAF sensörü temizliği (özel MAF temizleyici ile: 80-150 TL)',
      'MAF sensörü değişimi gerekirse (400-1200 TL)',
      'Yakıt enjektörü temizliği veya değişimi',
      'Yakıt filtresi değişimi (100-300 TL)',
      'Yakıt pompası ve basınç testi',
      'PCV valfi kontrolü ve değişimi (50-200 TL)',
      'Emme manifoldu contası değişimi',
      'Egzoz sistemi kaçak kontrolü',
      'O2 sensörü kontrolü ve gerekirse değişimi'
    ],
    estimatedCostMin: 200,
    estimatedCostMax: 3000,
    severity: 'high',
    category: 'Yakıt Sistemi'
  },
  {
    id: 4,
    code: 'P0455',
    title: 'Evaporatif Emisyon (EVAP) Sistemi - Büyük Kaçak Algılandı',
    description: `P0455 arıza kodu, evaporatif emisyon kontrol sisteminde (EVAP) büyük bir kaçak tespit edildiğini gösterir. EVAP sistemi, yakıt deposundan buharlaşan yakıt buharlarının atmosfere salınmasını engelleyerek çevre kirliliğini azaltır.

Bu sistem, yakıt buharlarını toplar ve motor çalışırken bu buharları kontrollü şekilde yakarak bertaraf eder. Sistemde bir kaçak olduğunda, motor kontrol ünitesi bu durumu basınç testleri ile algılar.

İYİ HABER: P0455 kodu genellikle ciddi bir motor arızasına işaret etmez. Çoğu durumda basit ve ucuz bir tamir ile çözülebilir. En yaygın neden gevşek veya hasarlı yakıt deposu kapağıdır.`,
    symptoms: [
      'Check Engine lambası yanıyor',
      'Yakıt kokusu (özellikle park halinde veya sıcak havalarda)',
      'Yakıt deposu kapağı uyarı lambası',
      'Genellikle sürüş performansını etkilemez',
      'Emisyon testinden kalma'
    ],
    causes: [
      'Yakıt deposu kapağı gevşek, hasarlı veya eksik',
      'Yakıt deposu kapağı contası aşınmış',
      'EVAP buhar hortumu çatlak veya bağlantısı kopuk',
      'EVAP kömür kutusu (charcoal canister) hasarlı',
      'Purge valfi arızalı',
      'Vent valfi arızalı',
      'Yakıt deposu veya boyun kısmında çatlak',
      'EVAP basınç sensörü arızalı',
      'Yakıt doldurma borusu bağlantı sorunu'
    ],
    fixes: [
      'Yakıt deposu kapağı kontrolü - sıkıca kapatın, "tık" sesi gelene kadar çevirin',
      'Yakıt deposu kapağı değişimi (50-200 TL)',
      'EVAP hortumları görsel kontrolü ve değişimi',
      'Duman testi ile kaçak noktası tespiti',
      'EVAP kömür kutusu değişimi (300-800 TL)',
      'Purge valfi değişimi (200-500 TL)',
      'Vent valfi değişimi (200-500 TL)',
      'Yakıt deposu boyun contası değişimi',
      'Yakıt deposu tamiri veya değişimi (ciddi hasarlarda)'
    ],
    estimatedCostMin: 50,
    estimatedCostMax: 1500,
    severity: 'low',
    category: 'Emisyon Sistemi'
  },
  {
    id: 5,
    code: 'P0101',
    title: 'Kütle Hava Akış (MAF) Sensörü Devre Aralığı/Performans Sorunu',
    description: `P0101 arıza kodu, Kütle Hava Akış (MAF) sensöründen gelen sinyalin beklenen aralık dışında olduğunu veya performans sorunları gösterdiğini belirtir. MAF sensörü, motora giren hava miktarını ölçer ve bu bilgi yakıt enjeksiyonunun doğru hesaplanması için kritik öneme sahiptir.

Motor kontrol ünitesi, MAF sensörü değerlerini motor devri, gaz kelebeği pozisyonu ve diğer sensörlerle karşılaştırır. Uyumsuzluk tespit edildiğinde bu kod oluşur.`,
    symptoms: [
      'Motor düzensiz rölanti',
      'Hızlanmada güç kaybı veya gecikme',
      'Motor stop edebilir',
      'Siyah egzoz dumanı',
      'Yakıt tüketimi artışı',
      'Soğuk çalıştırma zorluğu',
      'Check Engine lambası'
    ],
    causes: [
      'MAF sensörü kirli',
      'MAF sensörü arızalı',
      'Hava filtresi çok kirli veya tıkalı',
      'Hava giriş borusu çatlak veya gevşek',
      'MAF sensörü elektrik bağlantısı sorunlu',
      'Vakum kaçağı',
      'Throttle body (gaz kelebeği) kirli'
    ],
    fixes: [
      'MAF sensörü temizliği (MAF cleaner sprey ile)',
      'Hava filtresi kontrolü ve değişimi (50-200 TL)',
      'Hava giriş sistemi kaçak kontrolü',
      'MAF sensörü değişimi (400-1500 TL)',
      'Elektrik bağlantıları temizliği',
      'Gaz kelebeği temizliği'
    ],
    estimatedCostMin: 100,
    estimatedCostMax: 2000,
    severity: 'medium',
    category: 'Motor Kontrol'
  },
  {
    id: 6,
    code: 'P0442',
    title: 'Evaporatif Emisyon (EVAP) Sistemi - Küçük Kaçak Algılandı',
    description: `P0442 kodu, EVAP sisteminde küçük bir kaçak tespit edildiğini gösterir. P0455'e benzer şekilde çalışır ancak daha küçük kaçakları ifade eder. Bu kaçaklar genellikle 0.5mm çapından küçük delikler veya gevşek bağlantılardır.`,
    symptoms: [
      'Check Engine lambası',
      'Hafif yakıt kokusu',
      'Genellikle performansı etkilemez',
      'Emisyon testinden kalma'
    ],
    causes: [
      'EVAP hortumlarında çatlak',
      'Bağlantı noktalarında gevşeklik',
      'Yakıt deposu kapağı contası aşınmış',
      'EVAP kömür kutusunda küçük çatlak',
      'Purge veya vent valfi hafif kaçırıyor'
    ],
    fixes: [
      'Duman testi ile kaçak tespiti',
      'EVAP hortumları ve bağlantıları kontrol',
      'Yakıt deposu kapağı contası değişimi',
      'İlgili valf veya hortum değişimi'
    ],
    estimatedCostMin: 100,
    estimatedCostMax: 1000,
    severity: 'low',
    category: 'Emisyon Sistemi'
  },
  {
    id: 7,
    code: 'P0128',
    title: 'Soğutma Suyu Termostatı - Düşük Sıcaklık',
    description: `P0128 arıza kodu, motor soğutma suyunun beklenen sürede çalışma sıcaklığına ulaşmadığını gösterir. Bu genellikle termostatın açık konumda takılı kalması veya soğutma suyu sıcaklık sensörü sorununu işaret eder.

Motor, optimum performans ve yakıt verimliliği için belirli bir sıcaklıkta çalışmalıdır (genellikle 90-105°C). Termostat, bu sıcaklığı düzenler.`,
    symptoms: [
      'Motor geç ısınıyor',
      'Kalorifer yeterince ısıtmıyor',
      'Yakıt tüketimi artışı',
      'Check Engine lambası',
      'Sıcaklık göstergesi normal seviyeye ulaşmıyor'
    ],
    causes: [
      'Termostat açık pozisyonda takılı kalmış',
      'Termostat tamamen arızalı',
      'Soğutma suyu sıcaklık sensörü arızalı',
      'Düşük soğutma suyu seviyesi',
      'Soğutma sistemi kaçağı'
    ],
    fixes: [
      'Termostat değişimi (parça+işçilik: 300-800 TL)',
      'Soğutma suyu sıcaklık sensörü değişimi (150-400 TL)',
      'Soğutma suyu seviyesi kontrolü ve tamamlama',
      'Soğutma sistemi kaçak kontrolü',
      'Soğutma suyu değişimi'
    ],
    estimatedCostMin: 200,
    estimatedCostMax: 1000,
    severity: 'medium',
    category: 'Soğutma Sistemi'
  },
  {
    id: 8,
    code: 'P0340',
    title: 'Eksantrik Mili Pozisyon Sensörü "A" Devre Arızası (Bank 1)',
    description: `P0340 arıza kodu, eksantrik mili (kam mili) pozisyon sensöründen sinyal alınamadığını veya sinyalin beklenen aralık dışında olduğunu gösterir. Bu sensör, supap zamanlaması ve yakıt enjeksiyon kontrolü için kritiktir.`,
    symptoms: [
      'Motor çalışmıyor veya zor çalışıyor',
      'Motor sarsılarak çalışıyor',
      'Motor ani stop edebilir',
      'Check Engine lambası',
      'Güç kaybı',
      'Yakıt tüketimi artışı'
    ],
    causes: [
      'Eksantrik mili pozisyon sensörü arızalı',
      'Sensör kablolaması hasarlı',
      'Sensör konnektörü kirli veya gevşek',
      'Zamanlama kayışı/zinciri atlamış',
      'Ton wheel (dişli) hasarlı',
      'ECU arızası (nadir)'
    ],
    fixes: [
      'Sensör ve kablolama kontrolü',
      'Konnektör temizliği',
      'Eksantrik mili pozisyon sensörü değişimi (200-600 TL)',
      'Zamanlama kontrolü',
      'Zamanlama kayışı/zinciri kontrolü ve gerekirse değişimi'
    ],
    estimatedCostMin: 250,
    estimatedCostMax: 2500,
    severity: 'high',
    category: 'Motor Kontrol'
  }
];

// Yardımcı fonksiyonlar
export function getObdCodeByCodeLocal(code: string): ObdCode | undefined {
  return obdCodesData.find(
    (item) => item.code.toUpperCase() === code.toUpperCase()
  );
}

export function searchObdCodesLocal(query: string): ObdCode[] {
  const lowerQuery = query.toLowerCase();
  return obdCodesData.filter(
    (item) =>
      item.code.toLowerCase().includes(lowerQuery) ||
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
  );
}

export function getObdCodesByCategory(category: string): ObdCode[] {
  return obdCodesData.filter((item) => item.category === category);
}

export function getObdCategories(): string[] {
  return [...new Set(obdCodesData.map((item) => item.category))];
}

export function getPopularObdCodesLocal(limit: number = 6): ObdCode[] {
  // Return the first N codes as they are already ordered by popularity/frequency
  return obdCodesData.slice(0, limit);
}

