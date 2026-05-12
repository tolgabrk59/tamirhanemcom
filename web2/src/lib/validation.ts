type ValidationRule<T> = {
  check: (value: T) => boolean
  message: string
  field: string
}

interface ValidationError {
  field: string
  message: string
}

interface ValidationResult<T> {
  valid: boolean
  data: T | null
  errors: ValidationError[]
}

export function validate<T extends Record<string, unknown>>(
  data: unknown,
  rules: ValidationRule<T>[]
): ValidationResult<T> {
  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      data: null,
      errors: [{ field: 'body', message: 'Geçersiz istek gövdesi' }],
    }
  }

  const errors: ValidationError[] = []
  const typedData = data as T

  for (const rule of rules) {
    if (!rule.check(typedData)) {
      errors.push({ field: rule.field, message: rule.message })
    }
  }

  return {
    valid: errors.length === 0,
    data: errors.length === 0 ? typedData : null,
    errors,
  }
}

// Common validators
export const validators = {
  required(field: string, label?: string): ValidationRule<Record<string, unknown>> {
    return {
      field,
      message: `${label || field} zorunludur`,
      check: (data) => {
        const value = data[field]
        return value !== undefined && value !== null && value !== ''
      },
    }
  },

  string(field: string, label?: string): ValidationRule<Record<string, unknown>> {
    return {
      field,
      message: `${label || field} metin olmalıdır`,
      check: (data) => {
        const value = data[field]
        return value === undefined || typeof value === 'string'
      },
    }
  },

  number(field: string, label?: string): ValidationRule<Record<string, unknown>> {
    return {
      field,
      message: `${label || field} sayı olmalıdır`,
      check: (data) => {
        const value = data[field]
        return value === undefined || typeof value === 'number'
      },
    }
  },

  minLength(field: string, min: number, label?: string): ValidationRule<Record<string, unknown>> {
    return {
      field,
      message: `${label || field} en az ${min} karakter olmalıdır`,
      check: (data) => {
        const value = data[field]
        return typeof value === 'string' && value.length >= min
      },
    }
  },

  maxLength(field: string, max: number, label?: string): ValidationRule<Record<string, unknown>> {
    return {
      field,
      message: `${label || field} en fazla ${max} karakter olmalıdır`,
      check: (data) => {
        const value = data[field]
        return value === undefined || (typeof value === 'string' && value.length <= max)
      },
    }
  },

  phone(field: string): ValidationRule<Record<string, unknown>> {
    return {
      field,
      message: 'Geçerli bir telefon numarası giriniz (5XXXXXXXXX)',
      check: (data) => {
        const value = data[field]
        if (typeof value !== 'string') return false
        const cleaned = value.replace(/\D/g, '')
        return /^(5[0-9]{9}|905[0-9]{9}|05[0-9]{9})$/.test(cleaned)
      },
    }
  },

  email(field: string): ValidationRule<Record<string, unknown>> {
    return {
      field,
      message: 'Geçerli bir e-posta adresi giriniz',
      check: (data) => {
        const value = data[field]
        if (value === undefined) return true
        if (typeof value !== 'string') return false
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      },
    }
  },

  oneOf(field: string, options: string[], label?: string): ValidationRule<Record<string, unknown>> {
    return {
      field,
      message: `${label || field} şu değerlerden biri olmalıdır: ${options.join(', ')}`,
      check: (data) => {
        const value = data[field]
        if (value === undefined) return true
        return typeof value === 'string' && options.includes(value)
      },
    }
  },

  plate(field: string): ValidationRule<Record<string, unknown>> {
    return {
      field,
      message: 'Geçerli bir plaka giriniz (ör: 34ABC123)',
      check: (data) => {
        const value = data[field]
        if (typeof value !== 'string') return false
        const cleaned = value.replace(/\s/g, '').toUpperCase()
        return /^(0?[1-9]|[1-7][0-9]|8[01])[A-Z]{1,3}\d{2,4}$/.test(cleaned)
      },
    }
  },
}

export async function parseBody<T>(request: Request): Promise<T | null> {
  try {
    return await request.json() as T
  } catch {
    return null
  }
}
