'use client'

/**
 * useServerEvents Hook
 *
 * React hook for consuming Server-Sent Events
 */

import { useEffect, useCallback, useRef, useState } from 'react'
import {
  type SSEEvent,
  type SSEEventType,
  type AppointmentUpdateData,
  type AIProgressData,
  type AICompleteData,
  type ChatMessageData,
  type SystemNotificationData,
  type ServiceUpdateData,
} from '@/lib/sse'

// Event handler types
export type EventHandlers = {
  onAppointmentUpdate?: (data: AppointmentUpdateData) => void
  onAIProgress?: (data: AIProgressData) => void
  onAIComplete?: (data: AICompleteData) => void
  onChatMessage?: (data: ChatMessageData) => void
  onSystemNotification?: (data: SystemNotificationData) => void
  onServiceUpdate?: (data: ServiceUpdateData) => void
  onError?: (error: Event) => void
  onOpen?: () => void
  onClose?: () => void
}

// Hook state
interface UseServerEventsState {
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  reconnectCount: number
}

// Hook options
interface UseServerEventsOptions {
  userId?: string
  autoReconnect?: boolean
  reconnectInterval?: number // ms
  maxReconnectAttempts?: number
}

/**
 * useServerEvents Hook
 *
 * @example
 * const { isConnected, send } = useServerEvents({
 *   userId: 'user-123',
 *   onAppointmentUpdate: (data) => console.log('Appointment updated:', data),
 *   onAIProgress: (data) => console.log('AI progress:', data.progress),
 * })
 */
export function useServerEvents(
  handlers: EventHandlers = {},
  options: UseServerEventsOptions = {}
) {
  const {
    userId,
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options

  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectCountRef = useRef(0)
  const handlersRef = useRef(handlers)

  // Update handlers ref when they change
  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  const [state, setState] = useState<UseServerEventsState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    reconnectCount: 0,
  })

  /**
   * Connect to SSE endpoint
   */
  const connect = useCallback(() => {
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return // Already connected
    }

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    // Build URL
    const url = new URL('/api/events', window.location.origin)
    if (userId) {
      url.searchParams.set('userId', userId)
    }

    try {
      const eventSource = new EventSource(url.toString())
      eventSourceRef.current = eventSource

      // Connection opened
      eventSource.onopen = () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[SSE] Connected')
        }
        setState((prev) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
          reconnectCount: reconnectCountRef.current,
        }))
        reconnectCountRef.current = 0
        handlersRef.current.onOpen?.()
      }

      // Error handling
      eventSource.onerror = (error) => {
        console.error('[SSE] Error:', error)

        setState((prev) => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          error: 'Connection error',
        }))

        handlersRef.current.onError?.(error)

        // Attempt reconnection
        if (
          autoReconnect &&
          reconnectCountRef.current < maxReconnectAttempts
        ) {
          reconnectCountRef.current++
          reconnectTimeoutRef.current = setTimeout(() => {
            if (process.env.NODE_ENV === 'development') {
              console.log(`[SSE] Reconnecting... (${reconnectCountRef.current}/${maxReconnectAttempts})`)
            }
            connect()
          }, reconnectInterval)
        } else {
          // Close connection
          eventSource.close()
          eventSourceRef.current = null
        }
      }

      // Appointment updates
      eventSource.addEventListener('appointment.update', (e) => {
        try {
          const event = JSON.parse((e as MessageEvent).data) as SSEEvent<AppointmentUpdateData>
          handlersRef.current.onAppointmentUpdate?.(event.data)
        } catch (error) {
          console.error('[SSE] Failed to parse appointment.update:', error)
        }
      })

      // AI progress
      eventSource.addEventListener('ai.progress', (e) => {
        try {
          const event = JSON.parse((e as MessageEvent).data) as SSEEvent<AIProgressData>
          handlersRef.current.onAIProgress?.(event.data)
        } catch (error) {
          console.error('[SSE] Failed to parse ai.progress:', error)
        }
      })

      // AI complete
      eventSource.addEventListener('ai.complete', (e) => {
        try {
          const event = JSON.parse((e as MessageEvent).data) as SSEEvent<AICompleteData>
          handlersRef.current.onAIComplete?.(event.data)
        } catch (error) {
          console.error('[SSE] Failed to parse ai.complete:', error)
        }
      })

      // Chat messages
      eventSource.addEventListener('chat.message', (e) => {
        try {
          const event = JSON.parse((e as MessageEvent).data) as SSEEvent<ChatMessageData>
          handlersRef.current.onChatMessage?.(event.data)
        } catch (error) {
          console.error('[SSE] Failed to parse chat.message:', error)
        }
      })

      // System notifications
      eventSource.addEventListener('system.notification', (e) => {
        try {
          const event = JSON.parse((e as MessageEvent).data) as SSEEvent<SystemNotificationData>
          handlersRef.current.onSystemNotification?.(event.data)
        } catch (error) {
          console.error('[SSE] Failed to parse system.notification:', error)
        }
      })

      // Service updates
      eventSource.addEventListener('service.update', (e) => {
        try {
          const event = JSON.parse((e as MessageEvent).data) as SSEEvent<ServiceUpdateData>
          handlersRef.current.onServiceUpdate?.(event.data)
        } catch (error) {
          console.error('[SSE] Failed to parse service.update:', error)
        }
      })

    } catch (error) {
      console.error('[SSE] Failed to create EventSource:', error)
      setState((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: 'Failed to connect',
      }))
    }
  }, [userId, autoReconnect, reconnectInterval, maxReconnectAttempts])

  /**
   * Disconnect from SSE endpoint
   */
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    setState((prev) => ({ ...prev, isConnected: false, isConnecting: false }))
    handlersRef.current.onClose?.()
  }, [])

  /**
   * Manually trigger reconnection
   */
  const reconnect = useCallback(() => {
    disconnect()
    reconnectCountRef.current = 0
    connect()
  }, [disconnect, connect])

  // Auto-connect on mount
  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    ...state,
    connect,
    disconnect,
    reconnect,
  }
}

/**
 * Simplified hook for just notifications
 */
export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<SystemNotificationData[]>([])

  const { isConnected } = useServerEvents(
    {
      onSystemNotification: (data) => {
        setNotifications((prev) => [...prev, data])

        // Auto-dismiss after 5 seconds for success/info
        if (data.type === 'success' || data.type === 'info') {
          setTimeout(() => {
            setNotifications((prev) =>
              prev.filter((n) => n !== data)
            )
          }, 5000)
        }
      },
    },
    { userId }
  )

  const dismissNotification = useCallback((notification: SystemNotificationData) => {
    setNotifications((prev) => prev.filter((n) => n !== notification))
  }, [])

  return {
    notifications,
    dismissNotification,
    isConnected,
  }
}

/**
 * Hook for AI progress tracking
 */
export function useAIProgress(taskId?: string) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [result, setResult] = useState<unknown>(null)
  const [isComplete, setIsComplete] = useState(false)

  const { isConnected } = useServerEvents(
    {
      onAIProgress: (data) => {
        if (!taskId || data.taskId === taskId) {
          setProgress(data.progress)
          setStatus(data.status)
          setMessage(data.message)
        }
      },
      onAIComplete: (data) => {
        if (!taskId || data.taskId === taskId) {
          setResult(data.result)
          setIsComplete(true)
          setProgress(100)
        }
      },
    },
    {}
  )

  return {
    progress,
    status,
    message,
    result,
    isComplete,
    isConnected,
  }
}
