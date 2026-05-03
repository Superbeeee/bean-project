# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

「豆之間」(Soybean Space) 的 Vue 3 電商 SPA，主要功能包含商品瀏覽、購物車、結帳、問卷調查及藝術展示。資料層採 DataProvider 抽象化設計，可在 Firebase（雲端）與本地 Hono + SQLite 後端之間切換。

## 常用指令

```bash
npm run dev          # 啟動 Vite dev server (http://localhost:5173)
npm run dev:server   # 單獨啟動本地後端 (http://localhost:3000)
npm run dev:all      # 同時啟動前端 + 本地後端（VITE_DATA_PROVIDER=local 用）
npm run build        # prebuild（i18n sync）→ vue-tsc 型別檢查 → vite build
npm run preview      # 預覽 production build
npm run sync:i18n    # 單獨同步 Google Sheets 翻譯至 src/locales/*.json
```

目前沒有設定 lint 或 test 指令。

## 架構概覽

### 技術棧

- **Vue 3** (Composition API) + **TypeScript** (strict mode)
- **Vite** + **Tailwind CSS v4**（透過 `@tailwindcss/vite` 整合）
- **Pinia**（全域狀態：`stores/auth.ts`, `stores/cart.ts`）
- **Vue Router 4**（11 個路由，使用 `meta.titleKey` 和 `meta.headerTheme`）
- **Vue-i18n v9**（4 語言：tw / en / jp / ko）
- **資料層**：DataProvider 抽象 → Firebase（Firestore + Auth）或本地後端（Hono + SQLite + JWT）二選一

### 關鍵架構模式

**DataProvider 抽象層**：`src/services/` 定義 `DataProvider` 與 `AuthProvider` 介面，composables 與 store 只依賴介面，不直接 import Firebase SDK。透過 `VITE_DATA_PROVIDER` 環境變數切換實作：

| 值 | 實作 | 說明 |
|---|---|---|
| `firebase`（預設）| `FirebaseDataProvider` / `FirebaseAuthProvider` | Firestore + Firebase Auth |
| `local` | `ApiDataProvider` / `ApiAuthProvider` | 透過 REST 呼叫 `server/`（SQLite + JWT）|

工廠函式在 `src/services/index.ts`，採 dynamic import 避免另一個 provider 的程式碼被打包進 bundle。

**本地後端（`server/`）**：Hono + better-sqlite3，提供等效 REST API。OAuth 採 Authorization Code Flow 由後端代換 token，回前端時帶 `?token=<jwt>`。密碼以 scrypt + random salt 雜湊；JWT secret 必須由 `SERVER_JWT_SECRET` 提供（`server/security.ts` 在缺少時 fail-fast）。

**本地降級策略**：`composables/useProducts.ts` 在 provider 失敗或回傳空資料時降級至 `src/data/products.ts` 的靜態資料，且不設 `loaded=true`，下次重新進入頁面會再嘗試 provider。降級行為**只在 composable 層**處理，provider 失敗時直接 throw。

**i18n Pipeline**：翻譯由 Google Sheets 管理，build 前透過 `scripts/sync-i18n.ts` 同步，產生 `src/locales/{tw,en,jp,ko}.json`。Sheets 有 5 個 tab：`ui`、`menu`、`products`、`categories`、`art`。使用 dot-notation key，script 會轉換為巢狀 JSON。缺少翻譯時降級至繁中（tw）。

**動態 Header 主題**：`AppHeader.vue` 讀取 `route.meta.headerTheme`，根據路由切換樣式（`light` / `dark`）。

**型別定義位置**：domain model（`Order`、`Inquiry`、`UserProfile`、`Product`、`CartItem`）統一放在 `src/types/`；DataProvider 介面與 input types 在 `src/services/types.ts`。

**TypeScript path alias**：`@/` 對應 `src/`。

### 目錄結構

```
src/
  composables/   # 業務邏輯封裝（依賴 DataProvider 介面）
  services/      # 資料層抽象
    types.ts                     # DataProvider / AuthProvider 介面
    index.ts                     # 工廠函式（依 VITE_DATA_PROVIDER 切換）
    firebase/                    # Firebase adapter
    api/                         # REST API adapter（呼叫 server/）
  stores/        # Pinia store
  views/         # 路由頁面
  data/          # 靜態降級資料
server/          # Hono + SQLite 本地後端
  routes/        # /api/products, /api/orders, /auth/* 等
  middleware/    # JWT 驗證
  security.ts    # 密碼雜湊 & JWT secret 載入
openspec/        # spec-driven 變更管理（changes/、specs/）
```

### Composables 分工

| Composable | 職責 |
|---|---|
| `useProducts` | 商品/分類資料讀取，provider 失敗時降級至本地靜態資料 |
| `useProductI18n` | 商品多語言欄位處理 |
| `useOrders` | 訂單建立（透過 `provider.createOrder`）|
| `useInquiries` | 問卷送出（透過 `provider.createInquiry`）|
| `useFirebaseAuth` | 認證操作封裝（內部依賴 `AuthProvider` 介面，名稱保留以避免大規模 import 改動）|

## 環境變數

```bash
# Provider 切換
VITE_DATA_PROVIDER=firebase   # firebase | local（預設 firebase）
VITE_API_BASE_URL=http://localhost:3000   # local 模式必填

# Firebase（VITE_DATA_PROVIDER=firebase 時必填）
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID

# Server（VITE_DATA_PROVIDER=local 時必填）
SERVER_JWT_SECRET                  # 隨機長字串，至少 16 字元，否則 server 啟動會 throw
GOOGLE_OAUTH_CLIENT_ID
GOOGLE_OAUTH_CLIENT_SECRET
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/auth/google/callback
FRONTEND_URL=http://localhost:5173

# i18n sync（選填）
GOOGLE_SHEET_ID
```

完整範本參見 `.env.example`。

## i18n 同步設定

執行 `npm run sync:i18n` 需要：
1. Google Cloud Service Account（已開啟 Sheets API 權限）
2. `service-account.json` 放在專案根目錄（已加入 `.gitignore`）

詳細設定步驟參見 `docs/I18N_SETUP.md`。

**注意**：翻譯字串中若含有 `|` 字元，必須跳脫為 `{'|'}`，否則 vue-i18n 會誤判為 plural 語法（參見 commit `76f1930`）。

## Vite 特殊設定

Dev server 設定了 `Cross-Origin-Opener-Policy: same-origin-allow-popups` header，讓 Google Auth popup 能正常運作。

## OpenSpec 工作流

本專案使用 `openspec/` 管理變更：`openspec/changes/<name>/` 為提案中的變更（含 proposal、design、tasks、specs delta），完成後同步至 `openspec/specs/<capability>/spec.md` 作為主規格。相關 slash command 在 `.claude/commands/opsx/`。
