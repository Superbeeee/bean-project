import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import productsRouter, { categoriesRouter } from './routes/products.js'
import ordersRouter from './routes/orders.js'
import inquiriesRouter from './routes/inquiries.js'
import usersRouter from './routes/users.js'
import authRouter from './routes/auth.js'

const app = new Hono()
const PORT = Number(process.env.PORT ?? 3000)

// CORS：允許前端 dev server
app.use('*', cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

// Routes
app.route('/api/products', productsRouter)
app.route('/api/categories', categoriesRouter)
app.route('/api/orders', ordersRouter)
app.route('/api/inquiries', inquiriesRouter)
app.route('/api/users', usersRouter)
app.route('/auth', authRouter)

app.get('/health', (c) => c.json({ status: 'ok' }))

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`[server] 本地後端啟動於 http://localhost:${PORT}`)
})
