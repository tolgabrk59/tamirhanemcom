const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function fetchBrands() {
  console.log('Fetching brands from arabam.com...');

  try {
    const response = await axios.get('https://www.arabam.com/ikinci-el/otomobil', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'tr-TR,tr;q=0.9',
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const brands = new Set();

    // Marka linklerini bul
    $('a[href*="/ikinci-el/otomobil/"]').each((_, el) => {
      const href = $(el).attr('href');
      // /ikinci-el/otomobil/MARKA formatinda olmali
      const match = href.match(/\/ikinci-el\/otomobil\/([a-z-]+)$/);
      if (match && !match[1].includes('-') && match[1] !== 'otomobil') {
        brands.add(match[1]);
      }
    });

    // Alternatif: Select/dropdown'dan cek
    $('select option, [data-brand]').each((_, el) => {
      const value = $(el).attr('value') || $(el).attr('data-brand');
      if (value && /^[a-z-]+$/.test(value)) {
        brands.add(value);
      }
    });

    console.log(`Found ${brands.size} brands:`, [...brands].slice(0, 20));
    return [...brands];
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}

async function fetchModels(brandSlug) {
  console.log(`Fetching models for ${brandSlug}...`);

  try {
    const response = await axios.get(`https://www.arabam.com/ikinci-el/otomobil/${brandSlug}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'tr-TR,tr;q=0.9',
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const models = new Set();

    // Model linklerini bul
    $('a[href*="/ikinci-el/otomobil/' + brandSlug + '-"]').each((_, el) => {
      const href = $(el).attr('href');
      // /ikinci-el/otomobil/MARKA-MODEL formatinda
      const match = href.match(new RegExp(`/ikinci-el/otomobil/${brandSlug}-([a-z0-9-]+?)(?:\\?|$|/)`));
      if (match) {
        // Motor/paket olmayan modelleri al (genellikle 1-2 kelime)
        const modelSlug = match[1];
        if (!modelSlug.match(/^\d+-\d+/) && modelSlug.split('-').length <= 3) {
          models.add(modelSlug);
        }
      }
    });

    console.log(`  Found ${models.size} models`);
    return [...models];
  } catch (error) {
    console.error(`Error fetching models for ${brandSlug}:`, error.message);
    return [];
  }
}

async function main() {
  // Oncelikli markalar
  const priorityBrands = [
    'audi', 'bmw', 'citroen', 'dacia', 'fiat', 'ford', 'honda',
    'hyundai', 'kia', 'mazda', 'mercedes-benz', 'nissan', 'opel',
    'peugeot', 'renault', 'seat', 'skoda', 'suzuki', 'toyota',
    'volkswagen', 'volvo', 'chevrolet', 'jeep', 'land-rover', 'mini'
  ];

  const brandModels = {};

  for (const brand of priorityBrands) {
    const models = await fetchModels(brand);
    if (models.length > 0) {
      brandModels[brand] = models;
    }
    // Rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n=== Results ===');
  console.log(JSON.stringify(brandModels, null, 2));

  // Dosyaya kaydet
  fs.writeFileSync('/tmp/arabam-brands-models.json', JSON.stringify(brandModels, null, 2));
  console.log('\nSaved to /tmp/arabam-brands-models.json');
}

main();
