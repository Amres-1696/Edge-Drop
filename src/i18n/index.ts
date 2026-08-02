import { useStore } from '../store/appStore'
import { LANGUAGES, TRANSLATIONS, en } from './translations'

/**
 * Resolves the active language code.
 * If 'system', automatically matches navigator.language (e.g. 'es-ES' -> 'es').
 */
export function getResolvedLanguage(settingLang?: string): string {
  const code = settingLang || useStore.getState().settings.language || 'system'
  if (code !== 'system') return code

  const g = globalThis as any
  if (!g.window || !g.window.navigator) return 'en'
  const navLang = ((g.window.navigator.language as string) || '').toLowerCase()

  if (navLang.startsWith('zh-tw') || navLang.startsWith('zh-hk')) return 'zh-TW'
  if (navLang.startsWith('zh')) return 'zh-CN'
  if (navLang.startsWith('es')) return 'es'
  if (navLang.startsWith('fr')) return 'fr'
  if (navLang.startsWith('de')) return 'de'
  if (navLang.startsWith('hi')) return 'hi'
  if (navLang.startsWith('ja')) return 'ja'
  if (navLang.startsWith('ru')) return 'ru'
  if (navLang.startsWith('it')) return 'it'
  if (navLang.startsWith('pt')) return 'pt'
  if (navLang.startsWith('ko')) return 'ko'
  if (navLang.startsWith('ar')) return 'ar'
  if (navLang.startsWith('tr')) return 'tr'
  if (navLang.startsWith('vi')) return 'vi'
  if (navLang.startsWith('pl')) return 'pl'
  if (navLang.startsWith('nl')) return 'nl'
  if (navLang.startsWith('sv')) return 'sv'
  if (navLang.startsWith('id')) return 'id'
  if (navLang.startsWith('uk')) return 'uk'

  return 'en'
}

/**
 * Retrieves a nested string property safely from a translation dictionary.
 */
function getNestedProp(obj: any, path: string): string | undefined {
  const parts = path.split('.')
  let curr = obj
  for (const part of parts) {
    if (!curr || typeof curr !== 'object') return undefined
    curr = curr[part]
  }
  return typeof curr === 'string' ? curr : undefined
}

/**
 * Main translation function.
 * E.g., t('header.searchPlaceholder')
 * E.g., t('behaviour.updateAvailableTitle', { version: '0.2.2' })
 */
export function t(path: string, params?: Record<string, string | number>): string {
  const settingsLang = useStore.getState().settings.language
  const langCode = getResolvedLanguage(settingsLang)
  const dict = TRANSLATIONS[langCode]

  let val = dict ? getNestedProp(dict, path) : undefined
  if (!val) {
    val = getNestedProp(en, path) || path
  }

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      val = val.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
    }
  }

  return val
}

/**
 * Hook that subscribes to settings.language changes and returns the translation function t.
 */
export function useTranslation() {
  const language = useStore((s) => s.settings.language)
  const resolvedLang = getResolvedLanguage(language)

  // Update text direction for RTL languages like Arabic & Hebrew
  const g = globalThis as any
  if (g.document && g.document.documentElement) {
    const isRtl = resolvedLang === 'ar' || resolvedLang === 'he'
    g.document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
  }

  return {
    t,
    language,
    resolvedLang,
    languages: LANGUAGES
  }
}
