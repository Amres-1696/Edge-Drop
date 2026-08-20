import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const electronState = vi.hoisted(() => ({ root: '' }))

vi.mock('electron', () => ({
  app: {
    getPath: () => electronState.root,
    getAppPath: () => electronState.root
  },
  safeStorage: {
    isEncryptionAvailable: () => false,
    encryptString: (value: string) => Buffer.from(value),
    decryptString: (value: Buffer) => value.toString('utf8')
  },
  nativeImage: {
    createFromPath: () => ({
      isEmpty: () => true,
      getSize: () => ({ width: 0, height: 0 }),
      resize: () => ({ toDataURL: () => '' }),
      toDataURL: () => ''
    })
  }
}))

import { ItemStore } from '../electron/store/ItemStore'

const LONG_TEXT = `${'同一段长文本'.repeat(80)}\n末尾必须完整保留`

describe('ItemStore disk-backed text', () => {
  beforeEach(() => {
    electronState.root = join(tmpdir(), `edge-drop-item-store-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    for (const dir of ['images', 'payloads', 'record-assets', 'temp']) {
      mkdirSync(join(electronState.root, dir), { recursive: true })
    }
  })

  afterEach(() => {
    rmSync(electronState.root, { recursive: true, force: true })
  })

  it('deduplicates the same large text after a persisted reload', () => {
    const first = new ItemStore()
    first.load()
    expect(first.add({ kind: 'text', text: LONG_TEXT, isUrl: false }, 500)).toBe(true)
    first.persistSync()

    const reloaded = new ItemStore()
    reloaded.load()
    expect(reloaded.add({ kind: 'text', text: LONG_TEXT, isUrl: false }, 500)).toBe(true)

    expect(reloaded.list()).toHaveLength(1)
    expect(reloaded.list()[0].hitCount).toBe(2)
    expect(reloaded.getFullText(reloaded.list()[0].id)).toBe(LONG_TEXT)
  })

  it('removes a disk payload when automatic expiry deletes its item', () => {
    const store = new ItemStore()
    store.load()
    store.add({ kind: 'text', text: LONG_TEXT, isUrl: false }, 500)
    const item = store.list()[0]
    const payload = join(electronState.root, 'payloads', `${item.id}.txt`)
    expect(existsSync(payload)).toBe(true)

    item.capturedAt = Date.now() - 2 * 60 * 60 * 1000
    expect(store.pruneExpired(1)).toBe(true)
    expect(existsSync(payload)).toBe(false)
  })
})
