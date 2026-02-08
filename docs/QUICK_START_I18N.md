# i18n 快速開始指南 ⚡

完成 Google Sheets i18n 設定只需要 5 個步驟！

## 📝 步驟 1: 建立 Google Sheet

1. 前往 https://sheets.google.com
2. 建立新的試算表，命名為 `Soybean Space i18n`

## 📤 步驟 2: 匯入範本資料

在專案的 `docs/` 目錄下有 4 個 CSV 範本檔案：

- `google-sheet-template-ui.csv`
- `google-sheet-template-menu.csv`
- `google-sheet-template-products.csv`
- `google-sheet-template-categories.csv`

**匯入方式：**

對於每個 CSV 檔案：
1. 在 Google Sheets 中點擊「檔案」→「匯入」
2. 上傳 CSV 檔案
3. 匯入位置選擇「插入新工作表」
4. 將新工作表重新命名為 `ui`, `menu`, `products`, `categories`

## 🔓 步驟 3: 設定 Sheet 為公開

1. 點擊右上角「共用」按鈕
2. 變更為「知道連結的任何人」
3. 權限設為「檢視者」
4. 完成

## 🔑 步驟 4: 取得 API 金鑰

### 4.1 前往 Google Cloud Console

https://console.cloud.google.com/

### 4.2 建立或選擇專案

點擊上方專案選單 → 建立新專案

### 4.3 啟用 Google Sheets API

1. 左側選單：「API 和服務」→「程式庫」
2. 搜尋 "Google Sheets API"
3. 點擊並啟用

### 4.4 建立 API 金鑰

1. 左側選單：「API 和服務」→「憑證」
2. 點擊「+ 建立憑證」→「API 金鑰」
3. 複製產生的金鑰

### 4.5 (建議) 限制 API 金鑰

1. 點擊剛建立的 API 金鑰
2. 「API 限制」選擇「限制金鑰」
3. 只勾選「Google Sheets API」
4. 儲存

## ⚙️ 步驟 5: 設定本地環境

### 5.1 取得 Sheet ID

從網址複製：
```
https://docs.google.com/spreadsheets/d/{這段就是 SHEET_ID}/edit
```

### 5.2 編輯 `.env.local`

開啟專案根目錄的 `.env.local`，設定：

```bash
GOOGLE_SHEET_ID=你的-sheet-id
GOOGLE_SHEETS_API_KEY=你的-api-key
```

### 5.3 測試同步

```bash
npm run sync:i18n
```

如果看到以下訊息就成功了：

```
🔄 開始從 Google Sheet 同步翻譯...
📊 Sheet ID: your-sheet-id
📝 將同步 4 個分頁: ui, menu, products, categories

  📄 讀取 tab: ui
     ✓ 成功讀取 18 個翻譯鍵
  📄 讀取 tab: menu
     ✓ 成功讀取 21 個翻譯鍵
  📄 讀取 tab: products
     ✓ 成功讀取 28 個翻譯鍵
  📄 讀取 tab: categories
     ✓ 成功讀取 5 個翻譯鍵

  ✅ /path/to/src/locales/tw.json
  ✅ /path/to/src/locales/en.json
  ✅ /path/to/src/locales/jp.json
  ✅ /path/to/src/locales/ko.json

🎉 同步完成！共處理 72 個翻譯鍵
```

## 🎉 完成！

現在你可以：

1. **在 Google Sheet 上編輯翻譯** - 線上協作修改翻譯內容
2. **本地同步** - 執行 `npm run sync:i18n` 下載最新翻譯
3. **自動同步** - 執行 `npm run build` 打包時會自動同步

## ❓ 遇到問題？

常見錯誤處理：

### ❌ API key not valid
→ 檢查 `.env.local` 中的 `GOOGLE_SHEETS_API_KEY` 是否正確
→ 確認已在 Google Cloud Console 啟用 Google Sheets API

### ❌ Tab not found
→ 確認 Google Sheet 有 `ui`, `menu`, `products`, `categories` 四個分頁
→ 注意分頁名稱必須完全相同（小寫）

### ❌ Permission denied
→ 確認 Sheet 已設定為「知道連結的任何人都能檢視」

## 📚 詳細文件

完整的設定說明和進階功能請參考：

👉 [docs/I18N_SETUP.md](./I18N_SETUP.md)

---

**需要協助？**

如有任何問題，歡迎查看詳細文件或提出 Issue！
