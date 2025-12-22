const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeSahibinden(brand, model, minYear, maxYear) {
  // sahibinden.com URL yapisi
  const url = `https://www.sahibinden.com/otomobil-${brand}-${model}?pagingOffset=0&pagingSize=50&a5_min=${minYear}&a5_max=${maxYear}`;

  console.log('Fetching:', url);

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
      },
      timeout: 15000
    });

    console.log('Status:', response.status);
    console.log('HTML length:', response.data.length);

    const $ = cheerio.load(response.data);

    // Sayfa title
    console.log('Title:', $('title').text());

    // Fiyatlari ara
    const prices = [];

    // Cesitli selector'lar dene
    $('[class*="price"], .searchResultsPriceValue, td.searchResultsPriceValue').each((i, el) => {
      const text = $(el).text().trim();
      const price = parseInt(text.replace(/[^\d]/g, ''));
      if (price > 100000 && price < 50000000) {
        prices.push(price);
        if (prices.length <= 5) console.log(`Found: ${price.toLocaleString('tr-TR')} TL`);
      }
    });

    console.log(`\nToplam ${prices.length} fiyat bulundu`);

    if (prices.length > 0) {
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
      console.log(`Ortalama: ${Math.round(avg).toLocaleString('tr-TR')} TL`);
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

scrapeSahibinden('volkswagen', 'golf', 2020, 2022);
