import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AuthContextValue, LoginPayload, User } from '../types'

const SESSION_KEY = 'auth_session'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function getSessionUser(): User | null {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

const DEMO_CREDENTIALS: LoginPayload = {
  email: 'admin@demo.com',
  password: 'admin123',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getSessionUser())

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      async login(payload) {
        const isValid =
          payload.email.toLowerCase() === DEMO_CREDENTIALS.email &&
          payload.password === DEMO_CREDENTIALS.password

        if (!isValid) return false

        const nextUser: User = { email: DEMO_CREDENTIALS.email }
        localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
        setUser(nextUser)
        return true
      },
      logout() {
        localStorage.removeItem(SESSION_KEY)
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthStore() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthStore debe usarse dentro de AuthProvider')
  }

  return ctx
}
