const fs = require('fs');

// Mevcut brands dosyasını oku
const brandsContent = fs.readFileSync('./src/data/arabam-brands.ts', 'utf-8');
const brandsMatch = brandsContent.match(/export const arabamBrands[^=]*=\s*(\{[\s\S]+?\});/);
const arabamBrands = eval('(' + brandsMatch[1] + ')');

// 2000 öncesi üretim başlangıcı olan modeller (kaldırılacak)
const OLD_MODELS = {
  'Alfa Romeo': ['145', '146', '155', '164', '90'],
  'Audi': ['80 Serisi', '90 Serisi', '100 Serisi', '200 Serisi'],
  'BMW': ['Z Serisi'],
  'Chevrolet': ['Caprice'],
  'Citroen': ['BX', 'Saxo', 'Xantia', 'XM', 'ZX', 'Evasion'],
  'Fiat': ['126 Bis', 'Regata', 'Tempra', 'Uno', 'Brava', 'Marea', 'Siena', 'Palio'],
  'Ford': ['Taunus', 'Sierra', 'Escort', 'Granada', 'Scorpio', 'Festiva', 'Probe'],
  'Honda': ['Crx', 'Prelude', 'Legend', 'Shuttle', 'Stream'],
  'Hyundai': ['Excel', 'Galloper', 'Terracan'],
  'Kia': ['Capital', 'Sephia', 'Clarus', 'Pride', 'Shuma', 'Retona'],
  'Mazda': ['121', '323', '626', 'Lantis', 'Premacy'],
  'Mercedes': ['190'],
  'Mitsubishi': ['Galant', 'Lancer Evolution', 'Space Wagon'],
  'Nissan': ['100 NX', '200 SX', '300 ZX', '350 Z', 'Bluebird', 'NX Coupe', 'Sunny', 'Laurel Altima', 'Primera'],
  'Opel': ['Kadett', 'Ascona', 'Rekord', 'Omega', 'Calibra', 'Tigra'],
  'Peugeot': ['106', '205', '309', '405', '605'],
  'Renault': ['R 5', 'R 9', 'R 11', 'R 12', 'R 19', 'R 21', 'R 25', '12 Toros', 'Safrane'],
  'Seat': ['Arosa', 'Marbella', 'Cordoba'],
  'Skoda': ['Favorit', 'Felicia', 'Forman'],
  'Suzuki': ['Maruti', 'Alto', 'Wagon R'],
  'Toyota': ['Starlet', 'Carina', 'Corona'],
  'Volkswagen': ['Vento', 'Lupo'],
  'Volvo': ['850', '940', 'S70', 'V70', 'C70']
};

console.log('2000 öncesi modeller kaldırılıyor...\n');

const result = {};
let removedCount = 0;
let keptCount = 0;

for (const [brandName, brandData] of Object.entries(arabamBrands)) {
  const oldModels = OLD_MODELS[brandName] || [];

  const validModels = [];
  const removedModels = [];

  for (const model of brandData.models) {
    if (oldModels.includes(model.name)) {
      removedModels.push(model.name);
      removedCount++;
    } else {
      validModels.push(model);
      keptCount++;
    }
  }

  if (removedModels.length > 0) {
    console.log(brandName + ': ' + removedModels.join(', '));
  }

  if (validModels.length > 0) {
    result[brandName] = { slug: brandData.slug, models: validModels };
  }
}

console.log('\n========================================');
console.log('Kaldırılan: ' + removedCount + ' model');
console.log('Kalan: ' + keptCount + ' model');

// Kaydet
const date = new Date().toISOString().split('T')[0];
let ts = '// Auto-generated from arabam.com - ' + date + '\n';
ts += '// 2000 ve sonrası modeller\n\n';
ts += 'export interface BrandData {\n  slug: string;\n  models: { slug: string; name: string }[];\n}\n\n';
ts += 'export const arabamBrands: Record<string, BrandData> = ' + JSON.stringify(result, null, 2) + ';\n\n';
ts += 'export function getArabamBrands(): string[] {\n  return Object.keys(arabamBrands).sort((a, b) => a.localeCompare(b, \'tr\'));\n}\n\n';
ts += 'export function getArabamModels(brand: string): { slug: string; name: string }[] {\n  return arabamBrands[brand]?.models || [];\n}\n\n';
ts += 'export function getBrandSlug(brand: string): string | null {\n  return arabamBrands[brand]?.slug || null;\n}\n';

fs.writeFileSync('./src/data/arabam-brands.ts', ts);
console.log('\nKaydedildi!');
