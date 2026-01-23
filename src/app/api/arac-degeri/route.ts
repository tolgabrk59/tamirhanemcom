import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createLogger } from '@/lib/logger';
import type { ArabamPriceResult, ArabamPriceData } from '@/types/external-apis';

const logger = createLogger('API_ARAC_DEGERI');

export const dynamic = 'force-dynamic';

// Marka slug mapping
const brandSlugs: Record<string, string> = {
  'Audi': 'audi',
  'BMW': 'bmw',
  'Chevrolet': 'chevrolet',
  'Citroen': 'citroen',
  'Dacia': 'dacia',
  'Fiat': 'fiat',
  'Ford': 'ford',
  'Honda': 'honda',
  'Hyundai': 'hyundai',
  'Kia': 'kia',
  'Mazda': 'mazda',
  'Mercedes': 'mercedes-benz',
  'Nissan': 'nissan',
  'Opel': 'opel',
  'Peugeot': 'peugeot',
  'Renault': 'renault',
  'Seat': 'seat',
  'Skoda': 'skoda',
  'Suzuki': 'suzuki',
  'Toyota': 'toyota',
  'Volkswagen': 'volkswagen',
  'Volvo': 'volvo',
};

// Model slug mapping
const modelSlugs: Record<string, Record<string, string>> = {
  'BMW': {
    '1 Serisi': '1-serisi',
    '2 Serisi': '2-serisi',
    '3 Serisi': '3-serisi',
    '4 Serisi': '4-serisi',
    '5 Serisi': '5-serisi',
  },
  'Mercedes': {
    'A Serisi': 'a-serisi',
    'B Serisi': 'b-serisi',
    'C Serisi': 'c-serisi',
    'E Serisi': 'e-serisi',
    'S Serisi': 's-serisi',
  },
};

function getModelSlug(brand: string, model: string): string {
  if (modelSlugs[brand]?.[model]) {
    return modelSlugs[brand][model];
  }
  return model
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Dogrudan slug ile cagri
async function fetchPricesFromArabamDirect(
  brandSlug: string,
  modelSlug: string,
  year: number,
  engineSlug?: string,
  packageSlug?: string
): Promise<ArabamPriceResult> {
  // Yil araligi
  const minYear = year - 1;
  const maxYear = year + 1;

  // URL path olustur
  let urlPath = `${brandSlug}-${modelSlug}`;
  if (engineSlug) {
    urlPath += `-${engineSlug}`;
  }
  if (packageSlug) {
    urlPath += `-${packageSlug}`;
  }

  const url = `https://www.arabam.com/ikinci-el/otomobil/${urlPath}?minYear=${minYear}&maxYear=${maxYear}`;

  logger.info({ url }, 'Fetching prices from arabam.com');

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      timeout: 15000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const prices: number[] = [];

    // Yontem 1: Klasik tablo yapisi
    $('tr[class*="listing"]').each((_, el) => {
      const priceText = $(el).find('[class*="price"]').text();
      const price = parseInt(priceText.replace(/[^\d]/g, ''));
      if (price > 100000 && price < 50000000) {
        prices.push(price);
      }
    });

    // Yontem 2: Grid/card yapisi
    if (prices.length === 0) {
      $('.listing-facade-grid .listing-content-container, .listing-card, [class*="listing-item"]').each((_, el) => {
        const priceText = $(el).find('[class*="price"], .listing-price').text();
        const price = parseInt(priceText.replace(/[^\d]/g, ''));
        if (price > 100000 && price < 50000000) {
          prices.push(price);
        }
      });
    }

    // Yontem 3: Tum fiyat elementleri
    if (prices.length === 0) {
      $('[class*="price"], [class*="fiyat"]').each((_, el) => {
        const text = $(el).text().trim();
        const price = parseInt(text.replace(/[^\d]/g, ''));
        if (price > 100000 && price < 50000000) {
          prices.push(price);
        }
      });
    }

    // Yontem 4: Regex ile HTML'den cek
    if (prices.length === 0) {
      const priceRegex = /(\d{1,3}(?:\.\d{3})+)\s*(?:TL|₺)/g;
      let match;
      while ((match = priceRegex.exec(html)) !== null) {
        const price = parseInt(match[1].replace(/\./g, ''));
        if (price > 100000 && price < 50000000) {
          prices.push(price);
        }
      }
    }

    if (prices.length < 3) {
      // Motor/paket ile az sonuc varsa, onsuz tekrar dene
      if (engineSlug || packageSlug) {
        logger.info({ engineSlug, packageSlug }, 'Yeterli ilan yok, daha genel arama yapiliyor');
        if (packageSlug) {
          // Paket olmadan dene
          return fetchPricesFromArabamDirect(brandSlug, modelSlug, year, engineSlug);
        } else if (engineSlug) {
          // Motor olmadan dene
          return fetchPricesFromArabamDirect(brandSlug, modelSlug, year);
        }
      }
      return {
        success: false,
        error: 'Bu arac icin yeterli ilan bulunamadi (en az 3 ilan gerekli)',
      };
    }

    // Benzersiz fiyatlari al
    const uniquePrices = [...new Set(prices)];

    // Outlier'lari cikar (IQR yontemi)
    const sorted = uniquePrices.sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    const filtered = sorted.filter((p) => p >= lowerBound && p <= upperBound);

    if (filtered.length === 0) {
      return {
        success: false,
        error: 'Fiyat verisi islenemedi',
      };
    }

    const minPrice = Math.min(...filtered);
    const maxPrice = Math.max(...filtered);
    const avgPrice = Math.round(
      filtered.reduce((a, b) => a + b, 0) / filtered.length
    );
    const medianPrice = filtered[Math.floor(filtered.length / 2)];

    // Fiyat araligi (ortalama +- %10)
    const priceRange = {
      low: Math.round(avgPrice * 0.9),
      high: Math.round(avgPrice * 1.1),
    };

    return {
      success: true,
      data: {
        count: filtered.length,
        minPrice,
        maxPrice,
        avgPrice,
        medianPrice,
        priceRange,
        source: 'arabam.com',
        fetchedAt: new Date().toISOString(),
        searchUrl: url,
      },
    };
  } catch (error) {
    logger.error({ error }, 'Scraping error');
    return {
      success: false,
      error: 'Fiyat bilgisi alinamadi',
    };
  }
}

