import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';
import type {
  StrapiCollectionResponse,
  ChargingStationAttributes,
  ConnectorInfo,
  OCMStation,
  SerperPlacesResponse,
  SerperPlace,
} from '@/types/external-apis';

const logger = createLogger('API_EV_CHARGERS');

export const dynamic = 'force-dynamic';

// API URLs - env'den al veya varsayılan kullan
const STRAPI_URL = process.env.STRAPI_URL || 'https://api.tamirhanem.com';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const OCM_API_URL = 'https://api.openchargemap.io/v3/poi';
const OCM_API_KEY = process.env.OCM_API_KEY;

// Serper API Keys - Round Robin
const SERPER_API_KEYS = [
  process.env.SERPER_API_KEY,
  process.env.SERPER_API_KEY_2,
  process.env.SERPER_API_KEY_3,
  process.env.SERPER_API_KEY_4,
].filter(Boolean) as string[];

let currentKeyIndex = 0;

function getNextApiKey(): string {
  if (SERPER_API_KEYS.length === 0) {
    throw new Error('No Serper API keys configured');
  }
  const key = SERPER_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % SERPER_API_KEYS.length;
  return key;
}

// Haversine formula for distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Operator info interface
interface OperatorInfo {
  name: string;
  maxPowerKw: number;
  connectors: ConnectorInfo[];
  is24Hours: boolean;
}

// Known operators in Turkey
const OPERATOR_DATA: Record<string, OperatorInfo> = {
  'tesla': {
    name: 'Tesla',
    maxPowerKw: 250,
    connectors: [{ type: 'TESLA_SUPERCHARGER', typeName: 'Tesla Supercharger', powerKw: 250, quantity: 8 }],
    is24Hours: true,
  },
  'supercharger': {
    name: 'Tesla',
    maxPowerKw: 250,
    connectors: [{ type: 'TESLA_SUPERCHARGER', typeName: 'Tesla Supercharger', powerKw: 250, quantity: 8 }],
    is24Hours: true,
  },
  'zes': {
    name: 'ZES',
    maxPowerKw: 180,
    connectors: [
      { type: 'CCS2', typeName: 'CCS Type 2', powerKw: 180, quantity: 2 },
      { type: 'CHADEMO', typeName: 'CHAdeMO', powerKw: 50, quantity: 1 },
    ],
    is24Hours: true,
  },
  'esarj': {
    name: 'Eşarj',
    maxPowerKw: 60,
    connectors: [
      { type: 'CCS2', typeName: 'CCS Type 2', powerKw: 60, quantity: 1 },
      { type: 'TYPE2', typeName: 'Type 2', powerKw: 22, quantity: 2 },
    ],
    is24Hours: true,
  },
  'eşarj': {
    name: 'Eşarj',
    maxPowerKw: 60,
    connectors: [
      { type: 'CCS2', typeName: 'CCS Type 2', powerKw: 60, quantity: 1 },
      { type: 'TYPE2', typeName: 'Type 2', powerKw: 22, quantity: 2 },
    ],
    is24Hours: true,
  },
  'trugo': {
    name: 'Trugo',
    maxPowerKw: 180,
    connectors: [{ type: 'CCS2', typeName: 'CCS Type 2', powerKw: 180, quantity: 2 }],
    is24Hours: true,
  },
  'sharz': {
    name: 'Sharz',
    maxPowerKw: 22,
    connectors: [{ type: 'TYPE2', typeName: 'Type 2', powerKw: 22, quantity: 2 }],
    is24Hours: false,
  },
  'voltrun': {
    name: 'Voltrun',
    maxPowerKw: 120,
    connectors: [{ type: 'CCS2', typeName: 'CCS Type 2', powerKw: 120, quantity: 2 }],
    is24Hours: true,
  },
  'astor': {
    name: 'Astor',
    maxPowerKw: 60,
    connectors: [
      { type: 'CCS2', typeName: 'CCS Type 2', powerKw: 60, quantity: 1 },
      { type: 'TYPE2', typeName: 'Type 2', powerKw: 22, quantity: 1 },
    ],
    is24Hours: true,
  },
  'beefull': {
    name: 'Beefull',
    maxPowerKw: 180,
    connectors: [{ type: 'CCS2', typeName: 'CCS Type 2', powerKw: 180, quantity: 2 }],
    is24Hours: true,
  },
  'power': {
    name: 'Power Şarj',
    maxPowerKw: 60,
    connectors: [
      { type: 'CCS2', typeName: 'CCS Type 2', powerKw: 60, quantity: 1 },
      { type: 'TYPE2', typeName: 'Type 2', powerKw: 22, quantity: 2 },
    ],
    is24Hours: true,
  },
  'togg': {
    name: 'Togg Trugo',
    maxPowerKw: 180,
    connectors: [{ type: 'CCS2', typeName: 'CCS Type 2', powerKw: 180, quantity: 4 }],
    is24Hours: true,
  },
  'aksaenerji': {
    name: 'Aksa Enerji',
    maxPowerKw: 60,
    connectors: [
      { type: 'CCS2', typeName: 'CCS Type 2', powerKw: 60, quantity: 1 },
      { type: 'TYPE2', typeName: 'Type 2', powerKw: 22, quantity: 1 },
    ],
    is24Hours: true,
  },
  'petrol ofisi': {
    name: 'Petrol Ofisi',
    maxPowerKw: 60,
    connectors: [
      { type: 'CCS2', typeName: 'CCS Type 2', powerKw: 60, quantity: 1 },
      { type: 'CHADEMO', typeName: 'CHAdeMO', powerKw: 50, quantity: 1 },
    ],
    is24Hours: true,
  },
  'shell': {
    name: 'Shell Recharge',
    maxPowerKw: 150,
    connectors: [{ type: 'CCS2', typeName: 'CCS Type 2', powerKw: 150, quantity: 2 }],
    is24Hours: true,
  },
  'bp': {
    name: 'BP Pulse',
    maxPowerKw: 150,
    connectors: [{ type: 'CCS2', typeName: 'CCS Type 2', powerKw: 150, quantity: 2 }],
    is24Hours: true,
  },
};

