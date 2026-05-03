import type { DataProvider, AuthProvider } from './types'

async function createProviders(): Promise<{ data: DataProvider; auth: AuthProvider }> {
  const mode = import.meta.env.VITE_DATA_PROVIDER ?? 'firebase'

  if (mode === 'local') {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'
    const [{ ApiDataProvider }, { ApiAuthProvider }] = await Promise.all([
      import('./api/ApiDataProvider'),
      import('./api/ApiAuthProvider'),
    ])
    return {
      data: new ApiDataProvider(baseUrl),
      auth: new ApiAuthProvider(baseUrl),
    }
  }

  const [{ FirebaseDataProvider }, { FirebaseAuthProvider }] = await Promise.all([
    import('./firebase/FirebaseDataProvider'),
    import('./firebase/FirebaseAuthProvider'),
  ])
  return {
    data: new FirebaseDataProvider(),
    auth: new FirebaseAuthProvider(),
  }
}

let _providers: { data: DataProvider; auth: AuthProvider } | null = null

export async function getProviders(): Promise<{ data: DataProvider; auth: AuthProvider }> {
  if (!_providers) {
    _providers = await createProviders()
  }
  return _providers
}

export function setProviders(p: { data: DataProvider; auth: AuthProvider }) {
  _providers = p
}
