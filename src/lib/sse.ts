/**
 * Server-Sent Events (SSE) Implementation
 *
 * Real-time notifications using SSE protocol.
 * More efficient than WebSocket for one-way server-to-client communication.
 */

import { randomUUID } from 'crypto'
import { createLogger } from './logger'

const sseLogger = createLogger('SSE')

// SSE Event Types
export type SSEEventType =
  | 'appointment.update'
  | 'ai.progress'
  | 'ai.complete'
  | 'chat.message'
  | 'system.notification'
  | 'service.update'

// SSE Event Data Structure
export interface SSEEvent<T = unknown> {
  id: string
  event: SSEEventType
  data: T
  timestamp: number
}

// SSE Event Data Types
export interface AppointmentUpdateData {
  appointmentId: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  message?: string
  estimatedTime?: string
}

export interface AIProgressData {
  taskId: string
  progress: number // 0-100
  status: 'analyzing' | 'processing' | 'generating'
  message: string
}

export interface AICompleteData {
  taskId: string
  result: unknown
  duration: number
}

export interface ChatMessageData {
  chatId: string
  message: {
    role: 'assistant' | 'system'
    content: string
  }
  isComplete: boolean
}

export interface SystemNotificationData {
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  actionUrl?: string
  actionLabel?: string
}

export interface ServiceUpdateData {
  serviceId: string
  type: 'status' | 'price' | 'availability'
  data: unknown
}

/**
 * SSE Connection Manager
 */
class SSEConnectionManager {
  private connections = new Map<string, SSEConnection>()

  /**
   * Create a new SSE connection
   */
  createConnection(userId?: string): SSEConnection {
    const connectionId = randomUUID()
    const connection = new SSEConnection(connectionId, userId)
    this.connections.set(connectionId, connection)
    return connection
  }

  /**
   * Get a connection by ID
   */
  getConnection(connectionId: string): SSEConnection | undefined {
    return this.connections.get(connectionId)
  }

  /**
   * Remove a connection
   */
  removeConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId)
    if (connection) {
      connection.close()
      this.connections.delete(connectionId)
    }
  }

  /**
   * Broadcast to all connections
   */
  broadcast<T>(event: SSEEventType, data: T): void {
    const sseEvent: SSEEvent<T> = {
      id: randomUUID(),
      event,
      data,
      timestamp: Date.now(),
    }

    for (const connection of this.connections.values()) {
      connection.send(sseEvent)
    }
  }

  /**
   * Send to specific user
   */
  sendToUser<T>(userId: string, event: SSEEventType, data: T): void {
    const sseEvent: SSEEvent<T> = {
      id: randomUUID(),
      event,
      data,
      timestamp: Date.now(),
    }

    for (const connection of this.connections.values()) {
      if (connection.userId === userId) {
        connection.send(sseEvent)
      }
    }
  }

  /**
   * Send to specific connection
   */
  sendToConnection<T>(connectionId: string, event: SSEEventType, data: T): void {
    const connection = this.connections.get(connectionId)
    if (connection) {
      const sseEvent: SSEEvent<T> = {
        id: randomUUID(),
        event,
        data,
        timestamp: Date.now(),
      }
      connection.send(sseEvent)
    }
  }

  /**
   * Get connection count
   */
  getConnectionCount(): number {
    return this.connections.size
  }

  /**
   * Clean up closed connections
   */
  cleanup(): void {
    for (const [id, connection] of this.connections.entries()) {
      if (connection.isConnectionClosed) {
        this.connections.delete(id)
      }
    }
  }
}

/**
 * SSE Connection Class
 */
export class SSEConnection {
  private controller: ReadableStreamDefaultController<Uint8Array> | null = null
  private encoder = new TextEncoder()
  private isClosed = false
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null

  constructor(
    public readonly connectionId: string,
    public readonly userId?: string
  ) {
    // Start heartbeat
    this.startHeartbeat()
  }

