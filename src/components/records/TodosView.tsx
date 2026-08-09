import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import type { TodoRecordDto } from '../../../shared/types'
import { useStore } from '../../store/appStore'
import { useRecordStore } from '../../store/recordStore'
import { useTranslation } from '../../i18n'
import { ARRIVE_EASE, INSTANT, SMALL_SPRING } from '../../lib/motion'
import { AttachmentStrip, RecordEmpty } from './NotesView'

export function TodosView({ onDelete }: { onDelete: (id: string) => void }) {
  const systemReduced = useReducedMotion()
  const reduced = systemReduced || useStore((s) => s.settings.reduceMotion)
  const { t } = useTranslation()
  const todos = useRecordStore((s) => s.todos)
  const createTodo = useRecordStore((s) => s.createTodo)
  const updateTodo = useRecordStore((s) => s.updateTodo)
  const setCompleted = useRecordStore((s) => s.setTodoCompleted)
  const clearCompleted = useRecordStore((s) => s.clearCompletedTodos)
  const query = useStore((s) => s.recordQuery.trim().toLowerCase())
  const composerOpen = useStore((s) => s.recordComposerOpen)
  const setComposerOpen = useStore((s) => s.setRecordComposerOpen)
  const [draft, setDraft] = useState('')
  const [completedOpen, setCompletedOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [holding, setHolding] = useState(false)
  const holdTimer = useRef<number | null>(null)

  const filtered = useMemo(() => todos.filter((todo) => `${todo.title} ${todo.details} ${todo.attachments.map((a) => a.kind === 'file-reference' ? a.name : '').join(' ')}`.toLowerCase().includes(query)), [todos, query])
  const pending = filtered.filter((todo) => todo.status === 'pending')
  const completed = filtered.filter((todo) => todo.status === 'completed')
  const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999)
  const overdue = pending.filter((todo) => todo.dueAt && todo.dueAt < Date.now())
  const today = pending.filter((todo) => todo.dueAt && todo.dueAt >= Date.now() && todo.dueAt <= todayEnd.getTime())
  const later = pending.filter((todo) => todo.dueAt && todo.dueAt > todayEnd.getTime())
  const noDate = pending.filter((todo) => !todo.dueAt)

  const submit = async () => {
    if (!draft.trim()) return
    await createTodo({ title: draft.trim() })
    setDraft('')
    setComposerOpen(false)
  }

  const renderTask = (todo: TodoRecordDto) => (
    <motion.article layout={!reduced} key={todo.id} className={`record-card todo-record-card${todo.status === 'completed' ? ' completed' : ''}`} initial={reduced ? false : { opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 12 }} transition={reduced ? INSTANT : SMALL_SPRING}>
      <div className="todo-main-row">
        <motion.button className="todo-check" aria-label={todo.status === 'completed' ? t('records.restoreTodo') : t('records.completeTodo')} aria-pressed={todo.status === 'completed'} whileTap={reduced ? undefined : { scale: .86 }} onClick={() => void setCompleted(todo.id, todo.status !== 'completed')}>
          <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" animate={{ opacity: todo.status === 'completed' ? 1 : 0, scale: todo.status === 'completed' ? 1 : .35, rotate: todo.status === 'completed' ? 0 : -18 }} transition={reduced ? INSTANT : SMALL_SPRING}><path d="m5 12 4 4L19 6" /></motion.svg>
        </motion.button>
        <button className="todo-copy" onClick={() => setEditingId(editingId === todo.id ? null : todo.id)}>
          <span className="record-title">{todo.title}</span>
          {todo.details && <span className="record-preview">{todo.details}</span>}
          <AttachmentStrip attachments={todo.attachments} />
          <span className="record-meta"><span>{todo.dueAt ? formatDue(todo.dueAt) : t('records.noDueDate')}</span><span>{todo.status === 'completed' ? t('records.completed') : t('records.pending')}</span></span>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {editingId === todo.id && todo.status === 'pending' && <TodoDetails todo={todo} onSave={(patch) => { void updateTodo(todo.id, patch); setEditingId(null) }} onDelete={() => onDelete(todo.id)} reduced={!!reduced} />}
      </AnimatePresence>
      {todo.status === 'completed' && <div className="record-card-actions"><button className="danger" onClick={() => onDelete(todo.id)}>{t('records.delete')}</button></div>}
    </motion.article>
  )

  const group = (label: string, values: TodoRecordDto[]) => values.length > 0 && <section><div className="record-section-label">{label}</div>{values.map(renderTask)}</section>

  const cancelHold = () => {
    setHolding(false)
    if (holdTimer.current !== null) window.clearTimeout(holdTimer.current)
    holdTimer.current = null
  }
  const beginHold = () => {
    if (completed.length === 0) return
    setHolding(true)
    holdTimer.current = window.setTimeout(() => { void clearCompleted(); setHolding(false) }, 850)
  }

  return <>
    <AnimatePresence initial={false}>
      {composerOpen && <motion.form className="record-composer todo-composer" onSubmit={(e) => { e.preventDefault(); void submit() }} initial={reduced ? false : { opacity: 0, height: 0, y: -7 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0 }} transition={reduced ? INSTANT : { duration: .24, ease: ARRIVE_EASE }}>
        <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape') setComposerOpen(false) }} placeholder={t('records.todoPlaceholder')} />
        <button type="submit" disabled={!draft.trim()}>{t('records.add')}</button>
      </motion.form>}
    </AnimatePresence>
    <div className="records-list">
      {filtered.length === 0 ? <RecordEmpty title={query ? t('records.noSearchResults') : t('records.noTodos')} detail={query ? t('records.tryAnotherSearch') : t('records.noTodosDesc')} /> : <>
        {group(t('records.overdue'), overdue)}
        {group(t('records.today'), today)}
        {group(t('records.upcoming'), later)}
        {group(t('records.noDate'), noDate)}
        {completed.length > 0 && <section>
          <button className={`record-section-heading${completedOpen ? ' open' : ''}`} onClick={() => setCompletedOpen(!completedOpen)}><span>{t('records.completedItems')}</span><b>{completed.length}</b><Chevron /></button>
          <div className={`record-collapsible${completedOpen ? ' open' : ''}`}><div>{completed.map(renderTask)}</div></div>
        </section>}
      </>}
    </div>
    <footer className="records-footer"><span><b>{pending.length}</b> {t('records.pendingCount')}</span><button className={`hold-clear${holding ? ' holding' : ''}`} onPointerDown={beginHold} onPointerUp={cancelHold} onPointerLeave={cancelHold} onPointerCancel={cancelHold} disabled={completed.length === 0}>{holding ? t('records.keepHolding') : t('records.holdToClear')}</button></footer>
  </>
}

function TodoDetails({ todo, onSave, onDelete, reduced }: { todo: TodoRecordDto; onSave: (patch: { details: string; dueAt: number | null }) => void; onDelete: () => void; reduced: boolean }) {
  const { t } = useTranslation()
  const [details, setDetails] = useState(todo.details)
  const [date, setDate] = useState(todo.dueAt ? new Date(todo.dueAt).toISOString().slice(0, 10) : '')
  return <motion.div className="todo-details" initial={reduced ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={reduced ? INSTANT : { duration: .22, ease: ARRIVE_EASE }}>
    <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder={t('records.detailsPlaceholder')} />
    <div><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /><button className="danger" onClick={onDelete}>{t('records.delete')}</button><button onClick={() => onSave({ details, dueAt: date ? new Date(`${date}T23:59:59`).getTime() : null })}>{t('records.save')}</button></div>
  </motion.div>
}

function formatDue(time: number): string { return new Date(time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }
function Chevron() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg> }
