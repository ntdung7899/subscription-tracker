import { translations, Locale } from './translations'

export function useTranslation(locale: Locale = 'vi') {
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[locale]

    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) return key
    }

    return value || key
  }

  return { t, locale }
}
