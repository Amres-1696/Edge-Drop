/**
 * Small display helpers for clipboard item previews.
 */
import { getResolvedLanguage, t } from '../i18n'

/** Truncate long text for list previews. */
export function previewText(text: string, max = 160): string {
  if (!text) return ''
  const head = text.length > max * 4 ? text.slice(0, max * 4) : text
  const single = head.replace(/\s+/g, ' ').trim()
  if (single.length <= max) return single
  return single.slice(0, max - 1) + '…'
}

/** Human-readable byte size. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Relative time like "just now", "3m ago", "2h ago", or a date. */
export function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  const s = Math.round(diff / 1000)
  if (s < 5) return t('item.justNow')
  const m = Math.round(s / 60)
  const h = Math.round(m / 60)
  const d = Math.round(h / 24)
  const language = getResolvedLanguage()
  try {
    const relative = new Intl.RelativeTimeFormat(language, { numeric: 'always', style: 'short' })
    if (s < 60) return relative.format(-s, 'second')
    if (m < 60) return relative.format(-m, 'minute')
    if (h < 24) return relative.format(-h, 'hour')
    if (d < 7) return relative.format(-d, 'day')
  } catch {
    const ago = t('item.ago')
    if (s < 60) return `${s}s ${ago}`.trim()
    if (m < 60) return `${m}m ${ago}`.trim()
    if (h < 24) return `${h}h ${ago}`.trim()
    if (d < 7) return `${d}d ${ago}`.trim()
  }
  return new Date(ts).toLocaleDateString(language)
}

/** Pull a filename out of a path, cross-platform. */
export function basename(p: string): string {
  const norm = p.replace(/\\/g, '/')
  const parts = norm.split('/').filter(Boolean)
  return parts[parts.length - 1] ?? p
}

/** Formats a path into a clean display title (converts internal hash IDs to human screenshot titles). */
export function formatImageDisplayName(path: string, capturedAt?: number): string {
  const name = basename(path)
  const isInternalHash = /^[a-z0-9]{6,12}-[a-z0-9]{6,12}\.[a-z0-9]+$/i.test(name) || path.includes('edge-drop/images') || path.includes('edge-drop\\images') || path.includes('edge-drop/temp') || path.includes('edge-drop\\temp')
  
  if (isInternalHash) {
    const screenshotLabel = t('item.screenshot')
    if (capturedAt) {
      const d = new Date(capturedAt)
      const language = getResolvedLanguage()
      const dateStr = d.toLocaleDateString(language, { month: 'short', day: 'numeric' })
      const timeStr = d.toLocaleTimeString(language, { hour: 'numeric', minute: '2-digit' })
      return `${screenshotLabel} ${dateStr}, ${timeStr}`
    }
    return screenshotLabel
  }
  return name
}

/** Is this a path to an image (by extension)? */
const IMG_EXT = /\.(png|jpe?g|gif|webp|bmp|svg|avif|ico|tiff?|jfif|pjpeg|pjp)$/i
export function isImagePath(p: string): boolean {
  return IMG_EXT.test(p)
}
