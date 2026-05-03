## Context

目前 Vue 3 SPA 的 composables 與 Pinia store 直接呼叫 Firebase SDK，資料層與 Firebase 緊耦合。要達到「保留 Firebase、同時可切換至自架 SQLite 後端」的目標，需要在資料存取層加入抽象介面，讓上層邏輯不感知底層實作。

現有依賴：
- `useProducts`、`useOrders`、`useInquiries` → 直接 import `firebase/firestore`
- `stores/auth`、`useFirebaseAuth` → 直接 import `firebase/auth`

## Goals / Non-Goals

**Goals:**
- 定義 `DataProvider` / `AuthProvider` 介面，讓 composables 只依賴介面
- 將現有 Firebase 邏輯包成 adapter，行為完全不變
- 建立本地 REST API adapter（呼叫自架後端）
- 建立輕量後端（Hono + better-sqlite3），提供等效 API
- 環境變數一行切換，不改前端業務邏輯
- Google OAuth 兩個 provider 都支援

**Non-Goals:**
- 不同時支援兩個 provider 混用（同一時間只用一個）
- 不實作資料同步或雙向 migration 工具
- 不改動 UI、路由、i18n、購物車邏輯
- 後端不實作完整的 Admin UI（PocketBase 方向暫不採用）

## Decisions

### Decision 1：Adapter Pattern vs. 直接重寫

**選擇**：Adapter Pattern（介面抽象 + 多實作）

**理由**：保留 Firebase 作為生產環境的安全網，本地 SQLite 作為開發/自架選項。兩者共存，透過環境變數切換，風險最低。

**放棄的方案**：直接移除 Firebase → 風險高，無法回退。

---

### Decision 2：後端框架選擇 Hono + better-sqlite3

**選擇**：Hono（輕量 TypeScript HTTP 框架）+ better-sqlite3（同步 SQLite driver）

**理由**：
- Hono 型別支援佳，與 TypeScript 專案風格一致
- better-sqlite3 同步 API 簡化 SQLite 操作
- 單一 `server/` 目錄，不引入 monorepo 複雜度
- 可用 `tsx` 直接執行，開發體驗與前端一致

**放棄的方案**：PocketBase → 黑盒，無法自訂邏輯；Express → 較冗餘

---

### Decision 3：Google OAuth 在本地後端的實作方式

**選擇**：後端實作標準 OAuth 2.0 Authorization Code Flow

```
前端           後端                    Google
  │── GET /auth/google ──▶ redirect ──▶ Google OAuth
  │                                         │
  │◀── callback: GET /auth/google/callback ─┘
  │        後端換 token、建立 user、簽發 JWT
  │◀── redirect 前端 /?token=<jwt>
  │
前端儲存 JWT → 後續 API 帶 Authorization: Bearer <jwt>
```

Firebase Auth 的 Google OAuth 繼續保留給 Firebase provider。

---

### Decision 4：前端 provider 工廠（單一進入點）

```typescript
// src/services/index.ts
const provider = import.meta.env.VITE_DATA_PROVIDER === 'local'
  ? new ApiDataProvider(import.meta.env.VITE_API_BASE_URL)
  : new FirebaseDataProvider()

export { provider }
```

Composables 改為 import `provider`，不再直接 import Firebase。

---

### Decision 5：Auth 分層

`useFirebaseAuth` 改名為 `useAuthProvider`，內部依賴 `AuthProvider` 介面：

- Firebase 模式：行為同現在
- Local 模式：呼叫後端 `/auth/*` endpoints，JWT 存於 localStorage

`stores/auth` 的 `onAuthStateChanged` 改為 `authProvider.onAuthChange()`，Local 模式用 JWT decode + refresh 模擬。

---

### Decision 6：資料庫 Schema（SQLite）

```sql
users      (uid, email, display_name, photo_url, saved_address_json, created_at)
products   (id, data_json, created_at, updated_at)
categories (id, name_json)
orders     (id, user_id, data_json, status, created_at)
inquiries  (id, data_json, status, created_at)
```

複雜欄位（多語言名稱、地址物件）存為 JSON column，避免過度正規化。

## Risks / Trade-offs

- **JWT 管理風險**：Local 模式改用 JWT，需處理 token 過期與 refresh。初期用長效 token（7天）降低複雜度，後續再加 refresh token。

- **本地後端維護負擔**：多了一個 server 要啟動、維護。緩解：`npm run dev:all` 同時啟動前後端；後端保持最小化，只做資料存取。

- **兩套 provider 同步維護**：新增功能時要改兩個 adapter。緩解：介面測試覆蓋兩個實作的行為一致性。

- **SQLite 並發限制**：SQLite 不適合高並發。對豆之間的流量規模（小型電商）無影響。

## Migration Plan

1. 建立介面與 Firebase Adapter（前端行為 0 變化）
2. 建立後端 + ApiAdapter（新增 `local` 選項）
3. 切換 composables 使用 provider（完成抽象）
4. 測試兩個 provider 切換正常
5. 生產環境繼續用 `VITE_DATA_PROVIDER=firebase`，本地開發可選 `local`

**回退**：任何步驟出問題，`git revert` 即可；Firebase 原始碼全程保留在 FirebaseAdapter 內。

## Open Questions

- 本地後端是否需要 HTTPS？（開發用 HTTP，生產部署時用 reverse proxy 加 TLS）
- JWT secret 管理：放 `.env` 的 `SERVER_JWT_SECRET`
