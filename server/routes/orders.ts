import { Hono } from 'hono'
import { randomUUID } from 'crypto'
import db from '../db.js'
import { optionalAuth } from '../middleware/auth.js'

const app = new Hono()

app.post('/', optionalAuth(), async (c) => {
  const body = await c.req.json()
  const id = randomUUID()

  db.prepare(
    'INSERT INTO orders (id, user_id, data, status) VALUES (?, ?, ?, ?)'
  ).run(id, body.userId ?? null, JSON.stringify({ ...body, id }), 'pending')

  return c.json({ id }, 201)
})

export default app
