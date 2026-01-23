const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Brands dosyasından modelleri oku
const brandsContent = fs.readFileSync('./src/data/arabam-brands.ts', 'utf-8');
const brandsMatch = brandsContent.match(/export const arabamBrands[^=]*=\s*(\{[\s\S]+?\});/);
const arabamBrands = eval('(' + brandsMatch[1] + ')');

async function fetchEnginesAndPackages(brandSlug, modelSlug) {
  const engines = new Map();
  const categories = ['otomobil', 'arazi-suv-pick-up'];

  for (const category of categories) {
    const url = 'https://www.arabam.com/ikinci-el/' + category + '/' + brandSlug + '-' + modelSlug;

    try {
      const res = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 10000
      });
      const $ = cheerio.load(res.data);

      const regex = new RegExp('/ikinci-el/' + category + '/' + brandSlug + '-' + modelSlug + '-([a-z0-9-]+?)(?:\\?|$)');

      $('a[href*="/ikinci-el/' + category + '/' + brandSlug + '-' + modelSlug + '-"]').each((_, el) => {
        const href = $(el).attr('href') || '';
        const match = href.match(regex);
        if (match) {
          const subSlug = match[1];
          // Motor formatı: 1-6, 2-0, 1-4-tdi vs.
          if (subSlug.match(/^\d+-\d+/) || subSlug.match(/^[a-z]+-\d+/)) {
            const name = subSlug.split('-').map(w => {
              if (/^\d+$/.test(w)) return w;
              return w.toUpperCase();
            }).join('.').replace(/\.\./g, ' ').replace(/\.([A-Z])/g, ' $1');

            if (!engines.has(subSlug)) {
              engines.set(subSlug, { slug: subSlug, name: name, packages: [] });
            }
          }
        }
      });
    } catch (e) {
      // Bu kategori için model yok, devam et
    }
  }

  return [...engines.values()];
}

async function main() {
  const result = {};
  let total = 0;
  let processed = 0;

  // Toplam model sayısını hesapla
  for (const brand of Object.values(arabamBrands)) {
    total += brand.models.length;
  }

  console.log('Toplam ' + total + ' model işlenecek...\n');

  for (const [brandName, brandData] of Object.entries(arabamBrands)) {
    for (const model of brandData.models) {
      processed++;
      const key = brandName + '|' + model.name;

      const engines = await fetchEnginesAndPackages(brandData.slug, model.slug);

      if (engines.length > 0) {
        result[key] = {
          brandSlug: brandData.slug,
          modelSlug: model.slug,
          engines: engines
        };
        console.log('[' + processed + '/' + total + '] ' + key + ': ' + engines.length + ' motor');
      } else {
        console.log('[' + processed + '/' + total + '] ' + key + ': motor yok');
      }

      await new Promise(r => setTimeout(r, 200));
    }
  }

  // TypeScript dosyası oluştur
  const date = new Date().toISOString().split('T')[0];
  let ts = '// Auto-generated from arabam.com - ' + date + '\n\n';
  ts += 'export interface PackageOption {\n  slug: string;\n  name: string;\n}\n\n';
  ts += 'export interface EngineOption {\n  slug: string;\n  name: string;\n  packages: PackageOption[];\n}\n\n';
  ts += 'export interface ModelPackageData {\n  brandSlug: string;\n  modelSlug: string;\n  engines: EngineOption[];\n}\n\n';
  ts += 'export const arabamPackages: Record<string, ModelPackageData> = ' + JSON.stringify(result, null, 2) + ';\n\n';
  ts += 'export function getModelEngines(brand: string, model: string): EngineOption[] {\n  const key = brand + \'|\' + model;\n  return arabamPackages[key]?.engines || [];\n}\n\n';
  ts += 'export function getEnginePackages(brand: string, model: string, engineSlug: string): PackageOption[] {\n  const engines = getModelEngines(brand, model);\n  const engine = engines.find(e => e.slug === engineSlug);\n  return engine?.packages || [];\n}\n\n';
  ts += 'export function hasPackageData(brand: string, model: string): boolean {\n  const key = brand + \'|\' + model;\n  return !!arabamPackages[key];\n}\n';

  fs.writeFileSync('./src/data/arabam-packages.ts', ts);
  console.log('\nKaydedildi: src/data/arabam-packages.ts');
  console.log('Toplam ' + Object.keys(result).length + ' model için motor verisi eklendi.');
}

main();
