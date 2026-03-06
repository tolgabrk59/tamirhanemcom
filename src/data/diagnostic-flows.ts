// İnteraktif Teşhis Akışları
// Adım adım sorularla arıza teşhisi

export interface DiagnosticStep {
  id: string;
  question?: string;
  instruction?: string;
  options?: {
    label: string;
    nextStepId: string | null;
    warning?: string;
  }[];
  conclusion?: {
    title: string;
    description: string;
    obdCodes?: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
    action: string;
    estimatedCost?: string;
  };
  toolRequired?: string;
  safetyWarning?: string;
}

export interface DiagnosticFlow {
  id: string;
  title: string;
  description: string;
  icon: string;
  startStepId: string;
  steps: DiagnosticStep[];
  estimatedTime: string;
  difficulty: 'kolay' | 'orta' | 'zor';
}

export const diagnosticFlows: DiagnosticFlow[] = [
  // Check Engine Lambası Akışı
  {
    id: 'check-engine',
    title: 'Check Engine Lambası Yanıyor',
    description: 'Motor kontrol lambası yandığında adım adım teşhis rehberi',
    icon: 'engine',
    startStepId: 'ce-start',
    estimatedTime: '5-10 dakika',
    difficulty: 'kolay',
    steps: [
      {
        id: 'ce-start',
        question: 'Check Engine lambası nasıl yanıyor?',
        options: [
          { label: 'Sürekli yanıyor', nextStepId: 'ce-steady' },
          { label: 'Yanıp sönüyor', nextStepId: 'ce-flashing', warning: 'Dikkat: Bu durum acil müdahale gerektirebilir!' }
        ]
      },
      {
        id: 'ce-steady',
        question: 'Araçta belirgin bir performans sorunu var mı?',
        options: [
          { label: 'Hayır, normal çalışıyor', nextStepId: 'ce-steady-normal' },
          { label: 'Evet, motor titriyor veya kesiliyor', nextStepId: 'ce-steady-rough' },
          { label: 'Evet, güç kaybı var', nextStepId: 'ce-steady-power' },
          { label: 'Evet, yakıt tüketimi arttı', nextStepId: 'ce-steady-fuel' }
        ]
      },
      {
        id: 'ce-flashing',
        instruction: 'Yanıp sönen Check Engine lambası ciddi bir ateşleme hatası gösterir. Katalitik konvertör hasar görebilir.',
        safetyWarning: 'Aracı mümkün olduğunca az kullanın!',
        options: [
          { label: 'Anladım, devam et', nextStepId: 'ce-flashing-conclusion' }
        ]
      },
      {
        id: 'ce-flashing-conclusion',
        conclusion: {
          title: 'Acil Servis Gerekli - Ateşleme Hatası',
          description: 'Yanıp sönen Check Engine, bir veya daha fazla silindirde ateşleme atlaması olduğunu gösterir. Bu durum katalitik konvertöre kalıcı hasar verebilir.',
          obdCodes: ['P0300', 'P0301', 'P0302', 'P0303', 'P0304'],
          severity: 'critical',
          action: 'En yakın servise gidin veya çekici çağırın. Aracı bu durumda kullanmak hasarı artırabilir.',
          estimatedCost: '1.500 - 8.000 ₺'
        }
      },
      {
        id: 'ce-steady-normal',
        question: 'Son zamanlarda yakıt kapağını kontrol ettiniz mi?',
        options: [
          { label: 'Kapak gevşekti, sıktım', nextStepId: 'ce-fuel-cap' },
          { label: 'Kapak düzgün görünüyor', nextStepId: 'ce-evap-or-other' }
        ]
      },
      {
        id: 'ce-fuel-cap',
        conclusion: {
          title: 'Yakıt Kapağı Sorunu Olabilir',
          description: 'Gevşek veya hasarlı yakıt kapağı EVAP sistem kodlarına neden olabilir. Kapağı sıkıca kapatın ve 50-100 km sürün, lamba kendiliğinden sönebilir.',
          obdCodes: ['P0440', 'P0442', 'P0455', 'P0456'],
          severity: 'low',
          action: 'Kapağı kontrol edip sıkıca kapatın. 100 km sonra hala yanıyorsa OBD taraması yaptırın.',
          estimatedCost: '0 - 500 ₺ (kapak değişimi gerekirse)'
        }
      },
      {
        id: 'ce-evap-or-other',
        conclusion: {
          title: 'OBD Taraması Gerekli',
          description: 'Belirgin bir belirti olmadan yanan Check Engine genellikle emisyon sistemleriyle ilgilidir. Kesin teşhis için OBD taraması yaptırmanız gerekir.',
          obdCodes: ['P0420', 'P0171', 'P0442', 'P0401'],
          severity: 'low',
          action: 'OBD-II taraması yaptırın. Acil değil ancak 1-2 hafta içinde kontrol ettirin.',
          estimatedCost: '200 - 3.000 ₺ (arızaya göre değişir)'
        }
      },
      {
        id: 'ce-steady-rough',
        question: 'Motor ne zaman titriyor?',
        options: [
          { label: 'Sadece rölantide', nextStepId: 'ce-rough-idle' },
          { label: 'Hızlanırken', nextStepId: 'ce-rough-accel' },
          { label: 'Sürekli', nextStepId: 'ce-rough-always' }
        ]
      },
      {
        id: 'ce-rough-idle',
        conclusion: {
          title: 'Rölanti Sorunu - Muhtemelen Ateşleme veya Hava/Yakıt',
          description: 'Rölantide titreşim genellikle bujiler, ateşleme bobinleri veya vakum kaçağından kaynaklanır.',
          obdCodes: ['P0300', 'P0171', 'P0505', 'P0507'],
          severity: 'medium',
          action: 'OBD taraması yaptırın, buji ve bobin kontrolü gerekebilir.',
          estimatedCost: '500 - 2.500 ₺'
        }
      },
      {
        id: 'ce-rough-accel',
        conclusion: {
          title: 'Hızlanma Sorunu - Yakıt veya Ateşleme',
          description: 'Hızlanırken titreşim yakıt enjektörleri, yakıt pompası veya ateşleme sisteminden kaynaklanabilir.',
          obdCodes: ['P0171', 'P0172', 'P0300', 'P0101'],
          severity: 'medium',
          action: 'OBD taraması ve yakıt sistemi kontrolü gerekli.',
          estimatedCost: '800 - 4.000 ₺'
        }
      },
      {
        id: 'ce-rough-always',
        conclusion: {
          title: 'Sürekli Performans Sorunu',
          description: 'Sürekli titreşim ciddi bir mekanik veya elektronik sorun olabilir. Acil kontrol gerekir.',
          obdCodes: ['P0300', 'P0171', 'P0174', 'P0420'],
          severity: 'high',
          action: 'En kısa sürede servise gidin. Araç kullanımını minimize edin.',
          estimatedCost: '1.000 - 6.000 ₺'
        }
      },
      {
        id: 'ce-steady-power',
        question: 'Güç kaybı ani mi yoksa yavaş yavaş mı oldu?',
        options: [
          { label: 'Ani oldu', nextStepId: 'ce-power-sudden' },
          { label: 'Yavaş yavaş kötüleşti', nextStepId: 'ce-power-gradual' }
        ]
      },
      {
        id: 'ce-power-sudden',
        conclusion: {
          title: 'Ani Güç Kaybı - Acil Kontrol',
          description: 'Ani güç kaybı turbo arızası, yakıt pompası veya sensör arızası olabilir.',
          obdCodes: ['P0299', 'P0234', 'P0230', 'P0101'],
          severity: 'high',
          action: 'Aracı fazla zorlamadan en yakın servise gidin.',
          estimatedCost: '1.500 - 8.000 ₺'
        }
      },
      {
        id: 'ce-power-gradual',
        conclusion: {
          title: 'Kademeli Güç Kaybı',
          description: 'Yavaş yavaş artan güç kaybı genellikle hava filtresi, yakıt filtresi veya katalitik konvertör tıkanması olabilir.',
          obdCodes: ['P0420', 'P0101', 'P0171', 'P0401'],
          severity: 'medium',
          action: 'OBD taraması ve filtre kontrolü yaptırın.',
          estimatedCost: '500 - 5.000 ₺'
        }
      },
      {
        id: 'ce-steady-fuel',
        conclusion: {
          title: 'Yüksek Yakıt Tüketimi',
          description: 'Artan yakıt tüketimi O2 sensörü, MAF sensörü veya enjektör sorunlarından kaynaklanabilir.',
          obdCodes: ['P0171', 'P0172', 'P0130', 'P0101', 'P0420'],
          severity: 'low',
          action: 'OBD taraması yaptırın. Acil değil ancak ekonomik kayıp yaratır.',
          estimatedCost: '500 - 3.500 ₺'
        }
      }
    ]
  },

  // Motor Isınma Sorunu Akışı
  {
    id: 'engine-overheating',
    title: 'Motor Aşırı Isınıyor',
    description: 'Motor sıcaklık göstergesi yükseldiğinde adım adım kontrol',
    icon: 'thermometer',
    startStepId: 'eo-start',
    estimatedTime: '3-5 dakika',
    difficulty: 'orta',
    steps: [
      {
        id: 'eo-start',
        question: 'Sıcaklık göstergesi nerede?',
        options: [
          { label: 'Kırmızı bölgede', nextStepId: 'eo-critical', warning: 'Dikkat: Motoru hemen durdurun!' },
          { label: 'Normalin biraz üzerinde', nextStepId: 'eo-slightly' },
          { label: 'Dalgalanıyor (inip çıkıyor)', nextStepId: 'eo-fluctuating' }
        ]
      },
      {
        id: 'eo-critical',
        instruction: 'Aracı güvenli bir yere çekin ve motoru kapatın. Kaputu AÇMAYIN - buhar yanığı riski!',
        safetyWarning: 'En az 30 dakika soğumasını bekleyin!',
        options: [
          { label: 'Motor soğudu, devam et', nextStepId: 'eo-check-coolant' }
        ]
      },
      {
        id: 'eo-check-coolant',
        question: 'Soğutma suyu seviyesini kontrol edin (motor soğukken). Seviye nasıl?',
        options: [
          { label: 'Çok düşük veya boş', nextStepId: 'eo-low-coolant' },
          { label: 'Normal seviyede', nextStepId: 'eo-normal-coolant' }
        ]
      },
      {
        id: 'eo-low-coolant',
        question: 'Araç altında veya motor bölmesinde sızıntı var mı?',
        options: [
          { label: 'Evet, sızıntı var', nextStepId: 'eo-leak-conclusion' },
          { label: 'Hayır, görünür sızıntı yok', nextStepId: 'eo-internal-leak' }
        ]
      },
      {
        id: 'eo-leak-conclusion',
        conclusion: {
          title: 'Soğutma Sistemi Sızıntısı',
          description: 'Görünür sızıntı genellikle radyatör, hortum veya su pompası kaynaklıdır.',
          obdCodes: ['P0217', 'P0128'],
          severity: 'high',
          action: 'Su eklemeyin, çekici ile servise götürün. Sızıntılı araç kullanmak motor hasarına yol açar.',
          estimatedCost: '500 - 4.000 ₺'
        }
      },
      {
        id: 'eo-internal-leak',
        conclusion: {
          title: 'İç Sızıntı Olasılığı',
          description: 'Görünür sızıntı olmadan su kaybı silindir kapak contası veya iç radyatör hasarı olabilir.',
          obdCodes: ['P0217', 'P0128'],
          severity: 'critical',
          action: 'Kesinlikle aracı kullanmayın! Çekici ile servise götürün, kafa contası kontrolü yaptırın.',
          estimatedCost: '3.000 - 10.000 ₺'
        }
      },
      {
        id: 'eo-normal-coolant',
        conclusion: {
          title: 'Termostat veya Fan Sorunu',
          description: 'Su seviyesi normal ancak ısınma varsa termostat sıkışmış veya fan çalışmıyor olabilir.',
          obdCodes: ['P0128', 'P0217', 'P0480'],
          severity: 'medium',
          action: 'Serviste termostat ve fan kontrolü yaptırın.',
          estimatedCost: '500 - 2.000 ₺'
        }
      },
      {
        id: 'eo-slightly',
        question: 'Klima veya ısıtıcı açık mı?',
        options: [
          { label: 'Evet, klima açık', nextStepId: 'eo-ac-on' },
          { label: 'Hayır, kapalı', nextStepId: 'eo-check-coolant' }
        ]
      },
      {
        id: 'eo-ac-on',
        instruction: 'Klimayı kapatın ve ısıtıcıyı tam güçte açın. Bu motor ısısını azaltmaya yardımcı olur.',
        options: [
          { label: 'Sıcaklık düştü', nextStepId: 'eo-ac-conclusion' },
          { label: 'Hala yüksek', nextStepId: 'eo-check-coolant' }
        ]
      },
      {
        id: 'eo-ac-conclusion',
        conclusion: {
          title: 'Soğutma Sistemi Yetersiz Kalıyor',
          description: 'Klima çalışırken ısınma normal değil. Soğutma fanı veya radyatör verimliliği kontrol edilmeli.',
          obdCodes: ['P0480', 'P0128'],
          severity: 'low',
          action: 'Serviste fan ve radyatör kontrolü yaptırın. Sıcak havalarda dikkatli olun.',
          estimatedCost: '300 - 1.500 ₺'
        }
      },
      {
        id: 'eo-fluctuating',
        conclusion: {
          title: 'Termostat veya Hava Kabarcığı',
          description: 'Dalgalanan sıcaklık genellikle termostat arızası veya soğutma sisteminde hava olduğunu gösterir.',
          obdCodes: ['P0128', 'P0125'],
          severity: 'medium',
          action: 'Termostat değişimi ve sistem hava alma işlemi yaptırın.',
          estimatedCost: '400 - 1.200 ₺'
        }
      }
    ]
  },

  // Fren Sorunu Akışı
  {
    id: 'brake-issue',
    title: 'Fren Sorunu Teşhisi',
    description: 'Fren sistemi ile ilgili sorunların adım adım analizi',
    icon: 'disc',
    startStepId: 'br-start',
    estimatedTime: '3-5 dakika',
    difficulty: 'kolay',
    steps: [
      {
        id: 'br-start',
        question: 'Hangi fren sorunu ile karşılaşıyorsunuz?',
        options: [
          { label: 'Fren pedalı çok yumuşak', nextStepId: 'br-soft', warning: 'Dikkat: Bu ciddi olabilir!' },
          { label: 'Fren pedalı çok sert', nextStepId: 'br-hard' },
          { label: 'Fren yaparken ses geliyor', nextStepId: 'br-noise' },
          { label: 'Fren yaparken titreşim var', nextStepId: 'br-vibration' },
          { label: 'ABS lambası yanıyor', nextStepId: 'br-abs' }
        ]
      },
      {
        id: 'br-soft',
        question: 'Pedal yere kadar gidiyor mu?',
        options: [
          { label: 'Evet, neredeyse yere değiyor', nextStepId: 'br-soft-floor' },
          { label: 'Hayır ama eskisinden yumuşak', nextStepId: 'br-soft-spongy' }
        ]
      },
      {
        id: 'br-soft-floor',
        conclusion: {
          title: 'Acil - Fren Hidroliği veya Ana Merkez',
          description: 'Yere kadar giden pedal hidrolik sızıntısı veya ana merkez arızası olabilir. Bu çok tehlikelidir.',
          obdCodes: [],
          severity: 'critical',
          action: 'ARAÇ KULLANMAYIN! Çekici çağırın. Bu hayati bir güvenlik sorunudur.',
          estimatedCost: '1.000 - 4.000 ₺'
        }
      },
      {
        id: 'br-soft-spongy',
        conclusion: {
          title: 'Fren Sisteminde Hava',
          description: 'Süngerimsi pedal genellikle fren hattında hava olduğunu gösterir.',
          obdCodes: [],
          severity: 'medium',
          action: 'Fren sıvısı seviyesini kontrol edin ve fren sistemini purje ettirin.',
          estimatedCost: '300 - 800 ₺'
        }
      },
      {
        id: 'br-hard',
        conclusion: {
          title: 'Fren Güçlendirici Sorunu',
          description: 'Sert pedal genellikle vakum kaybı veya fren güçlendirici arızasıdır.',
          obdCodes: [],
          severity: 'high',
          action: 'Serviste vakum hortumları ve güçlendirici kontrol ettirin.',
          estimatedCost: '800 - 3.000 ₺'
        }
      },
      {
        id: 'br-noise',
        question: 'Ne tür bir ses geliyor?',
        options: [
          { label: 'Cıyaklama / çığlık sesi', nextStepId: 'br-squeal' },
          { label: 'Metal sürtme sesi', nextStepId: 'br-grinding' },
          { label: 'Tıkırtı / vuruntu sesi', nextStepId: 'br-clunk' }
        ]
      },
      {
        id: 'br-squeal',
        conclusion: {
          title: 'Fren Balatası Uyarısı',
          description: 'Cıyaklama sesi genellikle balataların aşındığını gösteren uyarı göstergesidir.',
          obdCodes: [],
          severity: 'medium',
          action: 'Fren balatalarını kontrol ettirin, muhtemelen değişim gerekiyor.',
          estimatedCost: '600 - 1.500 ₺'
        }
      },
      {
        id: 'br-grinding',
        conclusion: {
          title: 'Acil - Balatalar Tamamen Aşınmış',
          description: 'Metal sürtme sesi balataların bittiğini ve disklerin hasar gördüğünü gösterir.',
          obdCodes: [],
          severity: 'critical',
          action: 'ARAÇ KULLANMAYIN! Diskler de hasar görmüş olabilir, maliyeti artırır.',
          estimatedCost: '1.500 - 4.000 ₺'
        }
      },
      {
        id: 'br-clunk',
        conclusion: {
          title: 'Fren Kaliperi veya Montaj Sorunu',
          description: 'Tıkırtı sesi gevşek kaliper veya aşınmış süspansiyon parçası olabilir.',
          obdCodes: [],
          severity: 'medium',
          action: 'Fren ve süspansiyon kontrolü yaptırın.',
          estimatedCost: '500 - 2.000 ₺'
        }
      },
      {
        id: 'br-vibration',
        conclusion: {
          title: 'Fren Diski Eğrilmesi',
          description: 'Fren yaparken titreşim genellikle eğrilmiş veya aşınmış fren disklerinden kaynaklanır.',
          obdCodes: [],
          severity: 'medium',
          action: 'Fren disklerini kontrol ettirin, torna veya değişim gerekebilir.',
          estimatedCost: '800 - 2.500 ₺'
        }
      },
      {
        id: 'br-abs',
        conclusion: {
          title: 'ABS Sistem Arızası',
          description: 'ABS lambası sensör arızası, ABS modülü veya kablo sorunu olabilir.',
          obdCodes: ['C0035', 'C0040', 'C0045', 'C0050'],
          severity: 'medium',
          action: 'Normal frenler çalışır ancak ABS devreye girmez. OBD taraması ile arızayı tespit edin.',
          estimatedCost: '500 - 3.000 ₺'
        }
      }
    ]
  }
];

// Akış getir
export function getFlowById(id: string): DiagnosticFlow | undefined {
  return diagnosticFlows.find(f => f.id === id);
}

// Adım getir
export function getStepById(flow: DiagnosticFlow, stepId: string): DiagnosticStep | undefined {
  return flow.steps.find(s => s.id === stepId);
}
