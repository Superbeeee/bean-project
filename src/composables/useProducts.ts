import { ref } from 'vue'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import {
  products as localProducts,
  categories as localCategories,
  type Product,
} from '@/data/products'

const productsCache = ref<Product[]>([])
const categoriesCache = ref<{ id: string; name: string }[]>([])
const loaded = ref(false)
const loading = ref(false)

function useLocalFallback() {
  productsCache.value = localProducts
  categoriesCache.value = localCategories
  loaded.value = true
}

export function useProducts() {
  const error = ref<string | null>(null)

  async function fetchProducts() {
    if (loaded.value) return
    if (loading.value) return

    loading.value = true
    error.value = null

    try {
      const snapshot = await getDocs(collection(db, 'products'))

      if (snapshot.empty) {
        console.warn('[useProducts] Firestore empty, using local data')
        useLocalFallback()
      } else {
        productsCache.value = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Product[]
        loaded.value = true
      }
    } catch (e) {
      console.warn('[useProducts] Firestore failed, using local data:', e)
      useLocalFallback()
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    if (categoriesCache.value.length > 0) return

    try {
      const snapshot = await getDocs(collection(db, 'categories'))

      if (snapshot.empty) {
        categoriesCache.value = localCategories
      } else {
        categoriesCache.value = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as { id: string; name: string }[]
      }
    } catch (e) {
      console.warn('[useProducts] Categories fallback to local:', e)
      categoriesCache.value = localCategories
    }
  }

  async function getProductById(id: string): Promise<Product | null> {
    const cached = productsCache.value.find((p) => p.id === id)
    if (cached) return cached

    // 如果還沒載入過，先從本地找
    return localProducts.find((p) => p.id === id) ?? null
  }

  return {
    products: productsCache,
    categories: categoriesCache,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    getProductById,
  }
}
