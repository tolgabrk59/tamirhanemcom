const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeArabam(brand, model, minYear, maxYear) {
  const url = `https://www.arabam.com/ikinci-el/otomobil/${brand}-${model}?minYear=${minYear}&maxYear=${maxYear}`;

  console.log('Fetching:', url);

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      },
      timeout: 15000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Debug: HTML'in bir kısmını göster
    console.log('\nHTML uzunluğu:', html.length);

    // Fiyatları çek - farklı selector'lar dene
    const prices = [];

    // Yöntem 1: tr-list-listing içinden
    $('tr[class*="listing"]').each((i, el) => {
      const priceText = $(el).find('[class*="price"]').text();
      const price = parseInt(priceText.replace(/[^\d]/g, ''));
      if (price > 0) {
        prices.push(price);
        console.log(`Bulundu (tr): ${price.toLocaleString('tr-TR')} TL`);
      }
    });

    // Yöntem 2: Genel fiyat arama
    if (prices.length === 0) {
      $('[class*="price"], [class*="fiyat"]').each((i, el) => {
        const text = $(el).text().trim();
        const price = parseInt(text.replace(/[^\d]/g, ''));
        if (price > 100000 && price < 50000000) { // Mantıklı araç fiyat aralığı
          prices.push(price);
        }
      });
      console.log(`Yöntem 2 ile ${prices.length} fiyat bulundu`);
    }

    // Yöntem 3: Tüm TL içeren metinleri ara
    if (prices.length === 0) {
      const priceRegex = /(\d{1,3}(?:\.\d{3})*)\s*TL/g;
      let match;
      while ((match = priceRegex.exec(html)) !== null) {
        const price = parseInt(match[1].replace(/\./g, ''));
        if (price > 100000 && price < 50000000) {
          prices.push(price);
        }
      }
      console.log(`Regex ile ${prices.length} fiyat bulundu`);
    }

    if (prices.length > 0) {
      // Benzersiz fiyatları al
      const uniquePrices = [...new Set(prices)];

      // Outlier'ları çıkar (IQR yöntemi)
      const sorted = uniquePrices.sort((a, b) => a - b);
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;

      const filtered = sorted.filter(p => p >= lowerBound && p <= upperBound);

      console.log('\n--- Sonuçlar ---');
      console.log(`Toplam ilan: ${uniquePrices.length}`);
      console.log(`Filtrelenmiş: ${filtered.length}`);
      console.log(`Min: ${Math.min(...filtered).toLocaleString('tr-TR')} TL`);
      console.log(`Max: ${Math.max(...filtered).toLocaleString('tr-TR')} TL`);
      console.log(`Ortalama: ${Math.round(filtered.reduce((a, b) => a + b, 0) / filtered.length).toLocaleString('tr-TR')} TL`);
      console.log(`Medyan: ${sorted[Math.floor(sorted.length / 2)].toLocaleString('tr-TR')} TL`);

      return {
        count: filtered.length,
        min: Math.min(...filtered),
        max: Math.max(...filtered),
        avg: Math.round(filtered.reduce((a, b) => a + b, 0) / filtered.length),
        median: sorted[Math.floor(sorted.length / 2)]
      };
    } else {
      console.log('Fiyat bulunamadı');

      // Sayfadaki bazı içeriği göster
      console.log('\nSayfa başlığı:', $('title').text());
      console.log('H1:', $('h1').first().text());
    }

  } catch (error) {
    console.error('Hata:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
    }
  }
}

// Test
scrapeArabam('volkswagen', 'golf', 2020, 2022);
