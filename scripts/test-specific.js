const axios = require('axios');
const cheerio = require('cheerio');

async function test(urlPath) {
  const url = `https://www.arabam.com/ikinci-el/otomobil/${urlPath}?minYear=2020&maxYear=2022`;
  console.log('Testing:', url);

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'tr-TR,tr;q=0.9',
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const prices = [];

    $('tr[class*="listing"]').each((_, el) => {
      const priceText = $(el).find('[class*="price"]').text();
      const price = parseInt(priceText.replace(/[^\d]/g, ''));
      if (price > 100000 && price < 50000000) {
        prices.push(price);
      }
    });

    console.log(`Found ${prices.length} listings`);
    if (prices.length > 0) {
      console.log(`Price range: ${Math.min(...prices).toLocaleString()} - ${Math.max(...prices).toLocaleString()} TL`);
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

// Test different combinations
async function runTests() {
  await test('volkswagen-golf');
  console.log('---');
  await test('volkswagen-golf-1-6-tdi');
  console.log('---');
  await test('volkswagen-golf-1-6-tdi-highline');
  console.log('---');
  await test('volkswagen-golf-1-4-tsi-comfortline');
}

runTests();
