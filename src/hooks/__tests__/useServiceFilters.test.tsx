import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useServiceFilters } from '../useServiceFilters'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('useServiceFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: [] })
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('initial state', () => {
    it('varsayılan değerlerle başlamalı', () => {
      const { result } = renderHook(() => useServiceFilters())

      expect(result.current.filters.city).toBe('')
      expect(result.current.filters.district).toBe('')
      expect(result.current.filters.vehicleType).toBe('otomobil')
      expect(result.current.filters.brand).toBe('')
      expect(result.current.filters.model).toBe('')
      expect(result.current.filters.category).toBe('')
    })

    it('özel başlangıç değerleri ile başlamalı', () => {
      const { result } = renderHook(() =>
        useServiceFilters({
          initialCity: 'istanbul',
          initialDistrict: 'kadikoy',
          initialVehicleType: 'motorsiklet'
        })
      )

      expect(result.current.filters.city).toBe('istanbul')
      expect(result.current.filters.district).toBe('kadikoy')
      expect(result.current.filters.vehicleType).toBe('motorsiklet')
    })
  })

  describe('setCity', () => {
    it('şehir değişince ilçe sıfırlanmalı', () => {
      const { result } = renderHook(() =>
        useServiceFilters({ initialDistrict: 'kadikoy' })
      )

      act(() => {
        result.current.setCity('ankara')
      })

      expect(result.current.filters.city).toBe('ankara')
      expect(result.current.filters.district).toBe('')
    })
  })

  describe('setVehicleType', () => {
    it('araç tipi değişince marka ve model sıfırlanmalı', async () => {
      const { result } = renderHook(() => useServiceFilters())

      act(() => {
        result.current.setBrand('BMW')
        result.current.setModel('320i')
      })

      act(() => {
        result.current.setVehicleType('motorsiklet')
      })

      expect(result.current.filters.vehicleType).toBe('motorsiklet')
      expect(result.current.filters.brand).toBe('')
      expect(result.current.filters.model).toBe('')
    })

    it('araç tipi değişince markalar yeniden yüklenmeli', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: true,
          data: [{ id: 1, name: 'Honda' }]
        })
      })

      const { result } = renderHook(() => useServiceFilters())

      act(() => {
        result.current.setVehicleType('motorsiklet')
      })

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/brands?vehicleType=motorsiklet')
      })
    })
  })

  describe('setBrand', () => {
    it('marka değişince model sıfırlanmalı', () => {
      const { result } = renderHook(() => useServiceFilters())

      act(() => {
        result.current.setModel('320i')
      })

      act(() => {
        result.current.setBrand('Mercedes')
      })

      expect(result.current.filters.brand).toBe('Mercedes')
      expect(result.current.filters.model).toBe('')
    })

    it('marka değişince modeller yeniden yüklenmeli', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, data: [] })
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({
            success: true,
            data: [{ id: 1, name: '320i' }]
          })
        })

      const { result } = renderHook(() => useServiceFilters())

      act(() => {
        result.current.setBrand('BMW')
      })

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/models?brand=BMW&vehicleType=otomobil'
        )
      })
    })
  })

  describe('resetFilters', () => {
    it('tüm filtreleri sıfırlamalı', () => {
      const { result } = renderHook(() =>
        useServiceFilters({ initialCity: 'istanbul' })
      )

      act(() => {
        result.current.setCity('ankara')
        result.current.setDistrict('cankaya')
        result.current.setBrand('BMW')
        result.current.setModel('320i')
        result.current.setCategory('motor')
      })

      act(() => {
        result.current.resetFilters()
      })

      expect(result.current.filters.city).toBe('istanbul')
      expect(result.current.filters.district).toBe('')
      expect(result.current.filters.brand).toBe('')
      expect(result.current.filters.model).toBe('')
      expect(result.current.filters.category).toBe('')
    })
  })

  describe('getSearchParams', () => {
    it('boş filtreler için boş params dönmeli', () => {
      const { result } = renderHook(() => useServiceFilters())

      const params = result.current.getSearchParams()

      expect(params.toString()).toBe('')
    })

    it('dolu filtreler için doğru params dönmeli', () => {
      const { result } = renderHook(() => useServiceFilters())

      act(() => {
        result.current.setCity('istanbul')
        result.current.setDistrict('kadikoy')
        result.current.setBrand('BMW')
        result.current.setCategory('motor')
      })

      const params = result.current.getSearchParams()

      expect(params.get('city')).toBe('istanbul')
      expect(params.get('district')).toBe('kadikoy')
      expect(params.get('brand')).toBe('BMW')
      expect(params.get('category')).toBe('motor')
    })
  })

  describe('loading states', () => {
    it('kategoriler yüklenirken loading true olmalı', async () => {
      let resolveCategories: (value: unknown) => void
      mockFetch.mockImplementationOnce(() => new Promise(resolve => {
        resolveCategories = resolve
      }))

      const { result } = renderHook(() => useServiceFilters())

      expect(result.current.isLoadingCategories).toBe(true)

      act(() => {
        resolveCategories!({
          json: () => Promise.resolve({ success: true, data: [] })
        })
      })

      await waitFor(() => {
        expect(result.current.isLoadingCategories).toBe(false)
      })
    })
  })
})