// Eski fonksiyon (geriye uyumluluk)
async function fetchPricesFromArabam(
  brand: string,
  model: string,
  year: number,
  engine?: string,
  packageType?: string
): Promise<ArabamPriceResult> {
  const brandSlugVal = brandSlugs[brand] || brand.toLowerCase();
  const modelSlugVal = getModelSlug(brand, model);

  // URL olustur
  let urlPath = `${brandSlugVal}-${modelSlugVal}`;

  // Motor eklenmisse
  if (engine) {
    urlPath += `-${engine}`;
  }

  // Paket eklenmisse
  if (packageType) {
    urlPath += `-${packageType}`;
  }

  // Yil araligi
  const minYear = year - 1;
  const maxYear = year + 1;

  const url = `https://www.arabam.com/ikinci-el/otomobil/${urlPath}?minYear=${minYear}&maxYear=${maxYear}`;

  logger.info({ url }, 'Fetching prices from arabam.com (legacy)');

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      timeout: 15000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const prices: number[] = [];

    // Yontem 1: Klasik tablo yapisi
    $('tr[class*="listing"]').each((_, el) => {
      const priceText = $(el).find('[class*="price"]').text();
      const price = parseInt(priceText.replace(/[^\d]/g, ''));
      if (price > 100000 && price < 50000000) {
        prices.push(price);
      }
    });

    // Yontem 2: Grid/card yapisi (listing-facade-grid)
    if (prices.length === 0) {
      $('.listing-facade-grid .listing-content-container, .listing-card, [class*="listing-item"]').each((_, el) => {
        const priceText = $(el).find('[class*="price"], .listing-price').text();
        const price = parseInt(priceText.replace(/[^\d]/g, ''));
        if (price > 100000 && price < 50000000) {
          prices.push(price);
        }
      });
    }

    // Yontem 3: Tum fiyat elementleri
    if (prices.length === 0) {
      $('[class*="price"], [class*="fiyat"]').each((_, el) => {
        const text = $(el).text().trim();
        const price = parseInt(text.replace(/[^\d]/g, ''));
        if (price > 100000 && price < 50000000) {
          prices.push(price);
        }
      });
    }

    // Yontem 4: Regex ile HTML'den cek
    if (prices.length === 0) {
      const priceRegex = /(\d{1,3}(?:\.\d{3})+)\s*(?:TL|₺)/g;
      let match;
      while ((match = priceRegex.exec(html)) !== null) {
        const price = parseInt(match[1].replace(/\./g, ''));
        if (price > 100000 && price < 50000000) {
          prices.push(price);
        }
      }
    }

    if (prices.length < 3) {
      // Cok az ilan varsa, motor/paket olmadan tekrar dene
      if (engine || packageType) {
        logger.info({ engine, packageType }, 'Yeterli ilan yok, genel arama yapiliyor');
        return fetchPricesFromArabam(brand, model, year);
      }
      return {
        success: false,
        error: 'Bu arac icin yeterli ilan bulunamadi (en az 3 ilan gerekli)',
      };
    }

    // Benzersiz fiyatlari al
    const uniquePrices = [...new Set(prices)];

    // Outlier'lari cikar (IQR yontemi)
    const sorted = uniquePrices.sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    const filtered = sorted.filter((p) => p >= lowerBound && p <= upperBound);

    if (filtered.length === 0) {
      return {
        success: false,
        error: 'Fiyat verisi islenemedi',
      };
    }

    const minPrice = Math.min(...filtered);
    const maxPrice = Math.max(...filtered);
    const avgPrice = Math.round(
      filtered.reduce((a, b) => a + b, 0) / filtered.length
    );
    const medianPrice = filtered[Math.floor(filtered.length / 2)];

    // Fiyat araligi (ortalama +- %10)
    const priceRange = {
      low: Math.round(avgPrice * 0.9),
      high: Math.round(avgPrice * 1.1),
    };

    return {
      success: true,
      data: {
        count: filtered.length,
        minPrice,
        maxPrice,
        avgPrice,
        medianPrice,
        priceRange,
        source: 'arabam.com',
        fetchedAt: new Date().toISOString(),
        searchUrl: url,
      },
    };
  } catch (error) {
    logger.error({ error }, 'Scraping error');

    // Motor/paket ile hata aldiysa, onsuz dene
    if (engine || packageType) {
      logger.info({ engine, packageType }, 'Hata alindi, genel arama yapiliyor');
      return fetchPricesFromArabam(brand, model, year);
    }

    return {
      success: false,
      error: 'Fiyat bilgisi alinamadi',
    };
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Yeni slug bazli parametreler
  const brandSlug = searchParams.get('brandSlug');
  const modelSlug = searchParams.get('modelSlug');

  // Motor ve paket parametreleri
  const engineSlug = searchParams.get('engine') || undefined;
  const packageSlug = searchParams.get('package') || undefined;

  // Eski parametreler (geriye uyumluluk)
  const brand = searchParams.get('brand');
  const model = searchParams.get('model');

  const yearStr = searchParams.get('year');

  // Slug veya isim bazli kontrol
  const finalBrandSlug = brandSlug || (brand ? (brandSlugs[brand] || brand.toLowerCase()) : null);
  const finalModelSlug = modelSlug || (model ? model.toLowerCase().replace(/\s+/g, '-') : null);

  if (!finalBrandSlug || !finalModelSlug || !yearStr) {
    return NextResponse.json(
      { success: false, error: 'Marka, model ve yil parametreleri gerekli' },
      { status: 400 }
    );
  }

  const year = parseInt(yearStr);
  if (isNaN(year) || year < 1990 || year > new Date().getFullYear() + 1) {
    return NextResponse.json(
      { success: false, error: 'Gecersiz yil degeri' },
      { status: 400 }
    );
  }

  const result = await fetchPricesFromArabamDirect(finalBrandSlug, finalModelSlug, year, engineSlug, packageSlug);

  return NextResponse.json(result);
}
