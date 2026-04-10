# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

「豆之間」(Soybean Space) 的 Vue 3 電商 SPA，主要功能包含商品瀏覽、購物車、結帳、問卷調查及藝術展示。目前在 `refactor/vue3-migration` branch 進行 Vue 3 遷移重構。

## 常用指令

```bash
npm run dev          # 啟動 Vite dev server (http://localhost:5173)
npm run build        # 執行 prebuild（i18n sync）→ vue-tsc 型別檢查 → 打包
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
- **Firebase**（Firestore + Auth，支援 Google 登入與 Email/Password）
- **Vue-i18n v9**（4 語言：tw / en / jp / ko）

### 關鍵架構模式

**Firebase 降級策略**：`composables/useProducts.ts` 等 composable 在 Firebase 不可用時會自動降級至 `src/data/` 下的靜態資料，確保頁面不會崩潰。

**i18n Pipeline**：翻譯由 Google Sheets 管理，build 前透過 `scripts/sync-i18n.ts` 同步，產生 `src/locales/{tw,en,jp,ko}.json`。Sheets 有 5 個 tab：`ui`、`menu`、`products`、`categories`、`art`。使用 dot-notation key，script 會轉換為巢狀 JSON。缺少翻譯時降級至繁中（tw）。

**動態 Header 主題**：`AppHeader.vue` 讀取 `route.meta.headerTheme`，根據路由切換樣式（`light` / `dark`）。

**型別定義位置**：所有 domain model（`Order`、`Inquiry`、`UserProfile`、`Product`、`CartItem`）統一放在 `src/types/`。

**TypeScript path alias**：`@/` 對應 `src/`。

### Composables 分工

| Composable | 職責 |
|---|---|
| `useProducts` | 商品資料讀取（Firebase + 靜態降級）|
| `useProductI18n` | 商品多語言欄位處理 |
| `useOrders` | 訂單 CRUD |
| `useInquiries` | 問卷調查表單操作 |
| `useFirebaseAuth` | 認證邏輯封裝 |

## 環境變數

需要在 `.env` 中設定（Firebase 相關為必填）：

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
GOOGLE_SHEET_ID          # i18n sync 用（選填）
```

## i18n 同步設定

執行 `npm run sync:i18n` 需要：
1. Google Cloud Service Account（已開啟 Sheets API 權限）
2. `service-account.json` 放在專案根目錄（已加入 `.gitignore`）

詳細設定步驟參見 `docs/I18N_SETUP.md`。

**注意**：翻譯字串中若含有 `|` 字元，必須跳脫為 `{'|'}`，否則 vue-i18n 會誤判為 plural 語法（參見 commit `76f1930`）。

## Vite 特殊設定

Dev server 設定了 `Cross-Origin-Opener-Policy: same-origin-allow-popups` header，讓 Google Auth popup 能正常運作。
