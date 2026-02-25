<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useOrders } from '@/composables/useOrders'

const { t } = useI18n()
const router = useRouter()
const cart = useCartStore()
const authStore = useAuthStore()
const { submitting, error: orderError, createOrder } = useOrders()

const validationError = ref<string | null>(null)

function validate(): boolean {
  validationError.value = null

  if (!form.name.trim()) {
    validationError.value = t('checkout.errorName')
    return false
  }

  const phone = form.phone.replace(/-/g, '')
  if (!/^09\d{8}$/.test(phone)) {
    validationError.value = t('checkout.errorPhone')
    return false
  }

  if (form.delivery === '宅配') {
    if (!form.district.trim()) {
      validationError.value = t('checkout.errorDistrict')
      return false
    }
    if (!form.address.trim()) {
      validationError.value = t('checkout.errorAddress')
      return false
    }
  }

  return true
}

const form = reactive({
  name: '',
  phone: '',
  email: '',
  city: '台東縣',
  district: '',
  address: '',
  delivery: '宅配',
  payment: '貨到付款',
  note: '',
})

onMounted(() => {
  if (authStore.profile?.savedAddress) {
    const saved = authStore.profile.savedAddress
    form.name = saved.name
    form.phone = saved.phone
    form.city = saved.city
    form.district = saved.district
    form.address = saved.address
  }
  if (authStore.user?.email) {
    form.email = authStore.user.email
  }
})

async function handleSubmit() {
  if (!validate()) return

  const orderId = await createOrder(
    form,
    cart.items,
    {
      subtotal: cart.subtotal,
      shippingFee: cart.shippingFee,
      discount: cart.discount,
      total: cart.total,
    },
    authStore.user?.uid ?? null
  )

  if (orderId) {
    cart.clearCart()
    router.push({ name: 'checkout-success', query: { orderId } })
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 pt-[120px] pb-12 lg:pt-[140px]">
    <h1 class="mb-2 text-2xl font-bold">{{ t('checkout.title') }}</h1>
    <p class="mb-8 text-sm text-gray-500">{{ t('checkout.subtitle') }}</p>

    <!-- Order Summary -->
    <div class="mb-8 rounded-lg bg-gray-50 p-5">
      <h2 class="mb-3 text-sm font-bold">{{ t('checkout.orderSummary') }}</h2>
      <ul class="mb-3 space-y-2">
        <li
          v-for="item in cart.items"
          :key="item.id"
          class="flex justify-between text-sm"
        >
          <span>{{ item.name }} x {{ item.quantity }}</span>
          <span>NT.${{ item.price * item.quantity }}</span>
        </li>
      </ul>
      <div class="flex justify-between border-t border-gray-200 pt-3 text-sm">
        <span>{{ t('cart.shipping') }}</span>
        <span>NT.${{ cart.shippingFee }}</span>
      </div>
      <div class="mt-2 flex justify-between font-bold">
        <span>{{ t('cart.total') }}</span>
        <span class="text-primary">NT.${{ cart.total }}</span>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <h2 class="text-sm font-bold">{{ t('checkout.recipientInfo') }}</h2>

      <!-- Name -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">{{ t('checkout.name') }} <span class="text-red-500">*</span></label>
        <input
          v-model="form.name"
          type="text"
          required
          :placeholder="t('checkout.namePlaceholder')"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <!-- Phone -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">{{ t('checkout.phone') }} <span class="text-red-500">*</span></label>
        <input
          v-model="form.phone"
          type="tel"
          required
          :placeholder="t('checkout.phonePlaceholder')"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <!-- Email -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">{{ t('checkout.email') }}</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="example@mail.com"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div class="my-6 border-t border-dashed border-gray-300"></div>
      <h2 class="text-sm font-bold">{{ t('checkout.deliverySection') }}</h2>

      <!-- Delivery -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">{{ t('checkout.deliveryMethod') }}</label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.delivery" type="radio" value="宅配" class="accent-black" />
            {{ t('checkout.domesticDelivery') }}
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.delivery" type="radio" value="門市取貨" class="accent-black" />
            {{ t('checkout.storePickup') }}
          </label>
        </div>
      </div>

      <!-- Address (only for delivery) -->
      <template v-if="form.delivery === '宅配'">
        <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
          <label class="w-32 shrink-0 text-sm font-medium">{{ t('checkout.address') }} <span class="text-red-500">*</span></label>
          <div class="flex flex-1 gap-2">
            <select v-model="form.city" class="w-28 rounded border border-gray-300 px-2 py-2 text-sm">
              <option value="台東縣">{{ t('checkout.cityTaitung') }}</option>
              <option value="台北市">{{ t('checkout.cityTaipei') }}</option>
              <option value="新北市">{{ t('checkout.cityNewTaipei') }}</option>
              <option value="桃園市">{{ t('checkout.cityTaoyuan') }}</option>
              <option value="台中市">{{ t('checkout.cityTaichung') }}</option>
              <option value="台南市">{{ t('checkout.cityTainan') }}</option>
              <option value="高雄市">{{ t('checkout.cityKaohsiung') }}</option>
              <option value="其他">{{ t('checkout.cityOther') }}</option>
            </select>
            <input
              v-model="form.district"
              type="text"
              :placeholder="t('checkout.districtPlaceholder')"
              class="w-24 rounded border border-gray-300 px-2 py-2 text-sm"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
          <label class="w-32 shrink-0 text-sm font-medium"></label>
          <input
            v-model="form.address"
            type="text"
            required
            :placeholder="t('checkout.addressPlaceholder')"
            class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </template>

      <div class="my-6 border-t border-dashed border-gray-300"></div>
      <h2 class="text-sm font-bold">{{ t('checkout.paymentSection') }}</h2>

      <!-- Payment -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">{{ t('checkout.paymentMethod') }}</label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.payment" type="radio" value="貨到付款" class="accent-black" />
            {{ t('checkout.cod') }}
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.payment" type="radio" value="轉帳匯款" class="accent-black" />
            {{ t('checkout.bankTransfer') }}
          </label>
        </div>
      </div>

      <!-- Note -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-start">
        <label class="w-32 shrink-0 pt-2 text-sm font-medium">{{ t('checkout.notes') }}</label>
        <textarea
          v-model="form.note"
          rows="3"
          :placeholder="t('checkout.notesPlaceholder')"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        ></textarea>
      </div>

      <!-- 前端驗證錯誤 -->
      <p v-if="validationError" class="text-sm text-red-500">{{ validationError }}</p>
      <!-- 送出失敗錯誤 -->
      <p v-if="orderError" class="text-sm text-red-500">{{ orderError }}</p>

      <!-- Buttons -->
      <div class="flex gap-4 pt-6">
        <RouterLink
          to="/cart"
          class="flex-1 rounded bg-black py-3 text-center text-white no-underline transition-colors hover:bg-primary"
        >
          {{ t('checkout.backToCart') }}
        </RouterLink>
        <button
          type="submit"
          :disabled="submitting"
          class="flex-1 rounded bg-black py-3 text-center text-white transition-colors hover:bg-primary disabled:opacity-50"
        >
          {{ submitting ? t('checkout.submitting') : t('checkout.submit') }}
        </button>
      </div>
    </form>
  </div>
</template>
