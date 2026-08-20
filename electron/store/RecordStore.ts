import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { safeStorage } from 'electron'
import type {
  ClipboardItem,
  CreateNoteInput,
  CreateTodoInput,
  NoteRecord,
  NoteRecordDto,
  RecordAttachment,
  RecordAttachmentDto,
  RecordsSnapshot,
  RecordTarget,
  TodoRecord,
  TodoRecordDto,
  UpdateNoteInput,
  UpdateTodoInput
} from '../../shared/types'
import { createId } from './ids'
import { PATHS } from './paths'
import { createNoteDraft, createTodoDraft, type RecordDraftAttachment } from './recordConversion'
import { thumbnailUrlForFile } from '../main/imageProtocol'

const SCHEMA_VERSION = 1
const UNDO_WINDOW_MS = 5_000
const MAX_TITLE = 200
const MAX_BODY = 1_000_000

interface PersistedRecords {
  schemaVersion: 1
  notes: NoteRecord[]
  todos: TodoRecord[]
}

interface CryptoAdapter {
  isAvailable(): boolean
  encrypt(value: string): Buffer
  decrypt(value: Buffer): string
}

interface RecordStoreOptions {
  recordsFile?: () => string
  assetsDir?: () => string
  resolveClipboardImage?: (imageId: string, ext?: string) => string
  idFactory?: () => string
  now?: () => number
  crypto?: CryptoAdapter
  undoWindowMs?: number
}

interface Tombstone {
  type: RecordTarget
  record: NoteRecord | TodoRecord
  expiresAt: number
  timer?: ReturnType<typeof setTimeout>
}

const electronCrypto: CryptoAdapter = {
  isAvailable: () => safeStorage.isEncryptionAvailable(),
  encrypt: (value) => safeStorage.encryptString(value),
  decrypt: (value) => safeStorage.decryptString(value)
}

function cleanTitle(value: string): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, MAX_TITLE)
}

function cleanBody(value: string): string {
  return value.slice(0, MAX_BODY)
}

export class RecordStore {
  private notes: NoteRecord[] = []
  private todos: TodoRecord[] = []
  private tombstones = new Map<string, Tombstone>()
  private recordsFile: () => string
  private assetsDir: () => string
  private resolveClipboardImage: (imageId: string, ext?: string) => string
  private idFactory: () => string
  private now: () => number
  private crypto: CryptoAdapter
  private undoWindowMs: number
  /** Prevents an unreadable encrypted database from being replaced by an empty one. */
  private readOnly = false

  constructor(options: RecordStoreOptions = {}) {
    this.recordsFile = options.recordsFile ?? PATHS.recordsFile
    this.assetsDir = options.assetsDir ?? PATHS.recordAssetsDir
    this.resolveClipboardImage = options.resolveClipboardImage ?? ((id, ext) => {
      const cleanExt = (ext ?? 'png').replace(/^\./, '')
      return join(PATHS.imagesDir(), `${id}.${cleanExt}`)
    })
    this.idFactory = options.idFactory ?? createId
    this.now = options.now ?? Date.now
    this.crypto = options.crypto ?? electronCrypto
    this.undoWindowMs = options.undoWindowMs ?? UNDO_WINDOW_MS
  }

  load(): void {
    this.readOnly = false
    mkdirSync(this.assetsDir(), { recursive: true })
    const file = this.recordsFile()
    if (!existsSync(file)) {
      this.notes = []
      this.todos = []
      return
    }

    try {
      const raw = readFileSync(file)
      const envelope = JSON.parse(raw.toString('utf8')) as any
      let parsed: PersistedRecords
      if (envelope?.encrypted === true && typeof envelope.payload === 'string') {
        if (!this.crypto.isAvailable()) throw new Error('Record encryption is unavailable')
        parsed = JSON.parse(this.crypto.decrypt(Buffer.from(envelope.payload, 'base64')))
      } else {
        parsed = envelope
      }
      if (parsed?.schemaVersion !== SCHEMA_VERSION || !Array.isArray(parsed.notes) || !Array.isArray(parsed.todos)) {
        throw new Error('Unsupported records schema')
      }
      this.notes = parsed.notes.filter((note) => note && typeof note.id === 'string')
      this.todos = parsed.todos.filter((todo) => todo && typeof todo.id === 'string')
      this.cleanupOrphanAssets()
    } catch (error) {
      console.error('[RecordStore] Failed to load records:', error)
      try { writeFileSync(`${file}.corrupted.${this.now()}`, readFileSync(file)) } catch { /* preserve best effort */ }
      this.notes = []
      this.todos = []
      this.readOnly = true
    }
  }

  snapshot(): RecordsSnapshot {
    return {
      notes: this.notes.map((note) => this.noteDto(note)),
      todos: this.todos.map((todo) => this.todoDto(todo))
    }
  }

  getNote(id: string): NoteRecord | undefined { return this.notes.find((note) => note.id === id) }
  getTodo(id: string): TodoRecord | undefined { return this.todos.find((todo) => todo.id === id) }

