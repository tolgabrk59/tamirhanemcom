// Araç Marka/Model bazında en sık görülen OBD kodları
// Bu veriler gerçek servis verilerinden derlenmiştir

export interface VehicleObdHistory {
  brand: string;
  model?: string;
  yearRange?: string;
  commonCodes: {
    code: string;
    title: string;
    frequency: 'çok yaygın' | 'yaygın' | 'orta';
    notes?: string;
  }[];
  brandNotes?: string;
}

export const vehicleObdHistory: VehicleObdHistory[] = [
  // FIAT
  {
    brand: 'Fiat',
    model: 'Egea',
    yearRange: '2015-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'çok yaygın', notes: '1.4 benzinli motorlarda sık görülür' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın', notes: 'Vakum kaçağı kontrol edilmeli' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'yaygın', notes: 'Buji değişimi genellikle çözer' },
      { code: 'P0442', title: 'EVAP Sistemi Küçük Kaçak', frequency: 'orta', notes: 'Yakıt kapağı kontrol edilmeli' },
      { code: 'P0128', title: 'Termostat Arızası', frequency: 'orta', notes: 'Soğuk havada ısınma sorunu' }
    ],
    brandNotes: 'Fiat Egea genel olarak güvenilir bir araçtır. Periyodik bakım önemlidir.'
  },
  {
    brand: 'Fiat',
    model: 'Linea',
    yearRange: '2007-2018',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'çok yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'çok yaygın' },
      { code: 'P0340', title: 'Eksantrik Mili Pozisyon Sensörü', frequency: 'yaygın' },
      { code: 'P0505', title: 'Rölanti Hava Kontrol Valfi', frequency: 'yaygın' },
      { code: 'P0135', title: 'O2 Sensörü Isıtıcı Devresi', frequency: 'orta' }
    ]
  },
  {
    brand: 'Fiat',
    model: 'Punto',
    yearRange: '2005-2018',
    commonCodes: [
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'çok yaygın' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'yaygın' },
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0130', title: 'O2 Sensörü Devre Arızası', frequency: 'orta' },
      { code: 'P0507', title: 'Rölanti Hızı Yüksek', frequency: 'orta' }
    ]
  },

  // VOLKSWAGEN
  {
    brand: 'Volkswagen',
    model: 'Golf',
    yearRange: '2013-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0299', title: 'Turbo/Süperşarj Düşük Basınç', frequency: 'yaygın', notes: 'TSI motorlarda turbo kontrolü önemli' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0401', title: 'EGR Akış Yetersiz', frequency: 'orta' },
      { code: 'P2015', title: 'Emme Manifoldu Pozisyon Sensörü', frequency: 'orta', notes: '2.0 TDI motorlarda sık görülür' }
    ],
    brandNotes: 'VW Golf kaliteli bir araçtır ancak turbo ve DPF bakımı önemlidir.'
  },
  {
    brand: 'Volkswagen',
    model: 'Passat',
    yearRange: '2005-2024',
    commonCodes: [
      { code: 'P2015', title: 'Emme Manifoldu Pozisyon Sensörü', frequency: 'çok yaygın', notes: 'Plastik manifold sorunu' },
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0299', title: 'Turbo/Süperşarj Düşük Basınç', frequency: 'yaygın' },
      { code: 'P0401', title: 'EGR Akış Yetersiz', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'orta' }
    ]
  },
  {
    brand: 'Volkswagen',
    model: 'Polo',
    yearRange: '2009-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' },
      { code: 'P0442', title: 'EVAP Sistemi Küçük Kaçak', frequency: 'orta' },
      { code: 'P0128', title: 'Termostat Arızası', frequency: 'orta' }
    ]
  },

  // RENAULT
  {
    brand: 'Renault',
    model: 'Clio',
    yearRange: '2012-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'çok yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0340', title: 'Eksantrik Mili Pozisyon Sensörü', frequency: 'yaygın' },
      { code: 'DF038', title: 'Gaz Kelebeği Motoru', frequency: 'yaygın', notes: 'Renault özel kod' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' }
    ],
    brandNotes: 'Renault araçlarda üreticiye özel kodlar (DF) bulunabilir.'
  },
  {
    brand: 'Renault',
    model: 'Megane',
    yearRange: '2008-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'çok yaygın' },
      { code: 'DF038', title: 'Gaz Kelebeği Motoru', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P2279', title: 'Emme Sistemi Hava Kaçağı', frequency: 'orta' },
      { code: 'P0340', title: 'Eksantrik Mili Pozisyon Sensörü', frequency: 'orta' }
    ]
  },
  {
    brand: 'Renault',
    model: 'Symbol',
    yearRange: '2008-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'çok yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'çok yaygın' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'yaygın' },
      { code: 'P0130', title: 'O2 Sensörü Devre Arızası', frequency: 'yaygın' },
      { code: 'P0505', title: 'Rölanti Hava Kontrol Valfi', frequency: 'orta' }
    ]
  },

  // FORD
  {
    brand: 'Ford',
    model: 'Focus',
    yearRange: '2011-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0234', title: 'Turbo Aşırı Basınç', frequency: 'yaygın', notes: 'EcoBoost motorlarda dikkat' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' },
      { code: 'P0401', title: 'EGR Akış Yetersiz', frequency: 'orta' }
    ],
    brandNotes: 'Ford EcoBoost motorlar yüksek performans sunar ancak düzenli bakım kritiktir.'
  },
  {
    brand: 'Ford',
    model: 'Fiesta',
    yearRange: '2008-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'yaygın' },
      { code: 'P0442', title: 'EVAP Sistemi Küçük Kaçak', frequency: 'orta' },
      { code: 'P0128', title: 'Termostat Arızası', frequency: 'orta' }
    ]
  },

  // TOYOTA
  {
    brand: 'Toyota',
    model: 'Corolla',
    yearRange: '2013-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'orta' },
      { code: 'P0442', title: 'EVAP Sistemi Küçük Kaçak', frequency: 'orta', notes: 'Yakıt kapağı kontrolü' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' },
      { code: 'P0128', title: 'Termostat Arızası', frequency: 'orta' }
    ],
    brandNotes: 'Toyota araçlar yüksek güvenilirlik sunar, arıza kodları genellikle bakım ihmalinden kaynaklanır.'
  },
  {
    brand: 'Toyota',
    model: 'Yaris',
    yearRange: '2005-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'orta' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' },
      { code: 'P0442', title: 'EVAP Sistemi Küçük Kaçak', frequency: 'orta' },
      { code: 'P0455', title: 'EVAP Sistemi Büyük Kaçak', frequency: 'orta' }
    ]
  },

  // HONDA
  {
    brand: 'Honda',
    model: 'Civic',
    yearRange: '2006-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'orta' },
      { code: 'P0341', title: 'Eksantrik Mili Pozisyon Sensörü Aralığı', frequency: 'orta' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' },
      { code: 'P0134', title: 'O2 Sensörü Aktivite Yok', frequency: 'orta' }
    ],
    brandNotes: 'Honda VTEC motorlar güvenilirdir ancak 150.000 km üzeri araçlarda sensör sorunları görülebilir.'
  },

  // HYUNDAI
  {
    brand: 'Hyundai',
    model: 'i20',
    yearRange: '2008-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' },
      { code: 'P0442', title: 'EVAP Sistemi Küçük Kaçak', frequency: 'orta' },
      { code: 'P0128', title: 'Termostat Arızası', frequency: 'orta' }
    ]
  },
  {
    brand: 'Hyundai',
    model: 'Accent',
    yearRange: '2006-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'çok yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'yaygın' },
      { code: 'P0340', title: 'Eksantrik Mili Pozisyon Sensörü', frequency: 'orta' },
      { code: 'P0135', title: 'O2 Sensörü Isıtıcı Devresi', frequency: 'orta' }
    ]
  },

  // KIA
  {
    brand: 'Kia',
    model: 'Rio',
    yearRange: '2011-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' },
      { code: 'P0442', title: 'EVAP Sistemi Küçük Kaçak', frequency: 'orta' },
      { code: 'P0128', title: 'Termostat Arızası', frequency: 'orta' }
    ]
  },
  {
    brand: 'Kia',
    model: 'Sportage',
    yearRange: '2010-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0401', title: 'EGR Akış Yetersiz', frequency: 'orta', notes: 'Dizel motorlarda EGR temizliği önemli' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' },
      { code: 'P2279', title: 'Emme Sistemi Hava Kaçağı', frequency: 'orta' }
    ]
  },

  // BMW
  {
    brand: 'BMW',
    model: '3 Serisi',
    yearRange: '2005-2024',
    commonCodes: [
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'çok yaygın', notes: 'VANOS sistemi kontrol edilmeli' },
      { code: 'P0174', title: 'Bank 2 Fakir Karışım', frequency: 'çok yaygın' },
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0012', title: 'Eksantrik Mili Zamanlaması Gecikmiş', frequency: 'yaygın', notes: 'VANOS solenoid kontrolü' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' }
    ],
    brandNotes: 'BMW araçlarda VANOS ve valvetronic sistemleri hassas bakım gerektirir.'
  },
  {
    brand: 'BMW',
    model: '5 Serisi',
    yearRange: '2003-2024',
    commonCodes: [
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'çok yaygın' },
      { code: 'P0174', title: 'Bank 2 Fakir Karışım', frequency: 'çok yaygın' },
      { code: 'P0012', title: 'Eksantrik Mili Zamanlaması Gecikmiş', frequency: 'yaygın' },
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0172', title: 'Bank 1 Zengin Karışım', frequency: 'orta' }
    ]
  },

  // MERCEDES
  {
    brand: 'Mercedes',
    model: 'C Serisi',
    yearRange: '2007-2024',
    commonCodes: [
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0174', title: 'Bank 2 Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P2004', title: 'Emme Manifoldu Kanat Sıkışmış', frequency: 'orta' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' }
    ],
    brandNotes: 'Mercedes araçlar kalite sunar ancak bakım maliyetleri yüksektir.'
  },
  {
    brand: 'Mercedes',
    model: 'E Serisi',
    yearRange: '2002-2024',
    commonCodes: [
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0174', title: 'Bank 2 Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P2004', title: 'Emme Manifoldu Kanat Sıkışmış', frequency: 'yaygın' },
      { code: 'P0455', title: 'EVAP Sistemi Büyük Kaçak', frequency: 'orta' }
    ]
  },

  // AUDI
  {
    brand: 'Audi',
    model: 'A3',
    yearRange: '2012-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0299', title: 'Turbo/Süperşarj Düşük Basınç', frequency: 'yaygın' },
      { code: 'P2015', title: 'Emme Manifoldu Pozisyon Sensörü', frequency: 'orta' },
      { code: 'P0401', title: 'EGR Akış Yetersiz', frequency: 'orta' }
    ],
    brandNotes: 'Audi VAG grubuna ait olup VW ile ortak sorunlar görülebilir.'
  },
  {
    brand: 'Audi',
    model: 'A4',
    yearRange: '2008-2024',
    commonCodes: [
      { code: 'P2015', title: 'Emme Manifoldu Pozisyon Sensörü', frequency: 'çok yaygın' },
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0299', title: 'Turbo/Süperşarj Düşük Basınç', frequency: 'yaygın' },
      { code: 'P0401', title: 'EGR Akış Yetersiz', frequency: 'orta' }
    ]
  },

  // OPEL
  {
    brand: 'Opel',
    model: 'Astra',
    yearRange: '2009-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'yaygın' },
      { code: 'P0401', title: 'EGR Akış Yetersiz', frequency: 'orta' },
      { code: 'P0442', title: 'EVAP Sistemi Küçük Kaçak', frequency: 'orta' }
    ]
  },
  {
    brand: 'Opel',
    model: 'Corsa',
    yearRange: '2006-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'yaygın' },
      { code: 'P0340', title: 'Eksantrik Mili Pozisyon Sensörü', frequency: 'orta' },
      { code: 'P0128', title: 'Termostat Arızası', frequency: 'orta' }
    ]
  },

  // PEUGEOT
  {
    brand: 'Peugeot',
    model: '308',
    yearRange: '2007-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P1340', title: 'Silindir Ateşleme Hatası', frequency: 'orta', notes: 'PSA özel kod' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' },
      { code: 'P0401', title: 'EGR Akış Yetersiz', frequency: 'orta' }
    ],
    brandNotes: 'Peugeot araçlarda üreticiye özel kodlar bulunabilir.'
  },
  {
    brand: 'Peugeot',
    model: '208',
    yearRange: '2012-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' },
      { code: 'P0442', title: 'EVAP Sistemi Küçük Kaçak', frequency: 'orta' },
      { code: 'P0128', title: 'Termostat Arızası', frequency: 'orta' }
    ]
  },

  // SEAT
  {
    brand: 'Seat',
    model: 'Leon',
    yearRange: '2012-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0299', title: 'Turbo/Süperşarj Düşük Basınç', frequency: 'yaygın' },
      { code: 'P2015', title: 'Emme Manifoldu Pozisyon Sensörü', frequency: 'orta' },
      { code: 'P0401', title: 'EGR Akış Yetersiz', frequency: 'orta' }
    ],
    brandNotes: 'Seat VAG grubuna aittir, VW Golf ile ortak platform kullanır.'
  },
  {
    brand: 'Seat',
    model: 'Ibiza',
    yearRange: '2008-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' },
      { code: 'P0442', title: 'EVAP Sistemi Küçük Kaçak', frequency: 'orta' },
      { code: 'P0128', title: 'Termostat Arızası', frequency: 'orta' }
    ]
  },

  // SKODA
  {
    brand: 'Skoda',
    model: 'Octavia',
    yearRange: '2004-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P2015', title: 'Emme Manifoldu Pozisyon Sensörü', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0299', title: 'Turbo/Süperşarj Düşük Basınç', frequency: 'orta' },
      { code: 'P0401', title: 'EGR Akış Yetersiz', frequency: 'orta' }
    ],
    brandNotes: 'Skoda VAG grubuna ait olup VW ile aynı motor ve şanzıman kullanır.'
  },
  {
    brand: 'Skoda',
    model: 'Fabia',
    yearRange: '2007-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' },
      { code: 'P0442', title: 'EVAP Sistemi Küçük Kaçak', frequency: 'orta' },
      { code: 'P0128', title: 'Termostat Arızası', frequency: 'orta' }
    ]
  },

  // DACIA
  {
    brand: 'Dacia',
    model: 'Duster',
    yearRange: '2010-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0340', title: 'Eksantrik Mili Pozisyon Sensörü', frequency: 'orta' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' },
      { code: 'P0442', title: 'EVAP Sistemi Küçük Kaçak', frequency: 'orta' }
    ],
    brandNotes: 'Dacia Renault grubuna aittir, basit ve güvenilir yapıdadır.'
  },
  {
    brand: 'Dacia',
    model: 'Sandero',
    yearRange: '2008-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'çok yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'yaygın' },
      { code: 'P0130', title: 'O2 Sensörü Devre Arızası', frequency: 'orta' },
      { code: 'P0505', title: 'Rölanti Hava Kontrol Valfi', frequency: 'orta' }
    ]
  },

  // NISSAN
  {
    brand: 'Nissan',
    model: 'Qashqai',
    yearRange: '2007-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' },
      { code: 'P0340', title: 'Eksantrik Mili Pozisyon Sensörü', frequency: 'orta' },
      { code: 'P0442', title: 'EVAP Sistemi Küçük Kaçak', frequency: 'orta' }
    ]
  },
  {
    brand: 'Nissan',
    model: 'Juke',
    yearRange: '2010-2024',
    commonCodes: [
      { code: 'P0420', title: 'Katalitik Konvertör Verimi Düşük', frequency: 'yaygın' },
      { code: 'P0171', title: 'Yakıt Sistemi Fakir Karışım', frequency: 'yaygın' },
      { code: 'P0234', title: 'Turbo Aşırı Basınç', frequency: 'orta', notes: 'Turbo modellerde dikkat' },
      { code: 'P0300', title: 'Çoklu Silindir Ateşleme Hatası', frequency: 'orta' },
      { code: 'P0442', title: 'EVAP Sistemi Küçük Kaçak', frequency: 'orta' }
    ]
  }
];

// Marka bazlı grupla
export function getVehiclesByBrand(brand: string): VehicleObdHistory[] {
  return vehicleObdHistory.filter(v => v.brand.toLowerCase() === brand.toLowerCase());
}

// Model bazlı bul
export function getVehicleByBrandModel(brand: string, model: string): VehicleObdHistory | undefined {
  return vehicleObdHistory.find(v =>
    v.brand.toLowerCase() === brand.toLowerCase() &&
    v.model?.toLowerCase() === model.toLowerCase()
  );
}

// Tüm markaları getir
export function getAllBrands(): string[] {
  return [...new Set(vehicleObdHistory.map(v => v.brand))].sort();
}

// Bir markaya ait tüm modelleri getir
export function getModelsByBrand(brand: string): string[] {
  return vehicleObdHistory
    .filter(v => v.brand.toLowerCase() === brand.toLowerCase())
    .map(v => v.model || '')
    .filter(Boolean)
    .sort();
}
