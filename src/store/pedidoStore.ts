import { create } from 'zustand'
import type { IPedido, EstadoCodigo } from '../features/pedido/IPedido'

/** Cachea los pedidos activos del cliente en memoria para UI sin polling */
export interface PedidoState {
  /** Lista de pedidos activos del cliente autenticado */
  pedidosActivos: IPedido[]
  /** ID del pedido que se está visualizando actualmente */
  pedidoActivoId: number | null

  setPedidosActivos: (pedidos: IPedido[]) => void
  /** Actualiza el estado de un pedido específico cuando llega un evento WS */
  updatePedidoEstado: (pedidoId: number, estadoCodigo: EstadoCodigo) => void
  setPedidoActivoId: (id: number | null) => void
  clearPedidos: () => void
}

export const usePedidoStore = create<PedidoState>()((set, get) => ({
  pedidosActivos: [],
  pedidoActivoId: null,

  setPedidosActivos: (pedidos) => set({ pedidosActivos: pedidos }),

  updatePedidoEstado: (pedidoId, estadoCodigo) => {
    const updated = get().pedidosActivos.map((p) =>
      p.id === pedidoId ? { ...p, estado_codigo: estadoCodigo } : p
    )
    set({ pedidosActivos: updated })
  },

  setPedidoActivoId: (id) => set({ pedidoActivoId: id }),

  clearPedidos: () => set({ pedidosActivos: [], pedidoActivoId: null }),
}))
