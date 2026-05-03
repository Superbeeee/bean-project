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

const FIRESTORE_TIMEOUT_MS = 10_000

function withTimeout<T>(p: Promise<T>, ms = FIRESTORE_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    p,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore timeout')), ms)
    ),
  ])
}

export class FirebaseDataProvider implements DataProvider {
  async getProducts(): Promise<Product[]> {
    const snapshot = await withTimeout(getDocs(collection(db, 'products')))
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Product)
  }

  async getCategories(): Promise<{ id: string; name: string }[]> {
    const snapshot = await withTimeout(getDocs(collection(db, 'categories')))
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as { id: string; name: string })
  }

  async getProductById(id: string): Promise<Product | null> {
    const snap = await withTimeout(getDoc(doc(db, 'products', id)))
    if (snap.exists()) return { id: snap.id, ...snap.data() } as Product
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
