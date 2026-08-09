import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '../../store/appStore'
import { useRecordStore } from '../../store/recordStore'
import { useTranslation } from '../../i18n'
import { INSTANT, SMALL_SPRING } from '../../lib/motion'
import { AttachmentStrip } from './NotesView'
import { useTextInputMode } from '../../hooks/useTextInputMode'
import { CheckIcon, CopyIcon } from '../icons'

export function NoteEditor({ noteId, onClose }: { noteId: string | null; onClose: () => void }) {
  const systemReduced = useReducedMotion()
  const reduced = systemReduced || useStore((s) => s.settings.reduceMotion)
  const { t } = useTranslation()
  const note = useRecordStore((s) => s.notes.find((entry) => entry.id === noteId))
  const updateNote = useRecordStore((s) => s.updateNote)
  const savingId = useRecordStore((s) => s.savingNoteId)
  const pushToast = useStore((s) => s.pushToast)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [dirty, setDirty] = useState(false)
  const [saved, setSaved] = useState(true)
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)
  const copyTimer = useRef<number | null>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  useTextInputMode('note-editor', Boolean(note && noteId), titleRef)

  useEffect(() => {
    if (!note) return
    setTitle(note.title)
    setBody(note.body)
    setDirty(false)
    setSaved(true)
  }, [note?.id])

  useEffect(() => {
    if (!note || !dirty) return
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(async () => {
      const ok = await updateNote(note.id, { title, body })
      setSaved(ok)
      setDirty(!ok)
    }, 600)
    return () => { if (timer.current !== null) window.clearTimeout(timer.current) }
  }, [title, body, dirty, note?.id, updateNote])

  const flush = async () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    if (note && dirty) {
      const ok = await updateNote(note.id, { title, body })
      setSaved(ok)
      if (!ok) return false
    }
    return true
  }

  const close = async () => { if (await flush()) onClose() }

  const copy = async () => {
    if (!note || !(await flush())) {
      pushToast({ id: `note-copy-error-${Date.now()}`, message: t('records.copyFailed'), tone: 'error' })
      return
    }
    try {
      const ok = await window.edge.copyNote(note.id)
      if (!ok) throw new Error('copy failed')
      setCopied(true)
      pushToast({ id: `note-copy-${Date.now()}`, message: t('records.noteCopied'), tone: 'info' })
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopied(false), 1_250)
    } catch {
      pushToast({ id: `note-copy-error-${Date.now()}`, message: t('records.copyFailed'), tone: 'error' })
    }
  }

  useEffect(() => () => {
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!noteId) return
      if (event.key === 'Escape') { event.preventDefault(); void close() }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); void flush() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return <AnimatePresence>
    {note && noteId && <motion.section className="note-editor" initial={reduced ? false : { opacity: .7, x: '104%' }} animate={{ opacity: 1, x: 0 }} exit={reduced ? { opacity: 0 } : { opacity: .6, x: '104%' }} transition={reduced ? INSTANT : SMALL_SPRING}>
      <header><button onClick={() => void close()} aria-label={t('records.back')}><svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg></button><span>{t('records.editNote')}</span><span className={`note-save-state${saved ? '' : ' error'}`}><i />{savingId === note.id || dirty ? t('records.saving') : saved ? t('records.saved') : t('records.saveFailed')}</span><motion.button className={`note-editor-copy${copied ? ' copied' : ''}`} onClick={() => void copy()} title={t('records.copy')} aria-label={copied ? t('records.copied') : t('records.copy')} whileTap={reduced ? undefined : { scale: .9 }} transition={reduced ? INSTANT : SMALL_SPRING}>{copied ? <CheckIcon width={14} /> : <CopyIcon width={14} />}</motion.button></header>
      <div className="note-editor-body">
        <input ref={titleRef} value={title} onChange={(e) => { setTitle(e.target.value); setDirty(true); setSaved(true) }} placeholder={t('records.titlePlaceholder')} />
        <textarea value={body} onChange={(e) => { setBody(e.target.value); setDirty(true); setSaved(true) }} placeholder={t('records.bodyPlaceholder')} />
        <AttachmentStrip attachments={note.attachments} />
      </div>
      <footer><span>{t('records.lastEdited')} {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span><span>{t('records.autoSaveOn')}</span></footer>
    </motion.section>}
  </AnimatePresence>
}
