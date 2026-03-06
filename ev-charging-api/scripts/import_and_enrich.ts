#!/usr/bin/env tsx
/**
 * EV Charging Stations Import & Enrich Pipeline
 *
 * Usage:
 *   npm run import                    # Full pipeline (fetch + normalize + enrich)
 *   npm run import -- --skip-fetch    # Skip OCM fetch, only normalize + enrich
 *   npm run import -- --skip-enrich   # Skip Google enrichment
 *   npm run import -- --country DE    # Fetch Germany instead of Turkey
 *   npm run import -- --enrich-limit 50  # Limit enrichment to 50 stations
 */

import '../src/pipeline/import_and_enrich';
