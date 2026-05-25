import { useSyncExternalStore } from 'react'
import type { AuthState, IUser } from '../features/auth/types'
import { apiClient } from '../features/auth/services/axiosInstance'

type AuthCredentials = {
  user: string
  password: string
}

// Estructura de respuesta pública de usuario del backend
interface UserPublic {
  id: number
  username: string
  full_name: string
  email: string
  disabled: boolean
  roles: { codigo: str; nombre: str; descripcion?: string }[]
}

let currentState: AuthState

const listeners = new Set<() => void>()

const emitChange = () => {
  for (const listener of listeners) {
    listener()
  }
}

const setState = (partialState: Partial<AuthState>) => {
  currentState = { ...currentState, ...partialState }
  emitChange()
}

const login = async (credentials: AuthCredentials): Promise<IUser | null> => {
  const normalizedUser = credentials.user.trim()
  const normalizedPassword = credentials.password.trim()

  if (!normalizedUser || !normalizedPassword) {
    return null
  }

  try {
    // El backend recibe OAuth2PasswordRequestForm (form-urlencoded)
    const body = new URLSearchParams({
      username: normalizedUser,
      password: normalizedPassword,
    })

    await apiClient.post("/api/v1/auth/token", body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    // Si el login fue exitoso, rehidratamos la info llamando a /me
    const meRes = await apiClient.get<UserPublic>("/api/v1/auth/me")
    const user: IUser = {
      id: meRes.data.id,
      user: meRes.data.username,
      username: meRes.data.username,
      full_name: meRes.data.full_name,
      email: meRes.data.email,
      is_active: !meRes.data.disabled,
      role_codes: meRes.data.roles.map((r) => r.codigo),
    }

    setState({ user, isAuthenticated: true })
    return user
  } catch (err: any) {
    console.error("Error al iniciar sesión en el backend:", err)
    const msg = err.response?.data?.detail || "Usuario o contraseña incorrectos"
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg))
  }
}

const logout = async () => {
  try {
    await apiClient.post("/api/v1/auth/logout")
  } catch (err) {
    console.error("Error al cerrar sesión:", err)
  } finally {
    setState({ user: null, isAuthenticated: false })
  }
}

const checkAuth = async (): Promise<boolean> => {
  try {
    const res = await apiClient.get<UserPublic>("/api/v1/auth/me")
    const user: IUser = {
      id: res.data.id,
      user: res.data.username,
      username: res.data.username,
      full_name: res.data.full_name,
      email: res.data.email,
      is_active: !res.data.disabled,
      role_codes: res.data.roles.map((r) => r.codigo),
    }
    setState({ user, isAuthenticated: true })
    return true
  } catch (err) {
    setState({ user: null, isAuthenticated: false })
    return false
  }
}

// Inicializar estado por defecto
currentState = {
  user: null,
  isAuthenticated: false,
  login,
  logout,
  checkAuth,
}

// Intentar rehidratar la sesión de fondo al iniciar la app
const initAuth = async () => {
  try {
    const res = await apiClient.get<UserPublic>("/api/v1/auth/me")
    const user: IUser = {
      id: res.data.id,
      user: res.data.username,
      username: res.data.username,
      full_name: res.data.full_name,
      email: res.data.email,
      is_active: !res.data.disabled,
      role_codes: res.data.roles.map((r) => r.codigo),
    }
    setState({ user, isAuthenticated: true })
  } catch (err) {
    // Si no está logueado o expira, iniciamos en estado no autenticado limpio
    setState({ user: null, isAuthenticated: false })
  }
}
initAuth()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useAuthStore(): AuthState
export function useAuthStore<T>(selector: (state: AuthState) => T): T
export function useAuthStore<T>(selector?: (state: AuthState) => T) {
  const selectState = selector ?? ((state: AuthState) => state as unknown as T)

  return useSyncExternalStore(
    subscribe,
    () => selectState(currentState),
    () => selectState(currentState),
  )
}
