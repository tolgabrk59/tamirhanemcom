#!/usr/bin/env node
/**
 * OBD Kodları Strapi'ye Aktarma Scripti (Sadece POST - Yeni Kayıt)
 * Strapi'deki mevcut veriler silinip bu script çalıştırılacak
 */

const STRAPI_API = 'https://api.tamirhanem.net/api';
const STRAPI_TOKEN = '131dd31cc245cd962ce0429a1bc119f91686a7cc1f50cae059dabd88847af68444c63750a4cc20911655bad7054f7532205e642b48988ce1957668eb1e07f7e71e7dee383b8b33acea5822458a828c360983c43773026ea91ddb9c4dcff749084912a9bc1bb350321c5bd69650acbb17f9bd7e8e381bac9c1406f928882a7b25';

// Detaylı OBD kodları verisi
const obdCodesData = [
    {
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
        solutions: [
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
        estimated_cost_min: 500,
        estimated_cost_max: 4000,
        severity: 'high',
        category: 'Ateşleme Sistemi',
        frequency: 100
    },
    {
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
        solutions: [
            'Oksijen sensörü (O2) kontrolü ve gerekirse değişimi (sensör başı: 300-800 TL)',
            'Katalitik konvertör değişimi (1500-8000 TL arası - araca göre değişir)',
            'Egzoz sistemi kaçak kontrolü ve tamiri',
            'Motor ateşleme sistemi kontrolü',
            'Yakıt sistemi kontrolü (enjektörler, basınç)',
            'Egzoz manifoldu conta kontrolü ve değişimi',
            'ECU yazılım güncellemesi (bazı modellerde)'
        ],
        estimated_cost_min: 300,
        estimated_cost_max: 8000,
        severity: 'medium',
        category: 'Egzoz Sistemi',
        frequency: 95
    },
    {
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
        solutions: [
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
        estimated_cost_min: 200,
        estimated_cost_max: 3000,
        severity: 'high',
        category: 'Yakıt Sistemi',
        frequency: 90
    },
    {
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
        solutions: [
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
        estimated_cost_min: 50,
        estimated_cost_max: 1500,
        severity: 'low',
        category: 'Emisyon Sistemi',
        frequency: 85
    },
    {
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
        solutions: [
            'MAF sensörü temizliği (MAF cleaner sprey ile)',
            'Hava filtresi kontrolü ve değişimi (50-200 TL)',
            'Hava giriş sistemi kaçak kontrolü',
            'MAF sensörü değişimi (400-1500 TL)',
            'Elektrik bağlantıları temizliği',
            'Gaz kelebeği temizliği'
        ],
        estimated_cost_min: 100,
        estimated_cost_max: 2000,
        severity: 'medium',
        category: 'Motor Kontrol',
        frequency: 80
    },
    {
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
        solutions: [
            'Duman testi ile kaçak tespiti',
            'EVAP hortumları ve bağlantıları kontrol',
            'Yakıt deposu kapağı contası değişimi',
            'İlgili valf veya hortum değişimi'
        ],
        estimated_cost_min: 100,
        estimated_cost_max: 1000,
        severity: 'low',
        category: 'Emisyon Sistemi',
        frequency: 75
    },
    {
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
        solutions: [
            'Termostat değişimi (parça+işçilik: 300-800 TL)',
            'Soğutma suyu sıcaklık sensörü değişimi (150-400 TL)',
            'Soğutma suyu seviyesi kontrolü ve tamamlama',
            'Soğutma sistemi kaçak kontrolü',
            'Soğutma suyu değişimi'
        ],
        estimated_cost_min: 200,
        estimated_cost_max: 1000,
        severity: 'medium',
        category: 'Soğutma Sistemi',
        frequency: 70
    },
    {
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
        solutions: [
            'Sensör ve kablolama kontrolü',
            'Konnektör temizliği',
            'Eksantrik mili pozisyon sensörü değişimi (200-600 TL)',
            'Zamanlama kontrolü',
            'Zamanlama kayışı/zinciri kontrolü ve gerekirse değişimi'
        ],
        estimated_cost_min: 250,
        estimated_cost_max: 2500,
        severity: 'high',
        category: 'Motor Kontrol',
        frequency: 65
    }
];

async function addObdCode(code) {
    try {
        const payload = {
            data: {
                code: code.code,
                title: code.title,
                description: code.description,
                symptoms: code.symptoms,
                causes: code.causes,
                solutions: code.solutions,
                estimated_cost_min: code.estimated_cost_min,
                estimated_cost_max: code.estimated_cost_max,
                severity: code.severity,
                category: code.category,
                frequency: code.frequency
            }
        };

        const response = await fetch(
            `${STRAPI_API}/obd-codes`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${STRAPI_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error(`✗ ${code.code} hata:`, error);
            return false;
        }

        console.log(`✓ ${code.code} eklendi`);
        return true;
    } catch (error) {
        console.error(`✗ ${code.code} hata:`, error.message);
        return false;
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log('OBD Kodları Strapi Aktarımı (POST ONLY)');
    console.log('='.repeat(60));
    console.log(`\n⚠️  ÖNEMLİ: Strapi'deki mevcut OBD Code verilerini SİLİN!`);
    console.log(`   Sonra bu scripti çalıştırın.\n`);
    console.log(`Toplam ${obdCodesData.length} kod eklenecek\n`);

    let success = 0;
    let failed = 0;

    for (const code of obdCodesData) {
        const result = await addObdCode(code);
        if (result) success++;
        else failed++;
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n' + '='.repeat(60));
    console.log('TAMAMLANDI');
    console.log('='.repeat(60));
    console.log(`Başarılı: ${success}`);
    console.log(`Başarısız: ${failed}`);
}

main().catch(console.error);
