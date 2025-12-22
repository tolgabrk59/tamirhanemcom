const fs = require('fs');

// Filtrelenecek kelimeler
const filterWords = ['sahibinden', 'galeriden', 'yetkili-bayiden', 'yetkili'];

// Model adini temizle
function cleanModelName(slug) {
  // sahibinden, galeriden vs. iceren modelleri filtrele
  if (filterWords.some(w => slug.includes(w))) {
    return null;
  }

  // Motor detayli modelleri filtrele (1-6, 1-4-tsi gibi)
  if (slug.match(/^\d+-\d+/) || slug.match(/-\d+-\d+-(tsi|tdi|tfsi|dci|hdi|mpi|gdi|crdi)/)) {
    return null;
  }

  // Alt model detaylari filtrele (model-model-varyant)
  if (slug.split('-').length > 3) {
    return null;
  }

  return slug;
}

// Slug'dan display name olustur
function slugToName(slug) {
  return slug
    .split('-')
    .map(word => {
      // Ozel durumlar
      if (word === 'gt') return 'GT';
      if (word === 'tts') return 'TTS';
      if (word === 'rs') return 'RS';
      if (word === 'e') return 'e';
      if (word === 'i') return 'i';
      if (word === 'm') return 'M';
      if (word === 's') return 'S';
      if (word === 'z') return 'Z';
      if (word === 'x') return 'X';
      if (word.match(/^\d+$/)) return word;
      if (word === 'serisi') return 'Serisi';
      if (word === 'ailesi') return 'Ailesi';
      if (word === 'spider') return 'Spider';
      if (word === 'bis') return 'Bis';
      if (word === 'max') return 'Max';
      if (word === 'picasso') return 'Picasso';
      if (word === 'grand') return 'Grand';
      if (word === 'elysee') return 'Elysee';
      // Normal kelime
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Marka adini duzenle
function formatBrandName(slug) {
  const brandNames = {
    'audi': 'Audi',
    'bmw': 'BMW',
    'citroen': 'Citroen',
    'dacia': 'Dacia',
    'fiat': 'Fiat',
    'ford': 'Ford',
    'honda': 'Honda',
    'hyundai': 'Hyundai',
    'kia': 'Kia',
    'mazda': 'Mazda',
    'mercedes-benz': 'Mercedes',
    'nissan': 'Nissan',
    'opel': 'Opel',
    'peugeot': 'Peugeot',
    'renault': 'Renault',
    'seat': 'Seat',
    'skoda': 'Skoda',
    'suzuki': 'Suzuki',
    'toyota': 'Toyota',
    'volkswagen': 'Volkswagen',
    'volvo': 'Volvo',
    'chevrolet': 'Chevrolet',
    'jeep': 'Jeep',
    'land-rover': 'Land Rover',
    'mini': 'Mini',
  };
  return brandNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

// Ana islem
const rawData = JSON.parse(fs.readFileSync('/tmp/arabam-brands-models.json', 'utf8'));

const cleanedData = {};

for (const [brandSlug, models] of Object.entries(rawData)) {
  const brandName = formatBrandName(brandSlug);

  const cleanedModels = models
    .map(cleanModelName)
    .filter(m => m !== null)
    .map(slug => ({
      slug,
      name: slugToName(slug)
    }))
    // Benzersiz modeller
    .filter((model, index, self) =>
      index === self.findIndex(m => m.slug === model.slug)
    )
    // Alfabetik sirala
    .sort((a, b) => a.name.localeCompare(b.name, 'tr'));

  if (cleanedModels.length > 0) {
    cleanedData[brandName] = {
      slug: brandSlug,
      models: cleanedModels
    };
  }
}

console.log('Cleaned data:');
console.log(JSON.stringify(cleanedData, null, 2));

// TypeScript dosyasi olustur
const tsContent = `// Auto-generated from arabam.com - ${new Date().toISOString().split('T')[0]}
// Bu dosya scripts/clean-brands.js ile olusturuldu

export interface BrandData {
  slug: string;
  models: { slug: string; name: string }[];
}

export const arabamBrands: Record<string, BrandData> = ${JSON.stringify(cleanedData, null, 2)};

export function getArabamBrands(): string[] {
  return Object.keys(arabamBrands).sort((a, b) => a.localeCompare(b, 'tr'));
}

export function getArabamModels(brand: string): { slug: string; name: string }[] {
  return arabamBrands[brand]?.models || [];
}

export function getBrandSlug(brand: string): string | null {
  return arabamBrands[brand]?.slug || null;
}
`;

fs.writeFileSync('/home/dietpi/tamirhanem-next/src/data/arabam-brands.ts', tsContent);
console.log('\nSaved to src/data/arabam-brands.ts');
