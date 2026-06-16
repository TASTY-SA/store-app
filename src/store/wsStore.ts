import { create } from 'zustand'

/** Estado de la conexión WebSocket hacia el backend */
export type WsStatus = 'connected' | 'disconnected' | 'reconnecting'

export interface WsState {
  /** Estado actual de la conexión */
  status: WsStatus
  /** Número de intentos de reconexión acumulados */
  attempts: number
  /** Último mensaje de error (null si no hay error) */
  error: string | null

  setStatus: (status: WsStatus) => void
  setError: (error: string | null) => void
  incrementAttempts: () => void
  resetAttempts: () => void
}

export const useWsStore = create<WsState>()((set, get) => ({
  status: 'disconnected',
  attempts: 0,
  error: null,

  setStatus: (status) => set({ status }),

  setError: (error) => set({ error }),

  incrementAttempts: () => set({ attempts: get().attempts + 1 }),

  resetAttempts: () => set({ attempts: 0 }),
}))
