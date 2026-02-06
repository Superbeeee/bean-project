import { useI18n } from 'vue-i18n'

/**
 * 商品翻譯 composable
 * 有 i18n key 就用翻譯，沒有就用 Firestore 原始中文作為 fallback
 */
export function useProductI18n() {
  const { t, te } = useI18n()

  function productName(id: string, fallback: string): string {
    const key = `product.${id}.name`
    return te(key) ? t(key) : fallback
  }

  function productDescription(id: string, fallback: string): string {
    const key = `product.${id}.description`
    return te(key) ? t(key) : fallback
  }

  function categoryName(id: string, fallback: string): string {
    const key = `category.${id}`
    return te(key) ? t(key) : fallback
  }

  return { productName, productDescription, categoryName }
}
