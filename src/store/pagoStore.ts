import { create } from 'zustand'

/** Estados del proceso de pago con MercadoPago */
export type PagoStatus = 'idle' | 'pending' | 'success' | 'error'

export interface PagoState {
  /** Estado actual del flujo de pago */
  status: PagoStatus
  /** ID de preferencia devuelto por el backend al crear el pago */
  preferenceId: string | null
  /** ID del pedido asociado al pago en curso */
  pedidoId: number | null
  /** Mensaje de error si status === 'error' */
  error: string | null

  setPagoStatus: (status: PagoStatus) => void
  setPreferenceId: (id: string | null) => void
  setPedidoId: (id: number | null) => void
  setError: (error: string | null) => void
  /** Resetea el store al estado inicial (usar al salir del flujo de pago) */
  reset: () => void
}

const initialState = {
  status: 'idle' as PagoStatus,
  preferenceId: null,
  pedidoId: null,
  error: null,
}

export const usePagoStore = create<PagoState>()((set) => ({
  ...initialState,

  setPagoStatus: (status) => set({ status }),
  setPreferenceId: (preferenceId) => set({ preferenceId }),
  setPedidoId: (pedidoId) => set({ pedidoId }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}))
