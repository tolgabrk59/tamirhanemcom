type EnvConfig = {
  key: string
  required: boolean
  fallback?: string
}

const ENV_SCHEMA: EnvConfig[] = [
  // Strapi
  { key: 'STRAPI_API_URL', required: false, fallback: 'https://api.tamirhanem.net/api' },
  { key: 'STRAPI_API_TOKEN', required: true },
  { key: 'STRAPI_ADMIN_EMAIL', required: false },
  { key: 'STRAPI_ADMIN_PASSWORD', required: false },

  // Maps
  { key: 'NEXT_PUBLIC_MAPBOX_TOKEN', required: false },

  // Notifications
  { key: 'TELEGRAM_BOT_TOKEN', required: false },
  { key: 'TELEGRAM_CHAT_IDS', required: false },
  { key: 'NETGSM_USERNAME', required: false },
  { key: 'NETGSM_PASSWORD', required: false },
  { key: 'NETGSM_HEADER', required: false },

  // Redis
  { key: 'UPSTASH_REDIS_REST_URL', required: false },
  { key: 'UPSTASH_REDIS_REST_TOKEN', required: false },

  // AI Keys
  { key: 'GEMINI_API_KEY', required: false },
  { key: 'GEMINI_API_KEY_2', required: false },
  { key: 'GEMINI_API_KEY_3', required: false },
  { key: 'GEMINI_API_KEY_4', required: false },
  { key: 'OPENAI_API_KEY', required: false },
  { key: 'GROK_API_KEY', required: false },
  { key: 'CUSTOM_AI_ENDPOINT', required: false },

  // OTP
  { key: 'OTP_FORM_TOKEN', required: false },

  // Site
  { key: 'NEXT_PUBLIC_SITE_URL', required: false, fallback: 'https://tamirhanem.com' },
]

interface EnvValidationResult {
  valid: boolean
  missing: string[]
  warnings: string[]
}

export function validateEnv(): EnvValidationResult {
  const missing: string[] = []
  const warnings: string[] = []

  for (const config of ENV_SCHEMA) {
    const value = process.env[config.key]

    if (!value && config.required) {
      missing.push(config.key)
    }

    if (!value && !config.required && !config.fallback) {
      warnings.push(`${config.key} tanımlı değil — ilgili özellik devre dışı`)
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  }
}

function getEnvValue(key: string, fallback?: string): string {
  return process.env[key] || fallback || ''
}

export const env = {
  strapi: {
    apiUrl: getEnvValue('STRAPI_API_URL', 'https://api.tamirhanem.net/api'),
    token: getEnvValue('STRAPI_API_TOKEN'),
    adminEmail: getEnvValue('STRAPI_ADMIN_EMAIL'),
    adminPassword: getEnvValue('STRAPI_ADMIN_PASSWORD'),
  },
  redis: {
    url: getEnvValue('UPSTASH_REDIS_REST_URL'),
    token: getEnvValue('UPSTASH_REDIS_REST_TOKEN'),
    get enabled() {
      return Boolean(this.url && this.token)
    },
  },
  ai: {
    geminiKeys: [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4,
    ].filter(Boolean) as string[],
    openaiKey: getEnvValue('OPENAI_API_KEY'),
    grokKey: getEnvValue('GROK_API_KEY'),
    customEndpoint: getEnvValue('CUSTOM_AI_ENDPOINT'),
  },
  notifications: {
    telegram: {
      botToken: getEnvValue('TELEGRAM_BOT_TOKEN'),
      chatIds: getEnvValue('TELEGRAM_CHAT_IDS'),
      get enabled() {
        return Boolean(this.botToken && this.chatIds)
      },
    },
    netgsm: {
      username: getEnvValue('NETGSM_USERNAME'),
      password: getEnvValue('NETGSM_PASSWORD'),
      header: getEnvValue('NETGSM_HEADER'),
      get enabled() {
        return Boolean(this.username && this.password && this.header)
      },
    },
  },
  site: {
    url: getEnvValue('NEXT_PUBLIC_SITE_URL', 'https://tamirhanem.com'),
    mapboxToken: getEnvValue('NEXT_PUBLIC_MAPBOX_TOKEN'),
  },
} as const
