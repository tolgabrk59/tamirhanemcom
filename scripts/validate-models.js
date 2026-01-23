const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Mevcut brands dosyasını oku
const brandsContent = fs.readFileSync('./src/data/arabam-brands.ts', 'utf-8');
const brandsMatch = brandsContent.match(/export const arabamBrands[^=]*=\s*(\{[\s\S]+?\});/);
const arabamBrands = eval('(' + brandsMatch[1] + ')');

async function getArabamModels(brandSlug) {
  const validModels = new Set();
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

      // Sidebar'daki model listesini bul (ana model linkleri)
      $('a[href*="/' + category + '/' + brandSlug + '-"]').each((_, el) => {
        const href = $(el).attr('href') || '';
        const match = href.match(new RegExp('/' + category + '/' + brandSlug + '-([a-z0-9-]+?)(?:\\?|$)'));
        if (match) {
          validModels.add(match[1]);
        }
      });
    } catch (e) {
      // devam
    }
  }

  return validModels;
}

async function main() {
  console.log('Arabam.com ile karşılaştırma yapılıyor...\n');

  const result = {};
  let removedCount = 0;
  let keptCount = 0;

  for (const [brandName, brandData] of Object.entries(arabamBrands)) {
    console.log('\n' + brandName + ' kontrol ediliyor...');

    const arabamModels = await getArabamModels(brandData.slug);
    console.log('  Arabam.com\'da ' + arabamModels.size + ' model bulundu');

    const validModels = [];
    const removedModels = [];

    for (const model of brandData.models) {
      if (arabamModels.has(model.slug)) {
        validModels.push(model);
        keptCount++;
      } else {
        removedModels.push(model.name);
        removedCount++;
      }
    }

    if (removedModels.length > 0) {
      console.log('  KALDIRILAN: ' + removedModels.join(', '));
    }

    if (validModels.length > 0) {
      result[brandName] = { slug: brandData.slug, models: validModels };
      console.log('  Kalan: ' + validModels.length + ' model');
    }

    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n========================================');
  console.log('Toplam kaldırılan: ' + removedCount + ' model');
  console.log('Toplam kalan: ' + keptCount + ' model');

  // TypeScript dosyası oluştur
  const date = new Date().toISOString().split('T')[0];
  let ts = '// Auto-generated from arabam.com - ' + date + '\n';
  ts += '// Arabam.com ile doğrulanmış modeller\n\n';
  ts += 'export interface BrandData {\n  slug: string;\n  models: { slug: string; name: string }[];\n}\n\n';
  ts += 'export const arabamBrands: Record<string, BrandData> = ' + JSON.stringify(result, null, 2) + ';\n\n';
  ts += 'export function getArabamBrands(): string[] {\n  return Object.keys(arabamBrands).sort((a, b) => a.localeCompare(b, \'tr\'));\n}\n\n';
  ts += 'export function getArabamModels(brand: string): { slug: string; name: string }[] {\n  return arabamBrands[brand]?.models || [];\n}\n\n';
  ts += 'export function getBrandSlug(brand: string): string | null {\n  return arabamBrands[brand]?.slug || null;\n}\n';

  fs.writeFileSync('./src/data/arabam-brands.ts', ts);
  console.log('\nKaydedildi: src/data/arabam-brands.ts');
}

main();
