import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pedidoService } from '../services/pedidoService'
import type { IDetallePedido, IHistorialEstado, IPedido, EstadoCodigo } from '../IPedido'
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
  historial?: IHistorialEstado[]
}

// ──────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────

export function useMisPedidos() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const queryClient = useQueryClient()

  // Estado local para data lazy-loaded (detalles e historial se cargan al hacer toggle)
  const [detallesMap, setDetallesMap] = useState<Record<number, IDetallePedido[]>>({})
  const [historialMap, setHistorialMap] = useState<Record<number, IHistorialEstado[]>>({})

  // Set de IDs de pedidos a los que YA estamos suscriptos vía WS,
  // para no enviar subscribe-order duplicados.
  const subscribedRef = useRef<Set<number>>(new Set())

  // ── Main query ────────────────────────────────
  // TanStack Query maneja: fetching, loading/error states, caching,
  // refetch en foco, polling de fallback, y refetch manual.

  const {
    data: pedidosResp,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['pedidos'],
    queryFn: () => pedidoService.getMisPedidos(),
    enabled: isAuthenticated,
    staleTime: 60_000, // 1 min — mientras el WS funcione los datos llegan en tiempo real
    refetchInterval: 5 * 60_000, // polling de fallback cada 5 min si el WS falla
    select: (resp) =>
      [...resp.data].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
  })

  // ── Lazy load: detalles ───────────────────────
  // Se llama desde TarjetaPedido cuando el usuario hace toggle "Ver artículos".
  // Guardamos en un mapa local para mergear con los pedidos de la query.

  const loadDetalles = useCallback(async (pedidoId: number) => {
    if (detallesMap[pedidoId]) return // ya cargado
    try {
      const detalles = await pedidoService.getDetalles(pedidoId)
      setDetallesMap((prev) => ({ ...prev, [pedidoId]: detalles }))
    } catch {
      // Silencioso — los detalles son opcionales en la UI
    }
  }, [detallesMap])

  // ── Lazy load: historial ──────────────────────
  // Misma mecánica que loadDetalles, para la timeline de estados.

  const loadHistorial = useCallback(async (pedidoId: number) => {
    if (historialMap[pedidoId]) return // ya cargado
    try {
      const historial = await pedidoService.getHistorial(pedidoId)
      setHistorialMap((prev) => ({ ...prev, [pedidoId]: historial }))
    } catch {
      // Silencioso
    }
  }, [historialMap])

  // ── Cancelar pedido ────────────────────────────
  // useMutation con invalidación automática en onSuccess.

  const { mutateAsync: cancelarMutation } = useMutation({
    mutationFn: ({ pedidoId, motivo }: { pedidoId: number; motivo: string }) =>
      pedidoService.cancelar(pedidoId, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
    },
  })

  const cancelarPedido = useCallback(
    async (pedidoId: number, motivo: string) => {
      try {
        await cancelarMutation({ pedidoId, motivo })
      } catch {
        throw new Error('No se pudo cancelar el pedido.')
      }
    },
    [cancelarMutation],
  )

  // ── WebSocket ──────────────────────────────────

  const { subscribeToOrder, unsubscribeFromOrder } = useWebSocket({
    enabled: isAuthenticated,
    onMessage: useCallback(
      (msg: WsMessage) => {
        switch (msg.event) {
          // ── Reconexión: invalidar cache y re-suscribirse
          case 'WS_CONNECTED':
            queryClient.invalidateQueries({ queryKey: ['pedidos'] })
            subscribedRef.current.clear()
            break

          // ── Eventos de transición de estado
          case 'PEDIDO_CONFIRMADO':
          case 'PEDIDO_EN_PREPARACION':
          case 'PEDIDO_ENTREGADO':
          case 'PEDIDO_CANCELADO': {
            const wsData = msg.data as Partial<IPedido> | null
            if (!wsData?.id) break

            // Cargar historial actualizado para la timeline en tiempo real
            loadHistorial(wsData.id)

            // Invalidar query para que se refleje el cambio de estado
            queryClient.invalidateQueries({ queryKey: ['pedidos'] })
            break
          }
        }
      },
      [loadHistorial, queryClient],
    ),
  })

  // ── Efecto: mantener suscripciones WS sincronizadas ──
  // Se re-ejecuta cuando cambia la lista de pedidos (nuevos pedidos,
  // estados terminales, etc.)

  useEffect(() => {
    if (!isAuthenticated) {
      subscribedRef.current.clear()
      return
    }

    const activos = new Set<number>()

    ;(pedidosResp ?? []).forEach((p) => {
      if (isNonTerminal(p.estado_codigo)) {
        activos.add(p.id)
        if (!subscribedRef.current.has(p.id)) {
          subscribeToOrder(p.id)
          subscribedRef.current.add(p.id)
        }
      }
    })

    // Desuscribir pedidos que ya están en estado terminal
    subscribedRef.current.forEach((id) => {
      if (!activos.has(id)) {
        unsubscribeFromOrder(id)
        subscribedRef.current.delete(id)
      }
    })
  }, [pedidosResp, subscribeToOrder, unsubscribeFromOrder, isAuthenticated])

  // ── Merge: pedidos base + detalles lazy ────────

  const pedidos: PedidoConDetalles[] = useMemo(() => {
    return (pedidosResp ?? []).map((p) => ({
      ...p,
      detalles: detallesMap[p.id],
      historial: historialMap[p.id],
    }))
  }, [pedidosResp, detallesMap, historialMap])

  // ── Error como string (compatibilidad con MisPedidosPage) ──

  const error: string | null = queryError
    ? (queryError as Error).message ?? 'Error al cargar los pedidos'
    : null

  // ── Retorno (misma interfaz que antes) ─────────

  return { pedidos, loading: isLoading, error, refetch, loadDetalles, loadHistorial, cancelarPedido }
}
