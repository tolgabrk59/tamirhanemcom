import { describe, it, expect, vi, beforeEach } from 'vitest'
import { successResponse, errorResponse, errors, sanitizeErrorMessage, logError } from '../api-response'

describe('API Response Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('successResponse', () => {
    it('başarılı yanıt oluşturmalı', () => {
      const data = { id: 1, name: 'Test Servis' }
      const response = successResponse(data)

      expect(response.status).toBe(200)
      expect(response.ok).toBe(true)
    })

    it('özel durum kodu ile yanıt oluşturmalı', () => {
      const data = { created: true }
      const response = successResponse(data, 201)

      expect(response.status).toBe(201)
    })

    it('özel header ile yanıt oluşturmalı', () => {
      const data = { token: 'abc123' }
      const headers = { 'X-Custom-Header': 'test-value' }
      const response = successResponse(data, 200, headers)

      expect(response.status).toBe(200)
    })

    it('timestamp içermeli', async () => {
      const data = { test: true }
      const response = successResponse(data)
      const json = await response.json()

      expect(json.meta).toBeDefined()
      expect(json.meta.timestamp).toBeDefined()
      expect(json.success).toBe(true)
      expect(json.data).toEqual(data)
    })
  })

  describe('errorResponse', () => {
    it('hata yanıt oluşturmalı', async () => {
      const response = errorResponse('Bir hata oluştu')
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json.success).toBe(false)
      expect(json.error.message).toBe('Bir hata oluştu')
    })

    it('özel durum kodu ile hata yanıtı oluşturmalı', async () => {
      const response = errorResponse('Bulunamadı', 404, 'NOT_FOUND')
      const json = await response.json()

      expect(response.status).toBe(404)
      expect(json.error.code).toBe('NOT_FOUND')
    })

    it('timestamp içermeli', async () => {
      const response = errorResponse('Test hatası')
      const json = await response.json()

      expect(json.meta).toBeDefined()
      expect(json.meta.timestamp).toBeDefined()
    })
  })

  describe('errors - common error responses', () => {
    it('badRequest hatası oluşturmalı', async () => {
      const response = errors.badRequest('Geçersiz veri')
      const json = await response.json()

      expect(response.status).toBe(400)
      expect(json.error.code).toBe('BAD_REQUEST')
      expect(json.error.message).toBe('Geçersiz veri')
    })

    it('unauthorized hatası oluşturmalı', async () => {
      const response = errors.unauthorized()
      const json = await response.json()

      expect(response.status).toBe(401)
      expect(json.error.code).toBe('UNAUTHORIZED')
    })

    it('forbidden hatası oluşturmalı', async () => {
      const response = errors.forbidden()
      const json = await response.json()

      expect(response.status).toBe(403)
      expect(json.error.code).toBe('FORBIDDEN')
    })

    it('notFound hatası oluşturmalı', async () => {
      const response = errors.notFound()
      const json = await response.json()

      expect(response.status).toBe(404)
      expect(json.error.code).toBe('NOT_FOUND')
    })

    it('conflict hatası oluşturmalı', async () => {
      const response = errors.conflict()
      const json = await response.json()

      expect(response.status).toBe(409)
      expect(json.error.code).toBe('CONFLICT')
    })

    it('validation hatası oluşturmalı', async () => {
      const response = errors.validation('Email geçersiz')
      const json = await response.json()

      expect(response.status).toBe(422)
      expect(json.error.code).toBe('VALIDATION_ERROR')
    })

    it('rateLimit hatası oluşturmalı', async () => {
      const response = errors.rateLimit(60)
      const json = await response.json()

      expect(response.status).toBe(429)
      expect(json.error.code).toBe('RATE_LIMIT_EXCEEDED')
    })

    it('internal hatası oluşturmalı', async () => {
      const response = errors.internal()
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json.error.code).toBe('INTERNAL_ERROR')
    })

    it('badGateway hatası oluşturmalı', async () => {
      const response = errors.badGateway()
      const json = await response.json()

      expect(response.status).toBe(502)
      expect(json.error.code).toBe('BAD_GATEWAY')
    })

    it('serviceUnavailable hatası oluşturmalı', async () => {
      const response = errors.serviceUnavailable()
      const json = await response.json()

      expect(response.status).toBe(503)
      expect(json.error.code).toBe('SERVICE_UNAVAILABLE')
    })
  })

  describe('sanitizeErrorMessage', () => {
    it('normal hata mesajını korumalı', () => {
      const error = new Error('Kayıt bulunamadı')
      const sanitized = sanitizeErrorMessage(error)

      expect(sanitized).toBe('Kayıt bulunamadı')
    })

    it('API key içeren mesajı gizlemeli', () => {
      const error = new Error('Api_key: 1234567890 failed')
      const sanitized = sanitizeErrorMessage(error)

      expect(sanitized).toBe('Bir hata oluştu. Lütfen tekrar deneyin.')
    })

    it('secret içeren mesajı gizlemeli', () => {
      const error = new Error('Secret token expired')
      const sanitized = sanitizeErrorMessage(error)

      expect(sanitized).toBe('Bir hata oluştu. Lütfen tekrar deneyin.')
    })

    it('password içeren mesajı gizlemeli', () => {
      const error = new Error('Invalid password for user')
      const sanitized = sanitizeErrorMessage(error)

      expect(sanitized).toBe('Bir hata oluştu. Lütfen tekrar deneyin.')
    })

    it('database içeren mesajı gizlemeli', () => {
      const error = new Error('MySQL connection lost')
      const sanitized = sanitizeErrorMessage(error)

      expect(sanitized).toBe('Bir hata oluştu. Lütfen tekrar deneyin.')
    })

    it('stack trace içeren mesajı gizlemeli', () => {
      const error = new Error('Error at function (/src/app/api/route.ts:42:15)')
      const sanitized = sanitizeErrorMessage(error)

      expect(sanitized).toBe('Bir hata oluştu. Lütfen tekrar deneyin.')
    })

    it('string hatayı işlemeli', () => {
      const sanitized = sanitizeErrorMessage('Geçersiz istek')

      expect(sanitized).toBe('Geçersiz istek')
    })

    it('uzun mesajı kırpmalı', () => {
      const longMessage = 'A'.repeat(300)
      const sanitized = sanitizeErrorMessage(longMessage)

      expect(sanitized.length).toBe(200)
    })

    it('bilinmeyen tip için varsayılan mesaj döndürmeli', () => {
      const sanitized = sanitizeErrorMessage(12345)

      expect(sanitized).toBe('Bir hata oluştu. Lütfen tekrar deneyin.')
    })
  })

  describe('logError', () => {
    it('Error nesnesini loglamalı', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const error = new Error('Test hatası')
      logError('test-context', error)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[test-context]',
        expect.objectContaining({
          message: 'Test hatası',
          stack: expect.any(String),
          timestamp: expect.any(String)
        })
      )

      consoleSpy.mockRestore()
    })

    it('string hatayı loglamalı', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      logError('test-context', 'String hata')

      expect(consoleSpy).toHaveBeenCalledWith(
        '[test-context]',
        expect.objectContaining({
          message: 'String hata',
          timestamp: expect.any(String)
        })
      )

      consoleSpy.mockRestore()
    })
  })
})
