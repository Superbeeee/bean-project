import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import type { UserProfile } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const profile = ref<UserProfile | null>(null)
  const initialized = ref(false)
  const loading = ref(true)

  const isLoggedIn = computed(() => !!user.value)
  const displayName = computed(() =>
    user.value?.displayName || user.value?.email?.split('@')[0] || ''
  )

  function init() {
    return new Promise<void>((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        // 記錄當下的 uid，用來判斷 Firestore 非同步作業完成前
        // 若 onAuthStateChanged 再次觸發，結果是否已過時。
        const uid = firebaseUser?.uid ?? null

        user.value = firebaseUser
        if (!firebaseUser) profile.value = null

        const run = async () => {
          if (firebaseUser && uid) {
            try {
              const profileRef = doc(db, 'users', uid)
              const profileSnap = await getDoc(profileRef)

              // 等待 Firestore 回應期間，登入狀態可能已改變（如登出或切換帳號）。
              // 若使用者已變更，丟棄此次過時的結果，避免 user/profile 狀態不一致。
              if (user.value?.uid !== uid) return

              if (profileSnap.exists()) {
                profile.value = profileSnap.data() as UserProfile
              } else {
                const newProfile: UserProfile = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                }
                await setDoc(profileRef, newProfile)
                if (user.value?.uid === uid) {
                  profile.value = newProfile
                }
              }
            } catch (e) {
              console.warn('[auth] Failed to load/create user profile:', e)
              if (user.value?.uid === uid) {
                profile.value = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                }
              }
            }
          }

          loading.value = false
          if (!initialized.value) {
            initialized.value = true
            resolve()
          }
        }

        run()
      })
    })
  }

  async function updateSavedAddress(address: UserProfile['savedAddress']) {
    if (!user.value) return
    try {
      const profileRef = doc(db, 'users', user.value.uid)
      await setDoc(profileRef, { savedAddress: address }, { merge: true })
      if (profile.value) {
        profile.value.savedAddress = address
      }
    } catch (e) {
      console.warn('[auth] Failed to save address:', e)
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
