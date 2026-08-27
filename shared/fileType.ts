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
  | 'executable'
  | 'folder'
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
  tif: 'image', tiff: 'image', jfif: 'image', pjpeg: 'image', pjp: 'image',
  exe: 'executable', msi: 'executable', bat: 'executable', cmd: 'executable', ps1: 'executable', apk: 'executable', app: 'executable', dll: 'executable'
}

const KIND_INFO: Record<FileKind, FileKindInfo> = {
  pdf: { kind: 'pdf', label: 'PDF', color: '#FF7C8E' },
  word: { kind: 'word', label: 'Word', color: '#7BAFF8' },
  excel: { kind: 'excel', label: 'Excel', color: '#52D7A4' },
  powerpoint: { kind: 'powerpoint', label: 'Slides', color: '#FFA25B' },
  archive: { kind: 'archive', label: 'Archive', color: '#FBBF24' },
  text: { kind: 'text', label: 'Text', color: '#8CA77B' },
  code: { kind: 'code', label: 'Code', color: '#53CAF7' },
  audio: { kind: 'audio', label: 'Audio', color: '#C495FD' },
  video: { kind: 'video', label: 'Video', color: '#64748B' },
  image: { kind: 'image', label: 'Image', color: '#BA9B7B' },
  executable: { kind: 'executable', label: 'App', color: '#93A4FC' },
  folder: { kind: 'folder', label: 'Folder', color: '#FBBF24' },
  file: { kind: 'file', label: 'File', color: '#B0C0D0' }
}

export function extOf(path: string): string {
  const dot = path.lastIndexOf('.')
  return dot < 0 ? '' : path.slice(dot + 1).toLowerCase()
}

export function getFileKind(path: string, isDirectory = false): FileKindInfo {
  return getFileKindByExt(extOf(path), isDirectory)
}

export function getFileKindByExt(ext: string, isDirectory = false): FileKindInfo {
  if (isDirectory || ext.toLowerCase() === 'folder') return KIND_INFO.folder
  return KIND_INFO[EXT_MAP[ext.toLowerCase()] ?? 'file']
}

export function getFileKindInfo(kind: FileKind): FileKindInfo {
  return KIND_INFO[kind]
}
