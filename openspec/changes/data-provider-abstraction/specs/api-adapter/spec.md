## ADDED Requirements

### Requirement: ApiDataProvider 實作 DataProvider 介面
系統 SHALL 在 `src/services/api/ApiDataProvider.ts` 實作 `DataProvider` 介面，所有操作改為對後端 REST API 發送 HTTP 請求。

#### Scenario: API base URL 可設定
- **WHEN** 建立 `ApiDataProvider` 實例時
- **THEN** base URL 取自 `VITE_API_BASE_URL`（預設 `http://localhost:3000`）

#### Scenario: 商品請求失敗降級
- **WHEN** `GET /api/products` 回傳非 2xx 或網路錯誤
- **THEN** `getProducts()` 降級至本地靜態資料（`src/data/products.ts`），不拋出 error（與 Firebase adapter 行為一致）

#### Scenario: 訂單建立成功
- **WHEN** `POST /api/orders` 回傳 HTTP 201
- **THEN** `createOrder()` 回傳 response body 中的 `id` 字串

#### Scenario: 訂單建立失敗
- **WHEN** `POST /api/orders` 回傳非 2xx
- **THEN** `createOrder()` 拋出 Error，讓 composable 的 error ref 捕捉

---

### Requirement: ApiAuthProvider 實作 AuthProvider 介面
系統 SHALL 在 `src/services/api/ApiAuthProvider.ts` 實作 `AuthProvider` 介面，JWT 儲存於 localStorage，Google OAuth 使用後端 redirect flow。

#### Scenario: Google OAuth 啟動
- **WHEN** 呼叫 `ApiAuthProvider.loginWithGoogle()`
- **THEN** 瀏覽器導向後端 `/auth/google`，開始 OAuth redirect flow

#### Scenario: OAuth 完成後 token 解析
- **WHEN** OAuth callback 後前端 URL 含 `?token=<jwt>`
- **THEN** `ApiAuthProvider` 自動偵測並將 JWT 存入 localStorage，呼叫 auth change callback

#### Scenario: JWT 攜帶於 API 請求
- **WHEN** `ApiDataProvider` 發送需要授權的請求（orders、users）
- **THEN** 請求 header 包含 `Authorization: Bearer <jwt>`，token 從 localStorage 取得

#### Scenario: 登出清除 token
- **WHEN** 呼叫 `ApiAuthProvider.logout()`
- **THEN** 從 localStorage 移除 JWT，觸發 auth change callback 傳入 `null`

#### Scenario: onAuthChange 初始化
- **WHEN** 呼叫 `ApiAuthProvider.onAuthChange(callback)`
- **THEN** 立即以當前 localStorage 中的 JWT decode 結果（或 null）呼叫 callback，後續狀態改變時再次觸發
