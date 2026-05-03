import { Hono } from 'hono'
import db from '../db.js'

const app = new Hono()

app.get('/', (c) => {
  const rows = db.prepare('SELECT data FROM products').all() as { data: string }[]
  const products = rows.map((r) => JSON.parse(r.data))
  return c.json(products)
})

app.get('/:id', (c) => {
  const id = c.req.param('id')
  const row = db.prepare('SELECT data FROM products WHERE id = ?').get(id) as
    | { data: string }
    | undefined
  if (!row) return c.json({ error: '商品不存在' }, 404)
  return c.json(JSON.parse(row.data))
})

export default app

// 單獨 export 供 index.ts 掛載 /api/categories
export const categoriesRouter = new Hono()

categoriesRouter.get('/', (c) => {
  const rows = db.prepare('SELECT id, name FROM categories').all() as { id: string; name: string }[]
  return c.json(rows)
})
