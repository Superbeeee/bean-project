/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_MEASUREMENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $asset: (path: string) => string
  }
}

// View Transitions API：TS 內建的 DOM lib 尚未涵蓋，這裡補上最小宣告。
// 本檔案是 module（結尾有 export {}），所以必須用 declare global 才能擴充全域型別。
declare global {
  interface ViewTransition {
    readonly finished: Promise<void>
    readonly ready: Promise<void>
    readonly updateCallbackDone: Promise<void>
    skipTransition(): void
  }

  interface Document {
    startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition
  }
}

export {}
