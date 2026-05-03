import { createMiddleware } from 'hono/factory'
import { jwtVerify } from 'jose'
import { getJwtSecret } from '../security.js'

export interface JwtPayload {
  sub: string
  email: string
  name: string
}

declare module 'hono' {
  interface ContextVariableMap {
    jwtPayload: JwtPayload
  }
}

export function requireAuth() {
  return createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: '未授權' }, 401)
    }

    const token = authHeader.slice(7)
    const secret = getJwtSecret()

    try {
      const { payload } = await jwtVerify(token, secret)
      c.set('jwtPayload', payload as unknown as JwtPayload)
      await next()
    } catch {
      return c.json({ error: 'Token 無效或已過期' }, 401)
    }
  })
}

/** 可選認證：有 token 則驗證並注入 payload；無 token 則以訪客身分繼續 */
export function optionalAuth() {
  return createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      const secret = getJwtSecret()
      try {
        const { payload } = await jwtVerify(token, secret)
        c.set('jwtPayload', payload as unknown as JwtPayload)
      } catch {
        // token 無效，以訪客身分繼續
      }
    }
    await next()
  })
}
