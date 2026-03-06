import { describe, it, expect } from 'vitest'
import {
  phoneSchema,
  yearSchema,
  safeTextSchema,
  nameSchema,
  brandSchema,
  modelSchema,
  citySchema,
  notesSchema,
  obdCodeSchema,
  waitlistSchema,
  randevuSchema,
  vehicleSelectSchema,
  aiResearchSchema,
  obdSearchSchema,
  adminLoginSchema,
  validateRequest,
  formatValidationErrors,
} from '../validation'

describe('Validation Schemas', () => {
  describe('phoneSchema', () => {
    it('geçerli +90 formatlı numarayı kabul etmeli', () => {
      const result = phoneSchema.safeParse('+905551234567')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('+905551234567')
      }
    })

    it('geçerli 0 ile başlayan numarayı kabul etmeli', () => {
      const result = phoneSchema.safeParse('05551234567')
      expect(result.success).toBe(true)
    })

    it('boşluk içeren numarayı temizlemeli', () => {
      const result = phoneSchema.safeParse('0555 123 45 67')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('05551234567')
      }
    })

    it('parantez içeren numarayı temizlemeli', () => {
      const result = phoneSchema.safeParse('(0555) 123 45 67')
      expect(result.success).toBe(true)
    })

    it('5 ile başlamayan numarayı reddetmeli', () => {
      const result = phoneSchema.safeParse('09991234567')
      expect(result.success).toBe(false)
    })

    it('kısa numarayı reddetmeli', () => {
      const result = phoneSchema.safeParse('555123')
      expect(result.success).toBe(false)
    })

    it('yabancı numarayı reddetmeli', () => {
      const result = phoneSchema.safeParse('+1234567890')
      expect(result.success).toBe(false)
    })
  })

  describe('yearSchema', () => {
    const currentYear = new Date().getFullYear()

    it('geçerli yıl kabul etmeli', () => {
      const result = yearSchema.safeParse('2020')
      expect(result.success).toBe(true)
    })

    it('sayı olarak yıl kabul etmeli', () => {
      const result = yearSchema.safeParse(2020)
      expect(result.success).toBe(true)
    })

    it('1990dan önceki yılı reddetmeli', () => {
      const result = yearSchema.safeParse('1989')
      expect(result.success).toBe(false)
    })

    it('gelecek yılı reddetmeli', () => {
      const result = yearSchema.safeParse(currentYear + 5)
      expect(result.success).toBe(false)
    })

    it('gelecek yıl+1 kabul etmeli', () => {
      const result = yearSchema.safeParse(currentYear + 1)
      expect(result.success).toBe(true)
    })
  })

  describe('safeTextSchema', () => {
    it('normal metni kabul etmeli', () => {
      const result = safeTextSchema.safeParse('Normal metin')
      expect(result.success).toBe(true)
    })

    it('baştaki ve sondaki boşlukları temizlemeli', () => {
      const result = safeTextSchema.safeParse('  metin  ')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('metin')
      }
    })

    it('HTML etiketlerini kaldırmalı', () => {
      const result = safeTextSchema.safeParse('<script>alert("xss")</script>metin')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).not.toContain('<')
        expect(result.data).not.toContain('>')
      }
    })

    it('tehlikeli karakterleri kaldırmalı', () => {
      const result = safeTextSchema.safeParse('metin<>"\'test')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).not.toContain('<')
        expect(result.data).not.toContain('>')
        expect(result.data).not.toContain('"')
        expect(result.data).not.toContain("'")
      }
    })
  })

  describe('nameSchema', () => {
    it('geçerli isim kabul etmeli', () => {
      const result = nameSchema.safeParse('Ahmet Yılmaz')
      expect(result.success).toBe(true)
    })

    it('2 karakterden kısa ismi reddetmeli', () => {
      const result = nameSchema.safeParse('A')
      expect(result.success).toBe(false)
    })

    it('100 karakterden uzun ismi reddetmeli', () => {
      const result = nameSchema.safeParse('A'.repeat(101))
      expect(result.success).toBe(false)
    })

    it('HTML etiketlerini kaldırmalı', () => {
      const result = nameSchema.safeParse('<b>Ahmet</b>')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('Ahmet')
      }
    })
  })

  describe('brandSchema', () => {
    it('geçerli marka kabul etmeli', () => {
      const result = brandSchema.safeParse('Renault')
      expect(result.success).toBe(true)
    })

    it('boş markayı reddetmeli', () => {
      const result = brandSchema.safeParse('')
      expect(result.success).toBe(false)
    })

    it('50 karakterden uzun markayı reddetmeli', () => {
      const result = brandSchema.safeParse('A'.repeat(51))
      expect(result.success).toBe(false)
    })
  })

  describe('modelSchema', () => {
    it('geçerli model kabul etmeli', () => {
      const result = modelSchema.safeParse('Megane')
      expect(result.success).toBe(true)
    })

    it('boş modeli reddetmeli', () => {
      const result = modelSchema.safeParse('')
      expect(result.success).toBe(false)
    })
  })

  describe('citySchema', () => {
    it('geçerli şehir kabul etmeli', () => {
      const result = citySchema.safeParse('İstanbul')
      expect(result.success).toBe(true)
    })

    it('2 karakterden kısa şehri reddetmeli', () => {
      const result = citySchema.safeParse('A')
      expect(result.success).toBe(false)
    })
  })

  describe('notesSchema', () => {
    it('geçerli not kabul etmeli', () => {
      const result = notesSchema.safeParse('Bu bir test notudur')
      expect(result.success).toBe(true)
    })

    it('undefined kabul etmeli', () => {
      const result = notesSchema.safeParse(undefined)
      expect(result.success).toBe(true)
    })

    it('500 karakterden uzun notu reddetmeli', () => {
      const result = notesSchema.safeParse('A'.repeat(501))
      expect(result.success).toBe(false)
    })
  })

  describe('obdCodeSchema', () => {
    it('geçerli OBD kodu kabul etmeli', () => {
      const result = obdCodeSchema.safeParse('P0300')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('P0300')
      }
    })

    it('küçük harf kodu büyütmeli', () => {
      const result = obdCodeSchema.safeParse('p0300')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('P0300')
      }
    })

    it('boşluklu kodu temizlemeli', () => {
      const result = obdCodeSchema.safeParse(' P0300 ')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('P0300')
      }
    })

    it('boş kodu reddetmeli', () => {
      const result = obdCodeSchema.safeParse('')
      expect(result.success).toBe(false)
    })
  })
})