const DEFAULT_OPERATOR: OperatorInfo = {
  name: 'Şarj İstasyonu',
  maxPowerKw: 22,
  connectors: [{ type: 'TYPE2', typeName: 'Type 2', powerKw: 22, quantity: 2 }],
  is24Hours: false,
};

function detectOperator(name: string, category?: string): OperatorInfo & { operatorName: string } {
  const searchText = `${name} ${category || ''}`.toLowerCase();

  for (const [key, info] of Object.entries(OPERATOR_DATA)) {
    if (searchText.includes(key.toLowerCase())) {
      return { ...info, operatorName: info.name };
    }
  }

  if (searchText.includes('hızlı') || searchText.includes('fast') || searchText.includes('dc')) {
    return {
      ...DEFAULT_OPERATOR,
      operatorName: 'Hızlı Şarj',
      maxPowerKw: 50,
      connectors: [
        { type: 'CCS2', typeName: 'CCS Type 2', powerKw: 50, quantity: 1 },
        { type: 'TYPE2', typeName: 'Type 2', powerKw: 22, quantity: 1 },
      ],
    };
  }

  return { ...DEFAULT_OPERATOR, operatorName: '' };
}

function parseIs24Hours(hours: string | null): boolean | null {
  if (!hours) return null;
  const lowerHours = hours.toLowerCase();
  if (lowerHours.includes('24 saat') || lowerHours.includes('24/7') || lowerHours.includes('always open')) {
    return true;
  }
  if (lowerHours.includes('kapalı') || lowerHours.includes('closed')) {
    return false;
  }
  return null;
}

// Cache duration - 6 hours
const CACHE_DURATION_HOURS = 6;

// ========== STRAPI FUNCTIONS ==========

interface ChargingStationResult {
  id: number;
  name: string;
  address: string | null;
  rating: number | null;
  reviewCount: number;
  phone: string | null;
  website: string | null;
  hours: string | null;
  latitude: number | null;
  longitude: number | null;
  category: string;
  thumbnail: string | null;
  cid: string | null;
  operatorName: string | null;
  maxPowerKw: number | null;
  connectors: ConnectorInfo[];
  is24Hours: boolean;
  isPublic: boolean;
  usageCost: string | null;
  source: string;
  distance?: number | null;
}

