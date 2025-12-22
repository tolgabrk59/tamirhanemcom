const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Türkiye'de popüler markalar ve slug'ları
const BRANDS = {
  'Alfa Romeo': 'alfa-romeo',
  'Audi': 'audi',
  'BMW': 'bmw',
  'Chevrolet': 'chevrolet',
  'Citroen': 'citroen',
  'Cupra': 'cupra',
  'Dacia': 'dacia',
  'DS Automobiles': 'ds-automobiles',
  'Fiat': 'fiat',
  'Ford': 'ford',
  'Honda': 'honda',
  'Hyundai': 'hyundai',
  'Kia': 'kia',
  'Mazda': 'mazda',
  'Mercedes': 'mercedes-benz',
  'Mini': 'mini',
  'Mitsubishi': 'mitsubishi',
  'Nissan': 'nissan',
  'Opel': 'opel',
  'Peugeot': 'peugeot',
  'Renault': 'renault',
  'Seat': 'seat',
  'Skoda': 'skoda',
  'Suzuki': 'suzuki',
  'Toyota': 'toyota',
  'Volkswagen': 'volkswagen',
  'Volvo': 'volvo'
};

// Filtrelenecek kelimeler
const FILTER_WORDS = [
  'sahibinden', 'galeriden', 'yetkili', 'bayiden', 'fiyat', 'listesi',
  'hatasiz', 'boyasiz', 'degisensiz', 'temiz', 'otomatik', 'manuel',
  'km', 'model', 'full', 'ekstrali', 'kazasiz', 'kredi'
];

// Model mi yoksa motor/paket mi kontrol et
function isValidModel(slug) {
  // Filtrelenen kelimeleri içeriyorsa geçersiz
  if (FILTER_WORDS.some(w => slug.includes(w))) return false;

  // Çok uzun slug'lar genelde ilan başlığı
  if (slug.split('-').length > 4) return false;

  // Motor formatı içeriyorsa (örn: 1-6, 2-0-tdi) bu bir alt varyasyon
  // Ama bazı modeller sayı içerebilir (örn: 3-serisi, 508)
  // Bu yüzden sadece "rakam-rakam" formatını filtrele
  const parts = slug.split('-');
  for (let i = 0; i < parts.length - 1; i++) {
    if (/^\d+$/.test(parts[i]) && /^\d+$/.test(parts[i + 1])) {
      // 1-6, 2-0 gibi motor formatı
      if (parseInt(parts[i]) <= 9 && parseInt(parts[i + 1]) <= 9) {
        return false;
      }
    }
  }

  return true;
}

// Model adını düzelt
function formatModelName(slug) {
  return slug.split('-').map(w => {
    // Özel durumlar
    if (w === 'suv') return 'SUV';
    if (w === 'gt') return 'GT';
    if (w === 'gtd') return 'GTD';
    if (w === 'gti') return 'GTI';
    if (w === 'tdi') return 'TDI';
    if (w === 'tsi') return 'TSI';
    if (w === 'amg') return 'AMG';
    if (w === 'rs') return 'RS';
    if (w === 'cc') return 'CC';
    if (/^\d+$/.test(w)) return w;
    if (/^[a-z]\d+$/.test(w)) return w.toUpperCase();
    if (w.length <= 2) return w.toUpperCase();
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
}

async function fetchModels(brandSlug) {
  const models = new Map();
  const categories = ['otomobil', 'arazi-suv-pick-up'];

  for (const category of categories) {
    try {
      const url = 'https://www.arabam.com/ikinci-el/' + category + '/' + brandSlug;
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept-Language': 'tr-TR,tr;q=0.9'
        },
        timeout: 15000
      });

      const html = res.data;

      // Tüm model linklerini bul
      const regex = new RegExp(category + '/' + brandSlug + '-([a-z0-9-]+?)(?:\\?|")', 'g');
      let match;
      while ((match = regex.exec(html)) !== null) {
        const slug = match[1];
        if (isValidModel(slug) && !models.has(slug)) {
          models.set(slug, formatModelName(slug));
        }
      }
    } catch (e) {
      // Kategori bulunamadı
    }
  }

  return [...models.entries()]
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'tr'));
}

async function main() {
  console.log('Arabam.com\'dan marka ve modeller çekiliyor...\n');

  const result = {};
  let totalModels = 0;

  for (const [brandName, brandSlug] of Object.entries(BRANDS)) {
    try {
      const models = await fetchModels(brandSlug);
      if (models.length > 0) {
        result[brandName] = { slug: brandSlug, models };
        totalModels += models.length;
        console.log(brandName + ': ' + models.length + ' model');

        // İlk 5 modeli göster
        // console.log('  -> ' + models.slice(0, 5).map(m => m.name).join(', '));
      }
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.error(brandName + ': HATA - ' + e.message);
    }
  }

  console.log('\nToplam: ' + Object.keys(result).length + ' marka, ' + totalModels + ' model');

  // TypeScript dosyası oluştur
  const date = new Date().toISOString().split('T')[0];
  let ts = '// Auto-generated from arabam.com - ' + date + '\n';
  ts += '// Sadece otomobil ve SUV kategorileri dahil\n\n';
  ts += 'export interface BrandData {\n  slug: string;\n  models: { slug: string; name: string }[];\n}\n\n';
  ts += 'export const arabamBrands: Record<string, BrandData> = ' + JSON.stringify(result, null, 2) + ';\n\n';
  ts += 'export function getArabamBrands(): string[] {\n  return Object.keys(arabamBrands).sort((a, b) => a.localeCompare(b, \'tr\'));\n}\n\n';
  ts += 'export function getArabamModels(brand: string): { slug: string; name: string }[] {\n  return arabamBrands[brand]?.models || [];\n}\n\n';
  ts += 'export function getBrandSlug(brand: string): string | null {\n  return arabamBrands[brand]?.slug || null;\n}\n';

  fs.writeFileSync('./src/data/arabam-brands.ts', ts);
  console.log('\nKaydedildi: src/data/arabam-brands.ts');
}

main();
