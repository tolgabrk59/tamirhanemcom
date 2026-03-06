import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  RATE_LIMITS,
  checkRateLimitMemory,
  getClientIP,
  createRateLimitHeaders
} from '../rate-limiter'

describe('Rate Limiter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('RATE_LIMITS configuration', () => {
    it('AI endpoint için doğru limit ayarlanmalı', () => {
      expect(RATE_LIMITS.ai.windowMs).toBe(60 * 60 * 1000) // 1 saat
      expect(RATE_LIMITS.ai.maxRequests).toBe(10)
    })

    it('chat endpoint için doğru limit ayarlanmalı', () => {
      expect(RATE_LIMITS.chat.windowMs).toBe(60 * 60 * 1000)
      expect(RATE_LIMITS.chat.maxRequests).toBe(20)
    })

    it('scraping endpoint için doğru limit ayarlanmalı', () => {
      expect(RATE_LIMITS.scraping.windowMs).toBe(60 * 60 * 1000)
      expect(RATE_LIMITS.scraping.maxRequests).toBe(5)
    })

    it('standard endpoint için doğru limit ayarlanmalı', () => {
      expect(RATE_LIMITS.standard.windowMs).toBe(60 * 1000) // 1 dakika
      expect(RATE_LIMITS.standard.maxRequests).toBe(60)
    })

    it('auth endpoint için doğru limit ayarlanmalı', () => {
      expect(RATE_LIMITS.auth.windowMs).toBe(15 * 60 * 1000) // 15 dakika
      expect(RATE_LIMITS.auth.maxRequests).toBe(5)
    })
  })

  describe('checkRateLimitMemory', () => {
    it('ilk istek başarılı olmalı', () => {
      const result = checkRateLimitMemory('test-user-1', { windowMs: 60000, maxRequests: 5 })

      expect(result.success).toBe(true)
      expect(result.remaining).toBe(4)
    })

    it('limit içinde istekler başarılı olmalı', () => {
      const config = { windowMs: 60000, maxRequests: 3 }

      const result1 = checkRateLimitMemory('test-user-2', config)
      const result2 = checkRateLimitMemory('test-user-2', config)
      const result3 = checkRateLimitMemory('test-user-2', config)

      expect(result1.success).toBe(true)
      expect(result1.remaining).toBe(2)
      expect(result2.success).toBe(true)
      expect(result2.remaining).toBe(1)
      expect(result3.success).toBe(true)
      expect(result3.remaining).toBe(0)
    })

    it('limit aşılınca istek reddedilmeli', () => {
      const config = { windowMs: 60000, maxRequests: 2 }

      checkRateLimitMemory('test-user-3', config)
      checkRateLimitMemory('test-user-3', config)
      const result = checkRateLimitMemory('test-user-3', config)

      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
      expect(result.retryAfter).toBeGreaterThan(0)
    })

    it('pencere süresi dolunca limit sıfırlanmalı', () => {
      const config = { windowMs: 60000, maxRequests: 2 }

      checkRateLimitMemory('test-user-4', config)
      checkRateLimitMemory('test-user-4', config)

      // 60 saniye ileri sar
      vi.advanceTimersByTime(61000)

      const result = checkRateLimitMemory('test-user-4', config)

      expect(result.success).toBe(true)
      expect(result.remaining).toBe(1)
    })

    it('farklı kullanıcılar bağımsız limit kullanmalı', () => {
      const config = { windowMs: 60000, maxRequests: 1 }

      checkRateLimitMemory('user-a', config)
      const resultA = checkRateLimitMemory('user-a', config)
      const resultB = checkRateLimitMemory('user-b', config)

      expect(resultA.success).toBe(false)
      expect(resultB.success).toBe(true)
    })
  })

  describe('getClientIP', () => {
    it('x-forwarded-for header varsa ilk IP döndürmeli', () => {
      const request = new Request('http://localhost/api/test', {
        headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' }
      })

      expect(getClientIP(request)).toBe('192.168.1.1')
    })

    it('x-real-ip header varsa döndürmeli', () => {
      const request = new Request('http://localhost/api/test', {
        headers: { 'x-real-ip': '10.0.0.5' }
      })

      expect(getClientIP(request)).toBe('10.0.0.5')
    })

    it('header yoksa unknown döndürmeli', () => {
      const request = new Request('http://localhost/api/test')

      expect(getClientIP(request)).toBe('unknown')
    })

    it('x-forwarded-for öncelikli olmalı', () => {
      const request = new Request('http://localhost/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
          'x-real-ip': '10.0.0.5'
        }
      })

      expect(getClientIP(request)).toBe('192.168.1.1')
    })
  })

  describe('createRateLimitHeaders', () => {
    it('başarılı sonuç için header oluşturmalı', () => {
      const result = {
        success: true,
        remaining: 5,
        resetTime: Date.now() + 60000
      }

      const headers = createRateLimitHeaders(result)

      expect(headers['X-RateLimit-Remaining']).toBe('5')
      expect(headers['X-RateLimit-Reset']).toBeDefined()
      expect(headers['Retry-After']).toBeUndefined()
    })

    it('başarısız sonuç için Retry-After header eklemeli', () => {
      const result = {
        success: false,
        remaining: 0,
        resetTime: Date.now() + 60000,
        retryAfter: 60
      }

      const headers = createRateLimitHeaders(result)

      expect(headers['X-RateLimit-Remaining']).toBe('0')
      expect(headers['Retry-After']).toBe('60')
    })
  })
})
