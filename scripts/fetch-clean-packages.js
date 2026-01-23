const axios = require('axios');
const fs = require('fs');

// Brands dosyasından modelleri oku
const brandsContent = fs.readFileSync('./src/data/arabam-brands.ts', 'utf-8');
const brandsMatch = brandsContent.match(/export const arabamBrands[^=]*=\s*(\{[\s\S]+?\});/);
const arabamBrands = eval('(' + brandsMatch[1] + ')');

// Motor formatını kontrol et
function isEngineFormat(slug) {
  // 1-0, 1-4, 2-0, 1-6-tdi gibi formatlar
  const parts = slug.split('-');
  if (parts.length < 2) return false;

  // İlk iki parça rakam olmalı (motor hacmi)
  if (/^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])) {
    return true;
  }
  return false;
}

// Motor adını formatla
function formatEngineName(slug) {
  const parts = slug.split('-');
  let name = parts[0] + '.' + parts[1];

  if (parts.length > 2) {
    const suffix = parts.slice(2).map(p => p.toUpperCase()).join(' ');
    name += ' ' + suffix;
  }

  return name;
}

async function fetchEngines(brandSlug, modelSlug) {
  const engines = new Map();
  const categories = ['otomobil', 'arazi-suv-pick-up'];

  for (const category of categories) {
    try {
      const url = 'https://www.arabam.com/ikinci-el/' + category + '/' + brandSlug + '-' + modelSlug;
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept-Language': 'tr-TR,tr;q=0.9'
        },
        timeout: 15000
      });

      const html = res.data;
      const regex = new RegExp(category + '/' + brandSlug + '-' + modelSlug + '-([a-z0-9-]+?)(?:\\?|")', 'g');

      let match;
      while ((match = regex.exec(html)) !== null) {
        const subSlug = match[1];
        if (isEngineFormat(subSlug) && !engines.has(subSlug)) {
          engines.set(subSlug, {
            slug: subSlug,
            name: formatEngineName(subSlug),
            packages: []
          });
        }
      }
    } catch (e) {
      // Kategori bulunamadı
    }
  }

  return [...engines.values()].sort((a, b) => a.name.localeCompare(b.name));
}

async function main() {
  console.log('Motor verileri çekiliyor...\n');

  const result = {};
  let totalModels = 0;
  let modelsWithEngines = 0;

  const brands = Object.entries(arabamBrands);

  for (const [brandName, brandData] of brands) {
    for (const model of brandData.models) {
      totalModels++;
      const key = brandName + '|' + model.name;

      try {
        const engines = await fetchEngines(brandData.slug, model.slug);

        if (engines.length > 0) {
          result[key] = {
            brandSlug: brandData.slug,
            modelSlug: model.slug,
            engines: engines
          };
          modelsWithEngines++;
          console.log('[' + totalModels + '] ' + key + ': ' + engines.length + ' motor');
        } else {
          console.log('[' + totalModels + '] ' + key + ': -');
        }

        await new Promise(r => setTimeout(r, 150));
      } catch (e) {
        console.log('[' + totalModels + '] ' + key + ': HATA');
      }
    }
  }

  console.log('\nToplam: ' + modelsWithEngines + '/' + totalModels + ' model için motor verisi');

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
}

main();
