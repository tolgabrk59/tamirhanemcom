import type { CommonProblem } from '@/types';

export const commonProblemsData: CommonProblem[] = [
  // Mercedes Sorunları
  {
    id: 1,
    brand: 'Mercedes',
    model: 'C-Serisi',
    title: 'Airmatic Süspansiyon Arızası',
    description: 'Havalı süspansiyon sisteminde yaşanan arızalar, özellikle W205 ve W204 serisinde sık görülür. Araç bir tarafa çökme, sürüş sertliği değişimi ve uyarı lambaları yanar.',
    symptoms: [
      'Araç bir tarafa eğik duruyor',
      'Sürüş kalitesinde bozulma',
      'Süspansiyon uyarı lambası',
      'Kompresör sesi'
    ],
    estimatedCost: '5.000 - 25.000 TL',
    frequency: 'Sık (100.000 km üzeri araçlarda)'
  },
  {
    id: 2,
    brand: 'Mercedes',
    model: 'E-Serisi',
    title: 'Kam Mili Ayarlayıcı (Camshaft Adjuster) Arızası',
    description: 'M272 ve M273 motorlarda yaygın görülen bir sorun. Motor çalışırken tıkırtı sesi ve performans kaybı yaşanır.',
    symptoms: [
      'Motordan tıkırtı sesi',
      'Check Engine lambası',
      'Güç kaybı',
      'Rölantide düzensizlik'
    ],
    estimatedCost: '8.000 - 15.000 TL',
    frequency: 'Orta sıklıkta (80.000-150.000 km arası)'
  },
  {
    id: 3,
    brand: 'Mercedes',
    model: 'Genel',
    title: 'Direksiyon Kilidi (EIS/ELV) Arızası',
    description: 'Elektronik kontak sistemi arızası, aracın çalışmamasına neden olur. Direksiyon kilidi açılmaz veya anahtar tanınmaz.',
    symptoms: [
      'Anahtar tanınmıyor',
      'Direksiyon kilidi açılmıyor',
      'Araç çalışmıyor',
      'Göstergede uyarı'
    ],
    estimatedCost: '3.000 - 8.000 TL',
    frequency: 'Orta sıklıkta'
  },

  // BMW Sorunları
  {
    id: 4,
    brand: 'BMW',
    model: '3 Serisi',
    title: 'VANOS Sistemi Arızası',
    description: 'Değişken supap zamanlaması sistemi arızası. Özellikle E46 ve E90 modellerinde yaygın. Güç kaybı ve yakıt tüketimi artışına neden olur.',
    symptoms: [
      'Motor performans kaybı',
      'Rölantide titreşim',
      'Yakıt tüketimi artışı',
      'Motordan ses',
      'Check Engine lambası'
    ],
    estimatedCost: '4.000 - 12.000 TL',
    frequency: 'Sık (özellikle eski modellerde)'
  },
  {
    id: 5,
    brand: 'BMW',
    model: '5 Serisi',
    title: 'Şanzıman Mekatronik Ünitesi Arızası',
    description: 'Otomatik şanzıman kontrol ünitesi arızası. ZF şanzımanlı modellerde yaygın. Vites geçişlerinde sertlik ve hata kodları oluşur.',
    symptoms: [
      'Sert vites geçişleri',
      'Şanzıman uyarı lambası',
      'Araç limp moduna geçiyor',
      'Vites atlama hissi'
    ],
    estimatedCost: '8.000 - 20.000 TL',
    frequency: 'Orta sıklıkta (yüksek kilometreli araçlarda)'
  },
  {
    id: 6,
    brand: 'BMW',
    model: 'X5',
    title: 'Transfer Case (Şaft Kutusu) Arızası',
    description: 'Dört çeker sistemin transfer kutusu arızası. X5 E53 ve E70 modellerinde sık görülür.',
    symptoms: [
      '4x4 uyarı lambası',
      'Sürüşte titreşim',
      'Dört çeker sistem devre dışı',
      'Anormal sesler'
    ],
    estimatedCost: '10.000 - 25.000 TL',
    frequency: 'Orta sıklıkta'
  },

  // Renault Sorunları
  {
    id: 7,
    brand: 'Renault',
    model: 'Megane',
    title: 'Çift Kavrama (EDC) Şanzıman Arızası',
    description: 'EDC (Efficient Dual Clutch) şanzıman, debriyaj aşınması ve mekatronik sorunları yaşayabilir. Özellikle Megane 3 ve 4 modellerinde yaygın.',
    symptoms: [
      'Vites geçişlerinde sarsıntı',
      'Kalkışta titreme',
      'Şanzıman uyarı lambası',
      'Araç kalkışta zorlanıyor'
    ],
    estimatedCost: '6.000 - 18.000 TL',
    frequency: 'Sık (özellikle şehir içi kullanımda)'
  },
  {
    id: 8,
    brand: 'Renault',
    model: 'Clio',
    title: 'Gaz Kelebeği (Throttle Body) Arızası',
    description: 'Elektronik gaz kelebeği sensör veya motor arızası. Clio 3 ve 4 modellerinde sık karşılaşılır.',
    symptoms: [
      'Rölantide düzensizlik',
      'Motor stop ediyor',
      'Gaz tepkisinde gecikme',
      'Check Engine lambası'
    ],
    estimatedCost: '1.500 - 4.000 TL',
    frequency: 'Sık'
  },
  {
    id: 9,
    brand: 'Renault',
    model: 'Genel',
    title: 'Turbo Arızası',
    description: '1.5 dCi motorlarda turbo arızası yaygın görülür. Yağ kaçağı, türbin hasarı veya wastegate sorunları oluşabilir.',
    symptoms: [
      'Güç kaybı',
      'Siyah veya mavi egzoz dumanı',
      'Türbinden ıslık sesi',
      'Yağ tüketimi artışı'
    ],
    estimatedCost: '5.000 - 15.000 TL',
    frequency: 'Orta sıklıkta (yüksek kilometrede)'
  },

  // Volkswagen Sorunları
  {
    id: 10,
    brand: 'Volkswagen',
    model: 'Golf',
    title: 'DSG Şanzıman Mekatronik Arızası',
    description: '7 ileri DSG şanzımanda mekatronik ünite ve debriyaj sorunları. Golf 6 ve 7 modellerinde görülür.',
    symptoms: [
      'Vites geçişlerinde titreme',
      'Kalkışta sarsıntı',
      'Şanzıman uyarı lambası',
      'Limp moda geçme'
    ],
    estimatedCost: '8.000 - 20.000 TL',
    frequency: 'Orta sıklıkta'
  },
  {
    id: 11,
    brand: 'Volkswagen',
    model: 'Passat',
    title: 'Zamanlama Zinciri Uzaması',
    description: 'TSI ve TFSI motorlarda zamanlama zinciri uzaması problemi. Motor çalışma sesinde değişiklik ve performans kaybı yaşanır.',
    symptoms: [
      'Motordan zincir sesi',
      'Soğuk çalışmada gürültü',
      'Güç kaybı',
      'Check Engine lambası'
    ],
    estimatedCost: '6.000 - 12.000 TL',
    frequency: 'Sık (1.4 TSI motorlarda)'
  },

  // Ford Sorunları
  {
    id: 13,
    brand: 'Ford',
    model: 'Focus',
    title: 'DPF (Dizel Partikül Filtresi) Tıkanması',
    description: 'Özellikle kısa mesafe şehir içi kullanımda DPF tıkanması yaygın. Yağ ömrü hızla azalır ve DPF uyarı lambası yanar. 2024 modellerinde de rapor edilmiş.',
    symptoms: [
      'DPF uyarı lambası',
      'Motor gücünde düşüş',
      'Yakıt tüketimi artışı',
      'Yağ seviyesi hızla azalıyor',
      'Motor rölantide düzensiz'
    ],
    estimatedCost: '3.000 - 12.000 TL',
    frequency: 'Sık (kısa mesafe kullanımda)'
  },
  {
    id: 14,
    brand: 'Ford',
    model: 'Focus',
    title: 'Powershift Otomatik Şanzıman Arızası',
    description: 'Çift kavramalı Powershift şanzımanda vites geçişlerinde sarsıntı, sert vites değişimi ve yazılım sorunları. Birçok model yılında yaygın.',
    symptoms: [
      'Vites geçişlerinde sarsıntı',
      'Kalkışta titreme',
      'Sert vites değişimi',
      'Şanzıman uyarı lambası',
      'Geri viteste zorluk'
    ],
    estimatedCost: '5.000 - 18.000 TL',
    frequency: 'Sık (özellikle şehir içi kullanımda)'
  },
  {
    id: 15,
    brand: 'Ford',
    model: 'Transit',
    title: 'EGR Valfi Tıkanması',
    description: 'Egzoz gazı geri dönüşüm valfinde karbon birikimi. Motor performansında düşüş ve yakıt tüketiminde artış yaşanır. Hem Focus hem Transit modellerinde yaygın.',
    symptoms: [
      'Motor gücünde kayıp',
      'Yakıt tüketimi artışı',
      'Siyah egzoz dumanı',
      'Rölantide düzensizlik',
      'Check Engine lambası'
    ],
    estimatedCost: '2.000 - 6.000 TL',
    frequency: 'Sık (dizel modellerde)'
  },

  // Audi Sorunları
  {
    id: 16,
    brand: 'Audi',
    model: 'A4',
    title: 'Yağ Tüketimi Sorunu',
    description: '2.0 TFSI motorlarda aşırı yağ tüketimi sorunu. Piston segmanları ve silindir cidarı aşınmasından kaynaklanır.',
    symptoms: [
      'Aşırı yağ tüketimi (1000 km\'de 1 litre)',
      'Mavi egzoz dumanı',
      'Yağ seviyesi uyarısı',
      'Katalitik konvertör hasarı'
    ],
    estimatedCost: '10.000 - 30.000 TL',
    frequency: 'Sık (2009-2012 arası üretim)'
  }
];

// Markaya göre sorunları getir
export function getProblemsByBrand(brand: string): CommonProblem[] {
  return commonProblemsData.filter(
    (p) => p.brand.toLowerCase() === brand.toLowerCase()
  );
}

// Tüm markaları getir
export function getUniqueBrands(): string[] {
  return Array.from(new Set(commonProblemsData.map((p) => p.brand)));
}
