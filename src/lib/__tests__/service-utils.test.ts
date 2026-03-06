import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  calculateDistance,
  formatDistance,
  parseWorkingHours,
  isServiceOpen,
  getFavorites,
  isFavorite,
  toggleFavorite,
  clearFavorites,
} from '../service-utils'

describe('Distance Calculation', () => {
  describe('calculateDistance', () => {
    it('aynı nokta için 0 döndürmeli', () => {
      const distance = calculateDistance(41.0082, 28.9784, 41.0082, 28.9784)
      expect(distance).toBe(0)
    })

    it('İstanbul koordinatları için doğru mesafeyi hesaplamalı', () => {
      // İstanbul (Kadıköy) to İstanbul (Beşiktaş)
      const distance = calculateDistance(40.9901, 29.0292, 41.0422, 29.0067)
      expect(distance).toBeGreaterThan(0)
      expect(distance).toBeLessThan(10) // Yaklaşık 6 km
    })

    it('Haversine formülünü doğru kullanmalı', () => {
      // Ankara to İstanbul (yaklaşık 349 km)
      const distance = calculateDistance(39.9334, 32.8597, 41.0082, 28.9784)
      expect(distance).toBeGreaterThan(340)
      expect(distance).toBeLessThan(360)
    })
  })

  describe('formatDistance', () => {
    it('1 km altında metre formatı döndürmeli', () => {
      expect(formatDistance(0.5)).toBe('500 m')
      expect(formatDistance(0.123)).toBe('123 m')
    })

    it('1 km ve üzeri km formatı döndürmeli', () => {
      expect(formatDistance(1)).toBe('1.0 km')
      expect(formatDistance(5.5)).toBe('5.5 km')
    })

    it('ondalığı doğru yuvarlamalı', () => {
      expect(formatDistance(3.456)).toBe('3.5 km')
      expect(formatDistance(10.123)).toBe('10.1 km')
    })
  })
})

describe('Working Hours', () => {
  describe('parseWorkingHours', () => {
    it('JSON string objeye çevirmeli', () => {
      const hoursStr = JSON.stringify({
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
      })

      const result = parseWorkingHours(hoursStr)
      expect(result).toBeDefined()
      expect(result?.monday?.open).toBe('09:00')
      expect(result?.monday?.close).toBe('18:00')
    })

    it('zaten obje girdisini doğrudan döndürmeli', () => {
      const hoursObj = {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
      }

      const result = parseWorkingHours(hoursObj)
      expect(result).toBeDefined()
      expect(result?.monday?.open).toBe('09:00')
    })

    it('null için null döndürmeli', () => {
      const result = parseWorkingHours(null)
      expect(result).toBeNull()
    })

    it('geçersiz JSON için null döndürmeli', () => {
      const result = parseWorkingHours('invalid json')
      expect(result).toBeNull()
    })

    it('sadece ID içeren objeleri reddetmeli', () => {
      const result = parseWorkingHours({ id: 15 })
      expect(result).toBeNull()
    })

    it('HH:MM:SS formatını HH:MM formatına çevirmeli', () => {
      const hoursObj = {
        monday: { open: '09:00:00.000', close: '18:30:00.000' },
      }

      const result = parseWorkingHours(hoursObj)
      expect(result?.monday?.open).toBe('09:00')
      expect(result?.monday?.close).toBe('18:30')
    })

    it('kapalı günleri işaretlemeli', () => {
      const hoursObj = {
        sunday: { open: '09:00', close: '18:00', closed: true },
        monday: { open: '09:00', close: '18:00' },
      }

      const result = parseWorkingHours(hoursObj)
      expect(result?.sunday?.closed).toBe(true)
      expect(result?.monday?.closed).toBe(false)
    })
  })

  describe('isServiceOpen', () => {
    it('null working hours için varsayılan değer döndürmeli', () => {
      const result = isServiceOpen(null)
      expect(result).toHaveProperty('isOpen')
      expect(result).toHaveProperty('nextTime')
      expect(result).toHaveProperty('closingTime')
    })

    it('geçersiz working hours için varsayılan değer döndürmeli', () => {
      const result = isServiceOpen({ id: 15 })
      expect(result).toHaveProperty('isOpen')
    })

    it('açık saat içinde true döndürmeli', () => {
      // Not: Bu test, çalışma saatine bağlı olarak başarısız olabilir
      // Mock tarih kullanılabilir
      const hours = {
        monday: { open: '00:00', close: '23:59' },
        tuesday: { open: '00:00', close: '23:59' },
        wednesday: { open: '00:00', close: '23:59' },
        thursday: { open: '00:00', close: '23:59' },
        friday: { open: '00:00', close: '23:59' },
        saturday: { open: '00:00', close: '23:59' },
        sunday: { open: '00:00', close: '23:59' },
      }

      const result = isServiceOpen(hours)
      expect(result.isOpen).toBe(true)
      expect(result.closingTime).toBeDefined()
    })
  })
})

