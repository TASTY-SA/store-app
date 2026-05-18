export type User = {
  email: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<boolean>
  logout: () => void
}
