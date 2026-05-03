# firebase-adapter

**Purpose**: 將現有 Firebase SDK 呼叫封裝為符合 `DataProvider` 與 `AuthProvider` 介面的 adapter，讓 Firebase 成為可替換的實作選項之一，行為與原始邏輯完全一致。

## Requirements

### Requirement: FirebaseDataProvider 封裝現有 Firestore 邏輯
系統 SHALL 將 `useProducts`、`useOrders`、`useInquiries`、`stores/auth` 中現有的 Firestore 操作移入 `src/services/firebase/FirebaseDataProvider.ts`，實作 `DataProvider` 介面，外部行為與現在完全相同。

#### Scenario: 商品降級機制保留
- **WHEN** Firestore 無法連線或 collection 為空
- **THEN** `FirebaseDataProvider.getProducts()` 自動降級至本地靜態資料（`src/data/products.ts`），不拋出 error

#### Scenario: 訂單寫入使用 serverTimestamp
- **WHEN** 呼叫 `FirebaseDataProvider.createOrder(data)`
- **THEN** Firestore document 的 `createdAt` 欄位使用 `serverTimestamp()`，與現有行為一致

#### Scenario: 介面相容性
- **WHEN** 將 `FirebaseDataProvider` 實例指派給 `DataProvider` 型別變數
- **THEN** TypeScript 編譯通過，無型別錯誤

---

### Requirement: FirebaseAuthProvider 封裝現有 Auth 邏輯
系統 SHALL 將 `useFirebaseAuth` 與 `stores/auth` 中的 Firebase Auth 邏輯移入 `src/services/firebase/FirebaseAuthProvider.ts`，實作 `AuthProvider` 介面。

#### Scenario: Google OAuth 使用 signInWithPopup
- **WHEN** 呼叫 `FirebaseAuthProvider.loginWithGoogle()`
- **THEN** 使用 Firebase 的 `signInWithPopup` 方式，保留現有行為

#### Scenario: onAuthStateChanged 綁定
- **WHEN** 呼叫 `FirebaseAuthProvider.onAuthChange(callback)`
- **THEN** 內部使用 Firebase `onAuthStateChanged`，auth 狀態變化時觸發 callback

#### Scenario: 錯誤訊息中文化
- **WHEN** Firebase Auth 回傳錯誤碼（如 `auth/wrong-password`）
- **THEN** `FirebaseAuthProvider` 將 error code 對應至繁體中文訊息後拋出，與現有 `mapAuthError` 行為一致
