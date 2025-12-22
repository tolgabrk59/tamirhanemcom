const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Rate limiting icin bekleme
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Filtre kelimeleri
const filterWords = ['sahibinden', 'galeriden', 'yetkili-bayiden', 'yetkili'];

// Motor slug'ini duzelt (1-6-tdi -> 1.6 TDI)
function formatEngineName(slug) {
  // Motor formati: 1-6-tdi, 1-4-tsi, 2-0 etc.
  const parts = slug.split('-');
  let result = [];
  let i = 0;

  // Ilk iki sayi motor hacmi
  if (parts.length >= 2 && parts[0].match(/^\d$/) && parts[1].match(/^\d$/)) {
    result.push(`${parts[0]}.${parts[1]}`);
    i = 2;
  }

  // Geri kalan motor tipi
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
          // Filtre kelimelerini atla
          if (!filterWords.some(w => variant.includes(w))) {
            // Sadece motor varyantlarini al (rakamla baslayanlar)
            if (variant.match(/^\d/)) {
              engines.add(variant);
            }
          }
        }
      }
    });

    return Array.from(engines);
  } catch (error) {
    console.error(`Error fetching engines for ${brandSlug}-${modelSlug}:`, error.message);
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
          // Filtre kelimelerini atla
          if (!filterWords.some(w => pkg.includes(w))) {
            packages.add(pkg);
          }
        }
      }
    });

    return Array.from(packages);
  } catch (error) {
    console.error(`Error fetching packages for ${engineSlug}:`, error.message);
    return [];
  }
}

// Ana fonksiyon
async function main() {
  console.log('Motor ve paket verileri cekiliyor...\n');

  // Test icin populer modeller
  const testModels = [
    { brand: 'Volkswagen', brandSlug: 'volkswagen', model: 'Golf', modelSlug: 'golf' },
    { brand: 'Volkswagen', brandSlug: 'volkswagen', model: 'Passat', modelSlug: 'passat' },
    { brand: 'Volkswagen', brandSlug: 'volkswagen', model: 'Polo', modelSlug: 'polo' },
    { brand: 'Toyota', brandSlug: 'toyota', model: 'Corolla', modelSlug: 'corolla' },
    { brand: 'Ford', brandSlug: 'ford', model: 'Focus', modelSlug: 'focus' },
    { brand: 'Renault', brandSlug: 'renault', model: 'Megane', modelSlug: 'megane' },
    { brand: 'Renault', brandSlug: 'renault', model: 'Clio', modelSlug: 'clio' },
    { brand: 'Fiat', brandSlug: 'fiat', model: 'Egea', modelSlug: 'egea' },
    { brand: 'Hyundai', brandSlug: 'hyundai', model: 'i20', modelSlug: 'i20' },
    { brand: 'Honda', brandSlug: 'honda', model: 'Civic', modelSlug: 'civic' },
    { brand: 'Opel', brandSlug: 'opel', model: 'Astra', modelSlug: 'astra' },
    { brand: 'Peugeot', brandSlug: 'peugeot', model: '308', modelSlug: '308' },
  ];

  const result = {};

  for (const model of testModels) {
    console.log(`\n=== ${model.brand} ${model.model} ===`);

    // Oncelikle motorlari cek
    const engineSlugs = await fetchEngines(model.brandSlug, model.modelSlug);
    console.log(`  Motorlar: ${engineSlugs.length} adet`);

    const engines = [];

    // Her motor icin paketleri cek (ilk 5 motor)
    const topEngines = engineSlugs.slice(0, 8); // En populer 8 motor

    for (const engineSlug of topEngines) {
      await delay(300);

      const packageSlugs = await fetchPackages(model.brandSlug, model.modelSlug, engineSlug);

      const packages = packageSlugs.map(slug => ({
        slug,
        name: formatPackageName(slug)
      }));

      engines.push({
        slug: engineSlug,
        name: formatEngineName(engineSlug),
        packages
      });

      if (packages.length > 0) {
        console.log(`    ${formatEngineName(engineSlug)}: ${packages.map(p => p.name).join(', ')}`);
      }
    }

    // Sonuclari kaydet
    const key = `${model.brand}|${model.model}`;
    result[key] = {
      brandSlug: model.brandSlug,
      modelSlug: model.modelSlug,
      engines
    };

    await delay(500);
  }

  // JSON olarak kaydet
  fs.writeFileSync('/tmp/arabam-packages.json', JSON.stringify(result, null, 2));
  console.log('\n\nSaved to /tmp/arabam-packages.json');
}

main().catch(console.error);
