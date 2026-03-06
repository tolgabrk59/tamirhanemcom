/**
 * OpenAPI 3.1 Specification for TamirHanem API
 *
 * This specification documents all public API endpoints.
 * Auto-generated from the codebase.
 */

export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'TamirHanem API',
    description: `
TamirHanem - Turkish Automotive Service Platform API.

## Özellikler

- **AI Destekli Arıza Tespiti**: OpenAI ve Gemini entegrasyonu ile otomatik tanı sistemi
- **OBD Kod Sorgulama**: 10,000+ OBD-II kod veritabanı
- **Araç Karşılaştırma**: Modeller arası karşılaştırma ve analiz
- **Randevu Sistemi**: Online servis randevusu
- **Fiyat Hesaplama**: Parça ve işçilik maliyeti hesaplama
- **Geri Çağırma (Recall)**: TSE ve üretici geri çağırma bilgileri

## Authentication

API çoğu endpoint için authentication gerektirmez.
Admin endpoint'leri için API key gereklidir.

## Rate Limiting

- **AI Endpoints**: 10 istek/saat
- **Chat**: 20 istek/saat
- **Standard API**: 60 istek/dakika
- **Forms**: 10 istek/saat

Rate limit header'ları:
\`\`\`
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 2024-01-01T12:00:00Z
Retry-After: 3600
\`\`\`
    `,
    version: '1.0.0',
    contact: {
      name: 'TamirHanem API Support',
      email: 'api@tamirhanem.net',
      url: 'https://tamirhanem.net',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'https://tamirhanem.net/api',
      description: 'Production Server',
    },
    {
      url: 'https://staging.tamirhanem.net/api',
      description: 'Staging Server',
    },
    {
      url: 'http://localhost:3000/api',
      description: 'Development Server',
    },
  ],
  tags: [
    { name: 'AI', description: 'AI destekli arıza tespiti ve sohbet' },
    { name: 'OBD', description: 'OBD kod sorgulama ve teşhis' },
    { name: 'Vehicles', description: 'Araç marka ve model bilgileri' },
    { name: 'Services', description: 'Servis ve iş yeri bilgileri' },
    { name: 'Appointments', description: 'Randevu yönetimi' },
    { name: 'Recalls', description: 'Araç geri çağırma bilgileri' },
    { name: 'Pricing', description: 'Fiyatlandırma ve maliyet hesaplama' },
    { name: 'Health', description: 'Sistem sağlık kontrolleri' },
    { name: 'Admin', description: 'Yönetici paneli endpointleri' },
  ],
  paths: {
    // Health Check
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'API sağlık durumu',
        description: 'API ve bağlı servislerin durumunu kontrol eder',
        operationId: 'getHealth',
        responses: {
          '200': {
            description: 'API çalışıyor',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse',
                },
              },
            },
          },
        },
      },
    },

    // AI Diagnostics
    '/api/ai/diagnose': {
      post: {
        tags: ['AI'],
        summary: 'AI ile arıza tespiti',
        description: `
Araç belirtilerine göre AI destekli arıza analizi yapar.

**Rate Limit**: 10 istek/saat
        `,
        operationId: 'aiDiagnose',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AIDiagnoseRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Başarılı analiz',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AIDiagnoseResponse',
                },
              },
            },
          },
          '400': {
            description: 'Geçersiz istek',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '429': {
            description: 'Rate limit aşıldı',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    // OBD Code Lookup
    '/api/obd/code/{code}': {
      get: {
        tags: ['OBD'],
        summary: 'OBD kodu sorgula',
        description: `
OBD-II hata kodunun detaylı açıklamasını döndürür.

**Rate Limit**: 60 istek/dakika
        `,
        operationId: 'getObdCode',
        parameters: [
          {
            name: 'code',
            in: 'path',
            required: true,
            description: 'OBD kodu (örn: P0300, P0420)',
            schema: {
              type: 'string',
              pattern: '^[P|C|B|U][0-9A-F]{4}$',
            },
            example: 'P0300',
          },
        ],
        responses: {
          '200': {
            description: 'OBD kodu bulundu',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OBDCodeResponse',
                },
              },
            },
          },
          '404': {
            description: 'OBD kodu bulunamadı',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    // Vehicle Brands
    '/api/brands': {
      get: {
        tags: ['Vehicles'],
        summary: 'Tüm markaları listele',
        description: 'Sistemdeki tüm araç markalarını döndürür',
        operationId: 'getBrands',
        parameters: [
          {
            name: 'country',
            in: 'query',
            description: 'Ülke filtresi (TR, DE, US vb.)',
            schema: {
              type: 'string',
            },
            example: 'TR',
          },
        ],
        responses: {
          '200': {
            description: 'Marka listesi',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BrandsResponse',
                },
              },
            },
          },
        },
      },
    },

    // Vehicle Models
    '/api/models/{brand}': {
      get: {
        tags: ['Vehicles'],
        summary: 'Marka modellerini listele',
        description: 'Belirli bir markanın modellerini döndürür',
        operationId: 'getModels',
        parameters: [
          {
            name: 'brand',
            in: 'path',
            required: true,
            description: 'Marka adı veya slug',
            schema: {
              type: 'string',
            },
            example: 'renault',
          },
          {
            name: 'year',
            in: 'query',
            description: 'Yıl filtresi',
            schema: {
              type: 'integer',
              minimum: 1990,
              maximum: new Date().getFullYear() + 1,
            },
            example: 2020,
          },
        ],
        responses: {
          '200': {
            description: 'Model listesi',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ModelsResponse',
                },
              },
            },
          },
        },
      },
    },

    // Services
    '/api/services': {
      get: {
        tags: ['Services'],
        summary: 'Servisleri listele',
        description: `
Konuma göre servis ve iş yerlerini listeler.

**Rate Limit**: 60 istek/dakika
        `,
        operationId: 'getServices',
        parameters: [
          {
            name: 'city',
            in: 'query',
            description: 'Şehir filtresi',
            schema: {
              type: 'string',
            },
            example: 'İstanbul',
          },
          {
            name: 'category',
            in: 'query',
            description: 'Hizmet kategorisi (motor, kaporta, elektrik vb.)',
            schema: {
              type: 'string',
              enum: ['motor', 'kaporta', 'elektrik', 'fren', 'suspansiyon', 'klima', 'lastik', 'yag'],
            },
            example: 'motor',
          },
          {
            name: 'lat',
            in: 'query',
            description: 'Enlem (konum bazlı arama)',
            schema: {
              type: 'number',
              minimum: -90,
              maximum: 90,
            },
            example: 41.0082,
          },
          {
            name: 'lon',
            in: 'query',
            description: 'Boylam (konum bazlı arama)',
            schema: {
              type: 'number',
              minimum: -180,
              maximum: 180,
            },
            example: 28.9784,
          },
          {
            name: 'radius',
            in: 'query',
            description: 'Arama yarıçapı (km)',
            schema: {
              type: 'number',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            example: 10,
          },
        ],
        responses: {
          '200': {
            description: 'Servis listesi',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ServicesResponse',
                },
              },
            },
          },
        },
      },
    },

    // Appointment Request
    '/api/randevu-talebi': {
      post: {
        tags: ['Appointments'],
        summary: 'Randevu talebi oluştur',
        description: `
Yeni servis randevu talebi oluşturur.

**Rate Limit**: 10 istek/saat
        `,
        operationId: 'createAppointment',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AppointmentRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Randevu talebi oluşturuldu',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AppointmentResponse',
                },
              },
            },
          },
          '400': {
            description: 'Geçersiz istek',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '422': {
            description: 'Doğrulama hatası',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    // Recalls
    '/api/recalls': {
      get: {
        tags: ['Recalls'],
        summary: 'Geri çağırma bilgileri',
        description: `
Araç için geri çağırma (recall) bilgilerini döndürür.
TSE ve üretici kaynaklarından veri sağlar.

**Rate Limit**: 60 istek/dakika
        `,
        operationId: 'getRecalls',
        parameters: [
          {
            name: 'brand',
            in: 'query',
            required: true,
            description: 'Marka',
            schema: {
              type: 'string',
            },
            example: 'renault',
          },
          {
            name: 'model',
            in: 'query',
            required: true,
            description: 'Model',
            schema: {
              type: 'string',
            },
            example: 'megane',
          },
          {
            name: 'year',
            in: 'query',
            required: true,
            description: 'Yıl',
            schema: {
              type: 'integer',
            },
            example: 2020,
          },
        ],
        responses: {
          '200': {
            description: 'Geri çağırma listesi',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RecallsResponse',
                },
              },
            },
          },
        },
      },
    },

    // Pricing Estimate
    '/api/arac-degeri/estimate': {
      post: {
        tags: ['Pricing'],
        summary: 'Onarım maliyeti tahmini',
        description: `
Parça ve işçilik maliyetleri dahil onarım fiyat tahmini.

**Rate Limit**: 20 istek/saat
        `,
        operationId: 'estimatePrice',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PriceEstimateRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Fiyat tahmini',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PriceEstimateResponse',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'Admin endpointleri için API key',
      },
    },
    schemas: {
      // Health Response
      HealthResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                enum: ['healthy', 'degraded', 'unhealthy'],
                example: 'healthy',
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T12:00:00Z',
              },
              version: {
                type: 'string',
                example: '1.0.0',
              },
              services: {
                type: 'object',
                properties: {
                  database: {
                    type: 'string',
                    example: 'connected',
                  },
                  redis: {
                    type: 'string',
                    example: 'connected',
                  },
                  ai: {
                    type: 'string',
                    example: 'available',
                  },
                },
              },
            },
          },
        },
      },

      // AI Diagnose
      AIDiagnoseRequest: {
        type: 'object',
        required: ['brand', 'model', 'year', 'symptoms'],
        properties: {
          brand: {
            type: 'string',
            description: 'Araç markası',
            example: 'Renault',
          },
          model: {
            type: 'string',
            description: 'Araç modeli',
            example: 'Megane',
          },
          year: {
            type: 'integer',
            description: 'Model yılı',
            minimum: 1990,
            maximum: new Date().getFullYear() + 1,
            example: 2020,
          },
          symptoms: {
            type: 'string',
            description: 'Arıza belirtileri',
            example: 'Motor rölanti yaparken titriyor ve bazen stop ediyor.',
          },
          additionalInfo: {
            type: 'string',
            description: 'Ek bilgiler (opsiyonel)',
            example: 'Check engine lambası yanıyor.',
          },
        },
      },
      AIDiagnoseResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
            properties: {
              diagnosis: {
                type: 'string',
                description: 'Tanı sonucu',
                example: 'Rölanti sensörü arızası olabilir. Sensör temizliği veya değişimi gerekebilir.',
              },
              possibleCauses: {
                type: 'array',
                items: {
                  type: 'string',
                },
                example: [
                  'Rölanti kontrol valfi (Idle Control Valve) arızası',
                  'Maske hava sensörü (MAF) kirlenmesi',
                  'Buji kabloları hasarı',
                ],
              },
              recommendedActions: {
                type: 'array',
                items: {
                  type: 'string',
                },
                example: [
                  'Önce rölanti sensörünü temizletin',
                  'Sorun devam ederse servise başvurun',
                ],
              },
              estimatedCost: {
                type: 'object',
                properties: {
                  min: {
                    type: 'number',
                    description: 'Minimum tahmini maliyet (TL)',
                    example: 1500,
                  },
                  max: {
                    type: 'number',
                    description: 'Maksimum tahmini maliyet (TL)',
                    example: 4500,
                  },
                  currency: {
                    type: 'string',
                    example: 'TRY',
                  },
                },
              },
              urgency: {
                type: 'string',
                enum: ['düşük', 'orta', 'yüksek', 'kritik'],
                example: 'orta',
              },
            },
          },
        },
      },

      // OBD Code
      OBDCodeResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                example: 'P0300',
              },
              description: {
                type: 'string',
                example: 'Random/Multiple Cylinder Misfire Detected',
              },
              descriptionTR: {
                type: 'string',
                example: 'Rastgele/Çoklu Silindir Ateşleme Hatası Tespit Edildi',
              },
              symptoms: {
                type: 'array',
                items: {
                  type: 'string',
                },
                example: [
                  'Motor titremesi',
                  'Güç kaybı',
                  'Yakıt artışı',
                ],
              },
              possibleCauses: {
                type: 'array',
                items: {
                  type: 'string',
                },
                example: [
                  'Bozuk bujiler',
                  'Buji kabloları hasarı',
                  'Ateşleme bobini arızası',
                  'Yakıt basıncı problemi',
                ],
              },
              severity: {
                type: 'string',
                enum: ['bilgilendirme', 'önemli', 'kritik'],
                example: 'önemli',
              },
            },
          },
        },
      },

      // Brands & Models
      BrandsResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                name: {
                  type: 'string',
                  example: 'Renault',
                },
                slug: {
                  type: 'string',
                  example: 'renault',
                },
                logo: {
                  type: 'string',
                  format: 'uri',
                  example: '/logos/renault.png',
                },
                country: {
                  type: 'string',
                  example: 'FR',
                },
              },
            },
          },
        },
      },
      ModelsResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                name: {
                  type: 'string',
                  example: 'Megane',
                },
                slug: {
                  type: 'string',
                  example: 'megane',
                },
                years: {
                  type: 'array',
                  items: {
                    type: 'integer',
                  },
                  example: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
                },
                image: {
                  type: 'string',
                  format: 'uri',
                },
              },
            },
          },
        },
      },

      // Services
      ServicesResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: 1,
                },
                name: {
                  type: 'string',
                  example: 'Oto Tamirhanem',
                },
                slug: {
                  type: 'string',
                  example: 'oto-tamirhanem',
                },
                address: {
                  type: 'string',
                  example: 'Atatürk Mah. Cumhuriyet Cad. No:123',
                },
                city: {
                  type: 'string',
                  example: 'İstanbul',
                },
                district: {
                  type: 'string',
                  example: 'Kadıköy',
                },
                phone: {
                  type: 'string',
                  example: '+902161234567',
                },
                rating: {
                  type: 'number',
                  minimum: 0,
                  maximum: 5,
                  example: 4.5,
                },
                reviewCount: {
                  type: 'integer',
                  example: 127,
                },
                categories: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                  example: ['motor', 'kaporta', 'elektrik'],
                },
                distance: {
                  type: 'number',
                  description: 'Mesafe (km) - konum araması için',
                  example: 2.3,
                },
                workingHours: {
                  type: 'object',
                  properties: {
                monday: {
                  type: 'object',
                  properties: {
                    open: {
                      type: 'string',
                      example: '09:00',
                    },
                    close: {
                      type: 'string',
                      example: '18:00',
                    },
                    closed: {
                      type: 'boolean',
                      example: false,
                    },
                  },
                },
              },
                },
                isOpen: {
                  type: 'boolean',
                  description: 'Şu an açık mı',
                  example: true,
                },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              total: {
                type: 'integer',
                example: 45,
              },
              page: {
                type: 'integer',
                example: 1,
              },
              limit: {
                type: 'integer',
                example: 20,
              },
            },
          },
        },
      },

      // Appointment
      AppointmentRequest: {
        type: 'object',
        required: ['phone', 'city', 'brand', 'model', 'category'],
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
            example: 'Ahmet Yılmaz',
          },
          phone: {
            type: 'string',
            description: 'Türkiye cep telefonu',
            pattern: '^(\+90|0)?[5][0-9]{9}$',
            example: '05551234567',
          },
          city: {
            type: 'string',
            example: 'İstanbul',
          },
          brand: {
            type: 'string',
            example: 'Renault',
          },
          model: {
            type: 'string',
            example: 'Megane',
          },
          year: {
            type: 'integer',
            minimum: 1990,
            example: 2020,
          },
          category: {
            type: 'string',
            enum: ['motor', 'kaporta', 'elektrik', 'fren', 'suspansiyon', 'klima', 'lastik', 'yag', 'periyodik-bakim'],
            example: 'motor',
          },
          notes: {
            type: 'string',
            maxLength: 500,
            example: 'Rölanti problemi var, check engine lambası yanıyor.',
          },
          preferredDate: {
            type: 'string',
            format: 'date',
            example: '2024-01-15',
          },
        },
      },
      AppointmentResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'apt_1234567890',
              },
              status: {
                type: 'string',
                enum: ['beklemede', 'onaylandi', 'planlandi', 'tamamlandi', 'iptal'],
                example: 'beklemede',
              },
              estimatedWaitTime: {
                type: 'string',
                example: '1-2 iş günü',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
        },
      },

      // Recalls
      RecallsResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                title: {
                  type: 'string',
                  example: ' fren hortumu hatası',
                },
                description: {
                  type: 'string',
                  example: 'Arka fren hortumlarında üretim hatası tespit edilmiştir.',
                },
                risk: {
                  type: 'string',
                  enum: ['düşük', 'orta', 'yüksek'],
                  example: 'orta',
                },
                affectedVehicles: {
                  type: 'object',
                  properties: {
                    startYear: {
                      type: 'integer',
                      example: 2018,
                    },
                    endYear: {
                      type: 'integer',
                      example: 2020,
                    },
                    count: {
                      type: 'integer',
                      example: 15000,
                    },
                  },
                },
                remedy: {
                  type: 'string',
                  example: 'Yetkili servise ücretsiz kontrol için başvurun.',
                },
                announcedDate: {
                  type: 'string',
                  format: 'date',
                  example: '2023-06-15',
                },
                source: {
                  type: 'string',
                  example: 'TSE',
                },
              },
            },
          },
        },
      },

      // Price Estimate
      PriceEstimateRequest: {
        type: 'object',
        required: ['brand', 'model', 'year', 'issue'],
        properties: {
          brand: {
            type: 'string',
            example: 'Renault',
          },
          model: {
            type: 'string',
            example: 'Megane',
          },
          year: {
            type: 'integer',
            example: 2020,
          },
          issue: {
            type: 'string',
            description: 'Sorun tanımı',
            example: 'Fren balataları değişimi',
          },
          parts: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['ön fren balatası', 'disk'],
          },
        },
      },
      PriceEstimateResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
            properties: {
              estimate: {
                type: 'object',
                properties: {
                  parts: {
                    type: 'number',
                    example: 3500,
                  },
                  labor: {
                    type: 'number',
                    example: 1500,
                  },
                  total: {
                    type: 'number',
                    example: 5000,
                  },
                  currency: {
                    type: 'string',
                    example: 'TRY',
                  },
                },
              },
              breakdown: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    item: {
                      type: 'string',
                      example: 'Ön fren balatası (çift)',
                    },
                    price: {
                      type: 'number',
                      example: 1800,
                    },
                    quantity: {
                      type: 'integer',
                      example: 1,
                    },
                  },
                },
              },
              estimatedDuration: {
                type: 'string',
                example: '2-3 saat',
              },
              disclaimer: {
                type: 'string',
                example: 'Bu bir tahmini fiyattır. Kesin fiyat için servisle iletişime geçin.',
              },
            },
          },
        },
      },

      // Error Response
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Geçersiz istek',
              },
              code: {
                type: 'string',
                example: 'BAD_REQUEST',
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              timestamp: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
        },
      },
    },
  },
};
