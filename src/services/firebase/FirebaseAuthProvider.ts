import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth } from '@/firebase'
import type { AuthProvider, AuthUser } from '@/services/types'

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  }
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

export class FirebaseAuthProvider implements AuthProvider {
  async loginWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return toAuthUser(result.user)
    } catch (e: unknown) {
      throw new Error(mapAuthError(e instanceof FirebaseError ? e.code : ''))
    }
  }

  async registerWithEmail(email: string, password: string, displayName: string): Promise<AuthUser> {
    try {
      const { updateProfile } = await import('firebase/auth')
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName })
      return toAuthUser(result.user)
    } catch (e: unknown) {
      throw new Error(mapAuthError(e instanceof FirebaseError ? e.code : ''))
    }
  }

  async loginWithGoogle(): Promise<AuthUser> {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return toAuthUser(result.user)
    } catch (e: unknown) {
      throw new Error(mapAuthError(e instanceof FirebaseError ? e.code : ''))
    }
  }

  async logout(): Promise<void> {
    await signOut(auth)
  }

  onAuthChange(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
      callback(firebaseUser ? toAuthUser(firebaseUser) : null)
    })
  }
}