  /**
   * Initialize the stream
   */
  initStream(controller: ReadableStreamDefaultController<Uint8Array>): void {
    this.controller = controller

    // Send initial connection event
    this.send({
      id: this.connectionId,
      event: 'system.notification',
      data: {
        type: 'info',
        title: 'Bağlantı Kuruldu',
        message: 'Real-time bildirimler aktif.',
      } as SystemNotificationData,
      timestamp: Date.now(),
    })
  }

  /**
   * Send an event
   */
  send<T>(event: SSEEvent<T>): void {
    if (this.isClosed || !this.controller) {
      return
    }

    try {
      const data = JSON.stringify(event)
      const message = this.formatSSEMessage(event.event, data, event.id)
      this.controller.enqueue(this.encoder.encode(message))
    } catch (error) {
      sseLogger.error({ error, connectionId: this.connectionId }, 'SSE send error')
    }
  }

  /**
   * Format SSE message
   */
  private formatSSEMessage(
    event: string,
    data: string,
    id?: string,
    retry?: number
  ): string {
    let message = ''

    if (id) {
      message += `id: ${id}\n`
    }

    if (event) {
      message += `event: ${event}\n`
    }

    if (retry) {
      message += `retry: ${retry}\n`
    }

    // Split data into multiple lines if needed
    const lines = data.split('\n')
    for (const line of lines) {
      message += `data: ${line}\n`
    }

    message += '\n' // End of message

    return message
  }

  /**
   * Send comment (keep-alive)
   */
  sendComment(comment: string): void {
    if (this.isClosed || !this.controller) {
      return
    }

    try {
      const message = `: ${comment}\n\n`
      this.controller.enqueue(this.encoder.encode(message))
    } catch (error) {
      sseLogger.error({ error, connectionId: this.connectionId }, 'SSE comment error')
    }
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.sendComment('heartbeat')
    }, 30000) // Every 30 seconds
  }

  /**
   * Close the connection
   */
  close(): void {
    this.isClosed = true

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    if (this.controller) {
      try {
        this.controller.close()
      } catch {
        // Ignore close errors
      }
      this.controller = null
    }
  }

  get isConnectionClosed(): boolean {
    return this.isClosed
  }
}

// Global SSE Manager instance
export const sseManager = new SSEConnectionManager()

// Cleanup interval
setInterval(() => {
  sseManager.cleanup()
}, 60000) // Every minute

/**
 * Create SSE response for Next.js API routes
 */
export function createSSEResponse(): Response {
  const connection = sseManager.createConnection()

  const stream = new ReadableStream({
    start(controller) {
      connection.initStream(controller)

      // Cleanup on close
      return () => {
        sseManager.removeConnection(connection.connectionId)
      }
    },
    cancel() {
      sseManager.removeConnection(connection.connectionId)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  })
}

/**
 * Helper functions for sending common events
 */

// Appointment updates
export function sendAppointmentUpdate(
  userId: string,
  data: AppointmentUpdateData
): void {
  sseManager.sendToUser(userId, 'appointment.update', data)
}

// AI progress
export function sendAIProgress(
  connectionId: string,
  data: AIProgressData
): void {
  sseManager.sendToConnection(connectionId, 'ai.progress', data)
}

// AI complete
export function sendAIComplete(
  connectionId: string,
  data: AICompleteData
): void {
  sseManager.sendToConnection(connectionId, 'ai.complete', data)
}

// Chat message
export function sendChatMessage(
  userId: string,
  data: ChatMessageData
): void {
  sseManager.sendToUser(userId, 'chat.message', data)
}

// System notification
export function sendSystemNotification(
  userId: string,
  data: SystemNotificationData
): void {
  sseManager.sendToUser(userId, 'system.notification', data)
}

// Broadcast notification
export function broadcastSystemNotification(
  data: SystemNotificationData
): void {
  sseManager.broadcast('system.notification', data)
}
