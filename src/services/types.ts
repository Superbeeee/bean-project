import type { Product } from '@/data/products'
import type { OrderItem, UserProfile } from '@/types'

export type { Product }

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────

/** Provider 無關的認證使用者資訊 */
export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export interface AuthProvider {
  loginWithEmail(email: string, password: string): Promise<AuthUser>
  registerWithEmail(email: string, password: string, displayName: string): Promise<AuthUser>
  loginWithGoogle(): Promise<AuthUser>
  logout(): Promise<void>
  /** 監聽 auth 狀態，回傳 unsubscribe function */
  onAuthChange(callback: (user: AuthUser | null) => void): () => void
}

// ──────────────────────────────────────────────
// Data input types（不含 Firebase 特定欄位）
// ──────────────────────────────────────────────

export interface OrderCreateInput {
  name: string
  phone: string
  email: string
  city: string
  district: string
  address: string
  delivery: '宅配' | '門市取貨'
  payment: '貨到付款' | '轉帳匯款'
  note: string
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  userId: string | null
}

export interface InquiryCreateInput {
  purpose: string
  company: string
  name: string
  phone: string
  companyTel: string
  email: string
  contactTime: string
  product: string
  quantity: string
  date: string
  source: string
}

// ──────────────────────────────────────────────
// DataProvider 介面
// ──────────────────────────────────────────────

export interface DataProvider {
  // Products
  getProducts(): Promise<Product[]>
  getCategories(): Promise<{ id: string; name: string }[]>
  getProductById(id: string): Promise<Product | null>

  // Orders
  createOrder(data: OrderCreateInput): Promise<string>

  // Inquiries
  createInquiry(data: InquiryCreateInput): Promise<void>

  // Users
  getUserProfile(uid: string): Promise<UserProfile | null>
  setUserProfile(uid: string, data: UserProfile): Promise<void>
  updateSavedAddress(uid: string, address: UserProfile['savedAddress']): Promise<void>
}
