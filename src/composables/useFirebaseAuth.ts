import { ref } from 'vue'
import { getProviders } from '@/services'
import type { AuthUser } from '@/services/types'

/**
 * 認證操作的 composable。
 * 內部依賴 AuthProvider 介面，不直接引用 Firebase SDK。
 * 對外 API 保持不變，LoginView 等元件無需修改。
 */
export function useFirebaseAuth() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loginWithEmail(email: string, password: string): Promise<AuthUser | null> {
    loading.value = true
    error.value = null
    try {
      const { auth } = await getProviders()
      return await auth.loginWithEmail(email, password)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '登入失敗，請稍後再試'
      return null
    } finally {
      loading.value = false
    }
  }

  async function registerWithEmail(
    email: string,
    password: string,
    displayName: string
  ): Promise<AuthUser | null> {
    loading.value = true
    error.value = null
    try {
      const { auth } = await getProviders()
      return await auth.registerWithEmail(email, password, displayName)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '註冊失敗，請稍後再試'
      return null
    } finally {
      loading.value = false
    }
  }

  async function loginWithGoogle(): Promise<AuthUser | null> {
    loading.value = true
    error.value = null
    try {
      const { auth } = await getProviders()
      return await auth.loginWithGoogle()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '登入失敗，請稍後再試'
      return null
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    const { auth } = await getProviders()
    await auth.logout()
  }

  return { loading, error, loginWithEmail, registerWithEmail, loginWithGoogle, logout }
}