async function getStationsFromStrapi(city: string): Promise<ChargingStationResult[] | null> {
  try {
    const cacheTime = new Date(Date.now() - CACHE_DURATION_HOURS * 60 * 60 * 1000).toISOString();

    const params = new URLSearchParams({
      'filters[city][$eq]': city,
      'filters[updatedAt][$gte]': cacheTime,
      'pagination[pageSize]': '100',
      'sort': 'name:asc',
    });

    const response = await fetch(`${STRAPI_URL}/api/sarj-istasyonlaris?${params}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      next: { revalidate: 60 }, // Revalidate every minute
    });

    if (!response.ok) {
      logger.error({ status: response.status, text: await response.text() }, 'Strapi fetch error');
      return null;
    }

    const data: StrapiCollectionResponse<ChargingStationAttributes> = await response.json();
    const stations = data.data || [];

    if (stations.length > 0) {
      logger.info(`Strapi cache hit: ${stations.length} istasyon (${city})`);
      return stations.map((s): ChargingStationResult => ({
        id: s.id,
        name: s.attributes.name,
        address: s.attributes.address,
        rating: s.attributes.rating,
        reviewCount: s.attributes.reviewCount || 0,
        phone: s.attributes.phone,
        website: s.attributes.website,
        hours: s.attributes.openingHours,
        latitude: s.attributes.latitude,
        longitude: s.attributes.longitude,
        category: 'Elektrikli Araç Şarj İstasyonu',
        thumbnail: s.attributes.thumbnail,
        cid: s.attributes.externalId,
        operatorName: s.attributes.operatorName,
        maxPowerKw: s.attributes.maxPowerKw,
        connectors: typeof s.attributes.connectors === 'string'
          ? JSON.parse(s.attributes.connectors)
          : s.attributes.connectors || [],
        is24Hours: s.attributes.is24Hours,
        isPublic: s.attributes.isPublic,
        usageCost: null,
        source: s.attributes.source,
      }));
    }

    return null;
  } catch (error) {
    logger.error({ error }, 'Strapi query error');
    return null;
  }
}

async function saveStationsToStrapi(stations: ChargingStationResult[], city: string): Promise<void> {
  try {
    logger.info(`[Strapi Save] Başlıyor: ${stations.length} istasyon, şehir: ${city}, URL: ${STRAPI_URL}`);
    logger.debug(`[Strapi Save] Token mevcut: ${STRAPI_TOKEN ? 'EVET (' + STRAPI_TOKEN.substring(0, 10) + '...)' : 'HAYIR'}`);

    // First, delete old entries for this city
    const deleteParams = new URLSearchParams({
      'filters[city][$eq]': city,
    });

    const existingResponse = await fetch(`${STRAPI_URL}/api/sarj-istasyonlaris?${deleteParams}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
    });

    if (existingResponse.ok) {
      const existingData: StrapiCollectionResponse<ChargingStationAttributes> = await existingResponse.json();
      const existingStations = existingData.data || [];
      logger.info(`[Strapi Save] ${existingStations.length} eski kayıt siliniyor`);

      // Delete old entries
      for (const station of existingStations) {
        await fetch(`${STRAPI_URL}/api/sarj-istasyonlaris/${station.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
          },
        });
      }
    } else {
      logger.error(`[Strapi Save] Eski kayıtlar alınamadı: ${existingResponse.status}`);
    }

    // Save new stations
    let savedCount = 0;
    for (const station of stations) {
      // Koordinatları tam hassasiyetle sakla
      const lat = station.latitude ? parseFloat(String(station.latitude)) : null;
      const lng = station.longitude ? parseFloat(String(station.longitude)) : null;

      const strapiData = {
        data: {
          externalId: station.cid || null,
          name: station.name,
          operatorName: station.operatorName || null,
          address: station.address || null,
          city: city,
          district: extractDistrict(station.address),
          latitude: lat,
          longitude: lng,
          maxPowerKw: station.maxPowerKw || null,
          connectors: JSON.stringify(station.connectors || []),
          is24Hours: station.is24Hours || false,
          isPublic: station.isPublic !== false,
          rating: station.rating || null,
          reviewCount: station.reviewCount || 0,
          phone: station.phone || null,
          website: station.website || null,
          openingHours: station.hours || null,
          thumbnail: station.thumbnail || null,
          source: station.source || 'SERPER',
        },
      };

      const saveUrl = `${STRAPI_URL}/api/sarj-istasyonlaris`;
      if (savedCount === 0) {
        logger.debug(`[Strapi Save] POST URL: ${saveUrl}`);
        logger.debug(`[Strapi Save] POST Body: ${JSON.stringify(strapiData).substring(0, 300)}`);
      }
      const saveResponse = await fetch(saveUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
        },
        body: JSON.stringify(strapiData),
      });

      const responseText = await saveResponse.text();
      if (savedCount === 0) {
        logger.debug(`[Strapi Save] Response Status: ${saveResponse.status}, OK: ${saveResponse.ok}`);
        logger.debug(`[Strapi Save] Response: ${responseText.substring(0, 300)}`);
      }
      if (saveResponse.ok) {
        savedCount++;
      } else {
        logger.error(`[Strapi Save] Kayıt hatası: ${saveResponse.status} - ${responseText}`);
      }
    }

    logger.info(`[Strapi Save] ${savedCount}/${stations.length} istasyon kaydedildi (${city})`);
  } catch (error) {
    logger.error({ error }, '[Strapi Save] Hata');
  }
}

function extractDistrict(address: string | null): string | null {
  if (!address) return null;
  const parts = address.split(',').map((p) => p.trim());
  if (parts.length >= 2) {
    return parts[parts.length - 2];
  }
  return null;
}

// ========== OCM FUNCTIONS ==========

// OCM connector type mapping
const OCM_CONNECTOR_MAP: Record<number, { type: string; typeName: string }> = {
  1: { type: 'TYPE1', typeName: 'Type 1 (J1772)' },
  2: { type: 'CHADEMO', typeName: 'CHAdeMO' },
  25: { type: 'TYPE2', typeName: 'Type 2 (Mennekes)' },
  27: { type: 'TESLA_SUPERCHARGER', typeName: 'Tesla Supercharger' },
  30: { type: 'TESLA_DESTINATION', typeName: 'Tesla Destination' },
  32: { type: 'CCS1', typeName: 'CCS Type 1' },
  33: { type: 'CCS2', typeName: 'CCS Type 2' },
  36: { type: 'TYPE2_COMBO', typeName: 'Type 2 Combo' },
};

async function getStationsFromOCM(lat: number, lng: number, city: string): Promise<ChargingStationResult[] | null> {
  try {
    // Turkey country code is 223
    const params = new URLSearchParams({
      output: 'json',
      countrycode: 'TR',
      maxresults: '100',
      compact: 'true',
      verbose: 'false',
    });

    // If we have coordinates, search nearby
    if (lat && lng) {
      params.set('latitude', lat.toString());
      params.set('longitude', lng.toString());
      params.set('distance', '50'); // 50 km radius
      params.set('distanceunit', 'km');
    }

    if (OCM_API_KEY) {
      params.set('key', OCM_API_KEY);
    }

    const response = await fetch(`${OCM_API_URL}?${params}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      logger.error({ status: response.status }, 'OCM fetch error');
      return null;
    }

    const ocmStations: OCMStation[] = await response.json();

    if (!Array.isArray(ocmStations) || ocmStations.length === 0) {
      logger.info('OCM: No stations found');
      return null;
    }

    logger.info(`OCM: ${ocmStations.length} istasyon bulundu`);

    return ocmStations.map((station, index): ChargingStationResult => {
      const connections = station.Connections || [];
      const maxPower = Math.max(...connections.map((c) => c.PowerKW || 0), 0);

      const connectors: ConnectorInfo[] = connections.map((c) => {
        const connectorType = OCM_CONNECTOR_MAP[c.ConnectionTypeID] || { type: 'UNKNOWN', typeName: 'Unknown' };
        return {
          type: connectorType.type,
          typeName: connectorType.typeName,
          powerKw: c.PowerKW || 0,
          quantity: c.Quantity || 1,
        };
      });

      const addressInfo = station.AddressInfo;
      const operatorInfo = station.OperatorInfo;

      return {
        id: station.ID || index + 1,
        name: addressInfo.Title || operatorInfo?.Title || 'Şarj İstasyonu',
        address: [addressInfo.AddressLine1, addressInfo.Town, addressInfo.StateOrProvince]
          .filter(Boolean)
          .join(', '),
        rating: station.UserComments?.length && station.UserComments.length > 0
          ? station.UserComments.reduce((sum, c) => sum + (c.Rating || 0), 0) / station.UserComments.length
          : null,
        reviewCount: station.UserComments?.length || 0,
        phone: addressInfo.ContactTelephone1 || null,
        website: operatorInfo?.WebsiteURL || null,
        hours: station.StatusType?.IsOperational ? '24 saat açık' : null,
        latitude: addressInfo.Latitude,
        longitude: addressInfo.Longitude,
        category: 'Elektrikli Araç Şarj İstasyonu',
        thumbnail: null,
        cid: `ocm-${station.ID}`,
        operatorName: operatorInfo?.Title || null,
        maxPowerKw: maxPower || 22,
        connectors: connectors.length > 0 ? connectors : DEFAULT_OPERATOR.connectors,
        is24Hours: station.StatusType?.IsOperational || false,
        isPublic: station.UsageType?.IsPayAtLocation !== false,
        usageCost: null,
        source: 'OCM',
      };
    });
  } catch (error) {
    logger.error({ error }, 'OCM query error');
    return null;
  }
}

// ========== SERPER FUNCTIONS ==========

async function getStationsFromSerper(lat: string | null, lng: string | null, city: string): Promise<ChargingStationResult[] | null> {
  try {
    const apiKey = getNextApiKey();

    let query = 'elektrikli araç şarj istasyonu';
    if (lat && lng) {
      query += ' yakınında';
    } else if (city) {
      query += ` ${city}`;
    }

    const response = await fetch('https://google.serper.dev/places', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        gl: 'tr',
        hl: 'tr',
        num: 50,
        ...(lat && lng && { location: `${lat},${lng}` }),
      }),
    });

    if (!response.ok) {
      logger.error({ status: response.status }, 'Serper API error');
      return null;
    }

    const data: SerperPlacesResponse = await response.json();
    const places = data.places || [];

    if (places.length === 0) {
      return null;
    }

    logger.info(`Serper: ${places.length} istasyon bulundu (${city})`);

    return places.map((place, index): ChargingStationResult => {
      const operatorInfo = detectOperator(place.title || '', place.category);
      const is24HoursFromHours = parseIs24Hours(place.openingHours ?? null);

      return {
        id: index + 1,
        name: place.title || 'Şarj İstasyonu',
        address: place.address || '',
        rating: place.rating || null,
        reviewCount: place.ratingCount || 0,
        phone: place.phoneNumber || null,
        website: place.website || null,
        hours: place.openingHours || null,
        latitude: place.latitude || null,
        longitude: place.longitude || null,
        category: place.category || 'Elektrikli Araç Şarj İstasyonu',
        thumbnail: place.thumbnailUrl || null,
        cid: place.cid || null,
        operatorName: operatorInfo.operatorName || null,
        maxPowerKw: operatorInfo.maxPowerKw,
        connectors: operatorInfo.connectors,
        is24Hours: is24HoursFromHours !== null ? is24HoursFromHours : operatorInfo.is24Hours,
        isPublic: true,
        usageCost: null,
        source: 'SERPER',
      };
    });
  } catch (error) {
    logger.error({ error }, 'Serper query error');
    return null;
  }
}

