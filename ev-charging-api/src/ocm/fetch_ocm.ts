import axios from 'axios';
import { env, createLogger } from '../utils';
import { prisma } from '../db/client';
import type { OCMStation, OCMFetchOptions } from './types';

const logger = createLogger('ocm-fetch');

const OCM_BASE_URL = env.OCM_API_URL;

export async function fetchOCMStations(options: OCMFetchOptions = {}): Promise<OCMStation[]> {
  const {
    countryCode = 'TR',
    maxResults = 10000,
    compact = false,
    verbose = true,
  } = options;

  logger.info({ countryCode, maxResults }, 'Fetching stations from OpenChargeMap');

  try {
    const params: Record<string, string | number | boolean> = {
      key: env.OCM_API_KEY,
      countrycode: countryCode,
      maxresults: maxResults,
      compact: compact,
      verbose: verbose,
      output: 'json',
    };

    if (options.latitude && options.longitude) {
      params.latitude = options.latitude;
      params.longitude = options.longitude;
      if (options.distanceKm) {
        params.distance = options.distanceKm;
        params.distanceunit = 'km';
      }
    }

    const response = await axios.get<OCMStation[]>(`${OCM_BASE_URL}/poi`, { params });

    logger.info({ count: response.data.length }, 'Fetched stations from OCM');
    return response.data;
  } catch (error) {
    logger.error({ error }, 'Failed to fetch from OCM');
    throw error;
  }
}

export async function saveRawStations(stations: OCMStation[]): Promise<number> {
  logger.info({ count: stations.length }, 'Saving raw stations to database');

  let savedCount = 0;
  const errors: Array<{ ocmId: number; error: string }> = [];

  for (const station of stations) {
    try {
      await prisma.stationsRaw.upsert({
        where: { ocmId: station.ID },
        create: {
          ocmId: station.ID,
          rawData: station as any,
          fetchedAt: new Date(),
        },
        update: {
          rawData: station as any,
          fetchedAt: new Date(),
          processedAt: null,
        },
      });
      savedCount++;
    } catch (error: any) {
      errors.push({ ocmId: station.ID, error: error.message });
    }
  }

  if (errors.length > 0) {
    logger.warn({ errorCount: errors.length }, 'Some stations failed to save');
  }

  logger.info({ savedCount, failedCount: errors.length }, 'Raw stations saved');
  return savedCount;
}

export async function fetchAndSaveRaw(options: OCMFetchOptions = {}): Promise<{
  fetched: number;
  saved: number;
}> {
  const stations = await fetchOCMStations(options);
  const saved = await saveRawStations(stations);
  return { fetched: stations.length, saved };
}
