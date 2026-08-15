import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AuthStatus, User } from '../types/user'

const DEMO_OTP = '123456'
const STORAGE_KEY = 'sts_auth_user'

interface AuthContextValue {
  user: User | null
  status: AuthStatus
  isAuthenticated: boolean
  demoOtp: string
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as User) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = (u: User) => setUser(u)
  const logout = () => setUser(null)

  const value: AuthContextValue = {
    user,
    status: user ? 'logged-in' : 'logged-out',
    isAuthenticated: !!user,
    demoOtp: DEMO_OTP,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
