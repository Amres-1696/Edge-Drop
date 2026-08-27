/**
 * Type definition for the preload bridge API surface.
 *
 * Both the preload (implements) and renderer (consumes) import this so the
 * contract lives in one place. The actual implementation lives in the preload;
 * the renderer only ever sees `window.edge` typed as this interface.
 */
import type {
  ConvertClipboardInput,
  ConvertClipboardResult,
  CreateNoteInput,
  CreateTodoInput,
  RecordsSnapshot,
  RecordTarget,
  Settings,
  UpdateNoteInput,
  UpdateTodoInput
} from './types'
import type { DragRequest } from './types'

export interface EdgeApi {
  /* Renderer -> Main */
  loadState: () => Promise<{ items: import('./types').ClipboardItemDto[]; settings: Settings; version: string; isStoreBuild?: boolean }>
  loadRecords: () => Promise<RecordsSnapshot>
  convertClipboardToRecord: (input: ConvertClipboardInput) => Promise<ConvertClipboardResult>
  createNote: (input: CreateNoteInput) => Promise<RecordsSnapshot>
  updateNote: (id: string, patch: UpdateNoteInput) => Promise<RecordsSnapshot>
  setNotePinned: (id: string, pinned: boolean) => Promise<RecordsSnapshot>
  copyNote: (id: string) => Promise<boolean>
  saveNoteDraft: (id: string, patch: UpdateNoteInput) => void
  createTodo: (input: CreateTodoInput) => Promise<RecordsSnapshot>
  updateTodo: (id: string, patch: UpdateTodoInput) => Promise<RecordsSnapshot>
  setTodoCompleted: (id: string, completed: boolean) => Promise<RecordsSnapshot>
  deleteRecord: (target: RecordTarget, id: string) => Promise<RecordsSnapshot>
  restoreRecord: (id: string) => Promise<RecordsSnapshot>
  clearCompletedTodos: () => Promise<{ snapshot: RecordsSnapshot; deletedIds: string[] }>
  setPinned: (id: string, pinned: boolean) => Promise<import('./types').ClipboardItemDto[]>
  deleteItem: (id: string) => Promise<import('./types').ClipboardItemDto[]>
  deleteBatchItems: (ids: string[]) => Promise<import('./types').ClipboardItemDto[]>
  clearItems: () => Promise<import('./types').ClipboardItemDto[]>
  getFullText: (id: string) => Promise<string>
  removeSubitem: (req: DragRequest) => Promise<boolean>
  copyItem: (id: string) => Promise<boolean>
  copySubitem: (req: DragRequest) => Promise<boolean>
  pasteItem: (id: string) => Promise<boolean>
  pasteSubitem: (req: DragRequest) => Promise<boolean>
  installUpdate: () => Promise<void>
  checkForUpdatesManual: () => Promise<{ status: string; version?: string; error?: string }>
  startUpdateDownload: () => Promise<void>
  quitApp: () => Promise<void>
  /**
   * Begin a native OS drag-out. Fire-and-forget: must be called synchronously
   * from the DOM `dragstart` event, and main calls `event.sender.startDrag`.
   */
  startDrag: (req: DragRequest) => void
  prestageDrag: (req: DragRequest) => void
  addFiles: (paths: string[]) => Promise<import('./types').ClipboardItemDto[]>
  mergeItems: (sourceId: string, targetId: string) => Promise<import('./types').MergeResult>
  splitItem: (req: import('./types').DragRequest) => Promise<boolean>
  updateSettings: (patch: Partial<Settings>) => Promise<Settings>
  setInteractive: (value: boolean) => Promise<void>
  setTextInputActive: (active: boolean) => Promise<void>
  setPreviewMode: (active: boolean) => Promise<void>
  pauseHotkey: (paused: boolean) => Promise<void>
  revealFile: (path: string) => Promise<boolean>
  minimizeWindow: () => Promise<void>
  focusWindow: (focusable?: boolean) => Promise<void>
  getDisplays: () => Promise<import('./types').DisplayInfo[]>
  getReleases: () => Promise<Array<{
    version: string
    date: string
    isLatest: boolean
    summary: string
    highlights: Array<{ title: string; description: string }>
  }>>
  setInternalDrag: (active: boolean) => void
  broadcastTutorialStep: (step: number) => void

  /* Main -> Renderer */
  onItems: (cb: (items: import('./types').ClipboardItemDto[]) => void) => () => void
  onSettings: (cb: (settings: Settings) => void) => () => void
  onRecords: (cb: (snapshot: RecordsSnapshot) => void) => () => void
  onToggle: (cb: (open?: boolean) => void) => () => void
  onOpenSettings: (cb: () => void) => () => void
  onDragEnd: (cb: () => void) => () => void
  onInternalDrop: (cb: (pos: { x: number; y: number }) => void) => () => void
  onCursorEdge: (cb: (data: {
    x: number
    y: number
    inEdge: boolean
    inZone: boolean
    stickPosition: import('./types').StickPosition
    displayWidth: number
    displayHeight: number
  }) => void) => () => void
  onToast: (cb: (toast: { id: string; message: string; tone: 'info' | 'error' }) => void) => () => void
  onTutorialStep: (cb: (step: number) => void) => () => void
  onUpdateAvailable: (cb: (info: { version: string }) => void) => () => void
  onUpdateDownloaded: (cb: (info: { version: string }) => void) => () => void
}
