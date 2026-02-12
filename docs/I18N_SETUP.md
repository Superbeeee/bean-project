# i18n 國際化設定指南

本專案使用 Google Sheets 作為翻譯字串的管理工具，透過 Service Account 認證讀取不公開的 Sheet。

## 📋 目錄

1. [快速開始](#快速開始)
2. [設定 Google Sheet](#設定-google-sheet)
3. [設定 Service Account](#設定-service-account)
4. [本地設定](#本地設定)
5. [使用方式](#使用方式)
6. [故障排除](#故障排除)

---

## 快速開始

### 支援的語言

- 🇹🇼 繁體中文 (tw) - 預設語言
- 🇺🇸 English (en)
- 🇯🇵 日本語 (jp)
- 🇰🇷 한국어 (ko)

### 工作流程

```
Google Sheet (線上編輯) → npm run sync:i18n → src/locales/*.json (打包使用)
```

---

## 設定 Google Sheet

### 1. 建立新的 Google Sheet

1. 前往 [Google Sheets](https://sheets.google.com)
2. 建立一個新的試算表
3. 命名為 `Soybean Space i18n` (或任何你喜歡的名稱)

### 2. 設定 Sheet 結構

需要建立以下 **5 個分頁 (tabs)**：

- `ui` - 使用者介面翻譯（導航、通用、購物車、結帳、認證、洽詢、頁尾、路由等）
- `menu` - 菜單相關翻譯
- `products` - 商品名稱與描述
- `categories` - 商品分類
- `art` - 藝文頁內容

**💡 快速匯入：** 我們提供了 CSV 範本檔案，可以直接匯入到 Google Sheets：

```
docs/google-sheet-template-ui.csv
docs/google-sheet-template-menu.csv
docs/google-sheet-template-products.csv
docs/google-sheet-template-categories.csv
docs/google-sheet-template-art.csv
```

**匯入步驟：**
1. 在 Google Sheets 中，點擊「檔案」→「匯入」
2. 選擇「上傳」並上傳 CSV 檔案
3. 匯入位置選擇「插入新工作表」
4. 重複以上步驟匯入所有 5 個 CSV 檔案
5. 將工作表名稱改為 `ui`, `menu`, `products`, `categories`, `art`

### 3. 每個分頁的欄位格式

每個分頁的第一列必須包含以下欄位：

| key | tw | en | jp | ko | notes |
|-----|----|----|----|----|-------|
| nav.shopOnline | 線上購買 | Shop Online | オンラインショップ | 온라인 쇼핑 | 導航列-線上購買 |
| nav.artPresent | 線上探索豆間 | Bean Art Present | アート展示 | 아트 프레젠트 | 導航列-藝術展示 |

**欄位說明：**

- `key`: i18n 的 key，使用點號分隔的階層結構（如：`nav.shopOnline`）
- `tw`: 繁體中文翻譯
- `en`: 英文翻譯
- `jp`: 日文翻譯
- `ko`: 韓文翻譯
- `notes`: 備註說明（可選，不會被同步）

### 4. 設定分享權限

將 Sheet 分享給服務帳戶的 email（見下方 Service Account 設定），權限設為「檢視者」即可。

**Sheet 不需設為公開。**

---

## 設定 Service Account

### 1. 前往 Google Cloud Console

前往 [Google Cloud Console](https://console.cloud.google.com/)

### 2. 建立或選擇專案，啟用 Google Sheets API

1. 在左側選單選擇「API 和服務」→「程式庫」
2. 搜尋 "Google Sheets API" 並啟用

### 3. 建立 Service Account

1. 在左側選單選擇「IAM 與管理」→「服務帳戶」
2. 點擊「+ 建立服務帳戶」
3. 輸入名稱（如 `sheets-reader`），建立

### 4. 下載金鑰

1. 點擊剛建立的服務帳戶
2. 「金鑰」分頁 → 「新增金鑰」→「JSON」
3. 將下載的 JSON 檔案改名為 `service-account.json`，放在專案根目錄
4. **此檔案已加入 .gitignore，不會被 commit**

### 5. 分享 Sheet 給服務帳戶

1. 開啟 `service-account.json`，找到 `client_email` 欄位
2. 到 Google Sheet → 「共用」→ 輸入該 email → 設為「檢視者」

---

## 本地設定

### 1. 取得 Sheet ID

從你的 Google Sheet 網址複製 ID：

```
https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
                                        ^^^^^^^^
                                     複製這段 ID
```

### 2. 編輯 .env.local

開啟專案根目錄的 `.env.local` 檔案，填入 Sheet ID：

```bash
GOOGLE_SHEET_ID=你的-sheet-id
```

### 3. 確認 service-account.json

確認 `service-account.json` 已放在專案根目錄。

### 4. 測試同步

執行以下指令測試是否設定成功：

```bash
npm run sync:i18n
```

如果成功，你會看到：

```
🔄 開始從 Google Sheet 同步翻譯...
📊 Sheet ID: ...
📝 將同步 5 個分頁: ui, menu, products, categories, art
  📄 讀取 tab: ui
  📄 讀取 tab: menu
  📄 讀取 tab: products
  📄 讀取 tab: categories
  📄 讀取 tab: art
  ✅ src/locales/tw.json
  ✅ src/locales/en.json
  ✅ src/locales/jp.json
  ✅ src/locales/ko.json
🎉 同步完成！
```

---

## 使用方式

### 開發流程

1. **在 Google Sheet 上編輯翻譯**
   - 直接在線上編輯各語言的翻譯內容
   - 可以多人協作

2. **本地同步（開發時）**
   ```bash
   npm run sync:i18n
   ```

3. **打包部署（自動同步）**
   ```bash
   npm run build
   ```
   打包時會自動執行 `prebuild` 腳本，同步最新翻譯

### 在程式碼中使用翻譯

#### 在 Vue 元件中

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <h1>{{ t('nav.shopOnline') }}</h1>
  <p>{{ t('common.brandName') }}</p>
</template>
```

#### 在 JavaScript/TypeScript 中

```typescript
import i18n from '@/i18n'

const message = i18n.global.t('common.loading')
```

#### 使用商品翻譯 Composable

```vue
<script setup>
import { useProductI18n } from '@/composables/useProductI18n'

const { productName, productDescription, categoryName } = useProductI18n()

// 有翻譯就用翻譯，沒有就用 fallback
const name = productName('soy-milk', '豆之間豆漿')
</script>
```

### 切換語言

使用者可以透過頁面上的語言切換器切換語言：

```vue
<LanguageSwitcher />
```

語言偏好會儲存在 `localStorage`，下次訪問時會記住。

---

## 故障排除

### ❌ 找不到 service-account.json

**解決方式：**
1. 到 Google Cloud Console 建立 Service Account
2. 下載 JSON 金鑰，改名為 `service-account.json`
3. 放在專案根目錄

---

### ❌ 同步失敗：Failed to fetch tab

**可能原因：**
- Sheet 未分享給服務帳戶
- Sheet ID 錯誤

**解決方式：**
- 確認 Sheet 已分享給 `service-account.json` 中的 `client_email`
- 確認 `.env.local` 中的 `GOOGLE_SHEET_ID` 正確
- 確認已在 Google Cloud Console 啟用 Google Sheets API

---

### ❌ 同步失敗：Tab 找不到 "key" 欄

**可能原因：**
- 分頁的第一列沒有 `key` 欄位

**解決方式：**
確保每個分頁的第一列包含：`key | tw | en | jp | ko`

---

### ⚠️ 某些翻譯沒有更新

**可能原因：**
- 沒有執行同步指令
- 瀏覽器快取

**解決方式：**
```bash
# 重新同步
npm run sync:i18n

# 重新啟動開發伺服器
npm run dev
```

---

### ⚠️ 語言切換後沒有效果

**可能原因：**
- 該文字沒有使用 `t()` 函式
- i18n key 錯誤

**解決方式：**
檢查程式碼是否使用 `{{ t('your.key') }}` 而不是寫死的文字

---

## 技術細節

### 專案結構

```
├── src/
│   ├── i18n/
│   │   └── index.ts              # i18n 設定
│   ├── locales/                  # 翻譯檔案（自動生成）
│   │   ├── tw.json
│   │   ├── en.json
│   │   ├── jp.json
│   │   └── ko.json
│   └── composables/
│       └── useProductI18n.ts     # 商品翻譯 helper
├── scripts/
│   └── sync-i18n.ts              # Google Sheets 同步腳本
├── service-account.json          # Service Account 金鑰（不進 git）
└── .env.local                    # 環境變數（需自行建立）
```

### 同步腳本運作方式

1. 從 `.env.local` 讀取 Sheet ID
2. 使用 `service-account.json` 取得 OAuth token
3. 透過 Google Sheets API v4 讀取各分頁資料
4. 解析每列的 key 和各語言翻譯
5. 將 dot-separated key 轉換為巢狀物件（如 `nav.shopOnline` → `{ nav: { shopOnline: "..." } }`）
6. 寫入 `src/locales/*.json`

### Fallback 機制

- 如果某個語言的翻譯為空，會自動使用繁體中文（tw）的翻譯
- 如果 i18n key 不存在，會顯示 key 本身

---

## 進階使用

### 新增語言

如果要新增其他語言（如：法文 fr）：

1. 在 `src/i18n/index.ts` 新增：
   ```typescript
   import fr from '@/locales/fr.json'

   export const SUPPORTED_LOCALES = [
     // ...
     { code: 'fr', label: 'FR' },
   ]

   const i18n = createI18n({
     // ...
     messages: { tw, en, jp, ko, fr },
   })
   ```

2. 在 `scripts/sync-i18n.ts` 新增：
   ```typescript
   const LOCALES = ['tw', 'en', 'jp', 'ko', 'fr'] as const
   ```

3. 在 Google Sheet 新增 `fr` 欄位

---

## 需要協助？

如有任何問題，請查看：

- [vue-i18n 官方文件](https://vue-i18n.intlify.dev/)
- [Google Sheets API 文件](https://developers.google.com/sheets/api)
- 專案內的 `scripts/sync-i18n.ts` 腳本註解
