const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Rate limiting icin bekleme
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Filtre kelimeleri
const filterWords = ['sahibinden', 'galeriden', 'yetkili-bayiden', 'yetkili'];

// Motor slug'ini duzelt (1-6-tdi -> 1.6 TDI)
function formatEngineName(slug) {
  const parts = slug.split('-');
  let result = [];
  let i = 0;

  if (parts.length >= 2 && parts[0].match(/^\d$/) && parts[1].match(/^\d$/)) {
    result.push(`${parts[0]}.${parts[1]}`);
    i = 2;
  }

  for (; i < parts.length; i++) {
    const word = parts[i].toUpperCase();
    result.push(word);
  }

  return result.join(' ');
}

// Paket slug'ini duzelt
function formatPackageName(slug) {
  const specialNames = {
    'bluemotion': 'BlueMotion',
    'comfortline': 'Comfortline',
    'highline': 'Highline',
    'trendline': 'Trendline',
    'midline': 'Midline',
    'midline-plus': 'Midline Plus',
    'allstar': 'Allstar',
    'edition': 'Edition',
    'style': 'Style',
    'elegance': 'Elegance',
    'r-line': 'R-Line',
    'sportline': 'Sportline',
    'ambition': 'Ambition',
    'ambiente': 'Ambiente',
    'attraction': 'Attraction',
    'titanium': 'Titanium',
    'trend': 'Trend',
    'ghia': 'Ghia',
    'lounge': 'Lounge',
    'urban': 'Urban',
    'mirror': 'Mirror',
    'cross': 'Cross',
    'easy': 'Easy',
    'popstar': 'Popstar',
    'hatchback': 'Hatchback',
    'sedan': 'Sedan',
    'sport': 'Sport',
    'joy': 'Joy',
    'joy-plus': 'Joy Plus',
    'touch': 'Touch',
    'icon': 'Icon',
  };

  if (specialNames[slug]) {
    return specialNames[slug];
  }

  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Model sayfasindan motor listesini cek
async function fetchEngines(brandSlug, modelSlug) {
  const url = `https://www.arabam.com/ikinci-el/otomobil/${brandSlug}-${modelSlug}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const engines = new Set();
    const basePrefix = `${brandSlug}-${modelSlug}-`;

    $('a[href*="/ikinci-el/otomobil/"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.includes(basePrefix)) {
        const match = href.match(new RegExp(`/ikinci-el/otomobil/${basePrefix}([^/?]+)`));
        if (match && match[1]) {
          const variant = match[1];
          if (!filterWords.some(w => variant.includes(w))) {
            if (variant.match(/^\d/)) {
              engines.add(variant);
            }
          }
        }
      }
    });

    return Array.from(engines);
  } catch (error) {
    return [];
  }
}

// Motor sayfasindan paket listesini cek
async function fetchPackages(brandSlug, modelSlug, engineSlug) {
  const url = `https://www.arabam.com/ikinci-el/otomobil/${brandSlug}-${modelSlug}-${engineSlug}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const packages = new Set();
    const basePrefix = `${brandSlug}-${modelSlug}-${engineSlug}-`;

    $('a[href*="/ikinci-el/otomobil/"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.includes(basePrefix)) {
        const match = href.match(new RegExp(`/ikinci-el/otomobil/${basePrefix}([^/?]+)`));
        if (match && match[1]) {
          const pkg = match[1];
          if (!filterWords.some(w => pkg.includes(w))) {
            packages.add(pkg);
          }
        }
      }
    });

    return Array.from(packages);
  } catch (error) {
    return [];
  }
}

// arabam-brands.ts dosyasini oku ve parse et
function loadBrandsData() {
  const content = fs.readFileSync('/home/dietpi/tamirhanem-next/src/data/arabam-brands.ts', 'utf8');

  // TypeScript'ten JSON cikart
  const match = content.match(/export const arabamBrands[^=]*=\s*(\{[\s\S]*\});/);
  if (!match) {
    throw new Error('Could not parse arabam-brands.ts');
  }

  // JSON olarak parse et
  const jsonStr = match[1]
    .replace(/\/\/[^\n]*/g, '') // Yorumlari kaldir
    .replace(/,(\s*[}\]])/g, '$1'); // Trailing comma kaldir

  return JSON.parse(jsonStr);
}

