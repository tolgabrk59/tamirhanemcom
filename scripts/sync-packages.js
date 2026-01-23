const fs = require('fs');

// Mevcut brands dosyasını oku
const brandsContent = fs.readFileSync('./src/data/arabam-brands.ts', 'utf-8');
const brandsMatch = brandsContent.match(/export const arabamBrands[^=]*=\s*(\{[\s\S]+?\});/);
const arabamBrands = eval('(' + brandsMatch[1] + ')');

// Packages dosyasını oku
const packagesContent = fs.readFileSync('./src/data/arabam-packages.ts', 'utf-8');
const packagesMatch = packagesContent.match(/export const arabamPackages[^=]*=\s*(\{[\s\S]+?\});/);
const arabamPackages = eval('(' + packagesMatch[1] + ')');

// Geçerli marka|model kombinasyonlarını oluştur
const validKeys = new Set();
for (const [brandName, brandData] of Object.entries(arabamBrands)) {
  for (const model of brandData.models) {
    validKeys.add(brandName + '|' + model.name);
  }
}

console.log('Geçerli kombinasyon sayısı: ' + validKeys.size);

// Packages'ı filtrele
const result = {};
let removed = 0;
let kept = 0;

for (const [key, data] of Object.entries(arabamPackages)) {
  if (validKeys.has(key)) {
    result[key] = data;
    kept++;
  } else {
    removed++;
    console.log('Kaldırıldı: ' + key);
  }
}

console.log('\n========================================');
console.log('Kaldırılan: ' + removed);
console.log('Kalan: ' + kept);

// Kaydet
const date = new Date().toISOString().split('T')[0];
let ts = '// Auto-generated from arabam.com - ' + date + '\n\n';
ts += 'export interface PackageOption {\n  slug: string;\n  name: string;\n}\n\n';
ts += 'export interface EngineOption {\n  slug: string;\n  name: string;\n  packages: PackageOption[];\n}\n\n';
ts += 'export interface ModelPackageData {\n  brandSlug: string;\n  modelSlug: string;\n  engines: EngineOption[];\n}\n\n';
ts += 'export const arabamPackages: Record<string, ModelPackageData> = ' + JSON.stringify(result, null, 2) + ';\n\n';
ts += 'export function getModelEngines(brand: string, model: string): EngineOption[] {\n';
ts += '  const key = `${brand}|${model}`;\n';
ts += '  return arabamPackages[key]?.engines || [];\n}\n\n';
ts += 'export function getEnginePackages(brand: string, model: string, engine: string): PackageOption[] {\n';
ts += '  const engines = getModelEngines(brand, model);\n';
ts += '  const eng = engines.find(e => e.name === engine);\n';
ts += '  return eng?.packages || [];\n}\n\n';
ts += 'export function hasPackageData(brand: string, model: string): boolean {\n';
ts += '  const key = `${brand}|${model}`;\n';
ts += '  return !!arabamPackages[key];\n}\n';

fs.writeFileSync('./src/data/arabam-packages.ts', ts);
console.log('\nKaydedildi!');
