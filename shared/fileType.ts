/** Dependency-free file metadata shared by the Electron main and renderer processes. */
export type FileKind =
  | 'pdf'
  | 'word'
  | 'excel'
  | 'powerpoint'
  | 'archive'
  | 'text'
  | 'code'
  | 'audio'
  | 'video'
  | 'image'
  | 'file'

export interface FileKindInfo {
  kind: FileKind
  label: string
  color: string
}

const EXT_MAP: Record<string, FileKind> = {
  pdf: 'pdf',
  doc: 'word', docx: 'word', docm: 'word', odt: 'word', rtf: 'word', pages: 'word',
  xls: 'excel', xlsx: 'excel', xlsm: 'excel', csv: 'excel', ods: 'excel', numbers: 'excel',
  ppt: 'powerpoint', pptx: 'powerpoint', pptm: 'powerpoint', odp: 'powerpoint', key: 'powerpoint',
  zip: 'archive', rar: 'archive', '7z': 'archive', tar: 'archive', gz: 'archive', bz2: 'archive', xz: 'archive', iso: 'archive', dmg: 'archive',
  txt: 'text', md: 'text', markdown: 'text', log: 'text', rtf2: 'text',
  js: 'code', ts: 'code', jsx: 'code', tsx: 'code', json: 'code', html: 'code', css: 'code', scss: 'code',
  py: 'code', java: 'code', c: 'code', cpp: 'code', cs: 'code', go: 'code', rs: 'code', rb: 'code',
  php: 'code', sh: 'code', yml: 'code', yaml: 'code', xml: 'code', sql: 'code', vue: 'code', svelte: 'code',
  mp3: 'audio', wav: 'audio', flac: 'audio', aac: 'audio', ogg: 'audio', m4a: 'audio', wma: 'audio',
  mp4: 'video', mkv: 'video', avi: 'video', mov: 'video', wmv: 'video', flv: 'video', webm: 'video', m4v: 'video',
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image', bmp: 'image', svg: 'image', avif: 'image', ico: 'image',
  tif: 'image', tiff: 'image', jfif: 'image', pjpeg: 'image', pjp: 'image'
}

const KIND_INFO: Record<FileKind, FileKindInfo> = {
  pdf: { kind: 'pdf', label: 'PDF', color: '#E53935' },
  word: { kind: 'word', label: 'Word', color: '#2B579A' },
  excel: { kind: 'excel', label: 'Excel', color: '#217346' },
  powerpoint: { kind: 'powerpoint', label: 'Slides', color: '#D24726' },
  archive: { kind: 'archive', label: 'Archive', color: '#B0621A' },
  text: { kind: 'text', label: 'Text', color: '#9AA0A6' },
  code: { kind: 'code', label: 'Code', color: '#26A69A' },
  audio: { kind: 'audio', label: 'Audio', color: '#8E44AD' },
  video: { kind: 'video', label: 'Video', color: '#8E44AD' },
  image: { kind: 'image', label: 'Image', color: '#E91E63' },
  file: { kind: 'file', label: 'File', color: '#9AA0A6' }
}

export function extOf(path: string): string {
  const dot = path.lastIndexOf('.')
  return dot < 0 ? '' : path.slice(dot + 1).toLowerCase()
}

export function getFileKind(path: string): FileKindInfo {
  return getFileKindByExt(extOf(path))
}

export function getFileKindByExt(ext: string): FileKindInfo {
  return KIND_INFO[EXT_MAP[ext.toLowerCase()] ?? 'file']
}
