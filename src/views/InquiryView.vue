<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useInquiries } from '@/composables/useInquiries'

const { t } = useI18n()
const router = useRouter()
const { submitting, error: inquiryError, createInquiry } = useInquiries()

const validationError = ref<string | null>(null)

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

function validate(): boolean {
  validationError.value = null

  if (!form.name.trim()) {
    validationError.value = '請填寫聯絡人姓名'
    return false
  }

  const phone = form.phone.replace(/-/g, '')
  if (!/^09\d{8}$/.test(phone)) {
    validationError.value = '請填寫正確的手機號碼（格式：09XXXXXXXX）'
    return false
  }

  return true
}

async function handleSubmit() {
  if (!validate()) return

  const success = await createInquiry(form)
  if (success) {
    router.push('/inquiry/success')
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 pt-[120px] lg:pt-[140px]">
    <!-- Slogan -->
    <div class="mb-8 text-center">
      <p class="mb-4 font-serif text-lg italic">
        {{ t('inquiry.slogan') }}
      </p>
      <h1 class="mb-6 text-2xl font-bold">{{ t('inquiry.title') }}</h1>
      <p class="text-sm leading-relaxed text-gray-600">
        {{ t('inquiry.desc1') }}<br />
        {{ t('inquiry.desc2') }}<br />
        {{ t('inquiry.desc3') }}<br />
        {{ t('inquiry.desc4') }}
      </p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Purpose -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">{{ t('inquiry.purpose') }}</label>
        <select
          v-model="form.purpose"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="公司贈禮">{{ t('inquiry.purposeGift') }}</option>
          <option value="品牌合作">{{ t('inquiry.purposeCollab') }}</option>
          <option value="節慶贈禮">{{ t('inquiry.purposeHoliday') }}</option>
        </select>
      </div>

      <!-- Company -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">{{ t('inquiry.company') }}</label>
        <input
          v-model="form.company"
          type="text"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <!-- Contact Name -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">{{ t('inquiry.contact') }} <span class="text-red-500">*</span></label>
        <input
          v-model="form.name"
          type="text"
          required
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <!-- Phone -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">{{ t('inquiry.mobile') }} <span class="text-red-500">*</span></label>
        <input
          v-model="form.phone"
          type="text"
          required
          placeholder="09XXXXXXXX"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <!-- Company Tel -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">{{ t('inquiry.companyTel') }}</label>
        <input
          v-model="form.companyTel"
          type="text"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <!-- Email -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">{{ t('inquiry.email') }}</label>
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
        <label class="w-32 shrink-0 text-sm font-medium">{{ t('inquiry.contactTime') }}</label>
        <select
          v-model="form.contactTime"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="下午 13:00-15:00">{{ t('inquiry.time1') }}</option>
          <option value="下午 15:00-17:00">{{ t('inquiry.time2') }}</option>
          <option value="晚上 17:00-20:00">{{ t('inquiry.time3') }}</option>
        </select>
      </div>

      <!-- Product -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">{{ t('inquiry.product') }}</label>
        <select
          v-model="form.product"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="豆之間豆漿">{{ t('inquiry.productSoyMilk') }}</option>
          <option value="豆之間豆包">{{ t('inquiry.productTofuSkin') }}</option>
          <option value="豆之間豆干">{{ t('inquiry.productDriedTofu') }}</option>
        </select>
      </div>

      <!-- Quantity -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">{{ t('inquiry.quantity') }}</label>
        <select
          v-model="form.quantity"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="10-20(個)">{{ t('inquiry.qty1') }}</option>
          <option value="20-30(個)">{{ t('inquiry.qty2') }}</option>
          <option value="30-40(個)">{{ t('inquiry.qty3') }}</option>
          <option value="40個以上">{{ t('inquiry.qty4') }}</option>
        </select>
      </div>

      <!-- Date -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">{{ t('inquiry.date') }}</label>
        <input
          v-model="form.date"
          type="text"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <!-- Source -->
      <div class="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label class="w-32 shrink-0 text-sm font-medium">{{ t('inquiry.source') }}</label>
        <select
          v-model="form.source"
          class="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="FACEBOOK">{{ t('inquiry.sourceFB') }}</option>
          <option value="Instagram">{{ t('inquiry.sourceIG') }}</option>
          <option value="部落格介紹">{{ t('inquiry.sourceBlog') }}</option>
          <option value="報章雜誌">{{ t('inquiry.sourceMedia') }}</option>
        </select>
      </div>

      <!-- 前端驗證錯誤 -->
      <p v-if="validationError" class="text-center text-sm text-red-500">{{ validationError }}</p>
      <!-- 送出失敗錯誤 -->
      <p v-if="inquiryError" class="text-center text-sm text-red-500">{{ inquiryError }}</p>

      <!-- Submit -->
      <div class="pt-6 pb-12 text-center">
        <button
          type="submit"
          :disabled="submitting"
          class="rounded bg-black px-12 py-3 text-white transition-colors hover:bg-primary disabled:opacity-50"
        >
          {{ submitting ? t('inquiry.submitting') : t('inquiry.submit') }}
        </button>
      </div>
    </form>
  </div>
</template>
