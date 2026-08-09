import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { NoteRecordDto, RecordAttachmentDto } from '../../../shared/types'
import { useStore } from '../../store/appStore'
import { useRecordStore } from '../../store/recordStore'
import { useTranslation } from '../../i18n'
import { ARRIVE_EASE, INSTANT, SMALL_SPRING } from '../../lib/motion'
import { useTextInputMode } from '../../hooks/useTextInputMode'
import { CheckIcon, CopyIcon } from '../icons'

export function NotesView({ onDelete }: { onDelete: (id: string) => void }) {
  const systemReduced = useReducedMotion()
  const reduced = systemReduced || useStore((s) => s.settings.reduceMotion)
  const { t } = useTranslation()
  const notes = useRecordStore((s) => s.notes)
  const createNote = useRecordStore((s) => s.createNote)
  const setPinned = useRecordStore((s) => s.setNotePinned)
  const query = useStore((s) => s.recordQuery.trim().toLowerCase())
  const composerOpen = useStore((s) => s.recordComposerOpen)
  const setComposerOpen = useStore((s) => s.setRecordComposerOpen)
  const setEditingNoteId = useStore((s) => s.setEditingNoteId)
  const pushToast = useStore((s) => s.pushToast)
  const [draft, setDraft] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [pinnedOpen, setPinnedOpen] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const listRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const previousTopId = useRef<string | undefined>(notes[0]?.id)
  const [showNewPill, setShowNewPill] = useState(false)
  const copyTimer = useRef<number | null>(null)

  useTextInputMode('note-composer', composerOpen, composerRef)

  useEffect(() => () => {
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
  }, [])

  useEffect(() => {
    const topId = notes[0]?.id
    if (previousTopId.current && topId && topId !== previousTopId.current && (listRef.current?.scrollTop ?? 0) > 45) {
      setShowNewPill(true)
    }
    previousTopId.current = topId
  }, [notes])

  const filtered = useMemo(() => notes.filter((note) => {
    if (!query) return true
    const attachments = note.attachments.map((a) => a.kind === 'file-reference' ? a.name : '').join(' ')
    return `${note.title} ${note.body} ${attachments}`.toLowerCase().includes(query)
  }), [notes, query])
  const pinned = filtered.filter((note) => note.pinned)
  const recent = filtered.filter((note) => !note.pinned)

  const submit = async () => {
    const value = draft.trim()
    if (!value) return
    const [title, ...rest] = value.split(/\r?\n/)
    await createNote({ title, body: rest.join('\n') })
    setDraft('')
    setComposerOpen(false)
  }

  const copyNote = async (id: string) => {
    try {
      const ok = await window.edge.copyNote(id)
      if (!ok) throw new Error('copy failed')
      setCopiedId(id)
      pushToast({ id: `note-copy-${Date.now()}`, message: t('records.noteCopied'), tone: 'info' })
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopiedId(null), 1_250)
    } catch {
      pushToast({ id: `note-copy-error-${Date.now()}`, message: t('records.copyFailed'), tone: 'error' })
    }
  }

  const renderNote = (note: NoteRecordDto) => {
    const isExpanded = expanded.has(note.id)
    return (
      <motion.article layout={!reduced} key={note.id} className="record-card note-record-card" initial={reduced ? false : { opacity: 0, y: -6, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: -12 }} transition={reduced ? INSTANT : SMALL_SPRING}>
        <button className="record-card-main" onClick={() => setEditingNoteId(note.id)}>
          <span className="note-record-mark" />
          <span className="record-copy">
            <span className="record-title">{note.title}</span>
            {(note.body || note.attachments.length > 0) && (
              <span className={`record-preview${isExpanded ? ' expanded' : ''}`}>{note.body || t('records.attachmentNote')}</span>
            )}
            <AttachmentStrip attachments={note.attachments} />
            <span className="record-meta"><span>{formatRelative(note.updatedAt, t)}</span><span>{note.pinned ? t('records.pinned') : `${note.body.length} ${t('records.characters')}`}</span></span>
          </span>
        </button>
        <div className="record-card-actions">
          {note.body.length > 90 && <button onClick={() => setExpanded((prev) => toggleSet(prev, note.id))}>{isExpanded ? t('records.collapse') : t('records.showMore')}</button>}
          <button className={`record-copy-command${copiedId === note.id ? ' copied' : ''}`} onClick={() => void copyNote(note.id)} title={t('records.copy')}>
            <AnimatePresence initial={false} mode="wait">
              <motion.span key={copiedId === note.id ? 'copied' : 'copy'} initial={reduced ? false : { opacity: 0, y: 3, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -3, scale: .9 }} transition={reduced ? INSTANT : { duration: .14 }}>
                {copiedId === note.id ? <CheckIcon width={11} /> : <CopyIcon width={11} />}
                {copiedId === note.id ? t('records.copied') : t('records.copy')}
              </motion.span>
            </AnimatePresence>
          </button>
          <button onClick={() => void setPinned(note.id, !note.pinned)}>{note.pinned ? t('records.unpin') : t('records.pin')}</button>
          <button className="danger" onClick={() => onDelete(note.id)}>{t('records.delete')}</button>
        </div>
      </motion.article>
    )
  }

  return (
    <>
      <AnimatePresence initial={false}>
        {composerOpen && (
          <motion.form className="record-composer" onSubmit={(e) => { e.preventDefault(); void submit() }} initial={reduced ? false : { opacity: 0, height: 0, y: -7 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0 }} transition={reduced ? INSTANT : { duration: .24, ease: ARRIVE_EASE }}>
            <textarea ref={composerRef} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape') setComposerOpen(false); if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) void submit() }} placeholder={t('records.notePlaceholder')} />
            <div><span>{t('records.noteComposerHint')}</span><button type="submit" disabled={!draft.trim()}>{t('records.save')}</button></div>
          </motion.form>
        )}
      </AnimatePresence>
      <div className="records-list" ref={listRef} onScroll={(event) => { if (event.currentTarget.scrollTop < 20) setShowNewPill(false) }}>
        {filtered.length === 0 ? <RecordEmpty title={query ? t('records.noSearchResults') : t('records.noNotes')} detail={query ? t('records.tryAnotherSearch') : t('records.noNotesDesc')} /> : (
          <>
            {pinned.length > 0 && <section>
              <button className={`record-section-heading${pinnedOpen ? ' open' : ''}`} onClick={() => setPinnedOpen(!pinnedOpen)}><span>{t('records.pinned')}</span><b>{pinned.length}</b><Chevron /></button>
              <div className={`record-collapsible${pinnedOpen ? ' open' : ''}`}><div>{pinned.map(renderNote)}</div></div>
            </section>}
            {recent.length > 0 && <section><div className="record-section-label">{t('records.recentlyEdited')}</div>{recent.map(renderNote)}</section>}
          </>
        )}
      </div>
      <AnimatePresence>{showNewPill && <motion.button className="new-records-pill" initial={reduced ? false : { opacity: 0, y: -7, scale: .94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5 }} transition={reduced ? INSTANT : SMALL_SPRING} onClick={() => { listRef.current?.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); setShowNewPill(false) }}>{t('records.newItems')}</motion.button>}</AnimatePresence>
      <footer className="records-footer"><span><b>{filtered.length}</b> {t('records.notesCount')}</span><span>{t('records.autoSaveOn')}</span></footer>
    </>
  )
}

