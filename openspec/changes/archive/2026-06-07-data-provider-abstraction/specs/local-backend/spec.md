## ADDED Requirements

### Requirement: 後端 REST API 提供商品與分類資料
後端 SHALL 在 `GET /api/products` 與 `GET /api/categories` 提供對應資料，格式與前端 `Product` / `Category` type 相同。

#### Scenario: 取得商品列表
- **WHEN** 前端發送 `GET /api/products`
- **THEN** 回傳 HTTP 200 與 JSON array，每筆商品含 `id` 及所有商品欄位

#### Scenario: 取得單一商品
- **WHEN** 前端發送 `GET /api/products/:id`
- **THEN** 找到時回傳 HTTP 200 與商品 JSON；找不到時回傳 HTTP 404

#### Scenario: 取得分類列表
- **WHEN** 前端發送 `GET /api/categories`
- **THEN** 回傳 HTTP 200 與 `[{ id, name }]` JSON array

---

### Requirement: 後端 REST API 處理訂單與問卷寫入
後端 SHALL 在 `POST /api/orders` 與 `POST /api/inquiries` 接收資料並寫入 SQLite。

#### Scenario: 建立訂單
- **WHEN** 前端 POST 有效的訂單資料至 `/api/orders`（含 Authorization JWT header）
- **THEN** 回傳 HTTP 201 與 `{ id: "<new-order-id>" }`

#### Scenario: 建立問卷（不需登入）
- **WHEN** 前端 POST 有效的問卷資料至 `/api/inquiries`
- **THEN** 回傳 HTTP 201，資料寫入 SQLite `inquiries` 表，`status` 預設為 `new`

---

### Requirement: 後端處理 user profile 讀寫
後端 SHALL 提供 `GET /api/users/:uid` 與 `PUT /api/users/:uid` 端點，需攜帶有效 JWT。

#### Scenario: 讀取 user profile
- **WHEN** 帶有效 JWT 發送 `GET /api/users/:uid`，且 JWT sub 與 uid 相符
- **THEN** 回傳 HTTP 200 與 UserProfile JSON；不存在時回傳 HTTP 404

#### Scenario: 寫入 user profile
- **WHEN** 帶有效 JWT 發送 `PUT /api/users/:uid`，body 含 profile 欄位
- **THEN** 回傳 HTTP 200，資料在 SQLite 中 upsert

#### Scenario: 未授權存取
- **WHEN** 請求不帶 JWT 或 JWT 無效
- **THEN** 回傳 HTTP 401

---

### Requirement: Google OAuth 2.0 Authorization Code Flow
後端 SHALL 實作完整的 Google OAuth flow，核發自簽 JWT 給前端使用。

#### Scenario: 啟動 OAuth 流程
- **WHEN** 前端導向 `GET /auth/google`
- **THEN** 後端 redirect 至 Google OAuth 授權頁面，攜帶正確的 `client_id`、`scope`、`redirect_uri`

#### Scenario: OAuth callback 成功
- **WHEN** Google 導回 `GET /auth/google/callback?code=<code>`
- **THEN** 後端換取 token、取得 user info、在 SQLite upsert user、簽發 JWT，redirect 至前端並帶 `?token=<jwt>`

#### Scenario: JWT 有效期
- **WHEN** 後端核發 JWT
- **THEN** JWT 有效期為 7 天，payload 含 `sub`（uid）、`email`、`name`

---

### Requirement: SQLite 資料庫初始化
後端 SHALL 在啟動時自動建立所需的 SQLite tables，若 table 已存在則跳過（idempotent）。

#### Scenario: 首次啟動
- **WHEN** 後端首次執行，SQLite 檔案不存在
- **THEN** 自動建立 `data.db` 並執行建表 SQL，伺服器正常啟動

#### Scenario: 重複啟動
- **WHEN** `data.db` 已存在且有資料
- **THEN** 跳過建表，不覆蓋現有資料
