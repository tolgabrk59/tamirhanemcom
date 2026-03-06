import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';
import { Prisma } from '@prisma/client';
import { createLogger } from '../utils';

const logger = createLogger('routes');
const router = Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all stations with filtering
router.get('/stations', async (req: Request, res: Response) => {
  try {
    const {
      city,
      district,
      lat,
      lng,
      radius = '50', // km
      status,
      connectorType,
      minPower,
      maxPower,
      is24Hours,
      limit = '50',
      offset = '0',
    } = req.query;

    const where: Prisma.StationsWhereInput = {};

    if (city) where.city = city as string;
    if (district) where.district = district as string;
    if (status) where.status = status as any;
    if (is24Hours === 'true') where.is24Hours = true;
    if (minPower) where.maxPowerKw = { gte: parseFloat(minPower as string) };
    if (maxPower) where.maxPowerKw = { ...where.maxPowerKw as any, lte: parseFloat(maxPower as string) };

    // Connector type filter (JSON array contains)
    if (connectorType) {
      where.connectors = {
        array_contains: [{ type: connectorType }],
      };
    }

    let stations = await prisma.stations.findMany({
      where,
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { name: 'asc' },
    });

    // If lat/lng provided, calculate distances and filter/sort
    if (lat && lng) {
      const userLat = parseFloat(lat as string);
      const userLng = parseFloat(lng as string);
      const maxRadius = parseFloat(radius as string);

      stations = stations
        .map(station => ({
          ...station,
          distance: calculateDistance(userLat, userLng, station.latitude, station.longitude),
        }))
        .filter(s => s.distance <= maxRadius)
        .sort((a, b) => a.distance - b.distance);
    }

    const total = await prisma.stations.count({ where });

    res.json({
      success: true,
      data: {
        stations,
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch stations');
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get station by ID
router.get('/stations/:id', async (req: Request, res: Response) => {
  try {
    const station = await prisma.stations.findUnique({
      where: { id: req.params.id },
      include: {
        enrichment: true,
        verifications: {
          orderBy: { verifiedAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!station) {
      return res.status(404).json({ success: false, error: 'Station not found' });
    }

    res.json({ success: true, data: station });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch station');
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get nearby stations
router.get('/stations/nearby', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = '10', limit = '20' } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: 'lat and lng are required' });
    }

    const userLat = parseFloat(lat as string);
    const userLng = parseFloat(lng as string);
    const maxRadius = parseFloat(radius as string);
    const maxResults = parseInt(limit as string);

    // Bounding box filter first (rough filter)
    const latDelta = maxRadius / 111; // ~111 km per degree
    const lngDelta = maxRadius / (111 * Math.cos(userLat * Math.PI / 180));

    const stations = await prisma.stations.findMany({
      where: {
        latitude: { gte: userLat - latDelta, lte: userLat + latDelta },
        longitude: { gte: userLng - lngDelta, lte: userLng + lngDelta },
        status: 'OPERATIONAL',
      },
    });

    // Calculate actual distances and filter
    const nearbyStations = stations
      .map(station => ({
        ...station,
        distance: calculateDistance(userLat, userLng, station.latitude, station.longitude),
      }))
      .filter(s => s.distance <= maxRadius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxResults);

    res.json({
      success: true,
      data: {
        stations: nearbyStations,
        total: nearbyStations.length,
        center: { lat: userLat, lng: userLng },
        radius: maxRadius,
      },
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch nearby stations');
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get available cities
router.get('/cities', async (req: Request, res: Response) => {
  try {
    const cities = await prisma.stations.groupBy({
      by: ['city'],
      _count: { city: true },
      where: { city: { not: null } },
      orderBy: { _count: { city: 'desc' } },
    });

    res.json({
      success: true,
      data: cities.map(c => ({
        name: c.city,
        count: c._count.city,
      })),
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch cities');
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get connector types statistics
router.get('/stats/connectors', async (req: Request, res: Response) => {
  try {
    const stations = await prisma.stations.findMany({
      select: { connectors: true },
    });

    const connectorCounts: Record<string, number> = {};

    for (const station of stations) {
      const connectors = station.connectors as any[];
      for (const conn of connectors) {
        const type = conn.type || 'OTHER';
        connectorCounts[type] = (connectorCounts[type] || 0) + (conn.quantity || 1);
      }
    }

    res.json({
      success: true,
      data: connectorCounts,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch connector stats');
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Sync log
router.get('/sync/logs', async (req: Request, res: Response) => {
  try {
    const logs = await prisma.syncLog.findMany({
      orderBy: { startedAt: 'desc' },
      take: 20,
    });

    res.json({ success: true, data: logs });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch sync logs');
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Haversine distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal
}

export default router;
