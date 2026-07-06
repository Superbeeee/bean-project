import { Hono } from 'hono'
import db from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const app = new Hono()

app.get('/:uid', requireAuth(), (c) => {
  const uid = c.req.param('uid')
  const jwt = c.get('jwtPayload')

  if (jwt.sub !== uid) return c.json({ error: '無權限存取' }, 403)

  const row = db.prepare('SELECT * FROM users WHERE uid = ?').get(uid) as
    | { uid: string; email: string; display_name: string; photo_url: string; saved_address: string }
    | undefined

  if (!row) return c.json({ error: '使用者不存在' }, 404)

  return c.json({
    uid: row.uid,
    email: row.email,
    displayName: row.display_name,
    photoURL: row.photo_url,
    savedAddress: row.saved_address ? JSON.parse(row.saved_address) : undefined,
  })
})

app.put('/:uid', requireAuth(), async (c) => {
  const uid = c.req.param('uid')
  const jwt = c.get('jwtPayload')

  if (jwt.sub !== uid) return c.json({ error: '無權限存取' }, 403)

  const body = await c.req.json()

  // Partial upsert：body 未帶的欄位保留原值，避免部分更新（如只存地址）洗掉其他欄位
  db.prepare(`
    INSERT INTO users (uid, email, display_name, photo_url, saved_address)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(uid) DO UPDATE SET
      email = COALESCE(excluded.email, email),
      display_name = COALESCE(excluded.display_name, display_name),
      photo_url = COALESCE(excluded.photo_url, photo_url),
      saved_address = COALESCE(excluded.saved_address, saved_address)
  `).run(
    uid,
    body.email ?? null,
    body.displayName ?? null,
    body.photoURL ?? null,
    body.savedAddress ? JSON.stringify(body.savedAddress) : null,
  )

  return c.json({ ok: true })
})

export default app
