import { ref } from 'vue'
import { getProviders } from '@/services'
import type { OrderItem } from '@/types'
import type { CartItem } from '@/stores/cart'

export function useOrders() {
  const submitting = ref(false)
  const error = ref<string | null>(null)

  function cartItemsToOrderItems(items: CartItem[]): OrderItem[] {
    return items.map((item) => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: item.quantity,
      image: item.image,
    }))
  }

  async function createOrder(
    formData: {
      name: string
      phone: string
      email: string
      city: string
      district: string
      address: string
      delivery: string
      payment: string
      note: string
    },
    cartItems: CartItem[],
    totals: {
      subtotal: number
      shippingFee: number
      discount: number
      total: number
    },
    userId: string | null = null
  ): Promise<string | null> {
    submitting.value = true
    error.value = null

    try {
      const { data } = await getProviders()
      const orderId = await data.createOrder({
        ...formData,
        delivery: formData.delivery as '宅配' | '門市取貨',
        payment: formData.payment as '貨到付款' | '轉帳匯款',
        items: cartItemsToOrderItems(cartItems),
        subtotal: totals.subtotal,
        shippingFee: totals.shippingFee,
        discount: totals.discount,
        total: totals.total,
        userId,
      })
      return orderId
    } catch (e) {
      error.value = '訂單送出失敗，請稍後再試'
      console.error('Failed to create order:', e)
      return null
    } finally {
      submitting.value = false
    }
  }

  return { submitting, error, createOrder }
}
