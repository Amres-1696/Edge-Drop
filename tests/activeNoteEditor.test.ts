import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushActiveNoteEditor, registerActiveNoteEditor } from '../src/lib/activeNoteEditor'

let cleanup: (() => void) | undefined

afterEach(() => {
  cleanup?.()
  cleanup = undefined
})

describe('active note editor navigation guard', () => {
  it('flushes the active editor before navigation', async () => {
    const flush = vi.fn().mockResolvedValue(true)
    cleanup = registerActiveNoteEditor(flush)

    await expect(flushActiveNoteEditor()).resolves.toBe(true)
    expect(flush).toHaveBeenCalledOnce()
  })

  it('allows navigation when no editor is open', async () => {
    await expect(flushActiveNoteEditor()).resolves.toBe(true)
  })

  it('does not let an older cleanup unregister a newer editor', async () => {
    const firstCleanup = registerActiveNoteEditor(async () => false)
    const second = vi.fn().mockResolvedValue(true)
    cleanup = registerActiveNoteEditor(second)
    firstCleanup()

    await expect(flushActiveNoteEditor()).resolves.toBe(true)
    expect(second).toHaveBeenCalledOnce()
  })
})
