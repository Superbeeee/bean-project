# i18n 國際化設定指南

本專案使用 Google Sheets 作為翻譯字串的管理工具，在打包時自動同步最新的翻譯內容。

## 📋 目錄

1. [快速開始](#快速開始)
2. [設定 Google Sheet](#設定-google-sheet)
3. [取得 API 金鑰](#取得-api-金鑰)
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

需要建立以下 **4 個分頁 (tabs)**：

- `ui` - 使用者介面翻譯
- `menu` - 菜單相關翻譯
- `products` - 商品名稱與描述
- `categories` - 商品分類

**💡 快速匯入：** 我們提供了 CSV 範本檔案，可以直接匯入到 Google Sheets：

```
docs/google-sheet-template-ui.csv
docs/google-sheet-template-menu.csv
docs/google-sheet-template-products.csv
docs/google-sheet-template-categories.csv
```

**匯入步驟：**
1. 在 Google Sheets 中，點擊「檔案」→「匯入」
2. 選擇「上傳」並上傳 CSV 檔案
3. 匯入位置選擇「插入新工作表」
4. 重複以上步驟匯入所有 4 個 CSV 檔案
5. 將工作表名稱改為 `ui`, `menu`, `products`, `categories`

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

### 4. 範例：ui 分頁

建議的 key 結構：

```
nav.shopOnline
nav.artPresent
nav.beanMenu
nav.whereBean
common.brandName
common.home
common.allProducts
home.shopButton
home.artButton
shop.categoryTitle
```

### 5. 範例：products 分頁

```
product.soy-milk.name
product.soy-milk.description
product.tofu-skin.name
product.dried-tofu.name
```

### 6. 設定分享權限

**重要：需要設定為「知道連結的任何人都能檢視」**

1. 點擊右上角的「共用」按鈕
2. 變更為「知道連結的任何人」
3. 權限設為「檢視者」

這樣 API 才能讀取你的 Sheet（不需要 OAuth）。

---

## 取得 API 金鑰

### 1. 前往 Google Cloud Console

前往 [Google Cloud Console](https://console.cloud.google.com/)

### 2. 建立或選擇專案

1. 點擊上方的專案選單
2. 建立新專案或選擇現有專案

### 3. 啟用 Google Sheets API

1. 在左側選單選擇「API 和服務」→「程式庫」
2. 搜尋 "Google Sheets API"
3. 點擊並啟用

### 4. 建立 API 金鑰

1. 在左側選單選擇「API 和服務」→「憑證」
2. 點擊上方「+ 建立憑證」→「API 金鑰」
3. 複製產生的 API 金鑰

### 5. （建議）限制 API 金鑰

為了安全性，建議限制 API 金鑰：

1. 點擊剛建立的 API 金鑰
2. 在「API 限制」中選擇「限制金鑰」
3. 只勾選「Google Sheets API」
4. 儲存

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

開啟專案根目錄的 `.env.local` 檔案，填入以下資訊：

```bash
# Google Sheets i18n Sync
GOOGLE_SHEET_ID=你的-sheet-id
GOOGLE_SHEETS_API_KEY=你的-api-key
```

### 3. 測試同步

執行以下指令測試是否設定成功：

```bash
npm run sync:i18n
```

如果成功，你會看到：

```
🔄 開始從 Google Sheet 同步翻譯...
  📄 讀取 tab: ui
  📄 讀取 tab: menu
  📄 讀取 tab: products
  📄 讀取 tab: categories
  ✅ /path/to/src/locales/tw.json
  ✅ /path/to/src/locales/en.json
  ✅ /path/to/src/locales/jp.json
  ✅ /path/to/src/locales/ko.json
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

### ❌ 同步失敗：Failed to fetch tab

**可能原因：**
- Sheet 分享權限未設定為公開
- Sheet ID 錯誤
- API 金鑰錯誤或過期

**解決方式：**
1. 檢查 Sheet 是否設為「知道連結的任何人都能檢視」
2. 確認 `.env.local` 中的 `GOOGLE_SHEET_ID` 正確
3. 確認 API 金鑰有效且已啟用 Google Sheets API

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
└── .env.local                    # 環境變數（需自行建立）
```

### 同步腳本運作方式

1. 從 `.env.local` 讀取 Sheet ID 和 API Key
2. 透過 Google Sheets API v4 讀取各分頁資料
3. 解析每列的 key 和各語言翻譯
4. 將 dot-separated key 轉換為巢狀物件（如 `nav.shopOnline` → `{ nav: { shopOnline: "..." } }`）
5. 寫入 `src/locales/*.json`

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
