<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useFirebaseAuth } from '@/composables/useFirebaseAuth'

const { t } = useI18n()

const props = withDefaults(defineProps<{ theme?: string }>(), {
  theme: 'dark',
})

const authStore = useAuthStore()
const { logout } = useFirebaseAuth()
const dropdownOpen = ref(false)

async function handleLogout() {
  await logout()
  dropdownOpen.value = false
}
</script>

<template>
  <div class="relative">
    <!-- Not logged in -->
    <RouterLink
      v-if="!authStore.isLoggedIn"
      to="/login"
      class="flex h-[30px] w-[30px] items-center justify-center rounded-full transition-colors duration-300 hover:text-primary"
      :class="theme === 'white' ? 'text-white' : 'text-black'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    </RouterLink>

    <!-- Logged in -->
    <template v-else>
      <button
        class="flex h-[30px] w-[30px] items-center justify-center rounded-full transition-colors duration-300 hover:text-primary"
        :class="theme === 'white' ? 'text-white' : 'text-black'"
        @click="dropdownOpen = !dropdownOpen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Dropdown -->
      <Transition name="dropdown">
        <div
          v-if="dropdownOpen"
          class="absolute right-0 top-10 z-50 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg"
        >
          <div class="border-b border-gray-100 px-4 py-2">
            <p class="text-sm font-medium text-gray-900">{{ authStore.displayName }}</p>
            <p class="truncate text-xs text-gray-500">{{ authStore.user?.email }}</p>
          </div>
          <button
            class="block w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
            @click="handleLogout"
          >
            {{ t('auth.logout') }}
          </button>
        </div>
      </Transition>

      <!-- Overlay to close dropdown -->
      <div
        v-if="dropdownOpen"
        class="fixed inset-0 z-40"
        @click="dropdownOpen = false"
      ></div>
    </template>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
