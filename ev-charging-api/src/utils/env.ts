import { config } from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load .env file
config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // OpenChargeMap
  OCM_API_KEY: z.string().min(1),
  OCM_API_URL: z.string().url().default('https://api.openchargemap.io/v3'),

  // Google Places
  GOOGLE_PLACES_API_KEY: z.string().min(1),

  // Server
  PORT: z.string().transform(Number).default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Pipeline
  BATCH_SIZE: z.string().transform(Number).default('100'),
  ENRICHMENT_DELAY_MS: z.string().transform(Number).default('200'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
