<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useFirebaseAuth } from '@/composables/useFirebaseAuth'
import LanguageSwitcher from './LanguageSwitcher.vue'

defineProps<{
  open: boolean
  theme?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const cart = useCartStore()
const authStore = useAuthStore()
const { logout } = useFirebaseAuth()

const navRoutes = [
  { to: '/shop', labelKey: 'nav.shopOnline', hoverKey: 'nav.shopOnlineHover' },
  { to: '/art', labelKey: 'nav.artPresent', hoverKey: 'nav.artPresentHover' },
  { to: '/menu', labelKey: 'nav.beanMenu', hoverKey: 'nav.beanMenuHover' },
  { to: '/map', labelKey: 'nav.whereBean', hoverKey: 'nav.whereBeanHover' },
]

async function handleLogout() {
  await logout()
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 lg:hidden" :class="open ? '' : 'pointer-events-none'">
      <!-- Backdrop (instant appear, fade out) -->
      <Transition name="fade">
        <div v-if="open" class="absolute inset-0 bg-black/10" @click="emit('close')"></div>
      </Transition>

      <!-- Menu Content (slide from left) -->
      <Transition name="slide">
        <div v-if="open" class="relative z-10 h-full w-[70%] bg-white px-5 py-12">
          <!-- Logo -->
          <div class="mb-8">
            <RouterLink to="/" @click="emit('close')">
              <img src="/photo/b-logo/LOGO.png" :alt="t('common.brandName')" class="w-[60px]" />
            </RouterLink>
          </div>

          <!-- Nav Links -->
          <ul class="space-y-9">
            <li v-for="item in navRoutes" :key="item.to">
              <RouterLink
                :to="item.to"
                class="block h-10 font-serif text-[13px] leading-10 tracking-wider text-black no-underline"
                @click="emit('close')"
              >
                {{ t(item.hoverKey) }}|{{ t(item.labelKey) }}
              </RouterLink>
            </li>
          </ul>

          <!-- Auth -->
          <div class="mt-10 border-t border-gray-100 pt-6">
            <template v-if="authStore.isLoggedIn">
              <p class="mb-2 text-sm text-gray-600">{{ authStore.displayName }}</p>
              <button
                class="text-sm text-gray-400 hover:text-primary"
                @click="handleLogout"
              >
                {{ t('auth.logout') }}
              </button>
            </template>
            <RouterLink
              v-else
              to="/login"
              class="block text-sm text-black no-underline hover:text-primary"
              @click="emit('close')"
            >
              {{ t('auth.loginRegister') }}
            </RouterLink>
          </div>

          <!-- Language Switcher -->
          <div class="mt-6">
            <LanguageSwitcher />
          </div>

          <!-- Social Links -->
          <ul class="mt-6 flex gap-2.5">
            <li>
              <a href="#" target="_blank">
                <img src="/photo/p-logo/p-fb.svg" alt="Facebook" class="w-[30px]" />
              </a>
            </li>
            <li>
              <a href="#" target="_blank">
                <img src="/photo/p-logo/p-ig.svg" alt="Instagram" class="w-[30px]" />
              </a>
            </li>
            <li>
              <RouterLink to="/inquiry" @click="emit('close')">
                <img src="/photo/p-logo/p-ask.svg" :alt="t('common.inquiry')" class="w-[30px]" />
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/cart" class="relative" @click="emit('close')">
                <img src="/photo/p-logo/p-cart.svg" :alt="t('common.cart')" class="w-[30px]" />
                <span
                  v-if="cart.itemCount > 0"
                  class="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white"
                >
                  {{ cart.itemCount }}
                </span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </Teleport>

</template>

<style scoped>
/* Backdrop fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Menu panel slide from left */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
