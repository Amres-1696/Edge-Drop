import { basename, extname } from 'node:path'
import { existsSync, statSync } from 'node:fs'
import type {
  ClipboardItem,
  ItemKind,
  NoteRecord,
  RecordOrigin,
  TodoRecord
} from '../../shared/types'

const NOTE_TITLE_LIMIT = 60
const TODO_TITLE_LIMIT = 80

export type RecordDraftAttachment =
  | {
      kind: 'image-source'
      imageId: string
      width: number
      height: number
      bytes: number
      ext?: string
    }
  | {
      kind: 'file-reference'
      path: string
      name: string
      ext: string
      size: number
      existedAtCreation: boolean
    }

export interface NoteDraft extends Omit<NoteRecord, 'id' | 'attachments'> {
  attachments: RecordDraftAttachment[]
}

export interface TodoDraft extends Omit<TodoRecord, 'id' | 'attachments'> {
  attachments: RecordDraftAttachment[]
}

function firstNonEmptyLine(value: string): string {
  return value.split(/\r?\n/).map((line) => line.trim()).find(Boolean) ?? ''
}

function cropTitle(value: string, max: number): string {
  const normalized = value.replace(/\s+/g, ' ').trim()
  return normalized.length > max ? normalized.slice(0, max).trimEnd() : normalized
}

function originFor(item: ClipboardItem): RecordOrigin {
  return {
    kind: 'clipboard',
    clipboardItemId: item.id,
    clipboardKind: item.data.kind as ItemKind,
    capturedAt: item.capturedAt
  }
}

function fileAttachment(path: string): RecordDraftAttachment {
  const exists = existsSync(path)
  let size = 0
  if (exists) {
    try { size = statSync(path).size } catch { /* keep metadata usable */ }
  }
  return {
    kind: 'file-reference',
    path,
    name: basename(path),
    ext: extname(path).replace(/^\./, '').toLowerCase(),
    size,
    existedAtCreation: exists
  }
}

function attachmentsFor(item: ClipboardItem): RecordDraftAttachment[] {
  switch (item.data.kind) {
    case 'image':
      return [{
        kind: 'image-source',
        imageId: item.data.imageId,
        width: item.data.width,
        height: item.data.height,
        bytes: item.data.bytes,
        ext: item.data.ext
      }]
    case 'image-collection':
      return item.data.images.map((image) => ({ kind: 'image-source', ...image }))
    case 'files':
      return item.data.paths.map(fileAttachment)
    case 'text':
      return []
  }
}

function sourceText(item: ClipboardItem): string {
  return item.data.kind === 'text' ? item.data.text.trim() : ''
}

function inferredTitle(item: ClipboardItem, suggestedTitle?: string): string {
  const text = sourceText(item)
  if (text) return firstNonEmptyLine(text)
  if (item.data.kind === 'files' && item.data.paths.length === 1) return basename(item.data.paths[0])
  return suggestedTitle?.trim() || '未命名'
}

export function createNoteDraft(item: ClipboardItem, now: number, suggestedTitle?: string): NoteDraft {
  const text = sourceText(item)
  return {
    title: cropTitle(inferredTitle(item, suggestedTitle), NOTE_TITLE_LIMIT),
    body: text,
    attachments: attachmentsFor(item),
    pinned: false,
    createdAt: now,
    updatedAt: now,
    origin: originFor(item)
  }
}

export function createTodoDraft(item: ClipboardItem, now: number, suggestedTitle?: string): TodoDraft {
  const text = sourceText(item)
  const firstLine = firstNonEmptyLine(text)
  const remaining = text && firstLine
    ? text.slice(text.indexOf(firstLine) + firstLine.length).trim()
    : ''
  return {
    title: cropTitle(inferredTitle(item, suggestedTitle), TODO_TITLE_LIMIT),
    details: remaining,
    attachments: attachmentsFor(item),
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    origin: originFor(item)
  }
}

export function hasClipboardOrigin(
  records: Array<Pick<NoteRecord | TodoRecord, 'origin'>>,
  itemId: string
): boolean {
  return records.some((record) =>
    record.origin.kind === 'clipboard' && record.origin.clipboardItemId === itemId
  )
}
