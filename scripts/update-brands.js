const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BRANDS = {
  'Audi': 'audi',
  'BMW': 'bmw',
  'Chevrolet': 'chevrolet',
  'Citroen': 'citroen',
  'Dacia': 'dacia',
  'Fiat': 'fiat',
  'Ford': 'ford',
  'Honda': 'honda',
  'Hyundai': 'hyundai',
  'Kia': 'kia',
  'Mazda': 'mazda',
  'Mercedes': 'mercedes-benz',
  'Mini': 'mini',
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

const FILTER_WORDS = ['sahibinden', 'galeriden', 'yetkili', 'bayiden', 'ikinci', 'el'];

async function fetchModels(brandSlug) {
  const models = new Map();

  // Hem otomobil hem SUV kategorilerini tara
  const categories = ['otomobil', 'arazi-suv-pick-up'];

  for (const category of categories) {
    try {
      const res = await axios.get('https://www.arabam.com/ikinci-el/' + category + '/' + brandSlug, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 10000
      });
      const $ = cheerio.load(res.data);

      const regex = new RegExp('/ikinci-el/' + category + '/' + brandSlug + '-([a-z0-9-]+?)(?:\\?|$)');

      $('a[href*="/ikinci-el/' + category + '/' + brandSlug + '-"]').each((_, el) => {
        const href = $(el).attr('href') || '';
        const match = href.match(regex);
        if (match) {
          const slug = match[1];
          if (FILTER_WORDS.some(w => slug.includes(w))) return;
          if (slug.match(/^\d+-\d+/)) return;
          if (slug.split('-').length > 3) return;

          const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          models.set(slug, name);
        }
      });
    } catch (e) {
      // Kategori bulunamadı, devam et
    }
  }

  return [...models.entries()].map(([slug, name]) => ({ slug, name })).sort((a, b) => a.name.localeCompare(b.name, 'tr'));
}

async function main() {
  const result = {};

  for (const [brandName, brandSlug] of Object.entries(BRANDS)) {
    try {
      const models = await fetchModels(brandSlug);
      result[brandName] = { slug: brandSlug, models };
      console.log(brandName + ': ' + models.length + ' model');
      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      console.error(brandName + ': HATA - ' + e.message);
      result[brandName] = { slug: brandSlug, models: [] };
    }
  }

  const date = new Date().toISOString().split('T')[0];
  let ts = '// Auto-generated from arabam.com - ' + date + '\n\n';
  ts += 'export interface BrandData {\n  slug: string;\n  models: { slug: string; name: string }[];\n}\n\n';
  ts += 'export const arabamBrands: Record<string, BrandData> = ' + JSON.stringify(result, null, 2) + ';\n\n';
  ts += 'export function getArabamBrands(): string[] {\n  return Object.keys(arabamBrands).sort((a, b) => a.localeCompare(b, \'tr\'));\n}\n\n';
  ts += 'export function getArabamModels(brand: string): { slug: string; name: string }[] {\n  return arabamBrands[brand]?.models || [];\n}\n\n';
  ts += 'export function getBrandSlug(brand: string): string | null {\n  return arabamBrands[brand]?.slug || null;\n}\n';

  fs.writeFileSync('./src/data/arabam-brands.ts', ts);
  console.log('\nKaydedildi: src/data/arabam-brands.ts');
}

main();
