// Semptom - OBD Kod Eşleştirmesi
// Kullanıcı semptom seçtiğinde ilgili OBD kodlarını göstermek için

export interface SymptomObdMapping {
  symptomId: string;
  symptomName: string;
  symptomNameTr: string;
  category: string;
  categoryColor: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  obdCodes: string[];
  keywords: string[]; // Arama için
}

export const symptomObdMappings: SymptomObdMapping[] = [
  // Motor Belirtileri
  {
    symptomId: 'engine-vibration',
    symptomName: 'Engine Vibration',
    symptomNameTr: 'Motor Titreşimi',
    category: 'Motor',
    categoryColor: 'red',
    severity: 'medium',
    description: 'Motor çalışırken anormal titreşim, sarsıntı veya düzensiz çalışma',
    obdCodes: ['P0300', 'P0301', 'P0302', 'P0303', 'P0304', 'P0305', 'P0306', 'P0171', 'P0174', 'P0400'],
    keywords: ['titreşim', 'sarsıntı', 'titriyor', 'sallanıyor', 'vibrasyon', 'düzensiz']
  },
  {
    symptomId: 'check-engine-light',
    symptomName: 'Check Engine Light',
    symptomNameTr: 'Check Engine Lambası Yanıyor',
    category: 'Motor',
    categoryColor: 'red',
    severity: 'medium',
    description: 'Motor kontrol lambası sürekli yanıyor veya yanıp sönüyor',
    obdCodes: ['P0420', 'P0171', 'P0300', 'P0442', 'P0455', 'P0128', 'P0401', 'P0440'],
    keywords: ['check engine', 'motor lambası', 'arıza lambası', 'kontrol lambası', 'uyarı ışığı']
  },
  {
    symptomId: 'power-loss',
    symptomName: 'Loss of Power',
    symptomNameTr: 'Güç Kaybı',
    category: 'Motor',
    categoryColor: 'red',
    severity: 'high',
    description: 'Motor yeterli güç üretmiyor, hızlanma zayıf, tepki vermiyor',
    obdCodes: ['P0171', 'P0172', 'P0101', 'P0102', 'P0103', 'P0234', 'P0299', 'P0420', 'P0400'],
    keywords: ['güç kaybı', 'hızlanmıyor', 'yavaş', 'tepkisiz', 'zayıf', 'kalkış']
  },
  {
    symptomId: 'engine-stalling',
    symptomName: 'Engine Stalling',
    symptomNameTr: 'Motor Stop Ediyor',
    category: 'Motor',
    categoryColor: 'red',
    severity: 'high',
    description: 'Motor aniden duruyor, rölantide kapanıyor',
    obdCodes: ['P0505', 'P0506', 'P0507', 'P0171', 'P0172', 'P0340', 'P0335', 'P0121'],
    keywords: ['duruyor', 'kapanıyor', 'stop', 'rölanti', 'kesiliyor']
  },
  {
    symptomId: 'rough-idle',
    symptomName: 'Rough Idle',
    symptomNameTr: 'Düzensiz Rölanti',
    category: 'Motor',
    categoryColor: 'red',
    severity: 'medium',
    description: 'Rölantide motor düzensiz çalışıyor, devir oynuyor',
    obdCodes: ['P0300', 'P0171', 'P0174', 'P0505', 'P0507', 'P0401', 'P0400'],
    keywords: ['rölanti', 'devir', 'düzensiz', 'oynuyor', 'dalgalanma']
  },
  {
    symptomId: 'engine-overheating',
    symptomName: 'Engine Overheating',
    symptomNameTr: 'Motor Aşırı Isınıyor',
    category: 'Motor',
    categoryColor: 'red',
    severity: 'high',
    description: 'Motor sıcaklık göstergesi normalin üzerinde, buhar çıkıyor',
    obdCodes: ['P0217', 'P0128', 'P0125', 'P0116', 'P0117', 'P0118'],
    keywords: ['ısınıyor', 'sıcaklık', 'buhar', 'overheat', 'kaynıyor']
  },
  {
    symptomId: 'hard-start',
    symptomName: 'Hard Start',
    symptomNameTr: 'Zor Çalışma',
    category: 'Motor',
    categoryColor: 'red',
    severity: 'medium',
    description: 'Motor zor çalışıyor, birkaç denemede tutuyor',
    obdCodes: ['P0340', 'P0335', 'P0171', 'P0230', 'P0190', 'P0191'],
    keywords: ['zor çalışıyor', 'tutmuyor', 'çalışmıyor', 'marş', 'start']
  },

  // Yakıt Sistemi Belirtileri
  {
    symptomId: 'high-fuel-consumption',
    symptomName: 'High Fuel Consumption',
    symptomNameTr: 'Yüksek Yakıt Tüketimi',
    category: 'Yakıt',
    categoryColor: 'green',
    severity: 'low',
    description: 'Araç normalden çok daha fazla yakıt tüketiyor',
    obdCodes: ['P0171', 'P0172', 'P0420', 'P0130', 'P0131', 'P0132', 'P0133', 'P0134', 'P0101'],
    keywords: ['yakıt', 'tüketim', 'benzin', 'mazot', 'harcıyor', 'ekonomi']
  },
  {
    symptomId: 'fuel-smell',
    symptomName: 'Fuel Smell',
    symptomNameTr: 'Yakıt Kokusu',
    category: 'Yakıt',
    categoryColor: 'green',
    severity: 'high',
    description: 'Araç içinde veya dışında yakıt kokusu alınıyor',
    obdCodes: ['P0440', 'P0441', 'P0442', 'P0443', 'P0455', 'P0456'],
    keywords: ['koku', 'benzin', 'yakıt', 'mazot', 'sızıntı']
  },

  // Emisyon Belirtileri
  {
    symptomId: 'black-smoke',
    symptomName: 'Black Exhaust Smoke',
    symptomNameTr: 'Siyah Egzoz Dumanı',
    category: 'Emisyon',
    categoryColor: 'gray',
    severity: 'medium',
    description: 'Egzozdan siyah duman çıkıyor (zengin karışım)',
    obdCodes: ['P0172', 'P0175', 'P0101', 'P0102', 'P0130', 'P0134'],
    keywords: ['siyah duman', 'egzoz', 'is', 'duman']
  },
  {
    symptomId: 'white-smoke',
    symptomName: 'White Exhaust Smoke',
    symptomNameTr: 'Beyaz Egzoz Dumanı',
    category: 'Emisyon',
    categoryColor: 'gray',
    severity: 'high',
    description: 'Egzozdan beyaz duman çıkıyor (su/antifriz sızıntısı)',
    obdCodes: ['P0217', 'P0128', 'P0300'],
    keywords: ['beyaz duman', 'egzoz', 'buhar', 'duman', 'su']
  },
  {
    symptomId: 'blue-smoke',
    symptomName: 'Blue Exhaust Smoke',
    symptomNameTr: 'Mavi Egzoz Dumanı',
    category: 'Emisyon',
    categoryColor: 'gray',
    severity: 'high',
    description: 'Egzozdan mavi duman çıkıyor (yağ yanması)',
    obdCodes: ['P0171', 'P0174', 'P0300', 'P0301'],
    keywords: ['mavi duman', 'egzoz', 'yağ', 'yanıyor']
  },
  {
    symptomId: 'emission-smell',
    symptomName: 'Rotten Egg Smell',
    symptomNameTr: 'Çürük Yumurta Kokusu',
    category: 'Emisyon',
    categoryColor: 'gray',
    severity: 'medium',
    description: 'Egzozdan kükürt/çürük yumurta kokusu geliyor',
    obdCodes: ['P0420', 'P0421', 'P0430', 'P0431'],
    keywords: ['çürük yumurta', 'kükürt', 'koku', 'egzoz', 'katalitik']
  },

  // Şanzıman Belirtileri
  {
    symptomId: 'gear-slipping',
    symptomName: 'Transmission Slipping',
    symptomNameTr: 'Vites Kayması',
    category: 'Şanzıman',
    categoryColor: 'purple',
    severity: 'high',
    description: 'Vitesler kayıyor, geç tutuyor veya kendiliğinden değişiyor',
    obdCodes: ['P0700', 'P0715', 'P0720', 'P0730', 'P0731', 'P0732', 'P0733', 'P0734'],
    keywords: ['vites', 'kayma', 'şanzıman', 'geç', 'tutmuyor']
  },
  {
    symptomId: 'hard-shifting',
    symptomName: 'Hard Shifting',
    symptomNameTr: 'Sert Vites Değişimi',
    category: 'Şanzıman',
    categoryColor: 'purple',
    severity: 'medium',
    description: 'Vitesler sert geçiyor, vuruntu yapıyor',
    obdCodes: ['P0700', 'P0750', 'P0755', 'P0760', 'P0765'],
    keywords: ['sert vites', 'vuruntu', 'şanzıman', 'geçmiyor']
  },
  {
    symptomId: 'transmission-warning',
    symptomName: 'Transmission Warning Light',
    symptomNameTr: 'Şanzıman Uyarı Lambası',
    category: 'Şanzıman',
    categoryColor: 'purple',
    severity: 'high',
    description: 'Şanzıman uyarı lambası yanıyor',
    obdCodes: ['P0700', 'P0705', 'P0710', 'P0715', 'P0720', 'P0740', 'P0750'],
    keywords: ['şanzıman lambası', 'vites uyarı', 'otomatik vites']
  },

  // Fren Belirtileri
  {
    symptomId: 'abs-light',
    symptomName: 'ABS Warning Light',
    symptomNameTr: 'ABS Uyarı Lambası',
    category: 'Fren',
    categoryColor: 'orange',
    severity: 'medium',
    description: 'ABS uyarı lambası yanıyor',
    obdCodes: ['C0035', 'C0040', 'C0045', 'C0050', 'C0060', 'C0065'],
    keywords: ['abs', 'fren lambası', 'uyarı']
  },
  {
    symptomId: 'brake-vibration',
    symptomName: 'Brake Vibration',
    symptomNameTr: 'Fren Titreşimi',
    category: 'Fren',
    categoryColor: 'orange',
    severity: 'medium',
    description: 'Fren yapılırken direksiyon veya pedal titriyor',
    obdCodes: ['C0035', 'C0040', 'C0045', 'C0050'],
    keywords: ['fren titreşim', 'direksiyon titriyor', 'pedal titriyor']
  },

  // Elektrik Belirtileri
  {
    symptomId: 'battery-drain',
    symptomName: 'Battery Drain',
    symptomNameTr: 'Akü Bitmesi',
    category: 'Elektrik',
    categoryColor: 'yellow',
    severity: 'medium',
    description: 'Akü sürekli boşalıyor, araç zor çalışıyor',
    obdCodes: ['P0560', 'P0562', 'P0563', 'P0620', 'P0621', 'P0622'],
    keywords: ['akü', 'batarya', 'şarj', 'boşalıyor', 'bitik']
  },
  {
    symptomId: 'alternator-warning',
    symptomName: 'Charging System Warning',
    symptomNameTr: 'Şarj Sistemi Uyarısı',
    category: 'Elektrik',
    categoryColor: 'yellow',
    severity: 'high',
    description: 'Akü/şarj uyarı lambası yanıyor',
    obdCodes: ['P0560', 'P0562', 'P0563', 'P0620', 'P0621', 'P0622', 'P0625'],
    keywords: ['şarj lambası', 'akü lambası', 'alternatör', 'jeneratör']
  },

  // Sensör Belirtileri
  {
    symptomId: 'o2-sensor-issue',
    symptomName: 'O2 Sensor Issue',
    symptomNameTr: 'Oksijen Sensörü Sorunu',
    category: 'Sensör',
    categoryColor: 'blue',
    severity: 'medium',
    description: 'Oksijen sensörü ile ilgili performans sorunu',
    obdCodes: ['P0130', 'P0131', 'P0132', 'P0133', 'P0134', 'P0135', 'P0136', 'P0137', 'P0138', 'P0139', 'P0140', 'P0141'],
    keywords: ['oksijen sensör', 'o2', 'lambda', 'egzoz sensör']
  },
  {
    symptomId: 'maf-sensor-issue',
    symptomName: 'MAF Sensor Issue',
    symptomNameTr: 'Hava Akış Sensörü Sorunu',
    category: 'Sensör',
    categoryColor: 'blue',
    severity: 'medium',
    description: 'Kütle hava akış sensörü arızası',
    obdCodes: ['P0100', 'P0101', 'P0102', 'P0103', 'P0104'],
    keywords: ['maf', 'hava akış', 'sensör', 'debimetre']
  },
  {
    symptomId: 'map-sensor-issue',
    symptomName: 'MAP Sensor Issue',
    symptomNameTr: 'Manifold Basınç Sensörü Sorunu',
    category: 'Sensör',
    categoryColor: 'blue',
    severity: 'medium',
    description: 'Emme manifoldu basınç sensörü arızası',
    obdCodes: ['P0105', 'P0106', 'P0107', 'P0108', 'P0109'],
    keywords: ['map', 'manifold basınç', 'sensör', 'vakum']
  },
  {
    symptomId: 'coolant-sensor-issue',
    symptomName: 'Coolant Temperature Sensor Issue',
    symptomNameTr: 'Soğutma Suyu Sıcaklık Sensörü Sorunu',
    category: 'Sensör',
    categoryColor: 'blue',
    severity: 'low',
    description: 'Motor sıcaklık sensörü yanlış değer veriyor',
    obdCodes: ['P0115', 'P0116', 'P0117', 'P0118', 'P0119'],
    keywords: ['sıcaklık sensör', 'soğutma', 'ect', 'termostat']
  },
  {
    symptomId: 'throttle-position-issue',
    symptomName: 'Throttle Position Sensor Issue',
    symptomNameTr: 'Gaz Kelebeği Pozisyon Sensörü Sorunu',
    category: 'Sensör',
    categoryColor: 'blue',
    severity: 'medium',
    description: 'Gaz kelebeği pozisyon sensörü arızası, düzensiz tepki',
    obdCodes: ['P0120', 'P0121', 'P0122', 'P0123', 'P0124'],
    keywords: ['tps', 'gaz kelebeği', 'throttle', 'gaz tepki']
  },

  // Katalitik Konvertör
  {
    symptomId: 'catalytic-converter-issue',
    symptomName: 'Catalytic Converter Issue',
    symptomNameTr: 'Katalitik Konvertör Sorunu',
    category: 'Emisyon',
    categoryColor: 'gray',
    severity: 'high',
    description: 'Katalitik konvertör tıkanmış veya arızalı',
    obdCodes: ['P0420', 'P0421', 'P0422', 'P0430', 'P0431', 'P0432'],
    keywords: ['katalitik', 'katalizör', 'egzoz', 'emisyon']
  },

  // EGR Sistemi
  {
    symptomId: 'egr-issue',
    symptomName: 'EGR System Issue',
    symptomNameTr: 'EGR Sistemi Sorunu',
    category: 'Emisyon',
    categoryColor: 'gray',
    severity: 'medium',
    description: 'EGR valfi veya sistemi arızalı',
    obdCodes: ['P0400', 'P0401', 'P0402', 'P0403', 'P0404', 'P0405'],
    keywords: ['egr', 'egzoz geri dönüşüm', 'emisyon']
  },

  // EVAP Sistemi
  {
    symptomId: 'evap-leak',
    symptomName: 'EVAP System Leak',
    symptomNameTr: 'Buharlaşma Sistemi Kaçağı',
    category: 'Yakıt',
    categoryColor: 'green',
    severity: 'low',
    description: 'Yakıt buharı kaçağı, depo kapağı gevşek',
    obdCodes: ['P0440', 'P0441', 'P0442', 'P0443', 'P0444', 'P0445', 'P0446', 'P0455', 'P0456'],
    keywords: ['evap', 'buhar', 'kaçak', 'depo kapağı']
  },

  // Ateşleme Sistemi
  {
    symptomId: 'ignition-misfire',
    symptomName: 'Engine Misfire',
    symptomNameTr: 'Ateşleme Atlaması',
    category: 'Motor',
    categoryColor: 'red',
    severity: 'high',
    description: 'Motor ateşleme atlıyor, bir veya daha fazla silindir çalışmıyor',
    obdCodes: ['P0300', 'P0301', 'P0302', 'P0303', 'P0304', 'P0305', 'P0306', 'P0307', 'P0308'],
    keywords: ['ateşleme', 'misfire', 'atlama', 'buji', 'bobin', 'silindir']
  }
];

