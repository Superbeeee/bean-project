import type { DataProvider, OrderCreateInput, InquiryCreateInput } from '@/services/types'
import type { Product } from '@/data/products'
import type { UserProfile } from '@/types'
import { resolveAsset } from '@/utils/asset'

function normalizeProduct(p: Product): Product {
  return typeof p.image === 'string' ? { ...p, image: resolveAsset(p.image) } : p
}

export class ApiDataProvider implements DataProvider {
  private baseUrl: string
  private getToken: () => string | null

  constructor(baseUrl: string, getToken: () => string | null = () => localStorage.getItem('auth_token')) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.getToken = getToken
  }

  private authHeaders(): Record<string, string> {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...this.authHeaders(),
        ...(init?.headers as Record<string, string> ?? {}),
      },
    })
    if (!res.ok) throw new Error(`API ${path} 回傳 ${res.status}`)
    return res.json() as Promise<T>
  }

  async getProducts(): Promise<Product[]> {
    const list = await this.fetchJson<Product[]>('/api/products')
    return list.map(normalizeProduct)
  }

  async getCategories(): Promise<{ id: string; name: string }[]> {
    return this.fetchJson<{ id: string; name: string }[]>('/api/categories')
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const product = await this.fetchJson<Product>(`/api/products/${id}`)
      return normalizeProduct(product)
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('404')) return null
      throw e
    }
  }

  async createOrder(data: OrderCreateInput): Promise<string> {
    const res = await this.fetchJson<{ id: string }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return res.id
  }

  async createInquiry(data: InquiryCreateInput): Promise<void> {
    await this.fetchJson('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      return await this.fetchJson<UserProfile>(`/api/users/${uid}`)
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('404')) return null
      throw e
    }
  }

  async setUserProfile(uid: string, data: UserProfile): Promise<void> {
    await this.fetchJson(`/api/users/${uid}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async updateSavedAddress(uid: string, address: UserProfile['savedAddress']): Promise<void> {
    await this.fetchJson(`/api/users/${uid}`, {
      method: 'PUT',
      body: JSON.stringify({ savedAddress: address }),
    })
  }
}
