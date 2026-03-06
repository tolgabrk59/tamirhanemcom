const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Mevcut brands dosyasını oku
const brandsContent = fs.readFileSync('./src/data/arabam-brands.ts', 'utf-8');
const brandsMatch = brandsContent.match(/export const arabamBrands[^=]*=\s*(\{[\s\S]+?\});/);
const arabamBrands = eval('(' + brandsMatch[1] + ')');

// Minimum ilan sayısı
const MIN_COUNT = 10;

async function getModelCounts(brandSlug) {
  const counts = new Map();
  const categories = ['otomobil', 'arazi-suv-pick-up'];

  for (const category of categories) {
    try {
      const url = 'https://www.arabam.com/ikinci-el/' + category + '/' + brandSlug;
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 15000
      });

      const $ = cheerio.load(res.data);

      // Model linkleri ve ilan sayıları
      $('a').each((_, el) => {
        const href = $(el).attr('href') || '';
        const text = $(el).text().trim();

        const match = href.match(new RegExp('/' + category + '/' + brandSlug + '-([a-z0-9-]+?)(?:\\?|$)'));
        if (match) {
          const slug = match[1];
          // İlan sayısını bul
          const countMatch = text.match(/(\d+\.?\d*)/);
          if (countMatch) {
            const count = parseInt(countMatch[0].replace('.', ''));
            if (!counts.has(slug) || counts.get(slug) < count) {
              counts.set(slug, count);
            }
          }
        }
      });
    } catch (e) {}
  }

  return counts;
}

async function main() {
  console.log('Az ilanlı modeller filtreleniyor (min ' + MIN_COUNT + ' ilan)...\n');

  const result = {};
  let removedCount = 0;
  let keptCount = 0;

  for (const [brandName, brandData] of Object.entries(arabamBrands)) {
    const counts = await getModelCounts(brandData.slug);

    const validModels = [];
    const removedModels = [];

    for (const model of brandData.models) {
      const count = counts.get(model.slug) || 0;
      if (count >= MIN_COUNT) {
        validModels.push(model);
        keptCount++;
      } else {
        removedModels.push(model.name + ' (' + count + ')');
        removedCount++;
      }
    }

    if (removedModels.length > 0) {
      console.log(brandName + ' - KALDIRILAN: ' + removedModels.join(', '));
    }

    if (validModels.length > 0) {
      result[brandName] = { slug: brandData.slug, models: validModels };
    }

    await new Promise(r => setTimeout(r, 400));
  }

  console.log('\n========================================');
  console.log('Kaldırılan: ' + removedCount + ' model');
  console.log('Kalan: ' + keptCount + ' model');

  // Kaydet
  const date = new Date().toISOString().split('T')[0];
  let ts = '// Auto-generated from arabam.com - ' + date + '\n';
  ts += '// Min ' + MIN_COUNT + ' ilanı olan modeller\n\n';
  ts += 'export interface BrandData {\n  slug: string;\n  models: { slug: string; name: string }[];\n}\n\n';
  ts += 'export const arabamBrands: Record<string, BrandData> = ' + JSON.stringify(result, null, 2) + ';\n\n';
  ts += 'export function getArabamBrands(): string[] {\n  return Object.keys(arabamBrands).sort((a, b) => a.localeCompare(b, \'tr\'));\n}\n\n';
  ts += 'export function getArabamModels(brand: string): { slug: string; name: string }[] {\n  return arabamBrands[brand]?.models || [];\n}\n\n';
  ts += 'export function getBrandSlug(brand: string): string | null {\n  return arabamBrands[brand]?.slug || null;\n}\n';

  fs.writeFileSync('./src/data/arabam-brands.ts', ts);
  console.log('\nKaydedildi!');
}

main();
