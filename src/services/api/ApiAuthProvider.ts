import type { AuthProvider, AuthUser } from '@/services/types'

const TOKEN_KEY = 'auth_token'

/** 簡易 JWT decode（不驗簽章，僅讀取 payload） */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(payload)) as Record<string, unknown>
  } catch {
    return null
  }
}

function isExpired(payload: Record<string, unknown>): boolean {
  const exp = payload['exp']
  if (typeof exp !== 'number') return false
  return Date.now() / 1000 > exp
}

function tokenToAuthUser(token: string): AuthUser | null {
  const payload = decodeJwtPayload(token)
  if (!payload || isExpired(payload)) return null
  return {
    uid: String(payload['sub'] ?? ''),
    email: typeof payload['email'] === 'string' ? payload['email'] : null,
    displayName: typeof payload['name'] === 'string' ? payload['name'] : null,
    photoURL: typeof payload['picture'] === 'string' ? payload['picture'] : null,
  }
}

export class ApiAuthProvider implements AuthProvider {
  private baseUrl: string
  private callbacks: Set<(user: AuthUser | null) => void> = new Set()

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    // app 啟動時，若 URL 帶有 ?token=，自動存入 localStorage
    this.consumeTokenFromUrl()
  }

  private consumeTokenFromUrl() {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
      // 清除 URL 中的 token（避免重新整理再次觸發）
      params.delete('token')
      const newSearch = params.toString()
      const newUrl = newSearch
        ? `${window.location.pathname}?${newSearch}`
        : window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }

  private notify(user: AuthUser | null) {
    this.callbacks.forEach((cb) => cb(user))
  }

  onAuthChange(callback: (user: AuthUser | null) => void): () => void {
    // 立即以目前狀態呼叫
    const token = localStorage.getItem(TOKEN_KEY)
    const user = token ? tokenToAuthUser(token) : null
    callback(user)

    this.callbacks.add(callback)
    return () => this.callbacks.delete(callback)
  }

  async loginWithGoogle(): Promise<AuthUser> {
    // 導向後端 OAuth flow，頁面會被 redirect，不會 resolve
    window.location.href = `${this.baseUrl}/auth/google`
    return new Promise(() => { /* 等待 redirect */ })
  }

  async loginWithEmail(email: string, password: string): Promise<AuthUser> {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json() as { error: string }
      throw new Error(err.error ?? '登入失敗，請稍後再試')
    }
    const { token } = await res.json() as { token: string }
    localStorage.setItem(TOKEN_KEY, token)
    const user = tokenToAuthUser(token)!
    this.notify(user)
    return user
  }

  async registerWithEmail(email: string, password: string, displayName: string): Promise<AuthUser> {
    const res = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
    })
    if (!res.ok) {
      const err = await res.json() as { error: string }
      throw new Error(err.error ?? '註冊失敗，請稍後再試')
    }
    const { token } = await res.json() as { token: string }
    localStorage.setItem(TOKEN_KEY, token)
    const user = tokenToAuthUser(token)!
    this.notify(user)
    return user
  }

  async logout(): Promise<void> {
    localStorage.removeItem(TOKEN_KEY)
    this.notify(null)
  }
}
