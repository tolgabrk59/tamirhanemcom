import type { FAQ } from '@/types';

export const faqData: FAQ[] = [
  {
    id: 1,
    question: 'OBD-II arıza kodu nedir ve nasıl okunur?',
    answer: `OBD-II (On-Board Diagnostics II), aracınızın motor ve emisyon sistemlerini izleyen standart bir teşhis protokolüdür. 1996'dan itibaren üretilen tüm araçlarda bulunur.

Arıza kodlarını okumak için:
1. OBD-II tarayıcı cihazı edinin (fiyatları 100 TL'den başlar)
2. Cihazı direksiyonun altındaki OBD-II portuna takın
3. Kontağı açın (motoru çalıştırmayın)
4. Tarayıcıda "Oku" veya "Scan" seçeneğini kullanın
5. Kodları not alın ve anlamlarını araştırın

Alternatif olarak, birçok oto servis ve yedek parça mağazası ücretsiz kod okuma hizmeti sunmaktadır.`,
    category: 'OBD ve Arıza Kodları'
  },
  {
    id: 2,
    question: 'Check Engine (motor arıza) lambası yandığında ne yapmalıyım?',
    answer: `Check Engine lambası yandığında yapmanız gerekenler:

**Yanıp sönmüyorsa (sabit yanıyorsa):**
- Panik yapmayın, genellikle acil durum değildir
- Yakıt deposu kapağını kontrol edin (gevşek olabilir)
- Aracınızı en kısa sürede bir servise götürün
- Normal sürüşe devam edebilirsiniz ama geciktirmeyin

**Yanıp sönüyorsa:**
- Bu ciddi bir motor arızasına işaret eder
- Aracı hemen yavaşlatın ve güvenli bir yere çekin
- Motoru durdurun
- Çekici çağırın, sürmeye devam etmeyin

Yanıp sönen Check Engine lambası genellikle ateşleme hatası (misfire) anlamına gelir ve katalitik konvertörünüze zarar verebilir.`,
    category: 'OBD ve Arıza Kodları'
  },
  {
    id: 3,
    question: 'TamirHanem üzerinden nasıl fiyat teklifi alabilirim?',
    answer: `TamirHanem üzerinden fiyat teklifi almak çok kolay:

1. **Araç Bilgilerinizi Girin:** Marka, model ve yıl bilgilerini seçin
2. **Servis İhtiyacını Belirleyin:** Yapmak istediğiniz işlemi seçin veya belirtileri açıklayın
3. **Konum Seçin:** Size en yakın anlaşmalı servisleri görün
4. **Teklifleri Karşılaştırın:** Farklı servislerden gelen teklifleri değerlendirin
5. **Randevu Alın:** Size uygun servisi ve zamanı seçin

Tüm fiyatlar şeffaf şekilde gösterilir ve sürpriz masraflarla karşılaşmazsınız. Ayrıca işlem sonrası değerlendirme yaparak diğer kullanıcılara yardımcı olabilirsiniz.`,
    category: 'Hizmetler'
  },
  {
    id: 4,
    question: 'Araç bakımını ne sıklıkla yaptırmalıyım?',
    answer: `Araç bakım sıklığı aracınızın markası, modeli ve kullanım şekline göre değişir. Genel kurallar:

**Yağ ve Filtre Değişimi:**
- Benzinli araçlar: 10.000 - 15.000 km veya 1 yıl
- Dizel araçlar: 15.000 - 20.000 km veya 1 yıl
- Sentetik yağ kullanıyorsanız aralıklar uzayabilir

**Genel Bakım:**
- Her 20.000 - 30.000 km'de kapsamlı kontrol
- Fren sistemi, süspansiyon, lastikler

**Büyük Bakım:**
- 60.000 - 100.000 km aralıklarında
- Triger kayışı, bujiler, şanzıman yağı

**Önemli:** Aracınızın bakım kitapçığındaki üretici önerilerini takip edin. Şehir içi ve kısa mesafe kullanımı bakım aralıklarını kısaltabilir.`,
    category: 'Bakım'
  },
  {
    id: 5,
    question: 'Orijinal yedek parça mı, muadil mi kullanmalıyım?',
    answer: `Bu karar bütçenize ve önceliklerinize bağlıdır:

**Orijinal (OEM) Parçalar:**
✅ Üretici garantisi
✅ Mükemmel uyum
✅ Uzun ömür
❌ Daha pahalı

**OES (Original Equipment Supplier) Parçalar:**
✅ Orijinal üretici tarafından yapılmış
✅ OEM ile aynı kalite
✅ Daha uygun fiyat
Örnek: Bosch, Valeo, Continental

**Muadil (Aftermarket) Parçalar:**
✅ Ekonomik
✅ Geniş seçenek
❌ Kalite değişkenliği
❌ Uyum sorunları olabilir

**Tavsiye:** Güvenlik parçaları (fren, süspansiyon) için orijinal veya kaliteli OES tercih edin. Kozmetik parçalarda muadil kullanabilirsiniz.`,
    category: 'Yedek Parça'
  },
  {
    id: 6,
    question: 'Araç garanti süresi içindeyken dışarıda bakım yaptırabilir miyim?',
    answer: `Evet, Türkiye'de 2020 yılından itibaren yürürlükte olan düzenlemelerle araç garantinizi koruyarak yetkili servis dışında bakım yaptırabilirsiniz.

**Şartlar:**
1. Bakımda kullanılan parçalar üretici standartlarına uygun olmalı
2. İşlem, yetkili bir serviste yapılmalı (TamirHanem anlaşmalı servisler dahil)
3. Bakım kayıtları düzenli tutulmalı
4. Fatura ve işlem kayıtları saklanmalı

**Dikkat Edilecekler:**
- Motor ve şanzıman garantisi için özellikle dikkatli olun
- Yağ ve sıvı değişimlerinde üretici onaylı ürünler kullanın
- Kilometre ve tarih kayıtlarını belgeleyin

TamirHanem'deki tüm anlaşmalı servisler bu standartlara uygundur ve bakım kayıtlarınız dijital olarak saklanır.`,
    category: 'Garanti'
  },
  {
    id: 7,
    question: 'Fiyat hesaplama aracı nasıl çalışıyor?',
    answer: `TamirHanem fiyat hesaplama aracı, size tahmini maliyet bilgisi sunar:

**Hesaplama Faktörleri:**
- Araç markası ve modeli
- Model yılı
- İşlem türü
- Bölgesel fiyat farklılıkları
- Parça tipi (orijinal/muadil)

**Fiyat Aralığı:**
- Minimum fiyat: Muadil parça + ekonomik işçilik
- Maksimum fiyat: Orijinal parça + premium servis

**Önemli Not:**
Bu tahminler genel piyasa verilerine dayanır. Gerçek fiyat:
- Aracın mevcut durumuna
- Ek arıza tespitlerine
- Seçtiğiniz servise
bağlı olarak değişebilir.

Kesin fiyat için TamirHanem üzerinden servislerden teklif alın.`,
    category: 'Fiyatlandırma'
  },
  {
    id: 8,
    question: 'Elektrikli/Hibrit araçlar için de hizmet var mı?',
    answer: `Evet, TamirHanem elektrikli ve hibrit araçlar için de hizmet sunmaktadır.

**Sunulan Hizmetler:**
- Batarya sağlık kontrolü
- Şarj sistemi bakımı
- Rejeneratif fren sistemi kontrolü
- Yazılım güncellemeleri
- Genel bakım işlemleri

**Uzman Servisler:**
Elektrikli araç servisi özel eğitim ve ekipman gerektirir. TamirHanem'de yalnızca sertifikalı elektrikli araç servisleri listelenir.

**Marka Özel Hizmetler:**
- Tesla
- BMW i Serisi
- Mercedes EQ
- Volkswagen ID
- Hyundai/Kia EV
- ve diğerleri

Aracınızı seçtiğinizde size uygun servisleri otomatik olarak filtreliyoruz.`,
    category: 'Elektrikli Araçlar'
  }
];

export function getFAQsByCategory(category: string): FAQ[] {
  return faqData.filter((faq) => faq.category === category);
}

export function getFAQCategories(): string[] {
  return [...new Set(faqData.map((faq) => faq.category).filter(Boolean))] as string[];
}
