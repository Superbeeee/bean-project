import { createI18n } from 'vue-i18n'
import tw from '@/locales/tw.json'
import en from '@/locales/en.json'
import jp from '@/locales/jp.json'
import ko from '@/locales/ko.json'

// label：收合狀態顯示的短標籤；name：展開清單顯示的語言全名（各語言用自己的寫法）
export const SUPPORTED_LOCALES = [
  { code: 'tw', label: '中', name: '繁體中文' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'jp', label: '日', name: '日本語' },
  { code: 'ko', label: '한', name: '한국어' },
] as const

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number]['code']

function getSavedLocale(): LocaleCode {
  const saved = localStorage.getItem('locale')
  if (saved && SUPPORTED_LOCALES.some((l) => l.code === saved)) {
    return saved as LocaleCode
  }
  return 'tw'
}

// <html lang> 會影響瀏覽器挑選 CJK 字型與斷行規則，
// 沒同步的話同一段文字在不同語言下的行高／字寬會不一致而造成跑版。
export function applyDocumentLang(code: LocaleCode) {
  document.documentElement.lang = code === 'tw' ? 'zh-TW' : code === 'jp' ? 'ja' : code
}

const savedLocale = getSavedLocale()
applyDocumentLang(savedLocale)

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'tw',
  messages: { tw, en, jp, ko },
})

export default i18n
