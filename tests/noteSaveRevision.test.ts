import { describe, expect, it } from 'vitest'
import { NoteSaveRevision } from '../src/lib/noteSaveRevision'

describe('NoteSaveRevision', () => {
  it('does not let an older save clear a newer edit', () => {
    const guard = new NoteSaveRevision()
    const firstSave = guard.markEdited()
    guard.markEdited()

    expect(guard.markSaved(firstSave)).toBe(false)
    expect(guard.needsSave()).toBe(true)
  })

  it('marks the current revision as saved', () => {
    const guard = new NoteSaveRevision()
    const current = guard.markEdited()

    expect(guard.markSaved(current)).toBe(true)
    expect(guard.needsSave()).toBe(false)
  })

  it('resets when another note is opened', () => {
    const guard = new NoteSaveRevision()
    guard.markEdited()
    guard.reset()

    expect(guard.capture()).toBe(0)
    expect(guard.needsSave()).toBe(false)
  })
})
