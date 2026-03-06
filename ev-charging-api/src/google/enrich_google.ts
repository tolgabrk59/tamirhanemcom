import axios from 'axios';
import { Prisma, VerifiedSource } from '@prisma/client';
import { env, createLogger } from '../utils';
import { prisma } from '../db/client';

const logger = createLogger('google-enrich');

const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place';

interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  opening_hours?: {
    open_now?: boolean;
    periods?: Array<{
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }>;
    weekday_text?: string[];
  };
  price_level?: number;
  rating?: number;
  user_ratings_total?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  geometry?: {
    location: { lat: number; lng: number };
  };
}

// Search for a charging station on Google Places
async function searchPlace(
  name: string,
  lat: number,
  lng: number
): Promise<GooglePlaceResult | null> {
  try {
    const searchResponse = await axios.get(`${GOOGLE_PLACES_URL}/nearbysearch/json`, {
      params: {
        key: env.GOOGLE_PLACES_API_KEY,
        location: `${lat},${lng}`,
        radius: 100, // 100 meters radius
        keyword: 'electric vehicle charging station',
      },
    });

    if (searchResponse.data.results?.length > 0) {
      // Get the first match
      const placeId = searchResponse.data.results[0].place_id;
      return await getPlaceDetails(placeId);
    }

    // Try text search as fallback
    const textResponse = await axios.get(`${GOOGLE_PLACES_URL}/textsearch/json`, {
      params: {
        key: env.GOOGLE_PLACES_API_KEY,
        query: `${name} şarj istasyonu`,
        location: `${lat},${lng}`,
        radius: 500,
      },
    });

    if (textResponse.data.results?.length > 0) {
      const placeId = textResponse.data.results[0].place_id;
      return await getPlaceDetails(placeId);
    }

    return null;
  } catch (error: any) {
    logger.error({ error: error.message, name, lat, lng }, 'Failed to search place');
    return null;
  }
}

// Get place details from Google
async function getPlaceDetails(placeId: string): Promise<GooglePlaceResult | null> {
  try {
    const response = await axios.get(`${GOOGLE_PLACES_URL}/details/json`, {
      params: {
        key: env.GOOGLE_PLACES_API_KEY,
        place_id: placeId,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'formatted_phone_number',
          'international_phone_number',
          'website',
          'opening_hours',
          'price_level',
          'rating',
          'user_ratings_total',
          'photos',
          'geometry',
        ].join(','),
      },
    });

    if (response.data.result) {
      return response.data.result;
    }
    return null;
  } catch (error: any) {
    logger.error({ error: error.message, placeId }, 'Failed to get place details');
    return null;
  }
}

