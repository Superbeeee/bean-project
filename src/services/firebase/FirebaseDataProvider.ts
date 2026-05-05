import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase'
import type { DataProvider, OrderCreateInput, InquiryCreateInput } from '@/services/types'
import type { Product } from '@/data/products'
import type { UserProfile } from '@/types'
import { resolveAsset } from '@/utils/asset'

const FIRESTORE_TIMEOUT_MS = 10_000

function withTimeout<T>(p: Promise<T>, ms = FIRESTORE_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    p,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore timeout')), ms)
    ),
  ])
}

// Firestore 內部 image 欄位若未含 base 前綴（例如 seed 進去的 raw path），
// 在讀取時補上，確保前端在 GitHub Pages 等子路徑部署環境下能正確載入。
function normalizeProduct(id: string, data: Record<string, unknown>): Product {
  const image = typeof data.image === 'string' ? resolveAsset(data.image) : data.image
  return { id, ...data, image } as Product
}

export class FirebaseDataProvider implements DataProvider {
  async getProducts(): Promise<Product[]> {
    const snapshot = await withTimeout(getDocs(collection(db, 'products')))
    return snapshot.docs.map((d) => normalizeProduct(d.id, d.data()))
  }

  async getCategories(): Promise<{ id: string; name: string }[]> {
    const snapshot = await withTimeout(getDocs(collection(db, 'categories')))
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as { id: string; name: string })
  }

  async getProductById(id: string): Promise<Product | null> {
    const snap = await withTimeout(getDoc(doc(db, 'products', id)))
    if (snap.exists()) return normalizeProduct(snap.id, snap.data())
    return null
  }

  async createOrder(data: OrderCreateInput): Promise<string> {
    const docRef = await withTimeout(
      addDoc(collection(db, 'orders'), {
        ...data,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
    )
    return docRef.id
  }

  async createInquiry(data: InquiryCreateInput): Promise<void> {
    await withTimeout(
      addDoc(collection(db, 'inquiries'), {
        ...data,
        status: 'new',
        createdAt: serverTimestamp(),
      })
    )
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(db, 'users', uid))
    if (snap.exists()) return snap.data() as UserProfile
    return null
  }

  async setUserProfile(uid: string, data: UserProfile): Promise<void> {
    await setDoc(doc(db, 'users', uid), data)
  }

  async updateSavedAddress(uid: string, address: UserProfile['savedAddress']): Promise<void> {
    await setDoc(doc(db, 'users', uid), { savedAddress: address }, { merge: true })
  }
}
