'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'tamirhanem_location'

export interface LocationData {
  city: string
  district: string
  lat: number | null
  lon: number | null
  isManuallySet: boolean
  lastUpdated: string
}

const DEFAULT_LOCATION: LocationData = {
  city: '',
  district: '',
  lat: null,
  lon: null,
  isManuallySet: false,
  lastUpdated: '',
}

function readFromStorage(): LocationData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as LocationData
    if (!parsed.city) return null
    return parsed
  } catch {
    return null
  }
}

function writeToStorage(data: LocationData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage dolu veya erişilemez
  }
}

export function useLocationStore() {
  const [location, setLocationState] = useState<LocationData>(DEFAULT_LOCATION)
  const [detecting, setDetecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // localStorage'dan oku, yoksa GPS ile otomatik tespit et (mount)
  useEffect(() => {
    const stored = readFromStorage()
    if (stored) {
      setLocationState(stored)
      return
    }

    // Konum yoksa otomatik tespit: önce GPS, başarısız olursa IP fallback
    let cancelled = false
    async function autoDetect() {
      try {
        // GPS ile dene (kullanıcıdan izin ister)
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('no-geolocation'))
            return
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
          })
        })

        if (cancelled) return
        const { latitude, longitude } = position.coords

        // Reverse geocode ile şehir/ilçe al
        const res = await fetch(`/api/reverse-geocode?lat=${latitude}&lon=${longitude}`)
        const data = await res.json()
        if (cancelled) return

        if (data.success && data.city) {
          const locationData: LocationData = {
            city: data.city,
            district: data.district || '',
            lat: latitude,
            lon: longitude,
            isManuallySet: false,
            lastUpdated: new Date().toISOString(),
          }
          setLocationState(locationData)
          writeToStorage(locationData)
          window.dispatchEvent(new CustomEvent('tamirhanem-location-changed', { detail: locationData }))
          return
        }
      } catch {
        // GPS başarısız (izin reddedildi vs), IP fallback dene
      }

      // IP fallback
      try {
        if (cancelled) return
        const res = await fetch('/api/geolocation')
        const data = await res.json()
        if (cancelled) return
        if (data.success && data.city) {
          const locationData: LocationData = {
            city: data.city,
            district: data.district || '',
            lat: data.lat || null,
            lon: data.lon || null,
            isManuallySet: false,
            lastUpdated: new Date().toISOString(),
          }
          setLocationState(locationData)
          writeToStorage(locationData)
          window.dispatchEvent(new CustomEvent('tamirhanem-location-changed', { detail: locationData }))
        }
      } catch {
        // Sessizce başarısız ol
      }
    }
    autoDetect()
    return () => { cancelled = true }
  }, [])

  const setLocation = useCallback((data: Partial<LocationData> & { city: string }) => {
    const newLocation: LocationData = {
      ...DEFAULT_LOCATION,
      ...data,
      lastUpdated: new Date().toISOString(),
    }
    setLocationState(newLocation)
    writeToStorage(newLocation)
    // Diğer component'leri bilgilendir
    window.dispatchEvent(new CustomEvent('tamirhanem-location-changed', { detail: newLocation }))
  }, [])

  const clearLocation = useCallback(() => {
    setLocationState(DEFAULT_LOCATION)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
    window.dispatchEvent(new CustomEvent('tamirhanem-location-changed', { detail: DEFAULT_LOCATION }))
  }, [])

  const detectLocation = useCallback(async (): Promise<LocationData | null> => {
    setDetecting(true)
    setError(null)

    try {
      // Browser Geolocation API
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Tarayıcınız konum özelliğini desteklemiyor'))
          return
        }
        navigator.geolocation.getCurrentPosition(resolve, (err) => {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              reject(new Error('Konum izni reddedildi'))
              break
            case err.POSITION_UNAVAILABLE:
              reject(new Error('Konum bilgisi alınamadı'))
              break
            case err.TIMEOUT:
              reject(new Error('Konum tespiti zaman aşımına uğradı'))
              break
            default:
              reject(new Error('Konum tespit edilemedi'))
          }
        }, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 dakika cache
        })
      })

      const { latitude, longitude } = position.coords

      // Reverse geocode
      const res = await fetch(`/api/reverse-geocode?lat=${latitude}&lon=${longitude}`)
      const data = await res.json()

      if (data.success && data.city) {
        const locationData: LocationData = {
          city: data.city,
          district: data.district || '',
          lat: latitude,
          lon: longitude,
          isManuallySet: false,
          lastUpdated: new Date().toISOString(),
        }
        setLocationState(locationData)
        writeToStorage(locationData)
        window.dispatchEvent(new CustomEvent('tamirhanem-location-changed', { detail: locationData }))
        return locationData
      }

      // Fallback: IP bazlı tespit
      const fallbackRes = await fetch('/api/geolocation')
      const fallbackData = await fallbackRes.json()

      if (fallbackData.success && fallbackData.city) {
        const locationData: LocationData = {
          city: fallbackData.city,
          district: fallbackData.district || '',
          lat: fallbackData.lat || latitude,
          lon: fallbackData.lon || longitude,
          isManuallySet: false,
          lastUpdated: new Date().toISOString(),
        }
        setLocationState(locationData)
        writeToStorage(locationData)
        window.dispatchEvent(new CustomEvent('tamirhanem-location-changed', { detail: locationData }))
        return locationData
      }

      setError('Konum tespit edilemedi')
      return null
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Konum tespit edilemedi'
      setError(message)

      // Geolocation izni reddedilirse IP fallback dene
      try {
        const fallbackRes = await fetch('/api/geolocation')
        const fallbackData = await fallbackRes.json()
        if (fallbackData.success && fallbackData.city) {
          const locationData: LocationData = {
            city: fallbackData.city,
            district: fallbackData.district || '',
            lat: fallbackData.lat || null,
            lon: fallbackData.lon || null,
            isManuallySet: false,
            lastUpdated: new Date().toISOString(),
          }
          setLocationState(locationData)
          writeToStorage(locationData)
          window.dispatchEvent(new CustomEvent('tamirhanem-location-changed', { detail: locationData }))
          return locationData
        }
      } catch {}

      return null
    } finally {
      setDetecting(false)
    }
  }, [])

  // Diğer tab/component'lerden gelen değişiklikleri dinle
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<LocationData>).detail
      if (detail) setLocationState(detail)
    }
    window.addEventListener('tamirhanem-location-changed', handler)
    return () => window.removeEventListener('tamirhanem-location-changed', handler)
  }, [])

  return {
    location,
    detecting,
    error,
    hasLocation: !!location.city,
    setLocation,
    clearLocation,
    detectLocation,
  }
}
