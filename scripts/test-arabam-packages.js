const axios = require('axios');
const cheerio = require('cheerio');

// arabam.com'dan paket bilgilerini cek
async function getPackages(brand, model) {
  const url = `https://www.arabam.com/ikinci-el/otomobil/${brand}-${model}`;

  console.log('Fetching:', url);

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
        'Accept-Language': 'tr-TR,tr;q=0.9',
      },
      timeout: 15000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Filtre seceneklerini bul
    const packages = [];

    // "Seri" veya "Paket" filtresini ara
    $('div[class*="filter"], .left-filters, .filter-group').each((i, el) => {
      const title = $(el).find('h4, .filter-title, legend').text().toLowerCase();
      if (title.includes('seri') || title.includes('paket') || title.includes('donanım')) {
        $(el).find('label, a, li').each((j, item) => {
          const text = $(item).text().trim();
          const href = $(item).attr('href') || '';
          if (text && text.length < 50) {
            packages.push({ text, href });
          }
        });
      }
    });

    console.log('\nPaket/Seri bilgileri:');
    packages.forEach(p => console.log(`- ${p.text}`));

    // URL'deki parametreleri incele
    console.log('\n--- URL Analizi ---');
    const urlMatch = html.match(/a204=(\d+)/g);
    if (urlMatch) {
      console.log('Seri parametreleri:', [...new Set(urlMatch)].slice(0, 10));
    }

    // Daha spesifik arama - filter-box icinde
    $('[data-filter-type], [class*="series"]').each((i, el) => {
      console.log('Filter element:', $(el).attr('class'), $(el).text().substring(0, 100));
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Test - VW Golf
getPackages('volkswagen', 'golf');
