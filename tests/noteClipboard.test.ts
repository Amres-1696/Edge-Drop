import { describe, expect, it } from 'vitest'
import { formatNoteClipboardText } from '../shared/noteClipboard'

describe('formatNoteClipboardText', () => {
  it('copies a title and body with a readable separator', () => {
    expect(formatNoteClipboardText({ title: '会议记录', body: '确认发货时间' }))
      .toBe('会议记录\n\n确认发货时间')
  })

  it('copies a title-only note without extra blank lines', () => {
    expect(formatNoteClipboardText({ title: '临时号码', body: '' })).toBe('临时号码')
  })

  it('copies a body-only note', () => {
    expect(formatNoteClipboardText({ title: '  ', body: '正文内容' })).toBe('正文内容')
  })

  it('trims accidental outer whitespace', () => {
    expect(formatNoteClipboardText({ title: '  标题 ', body: ' 正文\n ' })).toBe('标题\n\n正文')
  })
})
