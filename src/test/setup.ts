import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Her testten sonra temizlik
afterEach(() => {
  cleanup()
})

// Mock logger to avoid pino transport issues in test environment
vi.mock('@/lib/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    child: vi.fn().mockReturnThis(),
  }),
  logError: vi.fn(),
  logRequest: vi.fn(),
}))

// Mock environment variables
vi.mock('@/lib/env', () => ({
  getEnv: () => ({
    databaseUrl: 'mysql://test:test@localhost:3306/test',
    openaiApiKey: 'test-key',
    geminiApiKey: 'test-key',
  }),
}))

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/',
}))
