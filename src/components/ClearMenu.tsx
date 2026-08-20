import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { TrashIcon } from './icons'
import { playButtonClickSound } from '../lib/soundEffects'
import { useTranslation } from '../i18n'
import { useStore } from '../store/appStore'
import { INSTANT } from '../lib/motion'
import type { ClipboardItemDto } from '../../shared/types'

interface ClearMenuProps {
  /** Full item list (pinned + recent) to compute time-window ids from. */
  items: ClipboardItemDto[]
  disabled: boolean
  /** Panel's own open/closed state — closes this menu whenever the panel closes. */
  panelOpen: boolean
  /** Clear a specific set of ids (used for the time-window options via deleteBatch). */
  onClear: (ids: string[]) => void
  /** Clear all unpinned history. */
  onClearAll: () => void
}

const WINDOWS: { key: '1h' | '6h' | '24h'; hours: number }[] = [
  { key: '1h', hours: 1 },
  { key: '6h', hours: 6 },
  { key: '24h', hours: 24 }
]

const menuItemStyle: CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: '7px 10px',
  borderRadius: 7,
  background: 'transparent',
  color: 'rgba(255, 255, 255, 0.85)',
  fontSize: 12,
  fontWeight: 400,
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background 0.12s ease'
}

export function ClearMenu({ items, disabled, panelOpen, onClear, onClearAll }: ClearMenuProps) {
  const { t } = useTranslation()
  const systemReduced = useReducedMotion()
  const appReduced = useStore((state) => state.settings.reduceMotion)
  const reduced = systemReduced || appReduced
  const [open, setOpen] = useState(false)
  const [confirmAll, setConfirmAll] = useState(false)
  const [confirmWindow, setConfirmWindow] = useState<'24h' | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  // Force-close menu when panel slides closed
  useEffect(() => {
    if (!panelOpen) {
      setOpen(false)
      setConfirmAll(false)
      setConfirmWindow(null)
    }
  }, [panelOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      window.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  // Re-arm "Clear all" confirmation whenever menu closes
  useEffect(() => {
    if (!open) {
      setConfirmAll(false)
      setConfirmWindow(null)
    }
  }, [open])

  const idsForWindow = (hours: number) => {
    const cutoff = Date.now() - hours * 3600 * 1000
    // Pinned items are never included in a bulk clear
    return items.filter((it) => !it.pinned && it.capturedAt >= cutoff).map((it) => it.id)
  }

  const clearWindow = (key: '1h' | '6h' | '24h', hours: number) => {
    const ids = idsForWindow(hours)
    if (ids.length === 0) return
    playButtonClickSound()
    if (key === '24h' && confirmWindow !== '24h') {
      setConfirmWindow('24h')
      return
    }
    setOpen(false)
    onClear(ids)
  }

  const handleAllClick = () => {
    if (!confirmAll) {
      playButtonClickSound()
      setConfirmAll(true)
      return
    }
    playButtonClickSound()
    setOpen(false)
    onClearAll()
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="text-btn danger"
        onClick={() => {
          if (disabled) return
          playButtonClickSound()
          setOpen((v) => !v)
        }}
        disabled={disabled}
        title={t('item.clear')}
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <TrashIcon width={14} height={14} />
        <span>{t('item.clear')}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
            transition={reduced ? INSTANT : { duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 6px)',
              right: 0,
              minWidth: 190,
              background: '#121214',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: 10,
              padding: 4,
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              zIndex: 100
            }}
            role="menu"
            aria-label={t('item.clear')}
          >
            {WINDOWS.map((w) => {
              const count = idsForWindow(w.hours).length
              const confirming = w.key === '24h' && confirmWindow === '24h'
              return (
                <button
                  key={w.key}
                  type="button"
                  role="menuitem"
                  disabled={count === 0}
                  onClick={() => clearWindow(w.key, w.hours)}
                  style={{ ...menuItemStyle, opacity: count === 0 ? 0.42 : 1, color: confirming ? '#ff8a80' : menuItemStyle.color }}
                  onMouseEnter={(e) => { if (count > 0) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  {confirming
                    ? t('item.clearWindowConfirm', { count })
                    : `${t(`item.clearLast${w.key}` as any)} · ${count}`}
                </button>
              )
            })}

            <div style={{ height: 1, background: 'rgba(255, 255, 255, 0.1)', margin: '4px 2px' }} />

            <button
              type="button"
              role="menuitem"
              onClick={handleAllClick}
              style={{
                ...menuItemStyle,
                color: confirmAll ? '#ff5252' : 'rgba(255, 255, 255, 0.85)',
                fontWeight: confirmAll ? 600 : 400
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              {confirmAll ? t('item.clearAllConfirm') : t('item.clearAll')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
