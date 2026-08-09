import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ClipboardItem } from '../shared/types'
import { RecordStore } from '../electron/store/RecordStore'

describe('RecordStore', () => {
  let root: string
  let nextId: number
  let now: number

  beforeEach(() => {
    root = join(tmpdir(), `edge-drop-record-store-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    mkdirSync(join(root, 'clipboard-images'), { recursive: true })
    mkdirSync(join(root, 'record-assets'), { recursive: true })
    nextId = 0
    now = 1_000
  })

  afterEach(() => {
    vi.useRealTimers()
    rmSync(root, { recursive: true, force: true })
  })

  function makeStore(undoWindowMs = 5_000) {
    return new RecordStore({
      recordsFile: () => join(root, 'records.json'),
      assetsDir: () => join(root, 'record-assets'),
      resolveClipboardImage: (id, ext = 'png') => join(root, 'clipboard-images', `${id}.${ext}`),
      idFactory: () => `id-${++nextId}`,
      now: () => now,
      undoWindowMs,
      crypto: {
        isAvailable: () => false,
        encrypt: (value) => Buffer.from(value),
        decrypt: (value) => value.toString('utf8')
      }
    })
  }

  it('persists notes and todos independently across a reload', () => {
    const store = makeStore()
    store.load()
    store.createNote({ title: '产品想法', body: '正文' })
    store.createTodo({ title: '完成审核', dueAt: 2_000 })

    const reloaded = makeStore()
    reloaded.load()
    expect(reloaded.snapshot().notes[0]).toMatchObject({ title: '产品想法', body: '正文' })
    expect(reloaded.snapshot().todos[0]).toMatchObject({ title: '完成审核', dueAt: 2_000, status: 'pending' })
  })

  it('copies image bytes into record assets so the clipboard source can disappear', () => {
    const source = join(root, 'clipboard-images', 'clip-img.png')
    writeFileSync(source, Buffer.from([1, 2, 3, 4]))
    const item: ClipboardItem = {
      id: 'clip-1',
      data: { kind: 'image', imageId: 'clip-img', width: 20, height: 10, bytes: 4 },
      capturedAt: 1,
      hitCount: 1,
      pinned: false
    }
    const store = makeStore()
    store.load()
    const note = store.convert(item, 'note', '查看图片')
    rmSync(source)

    const attachment = note.attachments[0]
    expect(attachment.kind).toBe('image')
    if (attachment.kind !== 'image') throw new Error('expected image')
    const asset = join(root, 'record-assets', `${attachment.assetId}.${attachment.ext}`)
    expect(readFileSync(asset)).toEqual(Buffer.from([1, 2, 3, 4]))

    const reloaded = makeStore()
    reloaded.load()
    expect(reloaded.snapshot().notes[0].attachments[0]).toMatchObject({ kind: 'image', width: 20, height: 10 })
  })

  it('does not create duplicate records for the same source and target', () => {
    const item: ClipboardItem = {
      id: 'clip-text', data: { kind: 'text', text: '同一内容', isUrl: false }, capturedAt: 1, hitCount: 1, pinned: false
    }
    const store = makeStore()
    store.load()
    const first = store.convert(item, 'note')
    const second = store.convert(item, 'note')
    store.convert(item, 'todo')

    expect(second.id).toBe(first.id)
    expect(store.snapshot().notes).toHaveLength(1)
    expect(store.snapshot().todos).toHaveLength(1)
  })

  it('keeps a file reference record when the original file is deleted', () => {
    const path = join(root, '合同.pdf')
    writeFileSync(path, 'pdf')
    const item: ClipboardItem = {
      id: 'clip-file', data: { kind: 'files', paths: [path] }, capturedAt: 1, hitCount: 1, pinned: false
    }
    const store = makeStore()
    store.load()
    const note = store.convert(item, 'note')
    expect(note.attachments[0]).toMatchObject({ kind: 'file-reference', available: true })

    rmSync(path)
    expect(store.snapshot().notes[0].attachments[0]).toMatchObject({ kind: 'file-reference', available: false })
  })

  it('restores a deleted image record inside the undo window and finalizes it afterwards', () => {
    vi.useFakeTimers()
    const source = join(root, 'clipboard-images', 'clip-img.png')
    writeFileSync(source, Buffer.from([9]))
    const item: ClipboardItem = {
      id: 'clip-image', data: { kind: 'image', imageId: 'clip-img', width: 1, height: 1, bytes: 1 }, capturedAt: 1, hitCount: 1, pinned: false
    }
    const store = makeStore(1_000)
    store.load()
    const note = store.convert(item, 'note', '图片')
    const attachment = note.attachments[0]
    if (attachment.kind !== 'image') throw new Error('expected image')
    const asset = join(root, 'record-assets', `${attachment.assetId}.${attachment.ext}`)

    expect(store.delete('note', note.id)).toBe(true)
    expect(existsSync(asset)).toBe(true)
    expect(store.restore(note.id)).toBe(true)
    expect(store.snapshot().notes).toHaveLength(1)

    store.delete('note', note.id)
    vi.advanceTimersByTime(1_001)
    expect(existsSync(asset)).toBe(false)
  })

  it('backs up a corrupted index instead of overwriting it', () => {
    writeFileSync(join(root, 'records.json'), '{broken')
    const store = makeStore()
    store.load()

    expect(store.snapshot()).toEqual({ notes: [], todos: [] })
    const backups = readdirSync(root).filter((name) => name.startsWith('records.json.corrupted.'))
    expect(backups).toHaveLength(1)
    expect(readFileSync(join(root, 'records.json'), 'utf8')).toBe('{broken')
  })
})
