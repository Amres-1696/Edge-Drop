import { t } from '../i18n'
import {
  extOf,
  getFileKind as getSharedFileKind,
  getFileKindByExt as getSharedFileKindByExt,
  getFileKindInfo as getSharedFileKindInfo,
  type FileKind,
  type FileKindInfo
} from '../../shared/fileType'

export { extOf, type FileKind, type FileKindInfo }

const LABEL_KEYS: Record<FileKind, Parameters<typeof t>[0]> = {
  pdf: 'fileKinds.pdf',
  word: 'fileKinds.word',
  excel: 'fileKinds.excel',
  powerpoint: 'fileKinds.powerpoint',
  archive: 'fileKinds.archive',
  text: 'fileKinds.text',
  code: 'fileKinds.code',
  audio: 'fileKinds.audio',
  video: 'fileKinds.video',
  image: 'fileKinds.image',
  executable: 'fileKinds.file',
  folder: 'fileKinds.folder',
  file: 'fileKinds.file'
}

function localize(info: FileKindInfo): FileKindInfo {
  return { ...info, label: t(LABEL_KEYS[info.kind]) || info.label }
}

export function getFileKind(path: string, isDirectory = false): FileKindInfo {
  return localize(getSharedFileKind(path, isDirectory))
}

export function getFileKindByExt(ext: string, isDirectory = false): FileKindInfo {
  return localize(getSharedFileKindByExt(ext, isDirectory))
}

export function getFileKindInfo(kind: FileKind): FileKindInfo {
  return localize(getSharedFileKindInfo(kind))
}
