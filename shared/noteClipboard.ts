import type { NoteRecordDto } from './types'

/** Build the clean plain-text representation placed on the system clipboard. */
export function formatNoteClipboardText(
  note: Pick<NoteRecordDto, 'title' | 'body'>
): string {
  const title = note.title.trim()
  const body = note.body.trim()
  if (!title) return body
  if (!body) return title
  return `${title}\n\n${body}`
}
