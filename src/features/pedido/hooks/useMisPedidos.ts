import { useCallback, useEffect, useRef, useState } from 'react'
import { pedidoService } from '../services/pedidoService'
import type { IDetallePedido, IPedido, EstadoCodigo } from '../IPedido'
import { useWebSocket, type WsMessage } from '../../../hooks/useWebSocket'
import { useAuthStore } from '../../../store/authStore'

// ──────────────────────────────────────────────
// Constantes
// ──────────────────────────────────────────────

const ESTADOS_TERMINALES: EstadoCodigo[] = ['ENTREGADO', 'CANCELADO']

function isTerminal(estado: EstadoCodigo): boolean {
  return ESTADOS_TERMINALES.includes(estado)
}

function isNonTerminal(estado: EstadoCodigo): boolean {
  return !isTerminal(estado)
}

// ──────────────────────────────────────────────
// Tipos internos
// ──────────────────────────────────────────────

interface PedidoConDetalles extends IPedido {
  detalles?: IDetallePedido[]
}

// ──────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────

export function useMisPedidos() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const [pedidos, setPedidos] = useState<PedidoConDetalles[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Set de IDs de pedidos a los que YA estamos suscriptos vía WS,
  // para no enviar subscribe-order duplicados.
  const subscribedRef = useRef<Set<number>>(new Set())

  // Ref mutable para que el handler de WS (estable con []) pueda
  // llamar a la versión más reciente de fetchPedidos sin depender de ella.
  const fetchPedidosRef = useRef<() => Promise<void>>()

  // ── Fetch ──────────────────────────────────

  const fetchPedidos = useCallback(async () => {
    try {
      const list = await pedidoService.getMisPedidos()
      const pedidosOrdenados = [...list.data].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )

      // Fusionar con detalles ya cargados para no perderlos
      setPedidos((prev) => {
        const prevMap = new Map(prev.map((p) => [p.id, p]))
        return pedidosOrdenados.map((p) => ({
          ...p,
          detalles: prevMap.get(p.id)?.detalles,
        }))
      })
      setError(null)
    } catch {
      setError('No se pudieron cargar los pedidos.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Sincronizar la ref con la función real en cada render
  fetchPedidosRef.current = fetchPedidos

  // ── Detalles ───────────────────────────────

  const loadDetalles = useCallback(async (pedidoId: number) => {
    try {
      const detalles = await pedidoService.getDetalles(pedidoId)
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, detalles } : p)),
      )
    } catch {
      // Silencioso — los detalles son opcionales en la UI
    }
  }, [])

  // ── WebSocket ──────────────────────────────

  const { subscribeToOrder, unsubscribeFromOrder } = useWebSocket({
    enabled: isAuthenticated,
    onMessage: useCallback((msg: WsMessage) => {
      switch (msg.event) {
        // ── Reconexión: recargar datos y re-suscribirse
        case 'WS_CONNECTED':
          fetchPedidosRef.current?.()
          // subscribedRef se limpia para que el efecto de suscripción
          // (más abajo) vuelva a enviar subscribe-order a los pedidos activos.
          subscribedRef.current.clear()
          break

        // ── Eventos de transición de estado
        case 'PEDIDO_CONFIRMADO':
        case 'PEDIDO_EN_PREPARACION':
        case 'PEDIDO_ENTREGADO':
        case 'PEDIDO_CANCELADO': {
          const data = msg.data as Partial<IPedido> | null
          if (!data?.id) break

          setPedidos((prev) => {
            const idx = prev.findIndex((p) => p.id === data.id)
            if (idx === -1) {
              // El pedido no está en nuestro listado local → probablemente
              // es nuevo. No hacer nada; el próximo fetch (por
              // WS_CONNECTED o polling de fallback) lo traerá.
              return prev
            }
            const updated = { ...prev[idx], ...data }
            const next = [...prev]
            next[idx] = updated
            return next
          })
          break
        }
      }
    }, []), // ← estable: usa refs para acceder a valores actuales
  })

  // ── Efecto: fetch inicial + polling de fallback ──
  // Solo se activa cuando el usuario está autenticado.

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    fetchPedidos()

    // Polling de fallback cada 5 minutos por si el WS se cae y la
    // reconexión automática no logra recuperarse.
    const interval = setInterval(fetchPedidos, 5 * 60_000)
    return () => clearInterval(interval)
  }, [fetchPedidos, isAuthenticated])

  // ── Efecto: mantener suscripciones sincronizadas ──

  useEffect(() => {
    if (!isAuthenticated) {
      subscribedRef.current.clear()
      return
    }

    const activos = new Set<number>()

    // Suscribir pedidos activos que aún no lo están
    pedidos.forEach((p) => {
      if (isNonTerminal(p.estado_codigo)) {
        activos.add(p.id)
        if (!subscribedRef.current.has(p.id)) {
          subscribeToOrder(p.id)
          subscribedRef.current.add(p.id)
        }
      }
    })

    // Desuscribir pedidos que ya no están activos (terminales)
    subscribedRef.current.forEach((id) => {
      if (!activos.has(id)) {
        unsubscribeFromOrder(id)
        subscribedRef.current.delete(id)
      }
    })
  }, [pedidos, subscribeToOrder, unsubscribeFromOrder, isAuthenticated])

  // ── Retorno ────────────────────────────────

  return { pedidos, loading, error, refetch: fetchPedidos, loadDetalles }
}
