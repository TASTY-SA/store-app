import { useEffect, useRef, useCallback } from 'react'
import { getApiBase } from '../features/auth/services/config'
import { useWsStore } from '../store/wsStore'

// ──────────────────────────────────────────────
// Tipos públicos
// ──────────────────────────────────────────────

export interface WsMessage {
  event: string
  data: unknown
}

interface UseWebSocketOptions {
  onMessage?: (msg: WsMessage) => void
  enabled?: boolean
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

/**
 * Deriva la URL del WebSocket a partir de VITE_API_BASE_URL.
 *
 * Ejemplo:
 *   http://localhost:8000  →  ws://localhost:8000/pedidos/cocina/ws
 *   https://api.midominio.com  →  wss://api.midominio.com/pedidos/cocina/ws
 */
function getWsUrl(): string {
  const base = getApiBase()
  return base.replace(/^http/, 'ws') + '/pedidos/cocina/ws'
}

// ──────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────

/**
 * useWebSocket
 *
 * Hook que gestiona una conexión WebSocket persistente con el backend de
 * pedidos/cocina.
 *
 * ### Autenticación
 * El backend autentica el socket leyendo la cookie httpOnly `access_token`
 * que el navegador envía automáticamente durante el handshake HTTP → WS.
 * Si la cookie no es válida el servidor cierra con código **1008**
 * (Policy Violation) y el hook NO reintenta.
 *
 * ### Reconexión con backoff exponencial
 *   Intento 1 → 2 s, intento 2 → 4 s, intento 3 → 8 s, … techo de 30 s.
 * Al reconectar exitosamente el contador se reinicia.
 *
 * ### Evento sintético WS_CONNECTED
 * Cuando el socket se abre (o reconecta), el hook emite un mensaje local
 * con event `"WS_CONNECTED"`. Los consumidores pueden escucharlo para
 * resincronizar datos y re-suscribirse a salas activas.
 *
 * ### Suscripción a salas de pedidos
 * - `subscribeToOrder(orderId)` → envía `{ action: "subscribe-order", order_id }`
 * - `unsubscribeFromOrder(orderId)` → envía `{ action: "unsubscribe-order", order_id }`
 *
 * ### Compatibilidad con React StrictMode
 * En desarrollo React monta, desmonta y vuelve a montar cada componente.
 * El flag `cancelled` y `closeCleanly` garantizan que no queden sockets
 * huérfanos ni se ejecute lógica sobre componentes desmontados.
 */
export function useWebSocket({
  onMessage,
  enabled = true,
}: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null)
  const onMessageRef = useRef(onMessage)

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    let retryCount = 0
    let retryTimer: ReturnType<typeof setTimeout> | null = null
    let currentWs: WebSocket | null = null

    const closeCleanly = (ws: WebSocket) => {
      if (ws.readyState === WebSocket.CONNECTING) {
        ws.addEventListener('open', () => ws.close(1000), { once: true })
      } else if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000)
      }
      // CLOSING / CLOSED: el navegador ya gestiona el cierre.
    }

    const connect = () => {
      if (cancelled) return

      const ws = new WebSocket(getWsUrl())
      currentWs = ws
      wsRef.current = ws

      ws.onopen = () => {
        if (cancelled) {
          ws.close(1000)
          return
        }
        retryCount = 0
        useWsStore.getState().setStatus('connected')
        useWsStore.getState().resetAttempts()
        useWsStore.getState().setError(null)
        onMessageRef.current?.({ event: 'WS_CONNECTED', data: null })
      }

      ws.onmessage = (event) => {
        if (cancelled) return
        try {
          const msg = JSON.parse(event.data as string) as WsMessage
          onMessageRef.current?.(msg)
        } catch {
          // Ignorar mensajes malformados
        }
      }

      ws.onerror = () => {
        // Los errores siempre van seguidos de onclose.
      }

      ws.onclose = (e) => {
        if (wsRef.current === ws) wsRef.current = null
        currentWs = null

        const wasNormal = e.code === 1000
        const wasAuthRejected = e.code === 1008

        if (cancelled) return

        if (wasAuthRejected) {
          useWsStore.getState().setStatus('disconnected')
          useWsStore.getState().setError('Autenticación rechazada')
          return
        }

        if (wasNormal) {
          useWsStore.getState().setStatus('disconnected')
          useWsStore.getState().setError(null)
          return
        }

        useWsStore.getState().setStatus('reconnecting')
        useWsStore.getState().setError(e.reason || 'Conexión perdida')
        useWsStore.getState().incrementAttempts()

        retryCount++
        const delay = Math.min(1000 * 2 ** retryCount, 30_000)
        console.warn(
          `[WS] Reconectando en ${delay / 1000}s (intento ${retryCount})`,
        )
        retryTimer = setTimeout(connect, delay)
      }
    }

    connect()

    return () => {
      cancelled = true
      if (retryTimer !== null) clearTimeout(retryTimer)
      if (currentWs) closeCleanly(currentWs)
      wsRef.current = null
    }
  }, [enabled])

  const subscribeToOrder = useCallback((orderId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ action: 'subscribe-order', order_id: orderId }),
      )
    }
  }, [])

  const unsubscribeFromOrder = useCallback((orderId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ action: 'unsubscribe-order', order_id: orderId }),
      )
    }
  }, [])

  return { subscribeToOrder, unsubscribeFromOrder }
}
