import { Prisma, StationStatus, ConnectorType, ChargingLevel, VerifiedSource } from '@prisma/client';
import { prisma } from '../db/client';
import { createLogger } from '../utils';
import type { OCMStation, OCMConnection } from './types';

const logger = createLogger('ocm-normalizer');

// Map OCM status to our enum
function mapStatus(statusTypeId?: number, isOperational?: boolean): StationStatus {
  if (isOperational === true) return StationStatus.OPERATIONAL;
  if (isOperational === false) return StationStatus.NON_OPERATIONAL;

  switch (statusTypeId) {
    case 0: return StationStatus.UNKNOWN;
    case 10: return StationStatus.PLANNED;
    case 20: return StationStatus.UNDER_CONSTRUCTION;
    case 30: return StationStatus.TEMPORARILY_UNAVAILABLE;
    case 50: return StationStatus.OPERATIONAL;
    case 75: return StationStatus.NON_OPERATIONAL;
    case 100: return StationStatus.NON_OPERATIONAL;
    case 150: return StationStatus.NON_OPERATIONAL;
    case 200: return StationStatus.NON_OPERATIONAL;
    default: return StationStatus.UNKNOWN;
  }
}

// Map OCM connection type to our enum
function mapConnectorType(connectionTypeId: number): ConnectorType {
  const mapping: Record<number, ConnectorType> = {
    1: ConnectorType.TYPE1,              // J1772
    2: ConnectorType.CHADEMO,
    25: ConnectorType.TYPE2,             // Mennekes
    27: ConnectorType.TESLA_SUPERCHARGER,
    28: ConnectorType.TESLA_DESTINATION,
    30: ConnectorType.TESLA_SUPERCHARGER, // Tesla (Model S/X)
    32: ConnectorType.CCS1,              // SAE Combo DC
    33: ConnectorType.CCS2,              // CCS (Type 2)
    36: ConnectorType.NACS,              // Tesla NACS
    1036: ConnectorType.GB_T,            // GB/T
    13: ConnectorType.SCHUKO,            // Type F Schuko
  };
  return mapping[connectionTypeId] || ConnectorType.OTHER;
}

// Determine charging level from power
function determineChargingLevel(powerKw?: number, isFastCharge?: boolean): ChargingLevel {
  if (!powerKw) {
    return isFastCharge ? ChargingLevel.LEVEL3_DC : ChargingLevel.LEVEL2;
  }
  if (powerKw < 3.7) return ChargingLevel.LEVEL1;
  if (powerKw <= 22) return ChargingLevel.LEVEL2;
  if (powerKw <= 150) return ChargingLevel.LEVEL3_DC;
  return ChargingLevel.LEVEL4_DC;
}

// Normalize connectors
function normalizeConnectors(connections: OCMConnection[]): Prisma.JsonValue {
  return connections.map(conn => ({
    type: mapConnectorType(conn.ConnectionTypeID),
    typeName: conn.ConnectionType?.Title || 'Unknown',
    powerKw: conn.PowerKW || null,
    voltage: conn.Voltage || null,
    amps: conn.Amps || null,
    quantity: conn.Quantity || 1,
    level: determineChargingLevel(conn.PowerKW, conn.Level?.IsFastChargeCapable),
    isOperational: conn.StatusType?.IsOperational ?? true,
  }));
}

// Calculate max power from connections
function calculateMaxPower(connections: OCMConnection[]): number | null {
  const powers = connections
    .map(c => c.PowerKW)
    .filter((p): p is number => p !== null && p !== undefined);
  return powers.length > 0 ? Math.max(...powers) : null;
}

// Normalize a single OCM station
export function normalizeStation(raw: OCMStation): Prisma.StationsCreateInput {
  const connectors = normalizeConnectors(raw.Connections || []);
  const maxPower = calculateMaxPower(raw.Connections || []);
  const primaryLevel = raw.Connections?.[0]?.Level;

  return {
    ocmId: raw.ID,
    name: raw.AddressInfo?.Title || `Station #${raw.ID}`,
    operatorName: raw.OperatorInfo?.Title || null,
    operatorId: raw.OperatorID?.toString() || null,

    address: [
      raw.AddressInfo?.AddressLine1,
      raw.AddressInfo?.AddressLine2,
      raw.AddressInfo?.Town,
    ].filter(Boolean).join(', ') || 'Unknown Address',
    city: raw.AddressInfo?.Town || null,
    district: raw.AddressInfo?.StateOrProvince || null,
    postalCode: raw.AddressInfo?.Postcode || null,
    country: raw.AddressInfo?.Country?.ISOCode || 'TR',
    latitude: raw.AddressInfo?.Latitude,
    longitude: raw.AddressInfo?.Longitude,

    status: mapStatus(raw.StatusTypeID, raw.StatusType?.IsOperational),
    totalConnectors: raw.NumberOfPoints || raw.Connections?.length || 0,
    maxPowerKw: maxPower,
    chargingLevel: determineChargingLevel(maxPower, primaryLevel?.IsFastChargeCapable),
    connectors: connectors,

    isPublic: raw.UsageTypeID !== 4 && raw.UsageTypeID !== 5, // Not private
    is24Hours: null, // Will be enriched from Google

    phoneNumber: raw.AddressInfo?.ContactTelephone1 ||
                 raw.OperatorInfo?.PhonePrimaryContact || null,
    website: raw.OperatorInfo?.WebsiteURL ||
             raw.AddressInfo?.RelatedURL || null,

    usageCost: raw.UsageCost || null,

    thumbnail: raw.MediaItems?.[0]?.ItemThumbnailURL || null,
    photos: raw.MediaItems?.map(m => m.ItemURL) || null,

    rating: raw.UserComments?.length
      ? raw.UserComments.reduce((acc, c) => acc + (c.Rating || 0), 0) / raw.UserComments.length
      : null,
    reviewCount: raw.UserComments?.length || 0,

    verifiedSource: VerifiedSource.OCM,
    lastSyncedAt: new Date(),
  };
}

// Process raw stations and save to normalized table
export async function normalizeAndSave(): Promise<{
  processed: number;
  created: number;
  updated: number;
  failed: number;
}> {
  logger.info('Starting normalization of raw stations');

  const rawStations = await prisma.stationsRaw.findMany({
    where: { processedAt: null },
  });

  logger.info({ count: rawStations.length }, 'Found unprocessed raw stations');

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const raw of rawStations) {
    try {
      const ocmData = raw.rawData as unknown as OCMStation;
      const normalized = normalizeStation(ocmData);

      const existing = await prisma.stations.findUnique({
        where: { ocmId: raw.ocmId },
      });

      if (existing) {
        await prisma.stations.update({
          where: { ocmId: raw.ocmId },
          data: {
            ...normalized,
            // Preserve enriched data
            openingHours: existing.openingHours,
            pricePerKwh: existing.pricePerKwh,
          },
        });
        updated++;
      } else {
        await prisma.stations.create({
          data: normalized,
        });
        created++;
      }

      // Mark as processed
      await prisma.stationsRaw.update({
        where: { id: raw.id },
        data: { processedAt: new Date() },
      });
    } catch (error: any) {
      logger.error({ ocmId: raw.ocmId, error: error.message }, 'Failed to normalize station');
      failed++;
    }
  }

  logger.info({ processed: rawStations.length, created, updated, failed }, 'Normalization complete');

  return {
    processed: rawStations.length,
    created,
    updated,
    failed,
  };
}
