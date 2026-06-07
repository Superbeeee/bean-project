## ADDED Requirements

### Requirement: DataProvider 介面定義
系統 SHALL 在 `src/services/types.ts` 定義 `DataProvider` 介面，涵蓋 products、categories、orders、inquiries、users 的所有資料操作，讓 composables 只依賴介面而非具體實作。

#### Scenario: 取得商品列表
- **WHEN** composable 呼叫 `provider.getProducts()`
- **THEN** 回傳 `Promise<Product[]>`，資料結構與現有 `Product` type 相同

#### Scenario: 取得單一商品
- **WHEN** composable 呼叫 `provider.getProductById(id)`
- **THEN** 找到時回傳 `Promise<Product>`，找不到時回傳 `Promise<null>`

#### Scenario: 取得分類列表
- **WHEN** composable 呼叫 `provider.getCategories()`
- **THEN** 回傳 `Promise<{ id: string; name: string }[]>`

#### Scenario: 建立訂單
- **WHEN** composable 呼叫 `provider.createOrder(data)`
- **THEN** 回傳 `Promise<string>`，值為新建訂單的 ID

#### Scenario: 建立問卷
- **WHEN** composable 呼叫 `provider.createInquiry(data)`
- **THEN** 回傳 `Promise<void>`，成功則不拋出 error

#### Scenario: 讀取 user profile
- **WHEN** composable 呼叫 `provider.getUserProfile(uid)`
- **THEN** 存在時回傳 `Promise<UserProfile>`，不存在時回傳 `Promise<null>`

#### Scenario: 寫入 user profile
- **WHEN** composable 呼叫 `provider.setUserProfile(uid, data)`
- **THEN** 回傳 `Promise<void>`，完成後資料已持久化

---

### Requirement: AuthProvider 介面定義
系統 SHALL 在 `src/services/types.ts` 定義 `AuthProvider` 介面，涵蓋 email 登入、Google OAuth 登入、登出、auth 狀態監聽。

#### Scenario: Email 登入
- **WHEN** composable 呼叫 `authProvider.loginWithEmail(email, password)`
- **THEN** 成功時回傳 `AuthUser`，失敗時拋出帶有可讀訊息的 Error

#### Scenario: Google OAuth 登入
- **WHEN** composable 呼叫 `authProvider.loginWithGoogle()`
- **THEN** 觸發對應的 OAuth 流程（Firebase popup 或後端 redirect），完成後回傳 `AuthUser`

#### Scenario: 登出
- **WHEN** composable 呼叫 `authProvider.logout()`
- **THEN** 回傳 `Promise<void>`，登出後 auth 狀態更新

#### Scenario: Auth 狀態監聽
- **WHEN** 呼叫 `authProvider.onAuthChange(callback)`
- **THEN** 登入狀態改變時 callback 以 `AuthUser | null` 被呼叫，並回傳 unsubscribe function

---

### Requirement: Provider 工廠函式
系統 SHALL 在 `src/services/index.ts` 提供工廠函式，依據 `VITE_DATA_PROVIDER` 環境變數回傳正確的 provider 實例。

#### Scenario: Firebase provider 啟動
- **WHEN** `VITE_DATA_PROVIDER` 為 `firebase` 或未設定
- **THEN** 工廠回傳 `FirebaseDataProvider` 與 `FirebaseAuthProvider` 實例

#### Scenario: Local provider 啟動
- **WHEN** `VITE_DATA_PROVIDER` 為 `local`
- **THEN** 工廠回傳 `ApiDataProvider` 與 `ApiAuthProvider` 實例，API base URL 取自 `VITE_API_BASE_URL`
