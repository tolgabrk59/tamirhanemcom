import { z } from 'zod';
import { createLogger } from './logger';

const envLogger = createLogger('ENV');

/**
 * Environment variables schema
 * Validates all required and optional environment variables at startup
 */
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database
  DB_HOST: z.string().optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_NAME: z.string().optional(),
  DB_CONNECTION_LIMIT: z.string().optional().default('10'),

  // Strapi CMS
  STRAPI_API_URL: z.string().url().optional(),
  STRAPI_API_TOKEN: z.string().optional(),

  // AI APIs
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_API_KEY_2: z.string().optional(),
  GEMINI_API_KEY_3: z.string().optional(),
  GEMINI_API_KEY_4: z.string().optional(),
  GEMINI_API_KEY_5: z.string().optional(),
  GEMINI_API_KEY_7: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GROK_API_KEY: z.string().optional(),

  // External APIs
  SERPER_API_KEY: z.string().optional(),
  PEXELS_API_KEY: z.string().optional(),

  // Admin
  ADMIN_PASSWORD: z.string().min(8).optional(),
  SESSION_SECRET: z.string().min(32).optional(),

  // Redis (optional)
  REDIS_URL: z.string().url().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),

  // Sentry (optional)
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // Vercel (auto-populated in Vercel)
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
});

// Parse and validate environment variables
function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    envLogger.error({ errors: parsed.error.format() }, 'Invalid environment variables');

    // In production, throw error; in development, just warn
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment variables');
    }
  }

  return parsed.data || ({} as z.infer<typeof envSchema>);
}

// Export validated environment
export const env = validateEnv();

// Type-safe env access helpers
export function getEnv(key: keyof z.infer<typeof envSchema>): string | undefined {
  return env[key];
}

export function requireEnv(key: keyof z.infer<typeof envSchema>): string {
  const value = env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Check if specific features are enabled
export const features = {
  database: !!(env.DB_HOST && env.DB_USER && env.DB_PASSWORD && env.DB_NAME),
  strapi: !!env.STRAPI_API_URL,
  gemini: !!env.GEMINI_API_KEY,
  openai: !!env.OPENAI_API_KEY,
  redis: !!(env.REDIS_URL || env.REDIS_HOST),
  sentry: !!env.SENTRY_DSN,
  admin: !!(env.ADMIN_PASSWORD && env.SESSION_SECRET),
};

// Log feature status in development
if (env.NODE_ENV === 'development') {
  envLogger.debug({ features }, 'Feature status');
}

export type Env = z.infer<typeof envSchema>;
