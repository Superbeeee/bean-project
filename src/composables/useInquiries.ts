import { ref } from 'vue'
import { getProviders } from '@/services'

export function useInquiries() {
  const submitting = ref(false)
  const error = ref<string | null>(null)

  async function createInquiry(formData: {
    purpose: string
    company: string
    name: string
    phone: string
    companyTel: string
    email: string
    contactTime: string
    product: string
    quantity: string
    date: string
    source: string
  }): Promise<boolean> {
    submitting.value = true
    error.value = null

    try {
      const { data } = await getProviders()
      await data.createInquiry(formData)
      return true
    } catch (e) {
      error.value = '表單送出失敗，請稍後再試'
      console.error('Failed to create inquiry:', e)
      return false
    } finally {
      submitting.value = false
    }
  }

  return { submitting, error, createInquiry }
}
