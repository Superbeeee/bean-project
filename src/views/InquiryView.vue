<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  purpose: '公司贈禮',
  company: '',
  name: '',
  phone: '',
  companyTel: '',
  email: '',
  contactTime: '下午 13:00-15:00',
  product: '豆之間豆漿',
  quantity: '10-20(個)',
  date: '',
  source: 'FACEBOOK',
})

function handleSubmit() {
  router.push('/inquiry/success')
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 pt-[120px] lg:pt-[140px]">
    <!-- Slogan -->
    <div class="mb-8 text-center">
      <p class="mb-4 font-serif text-lg italic">
        It is wiser to find out than to suppose.
      </p>
      <h1 class="mb-6 text-2xl font-bold">企業大宗詢問</h1>
      <p class="text-sm leading-relaxed text-gray-600">
        你也對豆間產品充滿好奇，想知道還有哪些可能？<br />
        來吧！填妥這份豆豆VIP表格，我們一起發掘更多滋味驚喜<br />
        豆間產品訂購滿NT.5,000以上即享95折優惠<br />
        更多合作詢問，歡迎於營業時間來電 089-862050
      </p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Purpose -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">詢問項目</label>
        <select
          v-model="form.purpose"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option>公司贈禮</option>
          <option>品牌合作</option>
          <option>節慶贈禮</option>
        </select>
      </div>

      <!-- Company -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">公司名稱</label>
        <input
          v-model="form.company"
          type="text"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <!-- Contact Name -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">聯絡人</label>
        <input
          v-model="form.name"
          type="text"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <!-- Phone -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">手機號碼</label>
        <input
          v-model="form.phone"
          type="text"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <!-- Company Tel -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">公司電話(分機)</label>
        <input
          v-model="form.companyTel"
          type="text"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <!-- Email -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">電子郵件</label>
        <input
          v-model="form.email"
          type="email"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <!-- Divider -->
      <div class="my-6 border-t border-dashed border-gray-300"></div>

      <!-- Contact Time -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">方便聯繫時間</label>
        <select
          v-model="form.contactTime"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option>下午 13:00-15:00</option>
          <option>下午 15:00-17:00</option>
          <option>晚上 17:00-20:00</option>
        </select>
      </div>

      <!-- Product -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">需求產品</label>
        <select
          v-model="form.product"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option>豆之間豆漿</option>
          <option>豆之間豆包</option>
          <option>豆之間豆干</option>
        </select>
      </div>

      <!-- Quantity -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">需求個數</label>
        <select
          v-model="form.quantity"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option>10-20(個)</option>
          <option>20-30(個)</option>
          <option>30-40(個)</option>
          <option>40個以上</option>
        </select>
      </div>

      <!-- Date -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">需求日期</label>
        <input
          v-model="form.date"
          type="text"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <!-- Source -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">如何得知豆之間</label>
        <select
          v-model="form.source"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option>FACEBOOK</option>
          <option>Instagram</option>
          <option>部落格介紹</option>
          <option>報章雜誌</option>
        </select>
      </div>

      <!-- Submit -->
      <div class="pt-6 pb-12 text-center">
        <button
          type="submit"
          class="rounded bg-black px-12 py-3 text-white transition-colors hover:bg-primary"
        >
          確定送出
        </button>
      </div>
    </form>
  </div>
</template>
