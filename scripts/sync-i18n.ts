/**
 * Google Sheets → src/locales/*.json 同步腳本
 *
 * 使用方式：
 *   npm run sync:i18n
 *
 * 前置設定：
 *   1. 將 service-account.json 放在專案根目錄
 *   2. 在 .env.local 設定 GOOGLE_SHEET_ID
 *   3. 將 Google Sheet 分享給 service-account.json 中的 client_email
 *
 * Google Sheet 結構：
 *   每個 tab（ui, menu, products, categories, art）的第一列為 header：
 *   key | tw | en | jp | ko | notes
 *   後續每列為一個 i18n key（dot-separated），例如：
 *   nav.shopOnline | 線上購買 | Shop Online | オンラインショップ | 온라인 쇼핑
 */

import { existsSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { config } from 'dotenv'
import { GoogleAuth } from 'google-auth-library'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 載入 .env.local
config({ path: resolve(__dirname, '..', '.env.local') })

const SHEET_ID = process.env.GOOGLE_SHEET_ID
const SERVICE_ACCOUNT_PATH = resolve(__dirname, '..', 'service-account.json')
const TABS = ['ui', 'menu', 'products', 'categories', 'art']
const LOCALES = ['tw', 'en', 'jp', 'ko'] as const
const OUTPUT_DIR = resolve(__dirname, '..', 'src', 'locales')

if (!SHEET_ID) {
  console.error('❌ 缺少環境變數 GOOGLE_SHEET_ID')
  console.error('   請在 .env.local 中設定此變數')
  console.error('')
  console.error('   詳細設定步驟請參考：docs/I18N_SETUP.md')
  process.exit(1)
}

if (!existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('❌ 找不到 service-account.json')
  console.error('   請將 Google Service Account 金鑰檔案放在專案根目錄')
  console.error('')
  console.error('   設定步驟：')
  console.error('   1. 到 Google Cloud Console 建立 Service Account')
  console.error('   2. 下載 JSON 金鑰，改名為 service-account.json')
  console.error('   3. 將 Google Sheet 分享給 service-account.json 中的 client_email')
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

/** 取得 Service Account 認證 token */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const auth = new GoogleAuth({
    keyFile: SERVICE_ACCOUNT_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  return { Authorization: `Bearer ${token.token}` }
}

/** 從 Google Sheets API 抓取單一 tab 資料 */
async function fetchTab(tab: string, authHeaders: Record<string, string>): Promise<string[][]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(tab)}`
  const res = await fetch(url, { headers: authHeaders })
  if (!res.ok) {
    const errorBody = await res.text()
    let errorMessage = `Failed to fetch tab "${tab}": ${res.status} ${res.statusText}`

    try {
      const errorData = JSON.parse(errorBody)
      if (errorData.error?.message) {
        errorMessage += `\n詳細錯誤: ${errorData.error.message}`

        if (errorData.error.message.includes('not found')) {
          errorMessage += '\n💡 請檢查 Google Sheet 是否包含名為 "' + tab + '" 的分頁'
        } else if (errorData.error.message.includes('permission')) {
          errorMessage += '\n💡 請確認 Google Sheet 已分享給 service-account.json 中的 client_email'
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

  const authHeaders = await getAuthHeaders()

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
      rows = await fetchTab(tab, authHeaders)
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
    const colHeaders = rows[0].map((h) => h.trim().toLowerCase())
    const keyCol = colHeaders.indexOf('key')
    if (keyCol === -1) {
      console.warn(`  ⚠️  Tab "${tab}" 找不到 "key" 欄，跳過`)
      console.warn(`     實際欄位: ${colHeaders.join(', ')}`)
      continue
    }

    const localeColMap: Record<string, number> = {}
    for (const locale of LOCALES) {
      const col = colHeaders.indexOf(locale)
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
          // vue-i18n 使用 | 作為複數語法分隔符，需要轉義裝飾性的 |
          const escapedValue = finalValue.replace(/\|/g, "{'|'}")
          setNestedValue(localeData[locale], key, escapedValue)
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
