<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const orderId = route.query.orderId as string | undefined
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center pt-[120px] lg:pt-[140px]">
    <div class="mx-auto max-w-lg px-4 text-center">
      <h2 class="mb-6 font-serif text-2xl italic">{{ t('orderSuccess.title') }}</h2>
      <p v-if="orderId" class="mb-4 text-sm text-gray-400">訂單編號：{{ orderId }}</p>
      <div class="text-sm leading-relaxed text-gray-600">
        <p>{{ t('orderSuccess.line1') }}</p>
        <p>{{ t('orderSuccess.line2') }}</p>
        <br />
        <p>{{ t('orderSuccess.line3') }}</p>
        <p>{{ t('orderSuccess.line4') }}</p>
        <p>{{ t('orderSuccess.line5') }}</p>
        <p>{{ t('orderSuccess.line6') }}</p>
        <br />
        <p>{{ t('orderSuccess.line7') }}</p>
        <p>{{ t('orderSuccess.line8') }}</p>
      </div>

      <RouterLink
        to="/"
        class="mt-8 inline-block rounded bg-black px-8 py-3 text-white no-underline transition-colors hover:bg-primary"
      >
        {{ t('common.backToHome') }}
      </RouterLink>
    </div>
  </div>
</template>
