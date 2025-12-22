const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeFilters(brand, model) {
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

    // Seri/paket iceren linkleri bul
    const seriesLinks = html.match(/href="[^"]*golf[^"]*"/gi) || [];
    console.log('\nGolf ile ilgili linkler (ilk 20):');
    const uniqueLinks = [...new Set(seriesLinks)].slice(0, 20);
    uniqueLinks.forEach(l => console.log(l));

    // Alt modelleri bul (Golf 8, Golf 7, Golf GTI, etc.)
    const subModels = html.match(/(golf[^"<>\s]{0,30})/gi) || [];
    const uniqueSubModels = [...new Set(subModels)];
    console.log('\nAlt modeller:');
    uniqueSubModels.forEach(m => console.log(`- ${m}`));

    // Filter parametrelerini bul
    const filterParams = html.match(/a\d+=[^&"]+/g) || [];
    const uniqueParams = [...new Set(filterParams)].slice(0, 30);
    console.log('\nFilter parametreleri:');
    uniqueParams.forEach(p => console.log(`- ${p}`));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

analyzeFilters('volkswagen', 'golf');
