<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 pt-[120px] pb-12 text-center">
    <p class="text-6xl font-bold">404</p>
    <p class="mt-4 text-sm text-gray-500">找不到這個頁面 / Page Not Found</p>
    <RouterLink
      to="/"
      class="mt-8 rounded bg-black px-6 py-3 text-sm text-white no-underline transition-colors hover:bg-primary"
    >
      {{ t('common.backToHome') }}
    </RouterLink>
  </div>
</template>
