import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  quantity: number
}

const CART_STORAGE_KEY = 'soybean-space-cart'

function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadCartFromStorage())
  const shippingFee = ref(160)

  // 以明確呼叫取代 deep watch，避免每次巢狀屬性變動都觸發全量序列化
  function persistCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value))
  }

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const discount = computed(() => 0)

  const total = computed(() => subtotal.value - discount.value + shippingFee.value)

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  function addItem(product: Omit<CartItem, 'quantity'>, quantity = 1) {
    const existing = items.value.find((item) => item.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ ...product, quantity })
    }
    persistCart()
  }

  function removeItem(id: string) {
    items.value = items.value.filter((item) => item.id !== id)
    persistCart()
  }

  function updateQuantity(id: string, quantity: number) {
    const item = items.value.find((i) => i.id === id)
    if (item) {
      item.quantity = Math.max(0, quantity)
      if (item.quantity === 0) {
        removeItem(id) // removeItem 內已呼叫 persistCart
      } else {
        persistCart()
      }
    }
  }

  function clearCart() {
    items.value = []
    persistCart()
  }

  return {
    items,
    shippingFee,
    subtotal,
    discount,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
})
