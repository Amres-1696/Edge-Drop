import { describe, expect, it } from 'vitest'
import { ITEM_RENDER_BATCH, nextVisibleItemCount } from '../src/lib/visibleItemWindow'

describe('visible item window', () => {
  it('bounds the initial clipboard DOM and grows in fixed batches', () => {
    expect(ITEM_RENDER_BATCH).toBe(48)
    expect(nextVisibleItemCount(ITEM_RENDER_BATCH, 1000)).toBe(96)
    expect(nextVisibleItemCount(960, 1000)).toBe(1000)
    expect(nextVisibleItemCount(1000, 1000)).toBe(1000)
  })
})