// Ana fonksiyon
async function main() {
  console.log('Tum modeller icin motor ve paket verileri cekiliyor...\n');
  console.log('Bu islem uzun surebilir (400+ model).\n');

  const brandsData = loadBrandsData();
  const result = {};

  let totalModels = 0;
  let processedModels = 0;
  let modelsWithEngines = 0;

  // Toplam model sayisini hesapla
  for (const [brandName, brandData] of Object.entries(brandsData)) {
    totalModels += brandData.models.length;
  }

  console.log(`Toplam ${totalModels} model islenecek.\n`);

  for (const [brandName, brandData] of Object.entries(brandsData)) {
    const brandSlug = brandData.slug;

    for (const model of brandData.models) {
      processedModels++;
      const modelSlug = model.slug;
      const modelName = model.name;

      process.stdout.write(`[${processedModels}/${totalModels}] ${brandName} ${modelName}... `);

      // Motorlari cek
      const engineSlugs = await fetchEngines(brandSlug, modelSlug);

      if (engineSlugs.length === 0) {
        console.log('motor yok');
        await delay(200);
        continue;
      }

      const engines = [];
      const topEngines = engineSlugs.slice(0, 5); // Ilk 5 motor

      for (const engineSlug of topEngines) {
        await delay(150);
        const packageSlugs = await fetchPackages(brandSlug, modelSlug, engineSlug);

        const packages = packageSlugs.map(slug => ({
          slug,
          name: formatPackageName(slug)
        }));

        engines.push({
          slug: engineSlug,
          name: formatEngineName(engineSlug),
          packages
        });
      }

      if (engines.length > 0) {
        const key = `${brandName}|${modelName}`;
        result[key] = {
          brandSlug,
          modelSlug,
          engines
        };
        modelsWithEngines++;
        console.log(`${engines.length} motor`);
      } else {
        console.log('motor yok');
      }

      // Her 10 modelde bir kaydet (crash durumunda kayip olmasin)
      if (processedModels % 10 === 0) {
        fs.writeFileSync('/tmp/arabam-all-packages.json', JSON.stringify(result, null, 2));
      }

      await delay(300);
    }
  }

  // Son kayit
  fs.writeFileSync('/tmp/arabam-all-packages.json', JSON.stringify(result, null, 2));

  console.log(`\n\nTamamlandi!`);
  console.log(`Toplam: ${totalModels} model`);
  console.log(`Motor verisi olan: ${modelsWithEngines} model`);
  console.log(`Kaydedildi: /tmp/arabam-all-packages.json`);

  // TypeScript dosyasini olustur
  generateTypeScript(result);
}

function generateTypeScript(data) {
  const tsContent = `// Auto-generated from arabam.com - ${new Date().toISOString().split('T')[0]}
// Bu dosya scripts/fetch-all-packages.js ile olusturuldu

export interface PackageOption {
  slug: string;
  name: string;
}

export interface EngineOption {
  slug: string;
  name: string;
  packages: PackageOption[];
}

export interface ModelPackageData {
  brandSlug: string;
  modelSlug: string;
  engines: EngineOption[];
}

export const arabamPackages: Record<string, ModelPackageData> = ${JSON.stringify(data, null, 2)};

export function getModelEngines(brand: string, model: string): EngineOption[] {
  const key = \`\${brand}|\${model}\`;
  return arabamPackages[key]?.engines || [];
}

export function getEnginePackages(brand: string, model: string, engineSlug: string): PackageOption[] {
  const engines = getModelEngines(brand, model);
  const engine = engines.find(e => e.slug === engineSlug);
  return engine?.packages || [];
}

export function hasPackageData(brand: string, model: string): boolean {
  const key = \`\${brand}|\${model}\`;
  return !!arabamPackages[key];
}
`;

  fs.writeFileSync('/home/dietpi/tamirhanem-next/src/data/arabam-packages.ts', tsContent);
  console.log('TypeScript dosyasi guncellendi: src/data/arabam-packages.ts');
}

main().catch(console.error);
