const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Markalar
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

// Minimum ilan sayısı (bu sayının altındaki modeller dahil edilmez)
const MIN_LISTINGS = 50;

async function fetchModelsWithCount(brandSlug) {
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

      const $ = cheerio.load(res.data);

      // Model linklerini ve ilan sayılarını bul
      $('a[href*="/' + category + '/' + brandSlug + '-"]').each((_, el) => {
        const href = $(el).attr('href') || '';
        const text = $(el).text().trim();

        // Model slug'ını çıkar
        const match = href.match(new RegExp('/' + category + '/' + brandSlug + '-([a-z0-9-]+?)(?:\\?|$)'));
        if (!match) return;

        const slug = match[1];

        // Geçersiz slug'ları filtrele
        if (slug.includes('sahibinden') || slug.includes('galeriden') ||
            slug.includes('yetkili') || slug.includes('fiyat') ||
            slug.includes('hatasiz') || slug.includes('boyasiz')) return;

        // Motor formatı olanları filtrele (1-6, 2-0 gibi)
        const parts = slug.split('-');
        if (parts.length >= 2 && /^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])) return;

        // Çok uzun slug'ları filtrele
        if (parts.length > 3) return;

        // İlan sayısını bul (text içinde rakam ara)
        const countMatch = text.match(/(\d+\.?\d*)/);
        let count = 0;
        if (countMatch) {
          count = parseInt(countMatch[1].replace('.', ''));
        }

        // Model adını formatla
        const name = slug.split('-').map(w => {
          if (w === 'suv') return 'SUV';
          if (w === 'gt') return 'GT';
          if (w === 'gtd') return 'GTD';
          if (w === 'gti') return 'GTI';
          if (/^\d+$/.test(w)) return w;
          if (w.length <= 2) return w.toUpperCase();
          return w.charAt(0).toUpperCase() + w.slice(1);
        }).join(' ');

        // Mevcut count'tan büyükse güncelle
        if (!models.has(slug) || models.get(slug).count < count) {
          models.set(slug, { slug, name, count });
        }
      });
    } catch (e) {
      // Hata, devam et
    }
  }

  // Minimum ilan sayısına göre filtrele ve sırala
  return [...models.values()]
    .filter(m => m.count >= MIN_LISTINGS)
    .sort((a, b) => b.count - a.count)
    .map(({ slug, name }) => ({ slug, name }));
}

async function main() {
  console.log('Popüler modeller çekiliyor (min ' + MIN_LISTINGS + ' ilan)...\n');

  const result = {};
  let totalModels = 0;

  for (const [brandName, brandSlug] of Object.entries(BRANDS)) {
    try {
      const models = await fetchModelsWithCount(brandSlug);
      if (models.length > 0) {
        result[brandName] = { slug: brandSlug, models };
        totalModels += models.length;
        console.log(brandName + ': ' + models.length + ' model');
      } else {
        console.log(brandName + ': model yok');
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
  ts += '// Sadece ' + MIN_LISTINGS + '+ ilanı olan modeller dahil\n\n';
  ts += 'export interface BrandData {\n  slug: string;\n  models: { slug: string; name: string }[];\n}\n\n';
  ts += 'export const arabamBrands: Record<string, BrandData> = ' + JSON.stringify(result, null, 2) + ';\n\n';
  ts += 'export function getArabamBrands(): string[] {\n  return Object.keys(arabamBrands).sort((a, b) => a.localeCompare(b, \'tr\'));\n}\n\n';
  ts += 'export function getArabamModels(brand: string): { slug: string; name: string }[] {\n  return arabamBrands[brand]?.models || [];\n}\n\n';
  ts += 'export function getBrandSlug(brand: string): string | null {\n  return arabamBrands[brand]?.slug || null;\n}\n';

  fs.writeFileSync('./src/data/arabam-brands.ts', ts);
  console.log('\nKaydedildi: src/data/arabam-brands.ts');
}

main();
