import { ref } from 'vue'
import { collection, addDoc, serverTimestamp, type FieldValue } from 'firebase/firestore'
import { db } from '@/firebase'
import type { Order, OrderItem } from '@/types'
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
      // 寫入 Firestore 時 createdAt 必須是 FieldValue（serverTimestamp()），
      // 讀回後才會是 Timestamp。兩者型別不同，用獨立的寫入型別避免 as any。
      const orderData: Omit<Order, 'id' | 'createdAt'> & { createdAt: FieldValue } = {
        ...formData,
        delivery: formData.delivery as Order['delivery'],
        payment: formData.payment as Order['payment'],
        items: cartItemsToOrderItems(cartItems),
        subtotal: totals.subtotal,
        shippingFee: totals.shippingFee,
        discount: totals.discount,
        total: totals.total,
        userId,
        status: 'pending',
        createdAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, 'orders'), orderData)
      return docRef.id
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
