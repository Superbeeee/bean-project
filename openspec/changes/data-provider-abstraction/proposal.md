## Why

Firebase 目前以臨時設定方式接入，資料完全託管於第三方雲端，無法自行備份或直接查詢。透過抽象化資料存取層，讓系統能在 Firebase 與本地 SQLite 後端之間彈性切換，兼顧現有穩定性與未來自主掌控資料的需求。

## What Changes

- 新增 `DataProvider` 與 `AuthProvider` 抽象介面，定義所有資料操作的契約
- 將現有 Firebase 邏輯重構為 `FirebaseDataProvider` 與 `FirebaseAuthProvider`，行為不變
- 新增 `ApiDataProvider` 與 `ApiAuthProvider`，透過 REST API 呼叫本地後端（SQLite）
- 新增環境變數 `VITE_DATA_PROVIDER`（`firebase` | `local`）控制切換
- 新增本地後端伺服器（Hono + better-sqlite3），提供對應的 REST API 與 Google OAuth flow
- 改寫 `useOrders`、`useInquiries`、`useProducts`、`stores/auth` 改為依賴介面，不直接引用 Firebase SDK

## Capabilities

### New Capabilities

- `data-provider-interface`: 定義 DataProvider / AuthProvider 抽象介面與 provider 工廠函式
- `firebase-adapter`: 將現有 Firebase 邏輯封裝為符合介面的 adapter
- `local-backend`: 本地 Hono + SQLite 後端，提供 REST API（products / orders / inquiries / users）與 Google OAuth
- `api-adapter`: 前端呼叫本地後端的 REST API adapter 實作

### Modified Capabilities

（無現有 spec，不適用）

## Impact

- **前端**：`src/composables/useOrders.ts`、`useInquiries.ts`、`useProducts.ts`、`stores/auth.ts` 改為呼叫 provider 介面
- **新增**：`src/services/` 目錄，放置介面定義與 adapter 實作
- **新增**：`server/` 目錄，放置本地後端（Node.js / Bun + Hono + SQLite）
- **依賴**：新增 `hono`、`better-sqlite3`（後端）；移除前端對 `firebase` 套件的直接依賴（改為只在 FirebaseAdapter 內使用）
- **環境變數**：新增 `VITE_DATA_PROVIDER`、`VITE_API_BASE_URL`
- **不影響**：UI、路由、i18n、Pinia store 結構（cart）、Tailwind 樣式
