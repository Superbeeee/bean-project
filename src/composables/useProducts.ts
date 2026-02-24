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
// `loaded` 只在成功從 Firestore 取得資料時才設為 true。
// 使用本地備援資料時刻意不設定，讓下次進頁面可以重試 Firestore。
const loaded = ref(false)
const loading = ref(false)

function useLocalFallback() {
  productsCache.value = localProducts
  categoriesCache.value = localCategories
  // 不設定 loaded = true，保留下次重試 Firestore 的機會。
}

export function useProducts() {
  const error = ref<string | null>(null)

  async function fetchProducts() {
    if (loaded.value) return   // 已從 Firestore 取得最新資料，不重複請求
    if (loading.value) return  // 已有一個請求正在進行中，避免重複發送

    loading.value = true
    error.value = null

    try {
      const snapshot = await getDocs(collection(db, 'products'))

      if (snapshot.empty) {
        console.warn('[useProducts] Firestore products collection is empty, using local data')
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
    // 1. 先從記憶體快取中尋找（由完整 Firestore 抓取填入）
    const cached = productsCache.value.find((p) => p.id === id)
    if (cached) return cached

    // 2. 再從本地靜態資料中尋找（涵蓋編譯時打包的商品）
    const local = localProducts.find((p) => p.id === id)
    if (local) return local

    // 3. 最後直接向 Firestore 查詢單一商品。
    //    處理建置後才新增到 Firestore 的商品，
    //    或整批抓取時回退到本地資料、導致新商品沒進快取的情況。
    try {
      const docSnap = await getDoc(doc(db, 'products', id))
      if (docSnap.exists()) {
        const product = { id: docSnap.id, ...docSnap.data() } as Product
        productsCache.value.push(product)
        return product
      }
    } catch (e) {
      console.warn('[useProducts] 無法從 Firestore 取得指定商品:', e)
    }

    return null
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
