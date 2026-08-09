import { describe, expect, it } from 'vitest'
import { extOf, getFileKind, getFileKindByExt } from '../shared/fileType'

describe('shared file metadata', () => {
  it('classifies paths without importing renderer state', () => {
    expect(getFileKind('C:\\docs\\REPORT.PDF')).toMatchObject({ kind: 'pdf', label: 'PDF' })
    expect(getFileKind('/tmp/archive.tar.gz')).toMatchObject({ kind: 'archive' })
    expect(getFileKind('/tmp/no-extension')).toMatchObject({ kind: 'file' })
  })

  it('normalizes extensions', () => {
    expect(extOf('photo.JPEG')).toBe('jpeg')
    expect(getFileKindByExt('TsX')).toMatchObject({ kind: 'code' })
  })
})
