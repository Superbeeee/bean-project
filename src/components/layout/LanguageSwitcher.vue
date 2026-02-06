<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, type LocaleCode } from '@/i18n'

const { locale } = useI18n()

function switchLocale(code: LocaleCode) {
  locale.value = code
  localStorage.setItem('locale', code)
  document.documentElement.lang = code === 'tw' ? 'zh-TW' : code === 'jp' ? 'ja' : code
}
</script>

<template>
  <div class="flex gap-1">
    <button
      v-for="l in SUPPORTED_LOCALES"
      :key="l.code"
      :class="[
        'px-2 py-1 text-sm rounded transition-colors',
        locale === l.code
          ? 'bg-amber-700 text-white'
          : 'text-amber-800 hover:bg-amber-100',
      ]"
      @click="switchLocale(l.code)"
    >
      {{ l.label }}
    </button>
  </div>
</template>