  createNote(input: CreateNoteInput): NoteRecordDto {
    this.assertWritable()
    const now = this.now()
    const note: NoteRecord = {
      id: this.idFactory(),
      title: cleanTitle(input.title) || '未命名笔记',
      body: cleanBody(input.body ?? ''),
      attachments: [],
      pinned: false,
      createdAt: now,
      updatedAt: now,
      origin: { kind: 'manual' }
    }
    this.notes.unshift(note)
    this.persist()
    return this.noteDto(note)
  }

  createTodo(input: CreateTodoInput): TodoRecordDto {
    this.assertWritable()
    const now = this.now()
    const todo: TodoRecord = {
      id: this.idFactory(),
      title: cleanTitle(input.title) || '未命名待办',
      details: cleanBody(input.details ?? ''),
      attachments: [],
      status: 'pending',
      dueAt: input.dueAt,
      createdAt: now,
      updatedAt: now,
      origin: { kind: 'manual' }
    }
    this.todos.unshift(todo)
    this.persist()
    return this.todoDto(todo)
  }

  updateNote(id: string, patch: UpdateNoteInput): NoteRecordDto | null {
    this.assertWritable()
    const note = this.getNote(id)
    if (!note) return null
    if (patch.title !== undefined) note.title = cleanTitle(patch.title) || note.title
    if (patch.body !== undefined) note.body = cleanBody(patch.body)
    note.updatedAt = this.now()
    this.sortNotes()
    this.persist()
    return this.noteDto(note)
  }

  setNotePinned(id: string, pinned: boolean): NoteRecordDto | null {
    this.assertWritable()
    const note = this.getNote(id)
    if (!note) return null
    note.pinned = pinned
    note.updatedAt = this.now()
    this.sortNotes()
    this.persist()
    return this.noteDto(note)
  }

  updateTodo(id: string, patch: UpdateTodoInput): TodoRecordDto | null {
    this.assertWritable()
    const todo = this.getTodo(id)
    if (!todo) return null
    if (patch.title !== undefined) todo.title = cleanTitle(patch.title) || todo.title
    if (patch.details !== undefined) todo.details = cleanBody(patch.details)
    if (patch.dueAt !== undefined) todo.dueAt = patch.dueAt === null ? undefined : patch.dueAt
    todo.updatedAt = this.now()
    this.persist()
    return this.todoDto(todo)
  }

  setTodoCompleted(id: string, completed: boolean): TodoRecordDto | null {
    this.assertWritable()
    const todo = this.getTodo(id)
    if (!todo) return null
    const now = this.now()
    todo.status = completed ? 'completed' : 'pending'
    todo.completedAt = completed ? now : undefined
    todo.updatedAt = now
    this.sortTodos()
    this.persist()
    return this.todoDto(todo)
  }

  convert(item: ClipboardItem, target: RecordTarget, suggestedTitle?: string): NoteRecordDto | TodoRecordDto {
    this.assertWritable()
    const existing = target === 'note'
      ? this.notes.find((note) => note.origin.clipboardItemId === item.id)
      : this.todos.find((todo) => todo.origin.clipboardItemId === item.id)
    if (existing) return target === 'note' ? this.noteDto(existing as NoteRecord) : this.todoDto(existing as TodoRecord)

    const now = this.now()
    if (target === 'note') {
      const draft = createNoteDraft(item, now, suggestedTitle)
      const note: NoteRecord = { ...draft, id: this.idFactory(), attachments: this.materializeAttachments(draft.attachments) }
      this.notes.unshift(note)
      this.sortNotes()
      this.persist()
      return this.noteDto(note)
    }

    const draft = createTodoDraft(item, now, suggestedTitle)
    const todo: TodoRecord = { ...draft, id: this.idFactory(), attachments: this.materializeAttachments(draft.attachments) }
    this.todos.unshift(todo)
    this.sortTodos()
    this.persist()
    return this.todoDto(todo)
  }

  delete(type: RecordTarget, id: string): boolean {
    this.assertWritable()
    const list = type === 'note' ? this.notes : this.todos
    const index = list.findIndex((record) => record.id === id)
    if (index < 0) return false
    const [record] = list.splice(index, 1) as [NoteRecord | TodoRecord]
    const expiresAt = this.now() + this.undoWindowMs
    const tombstone: Tombstone = { type, record, expiresAt }
    tombstone.timer = setTimeout(() => this.finalizeDelete(id), this.undoWindowMs)
    tombstone.timer.unref?.()
    this.tombstones.set(id, tombstone)
    this.persist()
    return true
  }

  restore(id: string): boolean {
    this.assertWritable()
    const tombstone = this.tombstones.get(id)
    if (!tombstone || tombstone.expiresAt < this.now()) return false
    if (tombstone.timer) clearTimeout(tombstone.timer)
    if (tombstone.type === 'note') this.notes.unshift(tombstone.record as NoteRecord)
    else this.todos.unshift(tombstone.record as TodoRecord)
    this.tombstones.delete(id)
    this.sortNotes()
    this.sortTodos()
    this.persist()
    return true
  }

