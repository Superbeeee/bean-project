import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

const KEY_LEN = 64
const SALT_LEN = 16

/** 以 scrypt + random salt 產生密碼雜湊。回傳格式為 `salt:hash`（hex）。 */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LEN).toString('hex')
  const hash = scryptSync(password, salt, KEY_LEN).toString('hex')
  return `${salt}:${hash}`
}

/** 驗證密碼。輸入為使用者送來的明碼與資料庫儲存的 `salt:hash` 字串。 */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, expectedHex] = stored.split(':')
  if (!salt || !expectedHex) return false
  const expected = Buffer.from(expectedHex, 'hex')
  const actual = scryptSync(password, salt, KEY_LEN)
  if (expected.length !== actual.length) return false
  return timingSafeEqual(expected, actual)
}

/**
 * 讀取 JWT 簽署密鑰。若未設定 SERVER_JWT_SECRET 則直接 throw，
 * 避免正式環境靜默使用不安全的預設值。
 */
export function getJwtSecret(): Uint8Array {
  const secret = process.env.SERVER_JWT_SECRET
  if (!secret || secret.length < 16) {
    throw new Error(
      '[server] SERVER_JWT_SECRET 未設定或太短（至少 16 字元）。請於 .env 設定隨機長字串。'
    )
  }
  return new TextEncoder().encode(secret)
}
