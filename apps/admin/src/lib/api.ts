import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth-store'

/** Backend origin, e.g. http://localhost:5000 (the `/api` suffix is optional). */
const resolveAdminOrigin = (): string => {
  const env = import.meta.env.VITE_API_URL
  if (env && env.trim() && !env.includes('localhost') && !env.includes('127.0.0.1')) {
    let cleaned = env.trim().replace(/\/+$/, '').replace(/\/api$/, '')
    if (cleaned.startsWith('http://')) cleaned = cleaned.replace(/^http:\/\//i, 'https://')
    return cleaned
  }
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('smartlist.uz')) {
    return 'https://yft-api.smartlist.uz'
  }
  const raw = (env || 'http://localhost:5000').replace(/\/+$/, '')
  return raw.replace(/\/api$/, '')
}

export const API_ORIGIN = resolveAdminOrigin()

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
  let url = path.trim()
  if (!url) return ''
  if (/^(blob:|data:)/i.test(url)) return url
  if (/^https?:\/\//i.test(url)) {
    if (typeof window !== 'undefined' && window.location.hostname.endsWith('smartlist.uz')) {
      if (url.includes('localhost:5000') || url.includes('127.0.0.1:5000')) {
        url = url.replace(/^https?:\/\/(localhost|127\.0\.0\.1):5000/i, 'https://yft-api.smartlist.uz')
      }
    }
    if (url.startsWith('http://') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
      url = url.replace(/^http:\/\//i, 'https://')
    }
    return url
  }
  return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`
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
    if (Array.isArray(msg) && typeof msg[0] === 'string') return msg[0]
    return error.message || fallback
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
