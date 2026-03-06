import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Enable only if DSN is configured
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Enable logging
  _experiments: {
    enableLogs: true,
  },

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Replay configuration - capture session replays on errors
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    // send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ['warn', 'error'] }),
  ],

  // Filter out sensitive data
  beforeSend(event) {
    // Remove sensitive data from event
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
    }

    // Remove API keys from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
        if (breadcrumb.data?.url) {
          // Remove API keys from URLs
          breadcrumb.data.url = breadcrumb.data.url.replace(/key=[^&]+/g, 'key=REDACTED');
        }
        return breadcrumb;
      });
    }

    return event;
  },

  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'http://tt.telegramm.me',
    /webkit-masked-url/,

    // Network errors
    'Network request failed',
    'Failed to fetch',
    'NetworkError',
    'ChunkLoadError',

    // User errors
    'ResizeObserver loop',
    'ResizeObserver loop limit exceeded',
  ],

  // Ignore specific transaction names
  denyUrls: [
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,

    // Browser plugins
    /^moz-extension:\/\//i,
    /^safari-web-extension:\/\//i,
  ],
});
