import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getProviders } from '@/services'
import type { AuthUser } from '@/services/types'
import type { UserProfile } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const profile = ref<UserProfile | null>(null)
  const initialized = ref(false)
  const loading = ref(true)

  const isLoggedIn = computed(() => !!user.value)
  const displayName = computed(() =>
    user.value?.displayName || user.value?.email?.split('@')[0] || ''
  )

  async function loadProfile(authUser: AuthUser) {
    const uid = authUser.uid
    const { data } = await getProviders()

    try {
      const existing = await data.getUserProfile(uid)

      // 等待 provider 回應期間，auth 狀態可能已變更
      if (user.value?.uid !== uid) return

      if (existing) {
        profile.value = existing
      } else {
        const newProfile: UserProfile = {
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
        }
        await data.setUserProfile(uid, newProfile)
        if (user.value?.uid === uid) {
          profile.value = newProfile
        }
      }
    } catch (e) {
      console.warn('[auth] 無法讀取 user profile:', e)
      if (user.value?.uid === uid) {
        profile.value = {
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
        }
      }
    }
  }

  async function init() {
    const { auth } = await getProviders()

    return new Promise<void>((resolve) => {
      auth.onAuthChange(async (authUser) => {
        const uid = authUser?.uid ?? null

        user.value = authUser
        if (!authUser) profile.value = null

        if (authUser && uid) {
          await loadProfile(authUser)
        }

        loading.value = false
        if (!initialized.value) {
          initialized.value = true
          resolve()
        }
      })
    })
  }

  async function updateSavedAddress(address: UserProfile['savedAddress']) {
    if (!user.value) return
    const { data } = await getProviders()
    try {
      await data.updateSavedAddress(user.value.uid, address)
      if (profile.value) {
        profile.value.savedAddress = address
      }
    } catch (e) {
      console.warn('[auth] 無法儲存地址:', e)
    }
  }

  return {
    user,
    profile,
    initialized,
    loading,
    isLoggedIn,
    displayName,
    init,
    updateSavedAddress,
  }
})
