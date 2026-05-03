import { Hono } from 'hono'
import { SignJWT } from 'jose'
import { randomUUID } from 'crypto'
import db from '../db.js'
import { hashPassword, verifyPassword, getJwtSecret } from '../security.js'

const app = new Hono()

const GOOGLE_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID ?? ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? ''
const REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URI ?? 'http://localhost:3000/auth/google/callback'
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173'

// 啟動 Google OAuth flow
app.get('/google', (c) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
  })
  return c.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
})

// Google OAuth callback
app.get('/google/callback', async (c) => {
  const code = c.req.query('code')
  if (!code) return c.json({ error: '缺少 authorization code' }, 400)

  // 換取 token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) return c.json({ error: 'Token 換取失敗' }, 400)
  const tokenData = await tokenRes.json() as { access_token: string }

  // 取得 user info
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })
  if (!userRes.ok) return c.json({ error: '無法取得使用者資訊' }, 400)
  const googleUser = await userRes.json() as {
    id: string
    email: string
    name: string
    picture: string
  }

  const uid = `google:${googleUser.id}`

  // Upsert user 至 SQLite
  db.prepare(`
    INSERT INTO users (uid, email, display_name, photo_url)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(uid) DO UPDATE SET
      email = excluded.email,
      display_name = excluded.display_name,
      photo_url = excluded.photo_url
  `).run(uid, googleUser.email, googleUser.name, googleUser.picture)

  // 簽發 JWT（有效期 7 天）
  const jwt = await new SignJWT({ sub: uid, email: googleUser.email, name: googleUser.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(getJwtSecret())

  // 導回前端，攜帶 token
  return c.redirect(`${FRONTEND_URL}/?token=${jwt}`)
})

// Email/Password 登入
app.post('/login', async (c) => {
  const { email, password } = await c.req.json() as { email: string; password: string }

  const row = db.prepare('SELECT uid, password_hash FROM users WHERE email = ?').get(email) as
    | { uid: string; password_hash: string }
    | undefined

  if (!row || !row.password_hash) return c.json({ error: '查無此帳號' }, 401)
  if (!verifyPassword(password, row.password_hash)) {
    return c.json({ error: '帳號或密碼錯誤' }, 401)
  }

  const userRow = db.prepare('SELECT * FROM users WHERE uid = ?').get(row.uid) as {
    uid: string; email: string; display_name: string; photo_url: string
  }

  const jwt = await new SignJWT({
    sub: userRow.uid,
    email: userRow.email,
    name: userRow.display_name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(getJwtSecret())

  return c.json({ token: jwt, user: { uid: userRow.uid, email: userRow.email, displayName: userRow.display_name } })
})

// Email/Password 註冊
app.post('/register', async (c) => {
  const { email, password, displayName } = await c.req.json() as {
    email: string; password: string; displayName: string
  }

  const existing = db.prepare('SELECT uid FROM users WHERE email = ?').get(email)
  if (existing) return c.json({ error: '此電子郵件已被註冊' }, 409)

  const uid = `email:${randomUUID()}`
  db.prepare(
    'INSERT INTO users (uid, email, display_name, password_hash) VALUES (?, ?, ?, ?)'
  ).run(uid, email, displayName, hashPassword(password))

  const jwt = await new SignJWT({ sub: uid, email, name: displayName })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(getJwtSecret())

  return c.json({ token: jwt, user: { uid, email, displayName } }, 201)
})

export default app
