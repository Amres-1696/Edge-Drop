import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import type { ClipboardItem } from '../shared/types'
import { createNoteDraft, createTodoDraft, hasClipboardOrigin } from '../electron/store/recordConversion'

const createdDirs: string[] = []

afterEach(() => {
  for (const dir of createdDirs.splice(0)) rmSync(dir, { recursive: true, force: true })
})

function textItem(text: string): ClipboardItem {
  return {
    id: 'clip-text',
    data: { kind: 'text', text, isUrl: false },
    capturedAt: 100,
    hitCount: 1,
    pinned: false
  }
}

describe('record conversion', () => {
  it('uses the first non-empty line as the note title and keeps the full body', () => {
    const item = textItem('\n  产品会议需求  \n保留完整正文')
    const draft = createNoteDraft(item, 200)

    expect(draft.title).toBe('产品会议需求')
    expect(draft.body).toBe('产品会议需求  \n保留完整正文')
    expect(draft.origin).toMatchObject({ kind: 'clipboard', clipboardItemId: 'clip-text' })
  })

  it('caps todo titles without truncating remaining details', () => {
    const first = '一'.repeat(100)
    const draft = createTodoDraft(textItem(`${first}\n这里是详情`), 200)

    expect(draft.title).toHaveLength(80)
    expect(draft.details).toBe('这里是详情')
  })

  it('uses the file name and captures file metadata for a single file', () => {
    const dir = join(tmpdir(), `edge-drop-record-convert-${Date.now()}`)
    createdDirs.push(dir)
    mkdirSync(dir, { recursive: true })
    const path = join(dir, '需求清单.txt')
    writeFileSync(path, 'hello')
    const item: ClipboardItem = {
      id: 'clip-file', data: { kind: 'files', paths: [path] }, capturedAt: 1, hitCount: 1, pinned: false
    }

    const draft = createNoteDraft(item, 2, '文件')
    expect(draft.title).toBe('需求清单.txt')
    expect(draft.attachments[0]).toMatchObject({ kind: 'file-reference', name: '需求清单.txt', size: 5, existedAtCreation: true })
  })

  it('keeps every image in an image collection as a source attachment', () => {
    const item: ClipboardItem = {
      id: 'clip-images',
      data: {
        kind: 'image-collection',
        images: [
          { imageId: 'a', width: 10, height: 20, bytes: 30 },
          { imageId: 'b', width: 40, height: 50, bytes: 60, ext: 'jpg' }
        ]
      },
      capturedAt: 1,
      hitCount: 1,
      pinned: false
    }

    const draft = createTodoDraft(item, 2, '处理 2 张图片')
    expect(draft.title).toBe('处理 2 张图片')
    expect(draft.attachments).toHaveLength(2)
  })

  it('detects an existing record created from the same clipboard item', () => {
    const note = { ...createNoteDraft(textItem('内容'), 2), id: 'note-1', attachments: [] }
    expect(hasClipboardOrigin([note], 'clip-text')).toBe(true)
    expect(hasClipboardOrigin([note], 'another')).toBe(false)
  })
})
