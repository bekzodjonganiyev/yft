import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth-store'

/** Backend origin, e.g. http://localhost:5000 (the `/api` suffix is optional). */
const RAW_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '')
export const API_ORIGIN = RAW_URL.replace(/\/api$/, '')

export const api = axios.create({ baseURL: `${API_ORIGIN}/api` })
// No default Content-Type: axios sets JSON or multipart (with boundary) per request.

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().auth.accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const isLogin = error.config?.url?.includes('/auth/login')
    if (error.response?.status === 401 && !isLogin) {
      useAuthStore.getState().auth.reset()
      const redirect = window.location.pathname + window.location.search
      window.location.assign(
        `/sign-in?redirect=${encodeURIComponent(redirect)}`
      )
    }
    return Promise.reject(error)
  }
)

/** Turn a stored path (`/uploads/x.jpg`) into a URL the browser can load. */
export const mediaUrl = (path?: string | null): string => {
  if (!path) return ''
  if (/^(https?:|blob:|data:)/i.test(path)) return path
  return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`
}

/** Human-readable message from an API error (backend sends `{ success:false, message }`). */
export const errorMessage = (
  error: unknown,
  fallback = 'Xatolik yuz berdi'
): string => {
  if (error instanceof AxiosError) {
    if (!error.response)
      return "Serverga ulanib bo'lmadi. Backend ishlayaptimi?"
    const msg = (error.response.data as { message?: unknown } | undefined)
      ?.message
    if (typeof msg === 'string' && msg) return msg
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}

interface ApiEnvelope<T> {
  success: boolean
  data: T
  message?: string
}

export const unwrap = <T>(res: { data: ApiEnvelope<T> }): T => res.data.data

/** Build multipart form data, skipping undefined values. */
export const toFormData = (values: Record<string, unknown>): FormData => {
  const fd = new FormData()
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null) continue
    if (value instanceof Blob) fd.append(key, value)
    else fd.append(key, String(value))
  }
  return fd
}
