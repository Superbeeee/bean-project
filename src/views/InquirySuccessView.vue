<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center pt-[120px] lg:pt-[140px]">
    <div class="mx-auto max-w-lg px-4 text-center">
      <h2 class="mb-6 font-serif text-2xl italic">{{ t('inquirySuccess.title') }}</h2>
      <div class="text-sm leading-relaxed text-gray-600">
        <p>{{ t('inquirySuccess.line1') }}</p>
        <p>{{ t('inquirySuccess.line2') }}</p>
        <p>{{ t('inquirySuccess.line3') }}</p>
        <br />
        <p>{{ t('inquirySuccess.line4') }}</p>
        <p>{{ t('inquirySuccess.line5') }}</p>
        <p>{{ t('inquirySuccess.line6') }}</p>
        <p>{{ t('inquirySuccess.line7') }}</p>
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