describe('Favorites', () => {
  // Global store for localStorage mock
  let store: Record<string, string> = {}

  const localStorageMock = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }

  beforeEach(() => {
    // Clear store before each test
    store = {}

    // Mock both window.localStorage and global localStorage
    vi.stubGlobal('window', {
      localStorage: localStorageMock,
    })
    vi.stubGlobal('localStorage', localStorageMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('getFavorites', () => {
    it('boş localStorage için boş dizi döndürmeli', () => {
      const favorites = getFavorites()
      expect(favorites).toEqual([])
    })

    it('kaydedilmiş favorileri döndürmeli', () => {
      localStorage.setItem('tamirhanem_favorite_services', '[1, 2, 3]')
      const favorites = getFavorites()
      expect(favorites).toEqual([1, 2, 3])
    })

    it('geçersiz JSON için boş dizi döndürmeli', () => {
      localStorage.setItem('tamirhanem_favorite_services', 'invalid')
      const favorites = getFavorites()
      expect(favorites).toEqual([])
    })
  })

  describe('isFavorite', () => {
    it('favori olan servis için true döndürmeli', () => {
      localStorage.setItem('tamirhanem_favorite_services', '[1, 2, 3]')
      expect(isFavorite(2)).toBe(true)
    })

    it('favori olmayan servis için false döndürmeli', () => {
      localStorage.setItem('tamirhanem_favorite_services', '[1, 2, 3]')
      expect(isFavorite(5)).toBe(false)
    })

    it('boş liste için false döndürmeli', () => {
      expect(isFavorite(1)).toBe(false)
    })
  })

  describe('toggleFavorite', () => {
    it('yeni favori eklemeli', () => {
      const added = toggleFavorite(1)
      expect(added).toBe(true)
      expect(getFavorites()).toContain(1)
    })

    it('mevcut favoriyi çıkarmalı', () => {
      localStorage.setItem('tamirhanem_favorite_services', '[1, 2, 3]')
      const removed = toggleFavorite(2)
      expect(removed).toBe(false)
      expect(getFavorites()).not.toContain(2)
      expect(getFavorites()).toEqual([1, 3])
    })

    it('favori eklendikten sonra localStorage güncellemeli', () => {
      toggleFavorite(5)
      const stored = localStorage.getItem('tamirhanem_favorite_services')
      expect(stored).toBe('[5]')
    })
  })

  describe('clearFavorites', () => {
    it('tüm favorileri temizlemeli', () => {
      localStorage.setItem('tamirhanem_favorite_services', '[1, 2, 3]')
      clearFavorites()
      const favorites = getFavorites()
      expect(favorites).toEqual([])
    })

    it('localStorage silmeli', () => {
      localStorage.setItem('tamirhanem_favorite_services', '[1, 2, 3]')
      clearFavorites()
      const stored = localStorage.getItem('tamirhanem_favorite_services')
      expect(stored).toBeNull()
    })
  })
})
