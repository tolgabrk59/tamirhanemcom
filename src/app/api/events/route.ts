import { createSSEResponse } from '@/lib/sse'

/**
 * SSE Endpoint
 *
 * Connect to this endpoint to receive real-time updates.
 *
 * Usage:
 * const eventSource = new EventSource('/api/events')
 * eventSource.addEventListener('appointment.update', (e) => {
 *   const data = JSON.parse(e.data)
 *   console.log('Appointment update:', data)
 * })
 */
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Get user ID from session/auth if available
  const url = new URL(request.url)
  const userId = url.searchParams.get('userId') || undefined

  // Create SSE connection
  return createSSEResponse()
}
