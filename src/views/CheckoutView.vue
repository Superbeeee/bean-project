<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cart = useCartStore()

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

function handleSubmit() {
  cart.clearCart()
  router.push('/checkout/success')
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 pt-[120px] pb-12 lg:pt-[140px]">
    <h1 class="mb-2 text-2xl font-bold">填寫訂購資訊</h1>
    <p class="mb-8 text-sm text-gray-500">請填寫以下收件資訊，確認後送出訂單</p>

    <!-- Order Summary -->
    <div class="mb-8 rounded-lg bg-gray-50 p-5">
      <h2 class="mb-3 text-sm font-bold">訂單摘要</h2>
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
        <span>運費</span>
        <span>NT.${{ cart.shippingFee }}</span>
      </div>
      <div class="mt-2 flex justify-between font-bold">
        <span>總計</span>
        <span class="text-primary">NT.${{ cart.total }}</span>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <h2 class="text-sm font-bold">收件人資訊</h2>

      <!-- Name -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">收件人姓名 <span class="text-red-500">*</span></label>
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="請輸入姓名"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <!-- Phone -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">連絡電話 <span class="text-red-500">*</span></label>
        <input
          v-model="form.phone"
          type="tel"
          required
          placeholder="例：0912345678"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <!-- Email -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">電子郵件</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="example@mail.com"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div class="my-6 border-t border-dashed border-gray-300"></div>
      <h2 class="text-sm font-bold">配送方式</h2>

      <!-- Delivery -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">配送方式</label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.delivery" type="radio" value="宅配" class="accent-black" />
            本島宅配
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.delivery" type="radio" value="門市取貨" class="accent-black" />
            門市取貨
          </label>
        </div>
      </div>

      <!-- Address (only for delivery) -->
      <template v-if="form.delivery === '宅配'">
        <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
          <label class="w-32 shrink-0 text-sm font-medium">收件地址 <span class="text-red-500">*</span></label>
          <div class="flex flex-1 gap-2">
            <select v-model="form.city" class="w-28 rounded border border-gray-300 px-2 py-2 text-sm">
              <option>台東縣</option>
              <option>台北市</option>
              <option>新北市</option>
              <option>桃園市</option>
              <option>台中市</option>
              <option>台南市</option>
              <option>高雄市</option>
              <option>其他</option>
            </select>
            <input
              v-model="form.district"
              type="text"
              placeholder="區/鄉/鎮"
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
            placeholder="請輸入詳細地址"
            class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </template>

      <div class="my-6 border-t border-dashed border-gray-300"></div>
      <h2 class="text-sm font-bold">付款方式</h2>

      <!-- Payment -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">付款方式</label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.payment" type="radio" value="貨到付款" class="accent-black" />
            貨到付款
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.payment" type="radio" value="轉帳匯款" class="accent-black" />
            轉帳匯款
          </label>
        </div>
      </div>

      <!-- Note -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-start">
        <label class="w-32 shrink-0 pt-2 text-sm font-medium">備註</label>
        <textarea
          v-model="form.note"
          rows="3"
          placeholder="如有特殊需求請填寫"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        ></textarea>
      </div>

      <!-- Buttons -->
      <div class="flex gap-4 pt-6">
        <RouterLink
          to="/cart"
          class="flex-1 rounded bg-black py-3 text-center text-white no-underline transition-colors hover:bg-primary"
        >
          返回購物車
        </RouterLink>
        <button
          type="submit"
          class="flex-1 rounded bg-black py-3 text-center text-white transition-colors hover:bg-primary"
        >
          確認送出
        </button>
      </div>
    </form>
  </div>
</template>
