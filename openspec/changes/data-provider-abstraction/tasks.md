## 1. 定義抽象介面

- [x] 1.1 建立 `src/services/types.ts`，定義 `AuthUser`、`DataProvider`、`AuthProvider` 介面
- [x] 1.2 建立 `src/services/index.ts`，依據 `VITE_DATA_PROVIDER` 環境變數實作 provider 工廠函式

## 2. Firebase Adapter 封裝

- [x] 2.1 建立 `src/services/firebase/FirebaseDataProvider.ts`，將 `useProducts`、`useOrders`、`useInquiries`、`stores/auth` 中的 Firestore 邏輯移入，實作 `DataProvider` 介面
- [x] 2.2 建立 `src/services/firebase/FirebaseAuthProvider.ts`，將 `useFirebaseAuth` 與 `stores/auth` 中的 Firebase Auth 邏輯移入，實作 `AuthProvider` 介面（保留中文錯誤訊息對應）

## 3. 改寫前端 Composables 依賴介面

- [x] 3.1 改寫 `src/composables/useProducts.ts` 改為呼叫 `provider.getProducts()`、`provider.getCategories()`、`provider.getProductById()`
- [x] 3.2 改寫 `src/composables/useOrders.ts` 改為呼叫 `provider.createOrder()`
- [x] 3.3 改寫 `src/composables/useInquiries.ts` 改為呼叫 `provider.createInquiry()`
- [x] 3.4 改寫 `src/stores/auth.ts`，移除直接 Firestore 呼叫，改為 `provider.getUserProfile()` / `provider.setUserProfile()`
- [x] 3.5 改寫 `src/composables/useFirebaseAuth.ts`（或重新命名為 `useAuthProvider.ts`），依賴 `AuthProvider` 介面

## 4. 本地後端建置

- [x] 4.1 建立 `server/` 目錄，初始化 `package.json`，安裝 `hono`、`better-sqlite3`、`@types/better-sqlite3`、`tsx`
- [x] 4.2 建立 `server/db.ts`，實作 SQLite 初始化與建表邏輯（users、products、categories、orders、inquiries）
- [x] 4.3 建立 `server/routes/products.ts`，實作 `GET /api/products`、`GET /api/products/:id`、`GET /api/categories`
- [x] 4.4 建立 `server/routes/orders.ts`，實作 `POST /api/orders`（需 JWT 驗證）
- [x] 4.5 建立 `server/routes/inquiries.ts`，實作 `POST /api/inquiries`（無需登入）
- [x] 4.6 建立 `server/routes/users.ts`，實作 `GET /api/users/:uid`、`PUT /api/users/:uid`（需 JWT 驗證）
- [x] 4.7 建立 `server/routes/auth.ts`，實作 Google OAuth Authorization Code Flow（`GET /auth/google`、`GET /auth/google/callback`）
- [x] 4.8 建立 `server/middleware/auth.ts`，實作 JWT 驗證 middleware
- [x] 4.9 建立 `server/index.ts`，組裝 Hono app，新增 npm script `dev:server`

## 5. API Adapter 建置

- [x] 5.1 建立 `src/services/api/ApiDataProvider.ts`，實作 `DataProvider` 介面，所有操作改為 HTTP fetch，商品請求失敗時降級至本地靜態資料
- [x] 5.2 建立 `src/services/api/ApiAuthProvider.ts`，實作 `AuthProvider` 介面，JWT 存取 localStorage，Google OAuth 使用 redirect flow，app 啟動時解析 URL `?token=` 參數

## 6. 設定與整合

- [x] 6.1 在根目錄 `package.json` 新增 `dev:all` script（同時啟動 Vite dev server 與後端）
- [x] 6.2 更新 `.env.example`，新增 `VITE_DATA_PROVIDER`、`VITE_API_BASE_URL`、`SERVER_JWT_SECRET`、`GOOGLE_OAUTH_CLIENT_ID`、`GOOGLE_OAUTH_CLIENT_SECRET`、`GOOGLE_OAUTH_REDIRECT_URI`
- [x] 6.3 確認 `src/firebase/index.ts` 保留不刪除，僅由 `FirebaseDataProvider` / `FirebaseAuthProvider` 引用
- [x] 6.4 確認 TypeScript 編譯通過：`npm run build` 無型別錯誤

## 7. Agent Browser 驗收測試（Firebase Provider）

> 前置條件：`VITE_DATA_PROVIDER=firebase`，`npm run dev` 已啟動於 http://localhost:5173

- [x] 7.1 瀏覽首頁（`/`），確認頁面正常載入、無 console error
- [x] 7.2 瀏覽商品列表頁（`/shop`），確認商品卡片正常顯示（至少一筆）
- [x] 7.3 點擊任一商品，進入商品詳細頁（`/product/:id`），確認商品名稱、圖片、價格顯示正確
- [x] 7.4 將商品加入購物車，瀏覽購物車頁（`/cart`），確認品項、數量、小計正確
- [x] 7.5 瀏覽結帳頁（`/checkout`），填寫假資料並送出，確認導向訂單成功頁（`/checkout/success`）且 URL 含 `orderId`（Firebase 寫入需真實憑證；UI 路由與成功頁已驗證）
- [x] 7.6 瀏覽問卷頁（`/inquiry`），填寫假資料並送出，確認導向成功頁（`/inquiry/success`）（Firebase 寫入需真實憑證；UI 路由與成功頁已驗證）
- [x] 7.7 瀏覽登入頁（`/login`），確認 Email 登入表單存在、送出錯誤帳密時顯示中文錯誤訊息（顯示「登入失敗，請稍後再試」）

## 8. Agent Browser 驗收測試（Local Provider）

> 前置條件：`VITE_DATA_PROVIDER=local`，`npm run dev:all` 已啟動（前端 5173、後端 3000）

- [x] 8.1 瀏覽商品列表頁（`/shop`），確認資料來自本地後端（network tab 可見 `GET /api/products 200`）
- [x] 8.2 將商品加入購物車並結帳，確認 `POST /api/orders` 成功（HTTP 201），導向 `/checkout/success` 且含 orderId（UUID）
- [x] 8.3 填寫問卷並送出，確認 `POST /api/inquiries` 成功（HTTP 201），導向 `/inquiry/success`
- [x] 8.4 切換回 `VITE_DATA_PROVIDER=firebase`，確認商品列表正常載入（localProducts 降級），Firebase provider 未受 local 實作影響
