import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Enable only if DSN is configured
  enabled: !!process.env.SENTRY_DSN,

  // Enable logging
  _experiments: {
    enableLogs: true,
  },

  // Adjust this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Environment tag
  environment: process.env.NODE_ENV || 'development',

  integrations: [
    // send console.warn and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ['warn', 'error'] }),
  ],

  // Filter out sensitive data
  beforeSend(event) {
    // Remove sensitive data from event
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
      delete event.request.headers['x-api-key'];
    }

    // Remove sensitive query parameters
    if (event.request?.query_string && typeof event.request.query_string === 'string') {
      event.request.query_string = event.request.query_string
        .replace(/key=[^&]+/g, 'key=REDACTED')
        .replace(/token=[^&]+/g, 'token=REDACTED')
        .replace(/password=[^&]+/g, 'password=REDACTED');
    }

    // Remove stack frames from node_modules to reduce noise
    if (event.exception?.values) {
      event.exception.values.forEach((exception) => {
        if (exception.stacktrace?.frames) {
          exception.stacktrace.frames = exception.stacktrace.frames.filter(
            (frame) => !frame.filename?.includes('node_modules')
          );
        }
      });
    }

    return event;
  },

  // Ignore specific errors
  ignoreErrors: [
    // Common server errors to ignore
    'ECONNRESET',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',

    // Rate limiting
    'Too Many Requests',

    // Expected errors
    'Request aborted',
    'Socket hang up',
  ],
});
