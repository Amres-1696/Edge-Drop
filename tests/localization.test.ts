import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS } from '../shared/types'
import { TRANSLATIONS } from '../src/i18n/translations'
import { ZH_CN_CHANGELOG } from '../src/i18n/changelog.zh-CN'

function flattenStrings(value: unknown, prefix = ''): Record<string, string> {
  if (typeof value === 'string') return { [prefix]: value }
  if (!value || typeof value !== 'object') return {}

  return Object.entries(value).reduce<Record<string, string>>((all, [key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return Object.assign(all, flattenStrings(child, path))
  }, {})
}

describe('Chinese localization', () => {
  it('uses Simplified Chinese for a fresh installation', () => {
    expect(DEFAULT_SETTINGS.language).toBe('zh-CN')
  })

  it('keeps every English translation key available in Simplified Chinese', () => {
    const english = flattenStrings(TRANSLATIONS.en)
    const chinese = flattenStrings(TRANSLATIONS['zh-CN'])

    expect(Object.keys(chinese).sort()).toEqual(Object.keys(english).sort())
    expect(Object.values(chinese).every((value) => value.trim().length > 0)).toBe(true)
  })

  it('ships a complete Chinese changelog with the current version first', () => {
    expect(ZH_CN_CHANGELOG[0]).toMatchObject({ version: 'v0.2.5', isLatest: true })
    expect(ZH_CN_CHANGELOG.filter((release) => release.isLatest)).toHaveLength(1)

    for (const release of ZH_CN_CHANGELOG) {
      expect(release.summary).toMatch(/[\u3400-\u9fff]/)
      expect(release.highlights.length).toBeGreaterThan(0)
      for (const highlight of release.highlights) {
        expect(`${highlight.title}${highlight.description}`).toMatch(/[\u3400-\u9fff]/)
      }
    }
  })
})
