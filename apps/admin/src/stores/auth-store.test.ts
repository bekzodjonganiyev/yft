import { beforeEach, describe, expect, it, vi } from 'vitest'

async function importAuthStore() {
  return (await import('./auth-store')).useAuthStore
}

const user = {
  id: 'u1',
  name: 'Admin',
  email: 'admin@yft.uz',
  role: 'ADMIN' as const,
}

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('starts signed out when nothing is persisted', async () => {
    const store = await importAuthStore()
    expect(store.getState().auth.accessToken).toBe('')
    expect(store.getState().auth.user).toBeNull()
  })

  it('persists the session across reloads', async () => {
    const store = await importAuthStore()
    store.getState().auth.setSession('token-1', user)
    vi.resetModules()
    const reloaded = await importAuthStore()
    expect(reloaded.getState().auth.accessToken).toBe('token-1')
    expect(reloaded.getState().auth.user).toEqual(user)
  })

  it('reset clears the session and its persistence', async () => {
    const store = await importAuthStore()
    store.getState().auth.setSession('token-2', user)
    store.getState().auth.reset()
    expect(store.getState().auth.accessToken).toBe('')
    vi.resetModules()
    const reloaded = await importAuthStore()
    expect(reloaded.getState().auth.accessToken).toBe('')
  })
})

describe('isTokenValid', () => {
  const jwt = (payload: object) => `x.${btoa(JSON.stringify(payload))}.y`

  it('accepts a token that has not expired', async () => {
    const { isTokenValid } = await import('./auth-store')
    expect(isTokenValid(jwt({ exp: Date.now() / 1000 + 60 }))).toBe(true)
  })

  it('rejects expired, empty and malformed tokens', async () => {
    const { isTokenValid } = await import('./auth-store')
    expect(isTokenValid(jwt({ exp: Date.now() / 1000 - 60 }))).toBe(false)
    expect(isTokenValid('')).toBe(false)
    expect(isTokenValid('garbage')).toBe(false)
  })
})