  clearCompleted(): string[] {
    this.assertWritable()
    const completed = this.todos.filter((todo) => todo.status === 'completed')
    if (completed.length === 0) return []
    const ids = completed.map((todo) => todo.id)
    const completedIds = new Set(ids)
    const expiresAt = this.now() + this.undoWindowMs
    this.todos = this.todos.filter((todo) => !completedIds.has(todo.id))
    for (const todo of completed) {
      const tombstone: Tombstone = { type: 'todo', record: todo, expiresAt }
      tombstone.timer = setTimeout(() => this.finalizeDelete(todo.id), this.undoWindowMs)
      tombstone.timer.unref?.()
      this.tombstones.set(todo.id, tombstone)
    }
    this.persist()
    return ids
  }

  private materializeAttachments(drafts: RecordDraftAttachment[]): RecordAttachment[] {
    const createdPaths: string[] = []
    try {
      return drafts.map((draft): RecordAttachment => {
        if (draft.kind === 'file-reference') return draft
        const source = this.resolveClipboardImage(draft.imageId, draft.ext)
        if (!existsSync(source)) throw new Error(`Clipboard image missing: ${draft.imageId}`)
        const ext = (draft.ext || extname(source).slice(1) || 'png').replace(/^\./, '').toLowerCase()
        const assetId = this.idFactory()
        const target = join(this.assetsDir(), `${assetId}.${ext}`)
        mkdirSync(this.assetsDir(), { recursive: true })
        copyFileSync(source, target)
        createdPaths.push(target)
        return { kind: 'image', assetId, width: draft.width, height: draft.height, bytes: statSync(target).size, ext }
      })
    } catch (error) {
      for (const path of createdPaths) rmSync(path, { force: true })
      throw error
    }
  }

  private noteDto(note: NoteRecord): NoteRecordDto {
    return { ...note, attachments: note.attachments.map((attachment) => this.attachmentDto(attachment)) }
  }

  private todoDto(todo: TodoRecord): TodoRecordDto {
    return { ...todo, attachments: todo.attachments.map((attachment) => this.attachmentDto(attachment)) }
  }

  private attachmentDto(attachment: RecordAttachment): RecordAttachmentDto {
    if (attachment.kind === 'file-reference') return { ...attachment, available: existsSync(attachment.path) }
    const path = this.assetPath(attachment)
    if (!existsSync(path)) return { ...attachment }
    // Keep snapshots tiny. Chromium requests a bounded thumbnail lazily through
    // the app's local image protocol instead of duplicating the full asset as
    // base64 in main memory, IPC and renderer state on every record update.
    return { ...attachment, preview: thumbnailUrlForFile(path) }
  }

  private assetPath(attachment: Extract<RecordAttachment, { kind: 'image' }>): string {
    const ext = (attachment.ext ?? 'png').replace(/^\./, '')
    return join(this.assetsDir(), `${attachment.assetId}.${ext}`)
  }

  private finalizeDelete(id: string): void {
    const tombstone = this.tombstones.get(id)
    if (!tombstone) return
    for (const attachment of tombstone.record.attachments) {
      if (attachment.kind === 'image') rmSync(this.assetPath(attachment), { force: true })
    }
    this.tombstones.delete(id)
  }

  private cleanupOrphanAssets(): void {
    const used = new Set<string>()
    for (const record of [...this.notes, ...this.todos]) {
      for (const attachment of record.attachments) {
        if (attachment.kind === 'image') used.add(`${attachment.assetId}.${(attachment.ext ?? 'png').replace(/^\./, '')}`)
      }
    }
    try {
      for (const file of readdirSync(this.assetsDir())) {
        if (!used.has(file)) rmSync(join(this.assetsDir(), file), { force: true })
      }
    } catch { /* directory can be unavailable during startup recovery */ }
  }

  private sortNotes(): void {
    this.notes.sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt)
  }

  private sortTodos(): void {
    this.todos.sort((a, b) => {
      if (a.status !== b.status) return a.status === 'pending' ? -1 : 1
      if (a.status === 'completed') return (b.completedAt ?? 0) - (a.completedAt ?? 0)
      return (a.dueAt ?? Number.MAX_SAFE_INTEGER) - (b.dueAt ?? Number.MAX_SAFE_INTEGER) || b.createdAt - a.createdAt
    })
  }

  private assertWritable(): void {
    if (this.readOnly) {
      throw new Error('Record storage is temporarily read-only because the existing database could not be decrypted')
    }
  }

  private persist(): void {
    this.assertWritable()
    mkdirSync(dirname(this.recordsFile()), { recursive: true })
    mkdirSync(this.assetsDir(), { recursive: true })
    const state: PersistedRecords = { schemaVersion: SCHEMA_VERSION, notes: this.notes, todos: this.todos }
    const json = JSON.stringify(state)
    const output = this.crypto.isAvailable()
      ? JSON.stringify({ v: 1, encrypted: true, payload: this.crypto.encrypt(json).toString('base64') }, null, 2)
      : JSON.stringify(state, null, 2)
    const file = this.recordsFile()
    const temp = `${file}.tmp`
    writeFileSync(temp, output, 'utf8')
    renameSync(temp, file)
  }
}
