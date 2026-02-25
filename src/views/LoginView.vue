<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useFirebaseAuth } from '@/composables/useFirebaseAuth'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { loading, error, loginWithEmail, registerWithEmail, loginWithGoogle } = useFirebaseAuth()

const isRegister = ref(false)
const form = ref({
  name: '',
  email: '',
  password: '',
})

// 切換登入/註冊模式時清除錯誤訊息
// 不能在 template inline handler 直接寫 error = null，
// 因為 error 是 ref，必須改 error.value
function clearError() {
  error.value = null
}

function redirectAfterAuth() {
  const redirect = route.query.redirect as string
  if (redirect && redirect.startsWith('/')) router.push(redirect)
  else router.push('/')
}

async function handleSubmit() {
  if (isRegister.value) {
    const user = await registerWithEmail(form.value.email, form.value.password, form.value.name)
    if (user) redirectAfterAuth()
  } else {
    const user = await loginWithEmail(form.value.email, form.value.password)
    if (user) redirectAfterAuth()
  }
}

async function handleGoogle() {
  const user = await loginWithGoogle()
  if (user) redirectAfterAuth()
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4 pt-[120px] pb-10">
    <div class="w-full max-w-md">
      <h1 class="mb-8 text-center text-2xl font-bold">
        {{ isRegister ? t('auth.register') : t('auth.login') }}
      </h1>

      <!-- Google Login -->
      <button
        class="mb-6 flex w-full items-center justify-center gap-3 rounded border border-gray-300 py-3 text-sm transition-colors hover:bg-gray-50"
        :disabled="loading"
        @click="handleGoogle"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {{ t('auth.googleLogin') }}
      </button>

      <div class="mb-6 flex items-center gap-3">
        <div class="h-px flex-1 bg-gray-200"></div>
        <span class="text-xs text-gray-400">{{ t('auth.orEmail') }}</span>
        <div class="h-px flex-1 bg-gray-200"></div>
      </div>

      <!-- Email/Password Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="isRegister">
          <label class="mb-1 block text-sm text-gray-600">{{ t('auth.name') }}</label>
          <input
            v-model="form.name"
            type="text"
            required
            autocomplete="name"
            class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            :placeholder="t('auth.namePlaceholder')"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm text-gray-600">{{ t('auth.email') }}</label>
          <input
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            :placeholder="t('auth.emailPlaceholder')"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm text-gray-600">{{ t('auth.password') }}</label>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="6"
            :autocomplete="isRegister ? 'new-password' : 'current-password'"
            class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            :placeholder="t('auth.passwordPlaceholder')"
          />
        </div>

        <!-- Error Message -->
        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded bg-black py-3 text-sm text-white transition-colors hover:bg-primary disabled:opacity-50"
        >
          {{ loading ? t('auth.processing') : isRegister ? t('auth.registerBtn') : t('auth.loginBtn') }}
        </button>
      </form>

      <!-- Toggle Login/Register -->
      <p class="mt-6 text-center text-sm text-gray-500">
        {{ isRegister ? t('auth.hasAccount') : t('auth.noAccount') }}
        <button
          class="text-primary hover:underline"
          @click="isRegister = !isRegister; clearError()"
        >
          {{ isRegister ? t('auth.loginLink') : t('auth.registerLink') }}
        </button>
      </p>
    </div>
  </div>
</template>
