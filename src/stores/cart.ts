import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

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

  watch(items, (newItems) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems))
  }, { deep: true })

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
  }

  function removeItem(id: string) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  function updateQuantity(id: string, quantity: number) {
    const item = items.value.find((i) => i.id === id)
    if (item) {
      item.quantity = Math.max(0, quantity)
      if (item.quantity === 0) removeItem(id)
    }
  }

  function clearCart() {
    items.value = []
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
