import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { RecordTarget } from '../../shared/types'
import { useStore } from '../store/appStore'
import { useRecordStore } from '../store/recordStore'
import { useTranslation } from '../i18n'
import { INSTANT, SMALL_SPRING } from '../lib/motion'
import { NotesView } from './records/NotesView'
import { TodosView } from './records/TodosView'
import { NoteEditor } from './records/NoteEditor'

export function RecordsView() {
  const systemReduced = useReducedMotion()
  const reduced = systemReduced || useStore((s) => s.settings.reduceMotion)
  const { t } = useTranslation()
  const recordView = useStore((s) => s.recordView)
  const editingNoteId = useStore((s) => s.editingNoteId)
  const setEditingNoteId = useStore((s) => s.setEditingNoteId)
  const deleteRecord = useRecordStore((s) => s.deleteRecord)
  const restoreRecord = useRecordStore((s) => s.restoreRecord)
  const [undo, setUndo] = useState<{ id: string; label: string } | null>(null)

  useEffect(() => {
    if (!undo) return
    const timer = window.setTimeout(() => setUndo(null), 4_800)
    return () => window.clearTimeout(timer)
  }, [undo])

  const handleDelete = async (target: RecordTarget, id: string) => {
    await deleteRecord(target, id)
    setUndo({ id, label: target === 'note' ? t('records.noteDeleted') : t('records.todoDeleted') })
  }

  return (
    <div className="records-shell">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={recordView}
          className="records-view-slot"
          initial={reduced ? false : { opacity: 0, x: recordView === 'notes' ? -7 : 7 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: recordView === 'notes' ? 7 : -7 }}
          transition={reduced ? INSTANT : SMALL_SPRING}
        >
          {recordView === 'notes'
            ? <NotesView onDelete={(id) => handleDelete('note', id)} />
            : <TodosView onDelete={(id) => handleDelete('todo', id)} />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {undo && (
          <motion.div className="record-undo-toast" initial={reduced ? false : { opacity: 0, y: 10, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6 }} transition={reduced ? INSTANT : SMALL_SPRING}>
            <span>{undo.label}</span>
            <button onClick={() => { void restoreRecord(undo.id); setUndo(null) }}>{t('records.undo')}</button>
          </motion.div>
        )}
      </AnimatePresence>

      <NoteEditor noteId={editingNoteId} onClose={() => setEditingNoteId(null)} />
    </div>
  )
}
