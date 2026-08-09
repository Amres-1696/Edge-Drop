import { create } from 'zustand'
import type {
  ConvertClipboardInput,
  ConvertClipboardResult,
  CreateNoteInput,
  CreateTodoInput,
  NoteRecordDto,
  RecordsSnapshot,
  RecordTarget,
  TodoRecordDto,
  UpdateNoteInput,
  UpdateTodoInput
} from '../../shared/types'
import { edge } from '../lib/edge'
import { useStore } from './appStore'

interface RecordState extends RecordsSnapshot {
  hydrated: boolean
  pendingIds: Set<string>
  savingNoteId: string | null
  applySnapshot: (snapshot: RecordsSnapshot) => void
  hydrate: () => Promise<void>
  convertClipboard: (input: ConvertClipboardInput) => Promise<ConvertClipboardResult>
  createNote: (input: CreateNoteInput) => Promise<void>
  updateNote: (id: string, patch: UpdateNoteInput) => Promise<boolean>
  setNotePinned: (id: string, pinned: boolean) => Promise<void>
  createTodo: (input: CreateTodoInput) => Promise<void>
  updateTodo: (id: string, patch: UpdateTodoInput) => Promise<void>
  setTodoCompleted: (id: string, completed: boolean) => Promise<void>
  deleteRecord: (target: RecordTarget, id: string) => Promise<void>
  restoreRecord: (id: string) => Promise<void>
  clearCompletedTodos: () => Promise<string[]>
}

function fail(message: string): void {
  useStore.getState().pushToast({ id: `records-${Date.now()}`, message, tone: 'error' })
}

export const useRecordStore = create<RecordState>((set, get) => ({
  notes: [],
  todos: [],
  hydrated: false,
  pendingIds: new Set(),
  savingNoteId: null,

  applySnapshot: (snapshot) => set({ ...snapshot, hydrated: true }),

  hydrate: async () => {
    try {
      const snapshot = await edge.loadRecords()
      set({ ...snapshot, hydrated: true })
    } catch {
      set({ hydrated: true })
      fail('记录加载失败，请重试')
    }
  },

  convertClipboard: async (input) => {
    const pending = new Set(get().pendingIds)
    pending.add(input.itemId)
    set({ pendingIds: pending })
    try {
      const result = await edge.convertClipboardToRecord(input)
      set({ ...result.snapshot })
      return result
    } catch (error) {
      fail('保存失败，请重试')
      throw error
    } finally {
      const next = new Set(get().pendingIds)
      next.delete(input.itemId)
      set({ pendingIds: next })
    }
  },

  createNote: async (input) => {
    try { set({ ...(await edge.createNote(input)) }) }
    catch { fail('创建备忘失败，请重试') }
  },

  updateNote: async (id, patch) => {
    set({ savingNoteId: id })
    try {
      set({ ...(await edge.updateNote(id, patch)), savingNoteId: null })
      return true
    } catch {
      set({ savingNoteId: null })
      fail('保存失败，内容仍保留在编辑器中')
      return false
    }
  },

  setNotePinned: async (id, pinned) => {
    const previous = get().notes
    set({ notes: previous.map((note) => note.id === id ? { ...note, pinned } : note) })
    try { set({ ...(await edge.setNotePinned(id, pinned)) }) }
    catch { set({ notes: previous }); fail('置顶状态保存失败') }
  },

  createTodo: async (input) => {
    try { set({ ...(await edge.createTodo(input)) }) }
    catch { fail('创建待办失败，请重试') }
  },

  updateTodo: async (id, patch) => {
    try { set({ ...(await edge.updateTodo(id, patch)) }) }
    catch { fail('待办保存失败，请重试') }
  },

  setTodoCompleted: async (id, completed) => {
    const previous = get().todos
    const now = Date.now()
    set({
      todos: previous.map((todo) => todo.id === id
        ? { ...todo, status: completed ? 'completed' : 'pending', completedAt: completed ? now : undefined }
        : todo)
    })
    try { set({ ...(await edge.setTodoCompleted(id, completed)) }) }
    catch { set({ todos: previous }); fail('完成状态保存失败') }
  },

  deleteRecord: async (target, id) => {
    const previousNotes = get().notes
    const previousTodos = get().todos
    set({
      notes: target === 'note' ? previousNotes.filter((note) => note.id !== id) : previousNotes,
      todos: target === 'todo' ? previousTodos.filter((todo) => todo.id !== id) : previousTodos
    })
    try { set({ ...(await edge.deleteRecord(target, id)) }) }
    catch { set({ notes: previousNotes, todos: previousTodos }); fail('删除失败，请重试') }
  },

  restoreRecord: async (id) => {
    try { set({ ...(await edge.restoreRecord(id)) }) }
    catch { fail('撤销失败，记录可能已经永久删除') }
  },

  clearCompletedTodos: async () => {
    try {
      const result = await edge.clearCompletedTodos()
      set({ ...result.snapshot })
      return result.deletedIds
    } catch {
      fail('清理失败，请重试')
      return []
    }
  }
}))

export function findRecordForClipboard(itemId: string, target: RecordTarget): NoteRecordDto | TodoRecordDto | undefined {
  const state = useRecordStore.getState()
  return target === 'note'
    ? state.notes.find((note) => note.origin.clipboardItemId === itemId)
    : state.todos.find((todo) => todo.origin.clipboardItemId === itemId)
}
