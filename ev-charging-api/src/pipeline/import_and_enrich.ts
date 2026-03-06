import { prisma, connectDB, disconnectDB } from '../db/client';
import { fetchAndSaveRaw, normalizeAndSave } from '../ocm';
import { enrichStations } from '../google';
import { createLogger, env } from '../utils';

const logger = createLogger('pipeline');

export interface PipelineOptions {
  countryCode?: string;
  skipFetch?: boolean;
  skipNormalize?: boolean;
  skipEnrich?: boolean;
  enrichLimit?: number;
}

export interface PipelineResult {
  syncLogId: string;
  ocm: {
    fetched: number;
    saved: number;
  };
  normalize: {
    processed: number;
    created: number;
    updated: number;
    failed: number;
  };
  enrich: {
    processed: number;
    enriched: number;
    notFound: number;
  };
  duration: number;
}

export async function runPipeline(options: PipelineOptions = {}): Promise<PipelineResult> {
  const {
    countryCode = 'TR',
    skipFetch = false,
    skipNormalize = false,
    skipEnrich = false,
    enrichLimit = env.BATCH_SIZE,
  } = options;

  const startTime = Date.now();

  logger.info({ options }, 'Starting import and enrich pipeline');

  // Create sync log
  const syncLog = await prisma.syncLog.create({
    data: {
      source: 'OCM',
      startedAt: new Date(),
    },
  });

  const result: PipelineResult = {
    syncLogId: syncLog.id,
    ocm: { fetched: 0, saved: 0 },
    normalize: { processed: 0, created: 0, updated: 0, failed: 0 },
    enrich: { processed: 0, enriched: 0, notFound: 0 },
    duration: 0,
  };

  try {
    // Step 1: Fetch from OCM
    if (!skipFetch) {
      logger.info('Step 1: Fetching from OpenChargeMap');
      result.ocm = await fetchAndSaveRaw({ countryCode });
      logger.info(result.ocm, 'OCM fetch complete');
    } else {
      logger.info('Step 1: Skipped OCM fetch');
    }

    // Step 2: Normalize
    if (!skipNormalize) {
      logger.info('Step 2: Normalizing stations');
      result.normalize = await normalizeAndSave();
      logger.info(result.normalize, 'Normalization complete');
    } else {
      logger.info('Step 2: Skipped normalization');
    }

    // Step 3: Enrich from Google
    if (!skipEnrich) {
      logger.info('Step 3: Enriching from Google Places');
      result.enrich = await enrichStations({
        limit: enrichLimit,
        onlyMissing: true,
      });
      logger.info(result.enrich, 'Enrichment complete');
    } else {
      logger.info('Step 3: Skipped enrichment');
    }

    result.duration = Date.now() - startTime;

    // Update sync log
    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        completedAt: new Date(),
        recordsFetched: result.ocm.fetched,
        recordsCreated: result.normalize.created,
        recordsUpdated: result.normalize.updated,
        recordsFailed: result.normalize.failed,
      },
    });

    logger.info({ duration: result.duration, result }, 'Pipeline completed successfully');

  } catch (error: any) {
    logger.error({ error: error.message }, 'Pipeline failed');

    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        completedAt: new Date(),
        errorLog: { error: error.message, stack: error.stack },
      },
    });

    throw error;
  }

  return result;
}

// CLI runner
async function main() {
  const args = process.argv.slice(2);

  const options: PipelineOptions = {
    countryCode: args.includes('--country')
      ? args[args.indexOf('--country') + 1]
      : 'TR',
    skipFetch: args.includes('--skip-fetch'),
    skipNormalize: args.includes('--skip-normalize'),
    skipEnrich: args.includes('--skip-enrich'),
    enrichLimit: args.includes('--enrich-limit')
      ? parseInt(args[args.indexOf('--enrich-limit') + 1], 10)
      : undefined,
  };

  try {
    await connectDB();
    const result = await runPipeline(options);
    console.log('\nPipeline Result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Pipeline failed:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
