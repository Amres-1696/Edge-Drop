/**
 * Toast — transient user-facing notices pinned to the bottom of the blade.
 *
 * Fed by the `ui:toast` IPC channel (e.g. "Collection is full (10 max)" from a
 * rejected merge, or "Split into N stacks" from a chunked drop). Each toast
 * auto-dismisses on a timer (see appStore.pushToast) and can also be swiped
 * away by clicking it.
 */
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useStore } from '../store/appStore'

import { useTranslation } from '../i18n'
import { ARRIVE_EASE, INSTANT, LEAVE_EASE } from '../lib/motion'

export function ToastStack() {
  const systemReduced = useReducedMotion()
  const appReduced = useStore((s) => s.settings.reduceMotion)
  const reduced = systemReduced || appReduced
  const { t, resolvedLang } = useTranslation()
  const toasts = useStore((s) => s.toasts)
  const dismiss = useStore((s) => s.dismissToast)

  return (
    <div className="toast-stack">
      <AnimatePresence>
        {toasts.map((toastMsg) => (
          <motion.button
            key={toastMsg.id}
            className={`toast ${toastMsg.tone === 'error' ? 'toast-error' : 'toast-info'}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced
              ? { opacity: 0, transition: INSTANT }
              : { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15, ease: LEAVE_EASE } }}
            transition={reduced ? INSTANT : { duration: 0.22, ease: ARRIVE_EASE }}
            onClick={() => dismiss(toastMsg.id)}
            title={t('header.close')}
          >
            {toastMsg.tone === 'error' && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            <span>{localizeToastMessage(toastMsg.message, resolvedLang)}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}

function localizeToastMessage(message: string, language: string): string {
  if (language !== 'zh-CN') return message

  const split = message.match(/^Split into (\d+) stacks \(max 10 each\)$/)
  if (split) return `已拆分为 ${split[1]} 个集合（每个最多 10 项）`

  const messages: Record<string, string> = {
    'An image collection can hold a maximum of 10 items': '图片集合最多可容纳 10 项',
    'A folder bundle can hold a maximum of 10 files': '文件集合最多可容纳 10 个文件',
    'Images can only be grouped with other images': '图片只能与其他图片组合',
    'Files can only be grouped with other files': '文件只能与其他文件组合',
    'Text and links cannot be grouped together': '文本和链接不能组合',
    'Collection is full (10 max)': '集合已满（最多 10 项）',
    'Cannot combine different item types': '无法组合不同类型的项目',
    'Could not delete this item. Please try again.': '删除失败，请重试。',
    'Could not clear history. Please try again.': '清理历史记录失败，请重试。',
    'Clipboard storage is temporarily read-only': '剪贴板存储暂时处于只读状态，请重启后重试。'
  }

  return messages[message] ?? message
}
