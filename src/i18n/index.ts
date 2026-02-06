import { createI18n } from 'vue-i18n'
import tw from '@/locales/tw.json'
import en from '@/locales/en.json'
import jp from '@/locales/jp.json'
import ko from '@/locales/ko.json'

export const SUPPORTED_LOCALES = [
  { code: 'tw', label: '中' },
  { code: 'en', label: 'EN' },
  { code: 'jp', label: '日' },
  { code: 'ko', label: '한' },
] as const

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number]['code']

function getSavedLocale(): LocaleCode {
  const saved = localStorage.getItem('locale')
  if (saved && SUPPORTED_LOCALES.some((l) => l.code === saved)) {
    return saved as LocaleCode
  }
  return 'tw'
}

const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'tw',
  messages: { tw, en, jp, ko },
})

export default i18n
