import { create } from 'zustand'

/** Mirrors the user object returned by the backend (`POST /api/auth/login`, `GET /api/auth/me`). */
export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MANAGER'
}

const STORAGE_KEY = 'yft_admin_session'

interface Session {
  accessToken: string
  user: AuthUser | null
}

const readSession = (): Session => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Session>
      if (typeof parsed.accessToken === 'string') {
        return { accessToken: parsed.accessToken, user: parsed.user ?? null }
      }
    }
  } catch {
    /* storage blocked or corrupted — start signed out */
  }
  return { accessToken: '', user: null }
}

const writeSession = (session: Session | null) => {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

interface AuthState {
  auth: {
    user: AuthUser | null
    accessToken: string
    setSession: (accessToken: string, user: AuthUser) => void
    setUser: (user: AuthUser) => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  const initial = readSession()
  return {
    auth: {
      ...initial,
      setSession: (accessToken, user) => {
        writeSession({ accessToken, user })
        set((s) => ({ auth: { ...s.auth, accessToken, user } }))
      },
      setUser: (user) => {
        writeSession({ accessToken: get().auth.accessToken, user })
        set((s) => ({ auth: { ...s.auth, user } }))
      },
      reset: () => {
        writeSession(null)
        set((s) => ({ auth: { ...s.auth, accessToken: '', user: null } }))
      },
    },
  }
})

/** JWT `exp` check so an expired session is sent to the sign-in page before any request fails. */
export const isTokenValid = (token: string): boolean => {
  if (!token) return false
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    )
    return typeof payload.exp !== 'number' || payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}
