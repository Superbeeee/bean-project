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
      onAuthStateChanged(auth, async (firebaseUser) => {
        user.value = firebaseUser

        if (firebaseUser) {
          try {
            const profileRef = doc(db, 'users', firebaseUser.uid)
            const profileSnap = await getDoc(profileRef)

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
              profile.value = newProfile
            }
          } catch (e) {
            console.warn('[auth] Failed to load/create user profile:', e)
            profile.value = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            }
          }
        } else {
          profile.value = null
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
