import { useCallback, useEffect, useRef, useState } from 'react'
import { pedidoService } from '../services/pedidoService'
import type { IDetallePedido, IPedido } from '../IPedido'

interface PedidoConDetalles extends IPedido {
  detalles?: IDetallePedido[]
}

export function useMisPedidos() {
  const [pedidos, setPedidos] = useState<PedidoConDetalles[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchPedidos = useCallback(async () => {
    try {
      const list = await pedidoService.getMisPedidos()
      const pedidosOrdenados = [...list.data].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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

  const loadDetalles = useCallback(async (pedidoId: number) => {
    try {
      const detalles = await pedidoService.getDetalles(pedidoId)
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, detalles } : p))
      )
    } catch {
      // Silencioso — los detalles son opcionales en la UI
    }
  }, [])

  useEffect(() => {
    fetchPedidos()
    // Polling cada 60 segundos para reflejar cambios de estado del backend
    intervalRef.current = setInterval(fetchPedidos, 60_000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchPedidos])

  return { pedidos, loading, error, refetch: fetchPedidos, loadDetalles }
}