// Kategorilere göre grupla
export const symptomCategories = [
  { id: 'motor', name: 'Motor', color: 'red', icon: 'engine' },
  { id: 'yakit', name: 'Yakıt', color: 'green', icon: 'fuel' },
  { id: 'emisyon', name: 'Emisyon', color: 'gray', icon: 'cloud' },
  { id: 'sanziman', name: 'Şanzıman', color: 'purple', icon: 'cog' },
  { id: 'fren', name: 'Fren', color: 'orange', icon: 'disc' },
  { id: 'elektrik', name: 'Elektrik', color: 'yellow', icon: 'bolt' },
  { id: 'sensor', name: 'Sensör', color: 'blue', icon: 'cpu' }
];

// Arama fonksiyonu
export function searchSymptoms(query: string): SymptomObdMapping[] {
  const normalizedQuery = query.toLowerCase().trim();

  return symptomObdMappings.filter(symptom =>
    symptom.symptomNameTr.toLowerCase().includes(normalizedQuery) ||
    symptom.description.toLowerCase().includes(normalizedQuery) ||
    symptom.keywords.some(kw => kw.toLowerCase().includes(normalizedQuery)) ||
    symptom.obdCodes.some(code => code.toLowerCase().includes(normalizedQuery))
  );
}

// Kategori bazlı filtreleme
export function getSymptomsByCategory(category: string): SymptomObdMapping[] {
  return symptomObdMappings.filter(s => s.category === category);
}
