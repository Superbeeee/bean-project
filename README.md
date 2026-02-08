# Soybean Space 豆之間 🫘

池上豆之間電商平台 - 前端專案

## 專案簡介

這是一個基於 Vue 3 + TypeScript + Vite 的電商平台，提供豆之間產品的線上購物、藝術展示、菜單瀏覽等功能。

## 主要功能

- 🛍️ **線上購物** - 商品瀏覽、購物車、結帳流程
- 🎨 **藝術展示** - 池上穀倉藝術空間介紹
- 📖 **菜單瀏覽** - 餐廳菜單展示
- 📍 **門市資訊** - 交通資訊與地圖
- 🌐 **多國語言** - 支援繁中、英文、日文、韓文
- 🔐 **會員系統** - Google 登入、帳號註冊
- 💼 **企業詢問** - 大宗訂購表單

## 技術棧

- **框架：** Vue 3 (Composition API)
- **語言：** TypeScript
- **建置工具：** Vite
- **狀態管理：** Pinia
- **路由：** Vue Router
- **樣式：** Tailwind CSS 4
- **國際化：** vue-i18n
- **後端服務：** Firebase (Firestore + Auth)
- **輪播套件：** Swiper

## 快速開始

### 環境需求

- Node.js 18+
- npm 或 yarn

### 安裝

```bash
# 安裝依賴
npm install
```

### 環境變數設定

複製 `.env.example` 為 `.env.local` 並填入你的設定：

```bash
cp .env.example .env.local
```

需要設定的變數：

1. **Firebase 設定** (必要，用於資料庫和登入功能)
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

2. **Google Sheets i18n 同步** (可選，用於翻譯管理)
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SHEETS_API_KEY`

詳細的 i18n 設定說明請參考 [docs/I18N_SETUP.md](docs/I18N_SETUP.md)

### 開發

```bash
# 啟動開發伺服器
npm run dev
```

開發伺服器會在 http://localhost:5173 啟動

### 打包

```bash
# 打包生產版本（會自動同步最新翻譯）
npm run build

# 預覽打包結果
npm run preview
```

## 專案結構

```
.
├── public/              # 靜態資源
├── src/
│   ├── assets/          # 樣式和圖片資源
│   ├── components/      # Vue 元件
│   │   └── layout/      # 版面配置元件
│   ├── composables/     # Composition API 複用邏輯
│   ├── data/            # 靜態資料
│   ├── firebase/        # Firebase 設定
│   ├── i18n/            # 國際化設定
│   ├── locales/         # 翻譯檔案（自動生成）
│   ├── router/          # 路由設定
│   ├── stores/          # Pinia 狀態管理
│   ├── types/           # TypeScript 型別定義
│   ├── views/           # 頁面元件
│   ├── App.vue          # 根元件
│   └── main.ts          # 應用程式入口
├── scripts/             # 工具腳本
│   ├── sync-i18n.ts     # Google Sheets 翻譯同步
│   └── seed-products.ts # Firestore 商品資料種子
└── docs/                # 文件
    └── I18N_SETUP.md    # i18n 設定指南
```

## 國際化 (i18n)

本專案支援多國語言，使用 Google Sheets 作為翻譯管理工具。

### 支援的語言

- 🇹🇼 繁體中文 (tw) - 預設
- 🇺🇸 English (en)
- 🇯🇵 日本語 (jp)
- 🇰🇷 한국어 (ko)

### 翻譯管理流程

```
Google Sheets (線上編輯) → npm run sync:i18n → src/locales/*.json
```

### 相關指令

```bash
# 從 Google Sheets 同步翻譯
npm run sync:i18n

# 打包時會自動同步
npm run build
```

完整的 i18n 設定說明（包含 Google Sheets 設定、API 金鑰取得等）請參考：

👉 **[docs/I18N_SETUP.md](docs/I18N_SETUP.md)**

## Firebase 設定

本專案使用 Firebase 作為後端服務：

- **Firestore** - 儲存商品、訂單、詢問表單
- **Authentication** - Google 登入和 Email/Password 登入

### 本地開發 Fallback

如果沒有設定 Firebase，應用程式會使用本地靜態資料作為 fallback，部分功能仍可正常使用。

## 腳本說明

### 同步翻譯

```bash
npm run sync:i18n
```

從 Google Sheets 同步最新的翻譯到 `src/locales/*.json`

### 種子資料

```bash
# 將商品資料上傳到 Firestore
# (需要 Firebase Admin SDK 設定)
```

## 開發注意事項

### Git Hooks

本專案使用 pre-commit hooks 進行程式碼檢查（如有設定）

### 環境變數

- 前端變數需要 `VITE_` 前綴
- Build-time 變數（如 Google Sheets API）不需要前綴

### 翻譯新增

新增翻譯時：

1. 在 Google Sheet 中新增對應的 key 和各語言翻譯
2. 執行 `npm run sync:i18n` 同步到本地
3. 在程式碼中使用 `t('your.key')`

## 部署

### 建議的部署平台

- Vercel
- Netlify
- Firebase Hosting

### 部署前檢查清單

- [ ] 設定正確的環境變數
- [ ] 確認 Firebase 專案設定
- [ ] 執行 `npm run build` 確認打包成功
- [ ] 檢查 `dist/` 目錄輸出

## 授權

本網站為 TibaMe 前端設計工程師班第 74 期學員專題作品，僅供學習、展示之用。

參考資源：豆之間、池上鄉農會、葉海地老師作品、部落客不羈、龜記、.but

## 聯絡資訊

如有任何問題或建議，歡迎提出 Issue。
