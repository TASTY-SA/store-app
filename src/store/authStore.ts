import { useSyncExternalStore } from 'react'
import type { AuthState, IUser } from '../features/auth/types'

type AuthCredentials = {
  user: string
  password: string
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

const login = (credentials: AuthCredentials) => {
  const normalizedUser = credentials.user.trim()
  const normalizedPassword = credentials.password.trim()

  if (!normalizedUser || !normalizedPassword) {
    return null
  }

  const user: IUser = {
    id: Date.now(),
    user: normalizedUser,
    password: normalizedPassword,
  }

  const token = btoa(`${normalizedUser}:${normalizedPassword}`)

  setState({ user, isAuthenticated: true, token })
  return user
}

const logout = () => {
  setState({ user: null, isAuthenticated: false, token: '' })
}

const checkAuth = () => currentState.user !== null && currentState.isAuthenticated && currentState.token.length > 0

currentState = {
  user: null,
  isAuthenticated: false,
  token: '',
  login,
  logout,
  checkAuth,
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useAuthStore(): AuthState
export function useAuthStore<T>(selector: (state: AuthState) => T): T
export function useAuthStore<T>(selector?: (state: AuthState) => T) {
  const selectState = selector ?? ((state: AuthState) => state as T)

  return useSyncExternalStore(
    subscribe,
    () => selectState(currentState),
    () => selectState(currentState),
  )
}
