#!/usr/bin/env tsx
/**
 * Fetch from OpenChargeMap only (no normalization or enrichment)
 *
 * Usage:
 *   npm run import:ocm
 *   npm run import:ocm -- --country DE
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, '../.env') });

import { connectDB, disconnectDB } from '../src/db/client';
import { fetchAndSaveRaw } from '../src/ocm';
import { createLogger } from '../src/utils';

const logger = createLogger('fetch-ocm');

async function main() {
  const args = process.argv.slice(2);
  const countryCode = args.includes('--country')
    ? args[args.indexOf('--country') + 1]
    : 'TR';

  try {
    await connectDB();

    logger.info({ countryCode }, 'Starting OCM fetch');
    const result = await fetchAndSaveRaw({ countryCode });

    console.log('\nOCM Fetch Result:');
    console.log(`  Fetched: ${result.fetched}`);
    console.log(`  Saved: ${result.saved}`);

  } catch (error) {
    logger.error({ error }, 'OCM fetch failed');
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}

main();
