# Strapi Sorgu

Strapi CMS'den veri çekmek için hazır fetch fonksiyonu oluştur.

## Kullanım
```
/strapi-sorgu [collection-adi]
```

## Yapılacaklar

1. Kullanıcıdan Strapi collection adını al

2. Fetch fonksiyonu oluştur:

```typescript
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.tamirhanem.net';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface QueryParams {
  page?: number;
  pageSize?: number;
  filters?: Record<string, any>;
  sort?: string[];
  populate?: string | string[];
}

export async function getCollection(params: QueryParams = {}): Promise<StrapiResponse<CollectionType>> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('pagination[page]', String(params.page));
  if (params.pageSize) searchParams.set('pagination[pageSize]', String(params.pageSize));
  if (params.sort) params.sort.forEach(s => searchParams.append('sort', s));
  if (params.populate) {
    const pops = Array.isArray(params.populate) ? params.populate : [params.populate];
    pops.forEach(p => searchParams.append('populate', p));
  }

  const response = await fetch(
    `${STRAPI_URL}/api/[COLLECTION]?${searchParams}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { 'Authorization': `Bearer ${STRAPI_TOKEN}` }),
      },
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error(`Strapi error: ${response.status}`);
  }

  return response.json();
}
```

## Filtre Örnekleri

```typescript
// Eşitlik
filters: { status: 'active' }

// İçerir
filters: { title: { $contains: 'arama' } }

// Büyük/Küçük
filters: { price: { $gte: 100 } }

// İlişki
filters: { category: { slug: 'motor' } }
```

## Populate Örnekleri

```typescript
populate: '*'                    // Tüm ilişkiler
populate: ['image', 'category']  // Belirli ilişkiler
populate: 'image.formats'        // Nested
```
