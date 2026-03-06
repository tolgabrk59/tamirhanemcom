import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Redis before importing cache module
vi.mock('ioredis', () => {
  const mockRedis = vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
    keys: vi.fn(),
    smembers: vi.fn(),
    sadd: vi.fn(),
    expire: vi.fn(),
    incr: vi.fn(),
    pipeline: vi.fn().mockReturnValue({
      sadd: vi.fn().mockReturnThis(),
      expire: vi.fn().mockReturnThis(),
      del: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    }),
    on: vi.fn(),
  }))
  return { default: mockRedis }
})

describe('Cache Module', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    // Clear env vars
    delete process.env.REDIS_URL
    delete process.env.REDIS_HOST
  })

  describe('getCached', () => {
    it('Redis olmadan direkt fetcher çağırmalı', async () => {
      const { getCached } = await import('../cache')

      const fetcher = vi.fn().mockResolvedValue({ data: 'test' })
      const result = await getCached('test-key', fetcher)

      expect(fetcher).toHaveBeenCalled()
      expect(result).toEqual({ data: 'test' })
    })
  })

  describe('invalidateCache', () => {
    it('Redis olmadan false dönmeli', async () => {
      const { invalidateCache } = await import('../cache')

      const result = await invalidateCache('test-key')

      expect(result).toBe(false)
    })
  })

  describe('invalidateByTag', () => {
    it('Redis olmadan 0 dönmeli', async () => {
      const { invalidateByTag } = await import('../cache')

      const result = await invalidateByTag('test-tag')

      expect(result).toBe(0)
    })
  })

  describe('clearAllCache', () => {
    it('Redis olmadan false dönmeli', async () => {
      const { clearAllCache } = await import('../cache')

      const result = await clearAllCache()

      expect(result).toBe(false)
    })
  })

  describe('getCacheStats', () => {
    it('Redis olmadan null dönmeli', async () => {
      const { getCacheStats } = await import('../cache')

      const result = await getCacheStats()

      expect(result).toBe(null)
    })
  })

  describe('cacheAIResponse', () => {
    it('doğru cache key formatı oluşturmalı', async () => {
      const { cacheAIResponse } = await import('../cache')

      const fetcher = vi.fn().mockResolvedValue({ response: 'AI response' })
      const result = await cacheAIResponse('BMW', '320i', 2020, 'diagnosis', fetcher)

      expect(fetcher).toHaveBeenCalled()
      expect(result).toEqual({ response: 'AI response' })
    })
  })

  describe('cacheVehicleData', () => {
    it('doğru cache key formatı oluşturmalı', async () => {
      const { cacheVehicleData } = await import('../cache')

      const fetcher = vi.fn().mockResolvedValue({ specs: 'vehicle specs' })
      const result = await cacheVehicleData('specs', 'bmw-320i', fetcher)

      expect(fetcher).toHaveBeenCalled()
      expect(result).toEqual({ specs: 'vehicle specs' })
    })
  })

  describe('cachePricingData', () => {
    it('doğru cache key formatı oluşturmalı', async () => {
      const { cachePricingData } = await import('../cache')

      const fetcher = vi.fn().mockResolvedValue({ price: 150000 })
      const result = await cachePricingData('Mercedes', 'C180', 2022, fetcher)

      expect(fetcher).toHaveBeenCalled()
      expect(result).toEqual({ price: 150000 })
    })
  })
})
