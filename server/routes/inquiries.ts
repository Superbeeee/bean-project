import { Hono } from 'hono'
import { randomUUID } from 'crypto'
import db from '../db.js'

const app = new Hono()

app.post('/', async (c) => {
  const body = await c.req.json()
  const id = randomUUID()

  db.prepare(
    'INSERT INTO inquiries (id, data, status) VALUES (?, ?, ?)'
  ).run(id, JSON.stringify({ ...body, id }), 'new')

  return c.json({ id }, 201)
})

export default app
