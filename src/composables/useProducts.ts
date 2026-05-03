import { ref } from 'vue'
import { getProviders } from '@/services'
import {
  products as localProducts,
  categories as localCategories,
  type Product,
} from '@/data/products'

const productsCache = ref<Product[]>([])
const categoriesCache = ref<{ id: string; name: string }[]>([])
// `loaded` 只在成功從 provider 取得真實資料時才設為 true。
// 使用本地備援資料時刻意不設為 true，讓下次進頁面可以重試 provider。
const loaded = ref(false)
const loading = ref(false)

function useLocalFallback() {
  productsCache.value = localProducts
  categoriesCache.value = localCategories
  // 不設定 loaded = true，保留下次重試 provider 的機會。
}

export function useProducts() {
  const error = ref<string | null>(null)

  async function fetchProducts() {
    if (loaded.value) return
    if (loading.value) return

    loading.value = true
    error.value = null

    try {
      const { data } = await getProviders()
      const products = await data.getProducts()
      if (!products.length) {
        console.warn('[useProducts] provider 回傳空陣列，使用本地資料')
        useLocalFallback()
      } else {
        productsCache.value = products
        loaded.value = true
      }
    } catch (e) {
      console.warn('[useProducts] provider 失敗，使用本地資料:', e)
      useLocalFallback()
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    if (categoriesCache.value.length > 0) return
    try {
      const { data } = await getProviders()
      const cats = await data.getCategories()
      categoriesCache.value = cats.length ? cats : localCategories
    } catch (e) {
      console.warn('[useProducts] 取得分類失敗，使用本地資料:', e)
      categoriesCache.value = localCategories
    }
  }

  async function getProductById(id: string): Promise<Product | null> {
    const cached = productsCache.value.find((p) => p.id === id)
    if (cached) return cached

    try {
      const { data } = await getProviders()
      const product = await data.getProductById(id)
      if (product) productsCache.value.push(product)
      return product
    } catch (e) {
      console.warn('[useProducts] 無法取得指定商品:', e)
      return localProducts.find((p) => p.id === id) ?? null
    }
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
