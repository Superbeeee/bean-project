/**
 * Google Sheets → src/locales/*.json 同步腳本
 *
 * 使用方式：
 *   npm run sync:i18n
 *
 * 環境變數（放在 .env.local）：
 *   GOOGLE_SHEET_ID=your-sheet-id
 *   GOOGLE_SHEETS_API_KEY=your-api-key
 *
 * Google Sheet 結構：
 *   每個 tab（ui, menu, products, categories）的第一列為 header：
 *   key | tw | en | jp | ko | notes
 *   後續每列為一個 i18n key（dot-separated），例如：
 *   nav.shopOnline | 線上購買 | Shop Online | オンラインショップ | 온라인 쇼핑
 */

import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { config } from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 載入 .env.local
config({ path: resolve(__dirname, '..', '.env.local') })

const SHEET_ID = process.env.GOOGLE_SHEET_ID
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY
const TABS = ['ui', 'menu', 'products', 'categories']
const LOCALES = ['tw', 'en', 'jp', 'ko'] as const
const OUTPUT_DIR = resolve(__dirname, '..', 'src', 'locales')

if (!SHEET_ID || !API_KEY) {
  console.error('❌ 缺少環境變數 GOOGLE_SHEET_ID 或 GOOGLE_SHEETS_API_KEY')
  console.error('   請在 .env.local 中設定這兩個變數')
  console.error('')
  console.error('   詳細設定步驟請參考：docs/I18N_SETUP.md')
  console.error('')
  console.error('   快速檢查清單：')
  console.error('   1. 建立 .env.local 檔案')
  console.error('   2. 在 Google Cloud Console 取得 API 金鑰')
  console.error('   3. 建立 Google Sheet 並取得 Sheet ID')
  console.error('   4. 將 Sheet 設定為公開檢視')
  process.exit(1)
}

/** 將 dot-separated key 設定到巢狀物件 */
function setNestedValue(obj: Record<string, unknown>, key: string, value: string) {
  const parts = key.split('.')
  let current = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (!(part in current) || typeof current[part] !== 'object') {
      current[part] = {}
    }
    current = current[part] as Record<string, unknown>
  }
  current[parts[parts.length - 1]] = value
}

/** 從 Google Sheets API 抓取單一 tab 資料 */
async function fetchTab(tab: string): Promise<string[][]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(tab)}?key=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) {
    const errorBody = await res.text()
    let errorMessage = `Failed to fetch tab "${tab}": ${res.status} ${res.statusText}`

    // 嘗試解析錯誤訊息
    try {
      const errorData = JSON.parse(errorBody)
      if (errorData.error?.message) {
        errorMessage += `\n詳細錯誤: ${errorData.error.message}`

        // 提供更友善的錯誤提示
        if (errorData.error.message.includes('API key not valid')) {
          errorMessage += '\n💡 請檢查 .env.local 中的 GOOGLE_SHEETS_API_KEY 是否正確'
        } else if (errorData.error.message.includes('not found')) {
          errorMessage += '\n💡 請檢查 Google Sheet 是否包含名為 "' + tab + '" 的分頁'
        } else if (errorData.error.message.includes('permission')) {
          errorMessage += '\n💡 請確認 Google Sheet 已設定為「知道連結的任何人都能檢視」'
        }
      }
    } catch {
      // 無法解析 JSON，使用原始錯誤訊息
    }

    throw new Error(errorMessage)
  }
  const data = (await res.json()) as { values?: string[][] }
  return data.values ?? []
}

async function main() {
  console.log('🔄 開始從 Google Sheet 同步翻譯...')
  console.log(`📊 Sheet ID: ${SHEET_ID}`)
  console.log(`📝 將同步 ${TABS.length} 個分頁: ${TABS.join(', ')}`)
  console.log('')

  // 每個 locale 建一個累積物件
  const localeData: Record<string, Record<string, unknown>> = {}
  for (const locale of LOCALES) {
    localeData[locale] = {}
  }

  let hasErrors = false
  let totalKeys = 0

  for (const tab of TABS) {
    console.log(`  📄 讀取 tab: ${tab}`)
    let rows: string[][]
    try {
      rows = await fetchTab(tab)
    } catch (err) {
      console.error(`  ❌ 無法讀取 tab "${tab}":`)
      console.error(`     ${(err as Error).message}`)
      hasErrors = true
      continue
    }

    if (rows.length < 2) {
      console.warn(`  ⚠️  Tab "${tab}" 沒有資料列，跳過`)
      continue
    }

    // header row 決定每欄對應的 locale
    const headers = rows[0].map((h) => h.trim().toLowerCase())
    const keyCol = headers.indexOf('key')
    if (keyCol === -1) {
      console.warn(`  ⚠️  Tab "${tab}" 找不到 "key" 欄，跳過`)
      console.warn(`     實際欄位: ${headers.join(', ')}`)
      continue
    }

    const localeColMap: Record<string, number> = {}
    for (const locale of LOCALES) {
      const col = headers.indexOf(locale)
      if (col !== -1) {
        localeColMap[locale] = col
      } else {
        console.warn(`     ⚠️  找不到 "${locale}" 欄位`)
      }
    }

    // 解析資料列
    let tabKeys = 0
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r]
      const key = row[keyCol]?.trim()
      if (!key) continue

      tabKeys++
      for (const locale of LOCALES) {
        const col = localeColMap[locale]
        if (col === undefined) continue
        const value = row[col]?.trim() ?? ''
        // 空值回退到 tw
        const finalValue = value || (locale !== 'tw' ? (row[localeColMap['tw']]?.trim() ?? '') : '')
        if (finalValue) {
          setNestedValue(localeData[locale], key, finalValue)
        }
      }
    }
    console.log(`     ✓ 成功讀取 ${tabKeys} 個翻譯鍵`)
    totalKeys += tabKeys
  }

  console.log('')

  // 寫入 JSON 檔案
  for (const locale of LOCALES) {
    const filePath = resolve(OUTPUT_DIR, `${locale}.json`)
    writeFileSync(filePath, JSON.stringify(localeData[locale], null, 2) + '\n', 'utf-8')
    console.log(`  ✅ ${filePath}`)
  }

  console.log('')
  console.log(`🎉 同步完成！共處理 ${totalKeys} 個翻譯鍵`)

  if (hasErrors) {
    console.log('')
    console.warn('⚠️  同步過程中遇到一些錯誤，請檢查上方的錯誤訊息')
    console.warn('   詳細設定步驟請參考：docs/I18N_SETUP.md')
  }
}

main().catch((err) => {
  console.error('❌ 同步失敗:', err)
  process.exit(1)
})
