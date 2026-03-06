import { NextResponse } from 'next/server'

interface ApiSuccessResponse<T> {
  success: true
  data: T
  meta?: Record<string, unknown>
}

interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown[]
  }
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export function success<T>(data: T, meta?: Record<string, unknown>): NextResponse<ApiResponse<T>> {
  const body: ApiSuccessResponse<T> = { success: true, data }
  if (meta) body.meta = meta
  return NextResponse.json(body)
}

export function created<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data } as ApiSuccessResponse<T>, { status: 201 })
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 })
}

export function badRequest(message: string, details?: unknown[]): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: { code: 'BAD_REQUEST', message, details },
    },
    { status: 400 }
  )
}

export function unauthorized(message = 'Yetkilendirme gerekli'): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: { code: 'UNAUTHORIZED', message },
    },
    { status: 401 }
  )
}

export function forbidden(message = 'Bu işlem için yetkiniz yok'): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: { code: 'FORBIDDEN', message },
    },
    { status: 403 }
  )
}

export function notFound(message = 'Kaynak bulunamadı'): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: { code: 'NOT_FOUND', message },
    },
    { status: 404 }
  )
}

export function conflict(message: string): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: { code: 'CONFLICT', message },
    },
    { status: 409 }
  )
}

export function tooManyRequests(retryAfter?: number): NextResponse<ApiErrorResponse> {
  const headers: Record<string, string> = {}
  if (retryAfter) {
    headers['Retry-After'] = retryAfter.toString()
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Çok fazla istek gönderildi. Lütfen bekleyip tekrar deneyin.',
      },
    },
    { status: 429, headers }
  )
}

export function serverError(message = 'Bir hata oluştu. Lütfen tekrar deneyin.'): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: { code: 'INTERNAL_ERROR', message },
    },
    { status: 500 }
  )
}

export function validationError(errors: { field: string; message: string }[]): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Giriş verisi geçersiz',
        details: errors,
      },
    },
    { status: 422 }
  )
}
