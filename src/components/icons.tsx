/**
 * Official Lucide React Icon Suite for Edge-Drop.
 * Powered by lucide-react — ultra-crisp 24x24 vector icons.
 */
import type { SVGProps, JSX } from 'react'
import {
  Info,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Search,
  Pin,
  Trash2,
  Copy,
  Settings as SettingsGear,
  GripVertical,
  File,
  Image as ImageGraphic,
  Link,
  X,
  Minus,
  ArrowDownToLine,
  Layers,
  Maximize2,
  Minimize2,
  FolderOpen,
  Check,
  FileText,
  FileCode,
  FileArchive,
  FileSpreadsheet,
  Music,
  Video,
  Presentation,
  LogOut
} from 'lucide-react'
import { getFileKindByExt } from '../lib/fileType'

type P = SVGProps<SVGSVGElement>

export const LogOutIcon = (p: P) => <LogOut size={p.width ?? 16} {...(p as any)} />
export const InfoIcon = (p: P) => <Info size={p.width ?? 16} strokeWidth={2} {...(p as any)} />
export const SparklesIcon = (p: P) => <Sparkles size={p.width ?? 16} {...(p as any)} />
export const WhatsNewIcon = InfoIcon
export const ChevronLeftIcon = (p: P) => <ChevronLeft size={p.width ?? 16} {...(p as any)} />
export const ChevronRightIcon = (p: P) => <ChevronRight size={p.width ?? 16} {...(p as any)} />
export const ChevronUpIcon = (p: P) => <ChevronUp size={p.width ?? 16} {...(p as any)} />
export const ChevronDownIcon = (p: P) => <ChevronDown size={p.width ?? 16} {...(p as any)} />
export const ExternalLinkIcon = (p: P) => <ExternalLink size={p.width ?? 16} {...(p as any)} />
export const SearchIcon = (p: P) => <Search size={p.width ?? 16} {...(p as any)} />
export const PinIcon = (p: P) => <Pin size={p.width ?? 16} {...(p as any)} />
export const PinFillIcon = (p: P) => <Pin size={p.width ?? 16} fill="currentColor" {...(p as any)} />
export const TrashIcon = (p: P) => <Trash2 size={p.width ?? 16} {...(p as any)} />
export const CopyIcon = (p: P) => <Copy size={p.width ?? 16} {...(p as any)} />
export const GearIcon = (p: P) => <SettingsGear size={p.width ?? 16} {...(p as any)} />
export const GripIcon = (p: P) => <GripVertical size={p.width ?? 16} {...(p as any)} />
export const FileIcon = (p: P) => <File size={p.width ?? 16} {...(p as any)} />
export const ImageIcon = (p: P) => <ImageGraphic size={p.width ?? 16} {...(p as any)} />
export const LinkIcon = (p: P) => <Link size={p.width ?? 16} {...(p as any)} />
export const CloseIcon = (p: P) => <X size={p.width ?? 16} {...(p as any)} />
export const MinusIcon = (p: P) => <Minus size={p.width ?? 16} {...(p as any)} />
export const DropIcon = (p: P) => <ArrowDownToLine size={p.width ?? 16} {...(p as any)} />
export const BundleIcon = (p: P) => <Layers size={p.width ?? 16} {...(p as any)} />
export const ExpandIcon = (p: P) => <Maximize2 size={p.width ?? 16} {...(p as any)} />
export const ContractIcon = (p: P) => <Minimize2 size={p.width ?? 16} {...(p as any)} />
export const FolderOpenIcon = (p: P) => <FolderOpen size={p.width ?? 16} {...(p as any)} />
export const CheckIcon = (p: P) => <Check size={p.width ?? 16} {...(p as any)} />
export const FileIconGlyph = FileIcon

const PdfGlyph = (p: P) => <FileText size={p.width ?? 16} {...(p as any)} />
const ArchiveGlyph = (p: P) => <FileArchive size={p.width ?? 16} {...(p as any)} />
const CodeGlyph = (p: P) => <FileCode size={p.width ?? 16} {...(p as any)} />
const TextGlyph = (p: P) => <FileText size={p.width ?? 16} {...(p as any)} />
const DocGlyph = TextGlyph
const SheetGlyph = (p: P) => <FileSpreadsheet size={p.width ?? 16} {...(p as any)} />
const SlideGlyph = (p: P) => <Presentation size={p.width ?? 16} {...(p as any)} />
const AudioGlyph = (p: P) => <Music size={p.width ?? 16} {...(p as any)} />
const VideoGlyph = (p: P) => <Video size={p.width ?? 16} {...(p as any)} />
const PhotoGlyph = ImageIcon

const GLYPHS: Record<string, (p: P) => JSX.Element> = {
  pdf: PdfGlyph,
  archive: ArchiveGlyph,
  code: CodeGlyph,
  text: TextGlyph,
  word: DocGlyph,
  excel: SheetGlyph,
  powerpoint: SlideGlyph,
  audio: AudioGlyph,
  video: VideoGlyph,
  image: PhotoGlyph,
  file: FileIconGlyph
}

/**
 * A file icon that picks the right glyph *and* color for the path's extension.
 * Pass `ext` when you already have it (cheaper than re-parsing a full path).
 */
export function FileKindIcon({ ext, path, ...rest }: P & { ext?: string; path?: string }) {
  const info = ext ? getFileKindByExt(ext) : path ? getFileKindByExt(path.split('.').pop() ?? '') : null
  const kind = info?.kind ?? 'file'
  const Glyph = GLYPHS[kind] ?? FileIconGlyph
  return <Glyph {...rest} style={{ color: info?.color ?? 'currentColor', ...(rest.style ?? {}) }} />
}