describe('Form Schemas', () => {
  describe('waitlistSchema', () => {
    it('email ile geçerli olmalı', () => {
      const result = waitlistSchema.safeParse({
        email: 'test@example.com',
        phone: null,
        name: null,
      })
      expect(result.success).toBe(true)
    })

    it('telefon ile geçerli olmalı', () => {
      const result = waitlistSchema.safeParse({
        email: null,
        phone: '05551234567',
        name: null,
      })
      expect(result.success).toBe(true)
    })

    it('email veya telefon olmadan geçersiz olmalı', () => {
      const result = waitlistSchema.safeParse({
        email: null,
        phone: null,
        name: null,
      })
      expect(result.success).toBe(false)
    })

    it('her ikisi ile de geçerli olmalı', () => {
      const result = waitlistSchema.safeParse({
        email: 'test@example.com',
        phone: '05551234567',
        name: 'Ahmet',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('randevuSchema', () => {
    it('geçerli randevu verisi kabul etmeli', () => {
      const result = randevuSchema.safeParse({
        phone: '05551234567',
        name: 'Ahmet Yılmaz',
        city: 'İstanbul',
        brand: 'Renault',
        model: 'Megane',
        year: 2020,
        category: 'motor',
        notes: 'Test notu',
      })
      expect(result.success).toBe(true)
    })

    it('zorunlu alanlar eksikse reddetmeli', () => {
      const result = randevuSchema.safeParse({
        phone: '05551234567',
        city: 'İstanbul',
        brand: 'Renault',
        model: 'Megane',
        // category eksik - zorunlu
      })
      expect(result.success).toBe(false)
    })
  })

  describe('vehicleSelectSchema', () => {
    it('geçerli araç seçimi kabul etmeli', () => {
      const result = vehicleSelectSchema.safeParse({
        brand: 'Renault',
        model: 'Megane',
        year: 2020,
        paket: 'comfort',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('aiResearchSchema', () => {
    it('geçerli AI araştırma verisi kabul etmeli', () => {
      const result = aiResearchSchema.safeParse({
        brand: 'Renault',
        model: 'Megane',
        year: 2020,
        paket: 'comfort',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('obdSearchSchema', () => {
    it('kod ile arama kabul etmeli', () => {
      const result = obdSearchSchema.safeParse({
        code: 'P0300',
        query: undefined,
        brand: undefined,
        model: undefined,
      })
      expect(result.success).toBe(true)
    })

    it('query ile arama kabul etmeli', () => {
      const result = obdSearchSchema.safeParse({
        code: undefined,
        query: 'motor arızası',
        brand: 'Renault',
        model: 'Megane',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('adminLoginSchema', () => {
    it('şifre ile geçerli olmalı', () => {
      const result = adminLoginSchema.safeParse({
        password: 'test-password',
      })
      expect(result.success).toBe(true)
    })

    it('boş şifre reddetmeli', () => {
      const result = adminLoginSchema.safeParse({
        password: '',
      })
      expect(result.success).toBe(false)
    })
  })
})

describe('Validation Helper Functions', () => {
  describe('validateRequest', () => {
    const testSchema = waitlistSchema

    it('geçerli veri ile success döndürmeli', () => {
      const result = validateRequest(testSchema, {
        email: 'test@example.com',
        phone: null,
        name: null,
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })

    it('geçersiz veri ile hata döndürmeli', () => {
      const result = validateRequest(testSchema, {
        email: null,
        phone: null,
        name: null,
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors).toBeDefined()
        expect(result.errors.length).toBeGreaterThan(0)
      }
    })
  })

  describe('formatValidationErrors', () => {
    it('hata mesajlarını birleştirmeli', () => {
      const errors = [
        { message: 'Hata 1', path: ['field1'] },
        { message: 'Hata 2', path: ['field2'] },
      ] as any

      const formatted = formatValidationErrors(errors)
      expect(formatted).toBe('Hata 1, Hata 2')
    })

    it('boş hata listesi ile boş string döndürmeli', () => {
      const formatted = formatValidationErrors([])
      expect(formatted).toBe('')
    })
  })
})
