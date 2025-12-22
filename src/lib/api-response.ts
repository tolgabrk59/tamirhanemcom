import { NextResponse } from 'next/server';

/**
 * Standardized API response interface
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Create a successful response
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  headers?: Record<string, string>
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status, headers }
  );
}

/**
 * Create an error response
 * IMPORTANT: Never expose internal error details to clients
 */
export function errorResponse(
  message: string,
  status: number = 500,
  code?: string,
  headers?: Record<string, string>
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        ...(code && { code }),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status, headers }
  );
}

/**
 * Common error responses
 */
export const errors = {
  // 400 Bad Request
  badRequest: (message: string = 'Geçersiz istek') =>
    errorResponse(message, 400, 'BAD_REQUEST'),

  // 401 Unauthorized
  unauthorized: (message: string = 'Oturum açmanız gerekiyor') =>
    errorResponse(message, 401, 'UNAUTHORIZED'),

  // 403 Forbidden
  forbidden: (message: string = 'Bu işlem için yetkiniz yok') =>
    errorResponse(message, 403, 'FORBIDDEN'),

  // 404 Not Found
  notFound: (message: string = 'Kaynak bulunamadı') =>
    errorResponse(message, 404, 'NOT_FOUND'),

  // 409 Conflict
  conflict: (message: string = 'Kaynak zaten mevcut') =>
    errorResponse(message, 409, 'CONFLICT'),

  // 422 Unprocessable Entity
  validation: (message: string = 'Doğrulama hatası') =>
    errorResponse(message, 422, 'VALIDATION_ERROR'),

  // 429 Too Many Requests
  rateLimit: (retryAfter?: number) =>
    errorResponse(
      'Çok fazla istek gönderildi. Lütfen bekleyin.',
      429,
      'RATE_LIMIT_EXCEEDED',
      retryAfter ? { 'Retry-After': retryAfter.toString() } : undefined
    ),

  // 500 Internal Server Error
  internal: (message: string = 'Bir hata oluştu. Lütfen tekrar deneyin.') =>
    errorResponse(message, 500, 'INTERNAL_ERROR'),

  // 502 Bad Gateway
  badGateway: (message: string = 'Dış servis yanıt vermedi') =>
    errorResponse(message, 502, 'BAD_GATEWAY'),

  // 503 Service Unavailable
  serviceUnavailable: (message: string = 'Servis geçici olarak kullanılamıyor') =>
    errorResponse(message, 503, 'SERVICE_UNAVAILABLE'),
};

/**
 * Sanitize error message - remove sensitive information
 * Use this when you need to include error context but want to hide internals
 */
export function sanitizeErrorMessage(error: unknown): string {
  // Never expose these patterns
  const sensitivePatterns = [
    /api[_-]?key/i,
    /secret/i,
    /password/i,
    /token/i,
    /credential/i,
    /authorization/i,
    /bearer/i,
    /mysql/i,
    /postgres/i,
    /database/i,
    /connection/i,
    /econnrefused/i,
    /etimedout/i,
    /internal server/i,
    /stack trace/i,
    /at .+\(.+:\d+:\d+\)/i, // Stack trace lines
  ];

  if (error instanceof Error) {
    const message = error.message;

    // Check if message contains sensitive info
    for (const pattern of sensitivePatterns) {
      if (pattern.test(message)) {
        return 'Bir hata oluştu. Lütfen tekrar deneyin.';
      }
    }

    // If message is safe, return it (but limit length)
    return message.slice(0, 200);
  }

  if (typeof error === 'string') {
    for (const pattern of sensitivePatterns) {
      if (pattern.test(error)) {
        return 'Bir hata oluştu. Lütfen tekrar deneyin.';
      }
    }
    return error.slice(0, 200);
  }

  return 'Bir hata oluştu. Lütfen tekrar deneyin.';
}

/**
 * Log error securely - full details for server logs, sanitized for response
 */
export function logError(context: string, error: unknown): void {
  console.error(`[${context}]`, {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });
}
