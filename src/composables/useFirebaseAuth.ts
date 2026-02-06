import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { auth } from '@/firebase'
import { ref } from 'vue'

export function useFirebaseAuth() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loginWithEmail(email: string, password: string): Promise<User | null> {
    loading.value = true
    error.value = null
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (e: any) {
      error.value = mapAuthError(e.code)
      return null
    } finally {
      loading.value = false
    }
  }

  async function registerWithEmail(
    email: string,
    password: string,
    displayName: string
  ): Promise<User | null> {
    loading.value = true
    error.value = null
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName })
      return result.user
    } catch (e: any) {
      error.value = mapAuthError(e.code)
      return null
    } finally {
      loading.value = false
    }
  }

  async function loginWithGoogle(): Promise<User | null> {
    loading.value = true
    error.value = null
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (e: any) {
      error.value = mapAuthError(e.code)
      return null
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    await signOut(auth)
  }

  return { loading, error, loginWithEmail, registerWithEmail, loginWithGoogle, logout }
}

function mapAuthError(code: string): string {
  const map: Record<string, string> = {
    'auth/email-already-in-use': '此電子郵件已被註冊',
    'auth/invalid-email': '電子郵件格式不正確',
    'auth/user-not-found': '查無此帳號',
    'auth/wrong-password': '密碼錯誤',
    'auth/weak-password': '密碼強度不足（至少6個字元）',
    'auth/popup-closed-by-user': '登入視窗已關閉',
    'auth/invalid-credential': '帳號或密碼錯誤',
  }
  return map[code] || '登入失敗，請稍後再試'
}
