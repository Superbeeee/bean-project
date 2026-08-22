<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, applyDocumentLang, type LocaleCode } from '@/i18n'

const props = withDefaults(
  defineProps<{
    theme?: string
    /** 下拉選單對齊方向：header 靠右、側邊選單靠左 */
    align?: 'left' | 'right'
  }>(),
  { theme: 'dark', align: 'right' },
)

const { locale } = useI18n()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const current = computed(
  () => SUPPORTED_LOCALES.find((l) => l.code === locale.value) ?? SUPPORTED_LOCALES[0],
)

// 點到元件外部時關閉下拉選單（與 AuthDropdown 相同做法，
// 用 nextTick 避開開啟當下那次點擊的冒泡）
function onDocumentClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    document.addEventListener('click', onDocumentClick)
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('click', onDocumentClick)
    document.removeEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})

async function applyLocale(code: LocaleCode) {
  locale.value = code
  localStorage.setItem('locale', code)
  applyDocumentLang(code)
  // 等 DOM 更新完成，View Transition 才能擷取到切換後的畫面
  await nextTick()
}

function switchLocale(code: LocaleCode) {
  open.value = false
  if (code === locale.value) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // 用 View Transition 讓全頁文字以淡入淡出交接，避免瞬間硬跳；
  // 瀏覽器不支援或使用者要求減少動態時，直接切換。
  if (!reduceMotion && typeof document.startViewTransition === 'function') {
    document.startViewTransition(() => applyLocale(code))
  } else {
    applyLocale(code)
  }
}
</script>

<template>
  <div ref="rootRef" class="relative">
    <!-- 收合狀態：只顯示目前語言 -->
    <button
      type="button"
      class="flex h-[30px] w-[30px] items-center justify-center rounded-full border text-[13px] leading-none transition-colors duration-300"
      :class="
        theme === 'white'
          ? 'border-white/50 text-white hover:border-white hover:bg-white/10'
          : 'border-black/30 text-black hover:border-black hover:bg-black/5'
      "
      :aria-label="current.name"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="open = !open"
    >
      {{ current.label }}
    </button>

    <!-- 展開狀態 -->
    <!-- 進場用 CSS keyframes 而非 <Transition>：切換語言時會啟動 View Transition，
         期間畫面凍結會讓 Vue 等不到 transitionend，面板會卡在 DOM 裡擋住點擊 -->
    <ul
      v-if="open"
      class="lang-dropdown absolute top-10 z-50 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
      :class="align === 'left' ? 'left-0' : 'right-0'"
      role="listbox"
    >
      <li v-for="l in SUPPORTED_LOCALES" :key="l.code">
        <button
          type="button"
          class="flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50"
          :class="locale === l.code ? 'font-bold text-primary' : 'text-gray-600'"
          role="option"
          :aria-selected="locale === l.code"
          @click="switchLocale(l.code)"
        >
          <span>{{ l.name }}</span>
          <span class="text-xs text-gray-400">{{ l.label }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.lang-dropdown {
  animation: lang-dropdown-in 0.18s ease-out;
}

@keyframes lang-dropdown-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lang-dropdown {
    animation: none;
  }
}
</style>