export function AttachmentStrip({ attachments }: { attachments: RecordAttachmentDto[] }) {
  const { t } = useTranslation()
  if (attachments.length === 0) return null
  return <span className="record-attachments">{attachments.slice(0, 3).map((attachment, index) => attachment.kind === 'image'
    ? <span className="record-image-thumb" key={`${attachment.assetId}-${index}`}>{attachment.preview ? <img src={attachment.preview} alt="" /> : t('records.imageFallback')}</span>
    : <span className={`record-file-chip${attachment.available ? '' : ' missing'}`} key={`${attachment.path}-${index}`}>{attachment.available ? '↗' : '!'} {attachment.name}</span>)}
    {attachments.length > 3 && <span className="record-more-attachments">+{attachments.length - 3}</span>}
  </span>
}

export function RecordEmpty({ title, detail }: { title: string; detail: string }) {
  return <div className="record-empty"><span className="record-empty-icon">＋</span><strong>{title}</strong><p>{detail}</p></div>
}

function toggleSet(previous: Set<string>, id: string): Set<string> { const next = new Set(previous); next.has(id) ? next.delete(id) : next.add(id); return next }
function formatRelative(time: number, t: (key: string) => string): string { const mins = Math.max(0, Math.floor((Date.now() - time) / 60_000)); return mins < 1 ? t('records.justNow') : mins < 60 ? `${mins} ${t('records.minutesAgo')}` : new Date(time).toLocaleDateString() }
function Chevron() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg> }
