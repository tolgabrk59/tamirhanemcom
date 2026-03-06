// Şehir bazlı maliyet çarpanları
// İstanbul = 1.0 referans olarak alınmıştır

export interface CityCostData {
  city: string;
  citySlug: string;
  multiplier: number; // 1.0 = İstanbul referans
  laborCostPerHour: number; // Saat başı işçilik ücreti (TL)
  notes?: string;
}

export const cityCostData: CityCostData[] = [
  // Büyükşehirler (Yüksek maliyet)
  { city: 'İstanbul', citySlug: 'istanbul', multiplier: 1.0, laborCostPerHour: 800, notes: 'Referans şehir' },
  { city: 'Ankara', citySlug: 'ankara', multiplier: 0.95, laborCostPerHour: 750, notes: 'Başkent, yüksek maliyet' },
  { city: 'İzmir', citySlug: 'izmir', multiplier: 0.92, laborCostPerHour: 720 },
  { city: 'Bursa', citySlug: 'bursa', multiplier: 0.88, laborCostPerHour: 680 },
  { city: 'Antalya', citySlug: 'antalya', multiplier: 0.90, laborCostPerHour: 700, notes: 'Turizm bölgesi' },
  { city: 'Adana', citySlug: 'adana', multiplier: 0.82, laborCostPerHour: 620 },
  { city: 'Konya', citySlug: 'konya', multiplier: 0.78, laborCostPerHour: 580 },
  { city: 'Gaziantep', citySlug: 'gaziantep', multiplier: 0.80, laborCostPerHour: 600 },
  { city: 'Mersin', citySlug: 'mersin', multiplier: 0.80, laborCostPerHour: 600 },
  { city: 'Kayseri', citySlug: 'kayseri', multiplier: 0.76, laborCostPerHour: 560 },
  { city: 'Eskişehir', citySlug: 'eskisehir', multiplier: 0.82, laborCostPerHour: 620 },
  { city: 'Kocaeli', citySlug: 'kocaeli', multiplier: 0.90, laborCostPerHour: 700, notes: 'Sanayi bölgesi' },
  { city: 'Sakarya', citySlug: 'sakarya', multiplier: 0.85, laborCostPerHour: 660 },
  { city: 'Denizli', citySlug: 'denizli', multiplier: 0.78, laborCostPerHour: 580 },
  { city: 'Samsun', citySlug: 'samsun', multiplier: 0.75, laborCostPerHour: 560 },
  { city: 'Trabzon', citySlug: 'trabzon', multiplier: 0.78, laborCostPerHour: 580 },
  { city: 'Manisa', citySlug: 'manisa', multiplier: 0.76, laborCostPerHour: 560 },
  { city: 'Balıkesir', citySlug: 'balikesir', multiplier: 0.75, laborCostPerHour: 550 },
  { city: 'Aydın', citySlug: 'aydin', multiplier: 0.78, laborCostPerHour: 580 },
  { city: 'Muğla', citySlug: 'mugla', multiplier: 0.88, laborCostPerHour: 680, notes: 'Turizm bölgesi' },
  { city: 'Tekirdağ', citySlug: 'tekirdag', multiplier: 0.85, laborCostPerHour: 660 },
  { city: 'Diyarbakır', citySlug: 'diyarbakir', multiplier: 0.72, laborCostPerHour: 520 },
  { city: 'Şanlıurfa', citySlug: 'sanliurfa', multiplier: 0.70, laborCostPerHour: 500 },
  { city: 'Malatya', citySlug: 'malatya', multiplier: 0.72, laborCostPerHour: 520 },
  { city: 'Elazığ', citySlug: 'elazig', multiplier: 0.70, laborCostPerHour: 500 },
  { city: 'Van', citySlug: 'van', multiplier: 0.68, laborCostPerHour: 480 },
  { city: 'Erzurum', citySlug: 'erzurum', multiplier: 0.68, laborCostPerHour: 480 },
  { city: 'Hatay', citySlug: 'hatay', multiplier: 0.75, laborCostPerHour: 550 },
  { city: 'Kahramanmaraş', citySlug: 'kahramanmaras', multiplier: 0.72, laborCostPerHour: 520 },
  { city: 'Afyonkarahisar', citySlug: 'afyonkarahisar', multiplier: 0.70, laborCostPerHour: 500 },

  // Diğer iller (ortalama maliyet)
  { city: 'Adıyaman', citySlug: 'adiyaman', multiplier: 0.68, laborCostPerHour: 480 },
  { city: 'Aksaray', citySlug: 'aksaray', multiplier: 0.70, laborCostPerHour: 500 },
  { city: 'Amasya', citySlug: 'amasya', multiplier: 0.70, laborCostPerHour: 500 },
  { city: 'Artvin', citySlug: 'artvin', multiplier: 0.72, laborCostPerHour: 520 },
  { city: 'Bilecik', citySlug: 'bilecik', multiplier: 0.75, laborCostPerHour: 550 },
  { city: 'Bingöl', citySlug: 'bingol', multiplier: 0.65, laborCostPerHour: 460 },
  { city: 'Bitlis', citySlug: 'bitlis', multiplier: 0.65, laborCostPerHour: 460 },
  { city: 'Bolu', citySlug: 'bolu', multiplier: 0.78, laborCostPerHour: 580 },
  { city: 'Burdur', citySlug: 'burdur', multiplier: 0.72, laborCostPerHour: 520 },
  { city: 'Çanakkale', citySlug: 'canakkale', multiplier: 0.78, laborCostPerHour: 580 },
  { city: 'Çankırı', citySlug: 'cankiri', multiplier: 0.68, laborCostPerHour: 480 },
  { city: 'Çorum', citySlug: 'corum', multiplier: 0.70, laborCostPerHour: 500 },
  { city: 'Düzce', citySlug: 'duzce', multiplier: 0.78, laborCostPerHour: 580 },
  { city: 'Edirne', citySlug: 'edirne', multiplier: 0.78, laborCostPerHour: 580 },
  { city: 'Giresun', citySlug: 'giresun', multiplier: 0.72, laborCostPerHour: 520 },
  { city: 'Isparta', citySlug: 'isparta', multiplier: 0.72, laborCostPerHour: 520 },
  { city: 'Karabük', citySlug: 'karabuk', multiplier: 0.75, laborCostPerHour: 550 },
  { city: 'Karaman', citySlug: 'karaman', multiplier: 0.70, laborCostPerHour: 500 },
  { city: 'Kırıkkale', citySlug: 'kirikkale', multiplier: 0.72, laborCostPerHour: 520 },
  { city: 'Kırklareli', citySlug: 'kirklareli', multiplier: 0.78, laborCostPerHour: 580 },
  { city: 'Kırşehir', citySlug: 'kirsehir', multiplier: 0.68, laborCostPerHour: 480 },
  { city: 'Kütahya', citySlug: 'kutahya', multiplier: 0.70, laborCostPerHour: 500 },
  { city: 'Mardin', citySlug: 'mardin', multiplier: 0.68, laborCostPerHour: 480 },
  { city: 'Muş', citySlug: 'mus', multiplier: 0.62, laborCostPerHour: 440 },
  { city: 'Nevşehir', citySlug: 'nevsehir', multiplier: 0.72, laborCostPerHour: 520 },
  { city: 'Niğde', citySlug: 'nigde', multiplier: 0.68, laborCostPerHour: 480 },
  { city: 'Ordu', citySlug: 'ordu', multiplier: 0.72, laborCostPerHour: 520 },
  { city: 'Osmaniye', citySlug: 'osmaniye', multiplier: 0.72, laborCostPerHour: 520 },
  { city: 'Rize', citySlug: 'rize', multiplier: 0.75, laborCostPerHour: 550 },
  { city: 'Sinop', citySlug: 'sinop', multiplier: 0.70, laborCostPerHour: 500 },
  { city: 'Sivas', citySlug: 'sivas', multiplier: 0.70, laborCostPerHour: 500 },
  { city: 'Tokat', citySlug: 'tokat', multiplier: 0.68, laborCostPerHour: 480 },
  { city: 'Uşak', citySlug: 'usak', multiplier: 0.72, laborCostPerHour: 520 },
  { city: 'Yalova', citySlug: 'yalova', multiplier: 0.85, laborCostPerHour: 660 },
  { city: 'Yozgat', citySlug: 'yozgat', multiplier: 0.65, laborCostPerHour: 460 },
  { city: 'Zonguldak', citySlug: 'zonguldak', multiplier: 0.78, laborCostPerHour: 580 }
];

// Şehir getir
export function getCityData(citySlug: string): CityCostData | undefined {
  return cityCostData.find(c => c.citySlug === citySlug);
}

// Tüm şehirleri getir
export function getAllCities(): CityCostData[] {
  return cityCostData.sort((a, b) => a.city.localeCompare(b.city, 'tr'));
}

// Şehre göre maliyet hesapla
export function calculateCityAdjustedCost(baseCostMin: number, baseCostMax: number, citySlug: string): { min: number; max: number } {
  const cityData = getCityData(citySlug);
  const multiplier = cityData?.multiplier || 1.0;

  return {
    min: Math.round(baseCostMin * multiplier),
    max: Math.round(baseCostMax * multiplier)
  };
}
