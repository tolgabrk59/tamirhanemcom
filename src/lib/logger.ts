import pino from 'pino';

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Create base logger
const baseOptions: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  // Redact sensitive fields
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers["x-api-key"]',
      'req.body.password',
      'req.body.token',
      'req.body.apiKey',
      'req.body.secret',
      'res.headers["set-cookie"]',
    ],
    remove: true,
  },
};

// Create logger - always use simple JSON logger for Next.js compatibility
// pino-pretty causes DataCloneError in Next.js builds due to worker serialization
export const logger = pino(baseOptions);

// Create child logger with context
export function createLogger(context: string) {
  return logger.child({ context });
}

// HTTP request logging
export interface HttpRequestLog {
  method: string;
  url: string;
  statusCode?: number;
  duration?: number;
  ip?: string;
  userAgent?: string;
  userId?: string;
}

export function logHttpRequest(data: HttpRequestLog, level: LogLevel = LogLevel.INFO) {
  const childLogger = createLogger('HTTP');

  const logData: any = {
    method: data.method,
    url: data.url,
    statusCode: data.statusCode,
    duration: data.duration,
    ip: data.ip,
    userAgent: data.userAgent,
  };

  if (data.userId) {
    logData.userId = data.userId;
  }

  childLogger[level]({
    ...logData,
    msg: `${data.method} ${data.url}${data.statusCode ? ` - ${data.statusCode}` : ''}${data.duration ? ` (${data.duration}ms)` : ''}`,
  });
}

// Error logging with context
export interface ErrorLog {
  error: Error | unknown;
  context?: string;
  userId?: string;
  requestId?: string;
  additionalData?: Record<string, unknown>;
}

export function logError(data: ErrorLog) {
  const context = data.context || 'ERROR';
  const childLogger = createLogger(context);

  const error = data.error instanceof Error ? data.error : new Error(String(data.error));

  const logData: Record<string, unknown> = {
    error: {
      message: error.message,
      name: error.name,
      stack: isDevelopment ? error.stack : undefined,
      // Don't log stack in production for security
    },
    userId: data.userId,
    requestId: data.requestId,
    ...data.additionalData,
  };

  childLogger.error(logData);
}

// Database query logging
export interface QueryLog {
  query: string;
  duration?: number;
  rows?: number;
  error?: Error;
}

export function logQuery(data: QueryLog) {
  const childLogger = createLogger('DATABASE');

  if (data.error) {
    childLogger.error({
      query: data.query,
      duration: data.duration,
      error: data.error.message,
      msg: `Query failed: ${data.query.substring(0, 100)}...`,
    });
  } else if (data.duration && data.duration > 1000) {
    // Log slow queries
    childLogger.warn({
      query: data.query,
      duration: data.duration,
      rows: data.rows,
      msg: `Slow query (${data.duration}ms): ${data.query.substring(0, 100)}...`,
    });
  } else {
    childLogger.debug({
      query: data.query,
      duration: data.duration,
      rows: data.rows,
      msg: `Query executed: ${data.query.substring(0, 100)}...`,
    });
  }
}

// API response logging
export interface ApiResponseLog {
  endpoint: string;
  method: string;
  statusCode: number;
  duration: number;
  success: boolean;
  errorMessage?: string;
}

export function logApiResponse(data: ApiResponseLog) {
  const childLogger = createLogger('API');

  const level = data.statusCode >= 500 ? LogLevel.ERROR :
                data.statusCode >= 400 ? LogLevel.WARN :
                LogLevel.INFO;

  childLogger[level]({
    endpoint: data.endpoint,
    method: data.method,
    statusCode: data.statusCode,
    duration: data.duration,
    success: data.success,
    errorMessage: data.errorMessage,
    msg: `${data.method} ${data.endpoint} - ${data.statusCode} (${data.duration}ms)`,
  });
}

// Business event logging
export interface EventLog {
  eventType: string;
  userId?: string;
  sessionId?: string;
  properties?: Record<string, unknown>;
}

export function logEvent(data: EventLog) {
  const childLogger = createLogger('EVENT');

  childLogger.info({
    eventType: data.eventType,
    userId: data.userId,
    sessionId: data.sessionId,
    properties: data.properties,
    msg: `Event: ${data.eventType}`,
  });
}

// Performance monitoring
export interface PerformanceLog {
  operation: string;
  duration: number;
  threshold?: number;
  metadata?: Record<string, unknown>;
}

export function logPerformance(data: PerformanceLog) {
  const childLogger = createLogger('PERFORMANCE');

  const threshold = data.threshold || 1000;
  const level = data.duration > threshold ? LogLevel.WARN : LogLevel.DEBUG;

  childLogger[level]({
    operation: data.operation,
    duration: data.duration,
    threshold: threshold,
    metadata: data.metadata,
    msg: `${data.operation} completed in ${data.duration}ms`,
  });
}

// Security event logging
export interface SecurityEventLog {
  eventType: 'rate_limit_exceeded' | 'unauthorized_access' | 'suspicious_activity' | 'auth_failure' | 'injection_attempt';
  ip?: string;
  userId?: string;
  details: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function logSecurityEvent(data: SecurityEventLog) {
  const childLogger = createLogger('SECURITY');

  const level = data.severity === 'critical' || data.severity === 'high' ?
                LogLevel.ERROR :
                data.severity === 'medium' ?
                LogLevel.WARN :
                LogLevel.INFO;

  childLogger[level]({
    eventType: data.eventType,
    ip: data.ip,
    userId: data.userId,
    details: data.details,
    severity: data.severity,
    msg: `Security Event: ${data.eventType} (${data.severity})`,
  });
}

// Export default logger
export default logger;