// ========== MAIN API HANDLER ==========

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const city = searchParams.get('city') || 'Istanbul';
    const forceRefresh = searchParams.get('refresh') === 'true';
    const userLat = parseFloat(lat || '0');
    const userLng = parseFloat(lng || '0');

    let stations: ChargingStationResult[] | null = null;
    let source = 'unknown';

    // 1. First, try Strapi (cache)
    if (!forceRefresh) {
      stations = await getStationsFromStrapi(city);
      if (stations && stations.length > 0) {
        source = 'strapi_cache';
      }
    }

    // 2. If no cache, try OCM
    if (!stations || stations.length === 0) {
      stations = await getStationsFromOCM(userLat, userLng, city);
      if (stations && stations.length > 0) {
        source = 'ocm';
      }
    }

    // 3. If OCM fails, try Serper
    if (!stations || stations.length === 0) {
      stations = await getStationsFromSerper(lat, lng, city);
      if (stations && stations.length > 0) {
        source = 'serper';
      }
    }

    // If we got data from OCM or Serper, save to Strapi
    if (stations && stations.length > 0 && (source === 'ocm' || source === 'serper')) {
      saveStationsToStrapi(stations, city).catch((err) => {
        logger.error({ error: err }, 'Background Strapi save error');
      });
    }

    // Calculate distances if we have user location
    if (stations && userLat && userLng) {
      stations = stations.map((station) => {
        let distance = null;
        if (station.latitude && station.longitude) {
          distance = calculateDistance(userLat, userLng, station.latitude, station.longitude);
        }
        return { ...station, distance: distance ? Math.round(distance * 10) / 10 : null };
      });

      // Sort by distance
      stations.sort((a, b) => {
        if (a.distance == null) return 1;
        if (b.distance == null) return -1;
        return a.distance - b.distance;
      });
    }

    if (!stations || stations.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No charging stations found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        stations,
        total: stations.length,
        query: `elektrikli araç şarj istasyonu ${city}`,
        userLocation: userLat && userLng ? { lat: userLat, lng: userLng } : null,
        source,
      },
    });
  } catch (error) {
    logger.error({ error }, 'EV Chargers API error');
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
