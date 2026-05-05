export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}

// 對外部 URL 與已含 base 前綴的路徑直接放行，其餘交給 asset() 補上前綴。
// 用於 provider 讀取外部資料（例如 Firestore）時正規化 image 欄位。
export function resolveAsset(path: string): string {
  if (!path) return path
  if (/^https?:\/\//i.test(path)) return path
  if (path.startsWith(import.meta.env.BASE_URL)) return path
  return asset(path)
}