// Delay helper
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Enrich a single station
export async function enrichStation(stationId: string): Promise<boolean> {
  const station = await prisma.stations.findUnique({
    where: { id: stationId },
    include: { enrichment: true },
  });

  if (!station) {
    logger.warn({ stationId }, 'Station not found');
    return false;
  }

  // Skip if recently enriched (within 7 days)
  if (station.enrichment?.lastCheckedAt) {
    const daysSinceCheck = (Date.now() - station.enrichment.lastCheckedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCheck < 7) {
      logger.debug({ stationId }, 'Station recently enriched, skipping');
      return true;
    }
  }

  const googlePlace = await searchPlace(
    station.name,
    station.latitude,
    station.longitude
  );

  if (!googlePlace) {
    // Update enrichment to mark as checked but not found
    await prisma.stationsEnriched.upsert({
      where: { stationId },
      create: {
        stationId,
        existsOnGoogle: false,
        lastCheckedAt: new Date(),
      },
      update: {
        existsOnGoogle: false,
        lastCheckedAt: new Date(),
      },
    });
    return false;
  }

  // Store ONLY enrichment data (what OCM lacks)
  const enrichmentUpdateData: Prisma.StationsEnrichedUpdateInput = {
    googlePlaceId: googlePlace.place_id,
    existsOnGoogle: true,
    lastCheckedAt: new Date(),
    // Only store if OCM doesn't have it
    openingHours: googlePlace.opening_hours ? {
      periods: googlePlace.opening_hours.periods || [],
      weekdayText: googlePlace.opening_hours.weekday_text || [],
      openNow: googlePlace.opening_hours.open_now,
    } : undefined,
    priceLevel: googlePlace.price_level ?? undefined,
    phoneNumber: station.phoneNumber ? undefined : googlePlace.formatted_phone_number,
    website: station.website ? undefined : googlePlace.website,
    photos: googlePlace.photos?.slice(0, 5).map(p => ({
      reference: p.photo_reference,
      width: p.width,
      height: p.height,
    })),
  };

  await prisma.stationsEnriched.upsert({
    where: { stationId },
    create: {
      stationId,
      googlePlaceId: googlePlace.place_id,
      existsOnGoogle: true,
      lastCheckedAt: new Date(),
      openingHours: googlePlace.opening_hours ? {
        periods: googlePlace.opening_hours.periods || [],
        weekdayText: googlePlace.opening_hours.weekday_text || [],
        openNow: googlePlace.opening_hours.open_now,
      } : undefined,
      priceLevel: googlePlace.price_level ?? undefined,
      phoneNumber: station.phoneNumber ? undefined : googlePlace.formatted_phone_number,
      website: station.website ? undefined : googlePlace.website,
      photos: googlePlace.photos?.slice(0, 5).map(p => ({
        reference: p.photo_reference,
        width: p.width,
        height: p.height,
      })),
    },
    update: enrichmentUpdateData,
  });

  // Update main station with enriched data (ONLY missing fields)
  const stationUpdate: Prisma.StationsUpdateInput = {
    verifiedSource: VerifiedSource.OCM_GOOGLE,
    lastSyncedAt: new Date(),
  };

  // Only update if station is missing this data
  if (!station.openingHours && googlePlace.opening_hours) {
    stationUpdate.openingHours = {
      periods: googlePlace.opening_hours.periods || [],
      weekdayText: googlePlace.opening_hours.weekday_text || [],
    };
    stationUpdate.is24Hours = googlePlace.opening_hours.periods?.some(
      p => p.open.time === '0000' && (!p.close || p.close.time === '0000')
    ) || false;
  }

  if (!station.phoneNumber && googlePlace.formatted_phone_number) {
    stationUpdate.phoneNumber = googlePlace.formatted_phone_number;
  }

  if (!station.website && googlePlace.website) {
    stationUpdate.website = googlePlace.website;
  }

  // Update rating if Google has more reviews
  if (googlePlace.user_ratings_total && googlePlace.user_ratings_total > station.reviewCount) {
    stationUpdate.rating = googlePlace.rating || station.rating;
    stationUpdate.reviewCount = googlePlace.user_ratings_total;
  }

  await prisma.stations.update({
    where: { id: stationId },
    data: stationUpdate,
  });

  logger.info({ stationId, placeId: googlePlace.place_id }, 'Station enriched from Google');
  return true;
}

// Batch enrich stations
export async function enrichStations(options: {
  limit?: number;
  onlyMissing?: boolean;
} = {}): Promise<{
  processed: number;
  enriched: number;
  notFound: number;
}> {
  const { limit = 100, onlyMissing = true } = options;

  logger.info({ limit, onlyMissing }, 'Starting batch enrichment');

  // Find stations to enrich
  const whereClause: Prisma.StationsWhereInput = {};

  if (onlyMissing) {
    whereClause.OR = [
      { openingHours: { equals: Prisma.DbNull } },
      { phoneNumber: null },
      { is24Hours: null },
    ];
    whereClause.enrichment = null;
  }

  const stations = await prisma.stations.findMany({
    where: whereClause,
    take: limit,
    orderBy: { createdAt: 'asc' },
  });

  logger.info({ count: stations.length }, 'Found stations to enrich');

  let enriched = 0;
  let notFound = 0;

  for (const station of stations) {
    const success = await enrichStation(station.id);
    if (success) {
      enriched++;
    } else {
      notFound++;
    }

    // Rate limiting
    await delay(env.ENRICHMENT_DELAY_MS);
  }

  logger.info({ processed: stations.length, enriched, notFound }, 'Batch enrichment complete');

  return {
    processed: stations.length,
    enriched,
    notFound,
  };
}
