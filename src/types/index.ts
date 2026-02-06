import type { Timestamp } from 'firebase/firestore'

export type { Product } from '@/data/products'
export type { CartItem } from '@/stores/cart'

export interface OrderItem {
  productId: string
  name: string
  price: number
  originalPrice: number
  quantity: number
  image: string
}

export interface Order {
  id?: string
  name: string
  phone: string
  email: string
  delivery: '宅配' | '門市取貨'
  city: string
  district: string
  address: string
  payment: '貨到付款' | '轉帳匯款'
  note: string
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  userId: string | null
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Timestamp
}

export interface Inquiry {
  id?: string
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
  status: 'new' | 'contacted' | 'closed'
  createdAt: Timestamp
}

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  savedAddress?: {
    name: string
    phone: string
    city: string
    district: string
    address: string
  }
}
